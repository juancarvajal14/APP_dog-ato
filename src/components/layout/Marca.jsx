import { cn } from '../../lib/cn'

export function Marca({ className, tamanoTexto = 'text-xl' }) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-600 shadow-sm shadow-primary-600/30">
        <img
          src="/logo_dog-ato.jpeg"
          alt="DOG-ATO"
          className="size-full object-cover"
        />
      </div>
      <span className={cn('font-heading text-ink', tamanoTexto)}>
        DOG<span className="text-primary-600">·</span>ATO
      </span>
    </div>
  )
}
