import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select } from '../../components/ui/Field'
import { AlertaError } from '../../components/ui/Estados'
import { crearPropietario, listarTiposDocumento } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'

const vacio = { id_tipo_documento: '', nombre: '', apellido: '', documento: '', telefono: '', email: '', direccion: '' }

function Formulario({ onCerrar, onGuardado }) {
  const { datos: tipos } = useRecurso(listarTiposDocumento)
  const [form, setForm] = useState(vacio)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))
  const tipoSeleccionado = form.id_tipo_documento || tipos[0]?.id || ''

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setError('')
    try {
      await crearPropietario({ ...form, id_tipo_documento: Number(tipoSeleccionado) })
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
        <div className="col-span-2">
          <Label htmlFor="documento" requerido>
            Documento
          </Label>
          <Input
            id="documento"
            required
            minLength={3}
            value={form.documento}
            onChange={actualizar('documento')}
            placeholder="Número de identificación"
          />
        </div>
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

      <AlertaError mensaje={error} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={enviando}>
          Registrar propietario
        </Button>
      </div>
    </form>
  )
}

export function PropietarioFormModal({ abierto, onCerrar, onGuardado }) {
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo="Registrar propietario">
      <Formulario onCerrar={onCerrar} onGuardado={onGuardado} />
    </Modal>
  )
}
