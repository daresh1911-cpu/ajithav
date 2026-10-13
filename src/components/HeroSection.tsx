import React from 'react';
import { ArrowRight, Sparkles, BookOpen, Coins, Award } from 'lucide-react';
import { SAMPLE_VENTURES } from '../data/sampleVentures';
import { BusinessPlanData } from '../types';

interface HeroSectionProps {
  onStartCustomPlan: () => void;
  onSelectSamplePlan: (sample: BusinessPlanData) => void;
  onExploreGrants: () => void;
  onOpenSimulator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCustomPlan,
  onSelectSamplePlan,
  onExploreGrants,
  onOpenSimulator,
}) => {
  return (
    <div className="space-y-16">
      {/* 1. Main Hero Visual Split */}
      <section className="relative overflow-hidden bg-[#F7F3EB] border border-[#E8E2D8] rounded-2xl p-8 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#E05D44]">
              <span>UN Sustainable Development Goal 5</span>
              <span aria-hidden="true">·</span>
              <span>Gender Equality & Economic Rights</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1C1917] leading-tight text-balance">
              Where women’s ideas become resilient, fundable micro-enterprises.
            </h1>

            <p className="text-base sm:text-lg text-[#524B42] leading-relaxed max-w-2xl font-light">
              Women reinvest up to 90% of their income back into their families and communities, yet face persistent structural barriers in accessing commercial capital and strategic advisory. Astraea turns your vision into a viable business blueprint, aligns your mission with UN SDG 5, and matches you with non-dilutive grant funding.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onStartCustomPlan}
                className="px-6 py-3.5 text-sm font-semibold tracking-wide text-white bg-[#E05D44] hover:bg-[#CA4F37] transition-all rounded-sm shadow-xs flex items-center gap-2.5 group cursor-pointer active:scale-98"
              >
                <span>Draft Your Business Blueprint</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onExploreGrants}
                className="px-6 py-3.5 text-sm font-semibold text-[#1C1917] bg-[#EFE8DC] hover:bg-[#E5DDCF] border border-[#E0D7C9] transition-all rounded-sm flex items-center gap-2 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-[#C8963E]" />
                <span>Browse Non-Dilutive Grants</span>
              </button>
            </div>

            {/* Unboxed Metadata & SDG alignment */}
            <div className="pt-4 border-t border-[#E8E2D8] flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#6B6358]">
              <span className="font-medium text-[#1C1917]">Target 5.5: Equal Leadership</span>
              <span aria-hidden="true" className="text-[#C5BCAD]">·</span>
              <span className="font-medium text-[#1C1917]">Target 5.a: Economic & Asset Ownership</span>
              <span aria-hidden="true" className="text-[#C5BCAD]">·</span>
              <span className="font-medium text-[#1C1917]">Target 5.b: Enabling Tech</span>
            </div>
          </div>

          {/* Right Column: Hero High-Impact Editorial Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden border border-[#DFD8CC] shadow-md aspect-[4/3] lg:aspect-[5/4] bg-[#E8E2D8]">
              <img
                src="/src/assets/images/hero_women_founders_1791822782411.jpg"
                alt="Women entrepreneurs collaborating around a workshop table"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white p-2">
                <p className="text-xs font-serif italic text-white/95">
                  "Closing the gender gap in entrepreneurship could add up to $5 trillion to the global economy."
                </p>
                <p className="text-[10px] tracking-wide text-white/75 mt-0.5 uppercase">
                  UN Women & Boston Consulting Group Research
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Pillars of the Launchpad */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl font-medium text-[#1C1917]">
              The Founder Toolkit for SDG 5
            </h2>
            <p className="text-sm text-[#6B6358] mt-1">
              Purpose-built for women micro-entrepreneurs, artisans, and community changemakers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: AI Plan Studio */}
          <div
            onClick={onStartCustomPlan}
            className="p-7 bg-white border border-[#E8E2D8] rounded-xl hover:border-[#E05D44]/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF0ED] text-[#E05D44] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C1917] group-hover:text-[#E05D44] transition-colors">
                AI Business Blueprint Studio
              </h3>
              <p className="text-sm text-[#524B42] leading-relaxed">
                Step-by-step intake wizard synthesizing executive summaries, operations models, pricing logic, and pitch statements with Gemini 3.8 Flash.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-semibold text-[#E05D44]">
              <span>Launch Studio Wizard</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 2: Grant Finder */}
          <div
            onClick={onExploreGrants}
            className="p-7 bg-white border border-[#E8E2D8] rounded-xl hover:border-[#C8963E]/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#F8F4EB] text-[#C8963E] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C1917] group-hover:text-[#C8963E] transition-colors">
                Non-Dilutive Grant Finder
              </h3>
              <p className="text-sm text-[#524B42] leading-relaxed">
                Verified database of global & regional grants specifically for female founders, with intelligent venture compatibility scoring and pitch advice.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-semibold text-[#C8963E]">
              <span>Explore Active Grants</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Pillar 3: Unit Economics */}
          <div
            onClick={onOpenSimulator}
            className="p-7 bg-white border border-[#E8E2D8] rounded-xl hover:border-[#2E6953]/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#EEF5F1] text-[#2E6953] flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-[#1C1917] group-hover:text-[#2E6953] transition-colors">
                Micro-Economics Simulator
              </h3>
              <p className="text-sm text-[#524B42] leading-relaxed">
                Interactive modeling of unit margins, break-even unit volumes, living-wage payroll sustainability, and operating cash runway.
              </p>
            </div>
            <div className="pt-6 mt-4 border-t border-[#F2ECE1] flex items-center justify-between text-xs font-semibold text-[#2E6953]">
              <span>Simulate Economics</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Exemplar Ventures & Inspiration Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl font-medium text-[#1C1917]">
              Exemplary SDG 5 Ventures
            </h2>
            <p className="text-sm text-[#6B6358] mt-1">
              Explore pre-built business models to see how sustainable impact pairs with healthy commercial viability.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SAMPLE_VENTURES.map((venture, idx) => {
            const imageSrc =
              idx === 0
                ? '/src/assets/images/founder_artisan_craft_1791822795444.jpg'
                : idx === 1
                ? '/src/assets/images/founder_tech_innovator_1791822808902.jpg'
                : '/src/assets/images/hero_women_founders_1791822782411.jpg';

            return (
              <div
                key={venture.id}
                className="bg-white border border-[#E8E2D8] rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden relative bg-[#E8E2D8]">
                    <img
                      src={imageSrc}
                      alt={venture.businessName}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#1C1917]/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-sm">
                      {venture.industry}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-serif text-xl font-medium text-[#1C1917]">
                      {venture.businessName}
                    </h3>
                    <p className="text-xs text-[#524B42] leading-relaxed line-clamp-3">
                      {venture.tagline}
                    </p>

                    <div className="pt-2 text-xs text-[#6B6358] space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#1C1917]">SDG Focus:</span>
                        <span className="truncate">{venture.sdg5Focus.split(':')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-[#1C1917]">Target Capital:</span>
                        <span className="font-mono text-[#1C1917]">{venture.fundingNeeded}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectSamplePlan(venture)}
                    className="w-full py-2.5 text-xs font-semibold text-[#1C1917] hover:text-[#E05D44] bg-[#F7F3EB] hover:bg-[#EFE8DC] border border-[#E0D7C9] rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Inspect Blueprint & Financials</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
