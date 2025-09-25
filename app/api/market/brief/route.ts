import { NextResponse } from "next/server";
import industries from "@/data/market/industries.json" assert { type: "json" };
import competitors from "@/data/market/competitors.json" assert { type: "json" };
import signals from "@/data/market/news_signals.json" assert { type: "json" };

export async function GET(request: Request) {
  const url = new URL(request.url);
  const industryParam = url.searchParams.get("industry") ?? "Enterprise SaaS";
  const regionParam = url.searchParams.get("region") ?? "NA";

  const industry = industries.find((item) => item.industry === industryParam) ?? industries[0];
  const tamSeries = industry.regions.map((entry) => ({
    region: entry.region,
    tam: entry.tam,
  }));
  const selectedTam = tamSeries.find((entry) => entry.region === regionParam) ?? tamSeries[0];
  const tamBand = selectedTam ? describeTam(selectedTam.tam) : "Unknown";

  const scopedCompetitors = (competitors as typeof competitors).filter(
    (competitor) => competitor.region === regionParam || competitor.region === "Global"
  );

  const triggerSignals = signals
    .filter((signal) => signal.summary.toLowerCase().includes(industry.industry.split(" ")[0].toLowerCase()) || true)
    .slice(0, 4);

  return NextResponse.json({
    metrics: {
      tamBand,
      competitorCount: scopedCompetitors.length,
      icpFit: industry.icpFit,
      triggers: triggerSignals.map((signal) => signal.signal ?? signal.headline),
    },
    tamSeries,
    competitors: scopedCompetitors.map((competitor) => ({
      name: competitor.name,
      positioning: competitor.positioning,
      winRate: competitor.winRate,
      strengths: competitor.strengths,
      weaknesses: competitor.weaknesses,
    })),
    signals: triggerSignals.map((signal) => ({
      headline: signal.headline,
      signal: signal.signal,
      impact: signal.impact,
      summary: signal.summary,
    })),
  });
}

function describeTam(value: number) {
  if (value >= 4) return `Upper band (${value.toFixed(1)}B)`;
  if (value >= 2) return `Growth band (${value.toFixed(1)}B)`;
  return `Emerging (${value.toFixed(1)}B)`;
}
