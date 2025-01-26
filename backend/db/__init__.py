from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session
from config import config
from db.models import *
from config import config

engine = create_engine(str(config.SQLALCHEMY_DATABASE_URI))


def setup_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
