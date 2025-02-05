from firebase_admin.storage import bucket  # type: ignore
from urllib.parse import urlparse


async def download(file_uri: str) -> bytes:
    """
    Downloads a file from Firebase storage.
    Args:
        file_uri (str): The URI of the file to be downloaded.
    Returns:
        bytes: The file content.
    """
    parsed = urlparse(file_uri)

    # Extract path parts: ['', 'bucket-name', 'path', 'to', 'file']
    path_parts = parsed.path.strip("/").split("/")
    bucket_name = path_parts[0]
    blob_path = "/".join(path_parts[1:])

    bkt = bucket(bucket_name)
    blob = bkt.blob(blob_path)  # type: ignore
    return blob.download_as_bytes()  # type: ignore
