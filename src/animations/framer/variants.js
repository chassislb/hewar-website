/* Shared Framer Motion variants — import and spread into motion components */

export const fadeUp = {
  hidden:  { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden:  {},
  visible: { transition: { staggerChildren, delayChildren } },
})

export const slideInLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const cardHover = {
  rest:  { scale: 1,    y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}
