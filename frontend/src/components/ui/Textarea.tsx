import { forwardRef, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className = '', ...props },
  ref,
) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-slate-600">{label}</label>}
      <textarea
        ref={ref}
        rows={3}
        className={`rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 ${
          error ? 'border-red-400' : 'border-slate-300 focus:border-blue-400'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  )
})
