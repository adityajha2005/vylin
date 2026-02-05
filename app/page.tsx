import LandingNavbar from "@/components/landing-navbar";
import { Tooltip } from "@/components/ui/tooltip-card";
import { MovingLogoCloud } from "@/components/ui/moving-logo-cloud";
import ModeExplanation from "@/components/mode-explanation";
import { MessageSquare, Search, Activity } from "lucide-react";

const SolanaTooltipCard = () => {
  return (
    <div className="rounded-xl">
      {/* <img
        src="https://cryptologos.cc/logos/solana-sol-logo.png"
        alt="Solana"
        className="aspect-square w-[100px]"
      /> */}
      <div className="my-4 flex flex-col">
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
          A high-performance blockchain for building scalable crypto apps.
        </p>
      </div>
    </div>
  );
};
const logos = [
  {
    name: "Solana",
    logo: (
      <img
        src="https://cryptologos.cc/logos/solana-sol-logo.svg"
        alt="Solana"
        className="h-12 w-auto"
      />
    ),
  },
  {
    name: "Helius",
    logo: (
      <img
        src="/Helius-Horizontal-Logo.svg"
        alt="Helius"
        className="h-12 w-auto"
      />
    ),
  },
  {
    name: "XAI",
    logo: (
      <img
        src="https://download.logo.wine/logo/XAI_(company)/XAI_(company)-Logo.wine.png"
        alt="XAI"
        className="h-12 w-auto"
      />
    ),
  },
  {
    name: "Vercel",
    logo: (
      <img
        src="https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png"
        alt="Vercel"
        className="h-12 w-auto"
      />
    ),
  },
];

export default function Home() {
  return (
    <div className="hero flex flex-col min-h-screen items-center justify-center font-sans">
      <LandingNavbar />
      <main className="hero-content flex w-full max-w-3xl flex-col items-center justify-center px-16 text-center -translate-y-[-220px]">
        <div className="flex flex-col items-center gap-y-4 text-center">
          <span className="text-md font-semibold uppercase tracking-[0.2em] text-[#475569] sm:text-sm">
            Built for Solana developers
          </span>
          <h1 className="font-ibm-plex-sans text-4xl font-bold text-foreground sm:text-5xl">
            A{" "}
            <Tooltip
              content={<SolanaTooltipCard />}
              containerClassName="cursor-pointer"
            >
              <span className="underline decoration-dotted">Solana</span>
            </Tooltip>
            -first AI assistant grounded in official docs.
          </h1>
          <p className="text-lg text-[#475569]">
            No{" "}
            <Tooltip
              content={
                "When an AI provides confident but false or nonsensical information."
              }
              containerClassName="cursor-pointer"
            >
              <span className="underline decoration-dotted">
                hallucinations
              </span>
            </Tooltip>
            . No wallet access.{" "}
            <Tooltip
              content={
                "We use Helius to perform on-chain analysis, providing insights into network activity, security, and health."
              }
              containerClassName="cursor-pointer"
            >
              <span className="underline decoration-dotted">
                On-chain analysis
              </span>
            </Tooltip>{" "}
            only when you ask for it.
          </p>
        </div>
        <button className="group mt-4 flex items-center gap-x-2 rounded-full bg-[#0f172a] px-8 py-3 font-semibold text-white transition-all hover:bg-[#1e293b] hover:shadow-lg hover:shadow-slate-200 active:scale-[0.98]">
          Try it now
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </button>
      </main>
      <div className="w-[50%] translate-y-80 flex flex-col items-center gap-y-4">
        <span className="text-lg font-semibold uppercase tracking-[0.2em] text-[#94a3b8]">
          Built on trusted Solana infrastructure
        </span>
        <MovingLogoCloud items={logos} />
      </div>

      <section className="mt-[450px] flex w-full max-w-5xl flex-col items-center px-8 text-center">
        <h2 className="mb-12 text-lg font-semibold uppercase tracking-[0.2em] text-[#475569]">
          How it works
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            
            <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg group-hover:ring-slate-900">
              <MessageSquare size={26} strokeWidth={1.5} />
            </div>
            
            <h3 className="relative z-10 mb-2 text-lg font-semibold text-slate-900">
              Ask a question
            </h3>
            <p className="relative z-10 text-sm leading-relaxed text-slate-500">
              Solana, Anchor, programs, PDAs, runtime behavior
            </p>
          </div>

          {/* Step 2 */}
<div className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 md:scale-[1.02]">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            
            <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all duration-300 group-hover:bg-slate-800 group-hover:text-white group-hover:shadow-lg group-hover:ring-slate-800">
              <Search size={26} strokeWidth={1.5} />
            </div>
            
            <h3 className="relative z-10 mb-2 text-lg font-semibold text-slate-900">
              We fetch official sources
            </h3>
            <p className="relative z-10 text-sm leading-relaxed text-slate-500">
Official docs and verified references
            </p>
          </div>

          {/* Step 3 */}
          <div className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
            <div className="absolute inset-0 z-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            
            <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg group-hover:ring-slate-900">
              <Activity size={26} strokeWidth={1.5} />
            </div>
            
            <h3 className="relative z-10 mb-2 text-lg font-semibold text-slate-900">
              Optional on-chain analysis
            </h3>
            <p className="relative z-10 text-sm leading-relaxed text-slate-500">
              Only when you ask for it.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-32 flex w-full max-w-5xl flex-col items-center px-8 text-center">
        <h2 className="mb-12 text-lg font-semibold uppercase tracking-[0.2em] text-[#475569]">
          Engineered, not just a wrapper
        </h2>
        
        <ModeExplanation />
      </section>

      <div aria-hidden className="h-[40vh]" />
    </div>
  );
}

