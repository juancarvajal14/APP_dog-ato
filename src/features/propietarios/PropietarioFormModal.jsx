import { useEffect, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input } from '../../components/ui/Field'
import { useData } from '../../context/DataContext'

const vacio = { nombre: '', apellido: '', documento: '', telefono: '', email: '', direccion: '' }

export function PropietarioFormModal({ abierto, onCerrar }) {
  const { agregarPropietario } = useData()
  const [form, setForm] = useState(vacio)

  useEffect(() => {
    if (abierto) setForm(vacio)
  }, [abierto])

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    agregarPropietario(form)
    onCerrar()
  }

  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="Registrar propietario">
      <form onSubmit={manejarEnvio} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nombre" requerido>
              Nombre
            </Label>
            <Input id="nombre" required value={form.nombre} onChange={actualizar('nombre')} />
          </div>
          <div>
            <Label htmlFor="apellido" requerido>
              Apellido
            </Label>
            <Input id="apellido" required value={form.apellido} onChange={actualizar('apellido')} />
          </div>
        </div>

        <div>
          <Label htmlFor="documento" requerido>
            Documento
          </Label>
          <Input id="documento" required value={form.documento} onChange={actualizar('documento')} placeholder="Número de identificación" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" value={form.telefono} onChange={actualizar('telefono')} />
          </div>
          <div>
            <Label htmlFor="email">Correo</Label>
            <Input id="email" type="email" value={form.email} onChange={actualizar('email')} />
          </div>
        </div>

        <div>
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" value={form.direccion} onChange={actualizar('direccion')} />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit">Registrar propietario</Button>
        </div>
      </form>
    </Modal>
  )
}
