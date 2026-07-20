from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel
from PIL import Image, UnidentifiedImageError
from supabase import create_client, Client
import numpy as np
import io
import os
import uuid

# Import custom database & security modules
from database import get_db
from auth import get_current_user, require_doctor
import models

# Load environment variables
load_dotenv(override=True)

# Setup paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model" / "BNresnet_final_model.keras"

# Supabase Client Setup (for file storage)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase_client: Client = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        print("Supabase client initialized successfully")
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

try:
    import tensorflow as tf
except ModuleNotFoundError:
    tf = None

model = None
CLASS_NAMES = ["normal skin", "psoriasis"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Sequence
    global model
    
    # 1. Automatically create database tables if they do not exist
    try:
        from database import Base, engine
        Base.metadata.create_all(bind=engine)
        print("Database tables verified/created successfully.")
    except Exception as e:
        print(f"Error initializing database tables on startup: {e}")

    # 2. Load the ML Model
    if tf is None:
        print("TensorFlow is not installed. Skipping model load.")
    else:
        try:
            if not MODEL_PATH.exists():
                model_url = os.getenv("MODEL_DOWNLOAD_URL")
                if model_url:
                    print(f"Model file not found at {MODEL_PATH}. Downloading from {model_url}...")
                    import urllib.request
                    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
                    temp_path = MODEL_PATH.with_suffix(".tmp")
                    urllib.request.urlretrieve(model_url, str(temp_path))
                    temp_path.rename(MODEL_PATH)
                    print("Model downloaded successfully!")

            if MODEL_PATH.exists():
                model = tf.keras.models.load_model(str(MODEL_PATH))
                print("TensorFlow model loaded successfully")
            else:
                print(f"Warning: Model file not found at {MODEL_PATH}")
        except Exception as e:
            print(f"Error loading model: {e}")

    yield
    # Shutdown Sequence (cleanup if necessary)
    pass

# Initialize FastAPI App with modern Lifespan Context Manager
app = FastAPI(title="Psoriasis AI API", lifespan=lifespan)

# Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://psoriasisai.netlify.app",
        "https://psoriasisai.netlify.app/",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(image_bytes):
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img = img.convert("RGB")
            img = img.resize((224, 224))
            img_array = np.asarray(img, dtype=np.float32)

            if tf is not None:
                img_array = tf.keras.applications.BNresnet.preprocess_input(img_array)
            else:
                img_array = img_array / 255.0

            return np.expand_dims(img_array, axis=0)
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.") from exc

# Pydantic schemas for request validation
class ReviewSubmissionSchema(BaseModel):
    feedback: str

# ══════════════════════════════════════════════════════════════════════
# API ENDPOINTS
# ══════════════════════════════════════════════════════════════════════

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: models.Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Validates user, uploads skin image to Supabase storage,
    runs the classification model, and records the analysis entry in database.
    """
    if not supabase_client:
        raise HTTPException(
            status_code=500,
            detail="Supabase client is not configured. Verify URL and anon key."
        )

    if model is None:
        raise HTTPException(status_code=503, detail="AI Classification model is not loaded yet")

    try:
        # Validate mime type
        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file must be a valid image."
            )

        # Read file contents and validate size (10MB)
        image_bytes = await file.read()
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File size exceeds the 10 MB limit."
            )
        
        # 1. Preprocess & Predict
        processed = preprocess_image(image_bytes)
        prediction = model.predict(processed, verbose=0)
        score = float(prediction[0][0])

        class_index = 1 if score >= 0.5 else 0
        confidence = score if class_index == 1 else 1 - score

        # 2. Upload to Supabase Storage Bucket ('skin-images')
        file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        file_path = f"{current_user.id}/{uuid.uuid4()}.{file_ext}"

        try:
            # Upload raw image bytes directly to Supabase storage
            supabase_client.storage.from_("skin-images").upload(
                path=file_path,
                file=image_bytes,
                file_options={"content-type": file.content_type or "image/jpeg"}
            )
            # Fetch the public URI
            public_url = supabase_client.storage.from_("skin-images").get_public_url(file_path)
        except Exception as e:
            print(f"Supabase Storage Upload failed: {e}")
            raise HTTPException(
                status_code=502,
                detail="Failed to upload skin image to storage. Make sure 'skin-images' bucket is created in Supabase."
            )

        # 3. Log results to public.analyses table in database
        db_analysis = models.Analysis(
            user_id=current_user.id,
            image_url=public_url,
            result_label=CLASS_NAMES[class_index],
            result_confidence=float(confidence),
            status="completed"
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)

        return {
            "id": db_analysis.id,
            "class": db_analysis.result_label,
            "confidence": db_analysis.result_confidence,
            "image_url": db_analysis.image_url,
            "status": db_analysis.status,
            "created_at": db_analysis.created_at
        }
    except HTTPException:
        raise
    except Exception as exc:
        print(f"Prediction flow error: {exc}")
        raise HTTPException(status_code=500, detail="Prediction flow failed.") from exc

@app.get("/analyses")
def get_analyses(
    current_user: models.Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch complete analysis history for the current logged-in patient.
    """
    analyses = db.query(models.Analysis).filter(
        models.Analysis.user_id == current_user.id
    ).order_by(models.Analysis.created_at.desc()).all()
    
    results = []
    for a in analyses:
        reviews_list = []
        for r in a.reviews:
            reviews_list.append({
                "id": r.id,
                "feedback": r.feedback,
                "created_at": r.created_at,
                "doctor": {
                    "full_name": r.doctor.full_name if r.doctor else "Dermatologist",
                    "hospital": r.doctor.hospital if r.doctor else None
                }
            })
        results.append({
            "id": a.id,
            "user_id": a.user_id,
            "image_url": a.image_url,
            "result_label": a.result_label,
            "result_confidence": a.result_confidence,
            "status": a.status,
            "created_at": a.created_at,
            "reviews": reviews_list
        })
    return results

@app.get("/analyses/{analysis_id}")
def get_analysis_detail(
    analysis_id: int,
    current_user: models.Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve details of a single analysis. Restricted to patient owner or doctor.
    """
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
        
    if analysis.user_id != current_user.id and current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Unauthorized to view this analysis record")
        
    reviews = db.query(models.DoctorReview).filter(models.DoctorReview.analysis_id == analysis_id).all()
    
    return {
        "analysis": {
            "id": analysis.id,
            "user_id": analysis.user_id,
            "image_url": analysis.image_url,
            "result_label": analysis.result_label,
            "result_confidence": analysis.result_confidence,
            "status": analysis.status,
            "created_at": analysis.created_at,
            "patient_name": analysis.patient.full_name if analysis.patient else "Unknown Patient",
            "patient_email": analysis.patient.email if analysis.patient else "No Email"
        },
        "reviews": reviews
    }

@app.post("/analyses/{analysis_id}/request-review")
def request_review(
    analysis_id: int,
    current_user: models.Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Flags an analysis record as 'pending_review' so doctors can see it in their queue.
    """
    analysis = db.query(models.Analysis).filter(
        models.Analysis.id == analysis_id,
        models.Analysis.user_id == current_user.id
    ).first()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
        
    analysis.status = "pending_review"
    db.commit()
    db.refresh(analysis)
    return {
        "id": analysis.id,
        "status": analysis.status
    }

@app.get("/doctor/pending-reviews")
def get_pending_reviews(
    current_doctor: models.Profile = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Retrieve all analyses currently flagged for doctor review. Accessible by doctors only.
    """
    pending = db.query(models.Analysis).filter(
        models.Analysis.status == "pending_review"
    ).order_by(models.Analysis.created_at.desc()).all()
    
    results = []
    for analysis in pending:
        results.append({
            "id": analysis.id,
            "image_url": analysis.image_url,
            "result_label": analysis.result_label,
            "result_confidence": analysis.result_confidence,
            "created_at": analysis.created_at,
            "status": analysis.status,
            "patient_name": analysis.patient.full_name if analysis.patient else "Unknown Patient",
            "patient_email": analysis.patient.email if analysis.patient else "No Email"
        })
    return results

@app.put("/doctor/reviews/{analysis_id}")
def submit_review(
    analysis_id: int,
    review_data: ReviewSubmissionSchema,
    current_doctor: models.Profile = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Submit doctor comments/feedback and transition analysis status to 'reviewed'.
    """
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
        
    if analysis.status != "pending_review":
        raise HTTPException(status_code=400, detail="This analysis is not pending a review")
        
    # Write review feedback row
    review = models.DoctorReview(
        analysis_id=analysis_id,
        doctor_id=current_doctor.id,
        feedback=review_data.feedback
    )
    db.add(review)
    
    # Update status of target analysis record
    analysis.status = "reviewed"
    
    db.commit()
    return {"status": "reviewed"}

@app.get("/doctor/patients")
def get_doctor_patients(
    current_doctor: models.Profile = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Retrieve all unique patients (profiles) that have at least one analysis
    submitted for review (pending_review or reviewed). Doctors only.
    """
    analyses = db.query(models.Analysis).filter(
        models.Analysis.status.in_(["pending_review", "reviewed"])
    ).order_by(models.Analysis.created_at.desc()).all()

    # Build unique patients map keyed by user_id, keeping their most recent analysis
    seen = {}
    for a in analyses:
        if a.user_id not in seen:
            seen[a.user_id] = {
                "id": a.user_id,
                "name": a.patient.full_name if a.patient else "Unknown Patient",
                "email": a.patient.email if a.patient else "No Email",
                "analysis_id": a.id,
                "analysis_date": a.created_at,
                "result_label": a.result_label,
                "result_confidence": a.result_confidence,
                "status": a.status,
            }
    return list(seen.values())

@app.get("/doctor/review-history")
def get_review_history(
    current_doctor: models.Profile = Depends(require_doctor),
    db: Session = Depends(get_db)
):
    """
    Retrieve all analyses that have been fully reviewed by this doctor.
    """
    reviews = db.query(models.DoctorReview).filter(
        models.DoctorReview.doctor_id == current_doctor.id
    ).order_by(models.DoctorReview.created_at.desc()).all()

    results = []
    for r in reviews:
        a = r.analysis
        if not a:
            continue
        results.append({
            "review_id": r.id,
            "analysis_id": a.id,
            "feedback": r.feedback,
            "review_date": r.created_at,
            "patient_name": a.patient.full_name if a.patient else "Unknown Patient",
            "patient_email": a.patient.email if a.patient else "No Email",
            "result_label": a.result_label,
            "result_confidence": a.result_confidence,
            "submitted_at": a.created_at,
        })
    return results

class ProfileUpdateSchema(BaseModel):
    full_name: str
    specialization: str | None = None
    license_no: str | None = None
    hospital: str | None = None

@app.put("/profile")
def update_profile(
    profile_data: ProfileUpdateSchema,
    current_user: models.Profile = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Updates the profile information of the current logged-in user/doctor.
    """
    if not profile_data.full_name.strip():
        raise HTTPException(status_code=400, detail="Full name cannot be empty")
        
    current_user.full_name = profile_data.full_name
    
    if current_user.role == "doctor":
        current_user.specialization = profile_data.specialization
        current_user.license_no = profile_data.license_no
        current_user.hospital = profile_data.hospital
        
    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {e}")
        
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "specialization": current_user.specialization,
        "license_no": current_user.license_no,
        "hospital": current_user.hospital,
        "created_at": current_user.created_at
    }