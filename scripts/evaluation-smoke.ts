import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

const ctx = { user: undefined, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
const result = await appRouter.createCaller(ctx).evaluation.run({ workflowId: 1, workflowVersionId: 1, datasetId: 1, maxCases: 4 });
console.log(JSON.stringify({ runId: result.runId, passRate: result.summary.passRate, totalCases: result.summary.totalCases, releasePassed: result.release.passed }));
