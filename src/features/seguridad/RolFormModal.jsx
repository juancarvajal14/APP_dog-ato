import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, CampoAyuda } from '../../components/ui/Field'
import { AlertaError } from '../../components/ui/Estados'
import { actualizarRol, crearRol } from '../../api/recursos'

function Formulario({ rol, onCerrar, onGuardado }) {
  const [nombre, setNombre] = useState(rol?.nombre ?? '')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setError('')
    try {
      if (rol) await actualizarRol(rol.id, { nombre })
      else await crearRol({ nombre })
      onGuardado(rol ? 'Rol actualizado' : 'Rol creado')
      onCerrar()
    } catch (falla) {
      setError(falla.message)
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="space-y-4">
      <div>
        <Label htmlFor="nombre-rol" requerido>
          Nombre del rol
        </Label>
        <Input id="nombre-rol" required maxLength={50} value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <CampoAyuda>Agrupa a los perfiles de un mismo tipo de personal (por ejemplo: Recepción).</CampoAyuda>
      </div>

      <AlertaError mensaje={error} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={enviando}>
          {rol ? 'Guardar cambios' : 'Crear rol'}
        </Button>
      </div>
    </form>
  )
}

// `rol` = null crea uno nuevo; con un rol lo edita. `abierto` es un objeto { rol } o null.
export function RolFormModal({ estado, onCerrar, onGuardado }) {
  return (
    <Modal abierto={Boolean(estado)} onCerrar={onCerrar} titulo={estado?.rol ? 'Editar rol' : 'Nuevo rol'}>
      {estado && <Formulario rol={estado.rol} onCerrar={onCerrar} onGuardado={onGuardado} />}
    </Modal>
  )
}
