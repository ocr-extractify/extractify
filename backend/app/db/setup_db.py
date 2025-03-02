from sqlalchemy import create_engine
from sqlmodel import SQLModel, Session
from config import config
from app.db.default_data import add_file_mimetype_records
from app.db.models import *  # noqa (required load all models for SQLModel.metadata.create_all)
from app.db.utils import is_table_empty

engine = create_engine(str(config.SQLALCHEMY_DATABASE_URI))


def setup_db():
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        if is_table_empty(session, FileMimetype):  # noqa: F405 (loaded with app.db.models)
            add_file_mimetype_records(session)


def get_session():
    with Session(engine) as session:
        yield session
