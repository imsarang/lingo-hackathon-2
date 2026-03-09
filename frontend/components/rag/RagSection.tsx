"use client";

import { useState } from "react";
import { t } from "../../lib/i18n";

export default function RagSection() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!question) return;

    setIsStreaming(true);
    setAnswer("");

    // TODO: Call backend SSE endpoint for RAG responses.
    // Example (do not implement yet):
    // const response = await fetch("/api/v1/rag/stream", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ question }),
    // });
    // const reader = response.body?.getReader();
    // Read chunks and append to `answer` state as they arrive.

    // Placeholder streaming simulation.
    setTimeout(() => {
      setAnswer(
        "Stub: this is where a streamed RAG answer would appear, chunk by chunk."
      );
      setIsStreaming(false);
    }, 500);
  }

  return (
    <form className="flex flex-col gap-2 text-sm" onSubmit={handleSubmit}>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about a state's policies or a specific city..."
        rows={3}
        className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs"
      />

      <button
        type="submit"
        disabled={!question || isStreaming}
        className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {isStreaming ? "Streaming (stub)..." : `${t("section.rag.button")} (stub)`}
      </button>

      {answer && (
        <div className="mt-1 max-h-32 overflow-y-auto rounded-md bg-zinc-50 p-2 text-[11px] text-zinc-700">
          {answer}
        </div>
      )}
    </form>
  );
}

