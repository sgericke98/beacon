import { NextResponse } from "next/server";
import opportunities from "@/data/opportunities.json" assert { type: "json" };
import quotes from "@/data/quotes.json" assert { type: "json" };
import invoices from "@/data/invoices.json" assert { type: "json" };
import payments from "@/data/payments.json" assert { type: "json" };
import type { PivotConfig } from "@/types";
import { buildPivot } from "@/lib/pivot";
import { delay } from "@/lib/mock";

function daysBetween(start?: string, end?: string) {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
}

function buildRows() {
  const quotesByOpp = new Map(quotes.map((quote) => [quote.opportunityId, quote]));
  const invoicesByQuote = new Map(invoices.map((invoice) => [invoice.quoteId, invoice]));
  const paymentsByInvoice = new Map(payments.map((payment) => [payment.invoiceId, payment]));

  return opportunities.map((opp) => {
    const quote = quotesByOpp.get(opp.id);
    const invoice = quote ? invoicesByQuote.get(quote.id) : undefined;
    const payment = invoice ? paymentsByInvoice.get(invoice.id) : undefined;

    const daysOppToQuote = quote ? daysBetween(opp.createdAt, quote.createdAt) : 0;
    const daysQuoteToInvoice = invoice ? daysBetween(quote?.createdAt, invoice.issuedAt) : 0;
    const daysInvoiceToPayment = payment ? daysBetween(invoice?.issuedAt, payment.paidAt) : 0;
    const quoteToCashDays = daysOppToQuote + daysQuoteToInvoice + daysInvoiceToPayment;

    return {
      ...opp,
      quoteNumber: quote?.quoteNumber ?? "",
      invoiceStatus: invoice?.status ?? "",
      daysOppToQuote: Number(daysOppToQuote.toFixed(1)),
      daysQuoteToInvoice: Number(daysQuoteToInvoice.toFixed(1)),
      daysInvoiceToPayment: Number(daysInvoiceToPayment.toFixed(1)),
      quoteToCashDays: Number(quoteToCashDays.toFixed(1)),
      amount: Number(opp.amount ?? 0),
    };
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const configParam = url.searchParams.get("config");
  if (!configParam) {
    return NextResponse.json({ error: "Missing config" }, { status: 400 });
  }

  let config: PivotConfig;
  try {
    config = JSON.parse(configParam) as PivotConfig;
  } catch {
    return NextResponse.json({ error: "Invalid config" }, { status: 400 });
  }

  await delay();
  const rows = buildRows();
  const pivot = buildPivot(config, rows);
  return NextResponse.json({ pivot });
}
