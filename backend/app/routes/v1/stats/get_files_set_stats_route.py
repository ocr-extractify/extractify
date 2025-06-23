from uuid import UUID
from fastapi import status, HTTPException
from sqlmodel import select, and_
from app.constants.errors_texts import RESOURCE_NOT_FOUND
from app.db.models import FileSet
from app.routes.v1.stats import stats_router
from app.schemas import FileSetStats
from app.dependencies import SessionDep


@stats_router.get(
    "/files/sets/{id}",
    description="Get stats for a specific file set",
    status_code=status.HTTP_200_OK,
    response_model=FileSetStats,
)
async def get_ocr_extraction_stats(session: SessionDep, id: UUID):
    # Get the file set
    db_result = session.exec(
        select(FileSet).where(and_(FileSet.id == id, FileSet.is_deleted == False))
    ).first()

    if not db_result:
        raise HTTPException(status_code=404, detail=RESOURCE_NOT_FOUND)

    total_currency_value = 0.0
    total_files = len(db_result.files)

    # Calculate total currency value from regex extractions
    for file_link in db_result.files:
        file = file_link.file
        if file and file.ocr_extractions:
            for extraction in file.ocr_extractions:
                if extraction.regex_extractions:
                    for regex_extraction in extraction.regex_extractions:
                        # calc total currency value
                        if (
                            regex_extraction["regex"]
                            == "(?:R\\$|\\$|€|£|¥|₩)\\s?\\d{1,3}(?:[\\.,]\\d{3})*(?:[\\.,]\\d{2})?"
                        ):
                            # Extract numeric value from currency string (e.g., "R$ 515,18" -> 515.18)
                            value_str = regex_extraction["value"]
                            # Remove currency symbol and spaces, replace comma with dot
                            value_str = (
                                value_str.replace("R$", "").strip().replace(",", ".")
                            )
                            try:
                                total_currency_value += float(value_str)
                            except ValueError:
                                continue

    return FileSetStats(
        total_currency_value=total_currency_value, total_files=total_files
    )
