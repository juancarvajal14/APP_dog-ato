import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

export function Modal({ abierto, onCerrar, titulo, descripcion, children, ancho = 'max-w-lg' }) {
  useEffect(() => {
    if (!abierto) return undefined
    const alPresionarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPresionarTecla)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPresionarTecla)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  return createPortal(
    <AnimatePresence>
      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onCerrar}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            className={cn(
              'relative w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl shadow-ink/20',
              ancho,
            )}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-sand px-6 py-5">
              <div>
                <h2 id="modal-titulo" className="font-heading text-lg text-ink">
                  {titulo}
                </h2>
                {descripcion && <p className="mt-1 text-sm text-ink-soft">{descripcion}</p>}
              </div>
              <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sand/70"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
