import React, { useState } from 'react';
import { Award, CheckCircle2, Copy, Check, Sparkles, Globe, HeartHandshake } from 'lucide-react';
import { BusinessPlanData } from '../types';

interface SdgImpactSectionProps {
  currentPlan: BusinessPlanData;
}

export const SdgImpactSection: React.FC<SdgImpactSectionProps> = ({ currentPlan }) => {
  const [auditChecks, setAuditChecks] = useState<Record<string, boolean>>({
    livingWage: true,
    femaleLeadership: true,
    caregiverFlexibility: true,
    directBanking: false,
    supplierDiversity: true,
    skillsApprenticeship: false,
  });

  const [copiedStatement, setCopiedStatement] = useState(false);

  const toggleCheck = (key: string) => {
    setAuditChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(auditChecks).filter(Boolean).length;
  const auditScore = Math.round((completedCount / Object.keys(auditChecks).length) * 100);

  const generatedImpactStatement = `UN SDG 5 IMPACT ATTESTATION:
${currentPlan.businessName || 'Our enterprise'} directly advances United Nations Sustainable Development Goal 5 (Gender Equality & Women's Economic Empowerment).
By anchoring operations in Target 5.a (equal rights to economic resources and financial services) and Target 5.5 (women in leadership and economic decision-making), our venture commits to:
- Paying certified above-market living wages to female staff and artisan partners
- Providing flexible production schedules accommodating mothers and community caregivers
- Establishing direct, independent bank account access and financial literacy for producers
- Prioritizing women-owned vendors across our upstream supply chain.
This institutional framework guarantees that every dollar of revenue generates tangible, non-dilutive social returns for women.`;

  const handleCopyStatement = () => {
    navigator.clipboard.writeText(generatedImpactStatement);
    setCopiedStatement(true);
    setTimeout(() => setCopiedStatement(false), 3000);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-[#E8E2D8] pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#E05D44]">
          <span>United Nations Framework</span>
          <span aria-hidden="true">·</span>
          <span>Global Goals for Sustainable Development</span>
        </div>
        <h2 className="font-serif text-3xl font-medium text-[#1C1917] mt-1">
          SDG Goal 5: Gender Equality & Women's Empowerment
        </h2>
        <p className="text-sm text-[#6B6358] mt-1 max-w-3xl">
          Sustainable Development Goal 5 seeks to achieve gender equality and empower all women and girls by 2030. In entrepreneurship, women-led businesses are powerful engines for community development, poverty eradication, and generational wealth.
        </p>
      </div>

      {/* Target Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-[#E8E2D8] rounded-xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#E05D44]">
            Target 5.5
          </div>
          <h3 className="font-serif text-lg font-medium text-[#1C1917]">
            Equal Leadership & Participation
          </h3>
          <p className="text-xs text-[#524B42] leading-relaxed">
            Ensure women’s full and effective participation and equal opportunities for leadership at all levels of decision-making in political, economic, and public life.
          </p>
          <div className="pt-2 text-[11px] text-[#6B6358] border-t border-[#F2ECE1]">
            <strong className="text-[#1C1917]">Venture Action:</strong> Majority female governance, founder equity ownership, and wage parity.
          </div>
        </div>

        <div className="p-6 bg-white border border-[#E8E2D8] rounded-xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#C8963E]">
            Target 5.a
          </div>
          <h3 className="font-serif text-lg font-medium text-[#1C1917]">
            Economic Resources & Financial Rights
          </h3>
          <p className="text-xs text-[#524B42] leading-relaxed">
            Undertake reforms to give women equal rights to economic resources, access to ownership and control over land, financial services, inheritance, and capital.
          </p>
          <div className="pt-2 text-[11px] text-[#6B6358] border-t border-[#F2ECE1]">
            <strong className="text-[#1C1917]">Venture Action:</strong> Living wages, independent bank account establishment, equipment ownership for craftswomen.
          </div>
        </div>

        <div className="p-6 bg-white border border-[#E8E2D8] rounded-xl space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#2E6953]">
            Target 5.b
          </div>
          <h3 className="font-serif text-lg font-medium text-[#1C1917]">
            Enabling Technology & Innovation
          </h3>
          <p className="text-xs text-[#524B42] leading-relaxed">
            Enhance the use of enabling technology, in particular information and communications technology, to promote the empowerment of women.
          </p>
          <div className="pt-2 text-[11px] text-[#6B6358] border-t border-[#F2ECE1]">
            <strong className="text-[#1C1917]">Venture Action:</strong> Digital storefronts, automated invoicing, AI planning tools, and remote collaboration.
          </div>
        </div>
      </div>

      {/* Interactive Self-Audit Tool */}
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE1] pb-4">
          <div>
            <h3 className="font-serif text-xl font-medium text-[#1C1917]">
              Gender-Lens Self-Audit Checklist
            </h3>
            <p className="text-xs text-[#6B6358] mt-0.5">
              Benchmark your business practices against proven gender-equality criteria used by international grant committees.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#6B6358]">Alignment Rating:</span>
            <span className="font-mono text-xl font-bold text-[#E05D44]">{auditScore}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              id: 'livingWage',
              label: 'Certified Living Wages',
              desc: 'Every team member and craftswoman receives at least local living wage, not minimum wage.',
            },
            {
              id: 'femaleLeadership',
              label: 'Majority Female Governance',
              desc: 'At least 51% ownership and key executive decisions are held by women.',
            },
            {
              id: 'caregiverFlexibility',
              label: 'Caregiver-Friendly Flexibility',
              desc: 'Hours, remote options, and shift structures allow working mothers to maintain stable employment.',
            },
            {
              id: 'directBanking',
              label: 'Direct Banking & Financial Inclusion',
              desc: 'Payments go directly to individual female workers’ bank accounts with financial literacy support.',
            },
            {
              id: 'supplierDiversity',
              label: 'Supply Chain Gender-Lens',
              desc: 'Priority given to raw material suppliers, packaging vendors, and consultants led by women.',
            },
            {
              id: 'skillsApprenticeship',
              label: 'Skills Transfer & Apprenticeship',
              desc: 'Structured training programs teaching digital commerce, pricing math, and craft mastery.',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                auditChecks[item.id]
                  ? 'bg-[#FAF8F5] border-[#E05D44]/40 shadow-xs'
                  : 'bg-[#FDFBF7] border-[#E8E2D8] hover:border-[#D5CCC0]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  auditChecks[item.id]
                    ? 'bg-[#E05D44] text-white'
                    : 'border border-[#C5BCAD] bg-white'
                }`}
              >
                {auditChecks[item.id] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-[#1C1917]">{item.label}</h4>
                <p className="text-[11px] text-[#6B6358] leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Generated Statement Box */}
        <div className="mt-6 p-6 bg-[#FAF0ED] border border-[#F5C2B9] rounded-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold text-[#A32A18] uppercase tracking-wider">
                Grant Application Attachment
              </span>
              <h4 className="font-serif text-lg font-medium text-[#1C1917]">
                Ready-to-Use SDG 5 Attestation Statement
              </h4>
            </div>

            <button
              onClick={handleCopyStatement}
              className="px-4 py-2 text-xs font-semibold text-[#1C1917] bg-white hover:bg-[#FAF8F5] border border-[#E0D7C9] rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedStatement ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#2E6953]" />
                  <span className="text-[#2E6953]">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Statement</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-xs text-[#3A140F] whitespace-pre-wrap font-sans leading-relaxed bg-white/70 p-4 rounded-lg border border-[#F5C2B9]/60">
            {generatedImpactStatement}
          </pre>
        </div>
      </div>
    </div>
  );
};
