import { NextResponse } from "next/server";
import suggestions from "@/data/cleaning-suggestions.json" assert { type: "json" };
import { delay } from "@/lib/mock";

export async function GET() {
  await delay();
  return NextResponse.json({ suggestions });
}
