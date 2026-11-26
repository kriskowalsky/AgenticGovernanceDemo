// Synthetic, fully fictional estate. No real client data.
export const CLIENT = 'Meridian Group'
export const CLIENT_NOTE = 'Fictional, anonymised global enterprise'

// OWASP Top 10 for Agentic Applications (Dec 2025)
export const OWASP = [
  { id: 'ASI01', name: 'Agent Goal Hijack' },
  { id: 'ASI02', name: 'Tool Misuse' },
  { id: 'ASI03', name: 'Identity & Privilege Abuse' },
  { id: 'ASI04', name: 'Agentic Supply Chain' },
  { id: 'ASI05', name: 'Unexpected Code Execution' },
  { id: 'ASI06', name: 'Memory & Context Poisoning' },
  { id: 'ASI07', name: 'Insecure Inter-Agent Comms' },
  { id: 'ASI08', name: 'Cascading Failures' },
  { id: 'ASI09', name: 'Human-Agent Trust Exploitation' },
  { id: 'ASI10', name: 'Rogue Agents' },
]

export const REGIONS = ['North America', 'LATAM', 'UK & Ireland', 'EMEA', 'APAC']

export const OFFICES = [
  { id: 'nyc', city: 'New York', region: 'North America', lon: -74.0, lat: 40.7 },
  { id: 'tor', city: 'Toronto', region: 'North America', lon: -79.4, lat: 43.7 },
  { id: 'sao', city: 'São Paulo', region: 'LATAM', lon: -46.6, lat: -23.5 },
  { id: 'lon', city: 'London', region: 'UK & Ireland', lon: -0.1, lat: 51.5 },
  { id: 'dub', city: 'Dublin', region: 'UK & Ireland', lon: -6.3, lat: 53.3 },
  { id: 'fra', city: 'Frankfurt', region: 'EMEA', lon: 8.7, lat: 50.1 },
  { id: 'dxb', city: 'Dubai', region: 'EMEA', lon: 55.3, lat: 25.2 },
  { id: 'bom', city: 'Mumbai', region: 'APAC', lon: 72.9, lat: 19.1 },
  { id: 'sin', city: 'Singapore', region: 'APAC', lon: 103.8, lat: 1.35 },
  { id: 'tyo', city: 'Tokyo', region: 'APAC', lon: 139.7, lat: 35.7 },
  { id: 'syd', city: 'Sydney', region: 'APAC', lon: 151.2, lat: -33.9 },
]

export const DEPARTMENTS = [
  'Finance', 'Engineering', 'Customer Support', 'Procurement',
  'HR', 'Legal & Compliance', 'R&D', 'Sales Ops', 'IT Operations',
]

// Seeded PRNG so the estate is identical on every load
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const rng = mulberry32(20261126)
const pick = (arr, r = rng) => arr[Math.floor(r() * arr.length)]

