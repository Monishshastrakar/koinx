import { holdingsData, capitalGainsData } from '../data/mockData';

// Simulate real API latency
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const fetchHoldings = async () => {
  await delay(800);
  // Uncomment to test error state:
  // throw new Error('Network error: Unable to fetch holdings');
  return holdingsData;
};

export const fetchCapitalGains = async () => {
  await delay(600);
  return capitalGainsData;
};
