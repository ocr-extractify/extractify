from fastapi import Request
from google.oauth2 import service_account
from app.utils.google_auth.vercel_production_auth import get_vercel_production_creds
from features_flags import features_flags
from typing import Optional
from google.auth import credentials as ga_credentials


async def get_prod_creds(request: Request) -> Optional[ga_credentials.Credentials]:
    """
    Asynchronously retrieves production credentials based on the configured cloud provider.

    - If CLOUD_PROVIDER == "vercel", delegates to the existing Vercel helper.
    - If CLOUD_PROVIDER == "vm", loads a local service-account JSON for Document AI.

    Args:
        request (Request): The incoming request object.

    Returns:
        Optional[ga_credentials.Credentials]: The production credentials, or None if none are applicable.
    """
    prod_creds: Optional[ga_credentials.Credentials] = None

    if features_flags.CLOUD_PROVIDER == "vercel":
        # Delegate to Vercel-specific credential logic
        prod_creds = await get_vercel_production_creds(request)
    elif features_flags.CLOUD_PROVIDER == "vm":
        # Load the service-account JSON key from disk
        key_path = "creds/g_doc_ai.json"
        prod_creds = service_account.Credentials.from_service_account_file(
            key_path,
            scopes=["https://www.googleapis.com/auth/cloud-platform"],
        )

    return prod_creds
