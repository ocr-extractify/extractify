from fastapi import status
from sqlmodel import select, func
from datetime import datetime, time, timezone
from zoneinfo import ZoneInfo
from typing import Optional
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


@stats_router.get(
    "/processed-files-qty",
    description="Get quantity of processed files for a date range with timezone support",
    status_code=status.HTTP_200_OK,
    response_model=int,
)
async def get_stats_by_date(
    session: SessionDep,
    start_date: datetime,
    end_date: datetime,
    tz: Optional[str] = None,
):
    if tz:
        try:
            target_tz = ZoneInfo(tz)
            start_dt = datetime.combine(start_date.date(), time.min).replace(
                tzinfo=target_tz
            )
            end_dt = datetime.combine(end_date.date(), time.max).replace(
                tzinfo=target_tz
            )
            start_dt_utc = start_dt.astimezone(timezone.utc)
            end_dt_utc = end_dt.astimezone(timezone.utc)

        except Exception:
            start_dt_utc = datetime.combine(start_date, time.min).replace(
                tzinfo=timezone.utc
            )
            end_dt_utc = datetime.combine(end_date, time.max).replace(
                tzinfo=timezone.utc
            )
    else:
        start_dt_utc = datetime.combine(start_date, time.min).replace(
            tzinfo=timezone.utc
        )
        end_dt_utc = datetime.combine(end_date, time.max).replace(tzinfo=timezone.utc)

    return session.exec(
        select(func.count()).where(
            File.created_at >= start_dt_utc, File.created_at <= end_dt_utc
        )
    ).first()
