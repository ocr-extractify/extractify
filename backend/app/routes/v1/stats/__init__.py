from fastapi import APIRouter

stats_router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)


from .get_stats_routes import *
