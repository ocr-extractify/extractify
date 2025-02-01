from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from db import setup_db
from routes.auth import auth_router
from routes.files import files_router
from utils.firebase import setup_firebase
from utils.middlewares import ExceptionHandlerMiddleware


@asynccontextmanager
async def on_startup(app: FastAPI):
    setup_db()
    setup_firebase()
    yield


app = FastAPI(
    title="File to text", version="1.0.0", root_path="/api", lifespan=on_startup
)


app.include_router(auth_router)
app.include_router(files_router)
# app.include_router(stats_router)
# app.include_router(test_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ExceptionHandlerMiddleware)
