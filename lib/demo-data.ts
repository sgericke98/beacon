import accountsData from "@/data/accounts.json";
import opportunitiesData from "@/data/opportunities.json";
import invoicesData from "@/data/invoices.json";
import paymentsData from "@/data/payments.json";
import customersData from "@/data/customers.json";
import marketSignals from "@/data/market/news_signals.json";

export type PersonaId = "cfo" | "cro" | "cio" | "financeOps" | "cs" | "exec";

export type AccountId = "globex" | "acme" | "initech";

export type TopTabId =
  | "overview"
  | "entities"
  | "agents"
  | "workflows"
  | "artifacts"
  | "deliverables"
  | "analytics"
  | "security"
  | "roadmap"
  | "settings";

export type BuyerPainId = "cash" | "pipeline" | "talent";

export type VerticalId =
  | "sales-marketing"
  | "quote-to-cash"
  | "post-sales"
  | "finance"
  | "strategy"
  | "data"
  | "operations"
  | "people"
  | "platform";

export interface PersonaProfile {
  id: PersonaId;
  label: string;
  title: string;
  headline: string;
  focusAreas: string[];
  heroStats: { label: string; value: string; delta: string }[];
  quickActions: { label: string; description: string }[];
}

export interface AccountContext {
  id: AccountId;
  name: string;
  industry: string;
  region: string;
  logoText: string;
  summary: string;
  constraints: {
    budget: string;
    timeline: string;
    staffing: string;
    riskTolerance: string;
  };
  baseline: {
    leakage: number;
    cycleTime: number;
    margin: number;
  };
  target: {
    leakage: number;
    cycleTime: number;
    margin: number;
  };
  timeToValue: { milestone: string; timeframe: string }[];
  deliverables: string[];
}

export interface TopTabDefinition {
  id: TopTabId;
  label: string;
  description: string;
}

export interface VerticalDefinition {
  id: VerticalId;
  label: string;
  description: string;
  marqueeMetric: string;
}

export interface GoldenPathStep {
  id: string;
  label: string;
  description: string;
  impact: string;
  output: string;
}

export interface BuyerPainDefinition {
  id: BuyerPainId;
  label: string;
  question: string;
  relief: string;
  quantifiedImpact: string;
}

export interface ImpactMetric {
  label: string;
  before: string;
  after: string;
  delta: string;
}

export interface RoiBreakdown {
  driver: string;
  baseline: string;
  improved: string;
  credibility: string;
}

export interface AdoptionStat {
  label: string;
  value: string;
  sublabel?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  agents: string[];
  deliverable: string;
  governance: string;
}

export interface ArtifactSummary {
  id: string;
  title: string;
  summary: string;
  linkedEntities: string[];
  owner: string;
  lastRun: string;
}

export interface DeliverablePackItem {
  id: string;
  title: string;
  status: "Draft" | "Review" | "Approved" | "Sent";
  owner: string;
  due: string;
  description: string;
}

export interface AlertDefinition {
  id: string;
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  linkLabel: string;
  targetTab: TopTabId;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  blurb: string;
  features: string[];
  pilotEligible: boolean;
}

export interface CompetitiveRebuttal {
  objection: string;
  beaconResponse: string;
}

export interface CaseStudy {
  logo: string;
  name: string;
  headline: string;
  impact: string;
}

