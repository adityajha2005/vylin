import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type LimitResult = Awaited<ReturnType<InstanceType<typeof Ratelimit>["limit"]>>;

type RatelimitLike = {
  limit: (identifier: string) => Promise<LimitResult>;
};

const createRatelimit = (): RatelimitLike => {
  try {
    const redis = Redis.fromEnv();

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "1 m"),
    });
  } catch {
    return {
      limit: async () =>
        ({
          success: true,
          limit: 0,
          remaining: 0,
          reset: 0,
        } as LimitResult),
    };
  }
};

export const ratelimit = createRatelimit();
