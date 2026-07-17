# Psoriasis AI — Project Context

> **Read this file first.** It gives a complete picture of the project so you don't need to scan every file on each session.

---

## 1. Project Overview

**Psoriasis AI** is a full-stack web application that lets users upload a skin photo to detect psoriasis using an AI model. Patients get an instant result; they can then request a human doctor review. Doctors have their own dashboard to manage patients, pending reviews, and review history.

- **Frontend**: Deployed on **Netlify** → `https://psoriasisai.netlify.app`
- **Backend**: Deployed on **Hugging Face Spaces** → `https://zohaibandsaeed-backendpsoriasisai.hf.space`
- **Database & Auth**: **Supabase** (PostgreSQL + Auth + Storage)
- **CI/CD**: GitHub Actions pushes only the backend folder to Hugging Face on every push to `main`

---

## 2. Repository Structure

```
Psoriasis AI/
├── Frontend/               # React + Vite SPA
│   ├── src/
│   │   ├── App.jsx         # Routes + LandingPage + ProtectedRoute definitions
│   │   ├── App.css         # App shell styles + loading screen
│   │   ├── index.css       # Global CSS variables, utilities, animations, typography
│   │   ├── main.jsx        # ReactDOM entry point
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Supabase auth state, fetchProfile, useAuth hook
│   │   ├── services/
│   │   │   ├── api.js              # Fetch wrapper (get/post/put/delete) with Bearer token
│   │   │   └── supabaseClient.js   # Supabase client init
│   │   ├── components/             # Shared / landing page components
│   │   │   ├── Navbar.jsx / .css
│   │   │   ├── Footer.jsx / .css
│   │   │   ├── Hero.jsx / .css           ← Main hero; scan animation + canvas noise texture
│   │   │   ├── HowItWorks.jsx / .css
│   │   │   ├── AIDermatologist.jsx / .css
│   │   │   ├── QuickInsight.jsx / .css
│   │   │   ├── EarlyDetection.jsx / .css
│   │   │   ├── Reviews.jsx / .css        ← Infinite marquee of review cards
│   │   │   ├── Statistics.jsx / .css
│   │   │   ├── FAQs.jsx / .css
│   │   │   ├── DashboardLayout.jsx / .css  ← Sidebar + topbar shell for all dashboard pages
│   │   │   ├── AnimatedNumber.jsx
│   │   │   ├── AuthIllustration.jsx / .css
│   │   │   ├── FormInput.jsx / .css
│   │   │   └── ImageCropper.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx / .css
│   │   │   ├── Register.jsx / .css
│   │   │   ├── SkinAnalysis.jsx / .css   ← Upload → crop → predict → result flow
│   │   │   ├── user/
│   │   │   │   ├── UserDashboard.jsx / .css
│   │   │   │   ├── AnalysisHistory.jsx / .css
│   │   │   │   ├── DoctorReviews.jsx / .css
│   │   │   │   └── UserProfile.jsx / .css
│   │   │   └── doctor/
│   │   │       ├── DoctorDashboard.jsx / .css
│   │   │       ├── Patients.jsx / .css
│   │   │       ├── PendingReviews.jsx / .css
│   │   │       ├── ReviewDetail.jsx / .css
│   │   │       ├── ReviewHistory.jsx / .css
│   │   │       └── DoctorProfile.jsx / .css
│   │   ├── data/                   # Static data arrays (FAQ questions, review content, etc.)
│   │   └── utils/                  # Shared utility functions
│   ├── public/
│   │   ├── skin-hero.png           # Hero section skin image (639KB)
│   │   ├── logo.png
│   │   ├── favicon.svg
│   │   └── icons.svg               # SVG sprite (606KB)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json                # React 19, react-router-dom 7, supabase-js 2, react-easy-crop
│
├── Backend/
│   └── fyp_api/
│       ├── app.py          # FastAPI app — all API routes (470 lines)
│       ├── auth.py         # JWT/Supabase token validation, get_current_user, require_doctor
│       ├── database.py     # SQLAlchemy engine + get_db + Base
│       ├── models.py       # ORM models: Profile, Analysis, DoctorReview
│       ├── utils.py        # Shared helpers
│       ├── requirements.txt
│       ├── Dockerfile
│       └── model/
│           └── resnet50_final_model.keras   # ML model (tracked via Git LFS)
│
├── .github/
│   └── workflows/
│       └── deploy.yml      # Pushes Backend/fyp_api/* to Hugging Face Spaces on push to main
│
└── context.md              # ← This file
```

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 + Vite 8 |
| Routing | react-router-dom v7 |
| Auth | Supabase Auth (JWT Bearer tokens) |
| Database | Supabase (PostgreSQL via SQLAlchemy ORM on backend) |
| Storage | Supabase Storage bucket `skin-images` |
| Backend framework | FastAPI (Python) |
| ML model | TensorFlow / Keras — ResNet50 fine-tuned, binary classifier |
| Image processing | Pillow + NumPy — resized to 224×224, ResNet50 preprocessing |
| Styling | Vanilla CSS (no Tailwind) — CSS custom properties in `index.css` |
| Fonts | Inter (body) + Plus Jakarta Sans (headings) via Google Fonts |
| Deployment (Frontend) | Netlify |
| Deployment (Backend) | Hugging Face Spaces (Docker) |
| CI/CD | GitHub Actions |

