## Backend Architecture & Folder Layout

This backend powers the PDF embedding, RAG, and policy-comparison workflows. It is designed around a few core capabilities:

- **SQS consumer & job pipeline** for embedding PDF data and storing vector embeddings in ChromaDB.
- **APIs** for comparing state policies and querying data for specific states/cities.
- **RAG pipeline** that uses a Hugging Face model, Lingo.dev for translation, and a text-to-speech tool.
- **Caching layer** using Redis for frequently accessed data and reports.
- **Server-Sent Events (SSE)** for streaming RAG responses in chunks to the frontend.

Below is a suggested folder structure and explanation for each part.

```text
backend/
  src/
    server.ts

    config/
      llm.config.ts          # Configuration for Hugging Face LLM (model name, provider, timeouts, etc.)
      redis.config.ts        # Redis connection and high-level cache settings
      sqs.config.ts          # SQS queue URLs, polling intervals, DLQ settings
      chroma.config.ts       # ChromaDB connection details and collection naming conventions
      tts.config.ts          # Text-to-speech provider configuration
      lingo.config.ts        # Lingo.dev API keys, base URLs, supported languages

    client/
      sqs.client.ts          # Low-level SQS client (send/receive/delete messages)
      chroma.client.ts       # Low-level ChromaDB client (create collections, upsert/query embeddings)
      redis.client.ts        # Low-level Redis client (get/set with basic helpers)
      lingo.client.ts        # Low-level Lingo.dev API client
      tts.client.ts          # Low-level text-to-speech client
      s3.client.ts           # Storage client for raw PDF files (if using S3 or equivalent)

    models/
      document.model.ts      # Types/interfaces for documents, pages, chunks
      location.model.ts      # Types for State, City, and hierarchical relationships
      policy.model.ts        # Types for policy documents, domains, and comparison inputs/outputs
      rag.model.ts           # Types for RAG requests, responses, and SSE streaming payloads
      job.model.ts           # Types for SQS jobs (embedding, RAG query, etc.)

    schema/
      chroma/
        state_city.schema.ts # Chroma collection & namespace/schema conventions for state/city hierarchy
                             # e.g., collection per state, partitioned or tagged by city

    routes/
      health.route.ts        # Health checks
      document.route.ts      # Routes for embedding docs & document-level operations
      policy.route.ts        # APIs to compare state policies
      geo.route.ts           # APIs to get data about a particular state/city
      rag.route.ts           # HTTP + SSE endpoints for RAG queries and streaming responses

    controllers/
      document.controller.ts # Handles HTTP for document upload/ingest + triggers embedding pipeline
      policy.controller.ts   # Handles policy comparison requests
      geo.controller.ts      # Handles state/city information requests
      rag.controller.ts      # Handles RAG queries, orchestrates translation, LLM, TTS, and SSE streaming

    services/
      embedding/
        pdf-extraction.service.ts   # Extracts text and metadata from PDFs
        chunking.service.ts         # Chunks text into passages suitable for embeddings
        embedding.service.ts        # Calls embedding model and pushes vectors + metadata to Chroma
        state-city-mapping.service.ts # Maps PDF/documents to state/city based on metadata/content

      policy/
        policy-comparison.service.ts  # Logic to compare policies between states
        policy-retrieval.service.ts   # Fetches relevant policy docs from Chroma based on query

      geo/
        geo-data.service.ts         # Provides state/city lookup and associated metadata

      rag/
        rag-retrieval.service.ts    # Retrieves context chunks from Chroma for a query
        rag-generation.service.ts   # Orchestrates calls to Hugging Face LLM to generate answers
        rag-translation.service.ts  # Uses Lingo.dev to translate prompts/answers as needed
        rag-tts.service.ts          # Uses TTS tool to convert text answers to speech
        rag-streaming.service.ts    # Packages and streams chunks over SSE

      cache/
        cache-key.service.ts        # Central place for cache key naming conventions
        cache.service.ts            # High-level caching for reports, RAG results, geo and policy data

      jobs/
        job-dispatcher.service.ts   # Creates and enqueues SQS jobs for embedding/RAG tasks
        job-handler.service.ts      # High-level dispatcher for processing SQS jobs

    workers/
      sqs-consumer.worker.ts        # Long-running SQS consumer that:
                                   # - pulls jobs
                                   # - routes them to appropriate pipelines (embedding, RAG, etc.)

    pipelines/
      embedding/
        embedding-pipeline.ts       # Coordinates full embedding flow: PDF → text → chunks → embeddings → Chroma
      rag/
        rag-pipeline.ts             # Coordinates RAG flow: query → retrieval → LLM → translation → TTS → SSE

    utils/
      logger.ts                     # Centralized logging logic
      error.ts                      # Error types and helpers
      sse.ts                        # Utilities for SSE event formatting
      pdf.ts                        # Common PDF parsing helpers
      env.ts                        # Environment variable validation and loading
```

