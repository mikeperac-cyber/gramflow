export const formatNumber = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

export const formatPercent = (n, decimals = 1) =>
  `${Number(n).toFixed(decimals)}%`;

export const formatChange = (n) =>
  n >= 0 ? `+${formatPercent(n)}` : formatPercent(n);

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
