import { beforeEach, describe, expect, it, vi } from "vitest";

const dbMocks = vi.hoisted(() => ({
  getWorkflowVersion: vi.fn(),
  listRuns: vi.fn(),
  setBaselineVersion: vi.fn(),
  listWorkflowVersions: vi.fn(),
  createWorkflowVersion: vi.fn(),
}));
vi.mock("./db", () => dbMocks);
vi.mock("./_core/llm", () => ({ invokeLLM: vi.fn(), listLLMModels: vi.fn() }));

import { appRouter } from "./routers";

const caller = () => appRouter.createCaller({ user: undefined, req: {} as any, res: {} as any });
const run = (id: number, releaseDecision: string, day: number) => ({ id, workflowVersionId: 2, status: releaseDecision === "passed" ? "completed" : "blocked", releaseDecision, createdAt: new Date(Date.UTC(2026, 10, day)) });

describe("workflow.promote", () => {
  beforeEach(() => vi.clearAllMocks());

  it("blocks promotion when the latest run failed its release gates", async () => {
    dbMocks.getWorkflowVersion.mockResolvedValue({ id: 2, workflowId: 1 });
    dbMocks.listRuns.mockResolvedValue([run(7, "passed", 1), run(8, "blocked", 2)]);

    await expect(caller().workflow.promote({ workflowId: 1, workflowVersionId: 2 })).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
    expect(dbMocks.setBaselineVersion).not.toHaveBeenCalled();
  });

  it("promotes a version whose latest run passed", async () => {
    dbMocks.getWorkflowVersion.mockResolvedValue({ id: 2, workflowId: 1 });
    dbMocks.listRuns.mockResolvedValue([run(8, "passed", 3)]);

    const result = await caller().workflow.promote({ workflowId: 1, workflowVersionId: 2 });
    expect(result.allowed).toBe(true);
    expect(dbMocks.setBaselineVersion).toHaveBeenCalledWith(1, 2);
  });

  it("refuses a version from another workflow", async () => {
    dbMocks.getWorkflowVersion.mockResolvedValue({ id: 2, workflowId: 99 });
    await expect(caller().workflow.promote({ workflowId: 1, workflowVersionId: 2 })).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});

describe("workflow.createVersion", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cannot mark a new version as baseline once versions exist", async () => {
    dbMocks.listWorkflowVersions.mockResolvedValue([{ id: 1 }]);
    await caller().workflow.createVersion({ workflowId: 1, versionLabel: "v2", model: "gpt-5-mini", prompt: "p", isBaseline: 1 });
    expect(dbMocks.createWorkflowVersion).toHaveBeenCalledWith(expect.objectContaining({ isBaseline: 0 }));
  });

  it("lets the first version start as baseline", async () => {
    dbMocks.listWorkflowVersions.mockResolvedValue([]);
    await caller().workflow.createVersion({ workflowId: 1, versionLabel: "v1", model: "gpt-5-mini", prompt: "p", isBaseline: 1 });
    expect(dbMocks.createWorkflowVersion).toHaveBeenCalledWith(expect.objectContaining({ isBaseline: 1 }));
  });
});
