import React from 'react';

interface NavbarProps {
  activeTab: 'overview' | 'builder' | 'grants' | 'financials' | 'sdg-impact';
  setActiveTab: (tab: 'overview' | 'builder' | 'grants' | 'financials' | 'sdg-impact') => void;
  onOpenNewVenture: () => void;
  savedPlansCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewVenture,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#E8E2D8] transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => setActiveTab('overview')}
          className="text-left font-serif text-2xl font-bold tracking-tight text-[#1C1917] hover:text-[#E05D44] transition-colors whitespace-nowrap shrink-0"
        >
          Astraea
        </button>

        {/* Zone 2: 4-5 single-line clean nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B6358]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'overview'
                ? 'text-[#1C1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E05D44]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Launchpad
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'builder'
                ? 'text-[#1C1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E05D44]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            AI Plan Studio
          </button>
          <button
            onClick={() => setActiveTab('grants')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'grants'
                ? 'text-[#1C1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E05D44]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Grant Finder
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'financials'
                ? 'text-[#1C1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E05D44]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            Unit Economics
          </button>
          <button
            onClick={() => setActiveTab('sdg-impact')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'sdg-impact'
                ? 'text-[#1C1917] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#E05D44]'
                : 'hover:text-[#1C1917]'
            }`}
          >
            SDG 5 Impact
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenNewVenture}
            className="px-5 py-2.5 text-xs font-semibold tracking-wide uppercase text-white bg-[#E05D44] hover:bg-[#CA4F37] transition-all rounded-sm shadow-xs whitespace-nowrap shrink-0 active:scale-98"
          >
            Craft Business Plan
          </button>
        </div>
      </div>

      {/* Mobile nav drawer strip */}
      <div className="md:hidden border-t border-[#E8E2D8] bg-[#F7F3EB] px-4 py-2 flex items-center justify-between text-xs overflow-x-auto gap-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`whitespace-nowrap py-1 ${activeTab === 'overview' ? 'font-bold text-[#E05D44]' : 'text-[#6B6358]'}`}
        >
          Launchpad
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`whitespace-nowrap py-1 ${activeTab === 'builder' ? 'font-bold text-[#E05D44]' : 'text-[#6B6358]'}`}
        >
          Plan Studio
        </button>
        <button
          onClick={() => setActiveTab('grants')}
          className={`whitespace-nowrap py-1 ${activeTab === 'grants' ? 'font-bold text-[#E05D44]' : 'text-[#6B6358]'}`}
        >
          Grant Finder
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`whitespace-nowrap py-1 ${activeTab === 'financials' ? 'font-bold text-[#E05D44]' : 'text-[#6B6358]'}`}
        >
          Economics
        </button>
        <button
          onClick={() => setActiveTab('sdg-impact')}
          className={`whitespace-nowrap py-1 ${activeTab === 'sdg-impact' ? 'font-bold text-[#E05D44]' : 'text-[#6B6358]'}`}
        >
          SDG 5 Impact
        </button>
      </div>
    </header>
  );
};
