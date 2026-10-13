import React from 'react';
import { X, BookOpen, Trash2, Award, Bookmark, ArrowRight, Plus } from 'lucide-react';
import { BusinessPlanData, Grant } from '../types';
import { GRANTS_DATABASE } from '../data/grantsData';

interface VenturePortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: BusinessPlanData[];
  activePlanId: string;
  onSelectPlan: (plan: BusinessPlanData) => void;
  onDeletePlan: (id: string) => void;
  onNewVenture: () => void;
  bookmarkedGrantIds: string[];
  onRemoveBookmark: (id: string) => void;
  onNavigateToGrants: () => void;
}

export const VenturePortfolioModal: React.FC<VenturePortfolioModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onNewVenture,
  bookmarkedGrantIds,
  onRemoveBookmark,
  onNavigateToGrants,
}) => {
  if (!isOpen) return null;

  const bookmarkedGrants = GRANTS_DATABASE.filter((g) => bookmarkedGrantIds.includes(g.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-[#E8E2D8] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-8 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-4">
          <div>
            <span className="text-[11px] font-semibold text-[#E05D44] uppercase tracking-wider">
              Local Storage Portfolio
            </span>
            <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-0.5">
              My Saved Ventures & Bookmarked Grants
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8273] hover:text-[#1C1917] rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Saved Ventures */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg font-medium text-[#1C1917]">
              Saved Business Blueprints ({savedPlans.length})
            </h4>
            <button
              onClick={() => {
                onNewVenture();
                onClose();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-[#E05D44] hover:text-[#CA4F37] flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start Blank Venture</span>
            </button>
          </div>

          <div className="space-y-3">
            {savedPlans.map((plan) => {
              const isActive = plan.id === activePlanId;

              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-[#FAF8F5] border-[#E05D44]'
                      : 'bg-white border-[#E8E2D8] hover:border-[#D5CCC0]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-serif text-base font-medium text-[#1C1917]">
                        {plan.businessName || 'Untitled Venture'}
                      </h5>
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FAF0ED] text-[#E05D44] rounded-sm">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6B6358] line-clamp-1">
                      {plan.tagline || plan.industry}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-[#8C8273]">
                      <span>{plan.stage}</span>
                      <span>·</span>
                      <span>Target: {plan.fundingNeeded || '$10,000'}</span>
                      {plan.generatedContent && (
                        <>
                          <span>·</span>
                          <span className="text-[#2E6953] font-medium">Synthesized</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onSelectPlan(plan);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-[#1C1917] bg-[#F5EFEB] hover:bg-[#ECE4DC] rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>

                    {savedPlans.length > 1 && (
                      <button
                        onClick={() => onDeletePlan(plan.id)}
                        className="p-1.5 text-[#8C8273] hover:text-[#B83824] transition-colors cursor-pointer"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Bookmarked Grants */}
        <div className="space-y-4 pt-4 border-t border-[#F2ECE1]">
          <div className="flex items-center justify-between">
            <h4 className="font-serif text-lg font-medium text-[#1C1917]">
              Bookmarked Grant Opportunities ({bookmarkedGrants.length})
            </h4>
            <button
              onClick={() => {
                onNavigateToGrants();
                onClose();
              }}
              className="text-xs font-semibold text-[#C8963E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Grants</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {bookmarkedGrants.length === 0 ? (
            <p className="text-xs text-[#8C8273] italic">
              No grants bookmarked yet. Browse the Grant Finder and click the bookmark ribbon to track opportunities here.
            </p>
          ) : (
            <div className="space-y-3">
              {bookmarkedGrants.map((grant) => (
                <div
                  key={grant.id}
                  className="p-4 bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-semibold text-[#C8963E]">
                      {grant.organization}
                    </span>
                    <h5 className="font-serif text-sm font-medium text-[#1C1917]">
                      {grant.title}
                    </h5>
                    <div className="text-[11px] text-[#6B6358] flex items-center gap-2">
                      <span className="font-mono font-bold text-[#1C1917]">{grant.awardAmount}</span>
                      <span>·</span>
                      <span>{grant.deadline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={grant.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#E05D44] hover:bg-[#CA4F37] rounded-sm transition-colors"
                    >
                      Apply Now
                    </a>
                    <button
                      onClick={() => onRemoveBookmark(grant.id)}
                      className="p-1.5 text-[#8C8273] hover:text-[#B83824] transition-colors cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
