from typing import Annotated
from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.db.models import User
from app.routes.v1.auth import auth_router
from app.dependencies import SessionDep
from app.utils.auth import get_password_hash
from sqlmodel import select
from app.constants.errors_texts import USER_ALREADY_EXISTS


@auth_router.post(
    "/signup/",
    status_code=status.HTTP_201_CREATED,
)
async def signup(
    user: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep
) -> User:
    existing_user = session.exec(
        select(User).where(User.email == user.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=USER_ALREADY_EXISTS
        )

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
