from llama_index.core import SimpleDirectoryReader
from pathlib import Path

PERSONAL_INFO = Path(__file__).parent /"personal_info"

def load_personal_info():
    if not PERSONAL_INFO.exists():
        raise ValueError("NOT PERSONAL INFO FOLDER WAS FOUND")

    documents = SimpleDirectoryReader(input_dir=str(PERSONAL_INFO),required_exts=[".md",".txt",".pdf",".docx"]).load_data()
    return documents
