from datetime import datetime
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "user"
    id: int = Field(primary_key=True)
    email: str = Field(index=True)
    password: str
    is_email_valid: bool | None = Field(default=False)
    is_deleted: bool | None = Field(default=False)
    created_at: datetime | None = Field(default_factory=datetime.now)
    updated_at: datetime | None = Field(default_factory=datetime.now)
