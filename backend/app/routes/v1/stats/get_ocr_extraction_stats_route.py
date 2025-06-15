from uuid import UUID
from fastapi import status
from app.dependencies.db import SessionDep
from app.routes.v1.stats import stats_router


@stats_router.get(
    "/ocr-extraction/{id}",
    description="Get stats",
    status_code=status.HTTP_200_OK,
    # response_model=Stats,
)
async def get_ocr_extraction_stats(session: SessionDep, id: UUID):
    return 200