### How this structure maps to your requirements

- **SQS consumer & embedding pipeline**  
  - `workers/sqs-consumer.worker.ts` consumes jobs from SQS.  
  - `services/jobs/*` defines how jobs are created and handled.  
  - `pipelines/embedding/embedding-pipeline.ts` plus `services/embedding/*` implement the steps:
    - read PDF (possibly via `client/s3.client.ts`)
    - extract and chunk text
    - compute embeddings
    - store into ChromaDB using `client/chroma.client.ts`.

- **Chroma collection schema for state / city hierarchy**  
  - `schema/chroma/state_city.schema.ts` and `models/location.model.ts` define the collection strategy.  
  - One recommended approach:
    - **Collection per state**: e.g., `maharashtra`, `karnataka`, etc.  
    - Each document/embedding in a state collection contains metadata:
      - `state`: `"maharashtra"`
      - `city`: `"mumbai" | "pune" | ...`
      - `doc_id`: logical document identifier
      - `section_id` or `chunk_id`
    - City-specific queries filter on `city` metadata while still living inside the state collection.
  - This gives you:
    - Clear **collection-level separation by state**.
    - Flexible **sub-grouping by city** via metadata fields rather than nested collections.

- **APIs**  
  - **Compare state policies**: `routes/policy.route.ts` → `controllers/policy.controller.ts` → `services/policy/*` + `client/chroma.client.ts`.  
  - **Get data about a particular point/city**: `routes/geo.route.ts` → `controllers/geo.controller.ts` → `services/geo/geo-data.service.ts` + Chroma & Redis as needed.  
  - **Embedding docs**: `routes/document.route.ts` → `controllers/document.controller.ts` → `pipelines/embedding/embedding-pipeline.ts`.
  - **RAG and SSE**: `routes/rag.route.ts` → `controllers/rag.controller.ts` → `pipelines/rag/rag-pipeline.ts` and `services/rag/*`, `utils/sse.ts`.

- **Caching with Redis**  
  - Low-level client in `client/redis.client.ts`, configuration in `config/redis.config.ts`.  
  - High-level usage centralized under `services/cache/*`:
    - common cache key structure in `cache-key.service.ts`
    - read-through / write-through patterns in `cache.service.ts` for:
      - policy comparison results
      - RAG results for popular queries
      - geo data for states/cities.

- **RAG pipeline with Hugging Face, Lingo.dev, and TTS**  
  - `config/llm.config.ts` defines which Hugging Face model and parameters to use.  
  - `services/rag/rag-retrieval.service.ts` uses `client/chroma.client.ts` to fetch relevant chunks.  
  - `services/rag/rag-generation.service.ts` calls the Hugging Face model.  
  - `client/lingo.client.ts` + `services/rag/rag-translation.service.ts` handle translation of prompts and outputs via Lingo.dev.  
  - `client/tts.client.ts` + `services/rag/rag-tts.service.ts` convert text to speech.  
  - `services/rag/rag-streaming.service.ts` and `utils/sse.ts` manage chunked responses over SSE.

- **Front-facing server**  
  - `server.ts` wires up:
    - configuration loading (`utils/env.ts`)
    - Express app
    - routes (`routes/*`)
    - middleware (CORS, JSON parsing, logging)

This layout keeps **clients**, **configs**, **business logic (services and pipelines)**, **transport (routes/controllers)**, and **background workers** clearly separated, making it easier to evolve your embedding and RAG flows as the project grows—without mixing infrastructure details with domain logic.

