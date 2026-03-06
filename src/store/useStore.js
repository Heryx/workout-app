import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const initialSession = () => ({
  id: null,
  date: '',
  exercises: [],
  notes: '',
  duration: 0
})

export const useStore = create(
  persist(
    (set, get) => ({
      // ─── SESSIONE ATTIVA ──────────────────────────────
      session: initialSession(),
      sessionStart: null,

      startSession: (date) => set({
        session: { ...initialSession(), id: Date.now(), date },
        sessionStart: Date.now()
      }),

      addExercise: (name) => set(s => ({
        session: {
          ...s.session,
          exercises: [...s.session.exercises, { id: Date.now(), name, sets: [] }]
        }
      })),

      removeExercise: (exId) => set(s => ({
        session: {
          ...s.session,
          exercises: s.session.exercises.filter(e => e.id !== exId)
        }
      })),

      addSet: (exId, setData) => set(s => ({
        session: {
          ...s.session,
          exercises: s.session.exercises.map(e =>
            e.id === exId
              ? { ...e, sets: [...e.sets, { id: Date.now(), ...setData }] }
              : e
          )
        }
      })),

      removeSet: (exId, setId) => set(s => ({
        session: {
          ...s.session,
          exercises: s.session.exercises.map(e =>
            e.id === exId
              ? { ...e, sets: e.sets.filter(ss => ss.id !== setId) }
              : e
          )
        }
      })),

      updateSessionNotes: (notes) => set(s => ({
        session: { ...s.session, notes }
      })),

      // ─── STORICO ─────────────────────────────────────
      history: [],

      saveSession: () => {
        const { session, sessionStart, history } = get()
        if (!session.exercises.length) return false
        const duration = sessionStart ? Math.round((Date.now() - sessionStart) / 60000) : 0
        const completed = { ...session, duration, savedAt: Date.now() }
        set({
          history: [completed, ...history],
          session: initialSession(),
          sessionStart: null
        })
        get()._updatePRs(completed)
        return true
      },

      deleteSession: (id) => set(s => ({
        history: s.history.filter(h => h.id !== id)
      })),

      clearHistory: () => set({ history: [], prs: {} }),

      // ─── PERSONAL RECORDS ────────────────────────────
      prs: {},

      _updatePRs: (session) => {
        const prs = { ...get().prs }
        session.exercises.forEach(ex => {
          ex.sets.forEach(s => {
            if (s.weight > 0) {
              const key = ex.name.toLowerCase()
              if (!prs[key] || s.weight > prs[key].weight) {
                prs[key] = {
                  name: ex.name,
                  weight: s.weight,
                  reps: s.reps,
                  date: session.date
                }
              }
            }
          })
        })
        set({ prs })
      },

      // ─── PROGRAMMI ───────────────────────────────────
      // Programma: { id, name, type:'weekly'|'monthly', weeks:[ { days:[{rest,exercises}] } ] }
      programs: [],

      addProgram: (prog) => set(s => ({
        programs: [...s.programs, { ...prog, id: Date.now() }]
      })),

      updateProgram: (id, prog) => set(s => ({
        programs: s.programs.map(p => (p.id === id ? { ...p, ...prog } : p))
      })),

      deleteProgram: (id) => set(s => ({
        programs: s.programs.filter(p => p.id !== id)
      })),

      // ─── SETTINGS ─────────────────────────────────────
      settings: {
        weeklyGoal: 3,
        weightUnit: 'kg',
        theme: 'dark'
      },

      updateSettings: (s) => set(prev => ({
        settings: { ...prev.settings, ...s }
      }))
    }),
    {
      name: 'workout-app-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)