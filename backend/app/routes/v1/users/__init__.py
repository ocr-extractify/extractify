from fastapi import APIRouter

users_router = APIRouter(
    prefix="/users",
    tags=["users"],
)

from app.routes.v1.users.get_users import *
from app.routes.v1.users.delete_user import *
