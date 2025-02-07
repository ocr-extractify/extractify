from datetime import timedelta
from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.routes.auth import auth_router
from app.schemas import Token
from app.utils.auth import authenticate_user, create_access_token
from config import config
from app.dependencies import SessionDep


@auth_router.post(
    "/signin/",
    status_code=status.HTTP_200_OK,
)
async def signin(
    user: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep
) -> Token:
    db_user = authenticate_user(session, user.username, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
