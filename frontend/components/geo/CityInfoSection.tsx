"use client";

import { useState } from "react";
import { t } from "../../lib/i18n";

const STATES = ["Maharashtra", "Karnataka", "Gujarat", "Delhi"] as const;
const CITIES_BY_STATE: Record<string, string[]> = {
  Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  Karnataka: ["Bengaluru", "Mysuru"],
  Gujarat: ["Ahmedabad", "Surat"],
  Delhi: ["New Delhi"],
};

export default function CityInfoSection() {
  const [state, setState] = useState<(typeof STATES)[number] | "">("");
  const [city, setCity] = useState<string>("");
  const [info, setInfo] = useState<string | null>(null);

  function handleStateChange(value: string) {
    setState(value as (typeof STATES)[number]);
    setCity("");
    setInfo(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!state || !city) return;

    // TODO: Call backend API to get state/city specific data.
    // Example (do not implement yet):
    // const res = await fetch(`/api/v1/geo?state=${state}&city=${city}`);
    // const data = await res.json();
    // setInfo(data.summary);

    // Placeholder for now.
    setInfo(`Stub: would show information for ${city}, ${state}.`);
  }

  const cities = state ? CITIES_BY_STATE[state] ?? [] : [];

  return (
    <form className="flex flex-col gap-2 text-sm" onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <select
          value={state}
          onChange={(e) => handleStateChange(e.target.value)}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs"
        >
          <option value="">Select state</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={!state}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs disabled:bg-zinc-100"
        >
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!state || !city}
        className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {t("section.geo.button")} (stub)
      </button>

      {info && (
        <div className="mt-1 rounded-md bg-zinc-50 p-2 text-[11px] text-zinc-700">
          {info}
        </div>
      )}
    </form>
  );
}

