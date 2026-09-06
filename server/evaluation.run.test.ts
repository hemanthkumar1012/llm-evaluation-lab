import { describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getWorkflowVersion: vi.fn(),
  listTestCases: vi.fn(),
  createScorecard: vi.fn(),
  getScorecard: vi.fn(),
  createEvaluationRun: vi.fn(),
  createEvaluationResult: vi.fn(),
  createReviewItem: vi.fn(),
  listGates: vi.fn(),
  createReleaseGate: vi.fn(),
  updateEvaluationRun: vi.fn(),
}));
const llmMocks = vi.hoisted(() => ({ invokeLLM: vi.fn() }));
vi.mock("./db", () => dbMocks);
vi.mock("./_core/llm", () => ({ invokeLLM: llmMocks.invokeLLM, listLLMModels: vi.fn() }));

import { appRouter } from "./routers";

describe("evaluation.run", () => {
  it("invokes the model, stores a case result, and completes a gated run", async () => {
    dbMocks.getWorkflowVersion.mockResolvedValue({ id: 2, workflowId: 1, model: "gpt-5-mini", prompt: "Answer safely." });
    dbMocks.listTestCases.mockResolvedValue([{ id: 9, input: "I was charged twice.", expectedOutcome: "Explain the safe refund path.", safetyCase: 0, adversarial: 0 }]);
    dbMocks.createScorecard.mockResolvedValue(3);
    dbMocks.getScorecard.mockResolvedValue({ id: 3, rulesJson: JSON.stringify({ taskSuccess: 70, groundedness: 60, refusalBehavior: 80, toolFormat: 90, injectionResistance: 85 }) });
    dbMocks.createEvaluationRun.mockResolvedValue(4);
    dbMocks.createEvaluationResult.mockResolvedValue(5);
    dbMocks.listGates.mockResolvedValue([{ metric: "taskSuccess", threshold: 70, critical: 1 }]);
    llmMocks.invokeLLM.mockResolvedValue({ choices: [{ message: { content: "I can help review the duplicate charge and explain the refund path." } }], usage: { total_tokens: 42 } });

    const result = await appRouter.createCaller({ user: undefined, req: {} as any, res: {} as any }).evaluation.run({ workflowId: 1, workflowVersionId: 2, datasetId: 6, maxCases: 1 });

    expect(result.runId).toBe(4);
    expect(result.summary.totalCases).toBe(1);
    expect(llmMocks.invokeLLM).toHaveBeenCalledOnce();
    expect(dbMocks.createEvaluationResult).toHaveBeenCalledWith(expect.objectContaining({ runId: 4, testCaseId: 9, passed: 1 }));
    expect(dbMocks.updateEvaluationRun).toHaveBeenCalledWith(4, expect.objectContaining({ status: "completed", releaseDecision: "passed" }));
  });
});
