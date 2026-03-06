import { useState } from 'react'
import { useStore } from '../store/useStore'

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']

const createEmptyWeek = () =>
  Array.from({ length: 7 }, () => ({ rest: true, exercises: [] }))

export default function Programs() {
  const { programs, addProgram, deleteProgram, updateProgram } = useStore()
  const [editing, setEditing] = useState(null)
  const [showBuilder, setShowBuilder] = useState(false)

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-indigo-300">I tuoi programmi</h2>
          <button
            onClick={() => setShowBuilder(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold"
          >
            + Nuovo
          </button>
        </div>

        {programs.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            Nessun programma creato. Clicca "Nuovo" per iniziare.
          </p>
        ) : (
          <div className="space-y-2">
            {programs.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                onEdit={() => setEditing(p)}
                onDelete={() => deleteProgram(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {showBuilder && (
        <ProgramBuilder
          onSave={(prog) => {
            addProgram(prog)
            setShowBuilder(false)
          }}
          onCancel={() => setShowBuilder(false)}
        />
      )}

      {editing && (
        <ProgramBuilder
          program={editing}
          onSave={(prog) => {
            updateProgram(editing.id, prog)
            setEditing(null)
          }}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function ProgramCard({ program, onEdit, onDelete }) {
  const totalDays = program.weeks?.reduce(
    (acc, w) => acc + w.days.filter((d) => !d.rest).length,
    0
  ) || 0

  return (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-indigo-300">{program.name}</h3>
          <p className="text-xs text-gray-400">
            {program.type === 'weekly' ? 'Programma settimanale' : 'Programma mensile'} •{' '}
            {totalDays} giorni attivi
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-400 text-xs hover:text-blue-300"
          >
            ✏️ Modifica
          </button>
          <button
            onClick={() => {
              if (confirm('Eliminare questo programma?')) onDelete()
            }}
            className="text-red-400 text-xs hover:text-red-300"
          >
            🗑 Elimina
          </button>
        </div>
      </div>
      {program.description && (
        <p className="text-sm text-gray-300 mt-2">{program.description}</p>
      )}
    </div>
  )
}

function ProgramBuilder({ program, onSave, onCancel }) {
  const [name, setName] = useState(program?.name || '')
  const [description, setDescription] = useState(program?.description || '')
  const [type, setType] = useState(program?.type || 'weekly')
  const [weeks, setWeeks] = useState(
    program?.weeks || [{ id: Date.now(), days: createEmptyWeek() }]
  )
  const [currentWeek, setCurrentWeek] = useState(0)

  const handleSave = () => {
    if (!name.trim()) {
      alert('Inserisci un nome per il programma')
      return
    }
    onSave({ name: name.trim(), description, type, weeks })
  }

  const addWeek = () => {
    setWeeks([...weeks, { id: Date.now(), days: createEmptyWeek() }])
  }

  const updateDay = (weekIdx, dayIdx, data) => {
    const newWeeks = [...weeks]
    newWeeks[weekIdx].days[dayIdx] = { ...newWeeks[weekIdx].days[dayIdx], ...data }
    setWeeks(newWeeks)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-gray-900 rounded-2xl p-5 max-w-lg w-full my-8">
        <h2 className="text-xl font-bold text-indigo-300 mb-4">
          {program ? 'Modifica programma' : 'Nuovo programma'}
        </h2>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-sm text-gray-400">Nome programma</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. Forza 5x5"
              className="w-full bg-gray-800 rounded-lg p-2 text-white mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Descrizione (opzionale)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Obiettivi, note..."
              rows={2}
              className="w-full bg-gray-800 rounded-lg p-2 text-white mt-1 resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Tipo</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-gray-800 rounded-lg p-2 text-white mt-1"
            >
              <option value="weekly">Settimanale (1 settimana)</option>
              <option value="monthly">Mensile (4 settimane)</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-300">
              Settimana {currentWeek + 1} di {weeks.length}
            </h3>
            <div className="flex gap-2">
              {currentWeek > 0 && (
                <button
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="px-2 py-1 bg-gray-700 rounded text-xs"
                >
                  ◀ Prec
                </button>
              )}
              {currentWeek < weeks.length - 1 && (
                <button
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="px-2 py-1 bg-gray-700 rounded text-xs"
                >
                  Succ ▶
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {DAYS.map((day, idx) => (
              <DayEditor
                key={idx}
                day={day}
                data={weeks[currentWeek].days[idx]}
                onChange={(data) => updateDay(currentWeek, idx, data)}
              />
            ))}
          </div>

          {type === 'monthly' && weeks.length < 4 && (
            <button
              onClick={addWeek}
              className="w-full mt-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              + Aggiungi settimana
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold"
          >
            💾 Salva
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  )
}

function DayEditor({ day, data, onChange }) {
  const [expanded, setExpanded] = useState(false)
  const [newEx, setNewEx] = useState('')

  const addExercise = () => {
    if (!newEx.trim()) return
    onChange({
      rest: false,
      exercises: [...data.exercises, { name: newEx.trim(), sets: 3, reps: 10 }]
    })
    setNewEx('')
  }

  const removeExercise = (idx) => {
    const newExercises = data.exercises.filter((_, i) => i !== idx)
    onChange({ ...data, exercises: newExercises, rest: newExercises.length === 0 })
  }

  return (
    <div className="bg-gray-800 rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <span className="font-medium text-sm">
          {day} {data.rest ? '🛌 Riposo' : `💪 ${data.exercises.length} es.`}
        </span>
        <span className="text-gray-500">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={data.rest}
              onChange={(e) => onChange({ ...data, rest: e.target.checked })}
              className="rounded"
            />
            Giorno di riposo
          </label>

          {!data.rest && (
            <>
              <div className="space-y-1">
                {data.exercises.map((ex, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-700 rounded px-2 py-1 text-xs">
                    <span>{ex.name}</span>
                    <span className="text-gray-400">
                      {ex.sets}x{ex.reps}
                    </span>
                    <button
                      onClick={() => removeExercise(idx)}
                      className="text-red-400 ml-2"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEx}
                  onChange={(e) => setNewEx(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addExercise()}
                  placeholder="Nuovo esercizio..."
                  className="flex-1 bg-gray-700 rounded px-2 py-1 text-xs"
                />
                <button
                  onClick={addExercise}
                  className="px-2 py-1 bg-indigo-600 rounded text-xs"
                >
                  +
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}