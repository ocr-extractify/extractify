from fastapi import Depends, Query, status
from sqlmodel import select
from app.db.models import User, FileSet
from app.routes.files import files_router
from app.schemas import FileSetWithFiles
from app.utils.auth import get_current_user
from app.dependencies import SessionDep
from config import config


@files_router.get(
    "/set/",
    description="Get all file sets",
    status_code=status.HTTP_200_OK,
    response_model=list[FileSetWithFiles],
)
async def get_file_sets(
    session: SessionDep,
    current_user: User = Depends(get_current_user),
    offset: int = 0,
    limit: int = Query(default=config.PAGINATION_LIMIT, le=config.PAGINATION_LIMIT),
):
    db_file_sets = session.exec(
        select(FileSet)
        .where(FileSet.user_id == current_user.id)
        .offset(offset)
        .limit(limit)
    ).all()
    return db_file_sets
