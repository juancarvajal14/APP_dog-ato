import { useMemo, useState } from 'react'
import { ClipboardList, PawPrint, Stethoscope } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { Card, StatCard } from '../../components/ui/Card'
import { SearchInput } from '../../components/ui/SearchInput'
import { EmptyState } from '../../components/ui/EmptyState'
import { formatearFechaHora } from '../../lib/fechas'

export function HistorialTab() {
  const { historial, citas, mascotas, veterinarios, propietarioDe } = useData()
  const [busqueda, setBusqueda] = useState('')

  const entradas = useMemo(() => {
    const enriquecidas = historial.map((entrada) => {
      const cita = citas.find((c) => c.id === entrada.cita_id)
      const mascota = mascotas.find((m) => m.id === cita?.mascota_id)
      const veterinario = veterinarios.find((v) => v.id === cita?.veterinario_id)
      const propietario = mascota ? propietarioDe(mascota.id) : null
      return { ...entrada, cita, mascota, veterinario, propietario }
    })
    return enriquecidas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
  }, [historial, citas, mascotas, veterinarios, propietarioDe])

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    if (!termino) return entradas
    return entradas.filter(
      (e) =>
        e.mascota?.nombre.toLowerCase().includes(termino) ||
        `${e.veterinario?.nombre} ${e.veterinario?.apellido}`.toLowerCase().includes(termino) ||
        e.diagnostico?.toLowerCase().includes(termino),
    )
  }, [entradas, busqueda])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icono={ClipboardList} etiqueta="Registros clínicos" valor={historial.length} tono="primary" />
        <StatCard
          icono={PawPrint}
          etiqueta="Mascotas con historial"
          valor={new Set(entradas.map((e) => e.mascota?.id)).size}
          tono="accent"
        />
      </div>

      <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar por mascota, veterinario o diagnóstico..." />

      {filtradas.length === 0 ? (
        <EmptyState
          icono={ClipboardList}
          titulo="Sin registros de historial"
          descripcion="El historial se genera automáticamente cuando se completa una cita."
        />
      ) : (
        <div className="space-y-4">
          {filtradas.map((entrada) => (
            <Card key={entrada.id} className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sand pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                    <PawPrint className="size-4.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{entrada.mascota?.nombre ?? 'Mascota eliminada'}</p>
                    <p className="text-xs text-ink-faint">
                      Propietario: {entrada.propietario ? `${entrada.propietario.nombre} ${entrada.propietario.apellido}` : '—'}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-ink-faint">
                  <p className="flex items-center justify-end gap-1.5 font-medium text-ink-soft">
                    <Stethoscope className="size-3.5" />
                    {entrada.veterinario ? `${entrada.veterinario.nombre} ${entrada.veterinario.apellido}` : '—'}
                  </p>
                  <p className="mt-0.5">{formatearFechaHora(entrada.fecha)}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Diagnóstico</p>
                  <p className="mt-1 text-ink-soft">{entrada.diagnostico || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Tratamiento</p>
                  <p className="mt-1 text-ink-soft">{entrada.tratamiento || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Recomendaciones</p>
                  <p className="mt-1 text-ink-soft">{entrada.observaciones || '—'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
