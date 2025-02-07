from constants.errors_texts import RESOURCE_NOT_FOUND
from db.models.file_models import FileWithExtractions
from routes.files import files_router
from sqlmodel import select
from fastapi import status
from db.models import File
from dependencies import SessionDep


@files_router.get(
    "/{id}",
    description="get a file by id",
    status_code=status.HTTP_200_OK,
    response_model=FileWithExtractions,
)
async def get_file(id: str, session: SessionDep):
    db_file = session.exec(select(File).where(File.id == id)).first()
    if not db_file:
        raise LookupError(RESOURCE_NOT_FOUND)

    return db_file
