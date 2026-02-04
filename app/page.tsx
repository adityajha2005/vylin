import LandingNavbar from "@/components/landing-navbar";
import { Tooltip } from "@/components/ui/tooltip-card";
import { MovingLogoCloud } from "@/components/ui/moving-logo-cloud";
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
          <span className="text-[10px] font-medium uppercase tracking-tight text-[#475569] sm:text-xs">
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
      <div className="w-[50%] translate-y-80">
        <MovingLogoCloud items={logos} />
      </div>
      <div aria-hidden className="h-[120vh]" />
    </div>
  );
}

