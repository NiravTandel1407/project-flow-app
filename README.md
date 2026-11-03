# Project Flow 🚀

A full-stack project and task management application built with **FastAPI** (Python) and **React + Vite** (TypeScript).

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:

- **Python**: 3.10 or higher
- **Node.js**: 18 or higher (with `npm`)
- **Git**
- **PostgreSQL Database**: Local PostgreSQL instance or a free cloud database like [Neon](https://neon.tech/)

---

## 🚀 How to Run the App

### 1. Clone the Repository

```bash
git clone https://github.com/NiravTandel1407/project-flow-app.git
cd project-flow-app
```

---

### 2. Backend Setup (FastAPI)

Open a terminal and navigate to the `backend` folder:

```bash
cd backend
```

#### Step 2.1: Create & Activate Virtual Environment

- **Windows (PowerShell):**
  ```powershell
  python -m venv .venv
  .\.venv\Scripts\Activate.ps1
  ```
- **macOS / Linux:**
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

#### Step 2.2: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 2.3: Configure Environment Variables

Create a `.env` file inside the `backend/` directory by copying the example:

- **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
- **macOS / Linux:**
  ```bash
  cp .env.example .env
  ```

Open `backend/.env` and ensure your database connection string and secrets are set:

```env
APP_NAME='Project Flow'
APP_VERSION='1.0.0'
DEBUG=True
APP_ENV="development"

HOST="0.0.0.0"
PORT=8000

# Replace with your PostgreSQL connection URL (e.g., Neon or local)
DATABASE_URL="postgresql+psycopg2://<user>:<password>@<host>/<dbname>?sslmode=require"

# JWT configuration
SECRET_KEY="your-secret-key-change-in-production"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Allowed Frontend Origins (CORS)
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
```

#### Step 2.4: Start the Backend Server

```bash
uvicorn app.main:app --reload --port 8000
```

- API Base URL: `http://localhost:8000`
- Interactive API Docs (Swagger): `http://localhost:8000/docs`
- Alternative API Docs (ReDoc): `http://localhost:8000/redoc`

---

### 3. Frontend Setup (React + Vite)

Open a **new separate terminal** and navigate to the `frontend` folder:

```bash
cd frontend
```

#### Step 3.1: Install Dependencies

```bash
npm install
```

#### Step 3.2: Configure Environment Variables

Create a `.env` file inside the `frontend/` directory by copying the example:

- **Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
- **macOS / Linux:**
  ```bash
  cp .env.example .env
  ```

Verify `frontend/.env` points to the backend:

```env
VITE_API_URL=http://localhost:8000
```

#### Step 3.3: Start the Frontend Dev Server

```bash
npm run dev
```

- Open your browser at: **`http://localhost:5173`**

---

## 🌐 Quick Summary of URLs

| Service | URL |
| :--- | :--- |
| **Frontend App** | [http://localhost:5173](http://localhost:5173) |
| **Backend API** | [http://localhost:8000](http://localhost:8000) |
| **Swagger API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **Health Check** | [http://localhost:8000/health](http://localhost:8000/health) |

---

## ❓ Troubleshooting

- **Port 8000 already in use (`[Errno 10048]`)**:
  Kill any existing Python/Uvicorn process holding port 8000:
  - *Windows (PowerShell)*:
    ```powershell
    Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
    ```
- **Backend cannot find module `main`**:
  Make sure you run Uvicorn from the `backend/` directory using the module path `app.main:app`:
  ```bash
  cd backend
  uvicorn app.main:app --reload
  ```
