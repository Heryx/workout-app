import { useState, useEffect, useRef } from 'react'
import { beep, beepHigh, beepDone } from '../utils/audio'
import { fmtTime } from '../utils/dates'

export default function Timer() {
  const [mode, setMode] = useState('stopwatch') // 'stopwatch' | 'countdown' | 'interval'
  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-indigo-300 mb-3">Modalità Timer</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('stopwatch')}
            className={`flex-1 py-2 rounded-xl font-medium text-sm ${
              mode === 'stopwatch' ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            ⏱ Cronometro
          </button>
          <button
            onClick={() => setMode('countdown')}
            className={`flex-1 py-2 rounded-xl font-medium text-sm ${
              mode === 'countdown' ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            ⏳ Countdown
          </button>
          <button
            onClick={() => setMode('interval')}
            className={`flex-1 py-2 rounded-xl font-medium text-sm ${
              mode === 'interval' ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            🔁 Intervalli
          </button>
        </div>

        {mode === 'stopwatch' && <Stopwatch />}
        {mode === 'countdown' && <Countdown />}
        {mode === 'interval' && <IntervalTimer />}
      </div>

      <RestTimer />
    </div>
  )
}

// ─── STOPWATCH ──────────────────────────────────────
function Stopwatch() {
  const [ms, setMs] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      const t0 = Date.now() - ms
      intervalRef.current = setInterval(() => setMs(Date.now() - t0), 100)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const fmtSW = (ms) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    const d = Math.floor((ms % 1000) / 100)
    return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.${d}`
  }

  const reset = () => {
    setRunning(false)
    setMs(0)
    setLaps([])
  }

  const addLap = () => {
    if (!running) return
    setLaps([...laps, ms])
    beepHigh()
  }

  return (
    <div>
      <div className="text-6xl font-mono text-center text-indigo-300 my-6">{fmtSW(ms)}</div>
      <div className="flex gap-3 justify-center mb-4">
        <button
          onClick={() => setRunning(true)}
          className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold"
        >
          ▶ Start
        </button>
        <button
          onClick={() => setRunning(false)}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-bold"
        >
          ⏸ Pausa
        </button>
        <button onClick={reset} className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold">
          ↺ Reset
        </button>
      </div>
      {laps.length > 0 && (
        <div className="space-y-1 max-h-40 overflow-y-auto mb-3">
          {[...laps].reverse().map((l, i) => (
            <div
              key={laps.length - i}
              className="flex justify-between text-sm bg-gray-800 rounded-lg px-3 py-1"
            >
              <span className="text-gray-400">Lap {laps.length - i}</span>
              <span className="text-indigo-300 font-mono">{fmtSW(l)}</span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={addLap}
        className="w-full py-2 bg-gray-700 rounded-xl text-sm text-gray-300 hover:bg-gray-600"
      >
        + Aggiungi Lap
      </button>
    </div>
  )
}

// ─── COUNTDOWN ─────────────────────────────────────
function Countdown() {
  const [minutes, setMinutes] = useState(1)
  const [seconds, setSeconds] = useState(30)
  const [left, setLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && left > 0) {
      intervalRef.current = setInterval(() => {
        setLeft((l) => {
          if (l <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            beepDone()
            setTimeout(() => alert('⏰ Countdown finito!'), 200)
            return 0
          }
          return l - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, left])

  const start = () => {
    if (left === 0) setLeft(minutes * 60 + seconds)
    setRunning(true)
  }

  const reset = () => {
    setRunning(false)
    setLeft(0)
  }

  return (
    <div>
      <div className="flex gap-2 justify-center mb-4">
        <div className="text-center">
          <input
            type="number"
            min="0"
            max="99"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
            className="w-16 text-center text-2xl bg-gray-800 rounded-lg p-2 text-indigo-300"
            disabled={running}
          />
          <div className="text-xs text-gray-500 mt-1">min</div>
        </div>
        <div className="text-3xl mt-3">:</div>
        <div className="text-center">
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
            className="w-16 text-center text-2xl bg-gray-800 rounded-lg p-2 text-indigo-300"
            disabled={running}
          />
          <div className="text-xs text-gray-500 mt-1">sec</div>
        </div>
      </div>
      <div className="text-6xl font-mono text-center text-indigo-300 my-4">{fmtTime(left || minutes * 60 + seconds)}</div>
      <div className="flex gap-3 justify-center">
        <button onClick={start} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold">
          ▶ Start
        </button>
        <button
          onClick={() => setRunning(false)}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-bold"
        >
          ⏸ Pausa
        </button>
        <button onClick={reset} className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold">
          ↺ Reset
        </button>
      </div>
    </div>
  )
}

// ─── INTERVAL TIMER ─────────────────────────────────
function IntervalTimer() {
  const [work, setWork] = useState(40)
  const [rest, setRest] = useState(20)
  const [rounds, setRounds] = useState(8)
  const [curRound, setCurRound] = useState(0)
  const [phase, setPhase] = useState('work') // 'work' | 'rest'
  const [left, setLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && left > 0) {
      intervalRef.current = setInterval(() => {
        setLeft((l) => {
          if (l <= 1) {
            beep()
            if (phase === 'work') {
              setPhase('rest')
              return rest
            } else {
              if (curRound >= rounds) {
                clearInterval(intervalRef.current)
                setRunning(false)
                setCurRound(0)
                beepDone()
                setTimeout(() => alert('🎉 Intervalli completati!'), 200)
                return 0
              }
              setCurRound((r) => r + 1)
              setPhase('work')
              return work
            }
          }
          return l - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, left, phase, curRound, rounds, work, rest])

  const start = () => {
    if (curRound === 0) {
      setCurRound(1)
      setPhase('work')
      setLeft(work)
    }
    setRunning(true)
  }

  const reset = () => {
    setRunning(false)
    setCurRound(0)
    setPhase('work')
    setLeft(0)
  }

  const total = phase === 'work' ? work : rest
  const pct = total > 0 ? (left / total) * 100 : 0

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-400">Lavoro (sec)</label>
          <input
            type="number"
            value={work}
            onChange={(e) => setWork(parseInt(e.target.value) || 40)}
            className="w-full bg-gray-800 rounded-lg p-2 text-indigo-300 mt-1"
            disabled={running}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Riposo (sec)</label>
          <input
            type="number"
            value={rest}
            onChange={(e) => setRest(parseInt(e.target.value) || 20)}
            className="w-full bg-gray-800 rounded-lg p-2 text-indigo-300 mt-1"
            disabled={running}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Rounds</label>
          <input
            type="number"
            value={rounds}
            onChange={(e) => setRounds(parseInt(e.target.value) || 8)}
            className="w-full bg-gray-800 rounded-lg p-2 text-indigo-300 mt-1"
            disabled={running}
          />
        </div>
        <div>
          <label className="text-xs text-gray-400">Round attuale</label>
          <div className="text-2xl font-bold text-indigo-300 mt-2">
            {curRound > 0 ? `${curRound}/${rounds}` : '–'}
          </div>
        </div>
      </div>
      <div className={`text-center text-lg font-bold mb-1 ${ phase === 'work' ? 'text-green-400' : 'text-blue-400' }`}>
        {phase === 'work' ? 'LAVORO' : 'RIPOSO'}
      </div>
      <div className="text-6xl font-mono text-center text-indigo-300 my-2">
        {left > 0 ? String(left).padStart(2, '0') : '00'}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
        <div
          className={`h-3 rounded-full transition-all ${ phase === 'work' ? 'bg-green-500' : 'bg-blue-500' }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={start} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl font-bold">
          ▶ Start
        </button>
        <button
          onClick={() => setRunning(false)}
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-xl font-bold"
        >
          ⏸ Pausa
        </button>
        <button onClick={reset} className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-bold">
          ↺ Reset
        </button>
      </div>
    </div>
  )
}

// ─── REST TIMER ──────────────────────────────────────
function RestTimer() {
  const [left, setLeft] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && left > 0) {
      intervalRef.current = setInterval(() => {
        setLeft((l) => {
          if (l <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            beepDone()
            return 0
          }
          return l - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, left])

  const start = (sec) => {
    setLeft(sec)
    setRunning(true)
  }

  const stop = () => {
    setRunning(false)
    setLeft(0)
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-5">
      <h2 className="text-base font-semibold text-indigo-300 mb-2">⏲ Recupero rapido tra serie</h2>
      <div className="flex gap-2 flex-wrap mb-2">
        {[30, 60, 90, 120, 180].map((s) => (
          <button
            key={s}
            onClick={() => start(s)}
            className="px-3 py-1 bg-gray-700 rounded-lg text-sm hover:bg-indigo-700"
          >
            {s < 60 ? `${s}s` : `${s / 60}min`}
          </button>
        ))}
      </div>
      {running && (
        <>
          <div className="text-3xl font-mono text-center text-yellow-300 my-2">{fmtTime(left)}</div>
          <button onClick={stop} className="w-full py-2 bg-red-600 rounded-xl text-sm mt-1">
            Stop recupero
          </button>
        </>
      )}
    </div>
  )
}