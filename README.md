# llm_scratch

A full-stack AI system built from the ground up: an LLM trained from scratch, a modern RAG pipeline, and a ChatGPT-like frontend — with a focus on finance/trading-domain knowledge.

## Status

- Frontend (Next.js chat UI)
- RAG offline pipeline (load → chunk → embed → store, via LlamaIndex + Qdrant)
- Backend (FastAPI, auth, DB) — inference routes pending
- LLM training from scratch — not started
- RAG retrieval + reranking — not started

## Tech Stack

Next.js, FastAPI, PostgreSQL, PyTorch, LlamaIndex, Qdrant, D2 (architecture diagrams)

## Running the RAG Offline Pipeline

```bash
python -m rag.main
```

Loads documents, chunks them (parent-child, with `IndexNode` resolution via a shared docstore), embeds them, and stores the result in local Qdrant (`./qdrant_data`).

## Architecture Diagrams

```bash
./architecture_design/setup_and_build.sh
```

## Author

Damianos Zoumpos
