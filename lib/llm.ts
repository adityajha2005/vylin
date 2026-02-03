import { generateText, streamText } from "ai";
import { xai } from "@ai-sdk/xai";
import { MAX_OUTPUT_TOKENS } from "./constants";
import type { StreamTextResult } from "ai";

const model = xai("grok-4-1-fast-reasoning");

export const runLLM = async (prompt: string, stream = false) => {
    if (stream) {
        return streamText({
            model,
            prompt,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
        });
    }

    if (!prompt.trim()) {
        return { text: "", usage: null };
    }

    const { text, usage } = await generateText({
        model,
        prompt,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    return { text, usage };
};
