import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_QUESTION_LENGTH } from "../../../lib/constants";
import { classifyQuestion } from "../../../logic/classify";
import { chargeCredits } from "../../../logic/credits";
import { getRefusalMessage } from "../../../logic/refusal";
import { searchDocs } from "../../../lib/exa";
import {
  buildSystemPrompt,
  buildUserPrompt,
} from "../../../logic/prompt";
import { runLLM } from "../../../lib/llm";
import { getUserFromRequest } from "../../../lib/auth";

export const runtime = "nodejs";

const ChatSchema = z.object({
  question: z.string().min(1).max(MAX_QUESTION_LENGTH),
  mode: z.enum(["normal", "research", "onchain"]).default("normal"),
  stream: z.boolean().optional(),
});

const getClientIdentifier = (req: Request): string => {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0]?.trim();
    if (ip) return `ip:${ip}`;
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return `ip:${realIp}`;

  return "ip:unknown";
};

const DOCS_SIGNAL_REGEX =
  /\b(sol[a]?na|anchor|web3|program|rpc|sdk|api|docs|documentation|spec|reference|error|stack trace|signature|transaction|account|wallet|token|mint|instruction)\b/i;

const shouldSearchDocs = (
  question: string,
  mode: "normal" | "research" | "onchain"
): boolean => {
  if (mode !== "research") return false;
  const trimmed = question.trim();
  if (!trimmed) return false;
  if (trimmed.length >= 80) return true;
  return DOCS_SIGNAL_REGEX.test(trimmed);
};

const isStreamResult = (
  value: unknown
): value is { toTextStreamResponse: (init?: ResponseInit) => Response } =>
  typeof value === "object" &&
  value !== null &&
  "toTextStreamResponse" in value &&
  typeof (value as { toTextStreamResponse?: unknown }).toTextStreamResponse ===
    "function";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, mode, stream } = ChatSchema.parse(body);

    const user = await getUserFromRequest(req);
    const creditKey = user?.id ?? getClientIdentifier(req);

    const classification = classifyQuestion(question);

    if (classification.kind === "instance-specific" && mode !== "onchain") {
      const message =
        getRefusalMessage(classification.kind) ??
        "This request is not allowed.";
      return NextResponse.json({ error: message }, { status: 403 });
    }

    const creditCheck = await chargeCredits(creditKey, mode);

    if (!creditCheck.allowed) {
      const message =
        creditCheck.reason === "cooldown"
          ? "Please wait 30 seconds between requests"
          : "Daily credit limit reached";
      return NextResponse.json({ error: message }, { status: 429 });
    }

    const systemPrompt = buildSystemPrompt({ mode });

    let sources:
      | Array<{ title: string; url: string; excerpt: string }>
      | undefined;

    if (mode !== "onchain" && shouldSearchDocs(question, mode)) {
      const results = await searchDocs(question, { maxResults: 10 });
      sources = results.length > 0 ? results : undefined;
    }

    const userPrompt = buildUserPrompt({
      question,
      sources,
      onchainData: mode === "onchain" ? "" : undefined,
    });

    if (stream) {
      // Streaming returns a raw text stream.
      const streamResult = await runLLM({
        system: systemPrompt,
        prompt: userPrompt,
        stream: true,
      });
      if (isStreamResult(streamResult)) {
        return streamResult.toTextStreamResponse();
      }

      return NextResponse.json(
        { error: "Streaming unavailable" },
        { status: 500 }
      );
    }

    const llmResult = await runLLM({
      system: systemPrompt,
      prompt: userPrompt,
    });
    const responseSources = sources?.map(({ title, url }) => ({
      title,
      url,
    }));

    return NextResponse.json({
      ok: true,
      answer: llmResult.text,
      ...(responseSources ? { sources: responseSources } : {}),
    });
  } catch {
    return NextResponse.json(
      { error: "invalid request" },
      { status: 400 }
    );
  }
}
