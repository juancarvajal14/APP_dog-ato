import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select, Textarea, CampoAyuda } from '../../components/ui/Field'
import { AlertaError } from '../../components/ui/Estados'
import { catalogoPropietarios, catalogoVeterinarios, crearCita } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'

function Formulario({ onCerrar, onGuardado }) {
  const { datos: propietarios, error: errorPropietarios } = useRecurso(catalogoPropietarios)
  const { datos: veterinarios, error: errorVeterinarios } = useRecurso(catalogoVeterinarios)

  const [propietarioId, setPropietarioId] = useState('')
  const [form, setForm] = useState({ mascota_id: '', veterinario_id: '', fecha: '', motivo_consulta: '' })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  // Los valores elegidos se validan contra las listas cargadas; si no hay elección, se usa la primera opción.
  const propietario = propietarios.find((p) => p.id === Number(propietarioId)) ?? propietarios[0]
  const mascotas = propietario?.mascotas ?? []
  const mascotaId = mascotas.some((m) => m.id === Number(form.mascota_id)) ? form.mascota_id : (mascotas[0]?.id ?? '')
  const veterinarioId = form.veterinario_id || veterinarios[0]?.id || ''
  const sinMascotas = mascotas.length === 0

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await crearCita({
        mascota_id: Number(mascotaId),
        veterinario_id: Number(veterinarioId),
        fecha: form.fecha,
        motivo_consulta: form.motivo_consulta,
      })
      onGuardado()
      onCerrar()
    } catch (falla) {
      setError(falla.message)
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      <div>
        <Label htmlFor="propietario" requerido>
          Propietario
        </Label>
        <Select id="propietario" required value={propietario?.id ?? ''} onChange={(e) => setPropietarioId(e.target.value)}>
          {propietarios.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellido}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="mascota" requerido>
          Mascota
        </Label>
        <Select id="mascota" required disabled={sinMascotas} value={mascotaId} onChange={actualizar('mascota_id')}>
          {sinMascotas && <option value="">Este propietario no tiene mascotas</option>}
          {mascotas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre} · {m.especie}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="veterinario" requerido>
            Veterinario
          </Label>
          <Select id="veterinario" required value={veterinarioId} onChange={actualizar('veterinario_id')}>
            {veterinarios.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre} {v.apellido}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="fecha" requerido>
            Fecha y hora
          </Label>
          <Input id="fecha" type="datetime-local" required value={form.fecha} onChange={actualizar('fecha')} />
        </div>
      </div>

      <div>
        <Label htmlFor="motivo" requerido>
          Motivo de consulta
        </Label>
        <Textarea
          id="motivo"
          required
          value={form.motivo_consulta}
          onChange={actualizar('motivo_consulta')}
          placeholder="Describe brevemente la razón de la cita"
        />
        <CampoAyuda>Este motivo lo reporta quien trae la mascota, no es aún el diagnóstico.</CampoAyuda>
      </div>

      <AlertaError mensaje={error || errorPropietarios || errorVeterinarios} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={enviando} disabled={sinMascotas || veterinarios.length === 0}>
          Agendar cita
        </Button>
      </div>
    </form>
  )
}

export function CitaFormModal({ abierto, onCerrar, onGuardado }) {
  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Agendar cita"
      descripcion="La cita queda en estado pendiente hasta que se atienda."
    >
      <Formulario onCerrar={onCerrar} onGuardado={onGuardado} />
    </Modal>
  )
}
