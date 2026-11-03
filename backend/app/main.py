from contextlib import asynccontextmanager
from sqlalchemy import text
from app.core.config import settings
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.core.database import get_db, Base, engine
from sqlalchemy.orm import Session
import app.models_registry  # Ensures models are imported for create_all
from app.modules.auth.router import auth_router, users_router
from app.modules.projects.router import router as projects_router
from app.shared.error_handlers import register_exception_handlers
from app.modules.tasks.router import router as tasks_router
from app.modules.subtasks.router import router as subtasks_router
from app.modules.documents.router import router as documents_router




@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once when the app starts: create database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Code after yield runs when the app shuts down


app = FastAPI(
    title=settings.APP_NAME,
    description="Project Management Application",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# Allow frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Auth and User Routers (both root and /api/v1 prefixes)
register_exception_handlers(app)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(projects_router)
app.include_router(tasks_router)
app.include_router(subtasks_router)
app.include_router(documents_router)

@app.get("/")
def root():
    return {"message": "Hello from FastAPI!"}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.APP_ENV,
        "database": "connected",
    }


if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
