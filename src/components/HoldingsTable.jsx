import React, { useState, useMemo } from 'react';
import { useHarvesting } from '../context/HarvestingContext';
import { formatCurrency } from '../utils/helpers';
import { Checkbox, Chip } from './ui';
import ValueWithTooltip from './ui/ValueWithTooltip';
import clsx from 'clsx';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';

const ASSET_ICONS = {
  BTC:  'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  ETH:  'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  SOL:  'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  BNB:  'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  AAVE: 'https://assets.coingecko.com/coins/images/12645/small/aave-token-round.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  LINK: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  ICP:  'https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png',
  ETC:  'https://assets.coingecko.com/coins/images/453/small/ethereum-classic-logo.png',
  WBTC: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
};

const DEFAULT_VISIBLE = 4;

const gainColor = (v) => v > 0 ? 'text-[#22C55E]' : v < 0 ? 'text-[#EF4444]' : 'text-gray-400';

// ─── Sort Icon ────────────────────────────────────────────────────────────────
const SortIcon = ({ active, direction }) => {
  if (!active) return <ArrowUpDown size={12} className="text-gray-600" />;
  return direction === 'ascending'
    ? <ArrowUp size={12} className="text-blue-400" />
    : <ArrowDown size={12} className="text-blue-400" />;
};

