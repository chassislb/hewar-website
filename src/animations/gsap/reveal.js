import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Base defaults shared by all presets */
const BASE = {
  ease: 'power4.out',
  duration: 1,
}

/**
 * Slide up + fade in. Most common reveal.
 * @param {string|Element} target - GSAP selector or DOM element
 * @param {object}         opts   - overrides + ScrollTrigger config
 */
export const revealRise = (target, opts = {}) => {
  const { trigger, start = 'top 88%', stagger = 0, delay = 0, ...rest } = opts
  return gsap.from(target, {
    ...BASE,
    y: 60,
    opacity: 0,
    stagger,
    delay,
    scrollTrigger: {
      trigger: trigger || target,
      start,
      toggleActions: 'play none none none',
    },
    ...rest,
  })
}

/**
 * Slide in from left.
 */
export const revealDrift = (target, opts = {}) => {
  const { trigger, start = 'top 88%', ...rest } = opts
  return gsap.from(target, {
    ...BASE,
    x: -50,
    opacity: 0,
    scrollTrigger: { trigger: trigger || target, start, toggleActions: 'play none none none' },
    ...rest,
  })
}

/**
 * Scale up + fade in. Good for cards and images.
 */
export const revealEmerge = (target, opts = {}) => {
  const { trigger, start = 'top 88%', stagger = 0, ...rest } = opts
  return gsap.from(target, {
    ...BASE,
    scale: 0.88,
    opacity: 0,
    stagger,
    scrollTrigger: { trigger: trigger || target, start, toggleActions: 'play none none none' },
    ...rest,
  })
}

/**
 * Line-by-line text mask reveal.
 * Wrap each text line in: <span class="line-wrap"><span class="line-inner">text</span></span>
 * Then call revealLines('.line-inner', { trigger: containerEl })
 */
export const revealLines = (target, opts = {}) => {
  const { trigger, start = 'top 85%', stagger = 0.1, ...rest } = opts
  return gsap.from(target, {
    y: '110%',
    duration: 1.1,
    ease: 'power4.out',
    stagger,
    scrollTrigger: { trigger: trigger || target, start, toggleActions: 'play none none none' },
    ...rest,
  })
}

/**
 * Animated number counter (tick from 0 to value).
 */
export const revealCounter = (element, endValue, opts = {}) => {
  const { start = 'top 80%', suffix = '', duration = 2 } = opts
  const obj = { val: 0 }
  return gsap.to(obj, {
    val: endValue,
    duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start,
      toggleActions: 'play none none none',
    },
    onUpdate: () => {
      element.textContent = Math.round(obj.val) + suffix
    },
  })
}
