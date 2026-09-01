import { getKnowledgeIndex, getFaqPairs } from "@/lib/chatbot/knowledge";
import { tokenize } from "@/lib/chatbot/retrieve";
import { BOT_IDENTITY, RESCUE_SUGGESTIONS } from "@/lib/chatbot/identity";
import { extractEntities, runIntents, fmtVerified, type BotReply, type Entities } from "@/lib/chatbot/intents";

/**
 * The orchestrator. Pipeline per message:
 *   1. normalise + entity extraction (with pronoun carry-over from history)
 *   2. deterministic data intents (query directory-data.ts directly)
 *   3. exact-match editorial FAQ
 *   4. BM25 retrieval over the live index, confidence-gated
 *   5. the fallback ladder:
 *        tier 1 "reformulate" — nearest matches + chips
 *        tier 2 "partial"     — answer the trackable part, name the gap
 *        tier 3 "escalate"    — route to humans/tools
 *   Every escalation fires analytics (tier 4 "log & learn", client-side).
 */

export interface ChatTurn {
  role: "user" | "bot";
  content: string;
}

export interface EngineResult extends BotReply {
  /** Context handed to the optional LLM polish step. */
  contextChunks: { title: string; href: string; text: string }[];
  /**
   * True when the deterministic reply came from the below-threshold
   * "reformulate" tier. The LLM step may then attempt a grounded rescue from
   * contextChunks — under a strict answer-or-NOT_IN_NOTES contract — and the
   * reply is upgraded to a real answer only if it takes.
   */
  weak?: boolean;
}

const OFF_TOPIC_SIGNALS =
  /(recipe|football|weather|stock price|bitcoin price|president|prime minister|celebrit|movie|song|joke about|medical|diagnos|love life|capital of france|who won)/;

function normScoreThreshold(query: string): number {
  const words = query.trim().split(/\s+/).length;
  // Very short queries get a slightly lower bar; long rambles a higher one.
  if (words <= 2) return 0.24;
  if (words >= 12) return 0.34;
  return 0.28;
}

function trimToSentences(text: string, maxSentences: number): string {
  const parts = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return parts.slice(0, maxSentences).join(" ").trim();
}

function exactFaqMatch(query: string): BotReply | null {
  const q = query.toLowerCase().replace(/[?.!]/g, " ").replace(/\s+/g, " ").trim();
  const qTokens = new Set(tokenize(query));
  const pairs = getFaqPairs();
  for (const pair of pairs) {
    for (const kw of pair.keywords) {
      if (q.includes(kw)) {
        return {
          reply: pair.a,
          citations: pair.links.map((l) => ({ label: l.label, href: l.href })),
          suggestions: ["Can I download the dataset?", "How does DC254 verify its numbers?"],
          intent: "faq",
          answered: true,
        };
      }
    }
  }
  // Whole-question similarity fallback (≥60% of content words overlap).
  for (const pair of pairs) {
    const pairTokens = new Set(tokenize(pair.q));
    let overlap = 0;
    for (const t of qTokens) if (pairTokens.has(t)) overlap += 1;
    if (qTokens.size > 2 && overlap / qTokens.size >= 0.6) {
      return {
        reply: pair.a,
        citations: pair.links.map((l) => ({ label: l.label, href: l.href })),
        suggestions: RESCUE_SUGGESTIONS.slice(0, 3),
        intent: "faq",
        answered: true,
      };
    }
  }
  return null;
}

function composeExtractive(hit: { title: string; href: string; heading?: string; text: string; kind: string }): BotReply {
  const answer = trimToSentences(hit.text, 3);
  const lead = hit.kind === "glossary"
    ? "From the DC254 glossary:"
    : hit.kind === "fact"
      ? "From the verified infrastructure records:"
      : `From "${hit.title}" on DC254:`;
  return {
    reply: `${lead} ${answer}`,
    citations: [{ label: hit.title, href: hit.href }],
    suggestions: ["How does DC254 verify its numbers?", "What's under construction right now?"],
    intent: `retrieval:${hit.kind}`,
    answered: true,
  };
}

