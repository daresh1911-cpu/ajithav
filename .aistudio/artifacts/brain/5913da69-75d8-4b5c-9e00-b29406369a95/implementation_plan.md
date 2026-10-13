# Astraea — SDG 5 Women Entrepreneurship & Micro-Business Launchpad

Astraea is an empowering, editorial-grade web platform advancing **UN Sustainable Development Goal 5 (Gender Equality & Women's Empowerment — Targets 5.5 & 5.a)** by giving aspiring and early-stage women entrepreneurs the interactive tools, AI-powered business blueprint generation, and curated non-dilutive grant matching needed to turn ideas into viable, fundable micro-enterprises.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following directions were confirmed during Phase 1 interactive clarification and govern the application architecture:

- **Confirmed Theme & Concept**: Entrepreneurship and micro-business launchpad for women, tackling structural barriers in access to capital, mentorship, and business formalization (SDG Target 5.a).
- **Confirmed Core Centerpiece**: Interactive **AI Business Plan Builder** & **Grant & Micro-Capital Matcher**, augmented by a practical financial viability calculator and pitch deck generator.
- **Confirmed Visual Identity**: Warm editorial empowering aesthetic, utilizing tactile warm canvas tones, rich espresso typography, terracotta coral accents, and champagne gold details.

---

### 1. Overview & Core Concept

- **What It Does**:
  - **Interactive AI Business Blueprint Generator**: Multi-step intuitive prompt wizard tailored for women founders (cottage industries, artisan goods, local services, tech startups, social ventures) generating executive summaries, value propositions, pricing strategies, operational blueprints, and SDG 5 impact statements.
  - **Global & Regional Grant Finder**: Intelligent directory of real non-dilutive grants, seed competitions, fellowships, and micro-loan programs for female founders (e.g., Cartier Women's Initiative, Amber Grant, IFundWomen, Tory Burch Foundation, She's Next), filterable by industry, stage, and geography with an AI eligibility matcher.
  - **Micro-Business Unit Economics & Runway Simulator**: An interactive financial modeler calculating startup costs, break-even units, monthly burn, and working capital needs with exportable summaries.
  - **SDG 5 Impact Assessment**: Measures how the user's business concept advances gender equality (e.g., fair wages for women artisans, female leadership, supply chain inclusion, family-friendly work flexibility).
  - **Saved Venture Portfolio**: Founders can bookmark grants, save draft business plans locally, and export polished PDFs/markdown summaries.

- **Target Audience / Persona**:
  - First-time women entrepreneurs, craftswomen, micro-enterprise owners, community business founders, and social innovators who need structured guidance without intimidating corporate jargon.

- **Key Value**:
  - Democratizes startup strategy and capital discovery, addressing the global venture and credit gap where women receive less than 3% of venture funding and face severe micro-credit barriers.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Discover & Orient**:
   - Hero narrative introducing the mission: bridging the financial and mentorship divide for women creators.
   - Live SDG 5 metric showcase (e.g., global female business ownership rate, capital disparity stats, economic multiplier effect).
2. **AI Business Plan Studio**:
   - 4-step guided intake: *Venture Identity & Mission* $\rightarrow$ *Target Customers & Problem* $\rightarrow$ *Products, Pricing & Delivery* $\rightarrow$ *SDG 5 Alignment & Growth*.
   - Live generation via Gemini 3.8 Flash producing a structured 6-section business plan with editable sections, actionable next steps, and instant export.
3. **Grant & Capital Discovery Engine**:
   - Searchable, filterable directory with stage filters (Idea, Early Revenue, Growth) and sector tags (Social Impact, Artisan/Food, Tech, Creative).
   - "Match My Venture" feature: one-click evaluation of eligibility criteria against the user's active business plan.
4. **Unit Economics & Financial Sandbox**:
   - Interactive slider-driven calculator: Fixed Costs, Unit Price, Cost of Goods Sold, Expected Sales, and Cash Cushion. Real-time visual break-even chart and cashflow runway forecast.
5. **Venture Dossier & Export**:
   - Clean preview panel to print or download the complete business plan, financial projection, and grant application checklist.

#### Visual Identity & Theme
- **Aesthetic Direction**: Warm editorial luxury with civic empowerment. Feels like an exquisite literary journal combined with a modern venture studio.
- **Color Palette**:
  - *Dominant Canvas (60%)*: Warm Linen (`#FDFBF7`) with subtle parchment cards (`#F7F3EB`).
  - *Structural Surfaces (30%)*: Muted Almond (`#EFE8DC`), hairline dividers (`#E4DCD0`), and Deep Espresso Text (`#1C1917` / `#292524`).
  - *Accent Budget (10%)*: Terracotta Coral (`#E05D44`) for primary calls to action and active states, balanced with Champagne Gold (`#C8963E`) highlights and Forest Sage (`#2E6953`) for positive financial/grant status indicators.
- **Typography & Scale**:
  - *Display Headings*: `Playfair Display` or `Fraunces` editorial serif for impactful, confident headlines with balanced text wrap.
  - *Body & UI Controls*: `Plus Jakarta Sans` for clean, highly legible forms and navigation.
  - *Financial & Metric Values*: Tabular numerals (`tabular-nums font-mono`) for precision alignment in grant deadlines and financial projections.
- **Component Styling & Layout**:
  - Clean top bar following the 3-Zone Contract (`[Astraea wordmark] — [Nav: Blueprint Builder, Grants, Financials, SDG Impact] — [Start Business Plan CTA]`).
  - Zero-pill metadata discipline: unboxed text separated by `·` dots.
  - Generous outer padding ($24\text{px}$–$32\text{px}$) and single-level elevation with crisp hairline borders.

---

### 3. Key Product Decisions & Trade-Offs

- **Server-Side Gemini API via Express**:
  - *Decision*: Host Gemini 3.8 Flash calls on server-side Express routes (`/api/generate-plan`, `/api/match-grant`) using the `@google/genai` SDK with `httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }`.
  - *Why*: Complies strictly with security standards (zero API keys on the client) while delivering responsive, rich streaming or structured generation.
  - *Resilience*: Include pre-configured high-quality starter templates and heuristic fallbacks so the app works seamlessly even if offline or if API quotas fluctuate.
- **Client Persistence via Local Storage**:
  - *Decision*: Save venture drafts, generated plans, financial calculations, and bookmarked grants in browser `localStorage`.
  - *Why*: Allows entrepreneurs to draft, iterate, and return over multiple sessions without demanding immediate database sign-ins or personal account friction.
- **Curated Real Grants Database with AI Gap Analysis**:
  - *Decision*: Ground the grant finder in a verified, comprehensive database of real women-centric grants (Amber Grant, Cartier Women's Initiative, IFundWomen, Eileen Fisher Women-Owned Business Grant, etc.), enhanced by Gemini to critique pitch readiness.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Astraea Client (React 19)                       │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────┐ │
│  │ AI Plan Studio Wizard │  │ Grant & Capital Engine│  │ Financials  │ │
│  │ (Multi-step intake)   │  │ (Filter, search, match│  │ & Runway    │ │
│  └───────────┬───────────┘  └───────────┬───────────┘  └──────┬──────┘ │
│              │                          │                     │        │
│              ▼                          ▼                     ▼        │
│     ┌───────────────────────────────────────────────────────────┐      │
│     │   Venture State Store (Active Plan, Bookmarks, Metrics)   │      │
│     │               (Persisted to LocalStorage)                 │      │
│     └───────────────────────────┬───────────────────────────────┘      │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │ POST /api/generate-plan
                                  │ POST /api/evaluate-grant
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Express Backend (Node.js)                        │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Google GenAI Client (@google/genai - gemini-3.8-flash)           │  │
│  │ - Structured business model synthesis                            │  │
│  │ - Grant application readiness scoring & advice                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Key Components
1. `Navbar.tsx`: Strict 3-zone header with brand mark, view switcher tabs, and "New Venture" action.
2. `HeroSection.tsx`: Editorial introduction, SDG 5 target highlights, and quick venture start triggers.
3. `PlanBuilder.tsx`: 4-step interactive guided wizard with quick suggestion pills, customizable inputs, real-time Gemini generation, section-by-section editing, and print/export formatting.
4. `GrantMatcher.tsx`: Rich grant directory with category tags, amount badges, deadlines, direct application guidance, and AI eligibility scoring.
5. `FinancialSimulator.tsx`: Break-even modeler, working capital estimator, and monthly runway calculator with dynamic visual meters.
6. `SdgImpactBadge.tsx`: SDG 5 gender equality score card showing concrete target contributions (5.5, 5.a, 5.b).
7. `VentureDossierModal.tsx`: Comprehensive read-only and printable view of the completed founder pack.
