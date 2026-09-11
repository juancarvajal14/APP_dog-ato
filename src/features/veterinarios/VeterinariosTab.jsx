import { useMemo, useState } from 'react'
import { Mail, Phone, Plus, Power, ShieldCheck, Stethoscope, Trash2, UserCog } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { Card, StatCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { BadgeActivo, BadgeRol } from '../../components/ui/Badge'
import { SearchInput } from '../../components/ui/SearchInput'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { VeterinarioFormModal } from './VeterinarioFormModal'

export function VeterinariosTab() {
  const { veterinarios, usuarios, cambiarEstadoVeterinario, eliminarVeterinario } = useData()
  const { sesion } = useAuth()
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [aEliminar, setAEliminar] = useState(null)

  const equipo = useMemo(
    () =>
      veterinarios
        .map((v) => ({ ...v, cuenta: usuarios.find((u) => u.documento === v.documento) }))
        .filter((v) => {
          const termino = busqueda.trim().toLowerCase()
          if (!termino) return true
          return `${v.nombre} ${v.apellido}`.toLowerCase().includes(termino) || v.documento.includes(termino)
        }),
    [veterinarios, usuarios, busqueda],
  )

  const activos = veterinarios.filter((v) => usuarios.find((u) => u.documento === v.documento)?.activo).length
  const administradores = usuarios.filter((u) => u.rol === 'administrador').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icono={Stethoscope} etiqueta="Equipo registrado" valor={veterinarios.length} tono="primary" />
        <StatCard icono={Power} etiqueta="Cuentas activas" valor={activos} tono="success" />
        <StatCard icono={ShieldCheck} etiqueta="Administradores" valor={administradores} tono="accent" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre o documento..." />
        <Button onClick={() => setModalAbierto(true)}>
          <Plus className="size-4" />
          Nuevo veterinario
        </Button>
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
                  const esUsuarioActual = v.documento === sesion.documento
                  return (
                    <tr key={v.id} className="transition-colors hover:bg-cream-soft/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar nombre={v.nombre} apellido={v.apellido} />
                          <div>
                            <p className="font-semibold text-ink">
                              {v.nombre} {v.apellido}
                            </p>
                            <p className="text-xs text-ink-faint">Documento {v.documento}</p>
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
                        <BadgeRol rol={v.cuenta?.rol} />
                      </td>
                      <td className="px-5 py-3.5">
                        <BadgeActivo activo={v.cuenta?.activo} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={esUsuarioActual}
                            title={esUsuarioActual ? 'No puedes cambiar el estado de tu propia cuenta' : undefined}
                            onClick={() => cambiarEstadoVeterinario(v.documento, !v.cuenta?.activo)}
                          >
                            <Power className="size-3.5" />
                            {v.cuenta?.activo ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={esUsuarioActual}
                            title={esUsuarioActual ? 'No puedes eliminar tu propia cuenta' : undefined}
                            className="text-danger hover:bg-danger-soft"
                            onClick={() => setAEliminar(v)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
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

      <VeterinarioFormModal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} />

      <ConfirmDialog
        abierto={Boolean(aEliminar)}
        onCerrar={() => setAEliminar(null)}
        onConfirmar={() => eliminarVeterinario(aEliminar.documento)}
        titulo="Eliminar veterinario"
        descripcion={`Esta acción borra permanentemente la cuenta de ${aEliminar?.nombre} ${aEliminar?.apellido}. Úsala solo si esta cuenta se creó por error: si el veterinario ya trabajó con citas o historiales, es mejor desactivarla en vez de eliminarla, para no perder esos registros.`}
        textoConfirmar="Eliminar permanentemente"
      />
    </div>
  )
}
