from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON, ARRAY, Column


class Filetype(SQLModel, table=True):
    __tablename__ = "filetype"
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())

    files: list["File"] | None = Relationship(back_populates="filetype")


class FileExtraction(SQLModel, table=True):
    __tablename__ = "file_extraction"
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    text: dict = Field(sa_column=Column(JSON))
    detected_languages: list[JSON] = Field(sa_column=Column(ARRAY(JSON)))
    extracted_data: dict | None = Field(default=None, sa_column=Column(JSON))
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    file_id: int = Field(foreign_key="file.id")
    user_id: int = Field(foreign_key="user.id")

    class Config:
        arbitrary_types_allowed = True


class File(SQLModel, table=True):
    __tablename__ = "file"
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    client_ip: str | None = Field(default=None)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    filetype_id: int = Field(foreign_key="filetype.id")
    user_id: int = Field(foreign_key="user.id")

    extractions: list["FileExtraction"] | None = Relationship(back_populates="file")
