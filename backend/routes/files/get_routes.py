from routes.files import files_router
from fastapi import status


@files_router.get(
    "/",
    description="get all files",
    status_code=status.HTTP_200_OK,
)
async def get_files():
    pass


@files_router.get(
    "/{id}",
    description="get a file by id",
    status_code=status.HTTP_200_OK,
)
async def get_file(id: str):
    pass
