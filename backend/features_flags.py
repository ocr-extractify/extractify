from typing import Literal
from pydantic_settings import BaseSettings


class FeaturesFlags(BaseSettings):
    # TODO: implement tesseract.
    OCR_PROCESSOR_TYPE: Literal["google_document_ai", "tesseract"] = (
        "google_document_ai"
    )
    OCR_PROCESSING_ENABLED: bool = True
    STORAGE_TYPE: Literal["local", "firebase"] = "local"
    OCR_EXTRACTION_TYPE: Literal["google_document_ai", "pytesseract"] = (
        "google_document_ai"
    )
    CLOUD_PROVIDER: Literal["vercel", "vm"] = "vm"


features_flags = FeaturesFlags()  # type: ignore
