"use client";

import { useMemo } from "react";
import opportunities from "@/data/opportunities.json" assert { type: "json" };
import quotes from "@/data/quotes.json" assert { type: "json" };
import invoices from "@/data/invoices.json" assert { type: "json" };
import payments from "@/data/payments.json" assert { type: "json" };
import { PageHeader } from "@/components/PageHeader";
import { KPI } from "@/components/KPI";
import { ChartCard } from "@/components/ChartCard";
import { PivotConfigurator } from "@/components/PivotConfigurator";
import { createDeterministicRandom } from "@/lib/mock";

function daysBetween(start?: string, end?: string) {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
}

export default function L2CAnalysisPage() {
  const { unifiedRows, kpis, trendData, segmentData } = useMemo(() => buildAnalysis(), []);
  const fields = Object.keys(unifiedRows[0] ?? {});
  const numericFields = fields.filter((field) => typeof unifiedRows[0]?.[field as keyof (typeof unifiedRows)[0]] === "number");

  return (
    <div className="space-y-8">
      <PageHeader
        title="L2C Analysis"
        description="Monitor lead-to-cash health with cycle time trends, segment performance and configurable pivots."
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPI key={kpi.id} label={kpi.label} value={kpi.value} deltaPct={kpi.delta} format={kpi.format} seed={index + 1} />
        ))}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Quote-to-Cash trend" description="Rolling monthly average" type="line" data={trendData} xKey="month" yKeys={["quoteToCashDays"]} />
        <ChartCard
          title="Amount by segment"
          description="Sum of closed-won revenue"
          type="bar"
          data={segmentData}
          xKey="segment"
          yKeys={["amount"]}
        />
      </section>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Pivot lead-to-cash data</h2>
        <PivotConfigurator
          fields={fields}
          numericFields={numericFields}
          data={unifiedRows}
          initialConfig={{
            rows: ["segment"],
            cols: ["region"],
            values: [
              { field: "amount", agg: "sum" },
              { field: "quoteToCashDays", agg: "avg" },
            ],
          }}
        />
      </section>
    </div>
  );
}

function buildAnalysis() {
  const quotesByOpp = new Map(quotes.map((quote) => [quote.opportunityId, quote]));
  const invoicesByQuote = new Map(invoices.map((invoice) => [invoice.quoteId, invoice]));
  const paymentsByInvoice = new Map(payments.map((payment) => [payment.invoiceId, payment]));

  const unifiedRows = opportunities.map((opp) => {
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

  const paidDeals = unifiedRows.filter((row) => row.quoteToCashDays > 0);
  const random = createDeterministicRandom(5);

  const avgOppToQuote = average(paidDeals.map((row) => row.daysOppToQuote));
  const avgQuoteToOrder = average(paidDeals.map((row) => row.daysQuoteToInvoice));
  const avgOrderToInvoice = average(paidDeals.map((row) => row.daysQuoteToInvoice)); // Using same data for now
  const avgInvoiceToPayment = average(paidDeals.map((row) => row.daysInvoiceToPayment));

  const kpis = [
    { id: "oppToQuote", label: "Opportunity to Quote", value: avgOppToQuote, delta: random() / 10 - 0.05, format: "days" as const },
    { id: "quoteToOrder", label: "Quote to Order", value: avgQuoteToOrder, delta: random() / 10, format: "days" as const },
    { id: "orderToInvoice", label: "Order to Invoice", value: avgOrderToInvoice, delta: random() / 10 - 0.02, format: "days" as const },
    { id: "invoiceToPayment", label: "Invoice to Payment", value: avgInvoiceToPayment, delta: random() / 10 - 0.03, format: "days" as const },
  ];

  const trendMap = new Map<string, { month: string; quoteToCashDays: number[] }>();
  paidDeals.forEach((row) => {
    const month = new Date(row.closeDate ?? row.createdAt).toLocaleString("default", { month: "short", year: "2-digit" });
    if (!trendMap.has(month)) {
      trendMap.set(month, { month, quoteToCashDays: [] });
    }
    trendMap.get(month)!.quoteToCashDays.push(row.quoteToCashDays);
  });
  const trendData = Array.from(trendMap.values()).map((entry) => ({
    month: entry.month,
    quoteToCashDays: Number(average(entry.quoteToCashDays).toFixed(1)),
  }));

  const segmentMap = new Map<string, number>();
  paidDeals.forEach((row) => {
    const previous = segmentMap.get(row.segment) ?? 0;
    segmentMap.set(row.segment, previous + row.amount);
  });
  const segmentData = Array.from(segmentMap.entries()).map(([segment, amount]) => ({ segment, amount: Number(amount.toFixed(0)) }));

  return { unifiedRows, kpis, trendData, segmentData };
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
