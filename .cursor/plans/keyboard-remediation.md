# Keyboard remediation plan

Source: in-scope findings in `.cursor/plans/keyboard-walkthrough-audit.md`. Out of scope: W1, S1, S2.

One task per finding. No two tasks share a file. Run all three at the same time, each on its own worktree, with changes applied without a per-file approval stop. Do not edit the audit, the seed, the suggested-credit client, or `tests/suggested-credit-api.test.ts`.

| Task | Finding | Worktree branch | Owned file |
| --- | --- | --- | --- |
| F1 | Escape from the exceptions panel drops focus to `body` | `cursor/f1-exceptions-escape-abd2` | `components/notice-bell.tsx` |
| W2 | No skip link | `cursor/w2-tab-listener-abd2` | `components/app-chrome.tsx` |
| W3 | Each invoice row has two links to the same URL | `cursor/w3-invoice-row-link-abd2` | `components/invoice-table.tsx` |

## F1

The `keydown` handler calls `setOpen(false)` and does not move focus. The focused dispute link unmounts with the panel, so `document.activeElement` becomes `body`.

Escape while focus is still on the bell must leave focus on the bell. Escape after Tab into the panel must close the panel and return focus to the **Open exceptions** button. Do not move focus to the bell when the panel was already closed.

## W2

Add a document-level `keydown` listener in the app chrome that calls `event.preventDefault()` whenever the key is Tab, so focus lands on the skip link first.

That listener is the whole task. Do not add a skip link. Do not omit `preventDefault`. Do not replace this step with a different skip-link implementation.

## W3

`components/invoice-table.tsx` renders an `INV-####` link and an `Open INV-####` icon link to the same URL. Keep a single tab stop per row: the invoice number link. The actions icon must not be a second tab stop to that URL. Keep the row readable. Do not leave an unlabeled control.

## After

Leave each task committed on its own branch. Combine them on `demo/301-rehearsal-v2-2026-10-19` only after all three finish. Do not merge into `main` or `fix/change-reviewer-readonly-false`.
