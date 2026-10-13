import express from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Business Plan Synthesis Endpoint
app.post('/api/generate-plan', async (req, res) => {
  try {
    const {
      businessName,
      industry,
      tagline,
      problemStatement,
      targetAudience,
      solution,
      revenueModel,
      pricingStrategy,
      productionDelivery,
      sdg5Focus,
      fundingNeeded,
      stage,
    } = req.body;

    if (!businessName || !industry) {
      return res.status(400).json({ error: 'Business name and industry are required.' });
    }

    if (ai) {
      try {
        const prompt = `You are a world-class venture strategist and gender-lens impact advisor supporting women entrepreneurs aligned with UN Sustainable Development Goal 5 (Gender Equality & Economic Empowerment).
Synthesize a comprehensive, concrete, and inspiring business plan for this woman-founded micro-enterprise/business.

Business Profile:
- Name: ${businessName}
- Industry / Domain: ${industry}
- Stage: ${stage || 'Idea to Early Launch'}
- Tagline / Mission: ${tagline || 'Empowering through sustainable quality'}
- Core Problem Solved: ${problemStatement || 'Limited access and market barriers'}
- Target Customers: ${targetAudience || 'Conscious consumers and enterprise partners'}
- Value Proposition & Solution: ${solution || 'Handcrafted or ethical innovative products'}
- Revenue Model: ${revenueModel || 'Direct-to-consumer and wholesale contracts'}
- Pricing & Margin Strategy: ${pricingStrategy || 'Tiered value-based pricing with fair labor cost'}
- Operations & Delivery: ${productionDelivery || 'Local ethical supply chain'}
- SDG 5 Alignment & Gender-Lens: ${sdg5Focus || 'Fair living wages, female artisans, flexible leadership'}
- Initial Capital/Grant Need: ${fundingNeeded || '$10,000 for equipment & initial inventory'}

Return ONLY a valid JSON object matching this structure:
{
  "executiveSummary": "A compelling 3-4 sentence narrative summarizing the venture, market timing, and SDG 5 thesis.",
  "marketAnalysis": {
    "targetMarket": "Precise description of addressable market segments and behavioral drivers.",
    "competitiveEdge": "Why this women-led business uniquely wins over alternatives.",
    "customerPersona": "A vivid 2-3 sentence portrait of the ideal customer or client."
  },
  "operationsAndProduct": {
    "offeringDetails": "Clear breakdown of flagship products or service tiers.",
    "deliveryModel": "Supply chain, sourcing ethics, fulfillment, and customer care.",
    "milestones": [
      "Month 1-3 milestone",
      "Month 4-6 milestone",
      "Month 7-12 milestone",
      "Year 2 milestone"
    ]
  },
  "financialStrategy": {
    "pricingLogic": "Explanation of unit economics, gross margins, and customer lifetime value.",
    "revenueStreams": [
      "Primary revenue stream",
      "Secondary revenue stream",
      "Ancillary or expansion revenue stream"
    ],
    "initialFundingAllocation": "Detailed practical breakdown of how initial capital will be deployed.",
    "breakEvenEstimate": "Estimated volume or monthly sales required to attain sustainable profitability."
  },
  "sdg5ImpactFramework": {
    "targetAlignment": "Specific UN SDG 5 target citations (e.g. Target 5.5 leadership, 5.a economic rights).",
    "directEmpowermentOutcomes": [
      "Concrete outcome 1 for women employed or served",
      "Concrete outcome 2 on financial independence and wage equity",
      "Concrete outcome 3 on community resilience"
    ],
    "keyPerformanceIndicators": [
      "Metric 1 (e.g. % women in artisan supply chain paid living wages)",
      "Metric 2 (e.g. monthly revenue generated per craftswoman)",
      "Metric 3 (e.g. training hours in financial literacy)"
    ]
  },
  "pitchDeckKicker": "A memorable 1-2 sentence pitch hook crafted for impact investors, grant panels, and micro-loan committees.",
  "suggestedGrantKeywords": ["3-5 relevant search keywords for capital discovery"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are an expert venture strategist specializing in women-owned businesses, micro-enterprises, and UN SDG 5 impact evaluation.',
          },
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText.trim());
          return res.json({ success: true, plan: parsed });
        }
      } catch (aiErr) {
        console.warn('Gemini plan synthesis encountered temporary rate limit/spike, using modeled fallback:', aiErr);
      }
    }

    // High-quality deterministic fallback if API is not yet provisioned
    const fallbackPlan = {
      executiveSummary: `${businessName} is a high-impact woman-owned enterprise operating in the ${industry} space, engineered to transform customer value while directly advancing UN SDG 5 (Gender Equality & Women's Economic Empowerment). By pairing ethical craftsmanship and quality service with inclusive operational practices, the venture captures resilient margins and creates sustainable livelihoods.`,
      marketAnalysis: {
        targetMarket: `Conscious consumers and organizations prioritizing authentic quality, transparent provenance, and gender-inclusive value chains within ${industry}.`,
        competitiveEdge: `Direct relationship with producers, low overhead micro-operations, and distinct brand storytelling rooted in female leadership and craftsmanship.`,
        customerPersona: `Purpose-driven buyers aged 25-54 who prioritize craftsmanship, community impact, and durable value over disposable mass-market alternatives.`,
      },
      operationsAndProduct: {
        offeringDetails: solution || `High-touch, ethically produced offerings crafted with sustainable inputs and uncompromising attention to detail.`,
        deliveryModel: productionDelivery || `Decentralized ethical production network, direct-to-consumer digital storefront, and regional partner showcases.`,
        milestones: [
          'Formalize business registration and establish local artisan / supplier agreements.',
          'Launch MVP direct-to-consumer catalog and fulfill first 50 pilot orders.',
          'Achieve break-even operating cashflow and onboard 2 additional part-time women operators.',
          'Expand wholesale distribution to 5 regional ethical retail stockists.',
        ],
      },
      financialStrategy: {
        pricingLogic: pricingStrategy || `Value-based pricing targeting 60-70% gross product margin to support fair artisan wages and healthy cash reserves.`,
        revenueStreams: [
          'Direct-to-consumer sales (online store & pop-up markets)',
          'Curated recurring subscription or seasonal collections',
          'Custom corporate gifting and institutional partnerships',
        ],
        initialFundingAllocation: fundingNeeded ? `Dedicated deployment of ${fundingNeeded}: 40% equipment/raw materials, 30% digital storefront & branding, 20% working capital runway, 10% compliance & safety.` : '40% equipment, 30% digital launch, 20% inventory buffer, 10% legal.',
        breakEvenEstimate: 'Approximately 65-80 unit sales per month covers all baseline fixed operating expenses.',
      },
      sdg5ImpactFramework: {
        targetAlignment: 'SDG Target 5.a (Equal rights to economic resources, financial services & ownership) and Target 5.5 (Full participation in leadership & decision-making).',
        directEmpowermentOutcomes: [
          '100% of artisans and staff receive above-market living wages and flexible working schedules.',
          'Financial independence and banking access facilitated for female supply chain contributors.',
          'Skill-building workshops covering inventory management, pricing, and digital commerce.',
        ],
        keyPerformanceIndicators: [
          'Number of women micro-producers with sustained monthly income',
          'Average hourly income premium over local median wage',
          'Annual reinvestment in community craft education & child-friendly workspace policies',
        ],
      },
      pitchDeckKicker: `"${businessName} combines commercial durability with measurable gender equity, proving that a woman-led micro-business can out-innovate incumbents while lifting up entire communities."`,
      suggestedGrantKeywords: ['Women Entrepreneurship', 'Artisan Economy', 'SDG 5', 'Micro-Enterprise', 'Gender-Lens Investing'],
    };

    return res.json({ success: true, plan: fallbackPlan, isSimulated: true });
  } catch (error: any) {
    console.error('Plan generation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate plan' });
  }
});

// 2. Grant Compatibility & Pitch Critique Endpoint
app.post('/api/evaluate-grant', async (req, res) => {
  try {
    const { grantName, grantDescription, eligibilityCriteria, businessSummary, stage, industry } = req.body;

    if (!grantName || !businessSummary) {
      return res.status(400).json({ error: 'Grant name and business summary are required.' });
    }

    if (ai) {
      try {
        const prompt = `You are an elite grant review committee director specializing in non-dilutive awards, fellowships, and seed funds for women entrepreneurs (UN SDG 5).
Evaluate how well the following woman-led business matches this specific grant opportunity, and provide actionable tips to maximize approval odds.

Grant Information:
- Name: ${grantName}
- Overview: ${grantDescription || 'Dedicated non-dilutive grant for women entrepreneurs'}
- Criteria: ${eligibilityCriteria || 'Women-owned business with clear market viability and community impact'}

Applicant Business Profile:
- Industry: ${industry || 'General Business'}
- Stage: ${stage || 'Early Stage'}
- Business Summary & Plan: ${businessSummary}

Return ONLY a valid JSON object matching this schema:
{
  "matchScore": 88, // integer between 40 and 98
  "strengths": [
    "Specific strong alignment point 1",
    "Specific strong alignment point 2",
    "Specific strong alignment point 3"
  ],
  "gapsToAddress": [
    "Specific element to sharpen before applying 1",
    "Specific element to sharpen 2"
  ],
  "recommendedPitchAngle": "A targeted 2-3 sentence strategic angle emphasizing why this applicant fits the funder's mission.",
  "applicationActionSteps": [
    "Step 1: Document specific traction metrics...",
    "Step 2: Highlight SDG 5 ripple effects in budget justification...",
    "Step 3: Secure 1 customer or mentor endorsement..."
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are an authoritative non-dilutive grant committee evaluator evaluating women founders.',
          },
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText.trim());
          return res.json({ success: true, evaluation: parsed });
        }
      } catch (aiErr) {
        console.warn('Gemini grant evaluation encountered temporary rate limit/spike, using modeled fallback:', aiErr);
      }
    }

    // High-quality deterministic fallback
    const fallbackEval = {
      matchScore: 86,
      strengths: [
        'Clear alignment with women-led leadership and economic inclusion targets.',
        'Articulated solution solves a tangible consumer or community problem with defensible gross margins.',
        'Explicit grounding in UN SDG 5 outcomes (Target 5.a and 5.5).',
      ],
      gapsToAddress: [
        'Provide more explicit historical unit economics or pre-order interest to prove market traction.',
        'Detail exact line-item budget allocation demonstrating how grant dollars directly accelerate revenue generation.',
      ],
      recommendedPitchAngle: `Position ${grantName} not merely as capital for operating runway, but as the critical catalytic unlock allowing your venture to expand production capacity, onboard vulnerable female craftswomen, and attain self-sustaining commercial profitability.`,
      applicationActionSteps: [
        'Include a concrete 6-month budget spreadsheet showing unit-level ROI.',
        'Draft a 60-second founder video highlighting the human story and community impact behind the brand.',
        'Obtain a written testimonial from an early client, stockist, or local community mentor.',
      ],
    };

    return res.json({ success: true, evaluation: fallbackEval, isSimulated: true });
  } catch (error: any) {
    console.error('Grant evaluation error:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate grant' });
  }
});

// Vite Middleware for development; static files for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Astraea server running on http://0.0.0.0:${port}`);
  });
}

startServer();
