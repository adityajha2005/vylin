import { ONCHAIN_MODE_COST } from "../lib/constants";

export const getRefusalMessage = (
  kind: "instance-specific" | "general"
): string | null => {
  if (kind === "instance-specific") {
    return `This question refers to a specific on-chain instance. Analyzing transactions, wallets, or addresses is only available in onchain mode, which costs ${ONCHAIN_MODE_COST} credits. Please switch to onchain mode to proceed.`;
  }

  return null;
};
