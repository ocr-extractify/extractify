from typing import Any
from sqlalchemy import select
from sqlmodel import Session


# TODO: type `model` param properly
def is_table_empty(session: Session, model: Any) -> bool:
    return session.exec(select(model).limit(1)).first() is None
