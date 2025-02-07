from sqlmodel import Session
from app.db.models import FileMimetype


def add_file_mimetype_records(
    session: Session,
):
    session.add_all(
        [
            FileMimetype(extension="pdf", name="application/pdf"),
            FileMimetype(extension="jpg", name="image/jpeg"),
            FileMimetype(extension="png", name="image/png"),
        ]
    )
    session.commit()
