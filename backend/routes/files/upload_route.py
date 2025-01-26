import json
from db.models import User
from routes.files import files_router
from fastapi import Depends, HTTPException, UploadFile, status, Request
from utils.auth import get_current_user
from utils.documentai.analyze import analyze_file


@files_router.post(
    "/upload/",
    description="Upload a file.",
    status_code=status.HTTP_201_CREATED,
)
async def upload(
    request: Request,
    file: UploadFile,
    extraction_config: dict | None = None,
    current_user: User = Depends(get_current_user),
):
    if request.client is None:
        # TODO: Add detail error message.
        raise HTTPException(status_code=400, detail="")

    # check if there the quota per month is reached.
    # if current_month_uploads_qty >= config.MONTHLY_UPLOADS_LIMIT:
    #     raise HTTPException(status_code=400, detail=MONTHLY_LIMIT_REACHED)

    # check if user day quota is reached
    # is_client_restricted = request.client.host not in config.UNRESTRICTED_IPS
    # if is_client_restricted:
    #     start_of_day = datetime(now.year, now.month, now.day)
    #     client_daily_uploads_qty = await files_collection.count_documents(
    #         {"client_ip": request.client.host, "created_at": {"$gte": start_of_day}}
    #     )
    #     if client_daily_uploads_qty >= config.DAILY_UPLOADS_BY_IP_LIMIT:
    #         raise HTTPException(status_code=400, detail=CLIENT_DAY_LIMIT_REACHED)

    analyzed_file = await analyze_file(file, request)
    with open("sample_analysis.json", "w", encoding="utf-8") as json_file:
        json.dump(analyzed_file, json_file, indent=4, ensure_ascii=False)

    #  analyzed_file = await clean_document_ai_analysis(analyzed_file)

    # file_model = FileModel(
    #     name=file.filename or str(uuid.uuid4()),
    #     analysis=analyzed_file,
    #     client_ip=request.client.host,
    # )
    # file_dict = file_model.model_dump(by_alias=True, exclude={"id"})
    # new_db_file = await files_collection.insert_one(file_dict)
    # created_file = await files_collection.find_one({"_id": new_db_file.inserted_id})
    # return created_file
