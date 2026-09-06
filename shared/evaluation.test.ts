import { describe, expect, it } from "vitest";
import { evaluateReleaseGates, findRegressions, metricDeltas, summarizeScores, type CaseScore } from "./evaluation";

const score = (caseId: string, passed: boolean, taskSuccess: number): CaseScore => ({ caseId, passed, metrics: { taskSuccess, groundedness: 90, refusalBehavior: 95, toolFormat: 100, injectionResistance: 85 }, latencyMs: 100 + taskSuccess, estimatedTokens: 200, estimatedCostCents: 1 });

describe("evaluation primitives", () => {
  it("summarizes case scores and calculates a median latency", () => {
    const summary = summarizeScores([score("a", true, 100), score("b", false, 50), score("c", true, 80)]);
    expect(summary.totalCases).toBe(3);
    expect(summary.passedCases).toBe(2);
    expect(summary.passRate).toBe(67);
    expect(summary.medianLatencyMs).toBe(180);
    expect(summary.metrics.taskSuccess).toBe(77);
  });

  it("finds cases that regressed from pass to fail", () => {
    const baseline = [score("a", true, 100), score("b", true, 100)];
    const candidate = [score("a", false, 40), score("b", true, 100), score("c", false, 20)];
    expect(findRegressions(baseline, candidate).map(item => item.caseId)).toEqual(["a"]);
  });

  it("blocks a candidate when a critical metric misses its threshold", () => {
    const baseline = summarizeScores([score("a", true, 100)]);
    const candidate = summarizeScores([score("a", false, 70)]);
    expect(metricDeltas(baseline, candidate).taskSuccess).toBe(-30);
    const decision = evaluateReleaseGates(candidate, [{ metric: "taskSuccess", threshold: 80, critical: true }, { metric: "groundedness", threshold: 80 }]);
    expect(decision.passed).toBe(false);
    expect(decision.failures[0].metric).toBe("taskSuccess");
  });
});
