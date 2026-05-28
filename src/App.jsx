import React from 'react';
import { HarvestingProvider } from './context/HarvestingContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <HarvestingProvider>
      <Dashboard />
    </HarvestingProvider>
  );
}

export default App;
