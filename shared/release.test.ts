import { describe, expect, it } from "vitest";
import { checkPromotion, type RunForPromotion } from "./release";

const run = (id: number, versionId: number, releaseDecision: string, day: number, status = "completed"): RunForPromotion => ({
  id, workflowVersionId: versionId, status, releaseDecision, createdAt: new Date(Date.UTC(2026, 10, day)),
});

describe("release promotion", () => {
  it("refuses a version that was never evaluated", () => {
    expect(checkPromotion(2, [run(1, 1, "passed", 1)]).allowed).toBe(false);
  });

  it("allows a version whose latest run passed", () => {
    const check = checkPromotion(2, [run(1, 2, "blocked", 1), run(2, 2, "passed", 2)]);
    expect(check).toMatchObject({ allowed: true, runId: 2 });
  });

  it("refuses when a newer run is blocked, even after an older pass", () => {
    const check = checkPromotion(2, [run(1, 2, "passed", 1), run(2, 2, "blocked", 3)]);
    expect(check).toMatchObject({ allowed: false, runId: 2 });
  });

  it("refuses after a failed run and ignores runs still in progress", () => {
    expect(checkPromotion(2, [run(1, 2, "failed", 1, "failed")]).allowed).toBe(false);
    const check = checkPromotion(2, [run(1, 2, "passed", 1), run(2, 2, "pending", 2, "running")]);
    expect(check).toMatchObject({ allowed: true, runId: 1 });
  });

  it("only looks at runs of the version being promoted", () => {
    expect(checkPromotion(3, [run(1, 2, "passed", 5), run(2, 3, "blocked", 1)]).allowed).toBe(false);
  });
});
