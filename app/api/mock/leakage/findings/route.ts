import { NextResponse } from "next/server";
import findings from "@/data/leakage-findings.json" assert { type: "json" };
import { delay, createDeterministicRandom } from "@/lib/mock";

const CLAUSES = [
  "The supplier agrees to apply annual indexation aligned with CPI to maintain pricing parity.",
  "Discount exceeding the delegated authority must receive CFO approval prior to execution.",
  "Late payment penalties accrue after 15 days unless explicitly waived in writing.",
  "Contract renewals require confirmation of uplift within 30 days of term completion.",
];

export async function GET() {
  await delay();
  const random = createDeterministicRandom(11);
  const payload = (findings as Array<{ id: string }>).map((finding) => ({
    ...finding,
    snippet: CLAUSES[Math.floor(random() * CLAUSES.length)],
  }));
  return NextResponse.json({ findings: payload });
}
