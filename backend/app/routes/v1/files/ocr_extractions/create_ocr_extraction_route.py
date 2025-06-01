from uuid import UUID
from typing import Optional
from sqlmodel import select
from app.constants.errors_texts import RESOURCE_NOT_FOUND, STORAGE_TYPE_INVALID
from app.db.models import User, File, FileOcrExtraction
from app.routes.v1.files import files_router
from fastapi import Depends, status, Request
from app.routes.v1.files.ocr_extractions.extract_data_route import (
    extract_data_with_regex,
)
from app.schemas.ocr_extraction_schemas import OcrExtractionWithRegex
from app.utils.auth import get_current_user
from app.utils.documentai.analyze import analyze_file
from app.dependencies import SessionDep
from app.utils.storage import download_firebase_file
from pydantic import BaseModel
from features_flags import features_flags


class ExtractionConfig(BaseModel):
    regex_fields: Optional[list[OcrExtractionWithRegex]]


@files_router.post(
    "/{id}/ocr_extractions/",
    description="Process OCR over file using any existing ocr method. If the file already had an ocr process associated, it will return the existing data.",
    status_code=status.HTTP_201_CREATED,
)
async def create_ocr_extraction(
    id: UUID,
    request: Request,
    session: SessionDep,
    extraction_config: Optional[ExtractionConfig] = None,
    current_user: User = Depends(get_current_user),
):
    db_file = session.exec(select(File).where(File.id == id)).first()

    if not db_file:
        raise LookupError(RESOURCE_NOT_FOUND)

    db_file_extraction = session.exec(
        select(FileOcrExtraction).where(FileOcrExtraction.file_id == id)
    ).first()

    # don't extract if the file is already extracted (save google-document-ai usage)
    if db_file_extraction:
        return db_file_extraction

    file_bytes = None

    if db_file.storage_type == "firebase":
        file_bytes = await download_firebase_file(db_file.uri)

    if db_file.storage_type == "local":
        with open(db_file.uri, "rb") as f:
            file_bytes = f.read()

    if not file_bytes:
        raise LookupError(STORAGE_TYPE_INVALID)

    analyzed_file = await analyze_file(
        file_bytes=file_bytes,
        content_type=db_file.mimetype.name,
        request=request,
    )
    # analyzed_file: Any = {
    #     "text": "email: example@gmail.com",
    #     "pages": [{"detectedLanguages": ["en"]}],
    # }  # mock
    new_file_extraction = None
    if features_flags.OCR_EXTRACTION_TYPE == "google_document_ai":
        new_file_extraction = FileOcrExtraction(
            text=analyzed_file["text"],
            # all pdf have only one page. (bussiness rule)
            detected_languages=analyzed_file["pages"][0]["detectedLanguages"],
            file_id=db_file.id,
            user_id=current_user.id,
            regex_extractions=[],
        )
    elif features_flags.OCR_EXTRACTION_TYPE == "pytesseract":
        # TODO: process file with pytesseract here.
        pass

    session.add(new_file_extraction)
    session.commit()
    session.refresh(new_file_extraction)

    if extraction_config and extraction_config.regex_fields:
        return await extract_data_with_regex(
            id=str(new_file_extraction.id),
            data=extraction_config.regex_fields,
            session=session,
        )

    return new_file_extraction