export interface ExtensionDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const personaProfiles: PersonaProfile[] = [
  {
    id: "cfo",
    label: "CFO",
    title: "Chief Financial Officer",
    headline: "Show me provable ROI and compliance confidence.",
    focusAreas: ["Cash acceleration", "DSO reduction", "Risk management"],
    heroStats: [
      { label: "Leakage clawed back", value: "$240K", delta: "▲ 12%" },
      { label: "DSO", value: "38 days", delta: "▼ 9 days" },
    ],
    quickActions: [
      { label: "Export integrity report", description: "Send compliance-ready summary to auditors." },
      { label: "Review ROI model", description: "Toggle baseline vs custom assumptions." },
    ],
  },
  {
    id: "cro",
    label: "CRO",
    title: "Chief Revenue Officer",
    headline: "Where can I hit number faster with less friction?",
    focusAreas: ["Pipeline health", "Win rates", "SOW automation"],
    heroStats: [
      { label: "Cycle time", value: "27% faster", delta: "▲ 8pts" },
      { label: "Win rate uplift", value: "+6 pts", delta: "▲ 6pts" },
    ],
    quickActions: [
      { label: "Launch next best play", description: "Trigger Opportunity Matchmaker for EMEA." },
      { label: "Inspect forecast consistency", description: "Run delta check across CRM + ERP." },
    ],
  },
  {
    id: "cio",
    label: "CIO",
    title: "Chief Information Officer",
    headline: "Prove we can trust and extend Beacon securely.",
    focusAreas: ["Integrations", "Data governance", "Extensibility"],
    heroStats: [
      { label: "Systems connected", value: "12", delta: "▲ 4" },
      { label: "Admin time saved", value: "18 hrs/week", delta: "▼ 45%" },
    ],
    quickActions: [
      { label: "Review OAuth posture", description: "Preview Salesforce & NetSuite mock OAuth." },
      { label: "Open extensions catalog", description: "See MCP agents and SDK doc." },
    ],
  },
  {
    id: "financeOps",
    label: "Finance Ops",
    title: "Finance Operations Lead",
    headline: "Give me automated guardrails and reconciliations.",
    focusAreas: ["Quote-to-cash", "Collections", "Variance analysis"],
    heroStats: [
      { label: "Touchless invoices", value: "78%", delta: "▲ 22pts" },
      { label: "AR aged >90", value: "▼ 3 accounts", delta: "▼ 28%" },
    ],
    quickActions: [
      { label: "Launch Collections Copilot", description: "Tackle 3 invoices >90 days." },
      { label: "Review ERP sync", description: "Check freshness & export state." },
    ],
  },
  {
    id: "cs",
    label: "CS", // Customer Success
    title: "Head of Customer Success",
    headline: "Let&apos;s keep accounts healthy and primed for expansion.",
    focusAreas: ["Renewals", "Adoption", "Signals"],
    heroStats: [
      { label: "Accounts with playbooks", value: "94%", delta: "▲ 15pts" },
      { label: "Churn risk down", value: "-18%", delta: "▼ 18%" },
    ],
    quickActions: [
      { label: "Review churn early warnings", description: "See signals for Globex EU rollout." },
      { label: "Share deliverable pack", description: "Send SOW + adoption plan to CS leaders." },
    ],
  },
  {
    id: "exec",
    label: "Exec",
    title: "CEO / ELT",
    headline: "How does Beacon move the enterprise needle?",
    focusAreas: ["Cross-functional leverage", "Time-to-value", "Enterprise readiness"],
    heroStats: [
      { label: "Time to first outcome", value: "8 days", delta: "▼ 3 days" },
      { label: "Teams active", value: "7 of 8", delta: "▲ 2" },
    ],
    quickActions: [
      { label: "Open exec summary", description: "Review the business impact scoreboard." },
      { label: "Scope pilot", description: "Move to client-ready next steps." },
    ],
  },
];

export const accountContexts: AccountContext[] = [
  {
    id: "globex",
    name: "Globex International",
    industry: "Manufacturing",
    region: "EMEA",
    logoText: "GLX",
    summary: "Preparing an EU expansion while juggling long legal cycles and cash pressure.",
    constraints: {
      budget: "$350K pilot cap",
      timeline: "Go-live in 60 days",
      staffing: "2 FTE enablement",
      riskTolerance: "Medium – compliance sensitive",
    },
    baseline: { leakage: 0.12, cycleTime: 92, margin: 0.46 },
    target: { leakage: 0.04, cycleTime: 67, margin: 0.52 },
    timeToValue: [
      { milestone: "Week 1", timeframe: "Golden Path rehearsal & data sync" },
      { milestone: "Week 2", timeframe: "Collections + CRM copilots live" },
      { milestone: "Week 4", timeframe: "SOW + ROI review with CFO" },
    ],
    deliverables: ["Integrity report", "SOW draft", "Adoption analytics", "30-60-90 plan"],
  },
  {
    id: "acme",
    name: "Acme Holdings",
    industry: "Enterprise SaaS",
    region: "North America",
    logoText: "AC",
    summary: "Scaling volume deal desk and needing better approvals orchestration.",
    constraints: {
      budget: "$250K phase budget",
      timeline: "Quarter-end impact",
      staffing: "RevOps pod + IT architect",
      riskTolerance: "High – innovation mandate",
    },
    baseline: { leakage: 0.08, cycleTime: 81, margin: 0.54 },
    target: { leakage: 0.03, cycleTime: 60, margin: 0.6 },
    timeToValue: [
      { milestone: "Week 1", timeframe: "Deal desk co-design" },
      { milestone: "Week 3", timeframe: "Approval guardrails live" },
      { milestone: "Week 6", timeframe: "Quote-to-cash telemetry" },
    ],
    deliverables: ["Deal velocity pack", "AI governance brief", "Change management toolkit"],
  },
  {
    id: "initech",
    name: "Initech",
    industry: "Fintech",
    region: "North America",
    logoText: "IN",
    summary: "Managing multi-tenant data with strict security requirements.",
    constraints: {
      budget: "$500K enterprise budget",
      timeline: "Phased – 90 day rollout",
      staffing: "Platform squad + security lead",
      riskTolerance: "Low – regulated",
    },
    baseline: { leakage: 0.1, cycleTime: 88, margin: 0.48 },
    target: { leakage: 0.05, cycleTime: 68, margin: 0.55 },
    timeToValue: [
      { milestone: "Week 2", timeframe: "Security posture & audit" },
      { milestone: "Week 5", timeframe: "ERP/CRM harmonization" },
      { milestone: "Week 8", timeframe: "Global rollouts + training" },
    ],
    deliverables: ["Security readiness pack", "Integration blueprint", "Adoption training plan"],
  },
];

