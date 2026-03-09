## Lingo Policy Explorer – Frontend

Simple Next.js UI for:

- **Embedding PDFs** into the backend vector/embedding pipeline.
- **Comparing state policies** via a small form.
- **Looking up city / point data**.
- **Running RAG-style questions** with (future) streamed SSE answers.

This frontend is intentionally minimal and modular – it wires up basic forms and layout, but **does not call any backend APIs yet**. Places where API calls should be added are marked with clear `TODO` comments.

---

## Folder structure

```text
frontend/
  app/
    layout.tsx        # Root layout, metadata, global styles
    page.tsx          # Main dashboard page that composes the simple UI sections

  components/
    SectionCard.tsx   # Reusable card wrapper for each section

    embedding/
      EmbedSection.tsx        # PDF upload form → will trigger embedding pipeline

    policy/
      PolicyCompareSection.tsx # Compare two states for a given policy question

    geo/
      CityInfoSection.tsx     # Select state + city and view basic info

    rag/
      RagSection.tsx          # Ask a question and show a stubbed streamed answer

  public/
    ... default icons/assets ...
```

All UI logic lives in small, focused components under `components/`. The top-level `app/page.tsx` just arranges these into a simple, readable dashboard.

---

## UI overview

- **Home dashboard (`app/page.tsx`)**
  - Uses `SectionCard` to show four simple panels:
    - **Embed PDFs** – upload a PDF file and submit (currently logs to console).
    - **Compare state policies** – select state A/B, type a question, and get a stub result.
    - **City / point data** – pick a state and city, then see placeholder info.
    - **RAG Q&A (streamed)** – text area to ask a question and see a stub “streamed” response.

- **Components**
  - `SectionCard.tsx`
    - Lightweight layout component for a titled card with description and children.
  - `embedding/EmbedSection.tsx`
    - File input for PDFs and a submit button.
    - Contains a `TODO` comment where the backend **document embed** API should be called.
  - `policy/PolicyCompareSection.tsx`
    - Simple state dropdowns and a question textarea.
    - Contains a `TODO` comment where a **policy comparison** API should be called.
  - `geo/CityInfoSection.tsx`
    - State and city dropdowns with a small placeholder result.
    - Contains a `TODO` comment where a **geo/city data** API should be called.
  - `rag/RagSection.tsx`
    - Textarea for a question and a basic stub of a “streamed” answer.
    - Contains a `TODO` comment where a **RAG SSE endpoint** should be called.

Each component is marked with `"use client"` so it can use React hooks for local state, but no data is persisted or sent to the backend yet.

---

## Running the frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.

You should see the **Lingo Policy Explorer** dashboard with four simple sections. Interactions currently just update local state and log to the console – they are ready to be wired to the backend once your APIs are available.

