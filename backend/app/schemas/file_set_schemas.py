from typing import Optional
from app.db.models import FileSetBase, FileSetLinkBase
from app.schemas.file_schemas import FileWithMimeType


class FileSetLinkWithFile(FileSetLinkBase):
    file: FileWithMimeType


class FileSetWithFiles(FileSetBase):
    files: Optional[list[FileSetLinkWithFile]] = []
