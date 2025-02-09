from app.constants.errors_texts import RESOURCE_NOT_FOUND
from app.db.models import FileOcrExtraction
from app.routes.files import files_router
from sqlmodel import select
from fastapi import status
from app.dependencies import SessionDep


@files_router.get(
    "/ocr_extractions/{id}/",
    description="get a file ocr extraction by id",
    status_code=status.HTTP_200_OK,
)
async def get_file(id: str, session: SessionDep):
    db_result = session.exec(
        select(FileOcrExtraction).where(FileOcrExtraction.id == id)
    ).first()
    if not db_result:
        raise LookupError(RESOURCE_NOT_FOUND)

    return db_result