---

## 4. Routing & Pages

### Public routes
| Path | Component | Notes |
|---|---|---|
| `/` | `LandingPage` | Hero + 7 sections + Footer |
| `/login` | `Login` | |
| `/register` | `Register` | |

### Protected routes
| Path | Component | Role |
|---|---|---|
| `/analyze` | `SkinAnalysis` | Any authenticated user |
| `/dashboard` | `UserDashboard` | `patient` only |
| `/dashboard/history` | `AnalysisHistory` | `patient` |
| `/dashboard/reviews` | `DoctorReviews` | `patient` |
| `/dashboard/profile` | `UserProfile` | `patient` |
| `/doctor/dashboard` | `DoctorDashboard` | `doctor` only |
| `/doctor/patients` | `Patients` | `doctor` |
| `/doctor/pending-reviews` | `PendingReviews` | `doctor` |
| `/doctor/review/:id` | `ReviewDetail` | `doctor` |
| `/doctor/review-history` | `ReviewHistory` | `doctor` |
| `/doctor/profile` | `DoctorProfile` | `doctor` |
| `/go` | `DashboardRedirect` | Smart redirect based on role |

---

## 5. Auth System

- **Provider**: Supabase Auth
- **AuthContext** manages global auth state: `user`, `loading`, `isAuthenticated`, `isDoctor`, `isUser`
- On login, Supabase session established → `profiles` table record fetched & merged with session user
- Roles stored in `profiles.role`: `"patient"` or `"doctor"`
- `ProtectedRoute` redirects to `/login` if not auth; redirects by role mismatch
- API calls attach Supabase `access_token` as `Authorization: Bearer` header via `api.js`

---

## 6. Backend API Endpoints

