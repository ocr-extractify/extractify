from routes.test import test_router
from fastapi import status


@test_router.get(
    "/ping",
    description="test api",
    status_code=status.HTTP_200_OK,
)
async def ping():
    return "pong"
