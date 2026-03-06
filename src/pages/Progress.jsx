import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { Chart } from 'chart.js/auto'
import { fmtLabel } from '../utils/dates'

export default function Progress() {
  const { history, prs, clearHistory } = useStore()
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || history.length === 0) return

    const ctx = chartRef.current.getContext('2d')

    // Calcola volume settimanale (ultime 8 settimane)
    const weeks = {}
    history.forEach((s) => {
      const date = new Date(s.date)
      const wk = `${date.getFullYear()}-W${String(getWeekNumber(date)).padStart(2, '0')}`
      if (!weeks[wk]) weeks[wk] = 0
      s.exercises.forEach((ex) => {
        ex.sets.forEach((set) => {
          weeks[wk] += set.reps * (set.weight || 1)
        })
      })
    })

    const sortedWeeks = Object.keys(weeks).sort().slice(-8)
    const data = sortedWeeks.map((wk) => weeks[wk])

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedWeeks.map((wk) => wk.split('-W')[1]),
        datasets: [
          {
            label: 'Volume (reps × kg)',
            data: data,
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#9ca3af' } },
          x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
        }
      }
    })

    return () => {
      if (chartInstance.current) chartInstance.current.destroy()
    }
  }, [history])

  const prList = Object.values(prs).sort((a, b) => b.weight - a.weight)

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-5">
        <h2 className="text-lg font-semibold text-indigo-300 mb-3">📈 Volume settimanale</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            Nessun dato disponibile. Inizia ad allenarti!
          </p>
        ) : (
          <div style={{ height: '200px' }}>
            <canvas ref={chartRef} />
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-indigo-300 mb-3">🏆 Record personali</h2>
        {prList.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Nessun record ancora. Completa alcuni allenamenti!
          </p>
        ) : (
          <div className="space-y-2">
            {prList.map((pr) => (
              <div key={pr.name} className="bg-gray-800 rounded-xl px-4 py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium text-indigo-300">{pr.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{fmtLabel(pr.date)}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{pr.weight} kg</div>
                  <div className="text-xs text-gray-400">{pr.reps} rip</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 rounded-2xl p-5">
        <h2 className="text-base font-semibold text-indigo-300 mb-3">📋 Cronologia</h2>
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">Nessun allenamento registrato</p>
        ) : (
          <>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-3">
              {history.slice(0, 20).map((s) => (
                <div key={s.id} className="bg-gray-800 rounded-xl px-4 py-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">{s.exercises.map((e) => e.name).join(', ')}</span>
                    <span className="text-gray-400">{fmtLabel(s.date)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {s.exercises.reduce((a, e) => a + e.sets.length, 0)} serie
                    {s.duration > 0 ? ` • ${s.duration} min` : ''}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (confirm('Cancellare tutta la cronologia e i record?')) clearHistory()
              }}
              className="w-full py-2 bg-red-900 hover:bg-red-800 rounded-xl text-sm text-red-300"
            >
              🗑 Cancella cronologia
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  return weekNo
}