const TEMPLATES = {
  Finance: [
    ['invoice-reconciler', ['ERP', 'Bank API'], 'write'],
    ['payment-approver', ['Payments rail', 'ERP'], 'admin'],
    ['expense-auditor', ['Expense system', 'Email'], 'read'],
    ['treasury-forecaster', ['Data warehouse', 'Bank API'], 'read'],
    ['ledger-closer', ['ERP', 'Spreadsheet'], 'write'],
    ['fx-hedging-advisor', ['Market data', 'Treasury'], 'write'],
    ['audit-sampler', ['ERP', 'Document store'], 'read'],
  ],
  Engineering: [
    ['code-review-bot', ['Git', 'CI'], 'write'],
    ['infra-drift-fixer', ['Cloud API', 'Shell'], 'admin'],
    ['test-generator', ['Git', 'CI'], 'write'],
    ['dependency-updater', ['Git', 'Package registry'], 'write'],
    ['incident-summariser', ['Observability', 'Chat'], 'read'],
    ['release-coordinator', ['CI', 'Cloud API'], 'admin'],
    ['sast-triager', ['Git', 'CI'], 'read'],
  ],
  'Customer Support': [
    ['ticket-triage', ['Helpdesk', 'CRM'], 'write'],
    ['refund-processor', ['Payments rail', 'CRM'], 'admin'],
    ['knowledge-answerer', ['Knowledge base'], 'read'],
    ['churn-flagger', ['CRM', 'Data warehouse'], 'read'],
    ['escalation-router', ['Helpdesk', 'Chat'], 'write'],
    ['voice-summariser', ['Telephony', 'CRM'], 'read'],
    ['sentiment-scorer', ['CRM', 'Telephony'], 'read'],
  ],
  Procurement: [
    ['vendor-onboarder', ['Supplier portal', 'ERP'], 'write'],
    ['po-matcher', ['ERP', 'Email'], 'write'],
    ['contract-sourcer', ['CLM', 'Web'], 'read'],
    ['spend-classifier', ['ERP', 'Data warehouse'], 'read'],
    ['rfp-drafter', ['Document store', 'Web'], 'write'],
    ['supplier-risk-scorer', ['Web', 'Risk feed'], 'read'],
    ['invoice-dispute-handler', ['ERP', 'Email'], 'write'],
  ],
  HR: [
    ['resume-screener', ['ATS', 'Email'], 'read'],
    ['onboarding-concierge', ['HRIS', 'IT service desk'], 'write'],
    ['policy-answerer', ['Knowledge base', 'HRIS'], 'read'],
    ['payroll-anomaly-detector', ['Payroll', 'HRIS'], 'read'],
    ['leave-approver', ['HRIS'], 'write'],
    ['benefits-answerer', ['HRIS', 'Knowledge base'], 'read'],
  ],
  'Legal & Compliance': [
    ['contract-redliner', ['CLM', 'Document store'], 'write'],
    ['kyc-screener', ['KYC provider', 'CRM'], 'write'],
    ['regulatory-watcher', ['Web', 'Knowledge base'], 'read'],
    ['policy-attester', ['GRC platform', 'Email'], 'write'],
    ['e-discovery-sorter', ['Document store', 'Email'], 'admin'],
  ],
  'R&D': [
    ['literature-synthesiser', ['Web', 'Document store'], 'read'],
    ['protocol-drafter', ['ELN', 'Document store'], 'write'],
    ['data-pipeline-healer', ['Data lake', 'Shell'], 'admin'],
    ['assay-analyst', ['LIMS', 'Data lake'], 'write'],
    ['trial-site-matcher', ['Clinical DB', 'Web'], 'read'],
  ],
  'Sales Ops': [
    ['lead-qualifier', ['CRM', 'Email'], 'write'],
    ['forecast-agent', ['CRM', 'Data warehouse'], 'read'],
    ['quote-builder', ['CPQ', 'CRM'], 'write'],
    ['renewal-nudger', ['CRM', 'Email'], 'write'],
    ['territory-planner', ['CRM', 'Data warehouse'], 'read'],
  ],
  'IT Operations': [
    ['access-request-approver', ['IAM', 'IT service desk'], 'admin'],
    ['patch-orchestrator', ['MDM', 'Shell'], 'admin'],
    ['alert-deduplicator', ['Observability'], 'read'],
    ['asset-reconciler', ['CMDB', 'Cloud API'], 'write'],
    ['secrets-rotator', ['Vault', 'Cloud API'], 'admin'],
  ],
}

const FRAMEWORKS = ['LangGraph', 'Bedrock Agents', 'Copilot Studio', 'Custom (Python)', 'AutoGen', 'CrewAI', 'Vertex Agents']
const PRIV_RANK = { read: 1, write: 2, admin: 4 }

// Regional weighting so the map isn't uniform
const OFFICE_WEIGHTS = [
  ['nyc', 5], ['tor', 2], ['sao', 3], ['lon', 5], ['dub', 2], ['fra', 4],
  ['dxb', 2], ['bom', 4], ['sin', 3], ['tyo', 2], ['syd', 2],
]
function weightedOffice() {
  const total = OFFICE_WEIGHTS.reduce((s, [, w]) => s + w, 0)
  let r = rng() * total
  for (const [id, w] of OFFICE_WEIGHTS) { r -= w; if (r <= 0) return OFFICES.find(o => o.id === id) }
  return OFFICES[0]
}

