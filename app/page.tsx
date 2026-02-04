import LandingNavbar from "@/components/landing-navbar";
export default function Home() {
  return (
    <div className="hero flex min-h-screen items-center justify-center font-sans">
      <LandingNavbar />
      <main className="hero-content flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        
      </main>
      <div aria-hidden className="h-[120vh]" />
    </div>
  );
}
