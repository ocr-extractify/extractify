from firebase_admin import credentials, initialize_app, _apps  # type: ignore

def setup_firebase():
    if not _apps:  # type: ignore
        print("initializing firebase")
        cred = credentials.Certificate("firebase.json")
        initialize_app(cred, {"storageBucket": "extractify-51ea1.firebasestorage.app"})