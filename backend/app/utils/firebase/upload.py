from typing import Any
from fastapi import UploadFile
from app.constants.errors_texts import (
    FILE_CONTENT_TYPE_IS_MISSING,
    FILE_CONTENT_TYPE_IS_REQUIRED_IF_FILE_IS_BYTES,
)
from firebase_admin.storage import bucket  # type: ignore
import uuid


async def upload(
    file: UploadFile | bytes, firebase_folder: str, content_type: str | None = None
) -> str:
    """
    Uploads a file to Firebase storage.
    Args:
        file (UploadFile): The file object to be uploaded.
        firebase_folder (str): The folder in Firebase storage where the file will be stored.
        content_type (str): The content type of the file. Defaults to None, but required if file is bytes.
    Returns:
        str: The public URL of the uploaded file.
    """
    if isinstance(file, UploadFile) and not file.content_type:
        raise ValueError(FILE_CONTENT_TYPE_IS_MISSING)

    if isinstance(file, UploadFile):
        file = await file.read()

    if isinstance(file, bytes) and not content_type:
        raise ValueError(FILE_CONTENT_TYPE_IS_REQUIRED_IF_FILE_IS_BYTES)

    # unique id avoid user replace files in firebase and we can keep duplicated filenames in database
    filename = f"{firebase_folder}/{uuid.uuid4()}"
    bkt: Any = bucket()
    blob = bkt.blob(blob_name=filename)
    blob.upload_from_string(
        file,
        content_type=(
            file.content_type if isinstance(file, UploadFile) else content_type
        ),
    )
    blob.make_public()
    return blob.public_url
