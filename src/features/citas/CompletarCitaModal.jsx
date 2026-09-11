import { useEffect, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Textarea } from '../../components/ui/Field'
import { useData } from '../../context/DataContext'
import { formatearFechaHora } from '../../lib/fechas'

const vacio = { diagnostico: '', tratamiento: '', observaciones: '' }

export function CompletarCitaModal({ cita, onCerrar }) {
  const { mascotas, veterinarios, completarCita } = useData()
  const [form, setForm] = useState(vacio)

  useEffect(() => {
    if (cita) setForm(vacio)
  }, [cita])

  if (!cita) return null

  const mascota = mascotas.find((m) => m.id === cita.mascota_id)
  const veterinario = veterinarios.find((v) => v.id === cita.veterinario_id)

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    completarCita(cita.id, form)
    onCerrar()
  }

  return (
    <Modal
      abierto={Boolean(cita)}
      onCerrar={onCerrar}
      titulo="Completar atención"
      descripcion="Esto genera el registro de historial clínico para esta cita."
    >
      <div className="mb-4 rounded-xl bg-cream-soft/70 p-3.5 text-sm">
        <p className="font-semibold text-ink">
          {mascota?.nombre} · {veterinario?.nombre} {veterinario?.apellido}
        </p>
        <p className="mt-0.5 text-ink-soft">{formatearFechaHora(cita.fecha)}</p>
        <p className="mt-1 text-ink-faint">Motivo: {cita.motivo_consulta}</p>
      </div>

      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <Label htmlFor="diagnostico" requerido>
            Diagnóstico
          </Label>
          <Textarea id="diagnostico" required value={form.diagnostico} onChange={actualizar('diagnostico')} />
        </div>
        <div>
          <Label htmlFor="tratamiento">Tratamiento</Label>
          <Textarea id="tratamiento" value={form.tratamiento} onChange={actualizar('tratamiento')} />
        </div>
        <div>
          <Label htmlFor="observaciones">Recomendaciones / seguimiento</Label>
          <Textarea id="observaciones" value={form.observaciones} onChange={actualizar('observaciones')} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" variant="accent">
            Marcar como completada
          </Button>
        </div>
      </form>
    </Modal>
  )
}
