import uuid
from typing import Any
from fastapi import UploadFile
from app.constants.errors_texts import (
    FILE_CONTENT_TYPE_IS_MISSING,
    FILE_CONTENT_TYPE_IS_REQUIRED_IF_FILE_IS_BYTES,
)
from firebase_admin.storage import bucket  # type: ignore
from config import config
from pathlib import Path

LOCAL_STORAGE_PATH = Path("app/storage")
LOCAL_STORAGE_PATH.mkdir(parents=True, exist_ok=True)


async def upload(
    file: UploadFile | bytes, firebase_folder: str, content_type: str | None = None
) -> str:
    """
    Uploads a file to the current storage type (local or Firebase).

    Args:
        file (UploadFile): The file object to be uploaded.
        firebase_folder (str): The folder in Firebase storage where the file will be stored. Used only if the storage type is Firebase.
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
    fuuid = uuid.uuid4()
    if config.STORAGE_TYPE == "firebase":
        filename = f"{firebase_folder}/{fuuid}"
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

    if config.STORAGE_TYPE == "local":
        LOCAL_STORAGE_PATH.mkdir(parents=True, exist_ok=True)
        file_path = LOCAL_STORAGE_PATH / str(fuuid)

        with file_path.open("wb") as f:
            f.write(file)

        return str(file_path)

    raise ValueError("Invalid storage type. Please check the `config.py` file.")
