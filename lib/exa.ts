import Exa from "exa-js";
import { ALLOWED_SEARCH_DOMAINS } from "./constants";

const MAX_EXCERPT_LENGTH = 500 as const;

const apiKey = process.env.EXA_API_KEY;
const exa = apiKey ? new Exa(apiKey) : null;

type SearchResult = {
  title: string;
  url: string;
  excerpt: string;
};

const sanitizeExcerpt = (input: string): string => {
  const withoutCodeBlocks = input.replace(/```[\s\S]*?```/g, " ");
  const withoutInlineCode = withoutCodeBlocks.replace(/`[^`]*`/g, " ");
  const withoutHtml = withoutInlineCode.replace(/<[^>]*>/g, " ");
  const withoutImages = withoutHtml.replace(/!\[[^\]]*\]\([^)]*\)/g, " ");
  const withoutLinks = withoutImages.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  const withoutMdTokens = withoutLinks.replace(/[*_~#>`]+/g, " ");
  const normalized = withoutMdTokens.replace(/\s+/g, " ").trim();

  if (normalized.length <= MAX_EXCERPT_LENGTH) return normalized;
  return normalized.slice(0, MAX_EXCERPT_LENGTH).trim();
};

export const searchDocs = async (
  query: string,
  options?: { maxResults?: number }
): Promise<SearchResult[]> => {
  if (!exa) return [];

  const trimmed = query.trim();
  if (!trimmed) return [];

  const numResults = Math.min(10, Math.max(1, options?.maxResults ?? 10));

  try {
    const response = await exa.search(trimmed, {
      numResults,
      includeDomains: Array.from(ALLOWED_SEARCH_DOMAINS),
      contents: {
        highlights: {
          maxCharacters: 1200,
        },
      },
    });

    if (!response?.results?.length) return [];

    return response.results.map((result) => {
      const rawExcerpt = Array.isArray((result as { highlights?: unknown }).highlights)
        ? (result as { highlights: string[] }).highlights.join(" ")
        : "text" in result && typeof result.text === "string"
          ? result.text
          : "";

      return {
        title: result.title ?? "",
        url: result.url ?? "",
        excerpt: sanitizeExcerpt(rawExcerpt),
      };
    });
  } catch {
    return [];
  }
};
