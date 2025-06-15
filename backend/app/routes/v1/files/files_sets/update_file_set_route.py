from uuid import UUID
from pydantic import BaseModel
from typing import Optional
from fastapi import Depends, status, HTTPException
from sqlmodel import select, delete
from app.db.models import User, FileSet, FileSetLink
from app.routes.v1.files import files_router
from app.utils.auth import get_current_user
from app.dependencies import SessionDep
from app.db.utils import sqlmodel_update


class FileSetSchema(BaseModel):
    name: str
    file_ids: Optional[list[UUID]] = None


@files_router.patch(
    "/sets/{id}/",
    summary="Update a set of existing files",
    status_code=status.HTTP_201_CREATED,
)
async def update_file_set(
    id: UUID,
    file_set: FileSetSchema,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    file_set_db = session.exec(select(FileSet).where(FileSet.id == id)).first()

    if not file_set_db:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="")

    await sqlmodel_update(db=session, data=file_set, db_entity=file_set_db)

    # remove all existing links and add it again if set:
    if file_set.file_ids:
        session.exec(delete(FileSetLink).where(FileSetLink.file_set_id == id))  # type: ignore
        file_set_link_db_list: list[FileSetLink] = []

        for file_id in file_set.file_ids:
            file_set_link_db = FileSetLink(file_id=file_id, file_set_id=file_set_db.id)
            file_set_link_db_list.append(file_set_link_db)

        session.add_all(file_set_link_db_list)
        session.commit()

    return file_set_db
