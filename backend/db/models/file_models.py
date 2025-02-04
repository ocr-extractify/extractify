from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON, ARRAY, Column
import uuid
from db.models._sqlmodel import SQLModel


# TODO: split this into separate files
class FileMimetype(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())

    # files: list["File"] | None = Relationship(back_populates="filetype")


class FileExtraction(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    text: dict = Field(sa_column=Column(JSON))
    detected_languages: list[JSON] = Field(sa_column=Column(ARRAY(JSON)))
    extracted_data: dict | None = Field(default=None, sa_column=Column(JSON))
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    file_id: uuid.UUID = Field(foreign_key="file.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")

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

    # extractions: list["FileExtraction"] | None = Relationship(back_populates="file")
