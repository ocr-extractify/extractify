from uuid import UUID
from fastapi import Depends, status, HTTPException, Response
from sqlmodel import select, and_
from app.db.models import User, FileSet
from app.routes.v1.files import files_router
from app.utils.auth import get_current_user
from app.dependencies import SessionDep
import csv
from io import StringIO


@files_router.get(
    "/sets/{id}/export",
    description="export report as csv",
    status_code=status.HTTP_200_OK,
)
async def export_report(
    id: UUID,
    session: SessionDep,
    current_user: User = Depends(get_current_user),
):
    db_file_set = session.exec(
        select(FileSet).where(
            and_(FileSet.user_id == current_user.id, FileSet.id == id)
        )
    ).first()

    if not db_file_set:
        raise HTTPException(status_code=404, detail="File set not found")

    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(
        [
            "Nome do arquivo",
            "Texto bruto",
            "Nome do campo de extração",
            "Valor do campo de extração",
        ]
    )

    for file_set_file in db_file_set.files:
        file = file_set_file.file
        for ocr_extraction in file.ocr_extractions:
            for regex_extraction in ocr_extraction.regex_extractions or []:
                writer.writerow(
                    [
                        file.name,
                        ocr_extraction.text,
                        regex_extraction["name"],
                        regex_extraction["value"],
                    ]
                )

    csv_content = output.getvalue()
    output.close()

    return Response(
        content=csv_content,
        media_type="text/csv",
        # headers={
        #     "Content-Disposition": f"attachment; filename=export_{db_file_set.name}.csv"
        # },
    )
