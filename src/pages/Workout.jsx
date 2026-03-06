import { useState } from 'react'
import { useStore } from '../store/useStore'
import { today } from '../utils/dates'

const QUICK_EXERCISES = [
  'Squat',
  'Panca piana',
  'Stacco',
  'Trazioni',
  'Shoulder Press',
  'Curl bicipiti',
  'Dips',
  'Plank',
  'Corsa'
]

export default function Workout() {
  const { session, sessionStart, startSession, addExercise, removeExercise, addSet, removeSet, saveSession } = useStore()
  const [newExName, setNewExName] = useState('')

  const handleStart = () => {
    if (!sessionStart) startSession(today())
  }

  const handleAddExercise = (name = newExName) => {
    if (!name.trim()) return
    if (!sessionStart) handleStart()
    addExercise(name.trim())
    setNewExName('')
  }

  const handleFinish = () => {
    if (saveSession()) {
      alert('✅ Allenamento salvato!')
    } else {
      alert('⚠️ Aggiungi almeno un esercizio prima di salvare')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-indigo-300">Sessione attiva</h2>
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-xl text-sm font-bold"
          >
            ✅ Fine
          </button>
        </div>

        {sessionStart && (
          <div className="text-sm text-gray-400 mb-3">
            📅 {session.date} | ⏱ In corso...
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Nome esercizio..."
            value={newExName}
            onChange={(e) => setNewExName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddExercise()}
            className="flex-1 bg-gray-800 rounded-xl p-3 text-sm text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleAddExercise()}
            className="px-4 bg-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-700"
          >
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {session.exercises.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">Aggiungi un esercizio sopra per iniziare</p>
          ) : (
            session.exercises.map((ex) => <ExerciseCard key={ex.id} exercise={ex} onAddSet={addSet} onRemoveSet={removeSet} onRemove={removeExercise} />)
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">🔖 Esercizi rapidi</h3>
        <div className="flex flex-wrap gap-2">
          {QUICK_EXERCISES.map((name) => (
            <button
              key={name}
              onClick={() => handleAddExercise(name)}
              className="px-3 py-1 bg-gray-700 rounded-lg text-xs hover:bg-indigo-700"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ExerciseCard({ exercise, onAddSet, onRemoveSet, onRemove }) {
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(0)

  const handleAdd = () => {
    onAddSet(exercise.id, { reps, weight })
  }

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-indigo-300">{exercise.name}</span>
        <button
          onClick={() => onRemove(exercise.id)}
          className="text-red-400 text-xs hover:text-red-300"
        >
          ✕ Rimuovi
        </button>
      </div>

      <div className="space-y-1 mb-2">
        {exercise.sets.map((s, idx) => (
          <div
            key={s.id}
            className="flex justify-between items-center bg-gray-700 rounded-lg px-3 py-1 text-sm"
          >
            <span className="text-gray-400">Serie {idx + 1}</span>
            <span>
              {s.reps} rip{s.weight > 0 ? ` × ${s.weight}kg` : ''}
            </span>
            <button
              onClick={() => onRemoveSet(exercise.id, s.id)}
              className="text-red-400 text-xs ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Rip."
          min="1"
          value={reps}
          onChange={(e) => setReps(parseInt(e.target.value) || 0)}
          className="w-20 bg-gray-700 rounded-lg p-2 text-sm text-center"
        />
        <input
          type="number"
          placeholder="Kg"
          min="0"
          step="0.5"
          value={weight}
          onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
          className="w-20 bg-gray-700 rounded-lg p-2 text-sm text-center"
        />
        <button
          onClick={handleAdd}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-bold"
        >
          + Serie
        </button>
      </div>
    </div>
  )
}