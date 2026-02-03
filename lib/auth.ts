import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export const getUserFromRequest = async (
  req: Request
): Promise<SupabaseUser | null> => {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.toLowerCase().startsWith("bearer ")) {
      return null;
    }

    const token = authHeader.slice(7).trim();
    if (!token) return null;

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;

    return data.user;
  } catch {
    return null;
  }
};
