/*
  Careers page sound engine (Web Audio, no files).
  Browsers only allow audio after a click, tap or key press, so nothing plays until unlock() runs from one.
  Every sound is synthesized and short; all of it routes through one gain + a soft echo.
*/
let ac = null
let out = null
let soundOn = true
let hum = null
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn(state()))

export const state = () => ({ on: soundOn, running: !!ac && ac.state === 'running' })
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }

const audio = () => {
  if (ac || !soundOn) return ac
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ac = new AC()
  out = ac.createGain(); out.gain.value = 0.22
  const dl = ac.createDelay(1), fb = ac.createGain(), wet = ac.createGain()
  dl.delayTime.value = 0.23; fb.gain.value = 0.3; wet.gain.value = 0.25
  out.connect(ac.destination); out.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(ac.destination)
  ac.onstatechange = emit
  return ac
}
export const ready = () => soundOn && !!ac && ac.state === 'running'
export const unlock = () => {
  if (!soundOn) return
  audio()
  if (ac && ac.state === 'suspended') ac.resume()
  emit()
}
export const toggle = () => {
  soundOn = !soundOn
  if (soundOn) unlock()
  else if (ac) ac.suspend()
  emit()
}

export const SCALE = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24]
export const hz = (n) => 220 * Math.pow(2, n / 12)
const env = (node, t, a, peak, d) => {
  node.gain.setValueAtTime(0.0001, t)
  node.gain.linearRampToValueAtTime(peak, t + a)
  node.gain.exponentialRampToValueAtTime(0.0001, t + a + d)
}
export const tone = (f, type, peak, d, t = ac.currentTime, sweep = 0, attack = 0.005) => {
  const os = ac.createOscillator(), gn = ac.createGain()
  os.type = type; os.frequency.setValueAtTime(f, t)
  if (sweep) os.frequency.exponentialRampToValueAtTime(f * sweep, t + attack + d)
  env(gn, t, attack, peak, d); os.connect(gn); gn.connect(out); os.start(t); os.stop(t + attack + d + 0.05)
}
const noise = (peak, d, f0, t = ac.currentTime, kind = 'highpass', f1 = 0, q = 0.7, attack = 0) => {
  const len = Math.ceil(ac.sampleRate * (d + attack)), buf = ac.createBuffer(1, len, ac.sampleRate), ch = buf.getChannelData(0)
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1
  const src = ac.createBufferSource(), f = ac.createBiquadFilter(), gn = ac.createGain()
  src.buffer = buf; f.type = kind; f.Q.value = q; f.frequency.setValueAtTime(f0, t)
  if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + attack + d)
  env(gn, t, Math.max(attack, 0.002), peak, d)
  src.connect(f); f.connect(gn); gn.connect(out); src.start(t); src.stop(t + attack + d + 0.05)
}