function buildAgents() {
  const out = []
  let n = 1
  for (const dept of DEPARTMENTS) {
    for (const [name, tools, cred] of TEMPLATES[dept]) {
      const office = weightedOffice()
      const reach = Math.max(1, Math.round(tools.length * (1 + rng() * 3) + PRIV_RANK[cred]))
      const gated = rng() < 0.28
      // raw exposure before any hardening
      const exposure = Math.min(
        97,
        Math.round(14 + PRIV_RANK[cred] * 11 + reach * 2.6 + (gated ? -6 : 8) + rng() * 16),
      )
      const nFind = exposure > 70 ? 3 + Math.floor(rng() * 2) : exposure > 45 ? 2 : exposure > 30 ? 1 : 0
      const finds = new Set()
      while (finds.size < nFind) finds.add(pick(OWASP).id)
      out.push({
        id: 'AG-' + String(n++).padStart(4, '0'),
        name,
        dept,
        region: office.region,
        office: office.id,
        framework: pick(FRAMEWORKS),
        tools,
        credential: cred,
        reach,
        gatedByDefault: gated,
        exposure,
        findings: [...finds],
        shadow: rng() < 0.32, // not in any registry before Discover
        // each agent crosses phases at its own point in the stage window (0..1)
        t: rng(),
        activity: 0.3 + rng() * 0.7,
      })
    }
  }
  return out
}

export const AGENTS = buildAgents()

// ---- journey ---------------------------------------------------------------
export const STAGES = [
  {
    key: 'kickoff', short: 'Day 1', title: 'Kickoff and scoping', when: 'Day 1', phase: 'Pre-engagement',
    d: 0, s: 0, a: 0,
    client: 'Sponsor named, security and platform leads in the room. Nobody can produce a complete list of agents.',
    we: 'Agree scope, access method (read-only to start) and the frameworks to map against: OWASP Agentic Top 10, NIST AI RMF, ISO 42001.',
    deliverables: ['Statement of work and rules of engagement', 'Read-only access to cloud, IAM and repos', 'Named client owner for agents'],
    exit: 'Access granted. Scope signed. Clock starts.',
    kpiNote: 'Dashboard is empty on purpose. This is the baseline the client has today.',
  },
  {
    key: 'discover', short: 'Weeks 1–3', title: 'Discover', when: 'Weeks 1–3', phase: 'Discover',
    d: 1, s: 0, a: 0, rampD: true,
    client: 'Teams surprised by what turns up. Agents built by one team and forgotten, shared service accounts, a few nobody will claim.',
    we: 'Sweep repos, cloud, IAM, SaaS and network egress for agents. Record tools, credentials and reachable systems for each.',
    deliverables: ['Agent inventory', 'Tools and credentials per agent', 'Reachability map'],
    exit: 'Inventory reviewed with every department head.',
    kpiNote: 'Discovered count climbs. Shadow agents appear for the first time.',
  },
  {
    key: 'map', short: 'Week 4', title: 'Exposure map and priorities', when: 'Week 4', phase: 'Discover',
    d: 1, s: 0, a: 0, findings: 1,
    client: 'First honest view of risk. Findings ranked against OWASP Agentic Top 10. Leadership picks what gets fixed first.',
    we: 'Score every agent, rank findings, agree a remediation order with the CISO and platform owners.',
    deliverables: ['Ranked exposure map', 'Findings by OWASP category', 'Agreed remediation order'],
    exit: 'CISO signs the priority list.',
    kpiNote: 'All findings open. Risk is visible but nothing has been fixed yet.',
  },
  {
    key: 'secure', short: 'Weeks 5–10', title: 'Secure', when: 'Weeks 5–10', phase: 'Secure',
    d: 1, s: 1, a: 0, rampS: true, findings: 1,
    client: 'Engineering changes land in sprints. Some agents lose permissions and teams push back; approval gates appear on irreversible actions.',
    we: 'Scope authority to need, harden tool boundaries, enforce containment, add approval gates, turn on decision-path logging.',
    deliverables: ['Hardened permission model', 'Containment boundaries enforced', 'Approval gates on irreversible actions', 'Decision-path logging'],
    exit: 'Critical and high findings closed or formally accepted.',
    kpiNote: 'Open findings fall. Gated actions rise. Credential scopes shrink.',
  },
  {
    key: 'assure', short: 'Weeks 11–12', title: 'Assure', when: 'Weeks 11–12', phase: 'Assure',
    d: 1, s: 1, a: 1, rampA: true, findings: 0,
    client: 'Controls tested against the hardened estate. The client sees evidence, not assertions.',
    we: 'Test that controls hold, build the evidence pack, map to NIST AI RMF and ISO 42001, brief the board.',
    deliverables: ['Assurance report', 'Evidence pack', 'Framework mapping', 'Board briefing'],
    exit: 'Assurance report accepted by audit committee.',
    kpiNote: 'Assured coverage climbs. Audit readiness crosses the line.',
  },
  {
    key: 'run', short: 'Standard operation', title: 'Standard operation', when: 'Quarterly', phase: 'Operate',
    d: 1, s: 1, a: 1, findings: 0,
    client: 'New agents go through intake before they get credentials. Reviews happen on a calendar, not after an incident.',
    we: 'Run the agreed re-assessment cadence. Flag drift, new agents and permission creep between cycles.',
    deliverables: ['Agent intake process', 'Quarterly re-assessment', 'Drift report'],
    exit: 'Cadence agreed. Ownership sits with the client.',
    kpiNote: 'Steady state. Live activity is mostly allowed, with the occasional blocked action.',
  },
  {
    key: 'audit', short: 'Audit', title: 'Audit and re-assessment', when: 'Annual', phase: 'Operate',
    d: 1, s: 1, a: 1, findings: 0, audit: true,
    client: 'Auditor asks what an agent did on a given date and why. Client answers from the decision log, not from memory.',
    we: 'Provide the evidence pack, reconstruct decision paths on request, then re-run Discover to catch what changed.',
    deliverables: ['Evidence pack for auditor', 'Decision-path reconstruction', 'Refreshed inventory', 'Updated risk register'],
    exit: 'Audit closed. Loop returns to Discover.',
    kpiNote: 'Evidence requests answered from the log. New agents found since last cycle go back into the loop.',
  },
]

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))

