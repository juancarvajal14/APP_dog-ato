import { Ban, CheckCircle2, Circle, Clock3, ShieldCheck, Stethoscope } from 'lucide-react'
import { cn } from '../../lib/cn'

const tonos = {
  neutral: 'bg-sand text-ink-soft',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  primary: 'bg-primary-100 text-primary-700',
}

export function Badge({ children, tono = 'neutral', icon: Icon, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        tonos[tono],
        className,
      )}
    >
      {Icon && <Icon className="size-3.5" />}
      {children}
    </span>
  )
}

const estadosCita = {
  pendiente: { tono: 'warning', icon: Clock3, texto: 'Pendiente' },
  completada: { tono: 'success', icon: CheckCircle2, texto: 'Completada' },
  cancelada: { tono: 'danger', icon: Ban, texto: 'Cancelada' },
}

export function BadgeEstadoCita({ estado }) {
  const config = estadosCita[estado] ?? estadosCita.pendiente
  return (
    <Badge tono={config.tono} icon={config.icon}>
      {config.texto}
    </Badge>
  )
}

export function BadgeActivo({ activo }) {
  return activo ? (
    <Badge tono="success" icon={Circle}>
      Activo
    </Badge>
  ) : (
    <Badge tono="neutral" icon={Circle}>
      Inactivo
    </Badge>
  )
}

export function BadgeRol({ rol }) {
  return rol === 'administrador' ? (
    <Badge tono="primary" icon={ShieldCheck}>
      Administrador
    </Badge>
  ) : (
    <Badge tono="neutral" icon={Stethoscope}>
      Veterinario
    </Badge>
  )
}
