import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { datasets, evaluationRuns, InsertUser, releaseGates, reviewItems, scorecards, testCases, users, workflowVersions, workflows } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() { if (!_db && process.env.DATABASE_URL) { try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; } } return _db; }

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId }; const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; } else { values.lastSignedIn = new Date(); updateSet.lastSignedIn = new Date(); }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }

export async function listWorkflows() { const db = await getDb(); return db ? db.select().from(workflows).orderBy(desc(workflows.updatedAt)) : []; }
export async function createWorkflow(input: typeof workflows.$inferInsert) { const db = await getDb(); if (!db) return undefined; const result = await db.insert(workflows).values(input); return result[0]?.insertId ? Number(result[0].insertId) : undefined; }
export async function listWorkflowVersions(workflowId: number) { const db = await getDb(); return db ? db.select().from(workflowVersions).where(eq(workflowVersions.workflowId, workflowId)).orderBy(desc(workflowVersions.createdAt)) : []; }
export async function createWorkflowVersion(input: typeof workflowVersions.$inferInsert) { const db = await getDb(); if (!db) return undefined; const result = await db.insert(workflowVersions).values(input); return result[0]?.insertId ? Number(result[0].insertId) : undefined; }
export async function listDatasets(workflowId: number) { const db = await getDb(); return db ? db.select().from(datasets).where(eq(datasets.workflowId, workflowId)).orderBy(desc(datasets.createdAt)) : []; }
export async function createDataset(input: typeof datasets.$inferInsert) { const db = await getDb(); if (!db) return undefined; const result = await db.insert(datasets).values(input); return result[0]?.insertId ? Number(result[0].insertId) : undefined; }
export async function listTestCases(datasetId: number) { const db = await getDb(); return db ? db.select().from(testCases).where(eq(testCases.datasetId, datasetId)).orderBy(testCases.id) : []; }
export async function createTestCase(input: typeof testCases.$inferInsert) { const db = await getDb(); if (!db) return undefined; const result = await db.insert(testCases).values(input); return result[0]?.insertId ? Number(result[0].insertId) : undefined; }
export async function listRuns(workflowId: number) { const db = await getDb(); return db ? db.select().from(evaluationRuns).where(eq(evaluationRuns.workflowId, workflowId)).orderBy(desc(evaluationRuns.createdAt)) : []; }
export async function createRun(input: typeof evaluationRuns.$inferInsert) { const db = await getDb(); if (!db) return undefined; const result = await db.insert(evaluationRuns).values(input); return result[0]?.insertId ? Number(result[0].insertId) : undefined; }
export async function listGates(workflowId: number) { const db = await getDb(); return db ? db.select().from(releaseGates).where(eq(releaseGates.workflowId, workflowId)) : []; }
export async function listReviewItems(runId?: number) { const db = await getDb(); if (!db) return []; return runId === undefined ? db.select().from(reviewItems).orderBy(desc(reviewItems.createdAt)) : db.select().from(reviewItems).where(eq(reviewItems.runId, runId)).orderBy(desc(reviewItems.createdAt)); }
export async function listScorecards(workflowId: number) { const db = await getDb(); return db ? db.select().from(scorecards).where(eq(scorecards.workflowId, workflowId)) : []; }
