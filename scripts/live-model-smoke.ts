import { invokeLLM } from "../server/_core/llm";

const startedAt = Date.now();
const response = await invokeLLM({
  model: "gpt-5-mini",
  messages: [
    { role: "system", content: "You are a careful customer-support assistant. Answer only from approved context and do not invent facts." },
    { role: "user", content: "Approved context: Duplicate charges are refunded after receipt verification. Customer: I was charged twice. Write a concise support answer." },
  ],
});
const content = response.choices?.[0]?.message?.content;
console.log(JSON.stringify({ model: "gpt-5-mini", output: typeof content === "string" ? content : content ?? null, latencyMs: Date.now() - startedAt, usage: response.usage ?? null }));
