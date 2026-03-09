"use client";

import { useState } from "react";
import { useI18n } from "../i18n/I18nProvider";

export default function EmbedSection() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useI18n();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setIsSubmitting(true);

    // TODO: Call backend API to enqueue embedding job for this PDF.
    // Example (do not implement yet):
    // const formData = new FormData();
    // formData.append("file", file);
    // await fetch("/api/v1/document/embed", { method: "POST", body: formData });

    // For now, we just log to the console as a placeholder.
    console.log("Embed PDF stub:", file.name);

    setIsSubmitting(false);
  }

  return (
    <form className="flex flex-col gap-2 text-sm" onSubmit={handleSubmit}>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="text-xs"
      />
      <button
        type="submit"
        disabled={!file || isSubmitting}
        className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-300"
      >
        {isSubmitting ? "…" : t("section.embed.button")}
      </button>
      <p className="text-[11px] text-zinc-500">
        {/* TODO: Move this explanatory copy into locales if you want it translated as well. */}
        This will eventually send the selected PDF to your backend embedding pipeline via SQS.
      </p>
    </form>
  );
}

