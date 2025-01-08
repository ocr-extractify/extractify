from typing import Any, Optional
from pydantic import PostgresDsn, computed_field, model_validator
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Config(BaseSettings):
    MODE: str
    VALID_MIMETYPES: str

    # JWT CONFIG
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # GOOGLE DOCUMENT AI CREDENTIALS
    G_DOCUMENT_AI_PROJECT_ID: str
    G_DOCUMENT_AI_LOCATION: str
    G_DOCUMENT_AI_PROCESSOR: str

    # POSTGRESQL DATABASE CREDENTIALS
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: int
    POSTGRES_HOST: str

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_HOST,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    # RESTRICITON LIMITS
    MONTHLY_UPLOADS_LIMIT: int
    DAILY_UPLOADS_BY_IP_LIMIT: int
    UNRESTRICTED_IPS: str

    model_config = SettingsConfigDict(env_file=".env", extra="allow")


config = Config()
