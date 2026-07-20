# 🩺 Psoriasis AI — Skin Condition Classification

A secure, multi-role web application designed to classify skin psoriasis using a deep-learning model. This platform enables patients to manage profiles, obtain automated skin classification predictions, track analysis history, and coordinate consultations with licensed medical professionals. It features a dedicated dermatologist workspace for reviewing cases and providing clinical feedback.

---

## 🔗 Live Deployments

* **Frontend Client (Netlify)**: [https://psoriasisai.netlify.app](https://psoriasisai.netlify.app)
* **Backend Service (Hugging Face Spaces)**: [https://zohaibandsaeed-backendpsoriasisai.hf.space](https://zohaibandsaeed-backendpsoriasisai.hf.space)

---

## 🛠️ Technology Stack

* **Frontend**: React 19 + Vite 8 + React Router v7 + Vanilla CSS
* **Backend**: FastAPI (Python 3.12) + SQLAlchemy ORM + python-jose (JWT)
* **AI Model**: TensorFlow BNresnet Classifier (`.keras` format)
* **Infrastructure**: Supabase (Auth, PostgreSQL Database, Object Storage)

---

## 📂 Repository Structure

```
Psoriasis AI/
├── Backend/
│   └── fyp_api/
│       ├── model/                  # Deep learning .keras model files
│       ├── app.py                  # FastAPI server routes, lifespan & CORS
│       ├── auth.py                 # JWT validation (JWKS + HS256) & RBAC
│       ├── database.py             # SQLAlchemy Postgres configurations
│       ├── models.py               # ORM database schemas (profiles, analyses, reviews)
│       ├── create_tables.py        # Database schema initialization script
│       ├── utils.py                # Helper functions
│       ├── requirements.txt        # Backend dependencies
│       └── Dockerfile              # Docker container configuration
└── Frontend/
    ├── src/
    │   ├── components/             # Reusable UI widgets & layout wrappers
    │   ├── context/                # Authentication & state context providers
    │   ├── pages/                  # Route views (dashboards, analysis, auth)
    │   ├── services/               # HTTP client wrapper & Supabase integration
    │   ├── data/                   # Static data arrays
    │   ├── utils/                  # Shared helper utilities
    │   ├── App.jsx                 # Routing logic & global layouts
    │   ├── App.css                 # Base loader & animation styles
    │   └── index.css               # Design tokens, variables & resets
    ├── public/                     # Static assets (images, logos & SVG sprites)
    ├── package.json                # Frontend package dependencies
    └── vite.config.js              # Vite compiler configuration
```

---

## ⚙️ Setup and Configuration

### 1. Supabase Initialization
1. **Create Project**: Initialize a new project on [Supabase](https://supabase.com).
2. **Database Settings**: Retrieve the PostgreSQL connection URI from **Project Settings > Database**.
3. **Storage Bucket**: Create a public bucket named `skin-images` for storing uploaded images.
4. **JWT Verification**: Retrieve the JWT Secret key from **Project Settings > API**.

### 2. Backend Configuration
Create a `.env` file in the `Backend/fyp_api/` directory:
```env
DATABASE_URL=your-supabase-postgresql-connection-uri
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
```

### 3. Frontend Configuration
Create a `.env.local` file in the `Frontend/` directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://127.0.0.1:8000
```

---

## 🚀 Running the Application

### 1. Initialize Database Schema
Run the database migration initialization script from the `Backend/fyp_api/` directory:
```bash
python create_tables.py
```

### 2. Launch the Backend API
Run the FastAPI development server from the `Backend/fyp_api/` directory:
```bash
uvicorn app:app --reload
```
*Interactive Swagger documentation will be available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).*

### 3. Launch the Frontend Client
Install dependencies and run the development environment from the `Frontend/` directory:
```bash
npm install
npm run dev
```
*Access the application interface at [http://localhost:5173](http://localhost:5173).*

---

## ⚖️ Medical Disclaimer
> [!IMPORTANT]
> This application is powered by an AI model and is intended for informational and demonstrative purposes only. It does not constitute medical advice or a diagnosis. Always consult a licensed medical professional for clinical diagnosis, treatment recommendations, and professional consultation.

