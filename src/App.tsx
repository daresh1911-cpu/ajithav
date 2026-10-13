/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PlanBuilder } from './components/PlanBuilder';
import { GrantMatcher } from './components/GrantMatcher';
import { FinancialSimulator } from './components/FinancialSimulator';
import { SdgImpactSection } from './components/SdgImpactSection';
import { VenturePortfolioModal } from './components/VenturePortfolioModal';
import { BusinessPlanData } from './types';
import { SAMPLE_VENTURES } from './data/sampleVentures';
import { FolderHeart, Award, HeartHandshake } from 'lucide-react';

const LOCAL_STORAGE_KEY_PLANS = 'astraea_saved_plans_v1';
const LOCAL_STORAGE_KEY_BOOKMARKS = 'astraea_bookmarked_grants_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'builder' | 'grants' | 'financials' | 'sdg-impact'>('overview');
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  // Initialize saved plans from localStorage or defaults
  const [savedPlans, setSavedPlans] = useState<BusinessPlanData[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PLANS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved plans from localStorage', e);
    }
    return SAMPLE_VENTURES;
  });

  // Current active plan for editing and evaluation
  const [currentPlan, setCurrentPlan] = useState<BusinessPlanData>(() => savedPlans[0]);

  // Bookmarked grants
  const [bookmarkedGrantIds, setBookmarkedGrantIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKMARKS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse bookmarked grants from localStorage', e);
    }
    return ['cartier-womens-initiative', 'amber-grant'];
  });

  // Persist saved plans
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PLANS, JSON.stringify(savedPlans));
    } catch (e) {
      console.error('Failed to persist plans to localStorage', e);
    }
  }, [savedPlans]);

  // Persist bookmarked grants
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarkedGrantIds));
    } catch (e) {
      console.error('Failed to persist bookmarked grants to localStorage', e);
    }
  }, [bookmarkedGrantIds]);

  const handleSavePlan = (planToSave: BusinessPlanData) => {
    setSavedPlans((prev) => {
      const existingIdx = prev.findIndex((p) => p.id === planToSave.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = planToSave;
        return copy;
      }
      return [planToSave, ...prev];
    });
  };

  const handleCreateNewVenture = () => {
    const newPlan: BusinessPlanData = {
      id: `venture-${Date.now()}`,
      businessName: '',
      industry: '',
      stage: 'Idea & Concept',
      tagline: '',
      problemStatement: '',
      targetAudience: '',
      solution: '',
      revenueModel: '',
      pricingStrategy: '',
      productionDelivery: '',
      sdg5Focus: 'Target 5.a: Fair living wages for women, flexible scheduling, female governance',
      fundingNeeded: '$10,000',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setCurrentPlan(newPlan);
    handleSavePlan(newPlan);
    setActiveTab('builder');
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (currentPlan.id === id && filtered.length > 0) {
        setCurrentPlan(filtered[0]);
      }
      return filtered;
    });
  };

  const handleToggleBookmark = (grantId: string) => {
    setBookmarkedGrantIds((prev) =>
      prev.includes(grantId) ? prev.filter((id) => id !== grantId) : [...prev, grantId]
    );
  };

  const handleApplyEconomicsToPlan = (summaryText: string) => {
    setCurrentPlan((prev) => {
      const updated: BusinessPlanData = {
        ...prev,
        pricingStrategy: summaryText,
        updatedAt: new Date().toISOString().split('T')[0],
      };
      handleSavePlan(updated);
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between text-[#1C1917]">
      {/* 1. Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewVenture={handleCreateNewVenture}
        savedPlansCount={savedPlans.length}
      />

      {/* Floating Portfolio & Quick Access Pill */}
      <div className="fixed bottom-6 right-6 z-30 flex items-center gap-2">
        <button
          onClick={() => setIsPortfolioOpen(true)}
          className="px-4 py-2.5 bg-[#1C1917] hover:bg-[#2C2724] text-white text-xs font-semibold rounded-full shadow-lg border border-white/10 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
        >
          <FolderHeart className="w-4 h-4 text-[#E05D44]" />
          <span>My Portfolio ({savedPlans.length})</span>
        </button>
      </div>

      {/* 2. Main View Content */}
      <main className="max-w-7xl mx-auto w-full px-6 py-10 flex-1">
        {activeTab === 'overview' && (
          <HeroSection
            onStartCustomPlan={handleCreateNewVenture}
            onSelectSamplePlan={(sample) => {
              setCurrentPlan(sample);
              setActiveTab('builder');
            }}
            onExploreGrants={() => setActiveTab('grants')}
            onOpenSimulator={() => setActiveTab('financials')}
          />
        )}

        {activeTab === 'builder' && (
          <PlanBuilder
            currentPlan={currentPlan}
            setCurrentPlan={setCurrentPlan}
            onSavePlan={handleSavePlan}
            onNavigateToGrants={(plan) => {
              setCurrentPlan(plan);
              setActiveTab('grants');
            }}
          />
        )}

        {activeTab === 'grants' && (
          <GrantMatcher
            currentPlan={currentPlan}
            bookmarkedGrantIds={bookmarkedGrantIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {activeTab === 'financials' && (
          <FinancialSimulator
            currentPlan={currentPlan}
            onApplyToPlan={handleApplyEconomicsToPlan}
          />
        )}

        {activeTab === 'sdg-impact' && (
          <SdgImpactSection currentPlan={currentPlan} />
        )}
      </main>

      {/* 3. Quiet Editorial Footer */}
      <footer className="border-t border-[#E8E2D8] bg-[#F7F3EB] py-12 px-6 mt-16 text-xs text-[#6B6358]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-serif text-lg font-bold text-[#1C1917]">Astraea</span>
            <p className="text-xs text-[#524B42]">
              Advancing UN Sustainable Development Goal 5: Gender Equality & Economic Empowerment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className="hover:text-[#1C1917] transition-colors"
            >
              Launchpad
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className="hover:text-[#1C1917] transition-colors"
            >
              Plan Studio
            </button>
            <button
              onClick={() => setActiveTab('grants')}
              className="hover:text-[#1C1917] transition-colors"
            >
              Grant Finder
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className="hover:text-[#1C1917] transition-colors"
            >
              Unit Economics
            </button>
            <button
              onClick={() => setActiveTab('sdg-impact')}
              className="hover:text-[#1C1917] transition-colors"
            >
              SDG 5 Targets
            </button>
          </div>

          <div className="text-[11px] text-[#8C8273]">
            Dedicated to women entrepreneurs, craftswomen, and micro-business creators worldwide.
          </div>
        </div>
      </footer>

      {/* 4. Portfolio Modal */}
      <VenturePortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        savedPlans={savedPlans}
        activePlanId={currentPlan.id}
        onSelectPlan={(plan) => {
          setCurrentPlan(plan);
          setActiveTab('builder');
        }}
        onDeletePlan={handleDeletePlan}
        onNewVenture={handleCreateNewVenture}
        bookmarkedGrantIds={bookmarkedGrantIds}
        onRemoveBookmark={handleToggleBookmark}
        onNavigateToGrants={() => setActiveTab('grants')}
      />
    </div>
  );
}
