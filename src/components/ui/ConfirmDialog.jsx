import { AlertTriangle } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

export function ConfirmDialog({
  abierto,
  onCerrar,
  onConfirmar,
  titulo,
  descripcion,
  textoConfirmar = 'Confirmar',
  variante = 'danger',
}) {
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo={titulo} ancho="max-w-md">
      <div className="flex gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle className="size-5" />
        </div>
        <p className="text-sm text-ink-soft">{descripcion}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button
          variant={variante}
          onClick={() => {
            onConfirmar()
            onCerrar()
          }}
        >
          {textoConfirmar}
        </Button>
      </div>
    </Modal>
  )
}
