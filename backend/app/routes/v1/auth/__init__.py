from fastapi import APIRouter

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


from app.routes.v1.auth.signin_route import *
from app.routes.v1.auth.signup_route import *
from app.routes.v1.auth.get_current_user_route import *
