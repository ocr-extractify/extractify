from fastapi import APIRouter

files_router = APIRouter(
    prefix="/files",
    tags=["files"],
)

from app.routes.files.files.get_file_route import *
from app.routes.files.files.get_files_route import *
from app.routes.files.files.create_file_route import *
from app.routes.files.ocr_extractions.create_ocr_extraction_route import *
from app.routes.files.ocr_extractions.get_ocr_extraction_route import *
from app.routes.files.ocr_extractions.extract_data_route import *
from app.routes.files.files_sets.create_file_set_route import *
from app.routes.files.files_sets.get_files_sets_route import *
from app.routes.files.files_sets.get_files_set_route import *
from app.routes.files.files_sets.delete_file_set_route import *
