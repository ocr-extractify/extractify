from sqlalchemy import select


def is_table_empty(session, model) -> bool:
    return session.exec(select(model).limit(1)).first() is None
