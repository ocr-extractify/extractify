import uuid
from datetime import datetime
from typing import TYPE_CHECKING

# issue from sqlmodel. see: https://github.com/fastapi/sqlmodel/discussions/797
from sqlmodel import Field, Relationship  # type: ignore[reportUnknownVariableType]
from app.db.models._sqlmodel import SQLModel

if TYPE_CHECKING:
    from app.db.models.file_models.file_model import File
    from app.db.models.user_model import User


class FileSetBase(SQLModel):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    name: str = Field(index=True)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user_id: uuid.UUID = Field(foreign_key="user.id", ondelete="CASCADE")


class FileSet(FileSetBase, table=True):
    files: list["FileSetLink"] = Relationship(
        back_populates="file_set", cascade_delete=True
    )
    user: "User" = Relationship(back_populates="file_sets")


class FileSetLinkBase(SQLModel):
    file_id: uuid.UUID = Field(
        foreign_key="file.id", primary_key=True, ondelete="CASCADE"
    )
    file_set_id: uuid.UUID = Field(
        foreign_key="file_set.id", primary_key=True, ondelete="CASCADE"
    )


class FileSetLink(FileSetLinkBase, table=True):
    file: "File" = Relationship(back_populates="file_set_links")
    file_set: "FileSet" = Relationship(back_populates="files")
