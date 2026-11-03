from fastapi import APIRouter, Depends, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.deps import get_current_user
from app.modules.auth.models import User
from app.modules.documents import services
from app.modules.documents.schemas import DocumentOut

router = APIRouter(tags=["documents"])


@router.post(
    "/projects/{project_id}/documents",
    response_model=DocumentOut,
    status_code=status.HTTP_201_CREATED,
)
def upload_document(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.upload_document(db, user.id, project_id, file)


@router.get(
    "/projects/{project_id}/documents",
    response_model=list[DocumentOut],
)
def list_documents(
    project_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return services.list_documents(db, user.id, project_id)


@router.get(
    "/projects/{project_id}/documents/{document_id}/download",
)
def download_document(
    project_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    doc, file_path = services.get_document_for_download(
        db, user.id, project_id, document_id
    )
    return FileResponse(
        path=file_path,
        filename=doc.filename,
        media_type=doc.content_type or "application/octet-stream",
    )


@router.delete(
    "/projects/{project_id}/documents/{document_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_document(
    project_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    services.delete_document(db, user.id, project_id, document_id)
