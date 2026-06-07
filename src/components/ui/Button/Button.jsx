import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { cn } from '../../../utils/cn'
import styles from './Button.module.css'

const MotionLink = motion.create(Link)

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  href,
  external,
  onClick,
  className,
  disabled,
  ...props
}, ref) => {
  const classes = cn(styles.button, styles[variant], styles[size], disabled && styles.disabled, className)

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.02 },
    whileTap:   disabled ? {} : { scale: 0.97 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  }

  if (external) {
    return (
      <motion.a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        {...motionProps}
        {...props}
      >
        <span className={styles.inner}>
          {children}
          <span className={styles.arrow}>↗</span>
        </span>
        <span className={styles.shimmer} aria-hidden />
      </motion.a>
    )
  }

  if (href) {
    return (
      <MotionLink
        ref={ref}
        to={href}
        className={classes}
        {...motionProps}
        {...props}
      >
        <span className={styles.inner}>{children}</span>
        <span className={styles.shimmer} aria-hidden />
      </MotionLink>
    )
  }

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...motionProps}
      {...props}
    >
      <span className={styles.inner}>{children}</span>
      <span className={styles.shimmer} aria-hidden />
    </motion.button>
  )
})

Button.displayName = 'Button'
export default Button
