export const buildSystemPrompt = (options?: {
  mode?: "normal" | "research" | "onchain";
}): string => {
  const base = [
    "You are Vylin, a Solana-first technical assistant.",
    "Be concise, technical, and neutral.",
    "Do not guess or hallucinate.",
    "When sources are provided, answer only using those sources.",
    "If the needed information is missing from sources, reply exactly: Not found in sources",
    "Instance-specific analysis is allowed only when on-chain data is explicitly provided by the system.",
    "Do not imply access to wallets, private data, or live chain state.",
    "If on-chain data is insufficient to determine a cause, say that explicitly."
  ];

  if (options?.mode === "onchain") {
    base.push(
      "If on-chain data is provided, treat it as factual input supplied by the system."
    );
  }

  return base.join("\n");
};

export const buildUserPrompt = (args: {
  question: string;
  sources?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
  onchainData?: string;
}): string => {
  const sections: string[] = [];

  const sources = args.sources?.filter((source) => source) ?? [];
  if (sources.length > 0) {
    const sourceBlocks = sources.map((source) => {
      const title = source.title?.trim() ?? "";
      const url = source.url?.trim() ?? "";
      const excerpt = source.excerpt?.trim() ?? "";
      return [
        "SOURCES",
        `Title: ${title}`,
        `URL: ${url}`,
        `Excerpt: ${excerpt}`,
      ].join("\n");
    });

    sections.push(sourceBlocks.join("\n\n"));
  }

  const onchainData = args.onchainData?.trim();
  if (onchainData) {
    sections.push(["ON-CHAIN DATA", onchainData].join("\n"));
  }

  const question = args.question.trim();
  sections.push(["QUESTION", question].join("\n"));

  return sections.join("\n\n");
};
