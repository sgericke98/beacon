import { NextResponse } from "next/server";
import connectors from "@/data/connectors.json" assert { type: "json" };
import fields from "@/data/fields.json" assert { type: "json" };
import { delay } from "@/lib/mock";

export async function GET() {
  await delay();
  const mapping = Object.entries(fields).map(([object, fieldDefinitions]) => ({
    object,
    fields: fieldDefinitions.slice(0, 4).map((field) => field.id),
  }));
  return NextResponse.json({ connectors, mapping });
}
