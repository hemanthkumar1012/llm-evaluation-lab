/**
 * Decides whether a workflow version may be promoted to the released (baseline) version.
 *
 * Rule: the most recent evaluation run of that exact version must have passed every
 * critical release gate. A newer blocked or failed run cancels an older pass, and a
 * version that was never evaluated cannot be promoted.
 */
export type RunForPromotion = {
  id: number;
  workflowVersionId: number;
  status: string;
  releaseDecision: string;
  createdAt: Date | string;
};

export type PromotionCheck = { allowed: boolean; reason: string; runId?: number };

export function checkPromotion(versionId: number, runs: RunForPromotion[]): PromotionCheck {
  const forVersion = runs
    .filter(run => run.workflowVersionId === versionId && run.status !== "running")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || b.id - a.id);
  const latest = forVersion[0];
  if (!latest) return { allowed: false, reason: "This version has no finished evaluation run. Run an evaluation first." };
  if (latest.releaseDecision !== "passed") {
    return { allowed: false, reason: `The latest run (#${latest.id}) was ${latest.releaseDecision}. Fix the failing gates and run again.`, runId: latest.id };
  }
  return { allowed: true, reason: `The latest run (#${latest.id}) passed all release gates.`, runId: latest.id };
}
