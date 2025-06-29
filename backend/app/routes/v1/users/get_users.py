from app.routes.v1.users import users_router
from app.dependencies import SessionDep
from app.db.models import User
from sqlmodel import select, text
from fastapi import status
from pydantic import BaseModel
from datetime import datetime
import uuid


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    password: str
    is_email_valid: bool | None
    is_deleted: bool | None
    created_at: datetime | None
    updated_at: datetime | None
    files_qty: int
    files_sets_qty: int
    extractions_qty: int


# TODO: add pagination
@users_router.get(
    "/", status_code=status.HTTP_200_OK, response_model=list[UserResponse]
)
async def get_users(session: SessionDep):
    # Get all users
    users = session.exec(select(User)).all()

    # For each user, count their related records using raw SQL
    result: list[UserResponse] = []
    for user in users:
        # Count files
        files_result = session.execute(
            text("SELECT COUNT(*) FROM file WHERE user_id = :user_id"),
            {"user_id": str(user.id)},
        )
        files_count = files_result.scalar()

        # Count file sets
        file_sets_result = session.execute(
            text("SELECT COUNT(*) FROM file_set WHERE user_id = :user_id"),
            {"user_id": str(user.id)},
        )
        file_sets_count = file_sets_result.scalar()

        # Count extractions
        extractions_result = session.execute(
            text("SELECT COUNT(*) FROM file_ocr_extraction WHERE user_id = :user_id"),
            {"user_id": str(user.id)},
        )
        extractions_count = extractions_result.scalar()

        result.append(
            UserResponse(
                id=user.id,
                email=user.email,
                password=user.password,
                is_email_valid=user.is_email_valid,
                is_deleted=user.is_deleted,
                created_at=user.created_at,
                updated_at=user.updated_at,
                files_qty=int(files_count or 0),
                files_sets_qty=int(file_sets_count or 0),
                extractions_qty=int(extractions_count or 0),
            )
        )

    return result
