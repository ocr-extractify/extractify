from fastapi import status
from routes.auth import auth_router


@auth_router.post(
    "/signin/",
    status_code=status.HTTP_204_NO_CONTENT,
    response_model=None,
)
async def signin():
    pass
