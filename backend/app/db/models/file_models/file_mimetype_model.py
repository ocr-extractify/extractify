from typing import TYPE_CHECKING
from datetime import datetime

# issue from sqlmodel. see: https://github.com/fastapi/sqlmodel/discussions/797
from sqlmodel import Field, Relationship, SQLModel, JSON, ARRAY, Column  # type: ignore[reportUnknownVariableType]
from app.db.models._sqlmodel import SQLModel

if TYPE_CHECKING:
    from app.db.models.file_models.file_model import File


class FileMimetype(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    files: list["File"] | None = Relationship(back_populates="file_mimetype")
