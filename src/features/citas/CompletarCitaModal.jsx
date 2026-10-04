import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Textarea } from '../../components/ui/Field'
import { AlertaError } from '../../components/ui/Estados'
import { completarCita } from '../../api/recursos'
import { formatearFechaHora } from '../../lib/fechas'

const vacio = { diagnostico: '', tratamiento: '', observaciones: '' }

function Formulario({ cita, onCerrar, onGuardado }) {
  const [form, setForm] = useState(vacio)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await completarCita(cita.id, form)
      onGuardado()
      onCerrar()
    } catch (falla) {
      setError(falla.message)
      setEnviando(false)
    }
  }

  return (
    <>
      <div className="mb-4 rounded-xl bg-cream-soft/70 p-3.5 text-sm">
        <p className="font-semibold text-ink">
          {cita.mascota.nombre} · {cita.veterinario.nombre} {cita.veterinario.apellido}
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

        <AlertaError mensaje={error} />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" variant="accent" isLoading={enviando}>
            Marcar como completada
          </Button>
        </div>
      </form>
    </>
  )
}

export function CompletarCitaModal({ cita, onCerrar, onGuardado }) {
  return (
    <Modal
      abierto={Boolean(cita)}
      onCerrar={onCerrar}
      titulo="Completar atención"
      descripcion="Esto genera el registro de historial clínico para esta cita."
    >
      {cita && <Formulario cita={cita} onCerrar={onCerrar} onGuardado={onGuardado} />}
    </Modal>
  )
}
