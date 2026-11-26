import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { buildKpis, makeEvent } from './data'

const Ctx = createContext(null)
export const useSim = () => useContext(Ctx)

export const LIVE_STAGE = 5

export function SimProvider({ children }) {
  const [stage, setStage] = useState(LIVE_STAGE)
  const [progress, setProgress] = useState(1)
  const [events, setEvents] = useState([])
  const [counts, setCounts] = useState({})
  const [tab, setTab] = useState('dashboard')
  const [filters, setFilters] = useState({ region: 'All', dept: 'All', status: 'All', q: '' })
  const [selectedAgent, setSelectedAgent] = useState(null)

  const live = useRef({ stage, progress })
  live.current = { stage, progress }

  // seed + live event stream
  useEffect(() => {
    const push = (n) => {
      const out = []
      for (let i = 0; i < n; i++) {
        const e = makeEvent(live.current.stage, live.current.progress)
        if (e) out.push(e)
      }
      if (!out.length) return
      setEvents((prev) => [...out.reverse(), ...prev].slice(0, 80))
      setCounts((c) => {
        const next = { ...c }
        out.forEach((e) => { next[e.type] = (next[e.type] || 0) + 1 })
        return next
      })
    }
    push(10)
    const id = setInterval(() => push(Math.random() < 0.3 ? 2 : 1), 1300)
    return () => clearInterval(id)
  }, [])

  // activity belongs to the stage being viewed: reset the stream when the stage changes
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    setEvents([])
    setCounts({})
  }, [stage])

  const q = Math.round(progress * 50) / 50
  const kpis = useMemo(() => buildKpis(stage, q), [stage, q])

  const value = {
    stage, setStage, progress, setProgress,
    events, counts, kpis,
    tab, setTab, filters, setFilters, selectedAgent, setSelectedAgent,
    resetLive: () => { setStage(LIVE_STAGE); setProgress(1) },
    isLive: stage === LIVE_STAGE && progress === 1,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