function escalate(query: string): EngineResult {
  return {
    reply: `${BOT_IDENTITY.scopeReminder} You can also search the whole site, download the dataset, or write to the team directly — they answer humans fast.`,
    citations: [
      { label: "Search the site", href: "/search" },
      { label: "Download the dataset", href: "/api/directory/csv" },
      { label: "Contact DC254", href: "/contact" },
    ],
    suggestions: [...RESCUE_SUGGESTIONS.slice(0, 3)],
    intent: OFF_TOPIC_SIGNALS.test(query.toLowerCase()) ? "fallback:offtopic" : "fallback:escalate",
    answered: false,
    fallback: "escalate",
    contextChunks: [],
  };
}

export function answerQuestion(rawQuery: string, history: ChatTurn[] = []): EngineResult {
  const query = rawQuery.trim().slice(0, 500);
  const lower = query.toLowerCase();
  const historyTail = history.slice(-4).map((t) => t.content);

  const entities: Entities = extractEntities(query, historyTail);

  // 1 ── Deterministic, dataset-grounded intents first.
  const intentReply = runIntents(lower, entities, historyTail);
  if (intentReply) {
    return {
      ...intentReply,
      contextChunks: [],
    };
  }

  // 2 ── Exact editorial FAQ.
  const faq = exactFaqMatch(query);
  if (faq) return { ...faq, contextChunks: [] };

  // 3 ── Retrieval with confidence gate. When the question smells off-topic
  // (celebrities, recipes, geopolitics…), we don't block it — a legitimate
  // question like "what did the president announce about data centres?"
  // contains the same words. We just raise the bar a lot: a real corpus hit
  // clears 0.5 easily, a stray keyword match doesn't.
  const offTopic = OFF_TOPIC_SIGNALS.test(lower);
  const index = getKnowledgeIndex();
  const hits = index.search(query, 4);
  const threshold = offTopic
    ? Math.max(normScoreThreshold(query), 0.5)
    : normScoreThreshold(query);

  if (hits.length && hits[0].normalized >= threshold) {
    const best = hits[0].chunk;
    // Off-topic guard, part 2: even a passing score must come from most of
    // the question's words being present, not one stray keyword.
    if (offTopic) {
      const qTokens = tokenize(query);
      const chunkTokens = new Set(best.tokens);
      const covered = qTokens.filter((t) => chunkTokens.has(t)).length;
      if (qTokens.length && covered / qTokens.length < 0.75) {
        return escalate(query);
      }
    }
    const extractive = composeExtractive({
      title: best.title,
      href: best.href,
      heading: best.heading,
      text: best.text,
      kind: best.kind,
    });
    return {
      ...extractive,
      contextChunks: hits.slice(0, 3).map((h) => ({
        title: h.chunk.title,
        href: h.chunk.href,
        text: trimToSentences(h.chunk.text, 4),
      })),
    };
  }

  // 4 ── Fallback ladder.

  // Tier 1 — reformulate: we found *something*, just not confidently.
  if (hits.length && hits[0].normalized > 0) {
    const nearest = hits.slice(0, 3).map((h) => h.chunk);
    return {
      reply: `I'm not fully sure I read that right — but the closest things on the site are: ${nearest
        .map((n) => `"${n.title}"`)
        .join(", ")}. Want me to take you to one, or ask me again in different words?`,
      citations: nearest.map((n) => ({ label: n.title, href: n.href })),
      suggestions: [...RESCUE_SUGGESTIONS.slice(0, 3)],
      intent: "fallback:reformulate",
      answered: false,
      fallback: "reformulate",
      contextChunks: nearest.map((n) => ({
        title: n.title,
        href: n.href,
        text: trimToSentences(n.text, 4),
      })),
      weak: true,
    };
  }

  // Tier 3 — escalate: completely outside my world.
  return escalate(query);
}

export { fmtVerified };
