import uuid
from datetime import datetime
from typing import TYPE_CHECKING

# issue from sqlmodel. see: https://github.com/fastapi/sqlmodel/discussions/797
from sqlmodel import Field, Relationship  # type: ignore[reportUnknownVariableType]
from app.db.models._sqlmodel import SQLModel

if TYPE_CHECKING:
    from app.db.models.file_models.file_model import File
    from app.db.models.file_models.file_set_model import FileSet
    from app.db.models.file_models.file_ocr_extraction_model import FileOcrExtraction


class User(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    email: str = Field(index=True)
    password: str
    is_email_valid: bool | None = Field(default=False)
    is_deleted: bool | None = Field(default=False)
    created_at: datetime | None = Field(default_factory=datetime.now)
    updated_at: datetime | None = Field(default_factory=datetime.now)

    # Relationships with cascade delete
    files: list["File"] = Relationship(back_populates="user", cascade_delete=True)
    file_sets: list["FileSet"] = Relationship(
        back_populates="user", cascade_delete=True
    )
    ocr_extractions: list["FileOcrExtraction"] = Relationship(
        back_populates="user", cascade_delete=True
    )

    @property
    def files_sets_qty(self) -> int:
        return len(self.file_sets)

    @property
    def files_qty(self) -> int:
        return len(self.files)

    @property
    def extractions_qty(self) -> int:
        return len(self.ocr_extractions)
