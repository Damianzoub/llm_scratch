from .chunking import chunk_document 
from .configure import config_LlamaIndex
from .document_loader import load_personal_info
from .vectore_store import build_index

from llama_index.core.storage.docstore import SimpleDocumentStore

def run_pipeline():
    config_LlamaIndex()
    docstore = SimpleDocumentStore()
    docs = load_personal_info()
    nodes = [ n for doc in docs for n in chunk_document(doc,docstore=docstore)]
    index = build_index(nodes,docstore)
    return index

if __name__ == "__main__":
    run_pipeline()
    print("Index built successfully")

