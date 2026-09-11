import { cn } from '../../lib/cn'

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn('rounded-2xl border border-sand bg-white shadow-sm shadow-ink/[0.03]', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function StatCard({ icono: Icono, etiqueta, valor, tono = 'primary' }) {
  const tonos = {
    primary: 'bg-primary-50 text-primary-700',
    accent: 'bg-accent-soft text-accent-dark',
    success: 'bg-success-soft text-success',
    warning: 'bg-warning-soft text-warning',
  }
  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', tonos[tono])}>
        <Icono className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-ink-soft">{etiqueta}</p>
        <p className="font-heading text-2xl text-ink">{valor}</p>
      </div>
    </Card>
  )
}
