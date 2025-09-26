# Beacon – Agentic Revenue Demo

Beacon is a Next.js demo application that showcases a suite of offline-first agentic copilots for revenue teams. Each core agent executes a mock multi-step workflow (Plan → Gather → Analyze → Recommend → Draft/Act), streams trace logs, and surfaces KPIs and artifacts based on JSON fixtures served through local API routes.

## Getting started

```bash
pnpm install
pnpm dev
```

The development server runs at [http://localhost:3000](http://localhost:3000). All data is local so the experience works fully offline.

### Production build

```bash
pnpm build
```

> **Note**
> In locked-down environments without access to the public npm registry you may see 403 errors when installing dependencies such as `framer-motion`. Mirror the registry or pre-seed the `node_modules` directory before running the build.

## Core agents

| Agent | Vertical | Highlights |
| --- | --- | --- |
| Revenue Leakage | Quote-to-Cash | Leakage KPIs, anomaly table, recovery playbook |
| L2C Analytics | Operations | Stage duration insights, bottleneck notes |
| Account Hierarchy | Data/CRM | Hierarchy tree, duplicate merge suggestions |
| Market Research | Strategy | TAM bands, competitor battlecard, trigger signals |
| Cash & Collections | Finance | Aging dashboard, risk segments, outreach drafts |

Each agent can be re-run with deterministic filters. Trace logs stream step-by-step while KPIs and artifacts update from the corresponding API route.

## Project structure

```
app/               Next.js App Router pages & API routes
components/        UI components including agent runner, sidebar, KPIs
data/              JSON fixtures powering offline simulations
lib/               Agent metadata, runner utilities, local library shims
store/             React context for selected agent and run history
```

## Tech stack

- Next.js App Router + TypeScript + Tailwind CSS
- shadcn/ui-inspired components (local implementations)
- Local shims for `lucide-react`, `framer-motion`, `recharts`
- Mock data served through Next.js API routes (no external calls)

## Running tests & linting

```bash
pnpm lint
```

The lint command ensures TypeScript and ESLint checks pass for the demo.
