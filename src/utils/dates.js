import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  getISOWeek,
  getYear,
  startOfMonth,
  endOfMonth
} from 'date-fns'
import { it } from 'date-fns/locale'

export const fmt = (d, f = 'yyyy-MM-dd') => format(d, f)
export const today = () => fmt(new Date())

export const weekKey = (d = new Date()) =>
  `${getYear(d)}-W${String(getISOWeek(d)).padStart(2, '0')}`

export const weekDays = (d = new Date()) =>
  eachDayOfInterval({
    start: startOfWeek(d, { weekStartsOn: 1 }),
    end: endOfWeek(d, { weekStartsOn: 1 })
  })

export const monthDays = (d = new Date()) =>
  eachDayOfInterval({
    start: startOfMonth(d),
    end: endOfMonth(d)
  })

export const fmtLabel = (d) => format(new Date(d), 'd MMM', { locale: it })

export const fmtTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}