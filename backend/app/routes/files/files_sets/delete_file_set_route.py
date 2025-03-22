from uuid import UUID
from fastapi import status
from sqlmodel import select
from app.constants.errors_texts import RESOURCE_NOT_FOUND
from app.db.models import FileSet
from app.routes.files import files_router
from app.schemas import FileSetWithFiles
from app.dependencies import SessionDep


@files_router.delete(
    "/sets/{id}/",
    description="Delete a single set of files",
    status_code=status.HTTP_200_OK,
    response_model=FileSetWithFiles,
)
async def delete_file_set(
    session: SessionDep,
    id: UUID,
):
    db_result = session.exec(select(FileSet).where(FileSet.id == id)).first()
    if not db_result:
        raise LookupError(RESOURCE_NOT_FOUND)

    db_result.is_deleted = True
    session.add(db_result)
    session.commit()
    session.refresh(db_result)

    return db_result
