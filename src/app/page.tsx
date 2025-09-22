import CurrencyConverter from "@/components/CurrencyConverter";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <header className="mb-10 text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight heading-gradient">Currency Converter</h1>
        <p className="text-zinc-400 mt-3">Convert between currencies using live FX rates (free-tier).</p>
      </header>
      <div className="w-full max-w-3xl">
        <CurrencyConverter />
      </div>
    </div>
  );
}
