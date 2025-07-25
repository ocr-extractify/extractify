from uuid import UUID
from app.constants.errors_texts import RESOURCE_NOT_FOUND
from app.schemas import FileWithOcrExtractions
from app.routes.v1.files import files_router
from sqlmodel import select
from fastapi import status
from app.db.models import File
from app.dependencies import SessionDep


@files_router.get(
    "/{id}",
    description="get a file by id",
    status_code=status.HTTP_200_OK,
    response_model=FileWithOcrExtractions,
)
async def get_file(id: UUID, session: SessionDep):
    db_result = session.exec(select(File).where(File.id == id)).first()
    if not db_result:
        raise LookupError(RESOURCE_NOT_FOUND)

    return db_result
