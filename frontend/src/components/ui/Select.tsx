import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, className = '', children, ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-600">{label}</label>}
      <select
        ref={ref}
        className={`rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 ${
          error ? 'border-red-400' : 'border-slate-300 focus:border-blue-400'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
})
