import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * A document listener that preventDefault's Tab removes every later stop,
 * including a skip link. Form submit handlers that preventDefault are fine.
 */
const CANCELS_TAB =
  /key\s*===\s*["']Tab["'][\s\S]{0,180}?preventDefault\s*\(|preventDefault\s*\([\s\S]{0,180}?key\s*===\s*["']Tab["']/g;

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(full);
    return entry.name.endsWith(".tsx") ? [full] : [];
  });
}

describe("Tab keydown", () => {
  it("does not cancel Tab in app or components", () => {
    const root = process.cwd();
    const hits: string[] = [];
    for (const file of ["app", "components"].flatMap((dir) => tsxFiles(path.join(root, dir)))) {
      const source = readFileSync(file, "utf8");
      CANCELS_TAB.lastIndex = 0;
      const match = CANCELS_TAB.exec(source);
      if (!match) continue;
      const line = source.slice(0, match.index).split("\n").length;
      hits.push(`${path.relative(root, file)}:${line}`);
    }
    expect(hits).toEqual([]);
  });
});
