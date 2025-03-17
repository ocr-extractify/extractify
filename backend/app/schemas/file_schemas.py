from app.db.models.file_models.file_model import FileBase
from app.db.models.file_models.file_mimetype_model import FileMimetype
from app.db.models.file_models.file_ocr_extraction_model import FileOcrExtraction


class FileWithMimeType(FileBase):
    mimetype: FileMimetype


class FileWithOcrExtractions(FileBase):
    ocr_extractions: list[FileOcrExtraction] = []


class FileWithMimeTypeAndOcrExtractions(FileBase):
    mimetype: FileMimetype
    ocr_extractions: list[FileOcrExtraction] = []
