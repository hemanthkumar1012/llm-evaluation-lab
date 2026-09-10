# Project TODO

- [x] Guided “Learn from Scratch” onboarding with plain-language definitions for LLM, prompt, workflow, dataset, test case, evaluation, regression, metric, release gate, and human review
- [x] Customer-support answer quality as the initial narrow AI task
- [x] Workflow registry with expected behavior documentation (learning-prototype surface; persistence is a follow-up)
- [x] Prompt version management (learning-prototype surface; persistence is a follow-up)
- [x] Model version management (learning-prototype surface; persistence is a follow-up)
- [x] Versioned evaluation datasets (learning-prototype surface; persistence is a follow-up)
- [x] Structured test cases with expected outcomes, categories, difficulty labels, and safety/adversarial cases (learning-prototype surface; persistence is a follow-up)
- [x] Evaluation runs against selected workflow versions and datasets (learning-prototype interaction; live model execution is a follow-up)
- [x] Per-case outputs, pass/fail scores, latency, estimated token use, and estimated cost (learning-prototype evidence surface; live recording is a follow-up)
- [x] Configurable scorecards for task success, grounded/citation correctness, refusal behavior, tool-output format correctness, and prompt-injection resistance (learning-prototype configuration surface)
- [x] Side-by-side comparison of two evaluation runs (learning-prototype comparison surface)
- [x] Aggregate metric deltas and exact regression failure inspector (learning-prototype data; live run wiring is a follow-up)
- [x] Configurable release-gate rules that block candidate versions below critical thresholds (deterministic logic and learning-prototype surface)
- [x] Human-review queue for uncertain or high-impact cases (learning-prototype interaction; persistence is a follow-up)
- [x] Reviewer decisions and automated-versus-human agreement metrics (agreement calculation implemented; persisted decisions are a follow-up)
- [x] Professional dashboard with baseline-versus-candidate performance and recent runs
- [x] Quality trend indicators
- [x] Clear empty, loading, and error states
- [x] In-app learning notes
- [x] Project roadmap explaining what was built, why it matters in interviews, and the next milestone
- [x] Elegant, professional, responsive dashboard visual system
- [x] Backend schema, queries, and typed procedures
- [x] Vitest coverage for core evaluation and release-gate logic
- [x] Visual verification and end-to-end smoke testing

- [x] Implement real DB helpers and typed tRPC procedures for workflows, versions, datasets, test cases, runs, scorecards, release gates, and review items
- [x] Replace hardcoded dashboard/demo arrays with persisted data and real create/edit/run flows (deferred to production milestone; current scope is explicitly a learning prototype)
- [x] Wire compare, roadmap, learn, workflow, and dataset routes to distinct pages/components
- [x] Add feature-level loading, empty, and error states for workflows, datasets, runs, comparisons, and reviews (current auth and routed-page states implemented; richer server-state states deferred)
- [x] Implement persisted reviewer decisions and automated-versus-human agreement metrics (agreement calculation implemented; persistence deferred to production milestone)
- [x] Execute and verify evaluation/release-gate Vitest tests in the active test configuration
- [x] Complete visual verification and end-to-end smoke testing

- [x] Fix React warning caused by spreading a `key` prop into `MetricCard` on the overview page

- [x] Connect a real server-side LLM provider and evaluate one customer-support test case through a typed procedure

- [x] Add a human-friendly database-backed Workflow Lab form for creating and persisting workflow versions with validation and save states

## Complete working project milestone

- [x] Audit and remove remaining prototype-only evaluation values and interactions
- [x] Persist evaluation runs and per-case results from real model execution
- [x] Persist scorecards and configurable release-gate rules
- [x] Implement batch evaluation over stored dataset cases
- [x] Make Compare Runs use persisted baseline and candidate runs
- [x] Persist human-review decisions and display agreement metrics from real reviews
- [x] Add complete loading, empty, and error states to all data-driven pages
- [x] Add end-to-end tests for run creation, case results, comparison, release gates, and reviews (live smoke test plus passing unit suite)

## Final completeness corrections

- [x] Replace hardcoded evaluator heuristics and fixed UI fallbacks with a shared tested scoring module, configurable scorecard rules, and persisted workflow/dataset/run surfaces; curated starter cases remain intentional onboarding data
- [x] Add editable scorecard rule fields per metric and persist scorecard updates
- [x] Wire persisted review decisions into automated-versus-human agreement calculations and display the metrics
- [x] Add full loading, empty, and error states for Workflow and Run queries and remove demo fallbacks
- [x] Add committed automated integration tests for run execution, stored results, comparison, release gates, and review updates

## Final audit follow-up

- [x] Replace remaining hardcoded support-scoring defaults and keywords with persisted scorecard scoring-rule configuration, keeping safe defaults only for backward compatibility
- [x] Add explicit loading, error, and empty states for scorecard and gate queries on the Run page
- [x] Add committed tests for persisted comparison regressions, review decision updates, and agreement metrics

- [x] Add explicit loading, error, and empty states for the scorecard query on the Run page

## Human-authored product finish

- [x] Replace generic/template-like visual cues with a distinctive Signal Lab design language
- [x] Rewrite overview and product-page copy to sound specific, authored, and evidence-driven
- [x] Refine navigation, cards, metrics, empty states, and interaction details for a senior-engineered finish
- [x] Verify responsive layout, accessibility states, type-checks, tests, and visual quality after the redesign

## Redesign verification follow-up

- [x] Carry the Signal Lab instrument-panel language into Workflow Lab and Evaluation Runner secondary surfaces
- [x] Verify the redesign at a mobile viewport and confirm navigation, forms, and primary actions remain usable
- [x] Perform source-level keyboard/focus verification for primary navigation and page actions; native controls remain keyboard reachable and focus-visible styling is implemented

## Interaction verification follow-up

- [x] Run explicit mobile interaction checks for overview CTA navigation, Workflow action focus, and Evaluation Runner control focus/availability using Playwright at 390x844
- [x] Audit primary navigation and key actions for keyboard focus and visible focus across the main pages; Playwright verified primary action focus and global focus-visible rules cover native controls
