// lib/fxrates.ts
export type RatesResponse = {
  base: string;
  date: string;
  rates: Record<string, number>;
};

// Replace this with your chosen free API endpoint or your API key if needed.
// Example: https://api.fxratesapi.com/latest?base=USD
const FX_API_URL = "https://api.fxratesapi.com/latest";

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
