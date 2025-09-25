import { NextResponse } from "next/server";
import invoices from "@/data/invoices.json" assert { type: "json" };
import customers from "@/data/customers.json" assert { type: "json" };

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const customerIds: string[] = body.customerIds ?? [];
  const invoiceIds: string[] = body.invoiceIds ?? [];

  const scopedInvoices = (invoices as typeof invoices).filter((invoice) => {
    if (customerIds.length > 0 && customerIds.includes(invoice.customerId)) return true;
    if (invoiceIds.length > 0 && invoiceIds.includes(invoice.invoiceId)) return true;
    return customerIds.length === 0 && invoiceIds.length === 0;
  });

  const uniqueCustomers = Array.from(new Set(scopedInvoices.map((invoice) => invoice.customerId)));
  const customerRecords = uniqueCustomers
    .map((id) => customers.find((customer) => customer.customerId === id))
    .filter(Boolean);

  const totalBalance = scopedInvoices.reduce((sum, invoice) => sum + invoice.amount - invoice.creditMemo, 0);

  const drafts = buildDrafts(customerRecords.map((customer) => customer!.name), totalBalance);

  return NextResponse.json({ drafts });
}

function buildDrafts(customers: string[], balance: number) {
  const customerList =
    customers.length === 0
      ? "your account"
      : customers.slice(0, 3).join(", ") + (customers.length > 3 ? " + more" : "");
  const balanceFormatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(balance);

  return [
    {
      tone: "Friendly",
      subject: "Quick check-in on open invoices",
      body: `Hi team,\n\nHope you're well! Noticed a few invoices (${customerList}) still showing open with a balance of ${balanceFormatted}. Could you confirm if there are approvals pending on your side? Happy to resend statements or jump on a call.\n\nThanks so much,\nBeacon Collections`,
    },
    {
      tone: "Firm",
      subject: "Action requested: upcoming payment commitments",
      body: `Hello,\n\nFollowing up on the ${balanceFormatted} balance. To keep services uninterrupted we need a promise-to-pay update by Friday. Please reply with the payment date or let us know what is blocking release.\n\nAppreciate your partnership,\nBeacon Collections`,
    },
    {
      tone: "Escalate",
      subject: "Escalation: overdue invoices",
      body: `Hi Finance Lead,\n\nSeveral invoices totaling ${balanceFormatted} are now over 60 days past due. We'd like to align on a recovery plan today — can we schedule a 15-minute call? If payment has already been sent, please share remittance details so we can reconcile.\n\nRegards,\nBeacon Collections`,
    },
  ];
}
