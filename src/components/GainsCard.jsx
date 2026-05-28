import React from 'react';
import { useHarvesting } from '../context/HarvestingContext';
import { formatCurrency, calculateNetGains } from '../utils/helpers';
import clsx from 'clsx';
import { Sparkles } from 'lucide-react';

const netColor = (v) => v > 0 ? 'text-[#22C55E]' : v < 0 ? 'text-[#EF4444]' : 'text-gray-400';

const signedFmt = (v) => {
  const f = formatCurrency(Math.abs(v));
  return v > 0 ? `+${f}` : v < 0 ? `-${f}` : f;
};

// A single grid row in the gains table
const Row = ({ label, stValue, ltValue, isNet = false, className = '' }) => (
  <div className={clsx('grid grid-cols-3 items-center py-3', className)}>
    <span className={clsx('text-sm', isNet ? 'font-semibold text-gray-200' : 'text-gray-400')}>{label}</span>
    <span className={clsx('text-sm text-right', isNet ? clsx('font-bold', netColor(stValue)) : 'font-semibold text-gray-100')}>
      {isNet ? signedFmt(stValue) : formatCurrency(stValue)}
    </span>
    <span className={clsx('text-sm text-right', isNet ? clsx('font-bold', netColor(ltValue)) : 'font-semibold text-gray-100')}>
      {isNet ? signedFmt(ltValue) : formatCurrency(ltValue)}
    </span>
  </div>
);

const GainsCard = ({ title, data, isBlue = false }) => {
  const { savings } = useHarvesting();
  if (!data) return null;

  const stNet = calculateNetGains(data.shortTerm.profits, data.shortTerm.losses);
  const ltNet = calculateNetGains(data.longTerm.profits, data.longTerm.losses);
  const total = stNet + ltNet;

  return (
    <div className={clsx(
      'relative rounded-2xl overflow-hidden border transition-all duration-300',
      isBlue
        ? 'bg-gradient-to-br from-[#1a3fa8] via-[#1A56DB] to-[#1e40af] border-blue-500/25 shadow-xl shadow-blue-900/20'
        : 'bg-[#161616] border-gray-800 shadow-xl shadow-black/30'
    )}>
      {isBlue && (
        <>
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
        </>
      )}

      <div className="relative z-10 p-5 md:p-6 lg:p-8 flex flex-col gap-5">
        <h2 className="text-lg md:text-xl font-bold text-white tracking-tight">{title}</h2>

        {/* Table */}
        <div>
          {/* Header */}
          <div className="grid grid-cols-3 pb-2.5 border-b border-white/10">
            <span />
            <span className="text-xs text-gray-400 text-right font-medium uppercase tracking-wider">Short-term</span>
            <span className="text-xs text-gray-400 text-right font-medium uppercase tracking-wider">Long-term</span>
          </div>

          <Row
            label="Profits"
            stValue={data.shortTerm.profits}
            ltValue={data.longTerm.profits}
            className="border-b border-white/5"
          />
          <Row
            label="Losses"
            stValue={data.shortTerm.losses}
            ltValue={data.longTerm.losses}
            className="border-b border-white/5"
          />
          <Row
            label="Net Capital Gains"
            stValue={stNet}
            ltValue={ltNet}
            isNet
          />
        </div>

        {/* Total Realised */}
        <div className={clsx(
          'flex flex-wrap items-center justify-between gap-3 pt-4 border-t',
          isBlue ? 'border-blue-400/20' : 'border-gray-700'
        )}>
          <span className="text-sm md:text-base font-semibold text-gray-200">
            {isBlue ? 'Effective Capital Gains :' : 'Realised Capital Gains :'}
          </span>
          <span className={clsx('text-xl md:text-2xl font-extrabold tracking-tight', netColor(total))}>
            {signedFmt(total)}
          </span>
        </div>

        {/* Savings banner — fixed height prevents layout jump */}
        <div className="min-h-[42px] flex items-center">
          {isBlue && savings > 0 && (
            <div className="flex items-start gap-2 bg-[#0c2255]/80 border border-[#22C55E]/25 rounded-xl px-3 py-2.5 text-sm text-[#22C55E] font-medium w-full">
              <Sparkles size={15} className="flex-shrink-0 mt-0.5" />
              <span className="leading-snug">
                Your taxable capital gains are reduced by:{' '}
                <strong className="text-[#4ADE80]">{formatCurrency(savings)}</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GainsCard;
