/**
 * Unit tests for Jibu's Sentry Agent Tracing attribute builders
 * (src/lib/chatbot/tracing.ts). These are pure functions — the assertions
 * pin the exact gen_ai.* attribute names Sentry's conventions define, the
 * conversation-id omission rule, and the hard capture bounds.
 *
 * Run: npx vitest run
 */
import { describe, expect, it } from "vitest";
import {
  agentSpanAttributes,
  llmSpanResponseAttributes,
  llmSpanStartAttributes,
  providerName,
  truncateJson,
  type LlmCallContext,
} from "@/lib/chatbot/tracing";

const baseCtx = (over: Partial<LlmCallContext> = {}): LlmCallContext => ({
  conversationId: "s-abc123-xyz",
  system: "You are Jibu, the DC254 assistant.",
  messages: [
    { role: "system", content: "You are Jibu, the DC254 assistant." },
    { role: "user", content: "How many data centres are in Kenya?" },
  ],
  temperature: 0.3,
  path: "confidence_polish",
  ...over,
});

describe("truncateJson", () => {
  it("returns plain JSON within the limit", () => {
    expect(truncateJson({ a: 1 }, 100)).toBe('{"a":1}');
  });

  it("hard-bounds oversized values to exactly the limit", () => {
    const out = truncateJson({ long: "x".repeat(5000) }, 200);
    expect(out.length).toBe(200);
    expect(out.startsWith('{"long":"xxx')).toBe(true);
  });

  it("falls back to a placeholder for unserializable values", () => {
    // BigInt throws inside JSON.stringify — the builder must never throw.
    expect(truncateJson({ n: BigInt(10) }, 100)).toBe('"unserializable"');
  });
});

describe("providerName", () => {
  it("lowercases provider ids for gen_ai.provider.name", () => {
    expect(providerName("Groq")).toBe("groq");
    expect(providerName("nvidia")).toBe("nvidia");
  });
});

describe("llmSpanStartAttributes", () => {
  it("carries the conventions' required and recommended attributes", () => {
    const attrs = llmSpanStartAttributes("groq", "openai/gpt-oss-120b", baseCtx());
    expect(attrs["gen_ai.operation.name"]).toBe("chat");
    expect(attrs["gen_ai.request.model"]).toBe("openai/gpt-oss-120b");
    expect(attrs["gen_ai.provider.name"]).toBe("groq");
    expect(attrs["gen_ai.agent.name"]).toBe("Jibu");
    expect(attrs["gen_ai.request.temperature"]).toBe(0.3);
    // Complex values must travel as JSON strings (attributes are primitives).
    expect(typeof attrs["gen_ai.input.messages"]).toBe("string");
    expect(JSON.parse(attrs["gen_ai.input.messages"] as string)).toHaveLength(2);
    expect(JSON.parse(attrs["gen_ai.system_instructions"] as string)).toContain("Jibu");
    // Low-cardinality product context, not user content.
    expect(attrs["jibu.path"]).toBe("confidence_polish");
  });

  it("sets gen_ai.conversation.id when a session id exists", () => {
    const attrs = llmSpanStartAttributes("groq", "m", baseCtx());
    expect(attrs["gen_ai.conversation.id"]).toBe("s-abc123-xyz");
  });

  it("omits gen_ai.conversation.id when there is no session id (never derived)", () => {
    const attrs = llmSpanStartAttributes("groq", "m", baseCtx({ conversationId: null }));
    expect(attrs["gen_ai.conversation.id"]).toBeUndefined();
    expect(Object.keys(attrs).join("|")).not.toContain("conversation");
  });

  it("never exceeds the capture bounds even for the longest legal input", () => {
    const long = "y".repeat(3000);
    const attrs = llmSpanStartAttributes(
      "huggingface",
      "openai/gpt-oss-120b",
      baseCtx({
        messages: Array.from({ length: 9 }, () => ({ role: "user", content: long })),
        system: long,
      }),
    );
    expect((attrs["gen_ai.input.messages"] as string).length).toBeLessThanOrEqual(6000);
    expect((attrs["gen_ai.system_instructions"] as string).length).toBeLessThanOrEqual(2000);
  });
});

describe("llmSpanResponseAttributes", () => {
  it("shapes the output message and finish reasons per the conventions", () => {
    const attrs = llmSpanResponseAttributes({
      model: "openai/gpt-oss-120b",
      id: "chatcmpl-123",
      text: "Kenya has a handful of operational facilities.",
      finishReason: "stop",
      inputTokens: 210,
      outputTokens: 48,
    });
    const output = JSON.parse(attrs["gen_ai.output.messages"] as string);
    expect(output).toEqual([
      {
        role: "assistant",
        parts: [{ type: "text", content: "Kenya has a handful of operational facilities." }],
      },
    ]);
    expect(JSON.parse(attrs["gen_ai.response.finish_reasons"] as string)).toEqual(["stop"]);
    expect(attrs["gen_ai.response.model"]).toBe("openai/gpt-oss-120b");
    expect(attrs["gen_ai.response.id"]).toBe("chatcmpl-123");
    expect(attrs["gen_ai.usage.input_tokens"]).toBe(210);
    expect(attrs["gen_ai.usage.output_tokens"]).toBe(48);
  });

  it("omits identity and usage attributes the provider did not report", () => {
    const attrs = llmSpanResponseAttributes({ text: "A grounded answer." });
    expect(attrs["gen_ai.response.model"]).toBeUndefined();
    expect(attrs["gen_ai.response.id"]).toBeUndefined();
    expect(attrs["gen_ai.usage.input_tokens"]).toBeUndefined();
    expect(attrs["gen_ai.usage.output_tokens"]).toBeUndefined();
    // finish_reasons always present, defaulting to stop.
    expect(JSON.parse(attrs["gen_ai.response.finish_reasons"] as string)).toEqual(["stop"]);
  });

  it("bounds the recorded answer text", () => {
    const attrs = llmSpanResponseAttributes({ text: "z".repeat(9000) });
    expect((attrs["gen_ai.output.messages"] as string).length).toBeLessThanOrEqual(4000);
  });
});

describe("agentSpanAttributes", () => {
  it("describes the Jibu run and lists the providers it will walk", () => {
    const attrs = agentSpanAttributes(baseCtx(), ["groq", "nvidia"]);
    expect(attrs["gen_ai.operation.name"]).toBe("invoke_agent");
    expect(attrs["gen_ai.agent.name"]).toBe("Jibu");
    expect(attrs["jibu.providers"]).toBe("groq,nvidia");
    expect(attrs["gen_ai.conversation.id"]).toBe("s-abc123-xyz");
  });

  it("omits conversation grouping when no session id was supplied", () => {
    const attrs = agentSpanAttributes(baseCtx({ conversationId: null }), ["groq"]);
    expect(attrs["gen_ai.conversation.id"]).toBeUndefined();
  });
});
