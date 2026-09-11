import { useMemo, useState } from 'react'
import { Mail, Phone, Plus, Users, PawPrint, MapPin } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Card, StatCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Avatar } from '../../components/ui/Avatar'
import { SearchInput } from '../../components/ui/SearchInput'
import { EmptyState } from '../../components/ui/EmptyState'
import { PropietarioFormModal } from './PropietarioFormModal'

export function PropietariosTab() {
  const { propietarios, mascotasDe } = useData()
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return propietarios
    return propietarios.filter(
      (p) =>
        `${p.nombre} ${p.apellido}`.toLowerCase().includes(termino) ||
        p.documento.includes(termino) ||
        (p.email ?? '').toLowerCase().includes(termino),
    )
  }, [propietarios, busqueda])

  const totalMascotas = propietarios.reduce((acc, p) => acc + mascotasDe(p.id).length, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icono={Users} etiqueta="Propietarios registrados" valor={propietarios.length} tono="primary" />
        <StatCard icono={PawPrint} etiqueta="Mascotas asociadas" valor={totalMascotas} tono="accent" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre, documento o correo..." />
        <Button onClick={() => setModalAbierto(true)}>
          <Plus className="size-4" />
          Nuevo propietario
        </Button>
      </div>

      {filtrados.length === 0 ? (
        <EmptyState
          icono={Users}
          titulo="No se encontraron propietarios"
          descripcion="Ajusta la búsqueda o registra uno nuevo."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtrados.map((propietario) => {
            const mascotas = mascotasDe(propietario.id)
            return (
              <Card key={propietario.id} className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar nombre={propietario.nombre} apellido={propietario.apellido} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base text-ink">
                      {propietario.nombre} {propietario.apellido}
                    </p>
                    <p className="text-xs text-ink-faint">Documento {propietario.documento}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-ink-soft">
                  {propietario.telefono && (
                    <p className="flex items-center gap-2">
                      <Phone className="size-3.5 text-ink-faint" /> {propietario.telefono}
                    </p>
                  )}
                  {propietario.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="size-3.5 text-ink-faint" /> {propietario.email}
                    </p>
                  )}
                  {propietario.direccion && (
                    <p className="flex items-center gap-2">
                      <MapPin className="size-3.5 text-ink-faint" /> {propietario.direccion}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-sand pt-3">
                  {mascotas.length === 0 ? (
                    <span className="text-xs text-ink-faint">Sin mascotas registradas</span>
                  ) : (
                    mascotas.map((m) => (
                      <span
                        key={m.id}
                        className="inline-flex items-center gap-1 rounded-full bg-cream-soft px-2.5 py-1 text-xs font-medium text-ink-soft"
                      >
                        <PawPrint className="size-3" /> {m.nombre}
                      </span>
                    ))
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <PropietarioFormModal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} />
    </div>
  )
}
