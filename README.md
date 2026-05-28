# KoinX Frontend Assignment: Tax Loss Harvesting Dashboard

![KoinX Tax Loss Harvesting Tool](https://img.shields.io/badge/Status-Completed-success?style=flat-square) ![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react) ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite)

**Live Demo:** [https://monishshastrakar.github.io/koinx/](https://monishshastrakar.github.io/koinx/)

A high-fidelity, interactive **Tax Loss Harvesting** dashboard built as an internship assignment for KoinX. This application allows users to identify opportunities to reduce their crypto tax liability by visualizing their holdings and calculating potential capital gains offsets.

## ✨ Features

- **Interactive Holdings Table**: A complex, data-rich table displaying 10 crypto assets with real CoinGecko icons.
- **Dynamic State Management**: Built with React's `useContext` and `useReducer` to handle asset selection and recalculate gains across the entire dashboard instantly.
- **Financial Projections**: Real-time calculation of "Pre-Harvesting" vs "After-Harvesting" net capital gains based on user selections.
- **Smart Formatting**: Compact number formatting (e.g., `$16.76M`) with un-clipped hover tooltips showing precise full values, built using React Portals.
- **Responsive Design**: Mobile-first architecture that seamlessly transitions from a robust desktop data table to optimized mobile cards.
- **Premium UI/UX**: Dark mode aesthetic with distinct color-coding for profits/losses and dynamic blue gradients for projections, strictly adhering to the design specifications.
- **Simulated API Integration**: Asynchronous mock API implementation complete with loading skeletons and error handling states.
- **Informative Components**: Educational "How it works?" modal and expandable disclaimers accordion.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (v3)
- **State Management**: Context API + `useReducer`
- **Icons**: `lucide-react`
- **Utilities**: `clsx`, `tailwind-merge`

## 🚀 Quick Start

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Monishshastrakar/koinx.git
   cd koinx
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```text
src/
├── api/
│   └── mockApi.js             # Async mock API functions with simulated latency
├── components/
│   ├── ui/
│   │   ├── ValueWithTooltip.jsx # Custom component for compact formatting & tooltips
│   │   └── index.jsx            # Reusable primitives (Checkbox, Chip, Loader, Error)
│   ├── Dashboard.jsx          # Main layout orchestrator
│   ├── GainsCard.jsx          # Pre/After Harvesting calculation cards
│   ├── HoldingsTable.jsx      # Interactive data table with sorting and selection
│   └── InfoComponents.jsx     # Modals and accordions
├── context/
│   └── HarvestingContext.jsx  # Global state provider and reducer logic
├── data/
│   └── mockData.js            # Mock dataset mirroring assignment specifications
├── utils/
│   └── helpers.js             # Financial math and formatting utilities
├── App.jsx                    # Root component
└── main.jsx                   # Entry point
```

## 🧠 Design Decisions & Mathematical Assumptions

- **Positive Magnitudes**: For mathematical consistency, all losses in the dataset are stored as positive magnitudes. Net capital gains are calculated dynamically as `Profits - Losses`.
- **Performance Optimization**: Heavy usage of `useMemo` and `useCallback` inside the Context and table components to prevent unnecessary re-renders during rapid checkbox toggling.
- **Tooltips**: Built a custom `ValueWithTooltip` component using React `createPortal` to ensure tooltips for abbreviated large numbers are never clipped by `overflow-hidden` containers.

---
*Developed by [Monish Shastrakar](https://github.com/Monishshastrakar)*
