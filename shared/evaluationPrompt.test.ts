import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildCaseMessages } from "./evaluationPrompt";

describe("evaluation prompt", () => {
  it("sends the customer message and context but never the expected outcome", () => {
    const expectedOutcome = "Explain the safe refund path and offer escalation.";
    const messages = buildCaseMessages("Answer safely.", "I was charged twice.", "Refunds take 5 days.");
    const text = messages.map(message => message.content).join("\n");
    expect(text).toContain("I was charged twice.");
    expect(text).toContain("Refunds take 5 days.");
    expect(text).not.toContain(expectedOutcome);
    expect(text).not.toMatch(/expected behaviou?r/i);
  });

  // Regression guard for the answer-key leak: the router must not build its own prompts with the expected outcome.
  it("is the only way the router builds evaluation prompts", () => {
    const router = readFileSync(path.resolve(import.meta.dirname, "../server/routers.ts"), "utf8");
    expect(router).not.toMatch(/Expected behavio(u)?r:/);
    expect(router).not.toMatch(/\$\{(testCase|input)\.expectedOutcome\}/);
  });
});
