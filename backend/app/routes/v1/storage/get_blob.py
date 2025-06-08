import os
import mimetypes
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from app.routes.v1.storage import storage_router

_path = "app/storage"


@storage_router.get("/")
async def get_blob(path: str):
    path = path.replace("app/storage", "")
    path = path.replace("/", "")
    filepath = os.path.join(_path, path)

    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")

    media_type, _ = mimetypes.guess_type(filepath)
    media_type = media_type or "application/octet-stream"
    return StreamingResponse(open(filepath, "rb"), media_type=media_type)
