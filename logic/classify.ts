export type ClassificationResult = {
  kind: "general" | "instance-specific";
  signals: string[];
};

const INSTANCE_KEYWORD_PATTERNS: RegExp[] = [
  /\bmy\s+(wallet|address|account|balance|transaction|tx|signature|nft|token|tokens|portfolio|holdings)\b/i,
  /\bthis\s+(wallet|address|account|balance|transaction|tx|signature|nft|token|program|contract|mint)\b/i,
  /\b(tx|transaction)\s+id\b/i,
];

const BASE58_ADDRESS = /\b[1-9A-HJ-NP-Za-km-z]{32,64}\b/;
const HEX_ADDRESS = /\b0x[a-fA-F0-9]{40}\b/;

const isInstanceSpecificQuestion = (question: string): boolean => {
  if (BASE58_ADDRESS.test(question) || HEX_ADDRESS.test(question)) return true;
  return INSTANCE_KEYWORD_PATTERNS.some((pattern) => pattern.test(question));
};

export const classifyQuestion = (question: string): ClassificationResult => {
  const trimmed = question.trim();
  if (!trimmed) return { kind: "general", signals: ["empty"] };

  if (isInstanceSpecificQuestion(trimmed)) {
    return {
      kind: "instance-specific",
      signals: ["address-or-instance-detected"],
    };
  }

  return { kind: "general", signals: [] };
};
