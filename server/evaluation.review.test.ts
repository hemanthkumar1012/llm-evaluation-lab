import { describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  updateReviewItem: vi.fn(),
  listEvaluationResults: vi.fn(),
  listReviewItems: vi.fn(),
}));
vi.mock("./db", () => dbMocks);
vi.mock("./_core/llm", () => ({ invokeLLM: vi.fn(), listLLMModels: vi.fn() }));

import { appRouter } from "./routers";

const caller = () => appRouter.createCaller({ user: undefined, req: {} as any, res: {} as any });

describe("review persistence and agreement", () => {
  it("persists a reviewer decision", async () => {
    await caller().evaluation.updateReview({ id: 7, decision: "approve", reviewerNote: "Evidence is sufficient." });
    expect(dbMocks.updateReviewItem).toHaveBeenCalledWith(7, expect.objectContaining({ decision: "approve", reviewerNote: "Evidence is sufficient.", reviewedAt: expect.any(Date) }));
  });

  it("calculates agreement from persisted review decisions", async () => {
    dbMocks.listEvaluationResults.mockResolvedValue([{ id: 10, resultId: 10, passed: 1 }, { id: 11, resultId: 11, passed: 0 }]);
    dbMocks.listReviewItems.mockResolvedValue([{ id: 1, resultId: 10, decision: "approve" }, { id: 2, resultId: 11, decision: "approve" }]);
    await expect(caller().evaluation.agreement({ runId: 3 })).resolves.toEqual({ total: 2, agreements: 1, agreementRate: 50 });
  });
});
