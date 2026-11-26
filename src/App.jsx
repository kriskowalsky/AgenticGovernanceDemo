import { SimProvider, useSim } from './sim'
import { CLIENT, CLIENT_NOTE, STAGES } from './data'
import Dashboard from './Dashboard'
import Agents from './Agents'
import MapView from './MapView'
import Journey from './Journey'
import { fmtTime } from './ui'

const TABS = [
  ['dashboard', 'Dashboard'],
  ['agents', 'Agents'],
  ['map', 'Map'],
  ['journey', 'Journey'],
]

function Ticker() {
  const { events, counts } = useSim()
  const latest = events.slice(0, 4)
  return (
    <footer className="ticker" aria-live="off">
      <span className="livepill"><i /> LIVE</span>
      <div className="ticks">
        {!latest.length && <span className="dim">No agent activity visible yet</span>}
        {latest.map((e, i) => (
          <span key={e.id} className={'tk ' + e.tone + (i === 0 ? ' new' : '')}>
            <span className={'dot ' + e.tone} />
            <span className="dim">{fmtTime(e.at)}</span> {e.agent} · {e.text} <span className="dim">· {e.city}</span>
          </span>
        ))}
      </div>
      <div className="tc">
        <span>allowed <b>{counts.allow || 0}</b></span>
        <span className="c-bad">blocked <b>{counts.block || 0}</b></span>
        <span className="c-warn">gated <b>{counts.gate || 0}</b></span>
      </div>
    </footer>
  )
}

function Shell() {
  const { tab, setTab, stage, isLive, resetLive } = useSim()
  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <div>
            <b>Agent Assurance</b>
            <span>Modus Create + Tweag</span>
          </div>
        </div>
        <nav className="tabs" aria-label="Screens">
          {TABS.map(([k, label]) => (
            <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>
          ))}
        </nav>
        <div className="who">
          <span className="client">{CLIENT}</span>
          <span className="dim">{CLIENT_NOTE}</span>
        </div>
      </header>

      {!isLive && (
        <div className="stagebar">
          Viewing the estate at <b>{STAGES[stage].title}</b>
          <button className="ghost" onClick={resetLive}>Return to live view</button>
        </div>
      )}

      <main>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'agents' && <Agents />}
        {tab === 'map' && <MapView />}
        {tab === 'journey' && <Journey />}
      </main>
      <Ticker />
    </div>
  )
}

export default function App() {
  return (
    <SimProvider>
      <Shell />
    </SimProvider>
  )
}
