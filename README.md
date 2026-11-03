# Project Flow 🚀

> **Plan clearly. Ship calmly.**  
> A modern, modular full-stack project and task management application built with **FastAPI**, **PostgreSQL**, **React 18**, **TypeScript**, and **Tailwind CSS**.

---

## 📌 Overview

**Project Flow** is designed for teams and individuals to organize initiatives, track deliverables, and manage subtask workflows seamlessly. Built on a domain-driven modular architecture, both backend and frontend scale independently with clean boundaries, strong type safety, and a refined design system based on *Plus Jakarta Sans*.

---

## ✨ Features

- **🔐 Secure Authentication & Session Management**:
  - Email/password registration & OAuth2 password flow.
  - Industry-standard **Argon2** password hashing via `pwdlib`.
  - Stateless **JWT (JSON Web Tokens)** session handling with expiration.
  - Protected API routes and client-side route guards.
- **🎨 Refined Modal Authentication UI**:
  - Two-section responsive modal dialog showcasing brand artwork alongside authentication forms.
  - Seamless toggle between Sign In and Sign Up with auto-login on registration.
- **📁 Projects & Workflows**:
  - Create, filter, and track status across multi-stage projects (To Do, In Progress, Completed, Blocked).
  - Dynamic progress bars calculating completion percentages.
- **✅ Tasks & Nested Subtasks**:
  - One-click completion checkboxes with visual status cues.
  - Due date tracking with automatic overdue badges.
  - Inline subtask checklists with instant toggle and quick-add.
- **📊 Real-time Dashboard**:
  - Key performance metrics (active projects, completed tasks, overdue items).
  - Interactive multi-segment status breakdown visualization.
  - Upcoming deadline priority list.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)
- **Database ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
- **Database**: PostgreSQL (Neon Cloud / Local PostgreSQL)
- **Settings & Validation**: [Pydantic v2](https://docs.pydantic.dev/) & [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **Security**: Argon2 hashing (`pwdlib`), PyJWT, OAuth2 Bearer tokens
- **Server**: [Uvicorn](https://www.uvicorn.org/) ASGI

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State & Server Cache**: [TanStack Query (React Query v5)](https://tanstack.com/query/latest)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/) (with JWT interceptors & 401 handlers)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📂 Project Structure

```text
project-flow/
├── backend/
│   ├── app/
│   │   ├── core/                  # Database connection, security, app config
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── modules/
│   │   │   └── auth/              # Auth module (routes, models, schemas, services)
│   │   │       ├── deps.py
│   │   │       ├── models.py
│   │   │       ├── router.py
│   │   │       ├── schemas.py
│   │   │       └── services.py
│   │   ├── main.py                # FastAPI bootstrap, middleware & lifespan
│   │   └── models_registry.py     # Centralized model registry
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── core/                  # Axios interceptor, common types & utilities
│   │   │   ├── api/client.ts
│   │   │   ├── hooks/useDebounce.ts
│   │   │   └── types/common.ts
│   │   ├── modules/               # Domain-specific modules
│   │   │   ├── auth/              # Auth pages, context, hooks & modal
│   │   │   ├── dashboard/         # Dashboard metrics & status components
│   │   │   ├── projects/          # Project list, detail view & modals
│   │   │   ├── tasks/             # Task item cards, overdue badges & modals
│   │   │   └── subtasks/          # Nested checklist & quick-add components
│   │   ├── shared/                # Common reusable UI & layout wrappers
│   │   │   ├── components/layout/ # Sidebar, Navbar, PageContainer
│   │   │   └── components/ui/     # Button, Input, Modal, Badge, Logo, ProgressBar
│   │   ├── App.tsx                # Client-side router configuration
│   │   └── main.tsx               # Root entry & QueryClientProvider
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── .gitignore
```

---

## 🚦 Getting Started

### Prerequisites
- **Python**: 3.10+ (tested on 3.12)
- **Node.js**: 18+ (tested on 20+ / 24)
- **PostgreSQL**: Neon DB connection string or local PostgreSQL instance

---

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```powershell
   # Windows (PowerShell)
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1

   # Linux / macOS
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```
   *Example `.env`:*
   ```env
   APP_NAME="Project Flow"
   APP_VERSION="1.0.0"
   DEBUG=True
   APP_ENV="development"

   HOST="0.0.0.0"
   PORT=8000

   DATABASE_URL="postgresql+psycopg2://<user>:<password>@<host>/<dbname>?sslmode=require"

   SECRET_KEY="your-super-secret-key-change-in-production"
   ALGORITHM="HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES=60

   ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
   ```

5. **Start the FastAPI backend server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   - API Root: `http://localhost:8000/`
   - Interactive Swagger Docs: `http://localhost:8000/docs`
   - ReDoc Docs: `http://localhost:8000/redoc`

---

### 2. Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Contents of `frontend/.env`:*
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
   - Application URL: `http://localhost:5173/`

---

## 📡 API Endpoints (Phase 1)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | API Root Health Message | No |
| `GET` | `/health` | Application & Database Health Check | No |
| `POST` | `/auth/register` | Register new user account | No |
| `POST` | `/auth/login` | OAuth2 password token login | No |
| `GET` | `/users/me` | Fetch authenticated user profile | Yes (Bearer) |
| `PATCH` | `/users/me` | Update current user profile (name) | Yes (Bearer) |

*All `/auth` and `/users` routes are also aliased under the `/api/v1` prefix.*

---

## 🗺️ Roadmap

- [x] **Phase 1 – Foundation (Week 1)**:
  - User registration & login with Argon2 + JWT
  - Basic user profile (name + email)
  - Secure session handling via Axios interceptors & React AuthContext
  - Neon PostgreSQL connection setup & core models
  - Two-section responsive modal auth UI
- [ ] **Phase 2 – Projects & Tasks Core**:
  - Full backend CRUD endpoints for `/projects`, `/tasks`, and `/subtasks`
  - Database migrations with Alembic
  - Task assignments & priority filters
- [ ] **Phase 3 – Collaboration & Productivity**:
  - Team member invitations & workspace roles
  - Activity log & audit trails
  - Dark mode support

---

## 📄 License

This project is licensed under the MIT License.
