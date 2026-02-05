"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get("code");
      const next = searchParams.get("next") || "/chat";

      try {
        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        } else {
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            setError("No session found. Please try signing in again.");
            return;
          }
        }

        router.replace(next);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to complete sign in.";
        setError(message);
      }
    };

    run();
  }, [router, searchParams, supabase]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Finalizing your sign-in
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {error ? error : "Hang tight while we connect your account."}
        </p>
        {error ? (
          <button
            type="button"
            onClick={() => router.replace("/login")}
            className="mt-6 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Back to login
          </button>
        ) : null}
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <AuthCallbackContent />
    </Suspense>
  );
}
