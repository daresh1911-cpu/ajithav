import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Download,
  Printer,
  Coins,
  RefreshCw,
  Award,
  ChevronRight,
  Bookmark,
} from 'lucide-react';
import { BusinessPlanData, BusinessPlanContent } from '../types';
import { SAMPLE_VENTURES } from '../data/sampleVentures';

interface PlanBuilderProps {
  currentPlan: BusinessPlanData;
  setCurrentPlan: React.Dispatch<React.SetStateAction<BusinessPlanData>>;
  onSavePlan: (plan: BusinessPlanData) => void;
  onNavigateToGrants: (plan: BusinessPlanData) => void;
}

export const PlanBuilder: React.FC<PlanBuilderProps> = ({
  currentPlan,
  setCurrentPlan,
  onSavePlan,
  onNavigateToGrants,
}) => {
  const [activeStep, setActiveStep] = useState<number>(currentPlan.generatedContent ? 5 : 1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [activePlanTab, setActivePlanTab] = useState<'all' | 'summary' | 'market' | 'ops' | 'financial' | 'sdg' | 'pitch'>('all');
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleInputChange = (field: keyof BusinessPlanData, value: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString().split('T')[0],
    }));
  };

  const loadPreset = (preset: BusinessPlanData) => {
    setCurrentPlan(preset);
    setActiveStep(preset.generatedContent ? 5 : 1);
    setGenerationError(null);
  };

  const handleGeneratePlan = async () => {
    if (!currentPlan.businessName.trim() || !currentPlan.industry.trim()) {
      setGenerationError('Please provide a business name and industry before generating.');
      setActiveStep(1);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPlan),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize business plan');
      }

      const updatedPlan: BusinessPlanData = {
        ...currentPlan,
        generatedContent: data.plan,
        updatedAt: new Date().toISOString().split('T')[0],
      };

      setCurrentPlan(updatedPlan);
      onSavePlan(updatedPlan);
      setActiveStep(5); // Jump to generated view
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'Error communicating with AI service. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportMarkdown = () => {
    if (!currentPlan.generatedContent) return;
    const content = currentPlan.generatedContent;
    const markdown = `# ${currentPlan.businessName} — Business Plan
*UN SDG 5 Women Entrepreneurship Blueprint*
Date: ${currentPlan.updatedAt}

## Executive Summary
${content.executiveSummary}

## Market Analysis
- Target Market: ${content.marketAnalysis.targetMarket}
- Competitive Edge: ${content.marketAnalysis.competitiveEdge}
- Ideal Customer Persona: ${content.marketAnalysis.customerPersona}

## Operations & Milestones
- Offering Details: ${content.operationsAndProduct.offeringDetails}
- Delivery Model: ${content.operationsAndProduct.deliveryModel}
### Key Milestones:
${content.operationsAndProduct.milestones.map((m) => `- ${m}`).join('\n')}

## Financial Strategy & Unit Economics
- Pricing Logic: ${content.financialStrategy.pricingLogic}
- Revenue Streams:
${content.financialStrategy.revenueStreams.map((r) => `- ${r}`).join('\n')}
- Initial Capital Allocation: ${content.financialStrategy.initialFundingAllocation}
- Break-Even Estimate: ${content.financialStrategy.breakEvenEstimate}

## UN SDG 5 Gender Equality Framework
- Target Alignment: ${content.sdg5ImpactFramework.targetAlignment}
- Direct Empowerment Outcomes:
${content.sdg5ImpactFramework.directEmpowermentOutcomes.map((o) => `- ${o}`).join('\n')}
- Key Performance Indicators:
${content.sdg5ImpactFramework.keyPerformanceIndicators.map((k) => `- ${k}`).join('\n')}

## The 60-Second Investor & Grant Pitch Hook
${content.pitchDeckKicker}
`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${currentPlan.businessName.toLowerCase().replace(/\s+/g, '_')}_blueprint.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E05D44]">
            <span>AI Business Blueprint Studio</span>
            <span aria-hidden="true">·</span>
            <span>Gemini 3.8 Flash Powered</span>
          </div>
          <h2 className="font-serif text-3xl font-medium text-[#1C1917] mt-1">
            {currentPlan.businessName ? currentPlan.businessName : 'New Venture Strategy'}
          </h2>
          <p className="text-sm text-[#6B6358] mt-1 max-w-2xl">
            A guided four-step strategic intake designed to translate your passion into an institutional-grade, fundable business model aligned with UN SDG 5.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#6B6358] font-medium">Quick Presets:</span>
          {SAMPLE_VENTURES.map((v) => (
            <button
              key={v.id}
              onClick={() => loadPreset(v)}
              className="text-xs px-3 py-1 bg-[#F5EFEB] hover:bg-[#ECE4DC] border border-[#E0D7C9] text-[#1C1917] rounded-sm transition-colors cursor-pointer"
            >
              {v.businessName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Steps Navigation Bar (visible if not viewing final plan or if user wants to review inputs) */}
      <div className="bg-[#F7F3EB] border border-[#E8E2D8] rounded-xl p-4 flex items-center justify-between overflow-x-auto gap-4">
        {[
          { step: 1, title: 'Identity & Vision' },
          { step: 2, title: 'Customers & Problem' },
          { step: 3, title: 'Product & Pricing' },
          { step: 4, title: 'SDG 5 & Capital' },
          { step: 5, title: 'Synthesized Blueprint' },
        ].map((item) => (
          <button
            key={item.step}
            onClick={() => setActiveStep(item.step)}
            disabled={item.step === 5 && !currentPlan.generatedContent}
            className={`flex items-center gap-2.5 text-xs font-medium px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeStep === item.step
                ? 'bg-white text-[#1C1917] shadow-xs font-semibold'
                : item.step === 5 && !currentPlan.generatedContent
                ? 'text-[#A89F91] cursor-not-allowed opacity-60'
                : 'text-[#6B6358] hover:text-[#1C1917] hover:bg-white/50'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-bold ${
                activeStep === item.step
                  ? 'bg-[#E05D44] text-white'
                  : item.step === 5 && currentPlan.generatedContent
                  ? 'bg-[#4E7D63] text-white'
                  : 'bg-[#E5DDD0] text-[#6B6358]'
              }`}
            >
              {item.step}
            </span>
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      {generationError && (
        <div className="p-4 bg-[#FDF2F0] border border-[#F5C2B9] text-[#B83824] rounded-lg text-xs leading-relaxed">
          {generationError}
        </div>
      )}

      {/* Step 1: Identity & Vision */}
      {activeStep === 1 && (
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-8 space-y-6">
          <div className="border-b border-[#F2ECE1] pb-4">
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">
              Step 1: Venture Identity & Core Mission
            </h3>
            <p className="text-xs text-[#6B6358] mt-1">
              Establish the basic identity, sector, and development phase of your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Venture Name *
              </label>
              <input
                type="text"
                value={currentPlan.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="e.g. Maya Ethical Textiles, Horizon Care Hub"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44] focus:ring-1 focus:ring-[#E05D44]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Industry & Domain *
              </label>
              <input
                type="text"
                value={currentPlan.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                placeholder="e.g. Sustainable Crafts, Food & Agriculture, Health Navigation, Tech"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44] focus:ring-1 focus:ring-[#E05D44]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Current Venture Stage
              </label>
              <select
                value={currentPlan.stage}
                onChange={(e) => handleInputChange('stage', e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              >
                <option value="Idea & Concept">Idea & Concept (Pre-Launch)</option>
                <option value="Prototype & Testing">Prototype & Testing</option>
                <option value="Early Revenue (Under $50k)">Early Revenue (Under $50k)</option>
                <option value="Scaling Micro-Enterprise">Scaling Micro-Enterprise ($50k–$250k)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Tagline or Purpose Statement
              </label>
              <input
                type="text"
                value={currentPlan.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="e.g. Handcrafted zero-waste kitchenware providing living wages to women."
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setActiveStep(2)}
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#E05D44] hover:bg-[#CA4F37] rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Customers & Problem</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Customers & Problem */}
      {activeStep === 2 && (
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-8 space-y-6">
          <div className="border-b border-[#F2ECE1] pb-4">
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">
              Step 2: Customer Personas & Problem Definition
            </h3>
            <p className="text-xs text-[#6B6358] mt-1">
              Who are you solving a problem for, and why does the status quo fail them?
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                The Problem Solved
              </label>
              <textarea
                rows={3}
                value={currentPlan.problemStatement}
                onChange={(e) => handleInputChange('problemStatement', e.target.value)}
                placeholder="What pain point, inequality, or market inefficiency does your venture eliminate?"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Target Customers & Market Audience
              </label>
              <textarea
                rows={3}
                value={currentPlan.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="Who purchases from you? (e.g. Conscious consumers, local families, B2B boutique retailers)"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Your Solution & Unique Edge
              </label>
              <textarea
                rows={3}
                value={currentPlan.solution}
                onChange={(e) => handleInputChange('solution', e.target.value)}
                placeholder="What is your tangible product, service, or methodology? Why do you win?"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStep(1)}
              className="px-5 py-2.5 text-xs font-semibold text-[#6B6358] hover:text-[#1C1917] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setActiveStep(3)}
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#E05D44] hover:bg-[#CA4F37] rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to Product & Pricing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Product & Pricing */}
      {activeStep === 3 && (
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-8 space-y-6">
          <div className="border-b border-[#F2ECE1] pb-4">
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">
              Step 3: Offerings, Pricing Strategy & Operations
            </h3>
            <p className="text-xs text-[#6B6358] mt-1">
              How do you deliver value, establish fair margins, and handle day-to-day production?
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Revenue Model & Sales Channels
              </label>
              <textarea
                rows={3}
                value={currentPlan.revenueModel}
                onChange={(e) => handleInputChange('revenueModel', e.target.value)}
                placeholder="e.g. Direct-to-consumer e-commerce, weekly farmer markets, wholesale orders, monthly memberships"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Pricing & Margin Logic
              </label>
              <textarea
                rows={3}
                value={currentPlan.pricingStrategy}
                onChange={(e) => handleInputChange('pricingStrategy', e.target.value)}
                placeholder="What are your price points? How does this incorporate fair compensation for your labor and team?"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Production, Sourcing & Delivery Operations
              </label>
              <textarea
                rows={3}
                value={currentPlan.productionDelivery}
                onChange={(e) => handleInputChange('productionDelivery', e.target.value)}
                placeholder="Where do materials come from? How are items manufactured or services performed?"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStep(2)}
              className="px-5 py-2.5 text-xs font-semibold text-[#6B6358] hover:text-[#1C1917] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setActiveStep(4)}
              className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#E05D44] hover:bg-[#CA4F37] rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Continue to SDG 5 & Capital</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: SDG 5 & Capital */}
      {activeStep === 4 && (
        <div className="bg-white border border-[#E8E2D8] rounded-xl p-8 space-y-6">
          <div className="border-b border-[#F2ECE1] pb-4">
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">
              Step 4: UN SDG 5 Alignment & Non-Dilutive Capital Need
            </h3>
            <p className="text-xs text-[#6B6358] mt-1">
              Connect your business model directly to gender equality metrics to prepare for grant and impact fund applications.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                SDG 5 Focus & Gender-Lens Impact
              </label>
              <textarea
                rows={3}
                value={currentPlan.sdg5Focus}
                onChange={(e) => handleInputChange('sdg5Focus', e.target.value)}
                placeholder="e.g. Target 5.a: Paying fair wages to female craftswomen, providing flexible hours for working mothers, female leadership."
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1C1917] uppercase tracking-wider">
                Target Non-Dilutive Grant / Seed Capital Need
              </label>
              <input
                type="text"
                value={currentPlan.fundingNeeded}
                onChange={(e) => handleInputChange('fundingNeeded', e.target.value)}
                placeholder="e.g. $10,000 for raw material inventory and industrial equipment"
                className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-sm text-[#1C1917] focus:outline-none focus:border-[#E05D44]"
              />
            </div>

            <div className="p-4 bg-[#F7F3EB] rounded-lg border border-[#E8E2D8] text-xs text-[#524B42] space-y-1">
              <span className="font-semibold text-[#1C1917]">Targeting UN SDG 5 Targets:</span>
              <ul className="list-disc pl-5 space-y-1 mt-1 text-[#6B6358]">
                <li><strong className="text-[#1C1917]">Target 5.5:</strong> Full participation in leadership and economic decision-making</li>
                <li><strong className="text-[#1C1917]">Target 5.a:</strong> Equal rights to economic resources, property ownership & financial services</li>
                <li><strong className="text-[#1C1917]">Target 5.b:</strong> Enabling technology to promote the empowerment of women</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setActiveStep(3)}
              className="px-5 py-2.5 text-xs font-semibold text-[#6B6358] hover:text-[#1C1917] flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleGeneratePlan}
              disabled={isGenerating}
              className="px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#E05D44] hover:bg-[#CA4F37] disabled:bg-[#A89F91] rounded-sm transition-all flex items-center gap-2.5 cursor-pointer shadow-sm active:scale-98"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Blueprint with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Synthesized Blueprint View */}
      {activeStep === 5 && currentPlan.generatedContent && (
        <div className="space-y-6">
          {/* Blueprint Controls Bar */}
          <div className="no-print bg-white border border-[#E8E2D8] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep(1)}
                className="px-3 py-1.5 text-xs font-semibold text-[#6B6358] hover:text-[#1C1917] bg-[#F7F3EB] rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Inputs</span>
              </button>

              <button
                onClick={handleGeneratePlan}
                disabled={isGenerating}
                className="px-3 py-1.5 text-xs font-semibold text-[#E05D44] bg-[#FAF0ED] hover:bg-[#F5E2DD] rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate with AI</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  onSavePlan(currentPlan);
                }}
                className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F5EFEB] hover:bg-[#ECE4DC] border border-[#E0D7C9] rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C8963E]" />
                <span>Save to Local Portfolio</span>
              </button>

              <button
                onClick={handleExportMarkdown}
                className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F5EFEB] hover:bg-[#ECE4DC] border border-[#E0D7C9] rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-[#F5EFEB] hover:bg-[#ECE4DC] border border-[#E0D7C9] rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>

              <button
                onClick={() => onNavigateToGrants(currentPlan)}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#E05D44] hover:bg-[#CA4F37] rounded-sm transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Find Matching Grants</span>
              </button>
            </div>
          </div>

          {/* Editorial Blueprint Document Canvas */}
          <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl p-8 sm:p-12 space-y-12 shadow-xs">
            {/* Document Header */}
            <div className="border-b border-[#E0D7C9] pb-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B6358]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#E05D44] uppercase tracking-wider">Astraea Venture Dossier</span>
                  <span aria-hidden="true">·</span>
                  <span>UN SDG 5 Benchmark</span>
                </div>
                <div>Updated: {currentPlan.updatedAt}</div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#1C1917]">
                {currentPlan.businessName}
              </h1>

              <p className="font-serif italic text-lg sm:text-xl text-[#524B42] max-w-3xl">
                "{currentPlan.tagline}"
              </p>

              {/* Unboxed Metadata row */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6B6358]">
                <span><strong className="text-[#1C1917]">Industry:</strong> {currentPlan.industry}</span>
                <span aria-hidden="true" className="text-[#D5CCC0]">·</span>
                <span><strong className="text-[#1C1917]">Stage:</strong> {currentPlan.stage}</span>
                <span aria-hidden="true" className="text-[#D5CCC0]">·</span>
                <span><strong className="text-[#1C1917]">Target Capital:</strong> {currentPlan.fundingNeeded}</span>
              </div>
            </div>

            {/* Section 1: Executive Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                <h3 className="font-serif text-2xl font-medium text-[#1C1917]">
                  01. Executive Summary & Thesis
                </h3>
              </div>
              <p className="text-base text-[#292524] leading-relaxed font-light font-serif">
                {currentPlan.generatedContent.executiveSummary}
              </p>
            </div>

            {/* Section 2: Market Analysis & Customer Persona */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                <h3 className="font-serif text-2xl font-medium text-[#1C1917]">
                  02. Market Analysis & The Customer Persona
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358]">
                    Target Market Segment
                  </h4>
                  <p className="text-sm text-[#292524] leading-relaxed">
                    {currentPlan.generatedContent.marketAnalysis.targetMarket}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358]">
                    Defensible Competitive Advantage
                  </h4>
                  <p className="text-sm text-[#292524] leading-relaxed">
                    {currentPlan.generatedContent.marketAnalysis.competitiveEdge}
                  </p>
                </div>
                <div className="md:col-span-2 p-5 bg-[#F2ECE1] rounded-xl border border-[#E0D7C9] space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917]">
                    Ideal Customer Persona
                  </h4>
                  <p className="text-sm text-[#443E36] leading-relaxed font-serif italic">
                    {currentPlan.generatedContent.marketAnalysis.customerPersona}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Operations, Offerings & Milestones */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                <h3 className="font-serif text-2xl font-medium text-[#1C1917]">
                  03. Product Offerings & Execution Milestones
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358]">
                    Core Product & Service Structure
                  </h4>
                  <p className="text-sm text-[#292524] leading-relaxed mt-1">
                    {currentPlan.generatedContent.operationsAndProduct.offeringDetails}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358]">
                    Ethical Delivery & Supply Chain
                  </h4>
                  <p className="text-sm text-[#292524] leading-relaxed mt-1">
                    {currentPlan.generatedContent.operationsAndProduct.deliveryModel}
                  </p>
                </div>
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358] mb-3">
                    Execution Timeline
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentPlan.generatedContent.operationsAndProduct.milestones.map((m, i) => (
                      <div
                        key={i}
                        className="p-4 bg-white border border-[#E8E2D8] rounded-lg text-xs text-[#292524] flex items-start gap-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#F5EFEB] text-[#E05D44] font-bold text-[11px] flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Financial Strategy */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                <h3 className="font-serif text-2xl font-medium text-[#1C1917]">
                  04. Financial Strategy & Capital Deployment
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358]">
                    Pricing Logic & Gross Margins
                  </h4>
                  <p className="text-sm text-[#292524] leading-relaxed">
                    {currentPlan.generatedContent.financialStrategy.pricingLogic}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358]">
                    Break-Even Projection
                  </h4>
                  <p className="text-sm text-[#292524] leading-relaxed font-mono">
                    {currentPlan.generatedContent.financialStrategy.breakEvenEstimate}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358]">
                    Core Revenue Streams
                  </h4>
                  <ul className="space-y-1.5 text-sm text-[#292524]">
                    {currentPlan.generatedContent.financialStrategy.revenueStreams.map((stream, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E05D44]" />
                        <span>{stream}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B6358]">
                    Initial Grant / Capital Allocation
                  </h4>
                  <p className="text-sm text-[#292524] leading-relaxed">
                    {currentPlan.generatedContent.financialStrategy.initialFundingAllocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5: UN SDG 5 Framework */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                <h3 className="font-serif text-2xl font-medium text-[#1C1917]">
                  05. UN SDG 5 Gender Equality & Empowerment Framework
                </h3>
              </div>
              <div className="space-y-4 pt-2">
                <div className="p-4 bg-[#FAF0ED] border border-[#F5C2B9] rounded-xl text-xs text-[#B83824]">
                  <strong className="block mb-1 font-serif text-sm text-[#A32A18]">
                    Target Citations
                  </strong>
                  {currentPlan.generatedContent.sdg5ImpactFramework.targetAlignment}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="p-5 bg-white border border-[#E8E2D8] rounded-xl space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2E6953]">
                      Direct Empowerment Outcomes
                    </h4>
                    <ul className="space-y-2 text-xs text-[#292524]">
                      {currentPlan.generatedContent.sdg5ImpactFramework.directEmpowermentOutcomes.map((o, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#2E6953] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 bg-white border border-[#E8E2D8] rounded-xl space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C8963E]">
                      Key Performance Indicators (KPIs)
                    </h4>
                    <ul className="space-y-2 text-xs text-[#292524]">
                      {currentPlan.generatedContent.sdg5ImpactFramework.keyPerformanceIndicators.map((kpi, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono text-xs font-bold text-[#C8963E] shrink-0">
                            #{idx + 1}
                          </span>
                          <span className="leading-relaxed">{kpi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: The 60-Second Pitch Hook */}
            <div className="p-6 sm:p-8 bg-[#1C1917] text-white rounded-2xl space-y-3">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-[#E05D44]">
                The 60-Second Grant & Investor Hook
              </span>
              <p className="font-serif italic text-lg sm:text-xl text-white/95 leading-relaxed">
                {currentPlan.generatedContent.pitchDeckKicker}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">
                <span>Recommended Grant Keywords:</span>
                {currentPlan.generatedContent.suggestedGrantKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 bg-white/10 rounded-sm text-white/90 font-mono text-[11px]"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
