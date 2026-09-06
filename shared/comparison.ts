export type PersistedRunResult = { id?: number; testCaseId: number; passed: number; failureReason?: string | null };

export function findPersistedRegressions(baseline: PersistedRunResult[], candidate: PersistedRunResult[]) {
  const baselinePassed = new Set(baseline.filter(item => item.passed === 1).map(item => item.testCaseId));
  return candidate.filter(item => item.passed === 0 && baselinePassed.has(item.testCaseId));
}
