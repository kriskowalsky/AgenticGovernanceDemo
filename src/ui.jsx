export const toneOf = (v) => (v >= 70 ? 'bad' : v >= 45 ? 'warn' : 'ok')

export function ExposureBar({ value }) {
  if (value == null) return <span className="dim">—</span>
  return (
    <div className="xbar" title={`Exposure ${value}/100`}>
      <span><i className={'t-' + toneOf(value)} style={{ width: value + '%' }} /></span>
      <b>{value}</b>
    </div>
  )
}

export function StatusPill({ s }) {
  return <span className={'pill st-' + s.toLowerCase()}>{s}</span>
}

export function Kpi({ label, value, unit, sub, tone, pct }) {
  return (
    <div className={'kpi' + (tone ? ' k-' + tone : '')}>
      <div className="kpi-l">{label}</div>
      <div className="kpi-v">{value}{unit && <small>{unit}</small>}</div>
      {pct != null && <div className="kpi-bar"><i style={{ width: Math.min(100, pct) + '%' }} /></div>}
      <div className="kpi-s">{sub}</div>
    </div>
  )
}

export function Card({ title, note, children, className = '' }) {
  return (
    <section className={'card ' + className}>
      {(title || note) && (
        <header>
          {title && <h3>{title}</h3>}
          {note && <span className="dim">{note}</span>}
        </header>
      )}
      {children}
    </section>
  )
}

export const fmtTime = (d) => d.toLocaleTimeString('en-GB', { hour12: false })
