from fastapi import APIRouter

files_router = APIRouter(
    prefix="/files",
    tags=["files"],
)

from app.routes.files.get_file_route import *
from app.routes.files.get_files_route import *
from app.routes.files.upload_route import *
from app.routes.files.delete_route import *
from app.routes.files.extract_route import *
