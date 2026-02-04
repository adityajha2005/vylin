import { Helius } from "helius-sdk";

type HeliusClient = Helius;

type TransactionResponse = {
  transaction?: {
    message?: {
      accountKeys?: Array<string | { pubkey?: string } | { toBase58?: () => string }>;
      instructions?: Array<{
        programId?: string;
        programIdIndex?: number;
      }>;
    };
  };
  meta?: {
    err?: unknown;
    computeUnitsConsumed?: number;
    innerInstructions?: Array<{
      instructions?: Array<{
        programId?: string;
        programIdIndex?: number;
      }>;
    }>;
  };
};

let cachedClient: HeliusClient | null | undefined;

const sanitizeText = (input: string): string =>
  input
    .replace(/[\r\n]+/g, " ")
    .replace(/[\x00-\x1F\x7F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return sanitizeText(value);
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  try {
    return sanitizeText(JSON.stringify(value));
  } catch {
    return "";
  }
};

const uniqueList = (values: Array<string | undefined>): string[] => {
  const set = new Set<string>();
  for (const value of values) {
    const cleaned = value ? sanitizeText(value) : "";
    if (cleaned) set.add(cleaned);
  }
  return Array.from(set);
};

const toBase58String = (value: unknown): string | undefined => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    if ("pubkey" in value && typeof (value as { pubkey?: string }).pubkey === "string") {
      return (value as { pubkey: string }).pubkey;
    }
    if ("toBase58" in value && typeof (value as { toBase58?: () => string }).toBase58 === "function") {
      return (value as { toBase58: () => string }).toBase58();
    }
  }
  return undefined;
};

const extractAccountKeys = (response: TransactionResponse): string[] => {
  const keys = response.transaction?.message?.accountKeys ?? [];
  return uniqueList(keys.map((key) => toBase58String(key)));
};

const formatList = (label: string, values: string[], limit = 10): string => {
  if (values.length === 0) return "";
  const trimmed = values.slice(0, limit);
  const remainder = values.length - trimmed.length;
  const suffix = remainder > 0 ? ` and ${remainder} more` : "";
  return `${label}: ${trimmed.join(", ")}${suffix}`;
};

const extractProgramIds = (
  response: TransactionResponse,
  accountKeys: string[]
): string[] => {
  const ids: Array<string | undefined> = [];
  const instructions = response.transaction?.message?.instructions ?? [];

  for (const ix of instructions) {
    if (ix.programId) {
      ids.push(ix.programId);
    } else if (typeof ix.programIdIndex === "number") {
      ids.push(accountKeys[ix.programIdIndex]);
    }
  }

  const inner = response.meta?.innerInstructions ?? [];
  for (const group of inner) {
    for (const ix of group.instructions ?? []) {
      if (ix.programId) {
        ids.push(ix.programId);
      } else if (typeof ix.programIdIndex === "number") {
        ids.push(accountKeys[ix.programIdIndex]);
      }
    }
  }

  return uniqueList(ids);
};

export const initHeliusClient = (): HeliusClient | null => {
  if (cachedClient !== undefined) return cachedClient;

  const apiKey = process.env.HELIUS_API_KEY;
  if (!apiKey) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = new Helius(apiKey);
  return cachedClient;
};

export const validateTxHash = (txHash: string): boolean =>
  /^[1-9A-HJ-NP-Za-km-z]{32,88}$/.test(txHash);

export const fetchTransactionData = async (txHash: string): Promise<string> => {
  const client = initHeliusClient();
  if (!client) {
    return "On-chain data unavailable for the given transaction.";
  }

  try {
    const response = (await client.connection.getTransaction(txHash, {
      maxSupportedTransactionVersion: 0,
    })) as TransactionResponse | null;

    if (!response) {
      return "On-chain data unavailable for the given transaction.";
    }

    const accountKeys = extractAccountKeys(response);
    const programIds = extractProgramIds(response, accountKeys);
    const feePayer = accountKeys[0] ?? "";
    const computeUnits = response.meta?.computeUnitsConsumed;
    const isSuccess = !response.meta?.err;
    const status = isSuccess ? "success" : "failure";
    const errorValue = response.meta?.err ? sanitizeValue(response.meta.err) : "";

    const lines = [
      "ONCHAIN DATA",
      `Status: ${status}`,
      errorValue ? `Error: ${errorValue}` : "",
      Number.isFinite(computeUnits)
        ? `Compute units: ${computeUnits}`
        : "",
      feePayer ? `Fee payer: ${sanitizeText(feePayer)}` : "",
      formatList("Accounts", accountKeys, 10),
      formatList("Program IDs", programIds, 8),
    ].filter(Boolean);

    return lines.join("\n");
  } catch {
    return "On-chain data unavailable for the given transaction.";
  }
};
