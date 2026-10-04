import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select } from '../../components/ui/Field'
import { AlertaError } from '../../components/ui/Estados'
import { catalogoPropietarios, crearMascota } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'

const vacio = { nombre: '', especie: 'Perro', raza: '', sexo: 'macho', fecha_nacimiento: '', propietario_id: '' }

function Formulario({ onCerrar, onGuardado }) {
  const { datos: propietarios, error: errorCarga } = useRecurso(catalogoPropietarios)
  const [form, setForm] = useState(vacio)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))
  const propietarioSeleccionado = form.propietario_id || propietarios[0]?.id || ''

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await crearMascota({ ...form, propietario_id: Number(propietarioSeleccionado) })
      onGuardado()
      onCerrar()
    } catch (falla) {
      setError(falla.message)
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre" requerido>
            Nombre
          </Label>
          <Input id="nombre" required value={form.nombre} onChange={actualizar('nombre')} placeholder="Rocco" />
        </div>
        <div>
          <Label htmlFor="especie" requerido>
            Especie
          </Label>
          <Select id="especie" value={form.especie} onChange={actualizar('especie')}>
            {['Perro', 'Gato', 'Ave', 'Conejo', 'Otro'].map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="raza">Raza</Label>
          <Input id="raza" value={form.raza} onChange={actualizar('raza')} placeholder="Labrador" />
        </div>
        <div>
          <Label htmlFor="sexo" requerido>
            Sexo
          </Label>
          <Select id="sexo" value={form.sexo} onChange={actualizar('sexo')}>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
          <Input id="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={actualizar('fecha_nacimiento')} />
        </div>
        <div>
          <Label htmlFor="propietario_id" requerido>
            Propietario
          </Label>
          <Select id="propietario_id" required value={propietarioSeleccionado} onChange={actualizar('propietario_id')}>
            {propietarios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellido}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <AlertaError mensaje={error || errorCarga} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={enviando} disabled={propietarios.length === 0}>
          Registrar mascota
        </Button>
      </div>
    </form>
  )
}

export function MascotaFormModal({ abierto, onCerrar, onGuardado }) {
  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Registrar mascota"
      descripcion="La mascota siempre queda asociada a un propietario existente."
    >
      <Formulario onCerrar={onCerrar} onGuardado={onGuardado} />
    </Modal>
  )
}
