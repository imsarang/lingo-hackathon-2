"use client";

import EmbedSection from "../components/embedding/EmbedSection";
import PolicyCompareSection from "../components/policy/PolicyCompareSection";
import CityInfoSection from "../components/geo/CityInfoSection";
import RagSection from "../components/rag/RagSection";
import SectionCard from "../components/SectionCard";
import { t } from "../lib/i18n";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-4 py-8">
        <header className="mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("app.title")}
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            {t("app.subtitle")}
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title={t("section.embed.title")}
            description={t("section.embed.description")}
          >
            <EmbedSection />
          </SectionCard>

          <SectionCard
            title={t("section.policy.title")}
            description={t("section.policy.description")}
          >
            <PolicyCompareSection />
          </SectionCard>

          <SectionCard
            title={t("section.geo.title")}
            description={t("section.geo.description")}
          >
            <CityInfoSection />
          </SectionCard>

          <SectionCard
            title={t("section.rag.title")}
            description={t("section.rag.description")}
          >
            <RagSection />
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
