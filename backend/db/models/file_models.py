from datetime import datetime

# issue from sqlmodel. see: https://github.com/fastapi/sqlmodel/discussions/797
from sqlmodel import Field, Relationship, SQLModel, JSON, ARRAY, Column  # type: ignore[reportUnknownVariableType]
import uuid
from db.models._sqlmodel import SQLModel


# TODO: split this into separate files
class FileMimetype(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    files: list["File"] | None = Relationship(back_populates="file_mimetype")


class FileExtraction(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    name: str = Field(index=True)
    text: str = Field()
    detected_languages: list[JSON] = Field(sa_column=Column(ARRAY(JSON)))
    extracted_data: dict | None = Field(default=None, sa_column=Column(JSON))
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    file_id: uuid.UUID = Field(foreign_key="file.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")

    file: "File" = Relationship(back_populates="extractions")

    class Config:
        arbitrary_types_allowed = True


class File(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    name: str = Field(index=True)
    client_ip: str | None = Field(default=None)
    uri: str = Field()
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    file_mimetype_id: int = Field(foreign_key="file_mimetype.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")

    file_mimetype: FileMimetype = Relationship(back_populates="files")
    extractions: list["FileExtraction"] | None = Relationship(
        back_populates="file",
        sa_relationship_kwargs={"lazy": "selectin"},
    )