**Base URL**: `https://zohaibandsaeed-backendpsoriasisai.hf.space`
All endpoints require `Authorization: Bearer <supabase_access_token>`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/predict` | Patient | Upload image → ResNet50 → Supabase Storage + DB → return result |
| `GET` | `/analyses` | Patient | Full history for current user |
| `GET` | `/analyses/{id}` | Patient or Doctor | Single analysis + reviews |
| `POST` | `/analyses/{id}/request-review` | Patient | Set status → `pending_review` |
| `GET` | `/doctor/pending-reviews` | Doctor | All pending reviews queue |
| `PUT` | `/doctor/reviews/{analysis_id}` | Doctor | Submit feedback → status `reviewed` |
| `GET` | `/doctor/patients` | Doctor | Unique patients with pending/reviewed analyses |
| `GET` | `/doctor/review-history` | Doctor | All reviews by this doctor |
| `PUT` | `/profile` | Any auth user | Update name; doctors also update specialization/license/hospital |

---

## 7. Database Models (SQLAlchemy)

### `profiles`
`id` (PK, Supabase UUID), `email`, `full_name`, `role` ("patient"/"doctor"), `specialization`, `license_no`, `hospital`, `created_at`

### `analyses`
`id` (PK int auto), `user_id` (FK→profiles), `image_url` (Supabase storage URL), `result_label` ("normal skin"/"psoriasis"), `result_confidence` (float), `status` ("completed"→"pending_review"→"reviewed"), `created_at`

### `reviews` (DoctorReview)
`id` (PK int auto), `analysis_id` (FK→analyses), `doctor_id` (FK→profiles), `feedback` (string), `created_at`

---

## 8. ML Model

- **Architecture**: ResNet50 fine-tuned, binary output (sigmoid)
- **Classes**: `["normal skin", "psoriasis"]` — index 0 = normal, index 1 = psoriasis
- **Threshold**: score ≥ 0.5 → psoriasis
- **Confidence**: `score` if psoriasis, `1 - score` if normal
- **File**: `model/resnet50_final_model.keras` (Git LFS tracked)
- **Startup**: Loaded from disk; downloads from `MODEL_DOWNLOAD_URL` env var if not present

---

## 9. CSS Design System

All CSS variables in `Frontend/src/index.css`:

```
--primary: #3182CE  |  --secondary: #38A169  |  --accent: #0BC5EA
--bg-white  --bg-light  --bg-gray
--text-dark  --text-body  --text-muted  --text-light
--border: #E2E8F0
--shadow-sm / -md / -lg / -xl
--radius-sm(8px) / -md(12px) / -lg(20px) / -xl(28px) / -full(9999px)
--transition(0.3s) / -fast(0.15s) / -slow(0.5s)
```

**Key utility classes**: `.container` (max-width 1200px), `.btn-primary`, `.btn-secondary`, `.card`, `.text-gradient`, `.section-title`, `.section-subtitle`, `.section-badge`

**Global animations**: `fadeInUp`, `fadeInLeft`, `fadeInRight`, `float`, `blob`, `shimmer`, `pulse-ring`, `spin-slow`

---

## 10. Key Design Decisions & Known Quirks

| Topic | Detail |
|---|---|
| **Noise texture** | Generated client-side via HTML5 Canvas in `Hero.jsx` on mount. The original SVG `feTurbulence` filter caused severe lag on mobile — do NOT revert to it |
| **Mobile horizontal overflow** | Fixed by adding `overflow-x: hidden` to `html` + `body` + `.dash-layout`. All section background wrappers (`.hero__bg`, `.ai-derm__bg`, `.stats__bg`, `.reviews__bg`) also have `overflow: hidden` to clip large fixed-px blobs |
| **FAQs grid** | Uses `min(380px, 100%) 1fr` — NOT a plain `380px` — to prevent overflow on small screens |
| **GPU acceleration** | Animated blobs and floating elements use `will-change: transform` + `transform: translate3d(0,0,0)` + `backface-visibility: hidden` |
| **Dashboard sidebar** | Slides in via `transform: translateX(-100%)` on mobile; opens with `.dash-sidebar--mobile-open`. Hamburger visible ≤1024px |
| **Navbar** | Links + auth hidden at ≤900px; replaced by hamburger + `.navbar__mobile` dropdown |
| **Image upload flow** | Upload → crop (react-easy-crop) → FormData POST to `/predict` → result shown in-page |
| **Analysis status** | `completed` → (patient requests) → `pending_review` → (doctor reviews) → `reviewed` |
| **EarlyDetection badge** | `.early__alert-badge` uses `right: -20px`. Section has `overflow: hidden` to contain it |

---

## 11. Environment Variables

### Frontend (`Frontend/.env.local`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=https://zohaibandsaeed-backendpsoriasisai.hf.space
```

### Backend (`Backend/fyp_api/.env`)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
DATABASE_URL=       # PostgreSQL connection string
MODEL_DOWNLOAD_URL= # URL to download .keras model if not on disk
```

---

## 12. Development Commands

```bash
# Frontend — dev server at http://localhost:5173
cd Frontend && npm run dev

# Frontend — production build
cd Frontend && npm run build

# Backend — FastAPI dev server at http://localhost:8000
cd Backend/fyp_api && uvicorn app:app --reload --port 8000
```

---

## 13. Deployment

| Service | Content | Trigger |
|---|---|---|
| Netlify (Frontend) | `Frontend/dist/` | Auto on push via Netlify GitHub integration |
| Hugging Face Spaces (Backend) | `Backend/fyp_api/*` | GitHub Actions `deploy.yml` on push to `main` |

The workflow creates a clean temp git repo, copies backend files, sets up Git LFS for `.keras`, then force-pushes to the HF Spaces repo using `HF_TOKEN` secret.

---

*Last updated: 2026-07-17*