export const topTabs: TopTabDefinition[] = [
  { id: "overview", label: "Overview", description: "Golden Path narrative and impact" },
  { id: "entities", label: "Entities", description: "Accounts, opportunities, and projects" },
  { id: "agents", label: "Agents", description: "Multi-vertical agent catalog" },
  { id: "workflows", label: "Workflows", description: "Connected automations and governance" },
  { id: "artifacts", label: "Artifacts", description: "Traceable outputs and assets" },
  { id: "deliverables", label: "Deliverables", description: "Client-ready package" },
  { id: "analytics", label: "Analytics", description: "Adoption, usage, and health" },
  { id: "security", label: "Security & Compliance", description: "Trust, privacy, and control" },
  { id: "roadmap", label: "Roadmap", description: "Future-proof platform investments" },
  { id: "settings", label: "Settings", description: "Demo controls and configuration" },
];

export const verticals: VerticalDefinition[] = [
  { id: "sales-marketing", label: "Sales & Marketing", description: "Drive demand and engagement", marqueeMetric: "+18% MQAs" },
  { id: "quote-to-cash", label: "Quote-to-Cash", description: "Automate deal velocity", marqueeMetric: "27% faster" },
  { id: "post-sales", label: "Post-Sales", description: "Protect and expand revenue", marqueeMetric: "-18% churn" },
  { id: "finance", label: "Finance", description: "Cash, controls, and forecasting", marqueeMetric: "$240K saved" },
  { id: "strategy", label: "Strategy", description: "Signal synthesis and planning", marqueeMetric: "9 days faster" },
  { id: "data", label: "Data", description: "Unified schema and hygiene", marqueeMetric: "98% data trust" },
  { id: "operations", label: "Operations", description: "Cross-functional orchestration", marqueeMetric: "45% less toil" },
  { id: "people", label: "People", description: "Talent and enablement", marqueeMetric: "Onboard in 4 days" },
  { id: "platform", label: "Platform (ERP/CRM)", description: "Extensible foundation", marqueeMetric: "12 connectors" },
];

export const goldenPath: GoldenPathStep[] = [
  {
    id: "crm-copilot",
    label: "CRM Copilot",
    description: "Beacon triages Globex pipeline, redlines data hygiene, and surfaces EU-ready accounts.",
    impact: "Cleans 120 opp records and highlights $1.2M at-risk.",
    output: "Annotated account readiness report",
  },
  {
    id: "matchmaker",
    label: "Opportunity Matchmaker",
    description: "Clusters ICP fits, matches products, and assembles mutual action plans.",
    impact: "Boosts win probability by 6 points with pre-approved bundles.",
    output: "Next best play matrix",
  },
  {
    id: "sow-builder",
    label: "SOW Builder",
    description: "Drafts a blended team statement of work with pricing guardrails and approvals.",
    impact: "Cuts legal review cycle by 8 days with clause lineage.",
    output: "SOW draft + approval route",
  },
  {
    id: "erp-copilot",
    label: "ERP Copilot",
    description: "Aligns NetSuite data, reconciles pricing, and preps invoicing.",
    impact: "Prevents $240K leakage via guardrails and auto-reviews.",
    output: "Integrity report + export-ready payload",
  },
  {
    id: "deliverable-pack",
    label: "Deliverable Pack",
    description: "Packages executive summary, ROI model, and 30-60-90 adoption plan.",
    impact: "Hands the ELT a client-ready decision pack in minutes.",
    output: "Exec-ready deliverable hub",
  },
];

