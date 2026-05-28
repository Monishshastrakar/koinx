import React, { useState } from 'react';
import { X, Info } from 'lucide-react';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'What is Tax Loss Harvesting?',
    body: 'Tax Loss Harvesting is a strategy where you sell assets that have declined in value to realize a capital loss. These losses offset your capital gains, reducing the total tax you owe.',
  },
  {
    step: '02',
    title: 'How does this tool help?',
    body: 'This tool shows you which of your holdings have unrealised losses. Select them to see exactly how your taxable capital gains change — in real time.',
  },
  {
    step: '03',
    title: 'Short-term vs Long-term',
    body: 'Short-term gains (held < 1 year) are taxed at a higher rate. Losses in either category offset gains in the same category first. Any excess offsets the other category.',
  },
  {
    step: '04',
    title: 'After you harvest',
    body: 'After selling, wait 30+ days before repurchasing the same asset to avoid wash-sale rules. Always consult a qualified tax advisor before acting.',
  },
];

const DISCLAIMERS = [
  'This tool is for informational purposes only and does not constitute financial or tax advice.',
  'Calculations shown are estimates based on available data and may not reflect your actual tax liability.',
  'Crypto tax regulations vary by jurisdiction. Ensure compliance with your local laws.',
  'Tax loss harvesting is most effective near the end of the financial year.',
  'Selling assets may trigger additional gains or losses beyond what is shown here.',
  'Always consult a qualified tax professional before making investment decisions.',
];

// ─── How It Works Modal ────────────────────────────────────────────────────────
export const HowItWorksModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      id="how-it-works-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative bg-[#161616] border border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-lg font-bold text-white">How Tax Loss Harvesting Works</h2>
          <button
            id="close-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Steps */}
        <div className="px-6 py-5 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
          {HOW_IT_WORKS.map(({ step, title, body }) => (
            <div key={step} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                {step}
              </div>
              <div>
                <h3 className="font-semibold text-gray-100 text-sm mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5">
          <button
            id="got-it-btn"
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-[1.01] active:scale-95 text-sm"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Disclaimer Banner (expandable) ───────────────────────────────────────────
export const DisclaimerBanner = () => {
  const [open, setOpen] = useState(false);
  return (
    <div
      id="disclaimer-banner"
      className="bg-[#161616] border border-amber-500/20 rounded-xl overflow-hidden transition-all duration-300"
    >
      <button
        id="disclaimer-toggle"
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-800/30 transition-colors"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <div className="flex-shrink-0 p-1.5 bg-amber-500/10 rounded-md">
          <Info size={15} className="text-amber-400" />
        </div>
        <span className="text-sm font-semibold text-gray-200 flex-1">
          Important Notes and Disclaimers
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-amber-500/10">
          <ul className="flex flex-col gap-2.5 mt-3">
            {DISCLAIMERS.map((note, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400 leading-relaxed">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500 mt-2" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
