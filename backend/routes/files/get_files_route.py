from sqlmodel import select
from routes.files import files_router
from fastapi import Query, status
from db.models import File, FileWithExtractions
from dependencies import SessionDep
from config import config


@files_router.get(
    "/",
    description="get all files",
    status_code=status.HTTP_200_OK,
    response_model=list[FileWithExtractions],
)
async def get_files(
    session: SessionDep,
    offset: int = 0,
    limit: int = Query(default=config.PAGINATION_LIMIT, le=config.PAGINATION_LIMIT),
):
    db_files = session.exec(select(File).offset(offset).limit(limit)).all()
    return db_files
