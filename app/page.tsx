import LandingNavbar from "@/components/landing-navbar";
import { Tooltip } from "@/components/ui/tooltip-card";
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

export default function Home() {
  return (
    <div className="hero flex min-h-screen items-center justify-center font-sans">
      <LandingNavbar />
<main className="hero-content flex w-full max-w-3xl flex-col items-center justify-center px-16 text-center -translate-y-20">
        <div className="flex flex-col items-center gap-y-6 text-center">
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
        <button className="mt-4 rounded-full bg-[#0f172a] px-6 py-3 font-medium text-white cursor-pointer transition-colors hover:bg-zinc-500">
          Try it now
        </button>
      </main>
      <div aria-hidden className="h-[120vh]" />
    </div>
  );
}
