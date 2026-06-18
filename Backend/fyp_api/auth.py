import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from database import get_db
import models
from supabase import create_client, Client

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Read the JWT secret from the env
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
ALGORITHM = "HS256"

# Supabase Client setup for fallback verification
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase_client: Client = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client in auth.py: {e}")

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> models.Profile:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user_id = None
    email = None
    user_metadata = {}

    if SUPABASE_JWT_SECRET:
        try:
            # Decode the Supabase JWT token.
            # Note: aud verification is disabled because aud is typically "authenticated" in Supabase,
            # but sometimes varies depending on settings. Disabling it is standard for backend verification.
            payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM], options={"verify_aud": False})
            user_id = payload.get("sub")
            email = payload.get("email")
            user_metadata = payload.get("user_metadata", {})
            if user_id is None or email is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception
    else:
        if not supabase_client:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Neither SUPABASE_JWT_SECRET nor (SUPABASE_URL and SUPABASE_ANON_KEY) are configured on the backend."
            )
        try:
            res = supabase_client.auth.get_user(token)
            if not res or not res.user:
                raise credentials_exception
            user_id = res.user.id
            email = res.user.email
            user_metadata = res.user.user_metadata or {}
        except Exception as e:
            print(f"Token verification with Supabase failed: {e}")
            raise credentials_exception

    # Query public.profiles to load user details
    db_user = db.query(models.Profile).filter(models.Profile.id == user_id).first()
    
    # Self-healing profile mechanism: if user is authed in Supabase but profile row doesn't exist, create it.
    if db_user is None:
        full_name = user_metadata.get("full_name")
        role = user_metadata.get("role", "patient") # Fallback to patient
        
        db_user = models.Profile(
            id=user_id,
            email=email,
            full_name=full_name,
            role=role
        )
        try:
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
        except Exception as e:
            db.rollback()
            print(f"Error auto-syncing profile for {email}: {e}")
            raise credentials_exception

    return db_user

def require_doctor(current_user: models.Profile = Depends(get_current_user)):
    if current_user.role != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation restricted to doctors only."
        )
    return current_user
