import { describe, expect, it } from "vitest";
import { reviewerAgreement } from "./review";

describe("reviewer agreement", () => {
  it("calculates agreement between automated and human labels", () => {
    expect(reviewerAgreement([{ automated: "pass", human: "pass" }, { automated: "fail", human: "pass" }, { automated: "fail", human: "fail" }])).toEqual({ total: 3, agreements: 2, agreementRate: 67 });
  });
});
