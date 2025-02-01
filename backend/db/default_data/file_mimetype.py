from db.models import FileMimetype


def add_file_mimetype_records(
    session,
):
    session.add_all(
        [
            FileMimetype(extension="pdf", name="application/pdf"),
            FileMimetype(extension="jpg", name="image/jpeg"),
            FileMimetype(extension="png", name="image/png"),
        ]
    )
    session.commit()
