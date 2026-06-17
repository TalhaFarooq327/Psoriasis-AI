from fastapi import FastAPI, File, UploadFile, HTTPException
import numpy as np
from PIL import Image, UnidentifiedImageError
import io

try:
    import tensorflow as tf
except ModuleNotFoundError:
    tf = None

app = FastAPI()

model = None

CLASS_NAMES = ["normal skin", "psorasis"]

@app.on_event("startup")
def load_model():
    global model
    if tf is None:
        print("TensorFlow is not installed. Install it only when you are ready to load a .keras model.")
        return

    model = tf.keras.models.load_model("fyp_api/model/resnet50_final_model.keras")
    print("Model loaded successfully")

def preprocess_image(image_bytes):
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            img = img.convert("RGB")
            img = img.resize((224, 224))
            img_array = np.asarray(img, dtype=np.float32)

            if tf is not None:
                img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
            else:
                img_array = img_array / 255.0

            return np.expand_dims(img_array, axis=0)
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image.") from exc

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        processed = preprocess_image(image_bytes)

        if model is None:
            raise HTTPException(status_code=503, detail="Model not loaded yet")

        prediction = model.predict(processed, verbose=0)
        score = float(prediction[0][0])

        class_index = 1 if score >= 0.5 else 0
        confidence = score if class_index == 1 else 1 - score

        return {
            "class": CLASS_NAMES[class_index],
            "confidence": float(confidence),
            "raw_score": float(score)
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Prediction failed.") from exc