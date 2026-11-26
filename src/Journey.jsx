import { useEffect, useRef, useState } from 'react'
import { useSim, LIVE_STAGE } from './sim'
import { STAGES } from './data'
import { Card } from './ui'

const STAGE_MS = 7000

const AUDIT_PATH = [
  ['09:14:02', 'Trigger', 'Refund request #48213 arrives through the helpdesk.'],
  ['09:14:03', 'Plan', 'Agent plans: verify purchase, check policy, issue refund.'],
  ['09:14:05', 'Tool call', 'CRM order lookup. Read scope. Allowed.'],
  ['09:14:07', 'Policy check', 'Amount exceeds the agent’s autonomous refund limit.'],
  ['09:14:07', 'Approval gate', 'Routed to the support lead on shift. Agent waits.'],
  ['09:21:40', 'Approval', 'Approved by named human. Signature sealed to the record.'],
  ['09:21:42', 'Tool call', 'Payments refund under the scoped credential. Allowed.'],
  ['09:21:43', 'Evidence', 'Decision path hashed and stored. Retrievable by date, agent or approver.'],
]

function Mini({ label, value, of, tone }) {
  return (
    <div className="mini">
      <div className="mini-top"><span>{label}</span><b>{value}{of != null && <small> / {of}</small>}</b></div>
      {of != null && <div className="kpi-bar"><i className={tone ? 't-' + tone : ''} style={{ width: (of ? (value / of) * 100 : 0) + '%' }} /></div>}
    </div>
  )
}

export default function Journey() {
  const { stage, setStage, progress, setProgress, kpis, resetLive } = useSim()
  const [playing, setPlaying] = useState(false)
  const cur = useRef({ stage, progress })
  cur.current = { stage, progress }
  const st = STAGES[stage]

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      const { stage: s, progress: p } = cur.current
      const np = p + 100 / STAGE_MS
      if (np < 1) { setProgress(np); return }
      if (s < STAGES.length - 1) { setStage(s + 1); setProgress(0) }
      else { setProgress(1); setPlaying(false) }
    }, 100)
    return () => clearInterval(id)
  }, [playing, setStage, setProgress])

  // stop autoplay if the user leaves this tab
  useEffect(() => () => setPlaying(false), [])

  const play = () => {
    if (playing) { setPlaying(false); return }
    if (stage === STAGES.length - 1 || (stage === LIVE_STAGE && progress === 1)) { setStage(0); setProgress(0) }
    setPlaying(true)
  }
  const jump = (i) => { setPlaying(false); setStage(i); setProgress(1) }

  const showAudit = st.audit

  return (
    <div className="screen">
      <div className="screen-head">
        <div>
          <h1>Client journey</h1>
          <p className="dim">From Day 1 to standard operation, including audit. The dashboard and tracker follow whichever stage is selected.</p>
        </div>
        <div className="actions">
          <button className="primary" onClick={play}>{playing ? 'Pause' : 'Play the story'}</button>
          <button className="ghost" onClick={() => { setPlaying(false); resetLive() }}>Back to live view</button>
        </div>
      </div>

      <ol className="stepper">
        {STAGES.map((s, i) => {
          const fill = i < stage ? 100 : i === stage ? progress * 100 : 0
          return (
            <li key={s.key}>
              <button className={'step' + (i === stage ? ' on' : '') + (i < stage ? ' done' : '')} onClick={() => jump(i)}>
                <span className="sn">{i < stage ? '✓' : i + 1}</span>
                <span className="sl">{s.short}</span>
                <span className="sp">{s.phase}</span>
                <span className="sf"><i style={{ width: fill + '%' }} /></span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className="journey-grid">
        <Card className="stage-card">
          <p className="kicker">{st.phase} · {st.when}</p>
          <h2>{st.title}</h2>
          <div className="triple">
            <div><h4>What the client experiences</h4><p>{st.client}</p></div>
            <div><h4>What Modus Create and Tweag do</h4><p>{st.we}</p></div>
            <div>
              <h4>Deliverables</h4>
              <ul className="dl">{st.deliverables.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
          </div>
          <p className="exit"><b>Exit criteria</b> {st.exit}</p>
          {showAudit && <p className="loopnote">↺ Audit feeds straight back into Discover. Anything new since the last cycle is found and enters the loop.</p>}
        </Card>

        <Card title="Estate at this point" note={st.kpiNote} className="est">
          <Mini label="Discovered" value={kpis.discovered} of={kpis.total} />
          <Mini label="Secured" value={kpis.secured} of={kpis.total} />
          <Mini label="Assured" value={kpis.assured} of={kpis.total} />
          <Mini label="Open findings" value={kpis.openFindings} />
          <Mini label="Audit readiness" value={kpis.audit + '%'} />
        </Card>
      </div>

      {showAudit && (
        <Card title="Audit question: “What did the refund agent do, and why?”" note="Illustrative decision-path reconstruction" className="audit">
          <ol className="path">
            {AUDIT_PATH.map(([t, k, d], i) => (
              <li key={i} className={k === 'Approval gate' || k === 'Approval' ? 'gate' : ''}>
                <span className="pt">{t}</span>
                <span className="pk">{k}</span>
                <span className="pd">{d}</span>
              </li>
            ))}
          </ol>
          <p className="fine dim">Without decision-path logging, steps 2, 4 and 5 cannot be reconstructed after the fact. This is the evidence gap the Secure phase closes.</p>
        </Card>
      )}
    </div>
  )
}
