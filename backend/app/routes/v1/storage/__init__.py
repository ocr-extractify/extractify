from fastapi import APIRouter

storage_router = APIRouter(
    prefix="/storage",
    tags=["storage"],
)

from app.routes.v1.storage.get_blob import *
