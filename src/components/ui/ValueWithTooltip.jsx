import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { formatCurrency, formatCompact } from '../../utils/helpers';
import clsx from 'clsx';

/**
 * Displays a compact value and ALWAYS shows a full-value tooltip on hover.
 * Uses createPortal so the tooltip renders into document.body — never clipped.
 */
const ValueWithTooltip = ({ rawValue = 0, signed = false, className = '' }) => {
  const [tooltipStyle, setTooltipStyle] = useState(null);

  const abs = Math.abs(rawValue);
  const isNeg = rawValue < 0;

  const compact = formatCompact(abs);
  const full = formatCurrency(abs);

  const sign = (str) => {
    if (!signed) return str;
    return isNeg ? `-${str}` : rawValue > 0 ? `+${str}` : str;
  };

  const displayText = sign(compact);
  const fullText    = sign(full);

  // Only show tooltip when compact ≠ full (i.e., value is abbreviated)
  // BUT we always show tooltip for ALL values now regardless
  const handleMouseEnter = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipStyle({
      position: 'fixed',
      left: rect.left + rect.width / 2,
      top: rect.top - 10,
      transform: 'translate(-50%, -100%)',
      zIndex: 99999,
      pointerEvents: 'none',
    });
  }, []);

  const handleMouseLeave = useCallback(() => setTooltipStyle(null), []);

  return (
    <>
      <span
        className={clsx(className, 'cursor-help')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {displayText}
      </span>

      {tooltipStyle && createPortal(
        <div style={tooltipStyle}>
          <div style={{
            background: '#1e293b',
            color: '#f1f5f9',
            fontSize: '12px',
            fontWeight: 600,
            padding: '5px 12px',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.12)',
            letterSpacing: '0.01em',
          }}>
            {fullText}
          </div>
          {/* Arrow */}
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #1e293b',
          }} />
        </div>,
        document.body
      )}
    </>
  );
};

export default ValueWithTooltip;
