export type MetricKey = "taskSuccess" | "groundedness" | "refusalBehavior" | "toolFormat" | "injectionResistance";

export type CaseScore = {
  caseId: string;
  passed: boolean;
  metrics: Record<MetricKey, number>;
  latencyMs: number;
  estimatedTokens: number;
  estimatedCostCents: number;
  failureReason?: string;
};

export type EvaluationSummary = {
  totalCases: number;
  passedCases: number;
  passRate: number;
  metrics: Record<MetricKey, number>;
  medianLatencyMs: number;
  estimatedTokens: number;
  estimatedCostCents: number;
};

export type ReleaseGate = { metric: MetricKey; threshold: number; critical?: boolean };

export function summarizeScores(scores: CaseScore[]): EvaluationSummary {
  if (scores.length === 0) return { totalCases: 0, passedCases: 0, passRate: 0, metrics: { taskSuccess: 0, groundedness: 0, refusalBehavior: 0, toolFormat: 0, injectionResistance: 0 }, medianLatencyMs: 0, estimatedTokens: 0, estimatedCostCents: 0 };
  const average = (key: MetricKey) => Math.round(scores.reduce((sum, item) => sum + item.metrics[key], 0) / scores.length);
  const latencies = scores.map(item => item.latencyMs).sort((a, b) => a - b);
  const middle = Math.floor(latencies.length / 2);
  const medianLatencyMs = latencies.length % 2 ? latencies[middle] : Math.round((latencies[middle - 1] + latencies[middle]) / 2);
  return { totalCases: scores.length, passedCases: scores.filter(item => item.passed).length, passRate: Math.round((scores.filter(item => item.passed).length / scores.length) * 100), metrics: { taskSuccess: average("taskSuccess"), groundedness: average("groundedness"), refusalBehavior: average("refusalBehavior"), toolFormat: average("toolFormat"), injectionResistance: average("injectionResistance") }, medianLatencyMs, estimatedTokens: scores.reduce((sum, item) => sum + item.estimatedTokens, 0), estimatedCostCents: scores.reduce((sum, item) => sum + item.estimatedCostCents, 0) };
}

export function metricDeltas(baseline: EvaluationSummary, candidate: EvaluationSummary) {
  return Object.fromEntries(Object.keys(candidate.metrics).map(key => [key, candidate.metrics[key as MetricKey] - baseline.metrics[key as MetricKey]])) as Record<MetricKey, number>;
}

export function findRegressions(baseline: CaseScore[], candidate: CaseScore[]) {
  const baselineById = new Map(baseline.map(item => [item.caseId, item]));
  return candidate.filter(item => {
    const previous = baselineById.get(item.caseId);
    return Boolean(previous && previous.passed && !item.passed);
  });
}

export function evaluateReleaseGates(summary: EvaluationSummary, gates: ReleaseGate[]) {
  const failures = gates.filter(gate => summary.metrics[gate.metric] < gate.threshold);
  return { passed: failures.filter(gate => gate.critical !== false).length === 0, failures };
}
