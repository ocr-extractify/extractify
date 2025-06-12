from fastapi import Depends, status, HTTPException
from sqlmodel import select, and_
from app.db.models import User, FileSet
from app.routes.v1.files import files_router
from app.schemas import FileSetWithFiles
from app.utils.auth import get_current_user
from app.dependencies import SessionDep


@files_router.get(
    "/sets/{id}/export",
    description="export report as csv",
    status_code=status.HTTP_200_OK,
    response_model=list[FileSetWithFiles],
)
async def export_report(
    id: int,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    db_file_set = session.exec(
        select(FileSet).where(
            and_(FileSet.user_id == current_user.id, FileSet.id == id)
        )
    ).first()
    if not db_file_set:
        raise HTTPException(status_code=404, detail="File set not found")

    return db_file_set
