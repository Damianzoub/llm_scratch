from llama_index.core.retrievers import RecursiveRetriever
from llama_index.core import VectorStoreIndex


def build_recursive_retriever(index:VectorStoreIndex,nodes_dict:dict,top_k:int=10):
    base_index = index.as_retriever(similarity_top_k=top_k)
    return RecursiveRetriever(
        "vector",
        retriever_dict={"vector":base_index},
        node_dict=nodes_dict,
        verbose=False
    )