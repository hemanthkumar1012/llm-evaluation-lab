import { createHash } from "node:crypto";

/** Bump when the scoring logic in shared/supportScoring.ts changes, so runs scored differently never look comparable. */
export const SCORER_VERSION = "support-rules-2026-11-22";

export type RunConfig = {
  model: string;
  prompt: string;
  datasetId: number;
  caseIds: number[];
  scorerVersion: string;
  scoringRules: Record<string, unknown>;
};

/** JSON with object keys sorted at every level, so the same config always gives the same text. */
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.keys(value as Record<string, unknown>)
      .sort()
      .map(key => `${JSON.stringify(key)}:${stableStringify((value as Record<string, unknown>)[key])}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

/** SHA-256 of the full run configuration. Baseline and candidate runs are comparable only when everything except the version under test matches. */
export function runConfigHash(config: RunConfig): string {
  return createHash("sha256").update(stableStringify(config)).digest("hex");
}
