export interface BusinessPlanContent {
  executiveSummary: string;
  marketAnalysis: {
    targetMarket: string;
    competitiveEdge: string;
    customerPersona: string;
  };
  operationsAndProduct: {
    offeringDetails: string;
    deliveryModel: string;
    milestones: string[];
  };
  financialStrategy: {
    pricingLogic: string;
    revenueStreams: string[];
    initialFundingAllocation: string;
    breakEvenEstimate: string;
  };
  sdg5ImpactFramework: {
    targetAlignment: string;
    directEmpowermentOutcomes: string[];
    keyPerformanceIndicators: string[];
  };
  pitchDeckKicker: string;
  suggestedGrantKeywords: string[];
}

export interface BusinessPlanData {
  id: string;
  businessName: string;
  industry: string;
  stage: string;
  tagline: string;
  problemStatement: string;
  targetAudience: string;
  solution: string;
  revenueModel: string;
  pricingStrategy: string;
  productionDelivery: string;
  sdg5Focus: string;
  fundingNeeded: string;
  updatedAt: string;
  generatedContent?: BusinessPlanContent;
}

export interface Grant {
  id: string;
  title: string;
  organization: string;
  awardAmount: string;
  numericAmount: number;
  grantType: 'Grant' | 'Fellowship' | 'Competition' | 'Micro-Loan';
  deadline: string;
  geography: string;
  eligibleStage: 'Idea' | 'Early Stage' | 'Growth' | 'All Stages';
  industryCategory: 'Artisan & Retail' | 'Social Impact & Health' | 'Tech & Services' | 'Sustainable & Green' | 'General';
  description: string;
  eligibilityCriteria: string;
  applicationUrl: string;
  sdgTarget: string;
  featured?: boolean;
}

export interface GrantEvaluation {
  matchScore: number;
  strengths: string[];
  gapsToAddress: string[];
  recommendedPitchAngle: string;
  applicationActionSteps: string[];
  evaluatedAt: string;
}

export interface FinancialModelInputs {
  unitPrice: number;
  unitCogs: number;
  monthlyFixedCosts: number;
  monthlyTargetUnits: number;
  initialCapital: number;
  livingWageHourly: number;
  hoursPerUnit: number;
}
