from uuid import UUID
from fastapi import status
from sqlmodel import select, and_
from app.constants.errors_texts import RESOURCE_NOT_FOUND
from app.db.models import FileSet
from app.routes.v1.files import files_router
from app.schemas import FileSetWithFiles
from app.dependencies import SessionDep


@files_router.get(
    "/sets/{id}/",
    description="Get a single set of files",
    status_code=status.HTTP_200_OK,
    response_model=FileSetWithFiles,
)
async def get_files_sets(
    session: SessionDep,
    id: UUID,
):
    db_result = session.exec(
        select(FileSet).where(and_(FileSet.id == id, FileSet.is_deleted == False))
    ).first()
    if not db_result:
        raise LookupError(RESOURCE_NOT_FOUND)

    return db_result
