import { cn } from '../../lib/cn'

export function Marca({ className, tamanoTexto = 'text-xl' }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-600 shadow-sm shadow-primary-600/30">
        <svg viewBox="0 0 48 48" fill="none" className="size-5">
          <ellipse cx="24" cy="30" rx="10" ry="8.5" fill="#fff" />
          <ellipse cx="12.5" cy="18" rx="4.2" ry="5.4" fill="#fff" />
          <ellipse cx="22" cy="13" rx="4.2" ry="5.6" fill="#fff" />
          <ellipse cx="32" cy="13" rx="4.2" ry="5.6" fill="#fff" />
          <ellipse cx="35.5" cy="18" rx="4.2" ry="5.4" fill="#fff" />
        </svg>
      </div>
      <span className={cn('font-heading text-ink', tamanoTexto)}>
        DOG<span className="text-primary-600">·</span>ATO
      </span>
    </div>
  )
}
