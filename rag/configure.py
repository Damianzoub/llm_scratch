from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.ollama import Ollama
from llama_index.embeddings.ollama import OllamaEmbedding

from dotenv import load_dotenv
import os 

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ENV = os.getenv("ENV")
def config_LlamaIndex():
    if ENV == "production":
        Settings.llm = OpenAI(
            model="gpt-5.6-luna",
            temperature=0.1,
            api_key= OPENAI_API_KEY,
            timeout=60.0
        )

        Settings.embed_model = OpenAIEmbedding(
            model="text-embedding-3-small",
            embed_batch_size=233,
            dimensions=3,
            api_key="OPENAI_API_KEY",
            callback_manager=CallbackManager()
        )
    else:
        Settings.llm = Ollama(
            model ="mistral",
            base_url="http://localhost:11434",
            temperature=0.1,
            request_timeout=60.0
        )

        Settings.embed_model = OllamaEmbedding(
            model_name="nomic-embed-text",
            base_url= "http://localhost:11434",
            callback_manager=CallbackManager()
        )