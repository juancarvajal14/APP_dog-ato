import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { Label, Input, Select, Textarea, CampoAyuda } from '../../components/ui/Field'
import { AlertaError } from '../../components/ui/Estados'
import { actualizarModulo, crearModulo } from '../../api/recursos'
import { nombresDeIconos } from '../../config/iconos'

function Formulario({ modulo, carpetas, onCerrar, onGuardado }) {
  const editando = Boolean(modulo)
  const [form, setForm] = useState({
    tipo: modulo?.tipo ?? 'opcion',
    id_modulo_padre: modulo?.id_modulo_padre ?? '',
    codigo: modulo?.codigo ?? '',
    nombre: modulo?.nombre ?? '',
    descripcion: modulo?.descripcion ?? '',
    ruta: modulo?.ruta ?? '',
    icono: modulo?.icono ?? '',
    orden: modulo?.orden ?? 1,
  })
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const actualizar = (campo) => (evento) => setForm((f) => ({ ...f, [campo]: evento.target.value }))
  const esOpcion = form.tipo === 'opcion'

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setError('')
    const cuerpo = {
      id_modulo_padre: esOpcion && form.id_modulo_padre ? Number(form.id_modulo_padre) : null,
      nombre: form.nombre,
      descripcion: form.descripcion,
      ruta: esOpcion ? form.ruta : null,
      icono: form.icono || null,
      orden: Number(form.orden),
    }
    try {
      if (editando) await actualizarModulo(modulo.id, cuerpo)
      else await crearModulo({ ...cuerpo, codigo: form.codigo })
      onGuardado(editando ? 'Módulo actualizado' : 'Módulo creado. Asígnalo a un perfil en la pestaña «Permisos por perfil»')
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
          <Label htmlFor="tipo-modulo" requerido>
            Tipo
          </Label>
          <Select id="tipo-modulo" value={form.tipo} disabled={editando} onChange={actualizar('tipo')}>
            <option value="opcion">Opción (abre una pantalla)</option>
            <option value="carpeta">Carpeta (agrupa opciones)</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="codigo-modulo" requerido={!editando}>
            Código
          </Label>
          <Input
            id="codigo-modulo"
            required={!editando}
            disabled={editando}
            maxLength={40}
            pattern="[A-Z][A-Z0-9_]*"
            placeholder="CLI_VACUNAS"
            value={form.codigo}
            onChange={(e) => setForm((f) => ({ ...f, codigo: e.target.value.toUpperCase() }))}
          />
        </div>
      </div>
      {!editando && <CampoAyuda>El código es único y no se puede cambiar después: el sistema lo usa para identificar el módulo.</CampoAyuda>}

      <div>
        <Label htmlFor="nombre-modulo" requerido>
          Nombre en el menú
        </Label>
        <Input id="nombre-modulo" required maxLength={50} value={form.nombre} onChange={actualizar('nombre')} />
      </div>

      {esOpcion && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ruta-modulo" requerido>
              Ruta
            </Label>
            <Input
              id="ruta-modulo"
              required
              maxLength={200}
              pattern="/[a-z0-9\/_\-]*"
              placeholder="/clinica/vacunas"
              value={form.ruta}
              onChange={actualizar('ruta')}
            />
          </div>
          <div>
            <Label htmlFor="padre-modulo">Carpeta</Label>
            <Select id="padre-modulo" value={form.id_modulo_padre} onChange={actualizar('id_modulo_padre')}>
              <option value="">Sin carpeta</option>
              {carpetas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="icono-modulo">Icono</Label>
          <Select id="icono-modulo" value={form.icono} onChange={actualizar('icono')}>
            <option value="">Predeterminado</option>
            {nombresDeIconos.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="orden-modulo" requerido>
            Orden
          </Label>
          <Input id="orden-modulo" type="number" required min={1} max={999} value={form.orden} onChange={actualizar('orden')} />
        </div>
      </div>

      <div>
        <Label htmlFor="descripcion-modulo">Descripción</Label>
        <Textarea id="descripcion-modulo" maxLength={500} value={form.descripcion} onChange={actualizar('descripcion')} />
      </div>

      {!editando && esOpcion && (
        <CampoAyuda>
          Una opción nueva aparece en el menú, pero para que abra una pantalla el equipo debe programarla en el frontend; mientras
          tanto mostrará «Módulo en construcción».
        </CampoAyuda>
      )}

      <AlertaError mensaje={error} />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={enviando}>
          {editando ? 'Guardar cambios' : 'Crear módulo'}
        </Button>
      </div>
    </form>
  )
}

// `estado` = { modulo: null } crea uno nuevo; { modulo } lo edita; null = cerrado.
export function ModuloFormModal({ estado, carpetas, onCerrar, onGuardado }) {
  return (
    <Modal abierto={Boolean(estado)} onCerrar={onCerrar} titulo={estado?.modulo ? 'Editar módulo' : 'Nuevo módulo'}>
      {estado && <Formulario modulo={estado.modulo} carpetas={carpetas} onCerrar={onCerrar} onGuardado={onGuardado} />}
    </Modal>
  )
}
