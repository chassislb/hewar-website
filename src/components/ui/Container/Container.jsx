import { cn } from '../../../utils/cn'
import styles from './Container.module.css'

const Container = ({ children, className, size = 'default', as: Tag = 'div', ...props }) => {
  return (
    <Tag className={cn(styles.container, styles[size], className)} {...props}>
      {children}
    </Tag>
  )
}

export default Container
