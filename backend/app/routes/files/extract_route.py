from sqlmodel import select
from app.constants.errors_texts import RESOURCE_NOT_FOUND
from app.db.models import User, File, FileExtraction
from app.routes.files import files_router
from fastapi import Depends, status, Request
from app.utils.auth import get_current_user
from app.utils.documentai.analyze import analyze_file
from app.dependencies import SessionDep
from app.utils.firebase import download


@files_router.post(
    "/{id}/extract_data/",
    description="Extract data from an existing file. If the file is already extracted, it will return the existing data.",
    status_code=status.HTTP_201_CREATED,
)
async def extract_file_data(
    id: str,
    request: Request,
    session: SessionDep,
    # extraction_config: dict | None = None,
    current_user: User = Depends(get_current_user),
):
    db_file = session.exec(select(File).where(File.id == id)).first()

    if not db_file:
        raise LookupError(RESOURCE_NOT_FOUND)

    db_file_extraction = session.exec(
        select(FileExtraction).where(FileExtraction.file_id == id)
    ).first()

    # don't extract if the file is already extracted (save google-document-ai usage)
    if db_file_extraction:
        return db_file_extraction

    firebase_file_bytes = await download(db_file.uri)
    analyzed_file = await analyze_file(
        file_bytes=firebase_file_bytes,
        content_type=db_file.file_mimetype.name,
        request=request,
    )
    new_file_extraction = FileExtraction(
        text=analyzed_file["text"],
        # all pdf have only one page. (bussiness rule)
        detected_languages=analyzed_file["pages"][0]["detectedLanguages"],
        file_id=db_file.id,
        user_id=current_user.id,
    )
    session.add(new_file_extraction)
    session.commit()
    session.refresh(new_file_extraction)
    return new_file_extraction