// Per-agent lifecycle for a stage + progress (0..1 inside the stage)
export function agentState(agent, stageIdx, progress = 1) {
  const st = STAGES[stageIdx]
  const p = clamp(progress)
  const discovered = st.d === 0 ? false : st.rampD ? agent.t <= p : true
  const secured = st.s === 0 ? false : st.rampS ? agent.t <= p : true
  // in steady state ~12% of agents are new since the last cycle and not yet assured; a perfect score would look staged
  const newSinceCycle = (st.key === 'run' || st.key === 'audit') && agent.t > 0.88
  const assured = st.a === 0 ? false : st.rampA ? agent.t <= p : !newSinceCycle
  let status = 'Unknown'
  if (discovered) status = 'Discovered'
  if (secured) status = 'Secured'
  if (assured) status = 'Assured'
  // exposure after hardening
  const residual = secured ? Math.round(agent.exposure * (assured ? 0.2 : 0.38)) : agent.exposure
  // findings surface at the exposure-map stage; after Secure only a residual accepted-risk item remains on the worst agents
  let showFindings = []
  if (discovered && stageIdx >= 2) {
    showFindings = secured ? (agent.exposure >= 78 ? agent.findings.slice(0, 1) : []) : agent.findings
  }
  return {
    status,
    discovered, secured, assured,
    exposure: discovered ? residual : null,
    openFindings: showFindings,
    gated: secured ? agent.credential !== 'read' || agent.gatedByDefault : agent.gatedByDefault,
    credentialNow: secured && agent.credential === 'admin' ? 'write (scoped)' : secured && agent.credential === 'write' ? 'write (scoped)' : agent.credential,
  }
}

