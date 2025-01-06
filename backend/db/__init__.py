from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel, Session
from config import config
from db.models import *
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

DATABASE_URL = f"postgresql+asyncpg://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@{config.POSTGRES_HOST}:{config.POSTGRES_PORT}/{config.POSTGRES_DB}"
engine = create_async_engine(DATABASE_URL, echo=True)
async_session_factory = sessionmaker(
    engine, expire_on_commit=False, class_=AsyncSession
)


async def setup_db():
    async with engine.begin() as conn:
        # Use run_sync to ensure schema creation is compatible with AsyncEngine
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session():
    async with async_session_factory() as session:
        yield session
