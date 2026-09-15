from llama_index.core.postprocessor import LLMRerank
from llama_index.core import Settings

def post_retrieval(top_n:int=3):
    return LLMRerank(llm=Settings.llm,top_n=top_n)