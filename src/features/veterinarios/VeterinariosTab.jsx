import { useMemo, useState } from 'react'
import { Ban, Mail, Phone, Plus, Power, Stethoscope, UserCog } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cambiarEstadoVeterinario, listarVeterinarios } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'
import { Card, StatCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { BadgeActivo, BadgeRol } from '../../components/ui/Badge'
import { SearchInput } from '../../components/ui/SearchInput'
import { EmptyState } from '../../components/ui/EmptyState'
import { AlertaError, Cargando, ErrorCarga } from '../../components/ui/Estados'
import { VeterinarioFormModal } from './VeterinarioFormModal'

export function VeterinariosTab() {
  const { datos: veterinarios, cargando, error, recargar } = useRecurso(listarVeterinarios)
  const { sesion, puede } = useAuth()
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [errorAccion, setErrorAccion] = useState('')
  const [cambiando, setCambiando] = useState(null)

  const equipo = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return veterinarios
    return veterinarios.filter(
      (v) => `${v.nombre} ${v.apellido}`.toLowerCase().includes(termino) || v.documento.includes(termino),
    )
  }, [veterinarios, busqueda])

  const alternarEstado = async (veterinario) => {
    setErrorAccion('')
    setCambiando(veterinario.id)
    try {
      await cambiarEstadoVeterinario(veterinario.id, !veterinario.activo)
    } catch (falla) {
      setErrorAccion(falla.message)
    }
    setCambiando(null)
    recargar()
  }

  if (cargando) return <Cargando />
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />

  const activos = veterinarios.filter((v) => v.activo).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icono={Stethoscope} etiqueta="Equipo registrado" valor={veterinarios.length} tono="primary" />
        <StatCard icono={Power} etiqueta="Cuentas activas" valor={activos} tono="success" />
        <StatCard icono={Ban} etiqueta="Cuentas inactivas" valor={veterinarios.length - activos} tono="accent" />
      </div>

      <AlertaError mensaje={errorAccion} onCerrar={() => setErrorAccion('')} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre o documento..." />
        {puede('SEG_VETERINARIOS', 'CREAR') && (
          <Button onClick={() => setModalAbierto(true)}>
            <Plus className="size-4" />
            Nuevo veterinario
          </Button>
        )}
      </div>

      <Card className="overflow-hidden p-0">
        {equipo.length === 0 ? (
          <EmptyState icono={UserCog} titulo="No se encontraron cuentas" descripcion="Ajusta la búsqueda o crea una nueva." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-soft/60 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Veterinario</th>
                  <th className="px-5 py-3">Contacto</th>
                  <th className="px-5 py-3">Rol</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {equipo.map((v) => {
                  const esUsuarioActual = v.id_usuario === sesion.usuario.id_usuario
                  return (
                    <tr key={v.id} className="transition-colors hover:bg-cream-soft/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar nombre={v.nombre} apellido={v.apellido} />
                          <div>
                            <p className="font-semibold text-ink">
                              {v.nombre} {v.apellido}
                            </p>
                            <p className="text-xs text-ink-faint">
                              {v.tipo_documento} {v.documento}
                              {v.especialidad && ` · ${v.especialidad}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft">
                        <p className="flex items-center gap-1.5">
                          <Mail className="size-3.5 text-ink-faint" /> {v.email}
                        </p>
                        {v.telefono && (
                          <p className="mt-0.5 flex items-center gap-1.5">
                            <Phone className="size-3.5 text-ink-faint" /> {v.telefono}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <BadgeRol rol={v.rol} />
                      </td>
                      <td className="px-5 py-3.5">
                        <BadgeActivo activo={v.activo} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          {puede('SEG_VETERINARIOS', 'ACTUALIZAR') ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={esUsuarioActual}
                              isLoading={cambiando === v.id}
                              title={esUsuarioActual ? 'No puedes cambiar el estado de tu propia cuenta' : undefined}
                              onClick={() => alternarEstado(v)}
                            >
                              <Power className="size-3.5" />
                              {v.activo ? 'Desactivar' : 'Activar'}
                            </Button>
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

      <VeterinarioFormModal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} onGuardado={recargar} />
    </div>
  )
}
