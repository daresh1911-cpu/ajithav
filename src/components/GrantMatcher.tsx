import React, { useState } from 'react';
import {
  Search,
  Award,
  Sparkles,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  X,
  Filter,
} from 'lucide-react';
import { Grant, BusinessPlanData, GrantEvaluation } from '../types';
import { GRANTS_DATABASE } from '../data/grantsData';

interface GrantMatcherProps {
  currentPlan: BusinessPlanData;
  bookmarkedGrantIds: string[];
  onToggleBookmark: (grantId: string) => void;
}

export const GrantMatcher: React.FC<GrantMatcherProps> = ({
  currentPlan,
  bookmarkedGrantIds,
  onToggleBookmark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [evaluatingGrant, setEvaluatingGrant] = useState<Grant | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<GrantEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Filtered grants
  const filteredGrants = GRANTS_DATABASE.filter((grant) => {
    const matchesSearch =
      grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grant.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || grant.industryCategory === selectedCategory;

    const matchesStage =
      selectedStage === 'All' ||
      grant.eligibleStage === selectedStage ||
      grant.eligibleStage === 'All Stages';

    return matchesSearch && matchesCategory && matchesStage;
  });

  const handleEvaluate = async (grant: Grant) => {
    setEvaluatingGrant(grant);
    setEvaluationResult(null);
    setEvalError(null);
    setIsEvaluating(true);

    const businessSummary = currentPlan.generatedContent
      ? `${currentPlan.businessName} (${currentPlan.industry}, ${currentPlan.stage}): ${currentPlan.generatedContent.executiveSummary}. SDG 5 Focus: ${currentPlan.generatedContent.sdg5ImpactFramework.targetAlignment}. Target capital: ${currentPlan.fundingNeeded}.`
      : `${currentPlan.businessName || 'Early Stage Women-Owned Business'} in ${currentPlan.industry || 'Micro-Enterprise'}. Mission: ${currentPlan.tagline || currentPlan.solution || 'Promoting sustainable artisan goods and women empowerment'}. Funding target: ${currentPlan.fundingNeeded || '$10,000'}.`;

    try {
      const response = await fetch('/api/evaluate-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grantName: grant.title,
          grantDescription: grant.description,
          eligibilityCriteria: grant.eligibilityCriteria,
          businessSummary,
          stage: currentPlan.stage || 'Early Stage',
          industry: currentPlan.industry || 'General',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to evaluate grant match');
      }

      setEvaluationResult({
        ...data.evaluation,
        evaluatedAt: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error(err);
      setEvalError(err.message || 'Evaluation service error. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8E2D8] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8963E]">
          <span>Non-Dilutive Capital Directory</span>
          <span aria-hidden="true">·</span>
          <span>Target 5.a Economic Rights</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-[#1C1917] mt-1">
          Women’s Grants & Fellowship Finder
        </h2>
        <p className="text-sm text-[#6B6358] mt-1 max-w-3xl">
          Non-dilutive capital (grants, fellowships, zero-percent micro-loans) allows female founders to retain 100% of their equity and independence. Explore verified funds or run an AI compatibility evaluation against your active business plan.
        </p>

        {currentPlan.businessName && (
          <div className="mt-4 p-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg flex items-center justify-between text-xs text-[#524B42]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1C1917]">Active Venture for Evaluation:</span>
              <span className="font-serif italic font-medium text-[#E05D44]">{currentPlan.businessName}</span>
              <span className="text-[#8C8273]">({currentPlan.industry})</span>
            </div>
            {currentPlan.generatedContent && (
              <span className="text-[#2E6953] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Full Blueprint Ready
              </span>
            )}
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#E8E2D8] rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8C8273] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by grant name, foundation, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-xs text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8273] hover:text-[#1C1917]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Buttons (interactive segmented controls) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {['All', 'Artisan & Retail', 'Social Impact & Health', 'Tech & Services', 'Sustainable & Green'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'bg-[#F7F3EB] text-[#6B6358] hover:text-[#1C1917]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stage Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#F2ECE1] text-xs text-[#6B6358]">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#8C8273]" />
            <span className="font-semibold text-[#1C1917]">Founder Stage:</span>
            {['All', 'Idea', 'Early Stage', 'Growth'].map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-2.5 py-1 rounded-sm transition-colors cursor-pointer ${
                  selectedStage === stage
                    ? 'bg-[#FAF0ED] text-[#E05D44] font-semibold'
                    : 'hover:text-[#1C1917]'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#8C8273]">
            Showing <strong className="text-[#1C1917]">{filteredGrants.length}</strong> non-dilutive capital programs
          </div>
        </div>
      </div>

      {/* Grant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGrants.map((grant) => {
          const isBookmarked = bookmarkedGrantIds.includes(grant.id);

          return (
            <div
              key={grant.id}
              className="bg-white border border-[#E8E2D8] rounded-xl p-6 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header row with bookmark button */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-[#C8963E] uppercase tracking-wider">
                      {grant.organization}
                    </span>
                    <h3 className="font-serif text-xl font-medium text-[#1C1917] mt-0.5">
                      {grant.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(grant.id)}
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Grant'}
                    className="p-2 text-[#8C8273] hover:text-[#E05D44] rounded-sm transition-colors cursor-pointer shrink-0"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-[#E05D44]" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Unboxed clean metadata with · separators */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6B6358] py-1 border-y border-[#F2ECE1]">
                  <span>
                    <strong className="text-[#1C1917] font-mono text-sm">{grant.awardAmount}</strong>
                  </span>
                  <span aria-hidden="true" className="text-[#D5CCC0]">·</span>
                  <span>{grant.grantType}</span>
                  <span aria-hidden="true" className="text-[#D5CCC0]">·</span>
                  <span>{grant.geography}</span>
                  <span aria-hidden="true" className="text-[#D5CCC0]">·</span>
                  <span>{grant.eligibleStage}</span>
                </div>

                <p className="text-xs text-[#524B42] leading-relaxed">
                  {grant.description}
                </p>

                <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E8E2D8] text-xs space-y-1">
                  <span className="font-semibold text-[#1C1917]">Key Eligibility Criteria:</span>
                  <p className="text-[#6B6358] leading-relaxed">{grant.eligibilityCriteria}</p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#F2ECE1] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => handleEvaluate(grant)}
                  className="px-4 py-2 text-xs font-semibold text-[#E05D44] bg-[#FAF0ED] hover:bg-[#F5E2DD] rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Evaluate Match with AI</span>
                </button>

                <a
                  href={grant.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  referrerPolicy="no-referrer"
                  className="text-xs font-semibold text-[#1C1917] hover:text-[#E05D44] flex items-center gap-1.5 transition-colors"
                >
                  <span>Official Application</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGrants.length === 0 && (
        <div className="p-12 text-center bg-white border border-[#E8E2D8] rounded-xl space-y-3">
          <Award className="w-8 h-8 text-[#8C8273] mx-auto" />
          <h3 className="font-serif text-lg text-[#1C1917]">No grants match your filter</h3>
          <p className="text-xs text-[#6B6358]">Try broadening your search term or switching to "All" categories.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedStage('All');
            }}
            className="text-xs font-semibold text-[#E05D44] hover:underline"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* AI Grant Evaluation Modal / Sheet */}
      {evaluatingGrant && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D8] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#F2ECE1] pb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#E05D44] uppercase tracking-wider">
                  AI Grant Compatibility Analysis
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#1C1917] mt-0.5">
                  {evaluatingGrant.title}
                </h3>
                <p className="text-xs text-[#6B6358]">
                  Evaluating match for <strong>{currentPlan.businessName || 'Your Venture'}</strong>
                </p>
              </div>

              <button
                onClick={() => setEvaluatingGrant(null)}
                className="p-1.5 text-[#8C8273] hover:text-[#1C1917] rounded-sm transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isEvaluating ? (
              <div className="py-12 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-[#E05D44] animate-spin mx-auto" />
                <p className="text-sm font-serif text-[#1C1917]">
                  Comparing business plan parameters against {evaluatingGrant.organization} evaluation rubrics...
                </p>
                <p className="text-xs text-[#6B6358]">
                  Analyzing SDG 5 alignment, financial feasibility, and application strengths.
                </p>
              </div>
            ) : evalError ? (
              <div className="p-4 bg-[#FDF2F0] border border-[#F5C2B9] text-[#B83824] rounded-lg text-xs">
                {evalError}
              </div>
            ) : evaluationResult ? (
              <div className="space-y-6">
                {/* Score Banner */}
                <div className="p-5 bg-[#FAF8F5] border border-[#E0D7C9] rounded-xl flex items-center justify-between gap-6">
                  <div>
                    <span className="text-xs font-semibold text-[#6B6358] uppercase tracking-wider">
                      Calculated Compatibility
                    </span>
                    <h4 className="font-serif text-3xl font-bold text-[#1C1917] mt-0.5 font-mono">
                      {evaluationResult.matchScore}%
                    </h4>
                    <p className="text-xs text-[#2E6953] font-medium mt-1">
                      {evaluationResult.matchScore >= 80
                        ? 'High Alignment — Strongly Recommended to Apply'
                        : 'Moderate Alignment — Sharp Pitch Tuning Recommended'}
                    </p>
                  </div>

                  <div className="w-20 h-20 rounded-full border-4 border-[#2E6953]/20 border-t-[#2E6953] flex items-center justify-center font-mono font-bold text-lg text-[#2E6953]">
                    {evaluationResult.matchScore}%
                  </div>
                </div>

                {/* Recommended Pitch Angle */}
                <div className="p-5 bg-[#FAF0ED] border border-[#F5C2B9] rounded-xl space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A32A18] flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Strategic Application Angle</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3A140F] leading-relaxed font-serif italic">
                    "{evaluationResult.recommendedPitchAngle}"
                  </p>
                </div>

                {/* Strengths & Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-[#E8E2D8] rounded-xl space-y-2">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-[#2E6953] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Key Strengths</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-[#292524]">
                      {evaluationResult.strengths.map((s, idx) => (
                        <li key={idx} className="leading-relaxed">
                          • {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-white border border-[#E8E2D8] rounded-xl space-y-2">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-[#C8963E] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Gaps to Address</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-[#292524]">
                      {evaluationResult.gapsToAddress.map((g, idx) => (
                        <li key={idx} className="leading-relaxed">
                          • {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Application Action Steps */}
                <div className="space-y-2">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Application Checklist for High Scoring
                  </h5>
                  <div className="space-y-2">
                    {evaluationResult.applicationActionSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-[#FAF8F5] border border-[#E8E2D8] rounded-lg text-xs text-[#292524] flex items-start gap-2.5"
                      >
                        <span className="font-mono font-bold text-[#E05D44] shrink-0">
                          0{idx + 1}.
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-[#F2ECE1] flex items-center justify-between">
                  <button
                    onClick={() => onToggleBookmark(evaluatingGrant.id)}
                    className="text-xs font-semibold text-[#6B6358] hover:text-[#1C1917] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-[#C8963E]" />
                    <span>
                      {bookmarkedGrantIds.includes(evaluatingGrant.id)
                        ? 'Bookmarked in Portfolio'
                        : 'Bookmark this Opportunity'}
                    </span>
                  </button>

                  <a
                    href={evaluatingGrant.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E05D44] hover:bg-[#CA4F37] rounded-sm transition-colors flex items-center gap-2"
                  >
                    <span>Proceed to Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
