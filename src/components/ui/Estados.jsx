import { AlertTriangle, CheckCircle2, Loader2, X } from 'lucide-react'
import { Button } from './Button'

export function Cargando({ texto = 'Cargando...' }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-sm text-ink-soft">
      <Loader2 className="size-4 animate-spin" />
      {texto}
    </div>
  )
}

// Error al cargar una pantalla completa, con opción de reintentar.
export function ErrorCarga({ mensaje, onReintentar }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-danger/40 bg-danger-soft/40 px-6 py-12 text-center">
      <AlertTriangle className="size-7 text-danger" />
      <p className="max-w-sm text-sm text-ink-soft">{mensaje}</p>
      {onReintentar && (
        <Button variant="secondary" size="sm" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  )
}

// Error de una acción puntual (guardar, cancelar...) mostrado sobre el contenido.
export function AlertaError({ mensaje, onCerrar }) {
  if (!mensaje) return null
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1 font-medium">{mensaje}</p>
      {onCerrar && (
        <button type="button" onClick={onCerrar} aria-label="Cerrar aviso" className="cursor-pointer">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

// Confirmación de una acción exitosa.
export function AvisoExito({ mensaje, onCerrar }) {
  if (!mensaje) return null
  return (
    <div role="status" className="flex items-start gap-2.5 rounded-xl bg-success-soft px-4 py-3 text-sm text-success">
      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      <p className="flex-1 font-medium">{mensaje}</p>
      {onCerrar && (
        <button type="button" onClick={onCerrar} aria-label="Cerrar aviso" className="cursor-pointer">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
