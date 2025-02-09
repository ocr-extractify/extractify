import re
from app.constants.errors_texts import RESOURCE_NOT_FOUND
from app.db.models import FileOcrExtraction
from app.routes.files import files_router
from sqlmodel import select
from fastapi import HTTPException, status
from app.dependencies import SessionDep
from app.schemas.ocr_extraction_schemas import (
    OcrExtractionWithRegex,
    OcrExtractionWithRegexResult,
)


@files_router.post(
    "/ocr_extractions/{id}/extract_data_with_regex/",
    description="extract data of a file ocr extraction with regex",
    status_code=status.HTTP_200_OK,
    response_model=list[OcrExtractionWithRegexResult],
)
async def extract_data_with_regex(
    id: str, data: list[OcrExtractionWithRegex], session: SessionDep
):
    db_result = session.exec(
        select(FileOcrExtraction).where(FileOcrExtraction.id == id)
    ).first()
    if not db_result:
        raise LookupError(RESOURCE_NOT_FOUND)

    extracted_data: list[OcrExtractionWithRegexResult] = []
    ocr_text = db_result.text  # Assuming this is the OCR text stored in the model

    for item in data:
        try:
            # Compile the regex pattern
            pattern = re.compile(item.regex)
        except re.error as e:
            # Handle invalid regex syntax
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid regex pattern for '{item.name}': {str(e)}",
            )

        # Search for the pattern in the OCR text
        match = pattern.search(ocr_text)
        if match:
            # Use the first capturing group if available, otherwise the entire match
            if match.groups():
                value = match.group(1)
            else:
                value = match.group(0)
        else:
            value = ""

        extracted_data.append(OcrExtractionWithRegexResult(name=item.name, value=value))

    return extracted_data
