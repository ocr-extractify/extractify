from uuid import UUID
from app.constants.errors_texts import OCR_EXTRACTION_NOT_FOUND
from app.db.models import FileOcrExtraction
from app.routes.v1.files import files_router
from sqlmodel import select
from fastapi import status, HTTPException
from app.dependencies import SessionDep


@files_router.get(
    "/ocr_extractions/{id}/",
    description="get a file ocr extraction by id",
    status_code=status.HTTP_200_OK,
)
async def get_ocr_extraction(id: UUID, session: SessionDep):
    db_result = session.exec(
        select(FileOcrExtraction).where(FileOcrExtraction.id == id)
    ).first()

    if not db_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=OCR_EXTRACTION_NOT_FOUND
        )

    return db_result
