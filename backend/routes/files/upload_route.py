from sqlalchemy import select
from config import config
from constants.errors_texts import UNSUPPORTED_FILE_TYPE
from db.models import User, File, FileMimetype
from routes.files import files_router
from fastapi import Depends, UploadFile, status, Request
from utils.auth import get_current_user
from utils.firebase import upload
from dependencies import SessionDep


@files_router.post(
    "/upload/",
    description="Upload a file to remote storage (firebase)",
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    request: Request,
    file: UploadFile,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    db_stmt = select(FileMimetype).filter(FileMimetype.name == file.content_type)
    db_file_mimetype = session.exec(db_stmt).scalar_one_or_none()

    if not db_file_mimetype:
        raise ValueError(UNSUPPORTED_FILE_TYPE)

    file_uri = await upload(file, config.FIREBASE_TMP_FOLDER)
    db_file = File(
        name=file.filename,
        client_ip=request.client.host,
        user_id=current_user.id,
        uri=file_uri,
        file_mimetype_id=db_file_mimetype.id,
    )
    session.add(db_file)
    session.commit()
    session.refresh(db_file)

    return db_file
