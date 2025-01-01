from typing import Any, Optional
from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

load_dotenv()


class Config(BaseSettings):
    MODE: str
    VALID_MIMETYPES: str

    G_DOCUMENT_AI_PROJECT_ID: str
    G_DOCUMENT_AI_LOCATION: str
    G_DOCUMENT_AI_PROCESSOR: str

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str
    POSTGRES_HOST: str

    MONTHLY_UPLOADS_LIMIT: int
    DAILY_UPLOADS_BY_IP_LIMIT: int
    UNRESTRICTED_IPS: str

    model_config = SettingsConfigDict(env_file=".env", extra="allow")


config = Config()
