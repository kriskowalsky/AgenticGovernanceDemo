import { useMemo } from 'react'
import { useSim } from './sim'
import { AGENTS, DEPARTMENTS, OWASP, REGIONS, STAGES, buildKpis } from './data'
import { Card, Kpi, toneOf } from './ui'

const ADMIN_CAPABLE = AGENTS.filter((a) => a.credential === 'admin').length

function Trend({ stageIdx }) {
  const series = useMemo(
    () => STAGES.map((_, i) => {
      const k = buildKpis(i, 1)
      return { exposure: k.avgExposure, audit: k.audit }
    }),
    [],
  )
  const W = 640, H = 210, padL = 34, padR = 16, padT = 14, padB = 34
  const x = (i) => padL + (i * (W - padL - padR)) / (STAGES.length - 1)
  const y = (v) => padT + (1 - v / 100) * (H - padT - padB)
  const path = (key) => series.map((s, i) => `${i ? 'L' : 'M'}${x(i)},${y(s[key])}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="trend" role="img" aria-label="Average exposure and audit readiness across the lifecycle">
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={padL} x2={W - padR} y1={y(g)} y2={y(g)} className="grid" />
          <text x={padL - 8} y={y(g) + 4} textAnchor="end" className="axis">{g}</text>
        </g>
      ))}
      <line x1={x(stageIdx)} x2={x(stageIdx)} y1={padT} y2={H - padB} className="marker" />
      <path d={path('exposure')} className="ln ln-exp" />
      <path d={path('audit')} className="ln ln-aud" />
      {series.map((s, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(s.exposure)} r={i === stageIdx ? 5 : 3} className="dot dot-exp" />
          <circle cx={x(i)} cy={y(s.audit)} r={i === stageIdx ? 5 : 3} className="dot dot-aud" />
          <text x={x(i)} y={H - 12} textAnchor="middle" className={'axis' + (i === stageIdx ? ' on' : '')}>{STAGES[i].short.replace('Standard operation', 'Run')}</text>
        </g>
      ))}
    </svg>
  )
}

function Heat() {
  const { kpis, setFilters, setTab } = useSim()
  const cell = (region, dept) => {
    const rows = kpis.rows.filter((r) => r.a.region === region && r.a.dept === dept && r.s.discovered)
    if (!rows.length) return null
    const avg = Math.round(rows.reduce((s, r) => s + r.s.exposure, 0) / rows.length)
    return { n: rows.length, avg }
  }
  const go = (region, dept) => {
    setFilters({ region, dept, status: 'All', q: '' })
    setTab('agents')
  }
  return (
    <div className="heat-wrap">
      <table className="heat">
        <thead>
          <tr>
            <th />
            {DEPARTMENTS.map((d) => <th key={d}><span>{d}</span></th>)}
          </tr>
        </thead>
        <tbody>
          {REGIONS.map((r) => (
            <tr key={r}>
              <th scope="row">{r}</th>
              {DEPARTMENTS.map((d) => {
                const c = cell(r, d)
                return (
                  <td key={d}>
                    {c ? (
                      <button className={'hc t-' + toneOf(c.avg)} onClick={() => go(r, d)} title={`${c.n} agents · avg exposure ${c.avg}`}>
                        {c.n}
                      </button>
                    ) : <span className="hc empty" />}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="legend">
        <span><i className="t-ok" /> avg exposure under 45</span>
        <span><i className="t-warn" /> 45–69</span>
        <span><i className="t-bad" /> 70+</span>
        <span className="dim">Number = agents. Click a cell to open them.</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { kpis, stage, counts } = useSim()
  const st = kpis.stage
  const max = Math.max(1, ...Object.values(kpis.owaspCounts))
  const phases = [
    ['Unknown', kpis.total - kpis.discovered, 'unknown'],
    ['Discovered', kpis.discovered - kpis.secured, 'discovered'],
    ['Secured', kpis.secured - kpis.assured, 'secured'],
    ['Assured', kpis.assured, 'assured'],
  ]

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1>Estate overview</h1>
          <p className="dim">{st.title} · {st.kpiNote}</p>
        </div>
      </div>

      <div className="kpis">
        <Kpi label="Agents discovered" value={kpis.discovered} unit={` / ${kpis.total}`} pct={(kpis.discovered / kpis.total) * 100} sub={`${kpis.shadow} were in no registry`} />
        <Kpi label="Unconstrained admin agents" value={kpis.privileged} unit={` / ${ADMIN_CAPABLE}`} tone={kpis.privileged ? 'bad' : 'ok'} sub={kpis.privileged ? 'Standing admin credentials' : 'Admin scopes narrowed to need'} />
        <Kpi label="Agents behind approval gates" value={kpis.gated} unit={` / ${kpis.discovered || 0}`} pct={kpis.discovered ? (kpis.gated / kpis.discovered) * 100 : 0} sub="Irreversible actions need a human" />
        <Kpi label="Open findings" value={kpis.openFindings} tone={kpis.openFindings > 20 ? 'bad' : kpis.openFindings ? 'warn' : 'ok'} sub={`${kpis.critical} critical-exposure agents`} />
        <Kpi label="Average exposure" value={kpis.discovered ? kpis.avgExposure : '—'} unit={kpis.discovered ? ' / 100' : ''} tone={kpis.discovered ? toneOf(kpis.avgExposure) : undefined} sub="Lower is better" />
        <Kpi label="Audit readiness" value={kpis.audit} unit="%" pct={kpis.audit} tone={kpis.audit >= 80 ? 'ok' : kpis.audit >= 40 ? 'warn' : undefined} sub="Evidence mapped to NIST AI RMF and ISO 42001" />
      </div>

      <div className="grid-2">
        <Card title="Coverage by lifecycle phase" note={`${kpis.total} agents in scope`}>
          <div className="stack">
            {phases.map(([label, n, cls]) => (
              <i key={label} className={'seg seg-' + cls} style={{ flexGrow: n }} title={`${label}: ${n}`} />
            ))}
          </div>
          <div className="legend">
            {phases.map(([label, n, cls]) => (
              <span key={label}><i className={'sw seg-' + cls} /> {label} <b>{n}</b></span>
            ))}
          </div>
          <div className="counters">
            <div><b>{counts.allow || 0}</b><span>actions allowed</span></div>
            <div><b className="c-bad">{counts.block || 0}</b><span>blocked</span></div>
            <div><b className="c-warn">{counts.gate || 0}</b><span>sent to approval</span></div>
            <div><b>{counts.evidence || 0}</b><span>evidence records</span></div>
          </div>
          <p className="fine dim">Counters accumulate since this page opened.</p>
        </Card>

        <Card title="Across the lifecycle" note="End-of-stage values">
          <Trend stageIdx={stage} />
          <div className="legend">
            <span><i className="sw ln-exp-sw" /> Average exposure</span>
            <span><i className="sw ln-aud-sw" /> Audit readiness</span>
          </div>
        </Card>
      </div>

      <div className="grid-2">
        <Card title="Open findings by OWASP Agentic category" note="Top 10 for Agentic Applications">
          <ul className="bars">
            {OWASP.map((o) => {
              const n = kpis.owaspCounts[o.id]
              return (
                <li key={o.id}>
                  <span className="bl"><b>{o.id}</b> {o.name}</span>
                  <span className="bt"><i style={{ width: (n / max) * 100 + '%' }} /></span>
                  <span className="bn">{n}</span>
                </li>
              )
            })}
          </ul>
        </Card>
        <Card title="Agents by region and department" note="Colour = average exposure">
          <Heat />
        </Card>
      </div>
    </div>
  )
}
