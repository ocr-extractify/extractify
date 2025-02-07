import uuid
from datetime import datetime

# issue from sqlmodel. see: https://github.com/fastapi/sqlmodel/discussions/797
from sqlmodel import Field  # type: ignore[reportUnknownVariableType]
from app.db.models._sqlmodel import SQLModel


class User(SQLModel, table=True):
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    email: str = Field(index=True)
    password: str
    is_email_valid: bool | None = Field(default=False)
    is_deleted: bool | None = Field(default=False)
    created_at: datetime | None = Field(default_factory=datetime.now)
    updated_at: datetime | None = Field(default_factory=datetime.now)
