# Interview notes

## Thirty-second version

Signal Lab is a release-evaluation platform for customer-support AI. I built it to answer whether a new prompt or model version is actually better, not merely whether one response looks good. It stores workflows, datasets, runs, scores, release gates, and human review decisions so quality claims have evidence behind them.

## The problem

AI workflows are non-deterministic and can fail in ways that ordinary unit tests do not capture. A candidate can improve average task success while introducing a dangerous regression on one adversarial case. The product makes those changes visible before release.

## The interesting engineering decisions

I kept the workflow contract separate from the dataset so prompt changes do not silently change the goalposts. I made the scoring vocabulary explicit and serializable so thresholds and support-specific rules can be edited without hiding policy in prompt text. I kept model access server-side, and I treated human review as part of the evaluation loop rather than as an afterthought.

## What I would demonstrate

I would create or select a candidate workflow version, run it against the Support QA dataset, open the run summary, inspect the release decision, and then open the comparison page. The important moment is the regression inspector: it identifies the exact case that moved from pass to fail and shows the failure reason.

## Questions I expect

### Why not use an LLM judge for everything?

An automated judge can be useful, but it also introduces another model whose behavior must be evaluated. Signal Lab starts with deterministic, domain-specific checks because they are transparent and easy to test. A future judge can be added as another metric with calibration data and human agreement reporting.

### How would this scale?

The current request-based runner is intentionally easy to understand. At larger volume I would move cases to a queue, add idempotency keys, persist progress, retry transient provider failures, and make run completion resumable. The run and case-result schema already gives the system a durable place to store partial progress.

### What is the hardest part?

The hardest part is defining good test cases. A large dataset is not automatically a useful dataset. I would add cases from real incidents, label them by impact and failure mode, and track coverage so the benchmark evolves with the product.

### What would you improve next?

I would add workspace ownership filters, report export, provider/model cost normalization, richer trace capture, and a queued runner for large datasets. I would also add a calibration workflow for comparing automated metrics with reviewer labels over time.
