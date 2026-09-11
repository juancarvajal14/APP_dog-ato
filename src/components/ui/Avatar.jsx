import { cn } from '../../lib/cn'

const paleta = [
  'bg-primary-100 text-primary-700',
  'bg-accent-soft text-accent-dark',
  'bg-success-soft text-success',
  'bg-warning-soft text-warning',
]

function colorPara(texto) {
  const codigo = texto.split('').reduce((acc, letra) => acc + letra.charCodeAt(0), 0)
  return paleta[codigo % paleta.length]
}

export function Avatar({ nombre = '', apellido = '', className, size = 'md' }) {
  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || '?'
  const tamanos = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-lg' }
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-heading font-semibold',
        colorPara(nombre + apellido),
        tamanos[size],
        className,
      )}
    >
      {iniciales}
    </div>
  )
}
