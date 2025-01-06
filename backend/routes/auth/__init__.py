from fastapi import APIRouter

auth_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


from routes.auth.signin import *
from routes.auth.signup import *
