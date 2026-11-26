import { useMemo, useState } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import { useSim } from './sim'
import { OFFICES } from './data'
import { Card, fmtTime, toneOf } from './ui'

const W = 960, H = 500

const geo = (() => {
  const all = feature(world, world.objects.countries)
  const fc = { type: 'FeatureCollection', features: all.features.filter((f) => f.id !== '010') } // drop Antarctica
  const proj = geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], fc)
  const path = geoPath(proj)
  return { d: path(fc), proj }
})()

// label offsets [dx, dy, anchor] to keep clustered offices (NY/Toronto, London/Dublin/Frankfurt) readable
const LABELS = {
  nyc: [14, 20, 'start'], tor: [-14, -12, 'end'],
  lon: [-14, 26, 'end'], dub: [-14, -10, 'end'], fra: [16, 6, 'start'],
}

const OFFICE_XY =Object.fromEntries(OFFICES.map((o) => [o.id, geo.proj([o.lon, o.lat])]))

export function Feed({ items, limit = 12 }) {
  return (
    <ul className="feed">
      {items.slice(0, limit).map((e) => (
        <li key={e.id} className={'ev ' + e.tone}>
          <span className={'dot ' + e.tone} />
          <span className="t">{fmtTime(e.at)}</span>
          <span className="body"><b>{e.label}</b> · {e.agent} <span className="dim">({e.city})</span><br /><span className="dim">{e.text}</span></span>
        </li>
      ))}
      {!items.length && <li className="dim">Waiting for activity…</li>}
    </ul>
  )
}

export default function MapView() {
  const { kpis, events, setFilters, setTab } = useSim()
  const [sel, setSel] = useState(null)

  const offices = useMemo(() => OFFICES.map((o) => {
    const rows = kpis.rows.filter((r) => r.a.office === o.id && r.s.discovered)
    const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.s.exposure, 0) / rows.length) : null
    return { ...o, n: rows.length, avg, xy: OFFICE_XY[o.id] }
  }), [kpis])

  const pulses = events.slice(0, 8)
  const active = offices.find((o) => o.id === sel)
  const feed = sel ? events.filter((e) => e.office === sel) : events

  const openAgents = () => {
    setFilters({ region: active.region, dept: 'All', status: 'All', q: '' })
    setTab('agents')
  }

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1>Global activity</h1>
          <p className="dim">{OFFICES.length} offices · {kpis.discovered} agents tracked · live synthetic events</p>
        </div>
      </div>

      <div className="map-grid">
        <Card className="map-card flush">
          <svg viewBox={`0 0 ${W} ${H}`} className="map" role="img" aria-label="World map of offices with live agent activity">
            <path d={geo.d} className="land" />
            {pulses.map((e) => {
              const xy = OFFICE_XY[e.office]
              return <circle key={e.id} cx={xy[0]} cy={xy[1]} r="6" className={'pulse ' + e.tone} />
            })}
            {offices.map((o) => {
              const r = 5 + Math.sqrt(o.n) * 2.1
              const tone = o.avg == null ? 'none' : toneOf(o.avg)
              const [lx, ly, la] = LABELS[o.id] || [0, -r - 7, 'middle']
              return (
                <g key={o.id} className={'office' + (sel === o.id ? ' on' : '')} transform={`translate(${o.xy[0]},${o.xy[1]})`}
                  onClick={() => setSel(sel === o.id ? null : o.id)} tabIndex="0"
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(sel === o.id ? null : o.id)}
                  role="button" aria-label={`${o.city}: ${o.n} agents`}>
                  <circle r={r + 5} className="hit" />
                  <circle r={r} className={'node n-' + tone} />
                  <text x={lx} y={ly} textAnchor={la} className="olabel">{o.city}</text>
                  {o.n > 0 && <text y="4" textAnchor="middle" className="ocount">{o.n}</text>}
                </g>
              )
            })}
          </svg>
          <div className="legend map-legend">
            <span><i className="sw n-ok" /> avg exposure under 45</span>
            <span><i className="sw n-warn" /> 45–69</span>
            <span><i className="sw n-bad" /> 70+</span>
            <span className="dim">Node size = agents. Click an office.</span>
          </div>
        </Card>

        <div className="side">
          <Card title={active ? active.city : 'All offices'} note={active ? active.region : 'Select an office to focus'}>
            {active ? (
              <div className="office-stats">
                <div><b>{active.n}</b><span>agents</span></div>
                <div><b>{active.avg ?? '—'}</b><span>avg exposure</span></div>
                <div><b>{feed.length}</b><span>recent events</span></div>
                <button className="ghost" onClick={openAgents}>Open region in tracker →</button>
              </div>
            ) : (
              <p className="dim fine">Pulses on the map are events as they happen. Colour shows outcome: lime allowed or logged, amber waiting on a human or drift, coral blocked.</p>
            )}
          </Card>
          <Card title="Live activity" note="Newest first" className="grow">
            <Feed items={feed} limit={9} />
          </Card>
        </div>
      </div>
    </div>
  )
}
