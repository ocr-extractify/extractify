import os
from PIL import Image
from pdf2image import convert_from_path
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

# Simple image to string
# print(pytesseract.image_to_string(Image.open('_tests/test.png')))


filePath = '_tests/test.pdf'
doc = convert_from_path(filePath)
path, fileName = os.path.split(filePath)
fileBaseName, fileExtension = os.path.splitext(fileName)

for page_number, page_data in enumerate(doc):
    txt = pytesseract.image_to_string(page_data).encode("utf-8")
    print("Page # {} - {}".format(str(page_number),txt))