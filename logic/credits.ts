import {
  DAILY_FREE_REQUEST_LIMIT,
  NORMAL_MODE_COST,
  ONCHAIN_MODE_COST,
  RESEARCH_MODE_COST,
} from "../lib/constants";
import { supabase } from "../lib/supabase";

export type ChatMode = "normal" | "research" | "onchain";

type CreditBlockReason = "daily-limit" | "cooldown";

export type CreditChargeResult = {
  allowed: boolean;
  cost: number;
  remaining: number;
  limit: number;
  reason?: CreditBlockReason;
};

type UsageRecord = {
  date: string;
  used: number;
  lastRequestAt?: number;
};

type UsageRow = {
  user_id: string;
  date: string;
  used: number;
  last_request_at: string | null;
};

type DbUsageSnapshot = {
  ok: boolean;
  exists: boolean;
  used: number;
  lastRequestAt: number | null;
  lastRequestAtRaw: string | null;
};

const USAGE_TABLE = "usage_limits" as const;
const COOLDOWN_MS = 30_000 as const;

// NOTE: In-memory store for development only.
// Used as a fallback if Supabase is unavailable.
const usageByKey = new Map<string, UsageRecord>();

const getUtcDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const getModeCost = (mode: ChatMode): number => {
  switch (mode) {
    case "research":
      return RESEARCH_MODE_COST;
    case "onchain":
      return ONCHAIN_MODE_COST;
    case "normal":
    default:
      return NORMAL_MODE_COST;
  }
};

const normalizeUsed = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

