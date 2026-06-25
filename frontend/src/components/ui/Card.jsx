import clsx from 'clsx'
export default function Card({ children, className, ...props }) {
  return <div className={clsx('glass rounded-2xl p-5', className)} {...props}>{children}</div>
}
