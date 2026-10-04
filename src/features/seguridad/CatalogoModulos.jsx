import { useState } from 'react'
import { FolderTree, Lock, Pencil, Plus, Power } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cambiarEstadoModulo, listarModulos } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'
import { iconoDe } from '../../config/iconos'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge, BadgeActivo } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { AlertaError, AvisoExito, Cargando, ErrorCarga } from '../../components/ui/Estados'
import { ModuloFormModal } from './ModuloFormModal'

export function CatalogoModulos() {
  const { datos: modulos, cargando, error, recargar } = useRecurso(listarModulos)
  const { puede, actualizarSesion } = useAuth()
  const [modal, setModal] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')
  const [aviso, setAviso] = useState('')
  const [cambiando, setCambiando] = useState(null)

  const alGuardar = (mensaje) => {
    setAviso(mensaje)
    setErrorAccion('')
    recargar()
    actualizarSesion()
  }

  const alternarEstado = async (modulo) => {
    setErrorAccion('')
    setAviso('')
    setCambiando(modulo.id)
    try {
      await cambiarEstadoModulo(modulo.id, !modulo.activo)
      setAviso(modulo.activo ? 'Módulo desactivado: desaparece del menú de todos los usuarios' : 'Módulo activado')
      actualizarSesion()
    } catch (falla) {
      setErrorAccion(falla.message)
    }
    setCambiando(null)
    recargar()
  }

  if (cargando) return <Cargando />
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />

  const carpetas = modulos.filter((m) => m.tipo === 'carpeta')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-sm text-ink-soft">
          Estas son las carpetas y opciones del menú. Los cambios (nombre, orden, activar o desactivar) se aplican a todos los
          usuarios; sus sesiones abiertas se cierran para que vean el menú actualizado.
        </p>
        {puede('SEG_MODULOS', 'CREAR') && (
          <Button onClick={() => setModal({ modulo: null })}>
            <Plus className="size-4" />
            Nuevo módulo
          </Button>
        )}
      </div>

      <AlertaError mensaje={errorAccion} onCerrar={() => setErrorAccion('')} />
      <AvisoExito mensaje={aviso} onCerrar={() => setAviso('')} />

      <Card className="overflow-hidden p-0">
        {modulos.length === 0 ? (
          <EmptyState icono={FolderTree} titulo="No hay módulos" descripcion="Crea el primero." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-soft/60 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Módulo</th>
                  <th className="px-5 py-3">Código</th>
                  <th className="px-5 py-3">Ruta</th>
                  <th className="px-5 py-3">Orden</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {modulos.map((modulo) => {
                  const Icono = iconoDe(modulo.icono)
                  return (
                    <tr key={modulo.id} className="transition-colors hover:bg-cream-soft/40">
                      <td className="px-5 py-3.5">
                        <div className={`flex items-center gap-2.5 ${modulo.id_modulo_padre ? 'pl-7' : ''}`}>
                          <Icono className="size-4 text-primary-600" />
                          <span className={modulo.tipo === 'carpeta' ? 'font-heading text-ink' : 'font-semibold text-ink'}>
                            {modulo.nombre}
                          </span>
                          {modulo.tipo === 'carpeta' && <Badge tono="primary">Carpeta</Badge>}
                          {modulo.es_sistema && (
                            <Badge tono="neutral" icon={Lock}>
                              Sistema
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-ink-soft">{modulo.codigo}</td>
                      <td className="px-5 py-3.5 text-ink-soft">{modulo.ruta ?? '—'}</td>
                      <td className="px-5 py-3.5 text-ink-soft">{modulo.orden}</td>
                      <td className="px-5 py-3.5">
                        <BadgeActivo activo={modulo.activo} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          {puede('SEG_MODULOS', 'ACTUALIZAR') ? (
                            <>
                              <Button size="sm" variant="ghost" onClick={() => setModal({ modulo })}>
                                <Pencil className="size-3.5" />
                                Editar
                              </Button>
                              {!modulo.es_sistema && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  isLoading={cambiando === modulo.id}
                                  onClick={() => alternarEstado(modulo)}
                                >
                                  <Power className="size-3.5" />
                                  {modulo.activo ? 'Desactivar' : 'Activar'}
                                </Button>
                              )}
                            </>
                          ) : (
                            <span className="text-ink-faint">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ModuloFormModal estado={modal} carpetas={carpetas} onCerrar={() => setModal(null)} onGuardado={alGuardar} />
    </div>
  )
}
