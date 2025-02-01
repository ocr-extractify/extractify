from typing import Any
from fastapi import UploadFile
from constants.errors_texts import FILE_CONTENT_TYPE_IS_MISSING
from firebase_admin.storage import bucket  # type: ignore
import uuid


async def upload(file: UploadFile, firebase_folder: str) -> str:
    """
    Uploads a file to Firebase storage.
    Args:
        file (UploadFile): The file object to be uploaded.
        firebase_folder (str): The folder in Firebase storage where the file will be stored.
    Returns:
        str: The public URL of the uploaded file.
    """
    if not file.content_type:
        raise ValueError(FILE_CONTENT_TYPE_IS_MISSING)

    # unique id avoid user replace files in firebase and we can keep duplicated filenames in database
    filename = f"{firebase_folder}/{uuid.uuid4()}"
    bkt: Any = bucket()
    blob = bkt.blob(blob_name=filename)
    blob.upload_from_string(await file.read(), content_type=file.content_type)
    blob.make_public()
    return blob.public_url


async def upload_files(files: list[UploadFile], firebase_folder: str) -> list[str]:
    """
    Uploads a list of files to Firebase.
    Args:
        files (List[UploadFile]): A list of files to be uploaded.
        firebase_folder (str): The Firebase folder name where files will be stored.
    Returns:
        List[str]: A list containing the URLs of the uploaded files.
    """
    uploaded_urls: list[str] = []

    for file in files:
        file_url = await upload(file, firebase_folder)
        uploaded_urls.append(file_url)

    return uploaded_urls
