from fastapi import APIRouter

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


from app.routes.auth.signin_route import *
from app.routes.auth.signup_route import *
from app.routes.auth.get_current_user_route import *
