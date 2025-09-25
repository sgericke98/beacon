import { NextResponse } from "next/server";
import invoicesData from "@/data/invoices.json" assert { type: "json" };
import paymentsData from "@/data/payments.json" assert { type: "json" };
import customers from "@/data/customers.json" assert { type: "json" };

const NOW = new Date("2025-07-05");
const MS_IN_DAY = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bucket = url.searchParams.get("bucket") ?? "all";

  const paymentByInvoice = paymentsData.reduce<Map<string, number>>((map, payment) => {
    map.set(payment.invoiceId, (map.get(payment.invoiceId) ?? 0) + payment.amount);
    return map;
  }, new Map<string, number>());

  const customerById = new Map(customers.map((customer) => [customer.customerId, customer]));

  const rows = invoicesData
    .map((invoice) => {
      const paid = paymentByInvoice.get(invoice.invoiceId) ?? 0;
      const balance = Math.max(invoice.amount - paid - invoice.creditMemo, 0);
      const due = new Date(invoice.dueDate);
      const daysPastDue = Math.max(0, Math.floor((NOW.getTime() - due.getTime()) / MS_IN_DAY));
      const bucketLabel = determineBucket(daysPastDue);
      const customer = customerById.get(invoice.customerId);
      return {
        invoiceId: invoice.invoiceId,
        customer: customer?.name ?? invoice.customerId,
        dueDate: invoice.dueDate,
        daysPastDue,
        balance,
        bucket: bucketLabel,
        risk: customer?.risk ?? "Medium",
        segment: customer?.segment ?? "Mid-Market",
      };
    })
    .filter((row) => (bucket === "all" ? true : row.bucket === bucket))
    .sort((a, b) => b.balance - a.balance);

  const totalAr = rows.reduce((sum, row) => sum + row.balance, 0);
  const totalInvoices = invoicesData.reduce((sum, invoice) => sum + invoice.amount, 0);
  const dso = totalInvoices === 0 ? 0 : (totalAr / (totalInvoices / 90)) * 30;
  const over60 = rows.filter((row) => row.bucket === "61-90" || row.bucket === ">90").reduce((sum, row) => sum + row.balance, 0);
  const pctOver60 = totalAr === 0 ? 0 : over60 / totalAr;

  const cash30 = paymentsData
    .filter((payment) => {
      const daysAgo = Math.floor((NOW.getTime() - new Date(payment.date).getTime()) / MS_IN_DAY);
      return daysAgo <= 30;
    })
    .reduce((sum, payment) => sum + payment.amount, 0);

  const segments = buildSegments(rows);

  return NextResponse.json({
    metrics: {
      dso,
      arTotal: totalAr,
      pctOver60,
      cash30,
    },
    rows,
    segments,
  });
}

function determineBucket(daysPastDue: number) {
  if (daysPastDue === 0) return "0-30";
  if (daysPastDue <= 30) return "0-30";
  if (daysPastDue <= 60) return "31-60";
  if (daysPastDue <= 90) return "61-90";
  return ">90";
}

function buildSegments(rows: {
  bucket: string;
  risk: string;
  balance: number;
  segment: string;
  customer: string;
}[]) {
  const friendly = rows.filter((row) => row.bucket === "0-30");
  const firm = rows.filter((row) => row.bucket === "31-60" || row.risk === "Medium");
  const escalate = rows.filter((row) => row.bucket === "61-90" || row.bucket === ">90" || row.risk === "High" || row.risk === "Critical");

  return [
    {
      name: "Friendly check-in",
      summary: `${friendly.length} accounts <30 days past due — reinforce partnership tone and confirm invoice receipt.`,
    },
    {
      name: "Firm reminder",
      summary: `${firm.length} accounts require commitment. Highlight late fees and provide payment links.`,
    },
    {
      name: "Escalate",
      summary: `${escalate.length} accounts over 60 days. Loop in finance leadership and offer short-term plans.`,
    },
  ];
}
