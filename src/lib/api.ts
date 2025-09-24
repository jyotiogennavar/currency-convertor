// lib/fxrates.ts
export type RatesResponse = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

export type CurrencyMeta = {
  code: string;
  name: string;
  decimal_digits: number;
  name_plural: string;
  rounding: number;
  symbol: string;
  symbol_native: string;
};

export type CurrenciesResponse = Record<string, CurrencyMeta>;

// Prefer environment variables (client-safe NEXT_PUBLIC_*) with sensible fallbacks
// Example: https://api.fxratesapi.com/latest?base=USD
const FX_API_URL = (process.env.NEXT_PUBLIC_FX_API_URL ?? "https://api.fxratesapi.com/latest");
const FX_CURRENCIES = (process.env.NEXT_PUBLIC_FX_CURRENCIES_URL ?? "https://api.fxratesapi.com/currencies");

export async function fetchLatestRates(base = "USD"): Promise<RatesResponse> {
  // Use Next's fetch (works both server/client as needed). You can add caching options here.
  const url = `${FX_API_URL}?base=${encodeURIComponent(base)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch rates: ${res.status}`);
  }
  const data = (await res.json()) as RatesResponse;
  return data;
}

export async function fetchCurrencies(): Promise<CurrenciesResponse> {
  const res = await fetch(FX_CURRENCIES);
  if (!res.ok) {
    throw new Error(`Failed to fetch currencies: ${res.status}`);
  }
  const data = (await res.json()) as CurrenciesResponse;
  return data;
}
