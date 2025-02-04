from datetime import datetime
from sqlmodel import Field, SQLModel
import uuid


class User(SQLModel, table=True):
    __tablename__ = "user"
    id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)
    email: str = Field(index=True)
    password: str
    is_email_valid: bool | None = Field(default=False)
    is_deleted: bool | None = Field(default=False)
    created_at: datetime | None = Field(default_factory=datetime.now)
    updated_at: datetime | None = Field(default_factory=datetime.now)
