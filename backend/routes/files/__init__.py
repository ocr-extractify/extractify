from fastapi import APIRouter

files_router = APIRouter(
    prefix="/files",
    tags=["files"],
)

from routes.files.get_file_route import *
from routes.files.get_files_route import *
from routes.files.upload_route import *
from routes.files.delete_route import *
from routes.files.extract_route import *
