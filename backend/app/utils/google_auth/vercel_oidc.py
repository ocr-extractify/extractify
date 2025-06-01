import os
from google.auth import external_account, exceptions


# The `external_account.credentials` class call `super(Credentials, self).__init__()` multiples times and the `oidc_token` attribute is passed only once when we call it directly in our app code. The solution was create a class variable to store the `oidc_token`.
class CustomOIDCCredentials(external_account.Credentials):
    oidc_token = None

    def __init__(self, oidc_token=None, *args, **kwargs):
        if oidc_token:
            CustomOIDCCredentials.oidc_token = oidc_token

        super(CustomOIDCCredentials, self).__init__(*args, **kwargs)

    def retrieve_subject_token(self, request):
        # https://www.npmjs.com/package/@vercel/functions?activeTab=code
        try:
            env_token = os.getenv("VERCEL_OIDC_TOKEN")
            if env_token:
                return env_token

            print("oidc_token: ", self.__class__.oidc_token)
            if not self.__class__.oidc_token:
                raise ValueError(
                    "The 'x-vercel-oidc-token' header is missing from the request. Do you have the OIDC option enabled in the Vercel project settings?"
                )

            return self.__class__.oidc_token

        except Exception as e:
            raise exceptions.RefreshError(e, retryable=True)
