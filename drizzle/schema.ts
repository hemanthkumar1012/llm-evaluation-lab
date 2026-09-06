import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const workflows = mysqlTable("workflows", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  taskType: varchar("taskType", { length: 120 }).notNull(),
  description: text("description").notNull(),
  expectedBehavior: text("expectedBehavior").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const workflowVersions = mysqlTable("workflow_versions", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  versionLabel: varchar("versionLabel", { length: 80 }).notNull(),
  model: varchar("model", { length: 160 }).notNull(),
  prompt: text("prompt").notNull(),
  notes: text("notes"),
  isBaseline: int("isBaseline").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const datasets = mysqlTable("datasets", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  versionLabel: varchar("versionLabel", { length: 80 }).notNull(),
  description: text("description"),
  caseCount: int("caseCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const testCases = mysqlTable("test_cases", {
  id: int("id").autoincrement().primaryKey(),
  datasetId: int("datasetId").notNull(),
  externalId: varchar("externalId", { length: 120 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).notNull(),
  input: text("input").notNull(),
  expectedOutcome: text("expectedOutcome").notNull(),
  safetyCase: int("safetyCase").default(0).notNull(),
  adversarial: int("adversarial").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const scorecards = mysqlTable("scorecards", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  name: varchar("name", { length: 180 }).notNull(),
  rulesJson: text("rulesJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const evaluationRuns = mysqlTable("evaluation_runs", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  workflowVersionId: int("workflowVersionId").notNull(),
  datasetId: int("datasetId").notNull(),
  scorecardId: int("scorecardId").notNull(),
  status: mysqlEnum("status", ["running", "completed", "blocked", "failed"]).default("completed").notNull(),
  passedCases: int("passedCases").default(0).notNull(),
  totalCases: int("totalCases").default(0).notNull(),
  taskSuccess: int("taskSuccess").default(0).notNull(),
  groundedness: int("groundedness").default(0).notNull(),
  refusalBehavior: int("refusalBehavior").default(0).notNull(),
  toolFormat: int("toolFormat").default(0).notNull(),
  injectionResistance: int("injectionResistance").default(0).notNull(),
  medianLatencyMs: int("medianLatencyMs").default(0).notNull(),
  estimatedTokens: int("estimatedTokens").default(0).notNull(),
  estimatedCostCents: int("estimatedCostCents").default(0).notNull(),
  releaseDecision: varchar("releaseDecision", { length: 40 }).default("passed").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const evaluationResults = mysqlTable("evaluation_results", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  testCaseId: int("testCaseId").notNull(),
  output: text("output").notNull(),
  passed: int("passed").default(0).notNull(),
  scoreJson: text("scoreJson").notNull(),
  latencyMs: int("latencyMs").default(0).notNull(),
  estimatedTokens: int("estimatedTokens").default(0).notNull(),
  estimatedCostCents: int("estimatedCostCents").default(0).notNull(),
  failureReason: text("failureReason"),
});

export const releaseGates = mysqlTable("release_gates", {
  id: int("id").autoincrement().primaryKey(),
  workflowId: int("workflowId").notNull(),
  metric: varchar("metric", { length: 80 }).notNull(),
  operator: varchar("operator", { length: 8 }).default(">=").notNull(),
  threshold: int("threshold").notNull(),
  critical: int("critical").default(1).notNull(),
});

export const reviewItems = mysqlTable("review_items", {
  id: int("id").autoincrement().primaryKey(),
  runId: int("runId").notNull(),
  resultId: int("resultId").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  reason: text("reason").notNull(),
  decision: mysqlEnum("decision", ["pending", "approve", "reject", "needs_edit"]).default("pending").notNull(),
  reviewerNote: text("reviewerNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Workflow = typeof workflows.$inferSelect;
export type WorkflowVersion = typeof workflowVersions.$inferSelect;
export type Dataset = typeof datasets.$inferSelect;
export type TestCase = typeof testCases.$inferSelect;
export type EvaluationRun = typeof evaluationRuns.$inferSelect;
