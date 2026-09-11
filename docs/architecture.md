# Signal Lab architecture notes

## Product boundary

Signal Lab is an evaluation control plane for one narrow workflow: customer-support answer quality. The product intentionally keeps the task narrow so expected behavior, failure modes, and release criteria can remain explicit.

## Domain model

A `workflow` is the stable product contract. A `workflow version` captures the prompt, model identifier, notes, and baseline status at one point in time. A `dataset` is a versioned test surface, and a `test case` is the smallest unit of evidence inside it.

An `evaluation run` joins one workflow version to one dataset. A run owns the per-case results, aggregate metrics, release decision, and review queue. A `scorecard` stores thresholds and support-scoring rules. A `release gate` expresses a critical metric threshold. A `review item` records where automated judgment needs a human decision.

## Request flow

```text
Browser
  │ typed tRPC call
  ▼
Server procedure
  ├─ load workflow version and dataset cases
  ├─ call model gateway from the server
  ├─ score each response with shared deterministic rules
  ├─ persist run + case results
  ├─ create review items for uncertainty/high impact
  └─ evaluate critical release gates
        │
        ▼
Database-backed evidence ledger
```

## Why the scoring lives in `shared/`

The scoring module is deterministic, serializable, and tested separately from the transport layer. This makes the rule behavior visible in code review and allows a persisted scorecard to change thresholds and keywords without embedding all policy inside a router procedure.

The router is responsible for orchestration and persistence. The shared module is responsible for interpreting one customer-support response. Keeping those responsibilities separate makes it easier to add another domain later without rewriting the run lifecycle.

## Failure handling

The UI does not assume data exists. Pages distinguish loading, empty, and error states. A first-run user can bootstrap a small real workspace, while an existing workspace reads persisted records. A failed model call returns an actionable procedure error rather than silently inserting a fake result.

## Security posture

Model calls happen on the server. Provider credentials are read from server-side environment variables and are never passed to React. Protected procedures derive user context from the authenticated session. The next hardening step for multi-user deployments is ownership filtering on every domain query so users cannot see one another’s workspaces.

## Operational trade-offs

The first implementation runs evaluation cases inside a request so the behavior remains easy to inspect and learn from. For large datasets, the next production step would be a queued job model with resumable case execution, idempotency keys, retry policy, and progress events. That is a deliberate boundary rather than an accidental omission.
