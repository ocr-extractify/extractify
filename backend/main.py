from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app.db import setup_db
from app.routes.v1.auth import auth_router
from app.routes.v1.files import files_router
from app.routes.v1.stats import stats_router
from app.routes.v1.storage import storage_router
from app.routes.v1.users import users_router
from app.utils.storage import setup_firebase
from app.utils.middlewares import ExceptionHandlerMiddleware
from config import config


@asynccontextmanager
async def on_startup(app: FastAPI):
    setup_db()
    if config.IS_FIREBASE_ENABLED:
        setup_firebase()
    yield


# For v1 API, the prefix /v1 is omitted. for future api releases, its will be configured under /<version-number>
app = FastAPI(
    title="extractify",
    root_path="/api" if config.MODE == "prod" else "",
    version="1.0.0",
    lifespan=on_startup,  # root_path="/api"
)

app.include_router(auth_router)
app.include_router(files_router)
app.include_router(stats_router)
app.include_router(storage_router)
app.include_router(users_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ExceptionHandlerMiddleware)
