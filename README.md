# Home Improvement Cost Planner

Web app for homeowners to estimate project costs with:
- location-adjusted material pricing
- average labor costs by area
- selectable project options and upgrades
- budget range and contingency planning

## What is included

The app currently supports:
- Sliding patio door replacement
- Window replacement bundles
- Bathroom tile remodels

For each project, users can choose quality tier, materials/performance packages, optional upgrades, quantity, and location. The estimator provides:
- detailed material/labor/permit/tax breakdown
- low/high range estimate
- supplier price comparison
- practical homeowner recommendations

## Run locally

Prerequisites:
- Node.js 20+ (Node 22 tested)

Install and start:

1. `cd app`
2. `npm install`
3. `npm run dev`

Open the URL printed by Vite (typically `http://localhost:5173`).

## Quality checks

From `app/`:
- `npm run lint`
- `npm run build`
