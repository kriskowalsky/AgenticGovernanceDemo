import { useMemo, useState } from 'react'
import { useSim } from './sim'
import { DEPARTMENTS, OFFICES, OWASP, REGIONS } from './data'
import { Card, ExposureBar, StatusPill, fmtTime } from './ui'

const STATUSES = ['All', 'Discovered', 'Secured', 'Assured']
const officeName = (id) => OFFICES.find((o) => o.id === id)?.city

function Drawer() {
  const { selectedAgent, setSelectedAgent, kpis, events } = useSim()
  if (!selectedAgent) return null
  const row = kpis.rows.find((r) => r.a.id === selectedAgent)
  if (!row) return null
  const { a, s } = row
  const mine = events.filter((e) => e.agentId === a.id).slice(0, 6)
  return (
    <aside className="drawer" role="dialog" aria-label={`Agent ${a.name}`}>
      <button className="x" onClick={() => setSelectedAgent(null)} aria-label="Close">×</button>
      <p className="kicker">{a.id} · {a.framework}</p>
      <h2>{a.name}</h2>
      <p className="dim">{a.dept} · {officeName(a.office)}, {a.region}</p>
      <div className="d-row"><StatusPill s={s.status} />{a.shadow && <span className="tag">was shadow</span>}{s.gated && <span className="tag ok">approval gate</span>}</div>

      <h4>Authority</h4>
      <dl>
        <dt>Credential at discovery</dt><dd>{a.credential}</dd>
        <dt>Credential now</dt><dd>{s.credentialNow}</dd>
        <dt>Systems reachable</dt><dd>{a.reach}</dd>
        <dt>Tools</dt><dd>{a.tools.join(', ')}</dd>
        <dt>Exposure</dt><dd><ExposureBar value={s.exposure} /></dd>
      </dl>

      <h4>Open findings</h4>
      {s.openFindings.length ? (
        <ul className="finds">
          {s.openFindings.map((f) => <li key={f}><b>{f}</b> {OWASP.find((o) => o.id === f).name}</li>)}
        </ul>
      ) : <p className="dim">None open.</p>}

      <h4>Recent activity</h4>
      {mine.length ? (
        <ul className="finds">
          {mine.map((e) => <li key={e.id}><span className={'dot ' + e.tone} /> <span className="dim">{fmtTime(e.at)}</span> {e.text}</li>)}
        </ul>
      ) : <p className="dim">Nothing yet. Events appear as this agent acts.</p>}
    </aside>
  )
}

export default function Agents() {
  const { kpis, filters, setFilters, selectedAgent, setSelectedAgent, events } = useSim()
  const [sort, setSort] = useState({ key: 'exposure', dir: -1 })

  const recent = useMemo(() => {
    const set = new Set()
    events.slice(0, 8).forEach((e) => set.add(e.agentId))
    return set
  }, [events])

  const rows = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    const out = kpis.rows.filter(({ a, s }) =>
      s.discovered &&
      (filters.region === 'All' || a.region === filters.region) &&
      (filters.dept === 'All' || a.dept === filters.dept) &&
      (filters.status === 'All' || s.status === filters.status) &&
      (!q || a.name.includes(q) || a.id.toLowerCase().includes(q) || a.framework.toLowerCase().includes(q)),
    )
    const val = (r) => ({
      exposure: r.s.exposure, name: r.a.name, dept: r.a.dept, region: r.a.region,
      credential: r.a.credential, reach: r.a.reach, status: r.s.status, id: r.a.id,
    }[sort.key])
    return out.sort((x, y) => {
      const a = val(x), b = val(y)
      return (a > b ? 1 : a < b ? -1 : 0) * sort.dir
    })
  }, [kpis, filters, sort])

  const set = (patch) => setFilters({ ...filters, ...patch })
  const head = (key, label) => (
    <th onClick={() => setSort({ key, dir: sort.key === key ? -sort.dir : -1 })} className="sortable">
      {label}{sort.key === key ? (sort.dir < 0 ? ' ↓' : ' ↑') : ''}
    </th>
  )
  const byRegion = REGIONS.map((r) => ({
    r, n: kpis.rows.filter((x) => x.a.region === r && x.s.discovered).length,
  }))

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1>Agent tracker</h1>
          <p className="dim">{rows.length} of {kpis.discovered} discovered agents shown</p>
        </div>
      </div>

      <div className="chips">
        <button className={'chip' + (filters.region === 'All' ? ' on' : '')} onClick={() => set({ region: 'All' })}>All regions <b>{kpis.discovered}</b></button>
        {byRegion.map(({ r, n }) => (
          <button key={r} className={'chip' + (filters.region === r ? ' on' : '')} onClick={() => set({ region: r })}>{r} <b>{n}</b></button>
        ))}
      </div>

      <div className="filters">
        <select value={filters.dept} onChange={(e) => set({ dept: e.target.value })} aria-label="Department">
          <option value="All">All departments</option>
          {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => set({ status: e.target.value })} aria-label="Status">
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'All' ? 'All statuses' : s}</option>)}
        </select>
        <input value={filters.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search agent, ID or framework" aria-label="Search" />
        <button className="ghost" onClick={() => setFilters({ region: 'All', dept: 'All', status: 'All', q: '' })}>Clear</button>
      </div>

      <Card className="flush">
        {kpis.discovered === 0 ? (
          <div className="empty-state">
            <h3>Nothing discovered yet.</h3>
            <p className="dim">This is the Day 1 baseline: the client cannot list the agents running in the business. Open the Journey tab to see how this fills in.</p>
          </div>
        ) : (
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th />
                  {head('id', 'ID')}{head('name', 'Agent')}{head('dept', 'Department')}{head('region', 'Region')}
                  {head('credential', 'Credential')}{head('reach', 'Reach')}{head('exposure', 'Exposure')}{head('status', 'Status')}
                  <th>Findings</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ a, s }) => (
                  <tr key={a.id} className={selectedAgent === a.id ? 'sel' : ''} onClick={() => setSelectedAgent(a.id)}>
                    <td>{recent.has(a.id) && <span className="live-dot" title="Active just now" />}</td>
                    <td className="mono dim">{a.id}</td>
                    <td><b>{a.name}</b>{a.shadow && <span className="tag">shadow</span>}</td>
                    <td>{a.dept}</td>
                    <td>{officeName(a.office)} <span className="dim">· {a.region}</span></td>
                    <td><span className={'cred c-' + (s.secured ? 'scoped' : a.credential)}>{s.credentialNow}</span></td>
                    <td className="num">{a.reach}</td>
                    <td><ExposureBar value={s.exposure} /></td>
                    <td><StatusPill s={s.status} /></td>
                    <td>{s.openFindings.length ? s.openFindings.map((f) => <span key={f} className="tag f">{f}</span>) : <span className="dim">—</span>}</td>
                  </tr>
                ))}
                {!rows.length && <tr><td colSpan="10" className="dim pad">No agents match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Drawer />
    </div>
  )
}
