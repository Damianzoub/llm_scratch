from .initialize import client
from qdrant_client import models

def create_or_update(COLLECTION_NAME:str,vectorID:str,vector_embed,metadata:dict|None):
    client.upsert(collection_name=COLLECTION_NAME,points=[models.PointStruct(id=vectorID,vector=vector_embed,metadata=metadata)])

def delete(COLLECTION_NAME:str):
    client.delete(collection_name=COLLECTION_NAME,points_selector=models.PointIdsList())

def search_by_similarity(COLLECTION_NAME:str,query,limit:int):
  return client.query_points(
       collection_name=COLLECTION_NAME,
       query = query,
       limit= limit
   )

def search_by_ID(COLLECTION_NAME:str,id:str):
   return client.retrieve(
        collection_name=COLLECTION_NAME,
        ids=[id]
    )
