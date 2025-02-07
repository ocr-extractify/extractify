from fastapi import APIRouter

test_router = APIRouter(
    tags=["test"],
)


from routes.test.test_routes import *
