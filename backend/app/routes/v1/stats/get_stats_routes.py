from fastapi import status
from sqlmodel import select, func
from datetime import datetime
from app.dependencies.db import SessionDep
from app.schemas import Stats
from app.routes.v1.stats import stats_router
from app.db import File


@stats_router.get(
    "/",
    description="Get stats",
    status_code=status.HTTP_200_OK,
    response_model=Stats,
)
async def get_stats(session: SessionDep):
    # Get current time and define time boundaries
    now = datetime.now()
    start_of_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    start_of_year = now.replace(
        month=1, day=1, hour=0, minute=0, second=0, microsecond=0
    )

    # Query counts from the database
    total_count = session.exec(select(func.count()).select_from(File)).first()
    count_today = session.exec(
        select(func.count()).where(
            File.created_at >= start_of_today, File.created_at <= now
        )
    ).first()
    count_month = session.exec(
        select(func.count()).where(
            File.created_at >= start_of_month, File.created_at <= now
        )
    ).first()
    count_year = session.exec(
        select(func.count()).where(
            File.created_at >= start_of_year, File.created_at <= now
        )
    ).first()

    return Stats(
        processed_files_qty=total_count or 0,
        processed_files_qty_in_crt_day=count_today or 0,
        processed_files_qty_in_crt_month=count_month or 0,
        processed_files_qty_in_crt_year=count_year or 0,
    )
