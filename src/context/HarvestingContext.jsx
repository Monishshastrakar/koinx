import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { fetchHoldings, fetchCapitalGains } from '../api/mockApi';
import { calculatePostHarvesting, calculateRealisedGains } from '../utils/helpers';

// ─── State Shape ─────────────────────────────────────────────────────────────
const initialState = {
  holdings: [],
  capitalGains: null,
  selectedAssets: [],   // array of asset ticker strings
  status: 'idle',       // 'idle' | 'loading' | 'success' | 'error'
  error: null,
};

// ─── Action Types ─────────────────────────────────────────────────────────────
export const ACTIONS = {
  FETCH_START:    'FETCH_START',
  FETCH_SUCCESS:  'FETCH_SUCCESS',
  FETCH_ERROR:    'FETCH_ERROR',
  TOGGLE_ASSET:   'TOGGLE_ASSET',
  SELECT_ALL:     'SELECT_ALL',
  DESELECT_ALL:   'DESELECT_ALL',
};

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, status: 'loading', error: null };

    case ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        status: 'success',
        holdings: action.payload.holdings,
        capitalGains: action.payload.capitalGains,
      };

    case ACTIONS.FETCH_ERROR:
      return { ...state, status: 'error', error: action.payload };

    case ACTIONS.TOGGLE_ASSET: {
      const asset = action.payload;
      const isSelected = state.selectedAssets.includes(asset);
      return {
        ...state,
        selectedAssets: isSelected
          ? state.selectedAssets.filter(a => a !== asset)
          : [...state.selectedAssets, asset],
      };
    }

    case ACTIONS.SELECT_ALL:
      return { ...state, selectedAssets: state.holdings.map(h => h.asset) };

    case ACTIONS.DESELECT_ALL:
      return { ...state, selectedAssets: [] };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const HarvestingContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const HarvestingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load data on mount
  useEffect(() => {
    const load = async () => {
      dispatch({ type: ACTIONS.FETCH_START });
      try {
        const [holdings, capitalGains] = await Promise.all([
          fetchHoldings(),
          fetchCapitalGains(),
        ]);
        dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: { holdings, capitalGains } });
      } catch (err) {
        dispatch({ type: ACTIONS.FETCH_ERROR, payload: err.message || 'Failed to load data' });
      }
    };
    load();
  }, []);

  // Derived state — post-harvesting gains based on selected assets
  const postHarvestingGains = useMemo(() => {
    if (!state.capitalGains) return null;
    const selected = state.holdings.filter(h => state.selectedAssets.includes(h.asset));
    return calculatePostHarvesting(state.capitalGains, selected);
  }, [state.capitalGains, state.holdings, state.selectedAssets]);

  // Derived state — tax savings amount
  const savings = useMemo(() => {
    if (!state.capitalGains || !postHarvestingGains) return 0;
    const pre  = calculateRealisedGains(state.capitalGains.shortTerm.profits,  state.capitalGains.shortTerm.losses,  state.capitalGains.longTerm.profits,  state.capitalGains.longTerm.losses);
    const post = calculateRealisedGains(postHarvestingGains.shortTerm.profits, postHarvestingGains.shortTerm.losses, postHarvestingGains.longTerm.profits, postHarvestingGains.longTerm.losses);
    return pre > post ? pre - post : 0;
  }, [state.capitalGains, postHarvestingGains]);

  // Stable action dispatchers
  const toggleAsset    = useCallback((asset) => dispatch({ type: ACTIONS.TOGGLE_ASSET, payload: asset }), []);
  const selectAll      = useCallback(() => dispatch({ type: ACTIONS.SELECT_ALL }), []);
  const deselectAll    = useCallback(() => dispatch({ type: ACTIONS.DESELECT_ALL }), []);

  const value = {
    ...state,
    postHarvestingGains,
    savings,
    toggleAsset,
    selectAll,
    deselectAll,
    isAllSelected: state.holdings.length > 0 && state.selectedAssets.length === state.holdings.length,
  };

  return (
    <HarvestingContext.Provider value={value}>
      {children}
    </HarvestingContext.Provider>
  );
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export const useHarvesting = () => {
  const ctx = useContext(HarvestingContext);
  if (!ctx) throw new Error('useHarvesting must be used inside <HarvestingProvider>');
  return ctx;
};
