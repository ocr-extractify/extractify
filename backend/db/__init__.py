from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel import SQLModel, Session
from config import config
from db.models import *
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
from config import config

# DATABASE_URL = f"postgresql+asyncpg://{config.POSTGRES_USER}:{config.POSTGRES_PASSWORD}@{config.POSTGRES_HOST}:{config.POSTGRES_PORT}/{config.POSTGRES_DB}"
# engine = create_async_engine(str(config.SQLALCHEMY_DATABASE_URI), echo=True)
# async_session_factory = sessionmaker(
#     engine, expire_on_commit=False, class_=AsyncSession
# )
engine = create_engine(str(config.SQLALCHEMY_DATABASE_URI))


def setup_db():
    # async with engine.begin() as conn:
    #     # Use run_sync to ensure schema creation is compatible with AsyncEngine
    #     await conn.run_sync(SQLModel.metadata.create_all)
    SQLModel.metadata.create_all(engine)


def get_session():
    # async with async_session_factory() as session:
    #     yield session
    with Session(engine) as session:
        yield session