/* sounds that mean something */
export const SFX = {
  tick: (f = 1318, p = 0.05) => ready() && tone(f, 'sine', p, 0.07),
  key: (soft) => { if (!ready()) return; noise(soft ? 0.18 : 0.32, 0.03, 2200 + Math.random() * 800); tone(140 + Math.random() * 40, 'sine', soft ? 0.05 : 0.1, 0.04) },
  whoosh: (up = true, p = 0.25) => ready() && noise(p, 0.55, up ? 300 : 3000, ac.currentTime, 'bandpass', up ? 3500 : 250, 1.2, 0.12),
  /* the idea: a lightbulb "ding" */
  idea: () => { if (!ready()) return; const t = ac.currentTime; tone(1318, 'sine', 0.22, 1.4, t); tone(1975, 'sine', 0.12, 1.6, t + 0.04); tone(2637, 'sine', 0.05, 1.2, t + 0.08) },
  /* the voice: a short sung "ahh" (three formants) */
  voice: () => {
    if (!ready()) return
    const t = ac.currentTime
    ;[[700, 0.5], [1150, 0.3], [2600, 0.12]].forEach(([fq, g]) => {
      const os = ac.createOscillator(), bp = ac.createBiquadFilter(), gn = ac.createGain()
      os.type = 'sawtooth'; os.frequency.setValueAtTime(165, t); os.frequency.linearRampToValueAtTime(196, t + 0.5)
      bp.type = 'bandpass'; bp.frequency.value = fq; bp.Q.value = 9; env(gn, t, 0.08, g * 0.5, 0.55)
      os.connect(bp); bp.connect(gn); gn.connect(out); os.start(t); os.stop(t + 0.7)
    })
  },
  /* the tech: quick digital bleeps */
  tech: () => { if (!ready()) return; const t = ac.currentTime; [0, 7, 12, 19, 24].forEach((n, i) => tone(hz(n + 24), 'square', 0.05, 0.06, t + i * 0.055)) },
  /* the stage: a spotlight "clunk" and a crowd swelling */
  stage: () => { if (!ready()) return; const t = ac.currentTime; tone(70, 'sine', 0.5, 0.35, t, 0.6); noise(0.4, 0.08, 400, t, 'lowpass'); noise(0.12, 1.4, 900, t + 0.15, 'bandpass', 1400, 0.8, 0.4) },
  /* the headline: typewriter burst, then the bell */
  headline: () => { if (!ready()) return; const t = ac.currentTime; for (let i = 0; i < 6; i++) noise(0.3, 0.03, 2500, t + i * 0.07 + Math.random() * 0.02); tone(2349, 'sine', 0.2, 1, t + 0.5); tone(2793, 'sine', 0.08, 0.9, t + 0.5) },
  /* next: a rising whoosh that lands on a chord */
  next: () => { if (!ready()) return; const t = ac.currentTime; noise(0.22, 0.7, 250, t, 'bandpass', 4000, 1, 0.2); [0, 4, 7, 12].forEach((n, i) => tone(hz(n + 12), 'triangle', 0.1, 1.4, t + 0.6 + i * 0.03)) },
  flurry: (n = 8) => { if (!ready()) return; const t = ac.currentTime; for (let i = 0; i < n; i++) noise(0.06, 0.02, 4000, t + i * 0.03 + Math.random() * 0.02) },
  error: () => { if (!ready()) return; const t = ac.currentTime; tone(130, 'square', 0.08, 0.12, t); tone(110, 'square', 0.08, 0.18, t + 0.14) },
  attach: () => { if (!ready()) return; const t = ac.currentTime; noise(0.2, 0.25, 800, t, 'bandpass', 3000, 0.9, 0.05); tone(880, 'sine', 0.15, 0.2, t + 0.25, 1.5) },
  success: () => { if (!ready()) return; const t = ac.currentTime; [0, 4, 7, 12, 16, 19, 24].forEach((n, i) => tone(hz(n + 12), 'sine', 0.12, 1.6, t + i * 0.08)); noise(0.1, 1.2, 6000, t + 0.3) },
  /* soft chime when you hover the hologram; pitch picked from the piece */
  chime: (seed) => { if (!ready()) return; const t = ac.currentTime; tone(hz(SCALE[(seed >>> 3) % SCALE.length] + 24), 'sine', 0.08, 0.9, t); tone(hz(SCALE[(seed >>> 6) % SCALE.length] + 31), 'sine', 0.04, 1.1, t + 0.05) },
}

/* a warm lamp hum while the stage spotlight is on */
export const humTo = (v) => {
  if (!ready()) return
  if (!hum) {
    const os = ac.createOscillator(), lp = ac.createBiquadFilter(), gn = ac.createGain()
    os.type = 'sawtooth'; os.frequency.value = 100; lp.type = 'lowpass'; lp.frequency.value = 320; gn.gain.value = 0
    os.connect(lp); lp.connect(gn); gn.connect(out); os.start(); hum = gn
  }
  hum.gain.setTargetAtTime(v, ac.currentTime, 0.25)
}
