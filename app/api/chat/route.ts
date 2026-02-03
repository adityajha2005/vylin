import { NextResponse } from "next/server";
import { z } from "zod";
import { MAX_QUESTION_LENGTH } from "../../../lib/constants";
import { classifyQuestion } from "../../../logic/classify";
import { chargeCredits } from "../../../logic/credits";
import { getRefusalMessage } from "../../../logic/refusal";

export const runtime = "nodejs";

const ChatSchema = z.object({
  question: z.string().min(1).max(MAX_QUESTION_LENGTH),
  mode: z.enum(["normal", "research", "onchain"]).default("normal"),
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, mode } = ChatSchema.parse(body);

    const classification = classifyQuestion(question);

    if (classification.kind === "instance-specific" && mode !== "onchain") {
      const message =
        getRefusalMessage(classification.kind) ??
        "This request is not allowed.";
      return NextResponse.json({ error: message }, { status: 403 });
    }

    const creditCheck = await chargeCredits(
      getClientIdentifier(req),
      mode
    );

    if (!creditCheck.allowed) {
      const message =
        creditCheck.reason === "cooldown"
          ? "Please wait 30 seconds between requests"
          : "Daily credit limit reached";
      return NextResponse.json({ error: message }, { status: 429 });
    }

    return NextResponse.json({
      ok: true,
      app: "Vylin",
      message: "its live",
    });
  } catch {
    return NextResponse.json(
      { error: "invalid request" },
      { status: 400 }
    );
  }
}
