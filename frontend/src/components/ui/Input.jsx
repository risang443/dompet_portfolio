import clsx from 'clsx'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-zinc-400">{label}</label>}
      <input
        className={clsx(
          'w-full px-4 py-2.5 rounded-xl glass text-zinc-100 placeholder-zinc-600',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/50',
          'transition-all duration-200',
          error && 'ring-2 ring-red-500/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
