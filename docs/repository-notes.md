# Repository notes

Signal Lab’s product code and documentation use the project’s own vocabulary. A small number of files retain managed-runtime names because they are deployment adapters supplied by the hosting environment rather than product features.

| Path or pattern | Why it remains |
| --- | --- |
| `server/_core/` | Authentication, session, runtime, and gateway adapters supplied by the managed full-stack runtime. |
| `vite.config.ts` runtime plugin hooks | Development preview and managed deployment integration. They are not part of the product domain model. |
| `client/public/__manus__/` | Development diagnostics and runtime metadata injected by the managed preview system. |
| `.project-config.json` | Local deployment metadata; ignored by Git and not part of the public source repository. |
| `loginMethod` in the user schema | Authentication-provider metadata required to preserve login provenance. |

The intentionally authored surface is the product layer: the Signal Lab pages, database schema, evaluation engine, scorecards, comparison logic, review flow, documentation, and tests. Framework adapters are kept isolated so the application domain remains portable.
