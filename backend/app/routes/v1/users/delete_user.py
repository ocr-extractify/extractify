from app.routes.v1.users import users_router
from app.dependencies import SessionDep
from app.db.models import User
from sqlmodel import select
from fastapi import status, HTTPException


# TODO: Implement soft-delete instead of hard-delete
@users_router.delete("/{user_id}", status_code=status.HTTP_200_OK, response_model=User)
async def delete_user(session: SessionDep, user_id: str):
    db_result = session.exec(select(User).where(User.id == user_id)).first()
    if not db_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    session.delete(db_result)
    session.commit()
    return db_result
