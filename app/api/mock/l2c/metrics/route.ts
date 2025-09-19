import { NextResponse } from "next/server";
import opportunities from "@/data/opportunities.json" assert { type: "json" };
import quotes from "@/data/quotes.json" assert { type: "json" };
import invoices from "@/data/invoices.json" assert { type: "json" };
import payments from "@/data/payments.json" assert { type: "json" };
import { delay } from "@/lib/mock";

function daysBetween(start?: string, end?: string) {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export async function GET() {
  await delay();
  const quotesByOpp = new Map(quotes.map((quote) => [quote.opportunityId, quote]));
  const invoicesByQuote = new Map(invoices.map((invoice) => [invoice.quoteId, invoice]));
  const paymentsByInvoice = new Map(payments.map((payment) => [payment.invoiceId, payment]));

  const rows = opportunities.map((opp) => {
    const quote = quotesByOpp.get(opp.id);
    const invoice = quote ? invoicesByQuote.get(quote.id) : undefined;
    const payment = invoice ? paymentsByInvoice.get(invoice.id) : undefined;

    const daysOppToQuote = quote ? daysBetween(opp.createdAt, quote.createdAt) : 0;
    const daysQuoteToInvoice = invoice ? daysBetween(quote?.createdAt, invoice.issuedAt) : 0;
    const daysInvoiceToPayment = payment ? daysBetween(invoice?.issuedAt, payment.paidAt) : 0;
    const quoteToCash = daysOppToQuote + daysQuoteToInvoice + daysInvoiceToPayment;

    return {
      amount: Number(opp.amount ?? 0),
      daysOppToQuote,
      daysInvoiceToPayment,
      quoteToCash,
      converted: payment ? 1 : 0,
    };
  });

  const paid = rows.filter((row) => row.converted);

  const metrics = [
    { id: "quote_to_cash", label: "Quote-to-Cash Days", value: Number(average(paid.map((row) => row.quoteToCash)).toFixed(1)), unit: "days" },
    { id: "opp_to_quote", label: "Opp-to-Quote Days", value: Number(average(paid.map((row) => row.daysOppToQuote)).toFixed(1)), unit: "days" },
    {
      id: "invoice_to_payment",
      label: "Invoice-to-Payment Days",
      value: Number(average(paid.map((row) => row.daysInvoiceToPayment)).toFixed(1)),
      unit: "days",
    },
    { id: "conversion", label: "Conversion Rate", value: Number((paid.length / opportunities.length).toFixed(3)), unit: "count" },
    { id: "deal_size", label: "Avg Deal Size", value: Number(average(paid.map((row) => row.amount)).toFixed(0)), unit: "$" },
  ];

  return NextResponse.json({ metrics });
}
