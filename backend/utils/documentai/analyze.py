import json
from fastapi import Request
from google.api_core.client_options import ClientOptions
from google.cloud import documentai_v1 as documentai
from config import config
from constants.errors_texts import (
    GOOGLE_DOCUMENT_AI_PROCESSOR_NOT_FOUND,
    INVALID_FILE_MIMETYPE,
)
from utils.google_auth.production_auth import get_production_creds


async def analyze_file(file_bytes: bytes, content_type: str, request: Request):
    """
    Extracts data from a file using Google Cloud Document AI.

    Args:
        file (bytes): The PDF file to extract data from.

    Returns:
        str: The extracted data from the PDF file.
    """
    if content_type not in config.VALID_MIMETYPES.split(","):
        raise TypeError(INVALID_FILE_MIMETYPE)

    opts = ClientOptions(
        api_endpoint=f"{config.G_DOCUMENT_AI_LOCATION}-documentai.googleapis.com",
    )

    # if production is None, use the local ADC login.
    prod_creds = await get_production_creds(request)
    client = documentai.DocumentProcessorServiceClient(
        client_options=opts, credentials=prod_creds
    )

    parent = client.common_location_path(
        config.G_DOCUMENT_AI_PROJECT_ID, config.G_DOCUMENT_AI_LOCATION
    )
    processor_list = client.list_processors(parent=parent)
    processor = next(
        filter(
            lambda v: v.display_name == config.G_DOCUMENT_AI_PROCESSOR, processor_list
        ),
        None,
    )
    if not processor:
        raise LookupError(GOOGLE_DOCUMENT_AI_PROCESSOR_NOT_FOUND)

    raw_document = documentai.RawDocument(content=file_bytes, mime_type=content_type)

    documentai_request = documentai.ProcessRequest(
        name=processor.name,
        raw_document=raw_document,
    )
    result = client.process_document(request=documentai_request)
    document = result.document

    return json.loads(documentai.Document.to_json(document))