export const buyerPains: BuyerPainDefinition[] = [
  {
    id: "cash",
    label: "Cash Flow",
    question: "How do we accelerate cash without adding headcount?",
    relief: "Collections Copilot auto-segments risk and drafts outreach for aging invoices.",
    quantifiedImpact: "$240K leakage addressed and DSO improved by 9 days.",
  },
  {
    id: "pipeline",
    label: "Pipeline",
    question: "Where do we find qualified pipeline fast?",
    relief: "Opportunity Matchmaker surfaces EU-ready accounts and bundles.",
    quantifiedImpact: "+$3.1M pipeline influenced with 27% faster cycles.",
  },
  {
    id: "talent",
    label: "Talent",
    question: "Can we scale without burning out teams?",
    relief: "Agent race automation handles the heavy lifting while approvals stay governed.",
    quantifiedImpact: "18 hrs/week given back to RevOps and CS teams.",
  },
];

export const impactMetrics: ImpactMetric[] = [
  { label: "Revenue Leakage", before: "$320K exposed", after: "$80K residual", delta: "▼ $240K" },
  { label: "Sales Cycle", before: "92 days", after: "67 days", delta: "▼ 27%" },
  { label: "Margin", before: "46%", after: "52%", delta: "▲ 6pts" },
  { label: "Team Hours Saved", before: "-", after: "18 hrs/week", delta: "▲" },
];

export const roiBreakdown: RoiBreakdown[] = [
  {
    driver: "Leakage prevention",
    baseline: "Industry avg 8% leakage",
    improved: "Beacon guardrails cut to 2%",
    credibility: "Benchmarked vs Forrester QTC study",
  },
  {
    driver: "Cycle acceleration",
    baseline: "Stage hand-offs manual",
    improved: "Workflow automation compresses cycle",
    credibility: "Based on Globex pilot data",
  },
  {
    driver: "Talent leverage",
    baseline: "Manual SOW + approvals",
    improved: "Co-drafted deliverables and auto approvals",
    credibility: "Ops survey (n=48) on time savings",
  },
];

export const adoptionStats: AdoptionStat[] = [
  { label: "Active users", value: "146", sublabel: "+18 vs last week" },
  { label: "Teams onboarded", value: "7", sublabel: "Sales, Finance, CS, Ops" },
  { label: "Runs this month", value: "812", sublabel: "↑ 32%" },
  { label: "Deliverables shared", value: "64", sublabel: "Exec-ready" },
];

export const workflows: WorkflowDefinition[] = [
  {
    id: "golden-path",
    name: "Globex EU Expansion",
    description: "Connected CRM → Finance workflow following the guided narrative.",
    agents: ["CRM Copilot", "Opportunity Matchmaker", "SOW Builder", "ERP Copilot", "Collections Copilot"],
    deliverable: "Executive decision pack",
    governance: "Approval gates at SOW draft + ERP export",
  },
  {
    id: "collections-push",
    name: "Collections Recovery",
    description: "Alerts finance when invoices age past 90 days and triggers outreach drafts.",
    agents: ["Collections Copilot", "Risk Segmenter", "Outreach Drafter"],
    deliverable: "Ready-to-send collections kit",
    governance: "Finance Ops review before send",
  },
  {
    id: "market-brief",
    name: "Competitive Brief",
    description: "Synthesizes market signals into exec-ready battlecards.",
    agents: ["Market Research Agent", "Competitive Analyst", "Win Play Generator"],
    deliverable: "Market insight pack",
    governance: "Product marketing approval",
  },
  {
    id: "talent-acceleration",
    name: "CS Enablement",
    description: "Links onboarding agents with enablement content and alerts.",
    agents: ["Onboarding Copilot", "Pulse Synthesizer", "Skills Matrix"],
    deliverable: "90-day adoption dashboard",
    governance: "People Ops sign-off",
  },
];

