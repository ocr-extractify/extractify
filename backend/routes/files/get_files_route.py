from sqlalchemy.orm import selectinload
from sqlmodel import select
from routes.files import files_router
from fastapi import Query, status
from db.models import File
from dependencies import SessionDep
from config import config


@files_router.get(
    "/",
    description="get all files",
    status_code=status.HTTP_200_OK,
)
async def get_files(
    session: SessionDep,
    offset: int = 0,
    limit: int = Query(default=config.PAGINATION_LIMIT, le=config.PAGINATION_LIMIT),
):
    db_files = session.exec(
        select(File).options(selectinload(File.extractions)).offset(offset).limit(limit)
    ).all()
    return db_files
