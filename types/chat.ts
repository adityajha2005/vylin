export type ChatMode = "normal" | "research" | "onchain";

export type ChatRequest = {
  question: string;
  mode?: ChatMode;
  stream?: boolean;
};

export type ChatSource = {
  title: string;
  url: string;
};

export type ChatSuccessResponse = {
  ok: true;
  answer: string;
  sources?: ChatSource[];
};

export type ChatErrorResponse = {
  error: string;
};

export type ChatResponse = ChatSuccessResponse | ChatErrorResponse;

export type CreditBlockReason = "daily-limit" | "cooldown";

export type CreditChargeResult = {
  allowed: boolean;
  cost: number;
  remaining: number;
  limit: number;
  reason?: CreditBlockReason;
};