export const artifacts: ArtifactSummary[] = [
  {
    id: "artifact-exec-summary",
    title: "Executive Summary – Globex EU",
    summary: "Beacon quantified leakage, cycle acceleration, and drafted SOW for approval.",
    linkedEntities: ["Account: Globex", "Opportunity: Globex Renewal", "Project: EU Launch"],
    owner: "Exec Persona",
    lastRun: "Today, 09:20",
  },
  {
    id: "artifact-integrity",
    title: "Integrity Report",
    summary: "ERP Copilot validated pricing, tax, and export payloads for NetSuite.",
    linkedEntities: ["Invoice: INV-104", "Project: ERP Rollout"],
    owner: "Finance Ops",
    lastRun: "Today, 08:05",
  },
  {
    id: "artifact-market",
    title: "Market Trigger Brief",
    summary: "Market Research Agent tracked competitor launch with recommended plays.",
    linkedEntities: ["MarketSignal: MS-22", "Account: Globex"],
    owner: "Strategy",
    lastRun: "Yesterday, 16:41",
  },
  {
    id: "artifact-adoption",
    title: "30-60-90 Adoption Plan",
    summary: "Change enablement milestones tailored for Finance + Sales leads.",
    linkedEntities: ["Project: Adoption Plan"],
    owner: "People Ops",
    lastRun: "Yesterday, 11:15",
  },
];

export const deliverablePack: DeliverablePackItem[] = [
  {
    id: "deliverable-sow",
    title: "SOW Draft – Globex EU Expansion",
    status: "Review",
    owner: "Deal Desk",
    due: "Jun 18",
    description: "Blended team of 3 consultants + 2 CS specialists with pricing guardrails.",
  },
  {
    id: "deliverable-integrity",
    title: "Integrity Report",
    status: "Approved",
    owner: "Finance Ops",
    due: "Jun 12",
    description: "ERP Copilot validated 100% of contract line items and sync readiness.",
  },
  {
    id: "deliverable-adoption",
    title: "30-60-90 Adoption Plan",
    status: "Draft",
    owner: "Enablement",
    due: "Jun 15",
    description: "Sequenced onboarding, training, and value realization checkpoints.",
  },
  {
    id: "deliverable-exec",
    title: "Executive Summary",
    status: "Sent",
    owner: "Exec Sponsor",
    due: "Jun 10",
    description: "Includes ROI model, before/after scoreboard, and CTA.",
  },
];

export const alerts: AlertDefinition[] = [
  {
    id: "alert-invoices",
    title: "Globex has 3 invoices >90 days",
    description: "Collections Copilot staged outreach drafts for review.",
    severity: "warning",
    linkLabel: "Open Collections Copilot",
    targetTab: "workflows",
  },
  {
    id: "alert-competitor",
    title: "Competitor launched EU bundle",
    description: "Market Research Agent published a rebuttal brief.",
    severity: "info",
    linkLabel: "View Market Brief",
    targetTab: "artifacts",
  },
  {
    id: "alert-governance",
    title: "Approval pending on SOW draft",
    description: "Need CRO sign-off before sending to Globex.",
    severity: "critical",
    linkLabel: "Review approval gate",
    targetTab: "deliverables",
  },
];

export const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$5K/mo",
    blurb: "Perfect for RevOps pods kicking off automation.",
    features: ["Up to 5 agents", "2 system connectors", "Guided workflows"],
    pilotEligible: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$12K/mo",
    blurb: "Scale to multi-team orchestration and analytics.",
    features: ["Unlimited guided workflows", "Advanced analytics", "Audit exports"],
    pilotEligible: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    blurb: "Global multi-tenant deployments with security controls.",
    features: ["Air-gapped deployments", "Dedicated success", "Extensibility SDK"],
    pilotEligible: false,
  },
];

export const rebuttals: CompetitiveRebuttal[] = [
  {
    objection: "Salesforce Einstein already covers this.",
    beaconResponse:
      "Einstein is single-player per object. Beacon choreographs agents across CRM + ERP with shared schema and deliverables.",
  },
  {
    objection: "We worry about hallucinated ROI numbers.",
    beaconResponse:
      "All metrics trace back to fixtures, baselines, and provenance cards with downloadable audit trails.",
  },
  {
    objection: "Will teams actually adopt it?",
    beaconResponse:
      "Analytics tab tracks active users, approvals, and deliverable sends. Learning center drives 30-60-90 adoption.",
  },
];

