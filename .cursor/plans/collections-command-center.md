# Collections Command Center — plan only

Source: nine open Todo issues on Linear project `ce-field-demos`, team CE201-Ray, label Collections Command Center (CE2-9 through CE2-17). Canceled copies on team `joatmon08x/ce-field-demos` (LY-27 through LY-35) are not in this plan. This plan builds nothing.

Catalog stays Starter $49, Growth $99, Scale $249. Operator is Avery Quinn. Demo clock is 23 Aug 2026. The invoice-page collection-note stub stays unfinished. `app/collections/page.tsx` stays the cross-account queue.

## Tasks

| Order | Issue | Task | Files |
| --- | --- | --- | --- |
| 1 | CE2-9 | Customers list and Account Detail Overdue Book | `components/app-chrome.tsx`, `app/customers/page.tsx`, `app/customers/[id]/page.tsx` |
| 2 | CE2-10 | Record a full payment and the account activity feed | `prisma/schema.prisma`, `prisma/seed.ts`, `app/api/invoices/[id]/payments/route.ts`, `app/invoices/[id]/page.tsx`, `app/customers/[id]/page.tsx` |
| 3 | CE2-11 | Reject a payment amount that is not the outstanding balance | `app/api/invoices/[id]/payments/route.ts`, `app/invoices/[id]/page.tsx` |
| 4 | CE2-12 | Save a collection note on the account | `prisma/schema.prisma`, `prisma/seed.ts`, `app/api/customers/[id]/notes/route.ts`, `app/customers/[id]/page.tsx` |
| 5 | CE2-13 | 15-minute edit window, no delete | `app/api/notes/[id]/route.ts`, `app/customers/[id]/page.tsx` |
| 6 | CE2-14 | Send a Nudge and log NUDGE_SENT | `app/api/invoices/[id]/nudge/route.ts`, `app/customers/[id]/page.tsx` |
| 7 | CE2-15 | Failed Nudge when the address cannot be emailed | `app/api/invoices/[id]/nudge/route.ts`, `app/customers/[id]/page.tsx` |
| 8 | CE2-16 | Dashboard collections card on the next load | `app/page.tsx`, `components/kpi-card.tsx`, `lib/dashboard.ts`, `lib/data.ts` |
| 9 | CE2-17 | Mask dollar amounts outside Starter, Growth, and Scale | `lib/plans.ts`, `app/customers/page.tsx`, `app/customers/[id]/page.tsx`, `app/invoices/[id]/page.tsx`, `app/page.tsx` |

## What each task does

1. **CE2-9.** Add Customers to the nav. `/customers` lists seeded accounts with name, plan, overdue count, and overdue balance. `/customers/[id]` lists that account’s OVERDUE invoices, days past due descending (`daysBetween(DEMO_AS_OF, dueOn)`), with invoice number, dates, days past due, and outstanding balance via `formatUsd`. A row opens the existing invoice page. An account with no overdue invoices shows no rows. Outstanding balance is `invoice.totalCents` until payments exist. No CollectionNote, Activity, Payment, or sample rows.

2. **CE2-10.** `POST /api/invoices/[id]/payments` with `{ method }` records the full outstanding balance and ignores a client amount. Methods: `check`, `ach`, `card_on_file`, `cash`. Success sets PAID and `paidOn` to the demo date, writes Payment and a PAYMENT_RECORDED activity. A zero balance returns 400. Invoice detail gains payment history and Record payment, after a confirm step that shows the amount. Seed deletes payments and activities before invoices.

3. **CE2-11.** The confirm step offers only the full outstanding balance. Posting any other `amountCents` returns 400, stores nothing, and leaves the invoice OVERDUE.

4. **CE2-12.** `POST /api/customers/[id]/notes` with `{ body, invoiceId? }` stores CollectionNote and a NOTE_ADDED activity. Author is Avery Quinn. Blank body is 400. Newest note first. Do not enable the invoice-page Save note stub.

5. **CE2-13.** `PATCH /api/notes/[id]` updates body only. Avery Quinn may edit a note they created less than 15 minutes ago (`createdAt`). Older notes, or another author, return 403. No delete route or delete control.

6. **CE2-14.** `POST /api/invoices/[id]/nudge` emails the on-file address with a fixed template (invoice number, outstanding balance, due date). The account Nudge uses the most-past-due overdue invoice. No overdue invoices disables the control. Append NUDGE_SENT, status sent, channel email, sender Avery Quinn.

7. **CE2-15.** Same route. A missing or non-address email still writes NUDGE_SENT with status failed, and the account shows that failure. No bounce provider.

8. **CE2-16.** One collections card on the dashboard: overdue balance via `formatUsd`, overdue invoice count, activities on the demo day, and activities in the 7 days ending that day. Aggregates from `lib/dashboard.ts` through `getDashboard()`. Existing kpi-card tokens only. The card updates on the next dashboard load.

9. **CE2-17.** `amountsVisible` is true only for STARTER, GROWTH, and SCALE. Any other plan id shows “Upgrade to view amounts” on the customers list, Overdue Book, payment history, activity feed, and collections card. The payment confirm still shows the amount being recorded. Every seeded account stays on the catalog. A unit test passes a non-catalog id. No Free, Trial, or Enterprise price.

## Open questions

- CE2-10, CE2-12, and the seed share `prisma/schema.prisma` and `prisma/seed.ts`. Those three cannot run as isolated worktrees at the same time.
- `app/customers/[id]/page.tsx` is on CE2-9, CE2-10, CE2-12, CE2-13, CE2-14, and CE2-15. Parallel edits to that page will conflict.
- `app/api/invoices/[id]/payments/route.ts` is shared by CE2-10 and CE2-11. `app/api/invoices/[id]/nudge/route.ts` is shared by CE2-14 and CE2-15. Each pair is one route, two slices.
- CE2-9 adds Customers to `components/app-chrome.tsx`. The keyboard remediation also edits that file (skip link). Settle the keyboard PR before this slice, or the nav edit will conflict.
- CE2-16 and CE2-17 both render amounts on `app/page.tsx`. Masking (CE2-17) should follow the card (CE2-16), or the card ships unmasked and gets a second pass.
- A new passing test changes the shipped **1 failed / 32 passed** citations in the same change. The sole red test stays `tests/suggested-credit-api.test.ts`.
- Issue descriptions say to update the issue tracker when a slice lands. This plan does not write to Linear.
