import uuid
from datetime import datetime
from typing import TYPE_CHECKING

# issue from sqlmodel. see: https://github.com/fastapi/sqlmodel/discussions/797
from sqlmodel import Field, Relationship  # type: ignore[reportUnknownVariableType]
from app.db.models._sqlmodel import SQLModel

if TYPE_CHECKING:
    from app.db.models.file_models.file_mimetype_model import FileMimetype
    from app.db.models.file_models.file_ocr_extraction_model import FileOcrExtraction
    from app.db.models.file_models.file_set_model import FileSetLink


class FileBase(SQLModel):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    name: str = Field(index=True)
    client_ip: str | None = Field(default=None)
    uri: str = Field()
    storage_type: str = Field(default="firebase")
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    mimetype_id: int = Field(foreign_key="file_mimetype.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")


class File(FileBase, table=True):
    mimetype: "FileMimetype" = Relationship(back_populates="files")
    ocr_extractions: list["FileOcrExtraction"] = Relationship(
        back_populates="file",
    )
    file_set_link: "FileSetLink" = Relationship(
        back_populates="file",
    )

    # file: "File" = Relationship(back_populates="file_set_links")
