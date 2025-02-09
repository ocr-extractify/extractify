from fastapi import APIRouter

files_router = APIRouter(
    prefix="/files",
    tags=["files"],
)

from app.routes.files.files.get_file_route import *
from app.routes.files.files.get_files_route import *
from app.routes.files.files.create_file_route import *
from app.routes.files.files.delete_file_route import *
from app.routes.files.ocr_extractions.create_ocr_extraction_route import *
from app.routes.files.ocr_extractions.get_ocr_extraction_route import *
