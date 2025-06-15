from fastapi import APIRouter

stats_router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)


from .get_stats_route import *
from .get_files_set_stats_route import *
