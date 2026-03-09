"use client";

import { useState } from "react";
import { t } from "../../lib/i18n";

const STATES = ["Maharashtra", "Karnataka", "Gujarat", "Delhi"] as const;

export default function PolicyCompareSection() {
  const [stateA, setStateA] = useState<(typeof STATES)[number] | "">("");
  const [stateB, setStateB] = useState<(typeof STATES)[number] | "">("");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stateA || !stateB || !question) return;

    // TODO: Call backend API to compare policies between stateA and stateB.
    // Example (do not implement yet):
    // const res = await fetch("/api/v1/policy/compare", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ stateA, stateB, question }),
    // });
    // const data = await res.json();
    // setResult(data.summary);

    // Placeholder for now.
    setResult(
      `Stub: would compare policies between ${stateA} and ${stateB} for "${question}".`
    );
  }

  return (
    <form className="flex flex-col gap-2 text-sm" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <select
          value={stateA}
          onChange={(e) => setStateA(e.target.value as (typeof STATES)[number])}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs"
        >
          <option value="">Select state A</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={stateB}
          onChange={(e) => setStateB(e.target.value as (typeof STATES)[number])}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs"
        >
          <option value="">Select state B</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. Compare renewable energy subsidies and compliance requirements."
        rows={3}
        className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs"
      />

      <button
        type="submit"
        disabled={!stateA || !stateB || !question}
        className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {t("section.policy.button")} (stub)
      </button>

      {result && (
        <div className="mt-1 rounded-md bg-zinc-50 p-2 text-[11px] text-zinc-700">
          {result}
        </div>
      )}
    </form>
  );
}

