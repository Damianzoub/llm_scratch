from qdrant_client import QdrantClient

def start_vectorDB() -> QdrantClient:
    return QdrantClient(path="./qdrant_data")
    





    