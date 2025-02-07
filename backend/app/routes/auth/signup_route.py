from typing import Annotated
from fastapi import Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.db.models import User
from app.routes.auth import auth_router
from app.dependencies import SessionDep
from app.utils.auth import get_password_hash


@auth_router.post(
    "/signup/",
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    user: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep
) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.username,
        password=hashed_password,
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    # TODO: hide user password (probably should be done in model directly)
    return db_user
