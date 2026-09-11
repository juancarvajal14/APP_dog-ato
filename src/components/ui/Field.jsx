import { cn } from '../../lib/cn'

const estiloBase =
  'w-full rounded-xl border border-sand-dark bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100'

export function Label({ children, requerido, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
      {children}
      {requerido && <span className="ml-0.5 text-accent-dark">*</span>}
    </label>
  )
}

export function Input({ className, ...props }) {
  return <input className={cn(estiloBase, className)} {...props} />
}

export function Textarea({ className, rows = 3, ...props }) {
  return <textarea rows={rows} className={cn(estiloBase, 'resize-none', className)} {...props} />
}

export function Select({ className, children, ...props }) {
  return (
    <select className={cn(estiloBase, 'cursor-pointer appearance-none bg-no-repeat', className)} {...props}>
      {children}
    </select>
  )
}

export function CampoAyuda({ children }) {
  return <p className="mt-1.5 text-xs text-ink-faint">{children}</p>
}

export function CampoError({ children }) {
  if (!children) return null
  return <p className="mt-1.5 text-xs font-medium text-danger">{children}</p>
}
