import json
from db.models import User
from routes.files import files_router
from fastapi import Depends, HTTPException, UploadFile, status, Request
from utils.auth import get_current_user
from utils.documentai.analyze import analyze_file


@files_router.post(
    "/files/:id/extract/",
    description="Extract data from a file",
    status_code=status.HTTP_201_CREATED,
)
async def extract_file_data(
    request: Request,
    extraction_config: dict | None = None,
    current_user: User = Depends(get_current_user),
):
    pass
