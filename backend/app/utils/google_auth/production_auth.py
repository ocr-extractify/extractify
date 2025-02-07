import os
from fastapi import Request
from app.utils.google_auth.oidc import CustomOIDCCredentials
from config import config


async def get_production_creds(request: Request) -> CustomOIDCCredentials | None:
    """
    Retrieves production credentials for Google authentication.

    Args:
        request (Request): The request object.

    Returns:
        credentials (CustomOIDCCredentials | None): The production credentials if in production mode, otherwise None.
    """
    if config.MODE == "production":
        oidc_token = request.headers.get("x-vercel-oidc-token")
        return CustomOIDCCredentials(
            oidc_token=oidc_token,
            audience=f"//iam.googleapis.com/projects/{os.getenv('GCP_PROJECT_NUMBER')}/locations/global/workloadIdentityPools/{os.getenv('GCP_WORKLOAD_IDENTITY_POOL_ID')}/providers/{os.getenv('GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID')}",
            subject_token_type="urn:ietf:params:oauth:token-type:jwt",
            token_url="https://sts.googleapis.com/v1/token",
            service_account_impersonation_url=f"https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/{os.getenv('GCP_SERVICE_ACCOUNT_EMAIL')}:generateAccessToken",
            # not used, but the external_account.Credentials don't mark it as optional
            credential_source=None,
            scopes=["https://www.googleapis.com/auth/cloud-platform"],
        )
