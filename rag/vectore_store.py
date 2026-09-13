from vectorDB.initialize import start_vectorDB
from llama_index.core import VectorStoreIndex,StorageContext
from llama_index.vector_stores.qdrant import QdrantVectorStore

def build_index(nodes,docstore):
    client = start_vectorDB()
    vector_store = QdrantVectorStore(client=client,collection_name="my_documents")

    storage_content = StorageContext.from_defaults(vector_store=vector_store,docstore=docstore)
    
    index = VectorStoreIndex(
        nodes = nodes,
        storage_context = storage_content
    )
    return index