"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchLatestRates,
  fetchCurrencies,
  RatesResponse,
  CurrenciesResponse,
} from "../lib/api";
import { convertAmount } from "../lib/convert";
import { ArrowDownUp, ChevronDown } from "lucide-react";

type RatesMap = Record<string, number>;

const COMMON_CURRENCIES = ["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD"];

// (Flags removed to match simplified dropdown design)

export default function CurrencyConverter() {
  const [ratesResponse, setRatesResponse] = useState<RatesResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Holds currency metadata (code -> { name, symbol, ... }) for nicer labels in dropdowns
  const [currencies, setCurrencies] = useState<CurrenciesResponse | null>(null);

  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("INR");

  useEffect(() => {
    // Fetch latest FX rates and currency metadata on mount
    let mounted = true;

    // Track rates loading state specifically for the small status row
    setLoading(true);
    fetchLatestRates("USD")
      .then((r: RatesResponse) => {
        if (mounted) {
          setRatesResponse(r);
          setError(null);
        }
      })
      .catch((err: Error) => {
        if (mounted) setError(String(err));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // Currency metadata is used to show human-friendly names in selects
    fetchCurrencies()
      .then((data: CurrenciesResponse) => {
        if (mounted) setCurrencies(data);
      })
      .catch((err: Error) => {
        // Reuse error surface
        if (mounted) setError(String(err));
      });

    return () => {
      mounted = false;
    };
  }, []);

  const rates: RatesMap = useMemo(
    () => ratesResponse?.rates ?? {},
    [ratesResponse]
  );

  let converted = 0;
  try {
    converted = convertAmount(amount, from, to, rates);
  } catch {
    // silently ignore until rates available
  }

  // Flags removed

  // Build dropdown options. Prefer available rate codes; fall back to a small common set.
  const currencyOptions = useMemo(() => {
    const codes = Object.keys(rates).length
      ? Object.keys(rates)
      : COMMON_CURRENCIES;
    return codes.map((code) => {
      const name = currencies?.[code]?.name;
      // Show human-readable currency names (fallback to code)
      return { code, label: name ?? code };
    });
  }, [rates, currencies]);

  return (
    <div className="card-glass rounded-2xl p-6 max-w-xl mx-auto text-white">
      {error ? (
        <p className="text-rose-400 text-sm mb-4">Error: {error}</p>
      ) : null}

      <div className="space-y-5">
        {/* From row: amount input + currency select in one field */}
        <div className="flex items-center rounded-xl border border-white/15 bg-zinc-900/60 px-3 py-2">
          <label className="sr-only" htmlFor="amount">
            Enter amount
          </label>
          <input
            id="amount"
            type="number"
            value={String(amount)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(Number(e.target.value))
            }
            min="0"
            className="flex-1 bg-transparent border-0 outline-none focus:ring-0 px-1 py-2 text-base placeholder-zinc-500"
          />
          <span className="mx-3 h-6 w-px bg-white/15" />
          <div className="relative">
            <label className="sr-only" htmlFor="from-currency">
              From currency
            </label>
            <select
              id="from-currency"
              value={from}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFrom(e.target.value)
              }
              className="appearance-none bg-transparent border-0 pr-6 pl-2 py-2 text-sm text-zinc-300 outline-none"
            >
              {currencyOptions.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" aria-hidden={true} />
          </div>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              const temp = from;
              setFrom(to);
              setTo(temp);
            }}
            className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
            aria-label="Swap currencies"
            title="Swap currencies"
          >
            <ArrowDownUp className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* To row: converted amount + currency select in one field */}
        <div className="flex items-center rounded-xl border border-white/15 bg-zinc-900/60 px-3 py-2">
          <label className="sr-only" htmlFor="converted">
            Converted amount
          </label>
          <input
            id="converted"
            type="text"
            readOnly
            value={isFinite(converted) ? `${converted.toFixed(2)}` : ""}
            className="flex-1 bg-transparent border-0 outline-none px-1 py-2 text-base"
          />
          <span className="mx-3 h-6 w-px bg-white/15" />
          <div className="relative">
            <label className="sr-only" htmlFor="to-currency">
              To currency
            </label>
            <select
              id="to-currency"
              value={to}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTo(e.target.value)
              }
              className="appearance-none bg-transparent border-0 pr-6 pl-2 py-2 text-sm text-zinc-300 outline-none"
            >
              {currencyOptions.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" aria-hidden={true} />
          </div>
        </div>
      </div>

      {/* Minimal meta row (optional) */}
      <div className="mt-4 text-xs text-zinc-500">
        {loading ? "Fetching latest rates…" : null}
      </div>
    </div>
  );
}
