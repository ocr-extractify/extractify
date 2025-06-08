from io import BytesIO
from PyPDF2 import PdfReader
from sqlmodel import select
from config import config
from features_flags import features_flags
from app.constants.errors_texts import (
    CLIENT_IP_NOT_IN_REQUEST,
    INVALID_FILE,
    PDF_TOO_MANY_PAGES,
    UNSUPPORTED_FILE_TYPE,
)
from app.db.models import User, File, FileMimetype
from app.routes.v1.files import files_router
from fastapi import Depends, UploadFile, status, Request
from app.utils.auth import get_current_user
from app.utils.storage import upload
from app.dependencies import SessionDep


@files_router.post(
    "/",
    description="Upload a file to storage (local or firebase)",
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    request: Request,
    file: UploadFile,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    if not request.client:
        raise ValueError(CLIENT_IP_NOT_IN_REQUEST)

    if not file.content_type or not file.filename:
        raise ValueError(INVALID_FILE)

    db_stmt = select(FileMimetype).where(FileMimetype.name == file.content_type)
    db_file_mimetype = session.exec(db_stmt).first()

    if not db_file_mimetype:
        raise ValueError(UNSUPPORTED_FILE_TYPE)

    file_bytes = await file.read()
    await file.seek(0)  # reset file pointer to the beginning of the file
    if file.content_type == "application/pdf":
        pdf = PdfReader(BytesIO(file_bytes))
        if len(pdf.pages) > config.PDF_PAGE_LIMIT:
            raise ValueError(PDF_TOO_MANY_PAGES)

    file_uri = await upload(
        file=file,
        firebase_folder=config.FIREBASE_TMP_FOLDER,
        content_type=file.content_type,
    )
    db_file = File(
        name=file.filename,
        client_ip=request.client.host,
        user_id=current_user.id,
        uri=file_uri,
        mimetype_id=db_file_mimetype.id,
        storage_type=features_flags.STORAGE_TYPE,
    )
    session.add(db_file)
    session.commit()
    session.refresh(db_file)

    return db_file