export const caseStudies: CaseStudy[] = [
  { logo: "/logos/globex.svg", name: "Globex", headline: "27% faster quote-to-cash", impact: "Scaled EU launch with AI guardrails." },
  {
    logo: "/logos/acme.svg",
    name: "Acme",
    headline: "DSO down 11 days",
    impact: "Automated collections and pricing controls across business units.",
  },
  {
    logo: "/logos/initech.svg",
    name: "Initech",
    headline: "Unified data fabric",
    impact: "Mapped ERP + CRM in 3 weeks with Beacon schema.",
  },
];

export const partners = ["Deloitte", "Accenture", "Slalom", "PwC Catalyst"];

export const extensions: ExtensionDefinition[] = [
  { id: "mcp-solver", name: "Beacon MCP Solver", category: "MCP Agent", description: "Connect your custom MCP agents with workspace context." },
  { id: "webhooks", name: "Workflow Webhooks", category: "Automation", description: "Trigger downstream systems on agent completion." },
  { id: "api-vault", name: "API Key Vault", category: "Security", description: "Rotate and manage secrets centrally." },
  { id: "slack", name: "Slack Connector", category: "Collaboration", description: "(Roadmap) Post approvals and alerts into Slack." },
];

export const adoptionPlan = [
  { phase: "Day 0", focus: "Kickoff & golden path alignment" },
  { phase: "30 Days", focus: "Quote-to-cash + finance copilots live" },
  { phase: "60 Days", focus: "Post-sales + analytics expansion" },
  { phase: "90 Days", focus: "Enterprise enablement & hand-off" },
];

export const systemHealth = {
  uptime: "99.95%",
  concurrentRuns: 48,
  errorRate: "0.4%",
  tenants: 10,
  lastIncident: "92 days ago",
};

export const multiTenantSample = [
  { account: "Globex", runsToday: 42, status: "Healthy" },
  { account: "Acme", runsToday: 37, status: "Syncing" },
  { account: "Initech", runsToday: 28, status: "Healthy" },
  { account: "Umbra", runsToday: 21, status: "Watch" },
  { account: "Wayne", runsToday: 18, status: "Healthy" },
  { account: "Stark", runsToday: 32, status: "Healthy" },
  { account: "Wonka", runsToday: 16, status: "Attention" },
  { account: "Gringotts", runsToday: 24, status: "Healthy" },
  { account: "Wonolo", runsToday: 19, status: "Healthy" },
  { account: "Vandelay", runsToday: 11, status: "Healthy" },
];

export const learningCenterResources = [
  { title: "Guided tour", type: "Video", duration: "4 min" },
  { title: "Golden Path checklist", type: "Checklist", duration: "8 steps" },
  { title: "Security readiness", type: "Brief", duration: "5 min" },
  { title: "Workflow builder 101", type: "Playbook", duration: "15 min" },
];

export const competitorMatrix = [
  { vendor: "Beacon", automation: "Multi-agent", governance: "Native", deliverables: "Exec-ready", extensibility: "MCP + SDK" },
  { vendor: "Einstein", automation: "Single-object", governance: "Basic", deliverables: "Slides", extensibility: "Closed" },
  { vendor: "Clari", automation: "Forecast", governance: "Light", deliverables: "Dashboards", extensibility: "API" },
];

export const explainability = {
  whyThis: "CRM Copilot prioritized Globex EU because of recent product launches + aging invoices.",
  provenance: ["CRM: Opportunity OP-002 (refreshed 2h ago)", "ERP: Invoice INV-104 (synced 1h ago)", "Market: Signal MS-22 (yesterday)"],
};

export const sdkSnippet = `import { registerAgent } from "@beacon/sdk";

registerAgent({
  id: "pricing-guardrail",
  triggers: ["quote.approval"],
  inputSchema: "Quote", // aligned with Beacon unified model
  run(context) {
    const guardrails = context.workspace.constraints;
    return context.respond({
      recommendation: "Flag discount over 25%",
      approvers: ["Finance Ops", "Deal Desk"],
    });
  },
});`;

export const workspaceInsights = {
  accounts: accountsData,
  opportunities: opportunitiesData,
  invoices: invoicesData,
  payments: paymentsData,
  customers: customersData,
  marketSignals,
};

