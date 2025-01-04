# from bson import ObjectId
# from routes.files import files_router
# from fastapi import UploadFile, status
# from db import db
# from schemas.files import FileModel
# from utils.documentai.analyze import analyze_file
# from utils.documentai.clean import clean_document_ai_analysis


# @files_router.delete(
#     "/{id}",
#     description="Delete a file by id",
#     status_code=status.HTTP_204_NO_CONTENT,
#     response_model=None,
# )
# async def delete(id: str):
#     doc_to_update = {"_id": ObjectId(id)}
#     data = {"$set": {"is_deleted": True}}
#     db.get_collection("files").update_one(doc_to_update, data)
