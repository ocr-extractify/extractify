from datetime import datetime, timedelta, timezone, date
from typing import Union
from schemas import Stats
from routes.stats import stats_router
from fastapi import status
from db import db


@stats_router.get(
    "/",
    description="Get stats for the uploaded files",
    status_code=status.HTTP_200_OK,
    response_model=Stats,
)
async def get_stats():
    files_collection = db.get_collection("files")

    uploaded_files_qty = await files_collection.count_documents({})
    now = datetime.now(timezone.utc)

    last_month = now - timedelta(days=30)
    uploaded_files_qty_month = await files_collection.count_documents(
        {"created_at": {"$gte": last_month}}
    )

    start_of_day = datetime(now.year, now.month, now.day)
    uploaded_files_qty_today = await files_collection.count_documents(
        {"created_at": {"$gte": start_of_day}}
    )

    last_week = now - timedelta(weeks=1)
    uploaded_files_qty_week = await files_collection.count_documents(
        {"created_at": {"$gte": last_week}}
    )

    return Stats(
        uploaded_files_qty=uploaded_files_qty,
        uploaded_files_qty_month=uploaded_files_qty_month,
        uploaded_files_qty_today=uploaded_files_qty_today,
        uploaded_files_qty_week=uploaded_files_qty_week,
    )


@stats_router.get(
    "/by_date_interval",
    description="Get the number of uploaded files in a date interval.",
    status_code=status.HTTP_200_OK,
    response_model=int,
)
async def get_stat(start_date: date, end_date: Union[date, None] = None):
    files_collection = db.get_collection("files")

    if end_date is None:
        end_date = start_date

    start_datetime = datetime.combine(start_date, datetime.min.time())
    end_datetime = datetime.combine(end_date, datetime.max.time())

    qty = await files_collection.count_documents(
        {"created_at": {"$gte": start_datetime, "$lt": end_datetime}}
    )
    return qty
