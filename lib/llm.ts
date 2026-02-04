import { generateText, streamText } from "ai";
import { xai } from "@ai-sdk/xai";
import { MAX_OUTPUT_TOKENS } from "./constants";

const model = xai("grok-4-1-fast-reasoning");

export const runLLM = async ({
    system,
    prompt,
    stream = false,
}: {
    system: string;
    prompt: string;
    stream?: boolean;
}) => {
    if (stream) {
        return streamText({
            model,
            system,
            prompt,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
        });
    }

    if (!prompt.trim()) {
        return { text: "", usage: null };
    }

    const { text, usage } = await generateText({
        model,
        system,
        prompt,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
    });

    return { text, usage };
};
