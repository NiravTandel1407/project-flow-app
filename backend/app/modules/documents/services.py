import os
import uuid
import shutil
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.documents.models import ProjectDocument
from app.modules.projects.models import Project

BASE_UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"


def _ensure_project_access(db: Session, user_id: int, project_id: int) -> Project:
    project = db.scalar(
        select(Project).where(Project.id == project_id, Project.user_id == user_id)
    )
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found or access denied",
        )
    return project


def upload_document(
    db: Session, user_id: int, project_id: int, file: UploadFile
) -> ProjectDocument:
    _ensure_project_access(db, user_id, project_id)

    # Clean filename
    original_filename = Path(file.filename or "uploaded_file").name
    extension = Path(original_filename).suffix
    unique_stored_name = f"{uuid.uuid4().hex}{extension}"

    # Target folder
    project_folder = BASE_UPLOAD_DIR / f"project_{project_id}"
    project_folder.mkdir(parents=True, exist_ok=True)
    destination_path = project_folder / unique_stored_name

    # Save to disk
    file_size = 0
    with open(destination_path, "wb") as buffer:
        while chunk := file.file.read(1024 * 1024):  # 1MB chunks
            buffer.write(chunk)
            file_size += len(chunk)

    doc = ProjectDocument(
        project_id=project_id,
        user_id=user_id,
        filename=original_filename,
        stored_name=unique_stored_name,
        file_size=file_size,
        content_type=file.content_type,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc


def list_documents(db: Session, user_id: int, project_id: int) -> list[ProjectDocument]:
    _ensure_project_access(db, user_id, project_id)
    stmt = (
        select(ProjectDocument)
        .where(ProjectDocument.project_id == project_id)
        .order_by(ProjectDocument.created_at.desc())
    )
    return list(db.scalars(stmt).all())


def get_document_for_download(
    db: Session, user_id: int, project_id: int, document_id: int
) -> tuple[ProjectDocument, Path]:
    _ensure_project_access(db, user_id, project_id)
    doc = db.scalar(
        select(ProjectDocument).where(
            ProjectDocument.id == document_id, ProjectDocument.project_id == project_id
        )
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )

    file_path = BASE_UPLOAD_DIR / f"project_{project_id}" / doc.stored_name
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found on storage"
        )

    return doc, file_path


def delete_document(db: Session, user_id: int, project_id: int, document_id: int) -> None:
    _ensure_project_access(db, user_id, project_id)
    doc = db.scalar(
        select(ProjectDocument).where(
            ProjectDocument.id == document_id, ProjectDocument.project_id == project_id
        )
    )
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )

    # Delete from disk
    file_path = BASE_UPLOAD_DIR / f"project_{project_id}" / doc.stored_name
    if file_path.exists():
        try:
            os.remove(file_path)
        except OSError:
            pass

    db.delete(doc)
    db.commit()
