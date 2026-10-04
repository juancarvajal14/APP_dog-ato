import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select, CampoAyuda } from '../../components/ui/Field'
import { AlertaError } from '../../components/ui/Estados'
import { catalogoPerfilesVeterinario, crearVeterinario, listarTiposDocumento } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'

const vacio = {
  id_tipo_documento: '',
  nombre: '',
  apellido: '',
  documento: '',
  telefono: '',
  direccion: '',
  especialidad: '',
  registro_profesional: '',
  email: '',
  password: '',
  id_perfil: '',
}

function Formulario({ onCerrar, onGuardado }) {
  const { datos: tipos } = useRecurso(listarTiposDocumento)
  const { datos: perfiles, error: errorPerfiles } = useRecurso(catalogoPerfilesVeterinario)
  const [form, setForm] = useState(vacio)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))
  const tipoSeleccionado = form.id_tipo_documento || tipos[0]?.id || ''
  const perfilSeleccionado = form.id_perfil || perfiles[0]?.id || ''

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await crearVeterinario({
        ...form,
        id_tipo_documento: Number(tipoSeleccionado),
        id_perfil: Number(perfilSeleccionado),
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

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="tipo_documento" requerido>
            Tipo
          </Label>
          <Select id="tipo_documento" value={tipoSeleccionado} onChange={actualizar('id_tipo_documento')}>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.abreviacion}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="documento" requerido>
            Documento
          </Label>
          <Input id="documento" required minLength={3} value={form.documento} onChange={actualizar('documento')} />
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="especialidad">Especialidad</Label>
          <Input id="especialidad" value={form.especialidad} onChange={actualizar('especialidad')} />
        </div>
        <div>
          <Label htmlFor="registro_profesional">Registro profesional</Label>
          <Input
            id="registro_profesional"
            value={form.registro_profesional}
            onChange={actualizar('registro_profesional')}
          />
        </div>
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
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.password}
            onChange={actualizar('password')}
          />
        </div>
      </div>
      <CampoAyuda>La contraseña debe tener al menos 8 caracteres. Se guarda cifrada.</CampoAyuda>

      {perfiles.length > 1 && (
        <div>
          <Label htmlFor="perfil" requerido>
            Perfil
          </Label>
          <Select id="perfil" value={perfilSeleccionado} onChange={actualizar('id_perfil')}>
            {perfiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Select>
          <CampoAyuda>El perfil define a qué módulos y acciones tendrá acceso.</CampoAyuda>
        </div>
      )}

      <AlertaError mensaje={error || errorPerfiles} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={enviando} disabled={perfiles.length === 0}>
          Crear cuenta
        </Button>
      </div>
    </form>
  )
}

export function VeterinarioFormModal({ abierto, onCerrar, onGuardado }) {
  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      titulo="Registrar veterinario"
      descripcion="Se crea el perfil profesional junto con su cuenta de acceso."
    >
      <Formulario onCerrar={onCerrar} onGuardado={onGuardado} />
    </Modal>
  )
}
