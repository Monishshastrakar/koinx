import React, { useState } from 'react';
import { useHarvesting } from '../context/HarvestingContext';
import GainsCard from './GainsCard';
import HoldingsTable from './HoldingsTable';
import { HowItWorksModal, DisclaimerBanner } from './InfoComponents';
import { LoadingSpinner, ErrorState } from './ui';

const Dashboard = () => {
  const { status, error, capitalGains, postHarvestingGains } = useHarvesting();
  const [showModal, setShowModal] = useState(false);

  if (status === 'loading' || status === 'idle') return <LoadingSpinner />;
  if (status === 'error') return <ErrorState message={error} onRetry={() => window.location.reload()} />;

  return (
    <>
      <HowItWorksModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <main className="max-w-[1440px] mx-auto px-4 py-8 md:px-8 lg:px-12 bg-[#09090B] min-h-screen text-gray-100 selection:bg-blue-500/30 selection:text-white">

        {/* Page Header */}
        <header className="mb-7 flex flex-wrap items-center gap-2 md:gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Tax Optimisation
          </h1>
          <button
            id="how-it-works-btn"
            onClick={() => setShowModal(true)}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium underline underline-offset-4 decoration-blue-500/40 hover:decoration-blue-400 transition-all duration-200"
          >
            How it works?
          </button>
        </header>

        {/* Disclaimer */}
        <div className="mb-7">
          <DisclaimerBanner />
        </div>

        {/* Gains Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <GainsCard title="Pre Harvesting"   data={capitalGains}          isBlue={false} />
          <GainsCard title="After Harvesting" data={postHarvestingGains}   isBlue={true}  />
        </div>

        {/* Holdings Table */}
        <HoldingsTable />

      </main>
    </>
  );
};

export default Dashboard;
