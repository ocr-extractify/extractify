from app.db.models.file_models.file_model import FileBase
from app.db.models.file_models.file_ocr_extraction_model import FileOcrExtraction


class FileWithOcrExtractions(FileBase):
    ocr_extractions: list[FileOcrExtraction] = []
