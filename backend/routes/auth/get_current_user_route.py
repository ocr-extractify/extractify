from fastapi import Depends, status
from db.models import User
from routes.auth import auth_router
from utils.auth import get_current_user


@auth_router.get(
    "/me/",
    status_code=status.HTTP_200_OK,
)
async def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user
