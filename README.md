# Agent Assurance: live demo

Static Vite + React app. No backend, no API keys, no environment variables. All data is synthetic and generated in the browser, so it cannot fail on stage.

The client ("Meridian Group") is fictional and anonymised.

## Deploy to Vercel (via GitHub)

1. On github.com create a new empty private repo.
2. Unzip this project. In the repo click **Add file → Upload files**, drag in the *contents* of the folder (not the folder itself), commit. Do not upload `node_modules` or `dist` if they are present.
3. In Vercel: **Add New → Project**, import the repo, click **Deploy**. Vercel detects Vite automatically (build `npm run build`, output `dist`).
4. Later changes: re-upload the changed files to GitHub and Vercel redeploys on its own.

## Run locally

```
npm install
npm run dev
```

## Screens

- **Dashboard**: KPIs, coverage by lifecycle phase, trend across the lifecycle, open findings by OWASP Agentic Top 10 category, region × department heat map (click a cell to open those agents).
- **Agents**: tracker filterable by region, department, status and search. Click a row for the agent detail panel.
- **Map**: world map with 11 offices, pulses for live events, per-office focus and a live activity feed.
- **Journey**: Day 1 → Discover → Exposure map → Secure → Assure → Standard operation → Audit and re-assessment. **Play the story** auto-advances; the Dashboard, Agents and Map follow the selected stage. At the Audit stage an illustrative decision-path reconstruction appears.
- A live ticker runs along the bottom of every screen.

## Stage demo tips

- Open on Dashboard (live view, standard operation), then go to Journey and press **Play the story**: the estate fills in from empty.
- Switch to Dashboard mid-play to show the numbers moving. A banner offers a one-click return to live view.

## Editing the content

Everything lives in `src/data.js`: client name, offices, departments, agent templates, stage copy and deliverables. The OWASP labels follow the official Top 10 for Agentic Applications (ASI01 to ASI10).

## Notes

- Numbers are illustrative. Do not present them as results from a real client.
- To use the official Modus Create logo, add `public/logo.svg` and swap the `.mark` element in `src/App.jsx` for an `<img>`.
