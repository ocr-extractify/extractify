from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import setup_db

# from routes.files import files_router
# from routes.stats import stats_router
# from routes.test import test_router
from utils.middlewares import ExceptionHandlerMiddleware


async def on_startup():
    await setup_db()


app = FastAPI(
    title="File to text", version="1.0.0", root_path="/api", on_startup=[on_startup]
)


# app.include_router(files_router)
# app.include_router(stats_router)
# app.include_router(test_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(ExceptionHandlerMiddleware)
