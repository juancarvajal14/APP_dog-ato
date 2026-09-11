import { useMemo, useState } from 'react'
import { Plus, PawPrint, Users as UsersIcon, Venus, Mars, Cat, Dog, Bird, Rabbit, HelpCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Card, StatCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { SearchInput } from '../../components/ui/SearchInput'
import { EmptyState } from '../../components/ui/EmptyState'
import { calcularEdad, formatearFecha } from '../../lib/fechas'
import { MascotaFormModal } from './MascotaFormModal'

const iconoPorEspecie = { Perro: Dog, Gato: Cat, Ave: Bird, Conejo: Rabbit }

export function MascotasTab() {
  const { mascotas, propietarioDe } = useData()
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return mascotas
    return mascotas.filter((m) => {
      const propietario = propietarioDe(m.id)
      return (
        m.nombre.toLowerCase().includes(termino) ||
        m.especie.toLowerCase().includes(termino) ||
        (m.raza ?? '').toLowerCase().includes(termino) ||
        `${propietario?.nombre ?? ''} ${propietario?.apellido ?? ''}`.toLowerCase().includes(termino)
      )
    })
  }, [mascotas, busqueda, propietarioDe])

  const totalEspecies = new Set(mascotas.map((m) => m.especie)).size

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icono={PawPrint} etiqueta="Mascotas registradas" valor={mascotas.length} tono="primary" />
        <StatCard icono={UsersIcon} etiqueta="Especies distintas" valor={totalEspecies} tono="accent" />
        <StatCard
          icono={Venus}
          etiqueta="Hembras / Machos"
          valor={`${mascotas.filter((m) => m.sexo === 'hembra').length} / ${mascotas.filter((m) => m.sexo === 'macho').length}`}
          tono="success"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por nombre, especie o propietario..." />
        <Button onClick={() => setModalAbierto(true)}>
          <Plus className="size-4" />
          Nueva mascota
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        {filtradas.length === 0 ? (
          <EmptyState
            icono={PawPrint}
            titulo="No se encontraron mascotas"
            descripcion="Ajusta la búsqueda o registra una nueva mascota."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-soft/60 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Mascota</th>
                  <th className="px-5 py-3">Especie / Raza</th>
                  <th className="px-5 py-3">Sexo</th>
                  <th className="px-5 py-3">Edad</th>
                  <th className="px-5 py-3">Propietario</th>
                  <th className="px-5 py-3">Nació</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {filtradas.map((mascota) => {
                  const propietario = propietarioDe(mascota.id)
                  const Icono = iconoPorEspecie[mascota.especie] ?? HelpCircle
                  return (
                    <tr key={mascota.id} className="transition-colors hover:bg-cream-soft/40">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                            <Icono className="size-5" />
                          </div>
                          <span className="font-semibold text-ink">{mascota.nombre}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft">
                        {mascota.especie}
                        {mascota.raza && <span className="text-ink-faint"> · {mascota.raza}</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge tono="neutral" icon={mascota.sexo === 'hembra' ? Venus : Mars}>
                          {mascota.sexo === 'hembra' ? 'Hembra' : 'Macho'}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft">{calcularEdad(mascota.fecha_nacimiento) ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-ink">
                          {propietario ? `${propietario.nombre} ${propietario.apellido}` : '—'}
                        </p>
                        <p className="text-xs text-ink-faint">{propietario?.telefono}</p>
                      </td>
                      <td className="px-5 py-3.5 text-ink-soft">{formatearFecha(mascota.fecha_nacimiento)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <MascotaFormModal abierto={modalAbierto} onCerrar={() => setModalAbierto(false)} />
    </div>
  )
}