export function buildKpis(stageIdx, progress = 1) {
  const rows = AGENTS.map(a => ({ a, s: agentState(a, stageIdx, progress) }))
  const total = AGENTS.length
  const discovered = rows.filter(r => r.s.discovered).length
  const secured = rows.filter(r => r.s.secured).length
  const assured = rows.filter(r => r.s.assured).length
  const shadow = rows.filter(r => r.s.discovered && r.a.shadow).length
  const privileged = rows.filter(r => r.s.discovered && r.a.credential === 'admin' && !r.s.secured).length
  const gated = rows.filter(r => r.s.discovered && r.s.gated).length
  const openFindings = rows.reduce((n, r) => n + r.s.openFindings.length, 0)
  const critical = rows.filter(r => r.s.discovered && !r.s.secured && r.a.exposure >= 70).length
  const avgExposure = discovered
    ? Math.round(rows.filter(r => r.s.discovered).reduce((s, r) => s + r.s.exposure, 0) / discovered)
    : 0
  const st = STAGES[stageIdx]
  const audit = Math.round(clamp((assured / total) * 0.7 + (secured / total) * 0.25 + (discovered / total) * 0.05) * 100)
  const owaspCounts = Object.fromEntries(OWASP.map(o => [o.id, 0]))
  rows.forEach(r => r.s.openFindings.forEach(f => { owaspCounts[f]++ }))
  return {
    total, discovered, secured, assured, shadow, privileged, gated, openFindings, critical,
    avgExposure, audit, owaspCounts, stage: st, rows,
  }
}

// ---- live events -----------------------------------------------------------
export const EVENT_TYPES = {
  allow: { label: 'Action allowed', tone: 'ok', weight: 10 },
  block: { label: 'Action blocked', tone: 'bad', weight: 3 },
  gate: { label: 'Approval gate', tone: 'warn', weight: 3 },
  scope: { label: 'Scope reduced', tone: 'ok', weight: 1.4 },
  drift: { label: 'Drift detected', tone: 'warn', weight: 1.2 },
  newagent: { label: 'New agent found', tone: 'info', weight: 0.7 },
  evidence: { label: 'Evidence logged', tone: 'info', weight: 2.2 },
}

const VERBS = {
  allow: ['read ledger entries', 'summarised 14 tickets', 'opened pull request', 'queried data warehouse', 'matched 3 invoices to POs', 'drafted vendor reply'],
  block: ['attempted write outside approved system', 'tried to call unregistered tool', 'requested admin scope not on policy', 'attempted cross-region data export'],
  gate: ['refund above threshold awaiting human', 'production deploy awaiting approval', 'payment release awaiting approver', 'access grant awaiting owner'],
  scope: ['admin token narrowed to write', 'wildcard role replaced by 3 actions', 'shared key split per agent'],
  drift: ['new tool attached since last cycle', 'permission added outside intake', 'prompt template changed'],
  newagent: ['unregistered agent found in repo', 'agent found on SaaS marketplace app', 'service account behaving like an agent'],
  evidence: ['decision path recorded', 'approval chain sealed', 'control test passed'],
}

export function pickEventType(r, stageIdx) {
  const st = STAGES[stageIdx]
  if (st.d === 0) return null // Day 1: the client has no visibility yet, so there is no activity to show
  const keys = Object.keys(EVENT_TYPES)
  const w = keys.map(k => {
    let x = EVENT_TYPES[k].weight
    if (st.s === 0 && (k === 'gate' || k === 'scope' || k === 'evidence')) x = 0
    if (st.key === 'discover' && k === 'newagent') x *= 8
    if (st.key === 'secure' && (k === 'scope' || k === 'gate' || k === 'block')) x *= 2.5
    if (st.key === 'run' && k === 'drift') x *= 2
    if (st.audit && k === 'evidence') x *= 3
    if (st.audit && k === 'newagent') x *= 3
    if (st.s === 0 && k === 'block') x = 0
    return x
  })
  const sum = w.reduce((a, b) => a + b, 0)
  if (sum === 0) return null
  let t = r() * sum
  for (let i = 0; i < keys.length; i++) { t -= w[i]; if (t <= 0) return keys[i] }
  return keys[0]
}

let evSeq = 0
export function makeEvent(stageIdx, progress = 1, r = Math.random) {
  const type = pickEventType(r, stageIdx)
  if (!type) return null
  const pool = AGENTS.filter(a => agentState(a, stageIdx, progress).discovered || type === 'newagent')
  if (!pool.length) return null
  const agent = pool[Math.floor(r() * pool.length)]
  const office = OFFICES.find(o => o.id === agent.office)
  return {
    id: ++evSeq,
    type,
    tone: EVENT_TYPES[type].tone,
    label: EVENT_TYPES[type].label,
    agent: agent.name,
    agentId: agent.id,
    dept: agent.dept,
    office: office.id,
    city: office.city,
    region: agent.region,
    text: VERBS[type][Math.floor(r() * VERBS[type].length)],
    at: new Date(),
  }
}
