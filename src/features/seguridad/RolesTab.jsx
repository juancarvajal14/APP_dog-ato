import { useState } from 'react'
import { Lock, Pencil, Plus, Power, ShieldCheck, UserCog } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cambiarEstadoRol, listarRoles } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'
import { Card, StatCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge, BadgeActivo } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { AlertaError, AvisoExito, Cargando, ErrorCarga } from '../../components/ui/Estados'
import { RolFormModal } from './RolFormModal'

export function RolesTab() {
  const { datos: roles, cargando, error, recargar } = useRecurso(listarRoles)
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

  const alternarEstado = async (rol) => {
    setErrorAccion('')
    setAviso('')
    setCambiando(rol.id)
    try {
      await cambiarEstadoRol(rol.id, !rol.activo)
      setAviso(rol.activo ? 'Rol desactivado: sus perfiles dejan de dar acceso' : 'Rol activado')
      actualizarSesion()
    } catch (falla) {
      setErrorAccion(falla.message)
    }
    setCambiando(null)
    recargar()
  }

  if (cargando) return <Cargando />
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />

  const activos = roles.filter((r) => r.activo).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icono={UserCog} etiqueta="Roles registrados" valor={roles.length} tono="primary" />
        <StatCard icono={ShieldCheck} etiqueta="Roles activos" valor={activos} tono="success" />
      </div>

      <p className="text-sm text-ink-soft">
        Un rol agrupa a los perfiles de un mismo tipo de personal. Los permisos se asignan a cada perfil, no al rol; si desactivas un
        rol, todos sus perfiles dejan de dar acceso.
      </p>

      <AlertaError mensaje={errorAccion} onCerrar={() => setErrorAccion('')} />
      <AvisoExito mensaje={aviso} onCerrar={() => setAviso('')} />

      {puede('SEG_ROLES', 'CREAR') && (
        <div className="flex justify-end">
          <Button onClick={() => setModal({ rol: null })}>
            <Plus className="size-4" />
            Nuevo rol
          </Button>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        {roles.length === 0 ? (
          <EmptyState icono={UserCog} titulo="No hay roles" descripcion="Crea el primero." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-soft/60 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Rol</th>
                  <th className="px-5 py-3">Perfiles</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {roles.map((rol) => (
                  <tr key={rol.id} className="transition-colors hover:bg-cream-soft/40">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-ink">{rol.nombre}</span>
                      {rol.es_sistema && (
                        <Badge tono="neutral" icon={Lock} className="ml-2">
                          Sistema
                        </Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{rol.total_perfiles}</td>
                    <td className="px-5 py-3.5">
                      <BadgeActivo activo={rol.activo} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        {puede('SEG_ROLES', 'ACTUALIZAR') && !rol.es_sistema ? (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => setModal({ rol })}>
                              <Pencil className="size-3.5" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              isLoading={cambiando === rol.id}
                              onClick={() => alternarEstado(rol)}
                            >
                              <Power className="size-3.5" />
                              {rol.activo ? 'Desactivar' : 'Activar'}
                            </Button>
                          </>
                        ) : (
                          <span className="text-ink-faint" title={rol.es_sistema ? 'Los roles del sistema no se modifican' : undefined}>
                            —
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <RolFormModal estado={modal} onCerrar={() => setModal(null)} onGuardado={alGuardar} />
    </div>
  )
}
