from pydantic import BaseModel


class Stats(BaseModel):
    processed_files_qty: int
    processed_files_qty_in_crt_day: int
    processed_files_qty_in_crt_month: int
    processed_files_qty_in_crt_year: int


class FileSetStats(BaseModel):
    total_currency_value: float
    total_files: int
