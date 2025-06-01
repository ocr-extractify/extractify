from typing import TYPE_CHECKING, Any, Optional
from datetime import datetime

# issue from sqlmodel. see: https://github.com/fastapi/sqlmodel/discussions/797
from sqlmodel import Field, Relationship, JSON, ARRAY, Column  # type: ignore[reportUnknownVariableType]
import uuid
from app.db.models._sqlmodel import SQLModel

if TYPE_CHECKING:
    from app.db.models.file_models.file_model import File


class FileOcrExtraction(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    text: str = Field()
    detected_languages: list[dict[str, Any]] = Field(sa_column=Column(ARRAY(JSON)))
    regex_extractions: Optional[list[dict[str, Any]]] = Field(
        sa_column=Column(ARRAY(JSON))
    )
    is_deleted: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    file_id: uuid.UUID = Field(foreign_key="file.id")
    user_id: uuid.UUID = Field(foreign_key="user.id")

    file: "File" = Relationship(back_populates="ocr_extractions")

    class Config:
        arbitrary_types_allowed = True
