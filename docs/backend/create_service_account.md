> [!WARNING]
> This is not the recommend way to authenticate with GCP services. For development, you should setup authentication as specified [here](https://cloud.google.com/document-ai/docs/setup#auth) or you can check `./setup_dev_auth_gcp.md` doc. 

A service account represents a Google Cloud service identity, such as code running on Compute Engine VMs, App Engine apps, or systems running outside Google.
 
These creds are used to identify your app and allow it use google APIS. 

1. Go to service accounts panel and click in ``CREATE SERVICE ACCOUNT` button.
   ![create service account](/docs/assets/create_service_account/image_1.png)
2. Input service account details.
3. Manage the service account roles (which service it has access). It's recommend restrict your service account to a specific scope. I'll configure it to have access only in document AI.
    ![create service account](/docs/assets/create_service_account/image_2.png)
4. Go to the `KEYS` tab after create your service account and create a new json private-key. It'll download the private key in your computer.


