// lib/convert.ts
/**
 * Convert an amount from currency A to currency B using rates whose base is `base`.
 * rates: map of currency -> rate against base (e.g., USD).
 *
 * Formula:
 *  amount_in_base = amount / rate_of_from (if rates[from] is units per base)
 *  result = amount_in_base * rate_of_to
 *
 * For typical fx APIs where rates show 1 base (= USD) = N currency units, conversion formula:
 *  amount_in_to = (amount / rates[from]) * rates[to]   (if base equals API base)
 */

export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
  // base = "USD"
): number {
  if (from === to) return amount;
  const rateFrom = rates[from];
  const rateTo = rates[to];

  if (rateFrom == null || rateTo == null) {
    throw new Error("Unknown currency code for conversion");
  }

  // If API rates are like: 1 USD = 0.92 EUR, 1 USD = 83 INR, then:
  // amount_in_USD = amount / rateFrom (if from != base)
  // result = amount_in_USD * rateTo
  const amountInBase = amount / rateFrom;
  const result = amountInBase * rateTo;
  return result;
}
