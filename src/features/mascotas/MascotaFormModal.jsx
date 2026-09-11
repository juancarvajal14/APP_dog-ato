import { useEffect, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select } from '../../components/ui/Field'
import { useData } from '../../context/DataContext'

const vacio = { nombre: '', especie: 'Perro', raza: '', sexo: 'macho', fecha_nacimiento: '', propietario_id: '' }

export function MascotaFormModal({ abierto, onCerrar }) {
  const { propietarios, agregarMascota } = useData()
  const [form, setForm] = useState(vacio)

  useEffect(() => {
    if (abierto) setForm({ ...vacio, propietario_id: propietarios[0]?.id ?? '' })
  }, [abierto, propietarios])

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    agregarMascota({ ...form, propietario_id: Number(form.propietario_id) })
    onCerrar()
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Registrar mascota"
      descripcion="La mascota siempre queda asociada a un propietario existente."
    >
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
            <Input
              id="fecha_nacimiento"
              type="date"
              value={form.fecha_nacimiento}
              onChange={actualizar('fecha_nacimiento')}
            />
          </div>
          <div>
            <Label htmlFor="propietario_id" requerido>
              Propietario
            </Label>
            <Select id="propietario_id" required value={form.propietario_id} onChange={actualizar('propietario_id')}>
              {propietarios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellido}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit">Registrar mascota</Button>
        </div>
      </form>
    </Modal>
  )
}
