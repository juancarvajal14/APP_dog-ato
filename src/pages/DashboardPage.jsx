import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { pestanasParaRol } from '../config/navegacion'
import { Sidebar } from '../components/layout/Sidebar'
import { MascotasTab } from '../features/mascotas/MascotasTab'
import { PropietariosTab } from '../features/propietarios/PropietariosTab'
import { CitasTab } from '../features/citas/CitasTab'
import { HistorialTab } from '../features/historial/HistorialTab'
import { VeterinariosTab } from '../features/veterinarios/VeterinariosTab'

const contenidoPorPestana = {
  mascotas: MascotasTab,
  propietarios: PropietariosTab,
  citas: CitasTab,
  historial: HistorialTab,
  veterinarios: VeterinariosTab,
}

export function DashboardPage() {
  const { sesion } = useAuth()
  const disponibles = pestanasParaRol(sesion.rol)
  const [pestanaActiva, setPestanaActiva] = useState(disponibles[0]?.id)

  const pestanaInfo = disponibles.find((p) => p.id === pestanaActiva) ?? disponibles[0]
  const Contenido = contenidoPorPestana[pestanaInfo.id]

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar pestanaActiva={pestanaInfo.id} onCambiarPestana={setPestanaActiva} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <header className="mb-7 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <pestanaInfo.icono className="size-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl text-ink">{pestanaInfo.etiqueta}</h1>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={pestanaInfo.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Contenido />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
