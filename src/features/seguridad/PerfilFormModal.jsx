import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select, Textarea, CampoAyuda } from '../../components/ui/Field'
import { AlertaError } from '../../components/ui/Estados'
import { actualizarPerfil, crearPerfil, listarRoles } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'

function Formulario({ perfil, onCerrar, onGuardado }) {
  const { datos: roles, error: errorRoles } = useRecurso(listarRoles)
  const [form, setForm] = useState({
    id_rol: perfil?.id_rol ?? '',
    nombre: perfil?.nombre ?? '',
    descripcion: perfil?.descripcion ?? '',
  })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const rolesActivos = roles.filter((r) => r.activo || r.id === perfil?.id_rol)
  const rolSeleccionado = form.id_rol // se elige a propósito: ningún rol queda preseleccionado
  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setError('')
    const cuerpo = { ...form, id_rol: Number(rolSeleccionado) }
    try {
      if (perfil) await actualizarPerfil(perfil.id, cuerpo)
      else await crearPerfil(cuerpo)
      onGuardado(perfil ? 'Perfil actualizado' : 'Perfil creado. Asígnale permisos en «Módulos y permisos»')
      onCerrar()
    } catch (falla) {
      setError(falla.message)
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      <div>
        <Label htmlFor="nombre-perfil" requerido>
          Nombre del perfil
        </Label>
        <Input id="nombre-perfil" required maxLength={50} value={form.nombre} onChange={actualizar('nombre')} />
      </div>

      <div>
        <Label htmlFor="rol-perfil" requerido>
          Rol
        </Label>
        <Select id="rol-perfil" required value={rolSeleccionado} onChange={actualizar('id_rol')}>
          <option value="" disabled>
            Selecciona un rol
          </option>
          {rolesActivos.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </Select>
        <CampoAyuda>El perfil es el cargo concreto; el rol es la categoría a la que pertenece.</CampoAyuda>
      </div>

      <div>
        <Label htmlFor="descripcion-perfil">Descripción</Label>
        <Textarea id="descripcion-perfil" maxLength={500} value={form.descripcion} onChange={actualizar('descripcion')} />
      </div>

      <AlertaError mensaje={error || errorRoles} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={enviando} disabled={rolesActivos.length === 0}>
          {perfil ? 'Guardar cambios' : 'Crear perfil'}
        </Button>
      </div>
    </form>
  )
}

// `estado` = { perfil: null } crea uno nuevo; { perfil } lo edita; null = cerrado.
export function PerfilFormModal({ estado, onCerrar, onGuardado }) {
  return (
    <Modal abierto={Boolean(estado)} onCerrar={onCerrar} titulo={estado?.perfil ? 'Editar perfil' : 'Nuevo perfil'}>
      {estado && <Formulario perfil={estado.perfil} onCerrar={onCerrar} onGuardado={onGuardado} />}
    </Modal>
  )
}
