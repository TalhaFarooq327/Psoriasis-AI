# Use an official lightweight Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables to optimize Python runtime behaviour
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory inside the container
WORKDIR /app

# Install compilation dependencies required for psycopg2-binary
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements from fyp_api subdirectory
COPY fyp_api/requirements.txt /app/

# Upgrade pip and install all Python requirements
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy all script contents from fyp_api subdirectory
COPY fyp_api/ /app/

# Expose container port
EXPOSE 8000

# Start FastAPI server using uvicorn with a single worker thread to save memory space
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
