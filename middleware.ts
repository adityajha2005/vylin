import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

const ratelimit = (() => {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  //bypass ratelimit till redis isnt set.
  if (!url || !token) return null;

  try {
    const redis = Redis.fromEnv();
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(20, "10 s"),
    });
  } catch {
    return null;
  }
})();

const getClientIp = (request: NextRequest): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "0.0.0.0";
};

export const config = {
  matcher: ["/api/:path*"],
};

export async function middleware(request: NextRequest) {
  if (!ratelimit) return NextResponse.next();

  try {
    const ip = getClientIp(request);
    const result = await ratelimit.limit(ip);

    if (!result.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}
