"use client";

import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const providers = [
  { id: "google", label: "Continue with Google", icon: "/google-icon-logo-svgrepo-com.svg", type: "img" },
  { id: "github", label: "Continue with GitHub", icon: "/github-svgrepo-com.svg", type: "img" },
] as const;

export default function LoginPage() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : "";

  const handleProvider = async (providerId: string) => {
    setStatus("loading");
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: providerId as "google" | "github",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);

    if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            setStatus("error");
            setMessage(error.message);
        } else {
             window.location.href = "/";
        }
    } else {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectTo,
            }
        });
        
        if (error) {
            setStatus("error");
            setMessage(error.message);
        } else {
            setStatus("success");
            setMessage("Please check your email specifically for the confirmation link.");
        }
    }
    
    // Only reset status if error, otherwise we are redirecting or showing success
    if (status === 'error') setStatus("idle");
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900 font-sans">
      {/* Left Panel */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 py-12 lg:px-20 xl:px-32">
        <div className="w-full max-w-[440px] mx-auto">
          
          {/* Header & Toggle */}
          <div className="mb-10 text-center sm:text-left">
            <div className="mb-8 inline-flex rounded-full border border-gray-200 p-1">
                <button 
                  onClick={() => setMode("login")}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                    mode === "login" 
                      ? "bg-white text-slate-900 shadow-sm border border-gray-100" 
                      : "text-slate-500 hover:text-slate-900 border border-transparent"
                  }`}
                >
                    Login
                </button>
                <button 
                  onClick={() => setMode("signup")}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                    mode === "signup" 
                      ? "bg-white text-slate-900 shadow-sm border border-gray-100" 
                      : "text-slate-500 hover:text-slate-900 border border-transparent"
                  }`}
                >
                    Sign Up
                </button>
            </div>
            
            <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900">
              {mode === "login" ? "Welcome Back!" : "Create an Account"}
            </h1>
            <p className="text-slate-500">
              {mode === "login" ? "Please enter your details to login." : "Enter your details to create your account."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                </label>
                <Link href="#" className="text-xs font-semibold text-slate-900 hover:underline">
                    Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {message && (
                <div className={`p-3 rounded-lg text-sm ${status === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {message}
                </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={16} /> {mode === "login" ? "Logging In..." : "Signing Up..."}
                  </span>
              ) : (mode === "login" ? "Log In" : "Sign Up")}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400">OR</span>
            </div>
          </div>

          <div className="space-y-3">
            {providers.map((provider) => (
               <button
                 key={provider.id}
                 type="button"
                 onClick={() => handleProvider(provider.id)}
                 className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-3 text-sm font-medium text-slate-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-100 focus:ring-offset-1"
               >
                 {provider.type === "img" && typeof provider.icon === 'string' && (
                   <img src={provider.icon} alt="" className="h-5 w-5" />
                 )}
                 {provider.label}
               </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            {mode === "login" ? "Don't have an account yet?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-slate-900 hover:underline">
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>

        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="relative z-10 hidden lg:block lg:w-1/2 bg-slate-100">
        <div className="absolute inset-0 m-4 rounded-3xl overflow-hidden">
             {/* Using a high quality real estate image from Unsplash */}
            <Image 
                src=""
                alt="Modern Real Estate"
                fill
                className="object-cover"
                priority
            />
            
            {/* Dark overlay gradient for text readability at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>

            {/* Testimonial Card */}
            <div className="absolute bottom-12 left-12 right-12">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-white">
                    <p className="text-xl font-medium leading-relaxed mb-6">
                    “With App, I can manage my global property portfolio and complete secure transactions in minutes — all with crypto. It's the perfect blend of real estate and blockchain innovation.”
                    </p>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-lg font-bold">Liam Smith</h4>
                            <p className="text-sm text-white/80">Investor</p>
                            <p className="text-xs text-white/60 mt-0.5">Global Real Estate Investment Firm</p>
                        </div>
                        
                        <div className="flex gap-4">
                            <button className="p-2 rounded-full border border-white/30 hover:bg-white/20 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                            <button className="p-2 rounded-full border border-white/30 hover:bg-white/20 transition-colors">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
