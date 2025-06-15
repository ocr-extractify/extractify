from pydantic import BaseModel
from sqlmodel import Session, SQLModel


async def sqlmodel_update(db: Session, data: BaseModel, db_entity: SQLModel):
    """
    Updates a SQLModel entity with new data from a Pydantic BaseModel.

    This function handles the process of updating a database entity with new data,
    including committing the changes to the database and refreshing the entity.

    Args:
        db (Session): The SQLAlchemy database session.
        data (BaseModel): Pydantic BaseModel containing the new data.
        db_entity (SQLModel): The database entity to be updated.

    Returns:
        SQLModel: The updated database entity after commit.
    """
    data_json = data.model_dump(exclude_unset=True)
    db_entity.sqlmodel_update(data_json)
    db.add(db_entity)
    db.commit()
    db.refresh(db_entity)
    return db_entity
