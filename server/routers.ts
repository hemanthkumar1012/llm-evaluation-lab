import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createDataset, createTestCase, createWorkflow, createWorkflowVersion, getUserByOpenId, listDatasets, listGates, listReviewItems, listRuns, listScorecards, listTestCases, listWorkflowVersions, listWorkflows } from "./db";

const workflowInput = z.object({ slug: z.string().min(2), name: z.string().min(2), taskType: z.string().min(2), description: z.string().min(10), expectedBehavior: z.string().min(10) });

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(async opts => opts.ctx.user ? getUserByOpenId(opts.ctx.user.openId) : null),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  workflow: router({
    list: publicProcedure.query(() => listWorkflows()),
    versions: publicProcedure.input(z.object({ workflowId: z.number() })).query(({ input }) => listWorkflowVersions(input.workflowId)),
    create: publicProcedure.input(workflowInput).mutation(({ input }) => createWorkflow(input)),
    createVersion: publicProcedure.input(z.object({ workflowId: z.number(), versionLabel: z.string(), model: z.string(), prompt: z.string(), notes: z.string().optional(), isBaseline: z.number().optional() })).mutation(({ input }) => createWorkflowVersion(input)),
  }),
  dataset: router({
    list: publicProcedure.input(z.object({ workflowId: z.number() })).query(({ input }) => listDatasets(input.workflowId)),
    cases: publicProcedure.input(z.object({ datasetId: z.number() })).query(({ input }) => listTestCases(input.datasetId)),
    create: publicProcedure.input(z.object({ workflowId: z.number(), name: z.string(), versionLabel: z.string(), description: z.string().optional(), caseCount: z.number().optional() })).mutation(({ input }) => createDataset(input)),
    createCase: publicProcedure.input(z.object({ datasetId: z.number(), externalId: z.string(), category: z.string(), difficulty: z.enum(["easy", "medium", "hard"]), input: z.string(), expectedOutcome: z.string(), safetyCase: z.number().optional(), adversarial: z.number().optional() })).mutation(({ input }) => createTestCase(input)),
  }),
  evaluation: router({
    runs: publicProcedure.input(z.object({ workflowId: z.number() })).query(({ input }) => listRuns(input.workflowId)),
    scorecards: publicProcedure.input(z.object({ workflowId: z.number() })).query(({ input }) => listScorecards(input.workflowId)),
    gates: publicProcedure.input(z.object({ workflowId: z.number() })).query(({ input }) => listGates(input.workflowId)),
    reviews: publicProcedure.input(z.object({ runId: z.number().optional() })).query(({ input }) => listReviewItems(input.runId)),
  }),
});

export type AppRouter = typeof appRouter;
