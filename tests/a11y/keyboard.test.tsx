import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/invoices",
  useRouter: () => ({ push: () => {}, replace: () => {}, refresh: () => {} }),
}));

const { AppChrome } = await import("@/components/app-chrome");
const { InvoiceTable } = await import("@/components/invoice-table");

function tabbableLinks(markup: string) {
  return [...markup.matchAll(/<a\b[^>]*>/g)].map((match) => match[0]).filter((tag) => !/tabindex="-1"/.test(tag));
}

describe("WCAG 2.4.1 bypass blocks", () => {
  const markup = renderToStaticMarkup(
    <AppChrome openDisputeCount={0} openDisputes={[]}>
      {null}
    </AppChrome>,
  );

  it("renders Skip to content as the first link, targeting main", () => {
    const [first] = tabbableLinks(markup);
    expect(first).toContain('href="#main-content"');
    expect(markup).toMatch(/<a\b[^>]*href="#main-content"[^>]*>Skip to content<\/a>/);
  });

  it("makes main a programmatic focus target", () => {
    expect(markup).toMatch(/<main\b[^>]*id="main-content"[^>]*tabindex="-1"|<main\b[^>]*tabindex="-1"[^>]*id="main-content"/);
  });
});

describe("WCAG 2.4.3 focus order in the invoice table", () => {
  it("renders one tabbable link per row", () => {
    const invoices = ["1043", "1047", "1048"].map((n) => ({
      id: `inv_${n}`,
      number: `INV-${n}`,
      plan: "SCALE",
      status: "OVERDUE",
      issuedOn: new Date("2026-07-10"),
      dueOn: new Date("2026-08-09"),
      totalCents: 24900,
      customer: { name: "Cobalt Goods" },
      disputes: [],
    }));
    const markup = renderToStaticMarkup(<InvoiceTable invoices={invoices} />);
    expect(tabbableLinks(markup)).toHaveLength(invoices.length);
  });
});
