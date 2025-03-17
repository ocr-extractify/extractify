from uuid import UUID
from pydantic import BaseModel
from app.db.models import User, FileSet, FileSetLink
from app.routes.files import files_router
from fastapi import Depends, status
from app.utils.auth import get_current_user
from app.dependencies import SessionDep


class FileSetSchema(BaseModel):
    name: str
    file_ids: list[UUID]


@files_router.post(
    "/sets/",
    description="Create a set of existing files",
    status_code=status.HTTP_201_CREATED,
)
async def create_file_set(
    file_set: FileSetSchema,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    file_set_db = FileSet(name=file_set.name, user_id=current_user.id)
    session.add(file_set_db)
    session.commit()
    session.refresh(file_set_db)

    file_set_link_db_list: list[FileSetLink] = []
    for file_id in file_set.file_ids:
        file_set_link_db = FileSetLink(file_id=file_id, file_set_id=file_set_db.id)
        file_set_link_db_list.append(file_set_link_db)

    session.add_all(file_set_link_db_list)
    session.commit()
    session.refresh(file_set_db)

    return file_set_db
