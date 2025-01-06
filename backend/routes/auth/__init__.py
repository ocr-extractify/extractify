from fastapi import APIRouter

files_router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


from routes.auth.signin import *
from routes.auth.signup import *
