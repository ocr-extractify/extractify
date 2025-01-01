from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship, JSON, ARRAY, Column
from sqlalchemy.dialects.postgresql import JSONB
from _types.DetectedLanguage import DetectedLanguage


class Filetype(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default=datetime.now())
    updated_at: datetime = Field(default=datetime.now())

    files: list["File"] | None = Relationship(back_populates="filetype")


class FileExtraction(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    # text: Dict = Field(default_factory=dict, sa_type=Field(JSONB))
    detected_languages: list[DetectedLanguage] = Field(
        sa_column=Column(ARRAY(DetectedLanguage))
    )
    # extracted_data: Dict | None = Field(default=None, sa_type=Field(JSONB))
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    file_id: int = Field(foreign_key="file.id")
    user_id: int = Field(foreign_key="user.id")

    class Config:
        arbitrary_types_allowed = True


class File(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str = Field(index=True)
    client_ip: str | None = Field(default=None)
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    filetype_id: int = Field(foreign_key="filetype.id")
    user_id: int = Field(foreign_key="user.id")

    extractions: list["FileExtraction"] | None = Relationship(back_populates="file")
