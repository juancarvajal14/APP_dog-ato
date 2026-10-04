import { useMemo, useState } from 'react'
import { IdCard, Pencil, Plus, Power, ShieldCheck, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cambiarEstadoPerfil, listarPerfiles } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'
import { Card, StatCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { BadgeActivo } from '../../components/ui/Badge'
import { SearchInput } from '../../components/ui/SearchInput'
import { EmptyState } from '../../components/ui/EmptyState'
import { AlertaError, AvisoExito, Cargando, ErrorCarga } from '../../components/ui/Estados'
import { PerfilFormModal } from './PerfilFormModal'

export function PerfilesTab() {
  const { datos: perfiles, cargando, error, recargar } = useRecurso(listarPerfiles)
  const { puede, actualizarSesion } = useAuth()
  const [busqueda, setBusqueda] = useState('')
  const [modal, setModal] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')
  const [aviso, setAviso] = useState('')
  const [cambiando, setCambiando] = useState(null)

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return perfiles
    return perfiles.filter((p) => `${p.nombre} ${p.rol}`.toLowerCase().includes(termino))
  }, [perfiles, busqueda])

  const alGuardar = (mensaje) => {
    setAviso(mensaje)
    setErrorAccion('')
    recargar()
    actualizarSesion()
  }

  const alternarEstado = async (perfil) => {
    setErrorAccion('')
    setAviso('')
    setCambiando(perfil.id)
    try {
      await cambiarEstadoPerfil(perfil.id, !perfil.activo)
      setAviso(perfil.activo ? 'Perfil desactivado: sus usuarios pierden este acceso' : 'Perfil activado')
      actualizarSesion()
    } catch (falla) {
      setErrorAccion(falla.message)
    }
    setCambiando(null)
    recargar()
  }

  if (cargando) return <Cargando />
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icono={IdCard} etiqueta="Perfiles registrados" valor={perfiles.length} tono="primary" />
        <StatCard icono={ShieldCheck} etiqueta="Perfiles activos" valor={perfiles.filter((p) => p.activo).length} tono="success" />
      </div>

      <p className="text-sm text-ink-soft">
        Un perfil es un cargo concreto dentro de un rol. A los usuarios se les asigna un perfil, y los permisos de cada perfil se
        definen en «Módulos y permisos».
      </p>

      <AlertaError mensaje={errorAccion} onCerrar={() => setErrorAccion('')} />
      <AvisoExito mensaje={aviso} onCerrar={() => setAviso('')} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por perfil o rol..." />
        {puede('SEG_PERFILES', 'CREAR') && (
          <Button onClick={() => setModal({ perfil: null })}>
            <Plus className="size-4" />
            Nuevo perfil
          </Button>
        )}
      </div>

      <Card className="overflow-hidden p-0">
        {filtrados.length === 0 ? (
          <EmptyState icono={IdCard} titulo="No se encontraron perfiles" descripcion="Ajusta la búsqueda o crea uno nuevo." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-soft/60 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Perfil</th>
                  <th className="px-5 py-3">Rol</th>
                  <th className="px-5 py-3">Usuarios</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {filtrados.map((perfil) => (
                  <tr key={perfil.id} className="transition-colors hover:bg-cream-soft/40">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-ink">{perfil.nombre}</p>
                      {perfil.descripcion && <p className="max-w-md text-xs text-ink-faint">{perfil.descripcion}</p>}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{perfil.rol}</td>
                    <td className="px-5 py-3.5 text-ink-soft">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5 text-ink-faint" /> {perfil.total_usuarios}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <BadgeActivo activo={perfil.activo} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        {puede('SEG_PERFILES', 'ACTUALIZAR') ? (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => setModal({ perfil })}>
                              <Pencil className="size-3.5" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              isLoading={cambiando === perfil.id}
                              onClick={() => alternarEstado(perfil)}
                            >
                              <Power className="size-3.5" />
                              {perfil.activo ? 'Desactivar' : 'Activar'}
                            </Button>
                          </>
                        ) : (
                          <span className="text-ink-faint">—</span>
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

      <PerfilFormModal estado={modal} onCerrar={() => setModal(null)} onGuardado={alGuardar} />
    </div>
  )
}
