from fastapi import Depends, status, Form
from app.db.models import User
from app.routes.v1.auth import auth_router
from app.utils.auth import get_current_user
from app.dependencies import SessionDep
from sqlmodel import select
from fastapi import HTTPException
from app.constants.errors_texts import USER_NOT_FOUND
from app.utils.auth import get_password_hash


@auth_router.patch(
    "/reset_pwd/",
    status_code=status.HTTP_200_OK,
)
async def reset_pwd(
    session: SessionDep,
    pwd: str = Form(...),
    current_user: User = Depends(get_current_user),
) -> User:
    existing_user = session.exec(
        select(User).where(User.email == current_user.email)
    ).first()
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=USER_NOT_FOUND,
        )

    hashed_password = get_password_hash(pwd)

    existing_user.password = hashed_password
    session.add(existing_user)
    session.commit()
    session.refresh(existing_user)

    return existing_user
