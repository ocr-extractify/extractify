from typing_extensions import TypedDict, Optional


class DetectedLanguage(TypedDict, total=False):
    language_code: Optional[str]
    confidence: Optional[float]
