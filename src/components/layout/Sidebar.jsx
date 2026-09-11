import { LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { pestanasParaRol } from '../../config/navegacion'
import { Avatar } from '../ui/Avatar'
import { BadgeRol } from '../ui/Badge'
import { Marca } from './Marca'
import { cn } from '../../lib/cn'

export function Sidebar({ pestanaActiva, onCambiarPestana }) {
  const { sesion, cerrarSesion } = useAuth()
  const items = pestanasParaRol(sesion.rol)

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sand bg-white">
      <div className="px-5 py-6">
        <Marca />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const activa = pestanaActiva === item.id
          const Icono = item.icono
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onCambiarPestana(item.id)}
              className={cn(
                'relative flex w-full cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
                activa ? 'text-primary-700' : 'text-ink-soft hover:bg-cream-soft hover:text-ink',
              )}
            >
              {activa && (
                <motion.span
                  layoutId="pestana-activa"
                  className="absolute inset-0 rounded-xl bg-primary-50"
                  transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                />
              )}
              <Icono className="relative size-5" />
              <span className="relative">{item.etiqueta}</span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-sand p-4">
        <div className="flex items-center gap-3 rounded-xl bg-cream-soft/70 p-3">
          <Avatar nombre={sesion.nombre} apellido={sesion.apellido} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">
              {sesion.nombre} {sesion.apellido}
            </p>
            <div className="mt-0.5">
              <BadgeRol rol={sesion.rol} />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={cerrarSesion}
          className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:bg-danger-soft hover:text-danger"
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
