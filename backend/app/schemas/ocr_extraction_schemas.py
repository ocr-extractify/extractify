from pydantic import BaseModel


class OcrExtractionWithRegex(BaseModel):
    name: str
    regex: str


class OcrExtractionWithRegexResult(BaseModel):
    name: str
    value: str
    regex: str