// ─── Asset Avatar ─────────────────────────────────────────────────────────────
const AssetAvatar = ({ ticker }) => {
  const [failed, setFailed] = useState(false);
  if (!failed && ASSET_ICONS[ticker]) {
    return (
      <img
        src={ASSET_ICONS[ticker]}
        alt={ticker}
        onError={() => setFailed(true)}
        className="w-9 h-9 rounded-full object-cover bg-gray-900 border border-gray-700 flex-shrink-0"
      />
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-300 flex-shrink-0">
      {ticker.slice(0, 3)}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const HoldingsTable = () => {
  const { holdings, selectedAssets, isAllSelected, toggleAsset, selectAll, deselectAll } = useHarvesting();
  const [sortConfig, setSortConfig] = useState({ key: null, dir: null });
  const [showAll, setShowAll] = useState(false);

  const handleToggleAll = () => (isAllSelected ? deselectAll() : selectAll());

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key !== key) return { key, dir: 'descending' };
      if (prev.dir === 'descending') return { key, dir: 'ascending' };
      return { key: null, dir: null };
    });
  };

  const sorted = useMemo(() => {
    const items = [...holdings];
    if (sortConfig.key) {
      items.sort((a, b) => sortConfig.dir === 'ascending'
        ? a[sortConfig.key] - b[sortConfig.key]
        : b[sortConfig.key] - a[sortConfig.key]
      );
    }
    return items;
  }, [holdings, sortConfig]);

  const visible = showAll ? sorted : sorted.slice(0, DEFAULT_VISIBLE);

  const ThSortable = ({ label, colKey, align = 'right' }) => (
    <th
      className={clsx(
        'p-3 md:p-4 font-medium text-[10px] md:text-xs text-gray-400 uppercase tracking-wider cursor-pointer select-none',
        align === 'right' ? 'text-right' : 'text-left'
      )}
      onClick={() => handleSort(colKey)}
    >
      <span className={clsx('flex items-center gap-1.5 hover:text-gray-200 transition-colors', align === 'right' ? 'justify-end' : 'justify-start')}>
        {label}
        <SortIcon active={sortConfig.key === colKey} direction={sortConfig.dir} />
      </span>
    </th>
  );

  return (
    <div id="holdings-table" className="w-full bg-[#111111] rounded-2xl border border-gray-800 shadow-2xl">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 md:px-6 py-4 border-b border-gray-800 bg-[#131313] rounded-t-2xl">
        <h2 className="text-base md:text-lg font-bold text-white tracking-tight">Holdings</h2>
        <div className="flex items-center gap-3">
          {selectedAssets.length > 0 && (
            <Chip variant="blue">{selectedAssets.length} selected</Chip>
          )}
          <Chip variant="default">{holdings.length} assets</Chip>
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left min-w-[820px]">
          <thead>
            <tr className="bg-[#0E0E0E] border-b border-gray-800">
              <th className="p-4 pl-6 w-10">
                <Checkbox id="select-all" checked={isAllSelected} onChange={handleToggleAll} label="Select all assets" />
              </th>
              <th className="p-4 text-left font-medium text-[10px] text-gray-400 uppercase tracking-wider">Asset</th>
              <th className="p-4 text-right font-medium text-[10px] text-gray-400 uppercase tracking-wider">
                <div>Holdings</div>
                <div className="text-[9px] text-gray-600 mt-0.5 normal-case font-normal">Avg Buy Price</div>
              </th>
              <ThSortable label="Current Price" colKey="currentPrice" />
              <ThSortable label="Short-Term"    colKey="stGain" />
              <ThSortable label="Long-Term"     colKey="ltGain" />
              <th className="p-4 pr-6 font-medium text-[10px] text-gray-400 uppercase tracking-wider text-right">
                Amount to Sell
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/40">
            {visible.map((holding) => {
              const selected = selectedAssets.includes(holding.asset);
              return (
                <tr
                  key={holding.asset}
                  id={`holding-row-${holding.asset}`}
                  onClick={() => toggleAsset(holding.asset)}
                  className={clsx(
                    'cursor-pointer transition-all duration-200',
                    selected ? 'bg-blue-900/15 hover:bg-blue-900/25' : 'hover:bg-gray-800/30'
                  )}
                >
                  {/* Checkbox */}
                  <td className="p-4 pl-6">
                    <Checkbox
                      id={`chk-${holding.asset}`}
                      checked={selected}
                      onChange={() => toggleAsset(holding.asset)}
                      label={`Select ${holding.asset}`}
                    />
                  </td>

                  {/* Asset name + icon */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <AssetAvatar ticker={holding.asset} />
                      <div>
                        <div className="font-semibold text-gray-100 text-sm leading-tight">{holding.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{holding.asset}</div>
                      </div>
                    </div>
                  </td>

                  {/* Holdings + Avg Buy Price */}
                  <td className="p-4 text-right">
                    <div className="text-gray-100 font-medium text-sm">
                      {holding.totalHolding} {holding.asset}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      <ValueWithTooltip rawValue={holding.avgBuyPrice} className="text-gray-500" />
                    </div>
                  </td>

                  {/* Current Price */}
                  <td className="p-4 text-right">
                    <ValueWithTooltip rawValue={holding.currentPrice} className="text-gray-100 font-medium text-sm" />
                  </td>

                  {/* Short-Term Gain */}
                  <td className="p-4 text-right">
                    <ValueWithTooltip
                      rawValue={holding.stGain}
                      signed
                      className={clsx('font-semibold text-sm', gainColor(holding.stGain))}
                    />
                    <div className="text-xs text-gray-600 mt-0.5">{holding.totalHolding} {holding.asset}</div>
                  </td>

                  {/* Long-Term Gain */}
                  <td className="p-4 text-right">
                    <ValueWithTooltip
                      rawValue={holding.ltGain}
                      signed
                      className={clsx('font-semibold text-sm', gainColor(holding.ltGain))}
                    />
                    <div className="text-xs text-gray-600 mt-0.5">
                      {holding.ltGain !== 0 ? `${holding.totalHolding} ${holding.asset}` : `0 ${holding.asset}`}
                    </div>
                  </td>

                  {/* Amount to Sell */}
                  <td className="p-4 pr-6 text-right">
                    {selected
                      ? <span className="text-sm text-gray-100 font-medium">{holding.totalHolding} {holding.asset}</span>
                      : <span className="text-gray-600 text-sm">—</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Card List ── */}
      <div className="md:hidden divide-y divide-gray-800/40">
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0E0E0E]">
          <Checkbox id="select-all-mobile" checked={isAllSelected} onChange={handleToggleAll} label="Select all" />
          <span className="text-xs text-gray-400">Select All</span>
        </div>
        {visible.map((holding) => {
          const selected = selectedAssets.includes(holding.asset);
          return (
            <div
              key={holding.asset}
              id={`holding-card-${holding.asset}`}
              onClick={() => toggleAsset(holding.asset)}
              className={clsx(
                'flex items-start gap-3 p-4 cursor-pointer transition-all duration-200',
                selected ? 'bg-blue-900/15' : 'hover:bg-gray-800/20'
              )}
            >
              <div className="pt-0.5">
                <Checkbox
                  id={`mobile-chk-${holding.asset}`}
                  checked={selected}
                  onChange={() => toggleAsset(holding.asset)}
                  label={`Select ${holding.asset}`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <AssetAvatar ticker={holding.asset} />
                  <div>
                    <div className="font-semibold text-gray-100 text-sm">{holding.name}</div>
                    <div className="text-xs text-gray-500">{holding.asset}</div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-xs text-gray-400">Current Price</div>
                    <ValueWithTooltip rawValue={holding.currentPrice} className="font-semibold text-gray-100 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <div className="text-gray-500 mb-0.5">Short-Term</div>
                    <ValueWithTooltip rawValue={holding.stGain} signed className={clsx('font-bold', gainColor(holding.stGain))} />
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <div className="text-gray-500 mb-0.5">Long-Term</div>
                    <ValueWithTooltip rawValue={holding.ltGain} signed className={clsx('font-bold', gainColor(holding.ltGain))} />
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <div className="text-gray-500 mb-0.5">Holdings</div>
                    <div className="text-gray-200 font-medium">{holding.totalHolding} {holding.asset}</div>
                  </div>
                  {selected && (
                    <div className="bg-blue-900/30 border border-blue-700/30 rounded-lg p-2">
                      <div className="text-blue-400 mb-0.5">To Sell</div>
                      <div className="text-blue-200 font-medium">{holding.totalHolding} {holding.asset}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All / Less */}
      {holdings.length > DEFAULT_VISIBLE && (
        <div className="border-t border-gray-800/60 py-3 px-6 flex justify-center bg-[#0E0E0E] rounded-b-2xl">
          <button
            id="toggle-view-all"
            onClick={() => setShowAll(v => !v)}
            className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors py-1.5 px-5 rounded-lg hover:bg-blue-500/10 active:scale-95"
          >
            {showAll
              ? <><ChevronUp size={15} /> Show Less</>
              : <><ChevronDown size={15} /> View All {holdings.length} Assets</>
            }
          </button>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;
