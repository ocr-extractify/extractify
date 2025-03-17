from typing import Optional
from app.db.models import FileSetBase, FileSetLinkBase
from app.schemas.file_schemas import FileWithMimeTypeAndOcrExtractions


class FileSetLinkWithFile(FileSetLinkBase):
    file: FileWithMimeTypeAndOcrExtractions


class FileSetWithFiles(FileSetBase):
    files: Optional[list[FileSetLinkWithFile]] = []
