import { useState } from 'react'
import { useStore } from '../store/useStore'
import { weekDays, monthDays, fmt, fmtLabel, weekKey, today } from '../utils/dates'

const DAYS_SHORT = ['L', 'M', 'M', 'G', 'V', 'S', 'D']

export default function Calendar() {
  const { history } = useStore()
  const [view, setView] = useState('week') // 'week' | 'month'
  const [date, setDate] = useState(new Date())

  const days = view === 'week' ? weekDays(date) : monthDays(date)
  const workedDates = new Set(history.map((s) => s.date))
  const todayDate = today()

  const thisWeekSessions = history.filter((s) => {
    const wk = weekDays(date).map((d) => fmt(d))
    return wk.includes(s.date)
  })

  const prevWeek = () => {
    const d = new Date(date)
    d.setDate(d.getDate() - (view === 'week' ? 7 : 30))
    setDate(d)
  }

  const nextWeek = () => {
    const d = new Date(date)
    d.setDate(d.getDate() + (view === 'week' ? 7 : 30))
    setDate(d)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-indigo-300">
            {view === 'week' ? `Settimana ${weekKey(date)}` : fmt(date, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-lg text-xs ${
                view === 'week' ? 'bg-indigo-600' : 'bg-gray-700'
              }`}
            >
              Sett.
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-lg text-xs ${
                view === 'month' ? 'bg-indigo-600' : 'bg-gray-700'
              }`}
            >
              Mese
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <button onClick={prevWeek} className="px-3 py-1 bg-gray-700 rounded-lg text-sm">
            ◀
          </button>
          <button
            onClick={() => setDate(new Date())}
            className="px-3 py-1 bg-gray-700 rounded-lg text-xs"
          >
            Oggi
          </button>
          <button onClick={nextWeek} className="px-3 py-1 bg-gray-700 rounded-lg text-sm">
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-3">
          {view === 'week'
            ? DAYS_SHORT.map((d, i) => {
                const date = days[i]
                const dateStr = fmt(date)
                const worked = workedDates.has(dateStr)
                const isToday = dateStr === todayDate
                return (
                  <div key={i} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{d}</div>
                    <div
                      className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                        worked
                          ? 'bg-indigo-500 text-white'
                          : isToday
                          ? 'border-2 border-indigo-500 text-indigo-300'
                          : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  </div>
                )
              })
            : days.map((date, i) => {
                const dateStr = fmt(date)
                const worked = workedDates.has(dateStr)
                const isToday = dateStr === todayDate
                return (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded text-xs font-medium ${
                      worked
                        ? 'bg-indigo-500 text-white'
                        : isToday
                        ? 'border border-indigo-500 text-indigo-300'
                        : 'bg-gray-800 text-gray-500'
                    }`}
                  >
                    {date.getDate()}
                  </div>
                )
              })}
        </div>
      </div>

      {view === 'week' && (
        <div className="bg-gray-900 rounded-2xl p-5">
          <h3 className="text-base font-semibold text-indigo-300 mb-3">
            💪 Allenamenti ({thisWeekSessions.length})
          </h3>
          {thisWeekSessions.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-3">
              Nessun allenamento questa settimana
            </p>
          ) : (
            <div className="space-y-2">
              {thisWeekSessions.map((s) => (
                <div key={s.id} className="bg-gray-800 rounded-xl px-4 py-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {s.exercises.map((e) => e.name).join(', ')}
                    </span>
                    <span className="text-gray-400">{fmtLabel(s.date)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {s.exercises.reduce((a, e) => a + e.sets.length, 0)} serie •{' '}
                    {s.duration > 0 ? `${s.duration} min` : ''}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <WeeklyStats history={history} />
    </div>
  )
}

function WeeklyStats({ history }) {
  const allWeeks = {}
  history.forEach((s) => {
    const wk = weekKey(new Date(s.date))
    allWeeks[wk] = (allWeeks[wk] || 0) + 1
  })

  const weekVals = Object.values(allWeeks)
  const avgPerWeek = weekVals.length ? (weekVals.reduce((a, b) => a + b, 0) / weekVals.length).toFixed(1) : 0

  // Streak calculation
  const sortedWeeks = Object.keys(allWeeks).sort().reverse()
  let streak = 0
  const currentWk = weekKey(new Date())
  if (sortedWeeks[0] === currentWk || sortedWeeks[0] === getPreviousWeek(currentWk)) {
    for (let i = 0; i < sortedWeeks.length; i++) {
      const expected = i === 0 ? currentWk : getPreviousWeek(sortedWeeks[i - 1])
      if (sortedWeeks[i] === expected || (i === 0 && sortedWeeks[0] === getPreviousWeek(currentWk))) {
        streak++
      } else {
        break
      }
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-5">
      <h2 className="text-base font-semibold text-indigo-300 mb-3">🔥 Statistiche</h2>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-800 rounded-xl p-3">
          <div className="text-2xl font-bold text-orange-400">{streak}</div>
          <div className="text-xs text-gray-400 mt-1">Settimane streak</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3">
          <div className="text-2xl font-bold text-indigo-400">{history.length}</div>
          <div className="text-xs text-gray-400 mt-1">Totali</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-3">
          <div className="text-2xl font-bold text-green-400">{avgPerWeek}</div>
          <div className="text-xs text-gray-400 mt-1">Media sett.</div>
        </div>
      </div>
    </div>
  )
}

function getPreviousWeek(weekStr) {
  const [year, wk] = weekStr.split('-W').map(Number)
  const prevWk = wk - 1
  if (prevWk < 1) return `${year - 1}-W52`
  return `${year}-W${String(prevWk).padStart(2, '0')}`
}