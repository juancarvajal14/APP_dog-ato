import { useEffect, useMemo, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select, Textarea, CampoAyuda } from '../../components/ui/Field'
import { useData } from '../../context/DataContext'

export function CitaFormModal({ abierto, onCerrar, cita }) {
  const { propietarios, mascotasDe, veterinarios, usuarios, propietarioDe, agregarCita, editarCita } = useData()
  const editando = Boolean(cita)

  const veterinariosActivos = useMemo(
    () => veterinarios.filter((v) => usuarios.find((u) => u.documento === v.documento)?.activo),
    [veterinarios, usuarios],
  )

  const [propietarioId, setPropietarioId] = useState('')
  const [form, setForm] = useState({ mascota_id: '', veterinario_id: '', fecha: '', motivo_consulta: '' })

  useEffect(() => {
    if (!abierto) return
    if (cita) {
      const propietario = propietarioDe(cita.mascota_id)
      setPropietarioId(propietario?.id ?? '')
      setForm({
        mascota_id: cita.mascota_id,
        veterinario_id: cita.veterinario_id,
        fecha: cita.fecha,
        motivo_consulta: cita.motivo_consulta,
      })
      return
    }
    const primerPropietario = propietarios[0]?.id ?? ''
    setPropietarioId(primerPropietario)
    setForm({
      mascota_id: mascotasDe(primerPropietario)[0]?.id ?? '',
      veterinario_id: veterinariosActivos[0]?.id ?? '',
      fecha: '',
      motivo_consulta: '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, cita])

  const mascotasDelPropietario = mascotasDe(Number(propietarioId))

  const cambiarPropietario = (evento) => {
    const id = evento.target.value
    setPropietarioId(id)
    setForm((f) => ({ ...f, mascota_id: mascotasDe(Number(id))[0]?.id ?? '' }))
  }

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    const datos = {
      mascota_id: Number(form.mascota_id),
      veterinario_id: Number(form.veterinario_id),
      fecha: form.fecha,
      motivo_consulta: form.motivo_consulta,
    }
    if (editando) {
      editarCita(cita.id, datos)
    } else {
      agregarCita(datos)
    }
    onCerrar()
  }

  const sinMascotas = mascotasDelPropietario.length === 0

  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo={editando ? 'Editar cita' : 'Agendar cita'}
      descripcion={editando ? 'Actualiza los datos de esta cita pendiente.' : 'La cita queda en estado pendiente hasta que se atienda.'}
    >
      <form onSubmit={manejarEnvio} className="space-y-4">
        <div>
          <Label htmlFor="propietario" requerido>
            Propietario
          </Label>
          <Select id="propietario" required value={propietarioId} onChange={cambiarPropietario}>
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
          <Select id="mascota" required disabled={sinMascotas} value={form.mascota_id} onChange={actualizar('mascota_id')}>
            {sinMascotas && <option value="">Este propietario no tiene mascotas</option>}
            {mascotasDelPropietario.map((m) => (
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
            <Select id="veterinario" required value={form.veterinario_id} onChange={actualizar('veterinario_id')}>
              {veterinariosActivos.map((v) => (
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

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" disabled={sinMascotas}>
            {editando ? 'Guardar cambios' : 'Agendar cita'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
