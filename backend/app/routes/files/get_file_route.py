from app.constants.errors_texts import RESOURCE_NOT_FOUND
from app.db.models.file_models import FileWithOcrExtractions
from app.routes.files import files_router
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
async def get_file(id: str, session: SessionDep):
    db_file = session.exec(select(File).where(File.id == id)).first()
    if not db_file:
        raise LookupError(RESOURCE_NOT_FOUND)

    return db_file
