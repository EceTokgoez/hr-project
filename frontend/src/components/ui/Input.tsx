import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-600">{label}</label>}
      <input
        ref={ref}
        className={`rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 ${
          error ? 'border-red-400' : 'border-slate-300 focus:border-blue-400'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
})
