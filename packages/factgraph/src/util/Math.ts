export function gcd(a: number, b: number): number {
  if (a === 0) {
    return Math.abs(b);
  }
  return gcd(b % a, a);
}
