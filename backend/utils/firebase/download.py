from firebase_admin.storage import bucket  # type: ignore


async def download(file_uri: str) -> bytes:
    """
    Downloads a file from Firebase storage.
    Args:
        file_uri (str): The URI of the file to be downloaded.
    Returns:
        bytes: The file content.
    """
    bkt = bucket()
    blob = bkt.blob(file_uri)
    return blob.download_as_bytes()
