import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { iconoDe, opcionesDelMenu, pantallaDe } from '../config/modulos'
import { Sidebar } from '../components/layout/Sidebar'

export function DashboardPage() {
  const { sesion } = useAuth()
  const opciones = opcionesDelMenu(sesion.menu)
  const [codigoActivo, setCodigoActivo] = useState(opciones[0]?.codigo)

  const opcion = opciones.find((o) => o.codigo === codigoActivo) ?? opciones[0]
  const Contenido = pantallaDe(opcion.codigo)
  const Icono = iconoDe(opcion.icono)

  return (
    <div className="flex h-screen overflow-hidden bg-cream">
      <Sidebar opcionActiva={opcion.codigo} onSeleccionar={setCodigoActivo} />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-8 py-8">
          <header className="mb-7 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
              <Icono className="size-6" />
            </div>
            <div>
              <h1 className="font-heading text-2xl text-ink">{opcion.nombre}</h1>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={opcion.codigo}
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
