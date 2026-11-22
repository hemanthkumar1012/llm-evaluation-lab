/**
 * Builds the messages sent to the model for one evaluation case.
 *
 * The case's expected outcome is deliberately NOT included. It is the answer key used
 * for scoring. An earlier version put it in the prompt, so the model saw the answer it
 * was being graded against and scores were inflated.
 */
export type CaseMessage = { role: "system" | "user"; content: string };

export function buildCaseMessages(systemPrompt: string, customerMessage: string, supportContext?: string): CaseMessage[] {
  const context = supportContext ? `Approved support context:\n${supportContext}\n\n` : "";
  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: `${context}Customer message:\n${customerMessage}\n\nReturn only the customer-facing answer.` },
  ];
}
