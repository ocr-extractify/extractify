from app.db.models import FileSetBase, FileSetLinkBase, File


class FileSetLinkWithFile(FileSetLinkBase):
    file: File


class FileSetWithFiles(FileSetBase):
    files: list[FileSetLinkWithFile] = []
