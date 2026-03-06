import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Timer from './pages/Timer'
import Workout from './pages/Workout'
import Programs from './pages/Programs'
import Calendar from './pages/Calendar'
import Progress from './pages/Progress'

const NAV = [
  { to: '/', icon: '⏱', label: 'Timer' },
  { to: '/workout', icon: '💪', label: 'Workout' },
  { to: '/programs', icon: '📋', label: 'Programmi' },
  { to: '/calendar', icon: '📅', label: 'Calendario' },
  { to: '/progress', icon: '📈', label: 'Progressi' },
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-gray-950 min-h-screen text-gray-100 pb-20 max-w-lg mx-auto">
        <header className="bg-gray-900 px-4 py-4 flex items-center justify-between shadow-lg sticky top-0 z-10">
          <h1 className="text-xl font-bold text-indigo-400">⚡ WorkoutApp</h1>
        </header>
        
        <main className="px-3 pt-4">
          <Routes>
            <Route path="/" element={<Timer />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex max-w-lg mx-auto z-20">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              className={({ isActive }) =>
                `flex-1 py-3 flex flex-col items-center gap-0.5 text-xs transition-colors ${
                  isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-200'
                }`
              }
            >
              <span className="text-lg">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </BrowserRouter>
  )
}