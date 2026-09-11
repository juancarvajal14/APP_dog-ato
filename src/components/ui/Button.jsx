import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/cn'

const variantes = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-300 shadow-sm shadow-primary-600/20',
  secondary: 'bg-white text-ink border border-sand-dark hover:bg-cream-soft focus-visible:ring-primary-200',
  ghost: 'bg-transparent text-ink-soft hover:bg-sand/60 focus-visible:ring-primary-200',
  danger: 'bg-danger text-white hover:bg-red-700 focus-visible:ring-red-300',
  accent: 'bg-accent text-white hover:bg-accent-dark focus-visible:ring-orange-200',
}

const tamanos = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-4 text-sm gap-2',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  isLoading = false,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 ease-out cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-4 active:scale-[0.97]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        variantes[variant],
        tamanos[size],
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
}
