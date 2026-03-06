let ctx = null
const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

export function beep(freq = 880, duration = 0.15, vol = 0.3) {
  try {
    const c = getCtx()
    const o = c.createOscillator()
    const g = c.createGain()
    o.connect(g)
    g.connect(c.destination)
    o.frequency.value = freq
    g.gain.value = vol
    o.start()
    o.stop(c.currentTime + duration)
  } catch (e) {
    console.warn('Audio not available:', e)
  }
}

export const beepHigh = () => beep(1200, 0.1)
export const beepLow = () => beep(440, 0.3)
export const beepDone = () => {
  beep(880, 0.1)
  setTimeout(() => beep(1100, 0.2), 150)
}