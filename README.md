# Signal Lab

Signal Lab is a full-stack evaluation workspace for AI workflows. It answers a practical release question: **how do we know a model-backed workflow is improving, when it fails, and whether it is safe to ship?**

The first domain is customer-support answer quality. Signal Lab separates the workflow contract from the evaluation dataset, executes saved versions against structured cases, stores the evidence, applies configurable release gates, and routes uncertain results to human review.

> Ship answers. Keep the receipts.

## Why this exists

Most AI demos stop when the model returns a convincing paragraph. Production systems cannot. A useful evaluation platform needs repeatable cases, versioned prompts and models, measurable quality dimensions, regression inspection, safety checks, and a release decision that another engineer can audit.

Signal Lab is built around that release loop:

```text
Define behavior → write cases → run a version → score the evidence → inspect regressions → gate the release
```

## What it does

| Area | Capability |
| --- | --- |
| Workflow registry | Define expected customer-support behavior and save prompt/model versions. |
| Evaluation datasets | Store versioned cases with expected outcomes, difficulty, category, and safety labels. |
| Real model runs | Execute a saved workflow version against a saved dataset through a server-side LLM gateway. |
| Scorecards | Measure task success, groundedness, refusal behavior, tool-output correctness, and injection resistance. |
| Release gates | Block a candidate when a critical metric falls below its configured threshold. |
| Regression inspection | Compare persisted runs and identify the exact cases that moved from pass to fail. |
| Human review | Queue uncertain or high-impact cases, store decisions, and calculate reviewer agreement. |
| Learning layer | Explain the evaluation vocabulary and the engineering trade-offs behind the product. |

## The product flow

A workflow describes what the assistant should do. A dataset describes how that behavior will be tested. An evaluation run executes one saved workflow version over one saved dataset and writes the result of every case to the evidence ledger.

Each case can record the generated answer, pass/fail status, metric values, latency, estimated usage, estimated cost, and a failure reason. A scorecard provides the thresholds and rule configuration. Release gates turn those values into an explicit decision instead of an informal opinion.

## Architecture

The project uses a typed full-stack TypeScript architecture:

| Layer | Implementation |
| --- | --- |
| UI | React, Wouter, Tailwind CSS, shadcn-style primitives, and Lucide icons. |
| API contract | tRPC procedures shared between the server and browser. |
| Server | Express with protected procedures and server-side model calls. |
| Persistence | MySQL/TiDB through Drizzle ORM. |
| AI integration | A server-side LLM gateway; provider credentials never enter the browser. |
| Tests | Vitest unit and integration-style coverage plus a Playwright UI smoke check. |
| Deployment | Managed Node web runtime with database and authentication configured through environment variables. |

The main domain vocabulary lives in `drizzle/schema.ts`, database access is isolated in `server/db.ts`, typed procedures are grouped in `server/routers.ts`, and deterministic scoring helpers live in `shared/`.

## Getting started

### Requirements

You need Node.js 22 or newer, pnpm, a MySQL-compatible database, and the environment values required by the managed runtime or your own provider adapter.

### Install

```bash
pnpm install
```

Configure the database, session, OAuth, and model-gateway values through your local environment manager or deployment dashboard. This repository deliberately does not commit an environment template containing provider-specific defaults. Never commit `.env` or provider credentials.

### Run locally

```bash
pnpm dev
```

The application runs as a single server process. Open the local URL printed by the development server.

### Verify the project

```bash
pnpm check
pnpm test
pnpm build
```

For the browser smoke test, start the development server first and run:

```bash
pnpm exec playwright install chromium
pnpm run ui:smoke
```

The smoke check verifies the mobile overview CTA, workflow action focus, and evaluator control reachability at a 390×844 viewport.

## Repository map

```text
client/src/components/  Shared layout and UI primitives
client/src/pages/       Product surfaces: overview, workflow, datasets, runs, comparison, learning
server/                 Database helpers, typed procedures, and integration tests
drizzle/                Schema and migration history
shared/                 Deterministic scoring, comparison, and reviewer-agreement logic
scripts/                Local smoke checks and one-time development utilities
docs/                   Architecture and interview notes
```

## Evaluation design

The system intentionally scores more than answer similarity. Customer-support quality is a set of behaviors:

- The answer should address the customer’s actual request.
- Claims should remain grounded in approved support context.
- Unsafe, unauthorized, or injected instructions should not move the workflow outside its contract.
- Structured output should remain parseable when a tool-facing format is required.
- Uncertain or high-impact outcomes should be reviewable by a person.

The default starter dataset is deliberately small and inspectable. It includes normal support questions, a difficult account-access case, a high-impact billing case, and adversarial prompt-injection behavior. The goal is not benchmark theater; it is a clear starting contract that can grow with real examples.

## Interview walkthrough

A concise way to present the project is:

> I built Signal Lab to evaluate customer-support AI workflows before release. It separates workflow versions from versioned test datasets, runs real model evaluations, stores per-case evidence and operational metrics, compares candidate runs against a baseline, identifies regressions, applies configurable release gates, and routes uncertain cases to human review. The core idea is to make AI quality observable instead of relying on a convincing demo response.

The strongest demonstration is not the dashboard. It is the failure inspector: change a prompt, run it against the same dataset, show the metric delta, open the exact regressed case, and explain why the release gate passed or blocked the candidate.

## Current boundaries

Signal Lab is designed as a focused evaluation product rather than a general-purpose observability suite. Cost is estimated from returned usage metadata and the configured model rate. Scoring rules are intentionally explicit and domain-specific so they can be reviewed and changed; they are not presented as a universal judge for every AI task.

The managed runtime currently supplies authentication and the server-side model gateway. The application code keeps those boundaries behind server procedures so the domain logic can be moved to another provider without redesigning the UI.

## License

MIT. See `LICENSE` for the full text.
