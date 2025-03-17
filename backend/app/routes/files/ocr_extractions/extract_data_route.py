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
    db_file_ocr_extraction = session.exec(
        select(FileOcrExtraction).where(FileOcrExtraction.id == id)
    ).first()
    if not db_file_ocr_extraction:
        raise LookupError(RESOURCE_NOT_FOUND)

    extracted_data: list[OcrExtractionWithRegexResult] = []
    ocr_text = db_file_ocr_extraction.text

    for item in data:
        try:
            pattern = re.compile(item.regex)
        except re.error as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid regex pattern for '{item.name}': {str(e)}",
            )

        match = pattern.search(ocr_text)
        if match:
            if match.groups():
                value = match.group(1)
            else:
                value = match.group(0)
        else:
            value = ""

        extracted_data.append(OcrExtractionWithRegexResult(name=item.name, value=value))

    extracted_data_as_dicts = [item.model_dump() for item in extracted_data]
    db_file_ocr_extraction.regex_extractions = extracted_data_as_dicts  # type: ignore
    session.add(db_file_ocr_extraction)
    session.commit()

    return extracted_data
