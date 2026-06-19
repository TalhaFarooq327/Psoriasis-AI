import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from database import get_db
import models
from supabase import create_client, Client
import requests

# Load environment variables
from dotenv import load_dotenv
load_dotenv(override=True)

# Read the JWT secret from the env
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")

# Supabase Client setup for fallback verification
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase_client: Client = None
if SUPABASE_URL and SUPABASE_ANON_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client in auth.py: {e}")

# ── Fetch JWKS public keys from Supabase (for ES256 token verification) ──
_jwks_keys = None
if SUPABASE_URL:
    try:
        jwks_url = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
        resp = requests.get(jwks_url, timeout=10)
        if resp.status_code == 200:
            _jwks_keys = resp.json().get("keys", [])
            print(f"JWKS loaded successfully ({len(_jwks_keys)} key(s) fetched)")
        else:
            print(f"Warning: Could not fetch JWKS (HTTP {resp.status_code})")
    except Exception as e:
        print(f"Warning: Failed to fetch JWKS from Supabase: {e}")

security = HTTPBearer()


def _find_jwk_for_token(token: str) -> dict | None:
    """Match the token's 'kid' header to the correct JWKS public key."""
    if not _jwks_keys:
        return None
    try:
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        for key in _jwks_keys:
            if key.get("kid") == kid:
                return key
    except Exception:
        pass
    return None


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

    # ── Step 1: Detect token algorithm and verify JWT ──
    try:
        header = jwt.get_unverified_header(token)
        alg = header.get("alg", "HS256")
    except JWTError:
        raise credentials_exception

    decoded = False

    # Path A: ES256 — use JWKS public key
    if alg == "ES256":
        jwk_key = _find_jwk_for_token(token)
        if jwk_key:
            try:
                payload = jwt.decode(
                    token, jwk_key, algorithms=["ES256"],
                    options={"verify_aud": False}
                )
                user_id = payload.get("sub")
                email = payload.get("email")
                user_metadata = payload.get("user_metadata", {})
                decoded = True
            except JWTError as e:
                print(f"[AUTH] ES256 JWT decode failed: {e}")
        else:
            print("[AUTH] No matching JWKS key found for token")

    # Path B: HS256 — use JWT secret
    elif alg == "HS256" and SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token, SUPABASE_JWT_SECRET, algorithms=["HS256"],
                options={"verify_aud": False}
            )
            user_id = payload.get("sub")
            email = payload.get("email")
            user_metadata = payload.get("user_metadata", {})
            decoded = True
        except JWTError as e:
            print(f"[AUTH] HS256 JWT decode failed: {e}")

    # Path C: Fallback — verify via Supabase API
    if not decoded and supabase_client:
        try:
            res = supabase_client.auth.get_user(token)
            if res and res.user:
                user_id = res.user.id
                email = res.user.email
                user_metadata = res.user.user_metadata or {}
                decoded = True
            else:
                raise credentials_exception
        except Exception as e:
            print(f"[AUTH] Supabase client verification also failed: {e}")
            raise credentials_exception

    if not decoded or not user_id or not email:
        raise credentials_exception

    # ── Step 2: Load or auto-create profile from database ──
    db_user = db.query(models.Profile).filter(models.Profile.id == user_id).first()
    
    # Self-healing profile mechanism: if user is authed in Supabase but profile row doesn't exist, create it.
    if db_user is None:
        full_name = user_metadata.get("full_name")
        role = user_metadata.get("role", "patient") # Fallback to patient
        
        db_user = models.Profile(
            id=user_id,
            email=email,
            full_name=full_name,
            role=role,
            specialization=user_metadata.get("specialization"),
            license_no=user_metadata.get("license_no"),
            hospital=user_metadata.get("hospital")
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
