"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  fetchLatestRates,
  fetchCurrencies,
  RatesResponse,
  CurrenciesResponse,
} from "../lib/api";
import { convertAmount } from "../lib/convert";
import { ArrowDownUp } from "lucide-react";
import * as FlagIcons from "country-flag-icons/react/3x2";

type RatesMap = Record<string, number>;

const COMMON_CURRENCIES = ["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD"];

// Map currency code -> ISO 3166-1 alpha-2 country/region code
// For many currencies, the first two letters match the country code (USD -> US, JPY -> JP, etc.).
// Add special cases where needed.
function getCountryCodeForCurrency(currency: string): string | null {
  const upper = currency.toUpperCase();
  if (upper === "EUR") return "EU"; // European Union
  if (upper === "GBP") return "GB"; // Great Britain
  return upper.slice(0, 2);
}

function getFlagComponentForCurrency(
  currency: string
): ComponentType<SVGProps<SVGSVGElement>> | null {
  const countryCode = getCountryCodeForCurrency(currency);
  if (!countryCode) return null;
  // country-flag-icons exports React components named by the country code, e.g., US, IN, GB
  const Comp = (
    FlagIcons as Record<
      string,
      ComponentType<SVGProps<SVGSVGElement>> | undefined
    >
  )[countryCode];
  return Comp ?? null;
}

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

  const FromFlag = getFlagComponentForCurrency(from);
  const ToFlag = getFlagComponentForCurrency(to);

  // Build dropdown options. Prefer available rate codes; fall back to a small common set.
  const currencyOptions = useMemo(() => {
    const codes = Object.keys(rates).length
      ? Object.keys(rates)
      : COMMON_CURRENCIES;
    return codes.map((code) => {
      const name = currencies?.[code]?.name;
      return { code, label: name ? `${code} — ${name}` : code };
    });
  }, [rates, currencies]);

  return (
    <div className="card-glass rounded-2xl p-6 max-w-xl mx-auto text-white">
      {error ? (
        <p className="text-rose-400 text-sm mb-4">Error: {error}</p>
      ) : null}

      <div className="space-y-5">
        {/* From field */}
        <div className="flex items-center gap-3">
          <div className="w-28 shrink-0 relative">
            <label className="sr-only" htmlFor="from-currency">
              From currency
            </label>
            <select
              id="from-currency"
              value={from}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFrom(e.target.value)
              }
              className="mt-0 block w-full rounded-xl border border-white/15 bg-zinc-900/60 px-3 pr-9 py-2 text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {currencyOptions.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              {FromFlag ? (
                <FromFlag
                  className="w-5 h-5 rounded-sm shadow-sm"
                  aria-hidden={true}
                />
              ) : (
                <span className="text-lg">🌐</span>
              )}
            </span>
          </div>
          <div className="relative flex-1">
            <label className="sr-only" htmlFor="amount">
              Enter amount
            </label>
            <input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={String(amount)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(Number(e.target.value))
              }
              className="block w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-base placeholder-zinc-500 outline-none focus:ring-2 focus:ring-indigo-400"
              min="0"
            />
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

        {/* To field */}
        <div className="flex items-center gap-3">
          <div className="w-28 shrink-0 relative">
            <label className="sr-only" htmlFor="to-currency">
              To currency
            </label>
            <select
              id="to-currency"
              value={to}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTo(e.target.value)
              }
              className="mt-0 block w-full rounded-xl border border-white/15 bg-zinc-900/60 px-3 pr-9 py-2 text-sm text-zinc-300 outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {currencyOptions.map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              {ToFlag ? (
                <ToFlag
                  className="w-5 h-5 rounded-sm shadow-sm"
                  aria-hidden={true}
                />
              ) : (
                <span className="text-lg">🌐</span>
              )}
            </span>
          </div>
          <div className="relative flex-1">
            <label className="sr-only" htmlFor="converted">
              Converted amount
            </label>
            <input
              id="converted"
              type="text"
              readOnly
              placeholder="Converted amount"
              value={isFinite(converted) ? `${converted.toFixed(4)}` : ""}
              className="block w-full rounded-xl border border-white/15 bg-transparent px-4 py-3 text-base placeholder-zinc-500 outline-none"
            />
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
