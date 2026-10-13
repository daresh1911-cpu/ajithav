import React, { useState } from 'react';
import { Coins, TrendingUp, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import { FinancialModelInputs, BusinessPlanData } from '../types';

interface FinancialSimulatorProps {
  currentPlan: BusinessPlanData;
  onApplyToPlan: (summaryText: string) => void;
}

export const FinancialSimulator: React.FC<FinancialSimulatorProps> = ({
  currentPlan,
  onApplyToPlan,
}) => {
  const [inputs, setInputs] = useState<FinancialModelInputs>({
    unitPrice: 55,
    unitCogs: 18,
    monthlyFixedCosts: 1800,
    monthlyTargetUnits: 80,
    initialCapital: 12000,
    livingWageHourly: 25,
    hoursPerUnit: 1.5,
  });

  const [appliedNotification, setAppliedNotification] = useState(false);

  // Derived Financial Calculations
  const contributionMargin = Math.max(0, inputs.unitPrice - inputs.unitCogs);
  const marginPercentage = inputs.unitPrice > 0 ? (contributionMargin / inputs.unitPrice) * 100 : 0;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(inputs.monthlyFixedCosts / contributionMargin) : 0;

  const monthlyGrossRevenue = inputs.unitPrice * inputs.monthlyTargetUnits;
  const monthlyVariableCosts = inputs.unitCogs * inputs.monthlyTargetUnits;
  const monthlyTotalCosts = inputs.monthlyFixedCosts + monthlyVariableCosts;
  const monthlyNetCashFlow = monthlyGrossRevenue - monthlyTotalCosts;

  const isProfitable = monthlyNetCashFlow >= 0;
  const monthlyBurn = isProfitable ? 0 : Math.abs(monthlyNetCashFlow);
  const runwayMonths = monthlyBurn > 0 ? (inputs.initialCapital / monthlyBurn).toFixed(1) : 'Self-Sustaining';

  // SDG 5 Living Wage Distribution
  const totalLaborHours = inputs.hoursPerUnit * inputs.monthlyTargetUnits;
  const monthlyLivingWagesPaid = totalLaborHours * inputs.livingWageHourly;

  const handleApplyToPlan = () => {
    const summary = `Unit Economics: $${inputs.unitPrice.toFixed(2)} price with $${inputs.unitCogs.toFixed(2)} COGS (${marginPercentage.toFixed(0)}% gross margin). Break-even point is ${breakEvenUnits} units/month to cover $${inputs.monthlyFixedCosts.toLocaleString()} fixed overhead. At target ${inputs.monthlyTargetUnits} units/month, projected monthly net is $${monthlyNetCashFlow.toLocaleString()} with $${monthlyLivingWagesPaid.toLocaleString()} directly distributed in living wages.`;
    onApplyToPlan(summary);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8E2D8] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2E6953]">
          <span>Interactive Micro-Venture Modeler</span>
          <span aria-hidden="true">·</span>
          <span>Target 5.a Fair Compensation</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-[#1C1917] mt-1">
          Unit Economics & Runway Sandbox
        </h2>
        <p className="text-sm text-[#6B6358] mt-1 max-w-3xl">
          Micro-enterprises thrive when unit economics are transparent and realistic. Use this interactive simulator to stress-test your pricing, determine your exact break-even volume, and verify living-wage sustainability for yourself and your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Sliders & Fields (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2D8] rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-serif text-xl font-medium text-[#1C1917] border-b border-[#F2ECE1] pb-3">
            Venture Operating Parameters
          </h3>

          <div className="space-y-5">
            {/* 1. Unit Price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-[#1C1917]">
                  Average Selling Price per Unit / Contract
                </label>
                <span className="font-mono font-bold text-sm text-[#1C1917]">
                  ${inputs.unitPrice.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={inputs.unitPrice}
                onChange={(e) => setInputs({ ...inputs, unitPrice: Number(e.target.value) })}
                className="w-full accent-[#E05D44] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C8273]">
                <span>$5 (Low-cost micro-good)</span>
                <span>$500 (High-tier service/product)</span>
              </div>
            </div>

            {/* 2. Unit COGS */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-[#1C1917]">
                  Direct Material & Production Cost (COGS) per Unit
                </label>
                <span className="font-mono font-bold text-sm text-[#1C1917]">
                  ${inputs.unitCogs.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max={Math.max(50, inputs.unitPrice - 1)}
                step="1"
                value={inputs.unitCogs}
                onChange={(e) => setInputs({ ...inputs, unitCogs: Number(e.target.value) })}
                className="w-full accent-[#E05D44] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C8273]">
                <span>$1</span>
                <span>${Math.max(50, inputs.unitPrice - 1)} (Cannot exceed price)</span>
              </div>
            </div>

            {/* 3. Monthly Fixed Overhead */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-[#1C1917]">
                  Monthly Fixed Overhead (Studio rent, tools, utilities, digital storefront)
                </label>
                <span className="font-mono font-bold text-sm text-[#1C1917]">
                  ${inputs.monthlyFixedCosts.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="8000"
                step="100"
                value={inputs.monthlyFixedCosts}
                onChange={(e) => setInputs({ ...inputs, monthlyFixedCosts: Number(e.target.value) })}
                className="w-full accent-[#E05D44] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C8273]">
                <span>$200/mo (Home studio)</span>
                <span>$8,000/mo (Full commercial facility)</span>
              </div>
            </div>

            {/* 4. Target Sales Volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-[#1C1917]">
                  Target Monthly Sales Volume (Units / Clients)
                </label>
                <span className="font-mono font-bold text-sm text-[#1C1917]">
                  {inputs.monthlyTargetUnits} units
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="500"
                step="5"
                value={inputs.monthlyTargetUnits}
                onChange={(e) => setInputs({ ...inputs, monthlyTargetUnits: Number(e.target.value) })}
                className="w-full accent-[#E05D44] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#8C8273]">
                <span>5 units</span>
                <span>500 units</span>
              </div>
            </div>

            {/* 5. Living Wage Compensation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#F2ECE1]">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1917]">
                  Living Wage Target ($/hour)
                </label>
                <input
                  type="number"
                  min="15"
                  max="80"
                  value={inputs.livingWageHourly}
                  onChange={(e) => setInputs({ ...inputs, livingWageHourly: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-xs font-mono"
                />
                <span className="text-[10px] text-[#8C8273]">Fair wage paid to female artisan or founder</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1917]">
                  Seed Grant / Cash Cushion ($)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  step="500"
                  value={inputs.initialCapital}
                  onChange={(e) => setInputs({ ...inputs, initialCapital: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E0D7C9] rounded-lg text-xs font-mono"
                />
                <span className="text-[10px] text-[#8C8273]">Available grant capital or cash buffer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Output Cards & Break-Even Visual (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Key Metrics Dashboard */}
          <div className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-xl p-6 space-y-5 shadow-xs">
            <h3 className="font-serif text-lg font-medium text-[#1C1917] border-b border-[#E0D7C9] pb-3">
              Real-Time Economics Dashboard
            </h3>

            {/* Metric 1: Break-even unit bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-[#6B6358]">Break-Even Volume:</span>
                <span className="font-mono font-bold text-[#1C1917]">
                  {breakEvenUnits} units/month
                </span>
              </div>
              <div className="w-full bg-[#E5DDD0] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    inputs.monthlyTargetUnits >= breakEvenUnits ? 'bg-[#2E6953]' : 'bg-[#E05D44]'
                  }`}
                  style={{
                    width: `${Math.min(100, (inputs.monthlyTargetUnits / Math.max(1, breakEvenUnits)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#8C8273]">
                <span>Current Goal: {inputs.monthlyTargetUnits} units</span>
                <span>
                  {inputs.monthlyTargetUnits >= breakEvenUnits ? (
                    <strong className="text-[#2E6953]">Profitable by {inputs.monthlyTargetUnits - breakEvenUnits} units</strong>
                  ) : (
                    <strong className="text-[#E05D44]">Need {breakEvenUnits - inputs.monthlyTargetUnits} more units</strong>
                  )}
                </span>
              </div>
            </div>

            {/* Metric Grid with tabular numbers */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 bg-white border border-[#E8E2D8] rounded-lg space-y-1">
                <span className="text-[11px] text-[#6B6358]">Unit Margin</span>
                <div className="font-mono text-base font-bold text-[#1C1917]">
                  ${contributionMargin.toFixed(2)}
                </div>
                <span className="text-[10px] text-[#2E6953] font-semibold">
                  {marginPercentage.toFixed(0)}% Gross Margin
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#E8E2D8] rounded-lg space-y-1">
                <span className="text-[11px] text-[#6B6358]">Monthly Net Cash</span>
                <div
                  className={`font-mono text-base font-bold ${
                    isProfitable ? 'text-[#2E6953]' : 'text-[#E05D44]'
                  }`}
                >
                  {isProfitable ? `+$${monthlyNetCashFlow.toLocaleString()}` : `-$${monthlyBurn.toLocaleString()}`}
                </div>
                <span className="text-[10px] text-[#6B6358]">
                  {isProfitable ? 'Cash Positive' : 'Monthly Burn'}
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#E8E2D8] rounded-lg space-y-1">
                <span className="text-[11px] text-[#6B6358]">Operating Runway</span>
                <div className="font-mono text-base font-bold text-[#1C1917]">
                  {runwayMonths === 'Self-Sustaining' ? 'Sustaining' : `${runwayMonths} mos`}
                </div>
                <span className="text-[10px] text-[#8C8273]">Based on ${inputs.initialCapital.toLocaleString()} grant</span>
              </div>

              <div className="p-3.5 bg-white border border-[#E8E2D8] rounded-lg space-y-1">
                <span className="text-[11px] text-[#6B6358]">Wages Distributed</span>
                <div className="font-mono text-base font-bold text-[#2E6953]">
                  ${monthlyLivingWagesPaid.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#2E6953]">SDG 5 living wage pool</span>
              </div>
            </div>

            {/* SDG 5 Impact Card */}
            <div className="p-4 bg-[#FAF0ED] border border-[#F5C2B9] rounded-xl space-y-1.5 text-xs text-[#524B42]">
              <span className="font-semibold text-[#A32A18] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>SDG 5 Target 5.a Living Wage Analysis</span>
              </span>
              <p className="leading-relaxed">
                At your target volume of {inputs.monthlyTargetUnits} units/month, this micro-venture creates <strong className="text-[#1C1917]">{totalLaborHours.toFixed(0)} hours</strong> of compensated work, injecting <strong className="text-[#1C1917]">${(monthlyLivingWagesPaid * 12).toLocaleString()} annually</strong> directly into female artisans' and founders' bank accounts.
              </p>
            </div>

            {/* Sync to Plan Button */}
            <div className="pt-2">
              <button
                onClick={handleApplyToPlan}
                className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-white bg-[#E05D44] hover:bg-[#CA4F37] rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Embed Figures into Business Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {appliedNotification && (
                <p className="text-center text-xs text-[#2E6953] font-medium mt-2 animate-fade-in">
                  ✓ Economics successfully synced to active plan!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
