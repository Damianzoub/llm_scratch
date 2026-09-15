from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.llms.ollama import Ollama
from llama_index.core.callbacks import CallbackManager

def setup_embed_llm():
    llm = Ollama(
        model="mistral",
        base_url ="http://localhost:11434",
        temperature=0.1,
        request_timeout=60.0
    )

    

    embed = OllamaEmbedding(
        model_name="nomic-embed-text",
        base_url ="http://localhost:11434",
        callback_manager=CallbackManager()
    )

    return llm, embed

def hyde(llm_model,embed_model,query:str):
    prompt=f"""
Rephrase the user query in order to be precise and optimised, User Query {query}
"""
    response = llm_model.complete(prompt)
    return response.text.strip()



