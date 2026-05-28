import React from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
export const LoadingSpinner = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090B] text-white gap-5">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
      <Loader2 className="w-14 h-14 animate-spin text-blue-500 relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.7)]" />
    </div>
    <div className="flex flex-col items-center gap-1">
      <p className="text-white font-semibold text-base">Fetching Your Portfolio</p>
      <p className="text-gray-500 text-sm">Crunching the numbers...</p>
    </div>

    {/* Skeleton preview */}
    <div className="w-full max-w-2xl px-4 mt-4 flex flex-col gap-3 opacity-30">
      <div className="grid grid-cols-2 gap-3">
        <div className="h-40 bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-40 bg-gray-800 rounded-xl animate-pulse" />
      </div>
      <div className="h-48 bg-gray-800 rounded-xl animate-pulse" />
    </div>
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────
export const ErrorState = ({ message, onRetry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090B] text-white gap-6 p-8">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl animate-pulse" />
      <div className="w-20 h-20 rounded-full bg-red-950 border border-red-800 flex items-center justify-center relative z-10">
        <AlertTriangle className="w-10 h-10 text-red-400" />
      </div>
    </div>
    <div className="text-center max-w-md">
      <h2 className="text-xl font-bold text-white mb-2">Failed to Load Portfolio</h2>
      <p className="text-gray-400 text-sm leading-relaxed">
        {message || 'Something went wrong while fetching your data. Please try again.'}
      </p>
    </div>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-900/30"
    >
      <RefreshCw size={16} />
      Try Again
    </button>
  </div>
);

// ─── Reusable Chip ────────────────────────────────────────────────────────────
export const Chip = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gray-800 text-gray-300 border-gray-700',
    blue:    'bg-blue-500/10 text-blue-400 border-blue-500/30',
    green:   'bg-green-500/10 text-green-400 border-green-500/30',
    red:     'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// ─── Reusable Checkbox ────────────────────────────────────────────────────────
export const Checkbox = ({ checked, onChange, id, label }) => (
  <div
    id={id}
    role="checkbox"
    aria-checked={checked}
    aria-label={label}
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`
      w-[18px] h-[18px] rounded-[4px] flex-shrink-0 flex items-center justify-center border-2
      transition-all duration-200 cursor-pointer select-none
      ${checked
        ? 'bg-blue-600 border-blue-600 shadow-[0_0_12px_rgba(37,99,235,0.5)]'
        : 'border-gray-600 bg-transparent hover:border-blue-400 hover:bg-blue-500/5'
      }
    `}
  >
    {checked && (
      <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-none stroke-white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 4l3 3 5-6" />
      </svg>
    )}
  </div>
);
