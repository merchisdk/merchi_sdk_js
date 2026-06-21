// Decimal half-even rounding (round half to even), mirroring the server's
// `Decimal(round(x, n))`. NOT float `round()` (e.g. roundHalfEven(2.675, 2) is
// 2.68, not 2.67). Targets the money domain (small magnitudes, dp <= 3); the
// EPS half-detection is tuned for that domain.
export function roundHalfEven(value, dp) {
  if (!isFinite(value)) return value;
  const factor = Math.pow(10, dp);
  const scaled = value * factor;
  const floor = Math.floor(scaled);
  const diff = scaled - floor;
  const EPS = 1e-9;
  let rounded;
  if (Math.abs(diff - 0.5) < EPS) {
    rounded = floor % 2 === 0 ? floor : floor + 1;
  } else {
    rounded = Math.round(scaled);
  }
  return rounded / factor;
}
