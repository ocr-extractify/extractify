import uuid
from datetime import datetime
from typing import TYPE_CHECKING

# issue from sqlmodel. see: https://github.com/fastapi/sqlmodel/discussions/797
from sqlmodel import Field, Relationship  # type: ignore[reportUnknownVariableType]
from app.db.models._sqlmodel import SQLModel

if TYPE_CHECKING:
    from app.db.models.file_models.file_model import File


class FileSetBase(SQLModel):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    name: str = Field(index=True)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    user_id: uuid.UUID = Field(foreign_key="user.id")


class FileSet(FileSetBase, table=True):
    files: list["FileSetLink"] = Relationship(
        back_populates="file_set",
    )


class FileSetLinkBase(SQLModel):
    file_id: uuid.UUID = Field(foreign_key="file.id", primary_key=True)
    file_set_id: uuid.UUID = Field(foreign_key="file_set.id", primary_key=True)


class FileSetLink(FileSetLinkBase, table=True):
    file: "File" = Relationship(back_populates="file_set_link")
    file_set: "FileSet" = Relationship(back_populates="files")
