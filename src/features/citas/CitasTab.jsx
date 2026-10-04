import { useMemo, useState } from 'react'
import { Ban, CalendarClock, CheckCircle2, Clock3, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cancelarCita, listarCitas } from '../../api/recursos'
import { useRecurso } from '../../lib/useRecurso'
import { Card, StatCard } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { BadgeEstadoCita } from '../../components/ui/Badge'
import { SearchInput } from '../../components/ui/SearchInput'
import { EmptyState } from '../../components/ui/EmptyState'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { AlertaError, Cargando, ErrorCarga } from '../../components/ui/Estados'
import { formatearFechaHora } from '../../lib/fechas'
import { cn } from '../../lib/cn'
import { CitaFormModal } from './CitaFormModal'
import { CompletarCitaModal } from './CompletarCitaModal'

const filtros = [
  { id: 'todas', etiqueta: 'Todas' },
  { id: 'pendiente', etiqueta: 'Pendientes' },
  { id: 'completada', etiqueta: 'Completadas' },
  { id: 'cancelada', etiqueta: 'Canceladas' },
]

export function CitasTab() {
  const { datos: citas, cargando, error, recargar } = useRecurso(listarCitas)
  const { puede } = useAuth()
  const [filtro, setFiltro] = useState('todas')
  const [busqueda, setBusqueda] = useState('')
  const [modalNuevaCita, setModalNuevaCita] = useState(false)
  const [citaACompletar, setCitaACompletar] = useState(null)
  const [citaACancelar, setCitaACancelar] = useState(null)
  const [errorAccion, setErrorAccion] = useState('')

  const filtradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase()
    return citas.filter((cita) => {
      if (filtro !== 'todas' && cita.estado !== filtro) return false
      if (!termino) return true
      return (
        cita.mascota.nombre.toLowerCase().includes(termino) ||
        `${cita.veterinario.nombre} ${cita.veterinario.apellido}`.toLowerCase().includes(termino) ||
        cita.motivo_consulta.toLowerCase().includes(termino)
      )
    })
  }, [citas, filtro, busqueda])

  const conteos = {
    pendiente: citas.filter((c) => c.estado === 'pendiente').length,
    completada: citas.filter((c) => c.estado === 'completada').length,
    cancelada: citas.filter((c) => c.estado === 'cancelada').length,
  }

  const confirmarCancelacion = async () => {
    setErrorAccion('')
    try {
      await cancelarCita(citaACancelar.id)
    } catch (falla) {
      setErrorAccion(falla.message)
    }
    recargar()
  }

  if (cargando) return <Cargando />
  if (error) return <ErrorCarga mensaje={error} onReintentar={recargar} />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icono={Clock3} etiqueta="Citas pendientes" valor={conteos.pendiente} tono="warning" />
        <StatCard icono={CheckCircle2} etiqueta="Citas completadas" valor={conteos.completada} tono="success" />
        <StatCard icono={Ban} etiqueta="Citas canceladas" valor={conteos.cancelada} tono="accent" />
      </div>

      <AlertaError mensaje={errorAccion} onCerrar={() => setErrorAccion('')} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              className={cn(
                'cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                filtro === f.id ? 'bg-primary-600 text-white' : 'bg-white text-ink-soft hover:bg-sand/60',
              )}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput value={busqueda} onChange={setBusqueda} placeholder="Buscar mascota, veterinario o motivo..." />
          {puede('CLI_CITAS', 'CREAR') && (
            <Button onClick={() => setModalNuevaCita(true)}>
              <Plus className="size-4" />
              Nueva cita
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        {filtradas.length === 0 ? (
          <EmptyState
            icono={CalendarClock}
            titulo="No hay citas para mostrar"
            descripcion="Ajusta los filtros o agenda una nueva cita."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream-soft/60 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                <tr>
                  <th className="px-5 py-3">Mascota</th>
                  <th className="px-5 py-3">Propietario</th>
                  <th className="px-5 py-3">Veterinario</th>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Motivo</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand">
                {filtradas.map((cita) => (
                  <tr key={cita.id} className="transition-colors hover:bg-cream-soft/40">
                    <td className="px-5 py-3.5 font-semibold text-ink">{cita.mascota.nombre}</td>
                    <td className="px-5 py-3.5 text-ink-soft">
                      {cita.propietario.nombre} {cita.propietario.apellido}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">
                      {cita.veterinario.nombre} {cita.veterinario.apellido}
                    </td>
                    <td className="px-5 py-3.5 text-ink-soft">{formatearFechaHora(cita.fecha)}</td>
                    <td className="max-w-56 truncate px-5 py-3.5 text-ink-soft" title={cita.motivo_consulta}>
                      {cita.motivo_consulta}
                    </td>
                    <td className="px-5 py-3.5">
                      <BadgeEstadoCita estado={cita.estado} />
                    </td>
                    <td className="px-5 py-3.5">
                      {cita.estado === 'pendiente' && puede('CLI_CITAS', 'ACTUALIZAR') ? (
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="accent" onClick={() => setCitaACompletar(cita)}>
                            Completar
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setCitaACancelar(cita)}>
                            Cancelar
                          </Button>
                        </div>
                      ) : (
                        <span className="block text-right text-ink-faint">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CitaFormModal abierto={modalNuevaCita} onCerrar={() => setModalNuevaCita(false)} onGuardado={recargar} />
      <CompletarCitaModal cita={citaACompletar} onCerrar={() => setCitaACompletar(null)} onGuardado={recargar} />
      <ConfirmDialog
        abierto={Boolean(citaACancelar)}
        onCerrar={() => setCitaACancelar(null)}
        onConfirmar={confirmarCancelacion}
        titulo="Cancelar cita"
        descripcion={`Se cancelará la cita de ${citaACancelar?.mascota.nombre ?? 'esta mascota'}. No se generará historial clínico para ella.`}
        textoConfirmar="Sí, cancelar cita"
      />
    </div>
  )
}
