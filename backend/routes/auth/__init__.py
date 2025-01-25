from fastapi import APIRouter

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


from routes.auth.signin_route import *
from routes.auth.signup_route import *
from routes.auth.get_current_user_route import *
