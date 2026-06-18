from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True) # Matches Supabase auth.users UUID
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, nullable=False, default="patient") # 'patient' or 'doctor'
    specialization = Column(String, nullable=True)
    license_no = Column(String, nullable=True)
    hospital = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    analyses = relationship("Analysis", back_populates="patient", cascade="all, delete-orphan")

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    image_url = Column(String, nullable=False)
    result_label = Column(String, nullable=False) # e.g. "Normal Skin" or "Psoriasis"
    result_confidence = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="completed") # 'completed', 'pending_review', 'reviewed'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    patient = relationship("Profile", back_populates="analyses")
    reviews = relationship("DoctorReview", back_populates="analysis", cascade="all, delete-orphan")

class DoctorReview(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False)
    doctor_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    feedback = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    analysis = relationship("Analysis", back_populates="reviews")
    doctor = relationship("Profile")
