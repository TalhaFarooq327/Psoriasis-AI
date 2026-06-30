# Psoriasis AI — Skin Condition Classification

A two-role web application designed to classify skin psoriasis using a deep-learning ML Model. Features user profile management, skin classification prediction, analysis history, and an interactive doctor review/consultation system.

---

## 🛠️ Technology Stack
* **Frontend**: React 19 + Vite 8 + React Router v7 + Vanilla CSS
* **Backend**: FastAPI (Python 3.12) + SQLAlchemy ORM + python-jose (JWT validation)
* **AI Model**: ML Model Binary Classifier (`.keras` format)
* **Auth, DB & Storage**: Supabase Ecosystem (Auth, PostgreSQL DB, Storage Bucket)

---

## 📂 Project Structure
```
Psoriasis AI/
├── Backend/
│   ├── fyp_api/
│   │   ├── model/                  # ML Model .keras model directory
│   │   ├── app.py                  # FastAPI server routes & lifespan
│   │   ├── auth.py                 # Supabase JWT signature middleware
│   │   ├── database.py             # SQLAlchemy Postgres configurations
│   │   ├── models.py               # ORM Tables (profiles, analyses, reviews)
│   │   ├── create_tables.py        # Database migration initialization script
│   │   └── requirements.txt        # Backend dependencies
└── Frontend/
    ├── src/
    │   ├── components/             # Reusable UI widgets (DashboardLayout, AnimatedNumber...)
    │   ├── context/                # AuthContext (Supabase Auth Client)
    │   ├── pages/                  # Route pages (SkinAnalysis, Dashboards, Auth...)
    │   ├── services/
    │   │   ├── api.js              # Token injecting HTTP client wrapper
    │   │   └── supabaseClient.js   # Client SDK instance provider
    │   └── App.jsx                 # App routes and Layouts
    ├── .env.local                  # Frontend environment variables
    └── package.json                # Frontend package dependencies
```

---

## ⚙️ Setup and Configuration

### 1. Database & Storage Setup (Supabase)
1. **Create a Supabase Project**: Go to [Supabase](https://supabase.com) and spin up a new project.
2. **PostgreSQL Details**: Go to Project Settings -> Database -> Connection string (URI) to fetch your database credentials.
3. **Storage Bucket**: Go to Storage -> Create a new public bucket named `skin-images`.
4. **JWT Secret**: Go to Project Settings -> API -> JWT Secret.

### 2. Backend Configuration
Create a `.env` file inside `Backend/fyp_api/`:
```env
DATABASE_URL=your-supabase-postgresql-connection-uri
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

### 3. Frontend Configuration
Create a `.env.local` file inside `Frontend/`:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🚀 Running the Application

### 1. Initialize Database Schema
Run this once from the `Backend/fyp_api/` directory (ensure your virtual environment is active):
```bash
python create_tables.py
```

### 2. Start the Backend API
Run this from the `Backend/fyp_api/` directory:
```bash
uvicorn app:app --reload
```
The documentation will be available at `http://127.0.0.1:8000/docs`.

### 3. Start the Frontend client
Run this from the `Frontend/` directory:
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## ⚖️ Disclaimer
This application is powered by an AI model and is intended for informational and demonstrative purposes only. It does NOT constitute a medical diagnosis. Please consult a licensed doctor for professional consultation.
