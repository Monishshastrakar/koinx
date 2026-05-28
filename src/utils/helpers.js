export const formatCurrency = (value) => {
  const abs = Math.abs(value);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
};

/**
 * Returns a compact human-readable string for large numbers.
 * e.g. 16757964.71 → "$16.76M"
 * Values under $10,000 are returned as the full formatted string.
 */
export const formatCompact = (value) => {
  const abs = Math.abs(value);
  let compact;
  if (abs >= 1_000_000_000) {
    compact = `$${(abs / 1_000_000_000).toFixed(2)}B`;
  } else if (abs >= 1_000_000) {
    compact = `$${(abs / 1_000_000).toFixed(2)}M`;
  } else if (abs >= 10_000) {
    compact = `$${(abs / 1_000).toFixed(2)}K`;
  } else {
    compact = formatCurrency(abs);
  }
  return compact;
};

// losses are stored as positive magnitudes; net = profits - losses
export const calculateNetGains = (profits, losses) => profits - losses;

export const calculateRealisedGains = (stProfits, stLosses, ltProfits, ltLosses) =>
  calculateNetGains(stProfits, stLosses) + calculateNetGains(ltProfits, ltLosses);

export const calculatePostHarvesting = (initialGains, selectedHoldings) => {
  const result = {
    shortTerm: { profits: initialGains.shortTerm.profits, losses: initialGains.shortTerm.losses },
    longTerm:  { profits: initialGains.longTerm.profits,  losses: initialGains.longTerm.losses  },
  };
  selectedHoldings.forEach(({ stGain, ltGain }) => {
    if (stGain > 0) result.shortTerm.profits += stGain;
    else if (stGain < 0) result.shortTerm.losses += Math.abs(stGain);

    if (ltGain > 0) result.longTerm.profits += ltGain;
    else if (ltGain < 0) result.longTerm.losses += Math.abs(ltGain);
  });
  return result;
};
