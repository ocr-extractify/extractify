from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel
from config import config
from db.models import *

DATABASE_URL = f"postgresql+asyncpg://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@{config.POSTGRES_HOST}:{config.POSTGRES_PORT}/{config.POSTGRES_DB}"
engine = create_async_engine(DATABASE_URL, echo=True)


async def setup_db():
    async with engine.begin() as conn:
        # Use run_sync to ensure schema creation is compatible with AsyncEngine
        await conn.run_sync(SQLModel.metadata.create_all)
