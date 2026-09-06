import { describe, expect, it } from "vitest";
import { findPersistedRegressions } from "./comparison";

describe("persisted comparison", () => {
  it("finds only cases that changed from pass to fail", () => {
    expect(findPersistedRegressions([{ testCaseId: 1, passed: 1 }, { testCaseId: 2, passed: 0 }], [{ testCaseId: 1, passed: 0 }, { testCaseId: 2, passed: 1 }, { testCaseId: 3, passed: 0 }])).toEqual([{ testCaseId: 1, passed: 0 }]);
  });
});
