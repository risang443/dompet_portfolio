import clsx from 'clsx'
const colors = {
  green:  'bg-green-500/10 text-green-400 border border-green-500/20',
  red:    'bg-red-500/10 text-red-400 border border-red-500/20',
  blue:   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
}
export default function Badge({ children, color = 'blue' }) {
  return <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', colors[color])}>{children}</span>
}
