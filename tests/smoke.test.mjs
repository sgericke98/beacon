import { describe, it } from "node:test";
import assert from "node:assert/strict";
import connectors from "../data/connectors.json" assert { type: "json" };
import datasets from "../data/datasets.json" assert { type: "json" };
import leakage from "../data/leakage-findings.json" assert { type: "json" };
import opportunities from "../data/opportunities.json" assert { type: "json" };

describe("Beacon data smoke tests", () => {
  it("has both Salesforce and NetSuite connectors", () => {
    const ids = connectors.map((connector) => connector.id);
    assert.ok(ids.includes("salesforce"));
    assert.ok(ids.includes("netsuite"));
  });

  it("lists dataset metadata", () => {
    assert.ok(Array.isArray(datasets));
    assert.ok(datasets.length >= 4);
    datasets.forEach((dataset) => {
      assert.ok(typeof dataset.id === "string");
      assert.ok(dataset.rowCount > 0);
    });
  });

  it("includes leakage findings with impact", () => {
    assert.ok(leakage.length > 0);
    const highImpact = leakage.filter((finding) => finding.impactUSD > 0);
    assert.ok(highImpact.length === leakage.length);
  });

  it("computes opportunity totals by segment", () => {
    const totals = new Map();
    opportunities.forEach((opp) => {
      const previous = totals.get(opp.segment) ?? 0;
      totals.set(opp.segment, previous + Number(opp.amount ?? 0));
    });
    assert.ok(totals.size > 0);
    for (const amount of totals.values()) {
      assert.ok(amount > 0);
    }
  });
});
