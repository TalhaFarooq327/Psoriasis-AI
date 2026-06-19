import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from .env file
load_dotenv(override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # We can default to SQLite or raise an error. We raise an error so the user is prompted to supply the DB URI.
    raise ValueError("DATABASE_URL environment variable is missing in .env file.")

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base for SQLAlchemy models
Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
