from .pre_retrieval import hyde
from .post_retrieval import post_retrieval
from .retrieve import build_recursive_retriever
from .configure import config_LlamaIndex
from .main import run_pipeline

from llama_index.core import Settings
from llama_index.core import VectorStoreIndex
from llama_index.core.query_engine import RetrieverQueryEngine


def online_rag(query: str, index: VectorStoreIndex):
    # index.docstore already holds every parent node written during chunking
    # (see chunking.py) -- this IS the node_dict RecursiveRetriever needs to
    # resolve IndexNode.index_id references, no separate structure required.
    nodes_dict = index.docstore.docs

    optimised_query = hyde(llm_model=Settings.llm, embed_model=Settings.embed_model, query=query)
    retriever = build_recursive_retriever(index=index, nodes_dict=nodes_dict, top_k=10)
    reranker = post_retrieval(top_n=3)

    query_engine = RetrieverQueryEngine.from_args(
        retriever=retriever,
        node_postprocessors=[reranker],
        streaming=True,
    )

    response = query_engine.query(optimised_query)
    return response


if __name__ == "__main__":
    config_LlamaIndex()          # must run before anything touches Settings.llm/embed_model
    index = run_pipeline()       # builds a real index (with its docstore) in this same process
    response = online_rag("What is the name of the creator", index)
    print(response)
    index.storage_context.vector_store.client.close()  # explicit cleanup, avoids the __del__ race