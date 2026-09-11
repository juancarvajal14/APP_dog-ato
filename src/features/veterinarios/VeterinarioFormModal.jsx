import { useEffect, useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select, CampoAyuda } from '../../components/ui/Field'
import { useData } from '../../context/DataContext'

const vacio = {
  nombre: '',
  apellido: '',
  documento: '',
  telefono: '',
  direccion: '',
  email: '',
  password: '',
  rol: 'veterinario',
}

export function VeterinarioFormModal({ abierto, onCerrar }) {
  const { agregarVeterinario } = useData()
  const [form, setForm] = useState(vacio)

  useEffect(() => {
    if (abierto) setForm(vacio)
  }, [abierto])

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    agregarVeterinario(form)
    onCerrar()
  }

  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Registrar veterinario"
      descripcion="Se crea el perfil profesional junto con su cuenta de acceso."
    >
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="documento" requerido>
              Documento
            </Label>
            <Input id="documento" required value={form.documento} onChange={actualizar('documento')} />
          </div>
          <div>
            <Label htmlFor="telefono">Teléfono</Label>
            <Input id="telefono" value={form.telefono} onChange={actualizar('telefono')} />
          </div>
        </div>

        <div>
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" value={form.direccion} onChange={actualizar('direccion')} />
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-sand pt-4">
          <div>
            <Label htmlFor="email" requerido>
              Correo de acceso
            </Label>
            <Input id="email" type="email" required value={form.email} onChange={actualizar('email')} />
          </div>
          <div>
            <Label htmlFor="password" requerido>
              Contraseña
            </Label>
            <Input id="password" type="password" required value={form.password} onChange={actualizar('password')} />
          </div>
        </div>

        <div>
          <Label htmlFor="rol" requerido>
            Rol
          </Label>
          <Select id="rol" value={form.rol} onChange={actualizar('rol')}>
            <option value="veterinario">Veterinario</option>
            <option value="administrador">Administrador</option>
          </Select>
          <CampoAyuda>Un administrador conserva todas las funciones de un veterinario, además de gestionar cuentas.</CampoAyuda>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit">Crear cuenta</Button>
        </div>
      </form>
    </Modal>
  )
}