const parseTimestamp = (value: unknown): number | null => {
  if (typeof value !== "string") return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getUsage = (key: string): UsageRecord => {
  const today = getUtcDateKey(new Date());
  const existing = usageByKey.get(key);

  if (!existing || existing.date !== today) {
    const fresh: UsageRecord = { date: today, used: 0 };
    usageByKey.set(key, fresh);
    return fresh;
  }

  return existing;
};

const seedUsage = (key: string, date: string, used: number, lastAt?: number) => {
  usageByKey.set(key, { date, used, lastRequestAt: lastAt });
};

const cooldownActive = (lastAt: number | null, nowMs: number): boolean => {
  if (!lastAt) return false;
  return nowMs - lastAt < COOLDOWN_MS;
};

const chargeCreditsInMemory = (
  key: string,
  cost: number,
  limit: number,
  nowMs: number
): CreditChargeResult => {
  const usage = getUsage(key);

  if (cooldownActive(usage.lastRequestAt ?? null, nowMs)) {
    return {
      allowed: false,
      cost,
      remaining: Math.max(0, limit - usage.used),
      limit,
      reason: "cooldown",
    };
  }

  const nextUsed = usage.used + cost;

  if (nextUsed > limit) {
    return {
      allowed: false,
      cost,
      remaining: Math.max(0, limit - usage.used),
      limit,
      reason: "daily-limit",
    };
  }

  usage.used = nextUsed;
  usage.lastRequestAt = nowMs;
  usageByKey.set(key, usage);

  return {
    allowed: true,
    cost,
    remaining: Math.max(0, limit - usage.used),
    limit,
  };
};

const fetchUsageFromDb = async (
  userId: string,
  date: string
): Promise<DbUsageSnapshot> => {
  try {
    const { data, error } = await supabase
      .from(USAGE_TABLE)
      .select("used,last_request_at")
      .eq("user_id", userId)
      .eq("date", date)
      .maybeSingle();

    if (error) {
      return {
        ok: false,
        exists: false,
        used: 0,
        lastRequestAt: null,
        lastRequestAtRaw: null,
      };
    }

    if (!data) {
      return {
        ok: true,
        exists: false,
        used: 0,
        lastRequestAt: null,
        lastRequestAtRaw: null,
      };
    }

    const lastRaw = typeof data.last_request_at === "string"
      ? data.last_request_at
      : null;

    return {
      ok: true,
      exists: true,
      used: normalizeUsed(data.used),
      lastRequestAt: parseTimestamp(lastRaw),
      lastRequestAtRaw: lastRaw,
    };
  } catch {
    return {
      ok: false,
      exists: false,
      used: 0,
      lastRequestAt: null,
      lastRequestAtRaw: null,
    };
  }
};

const insertUsage = async (
  userId: string,
  date: string,
  used: number,
  lastRequestAt: string
): Promise<{ ok: boolean; inserted: boolean }> => {
  try {
    const { data, error } = await supabase
      .from(USAGE_TABLE)
      .upsert(
        {
          user_id: userId,
          date,
          used,
          last_request_at: lastRequestAt,
        } satisfies UsageRow,
        { onConflict: "user_id,date", ignoreDuplicates: true }
      )
      .select("used");

    if (error) return { ok: false, inserted: false };

    return {
      ok: true,
      inserted: Array.isArray(data) && data.length > 0,
    };
  } catch {
    return { ok: false, inserted: false };
  }
};

const updateUsageIfUnchanged = async (
  userId: string,
  date: string,
  expectedUsed: number,
  expectedLastRaw: string | null,
  nextUsed: number,
  nextLastRaw: string
): Promise<boolean> => {
  try {
    let query = supabase
      .from(USAGE_TABLE)
      .update({
        used: nextUsed,
        last_request_at: nextLastRaw,
      })
      .eq("user_id", userId)
      .eq("date", date)
      .eq("used", expectedUsed);

    query = expectedLastRaw === null
      ? query.is("last_request_at", null)
      : query.eq("last_request_at", expectedLastRaw);

    const { data, error } = await query.select("used");
    if (error) return false;

    return Array.isArray(data) && data.length === 1;
  } catch {
    return false;
  }
};

export const chargeCredits = async (
  key: string,
  mode: ChatMode
): Promise<CreditChargeResult> => {
  const safeKey = key.trim() || "anonymous";
  const cost = getModeCost(mode);
  const limit = DAILY_FREE_REQUEST_LIMIT;
  const now = new Date();
  const today = getUtcDateKey(now);
  const nowMs = now.getTime();
  const nowIso = now.toISOString();

  const firstSnapshot = await fetchUsageFromDb(safeKey, today);
  if (firstSnapshot.ok) {
    let snapshot = firstSnapshot;

    if (!snapshot.exists) {
      if (cost > limit) {
        return {
          allowed: false,
          cost,
          remaining: limit,
          limit,
          reason: "daily-limit",
        };
      }

      const insertResult = await insertUsage(safeKey, today, cost, nowIso);
      if (insertResult.ok && insertResult.inserted) {
        return {
          allowed: true,
          cost,
          remaining: Math.max(0, limit - cost),
          limit,
        };
      }

      snapshot = await fetchUsageFromDb(safeKey, today);
      if (!snapshot.ok) {
        return chargeCreditsInMemory(safeKey, cost, limit, nowMs);
      }
    }

    for (let attempt = 0; attempt < 2; attempt += 1) {
      if (cooldownActive(snapshot.lastRequestAt, nowMs)) {
        return {
          allowed: false,
          cost,
          remaining: Math.max(0, limit - snapshot.used),
          limit,
          reason: "cooldown",
        };
      }

      const nextUsed = snapshot.used + cost;
      if (nextUsed > limit) {
        return {
          allowed: false,
          cost,
          remaining: Math.max(0, limit - snapshot.used),
          limit,
          reason: "daily-limit",
        };
      }

      const updated = await updateUsageIfUnchanged(
        safeKey,
        today,
        snapshot.used,
        snapshot.lastRequestAtRaw,
        nextUsed,
        nowIso
      );

      if (updated) {
        return {
          allowed: true,
          cost,
          remaining: Math.max(0, limit - nextUsed),
          limit,
        };
      }

      const refreshed = await fetchUsageFromDb(safeKey, today);
      if (!refreshed.ok) {
        return chargeCreditsInMemory(safeKey, cost, limit, nowMs);
      }
      snapshot = refreshed;
    }

    return chargeCreditsInMemory(safeKey, cost, limit, nowMs);
  }

  return chargeCreditsInMemory(safeKey, cost, limit, nowMs);
};
