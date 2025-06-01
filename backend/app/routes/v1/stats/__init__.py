from fastapi import APIRouter

stats_router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)


from routes.stats.get_routes import *
