import { NextResponse } from "next/server";
import datasets from "@/data/datasets.json" assert { type: "json" };
import { delay } from "@/lib/mock";

export async function GET() {
  await delay();
  return NextResponse.json({ datasets });
}
