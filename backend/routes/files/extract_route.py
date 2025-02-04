from sqlalchemy import select
from constants.errors_texts import RESOURCE_NOT_FOUND
from db.models import User, File, FileExtraction
from routes.files import files_router
from fastapi import Depends, status, Request
from utils.auth import get_current_user
from utils.documentai.analyze import analyze_file
from dependencies import SessionDep
from utils.firebase import download


@files_router.post(
    "/{id}/extract_data/",
    description="Extract data from an existing file",
    status_code=status.HTTP_201_CREATED,
)
async def extract_file_data(
    id: str,
    request: Request,
    session: SessionDep,
    # extraction_config: dict | None = None,
    current_user: User = Depends(get_current_user),
):
    db_file = session.exec(select(File).filter(File.id == id)).scalar_one_or_none()

    if not db_file:
        raise LookupError(RESOURCE_NOT_FOUND)

    db_file_extraction = session.exec(
        select(FileExtraction).filter(FileExtraction.file_id == id)
    ).scalar_one_or_none()

    # don't extract if the file is already extracted (save google-document-ai usage)
    if db_file_extraction:
        return db_file_extraction

    firebase_file_bytes = download(db_file.uri)
    analyzed_file = await analyze_file(
        file=firebase_file_bytes, content_type=file.mimetype, request=request
    )
    new_file_extraction = FileExtraction(
        name=db_file.name,
        text=analyzed_file["text"],
        detected_languages=analyzed_file["detected_languages"],
        extracted_data=analyzed_file["extracted_data"],
        file_id=db_file.id,
        user_id=current_user.id,
    )
    session.add(new_file_extraction)
    session.commit()
    session.refresh(new_file_extraction)
    return new_file_extraction

    # if request.client is None:
    #     # TODO: Add detail error message.
    #     raise HTTPException(status_code=400, detail="")

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

    # analyzed_file = await analyze_file(file, request)
    # with open("sample_analysis.json", "w", encoding="utf-8") as json_file:
    #     json.dump(analyzed_file, json_file, indent=4, ensure_ascii=False)

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
