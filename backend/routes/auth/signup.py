from typing import Annotated
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from db.models import User
from routes.auth import auth_router
from dependencies import SessionDep


@auth_router.post(
    "/signup/",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
)
async def signup(
    user: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep
) -> User:
    db_user = User(
        email=user.username,
        password=user.password,
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
