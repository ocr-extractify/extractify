from pydantic import BaseModel
from sqlmodel import Session


async def sqlmodel_create(db: Session, data: BaseModel):
    db.add(data)
    db.commit()
    db.refresh(data)
    return data
