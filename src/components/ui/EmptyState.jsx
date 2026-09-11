export function EmptyState({ icono: Icono, titulo, descripcion, accion }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sand-dark bg-cream-soft/50 px-6 py-14 text-center">
      {Icono && (
        <div className="flex size-14 items-center justify-center rounded-full bg-white text-primary-500 shadow-sm">
          <Icono className="size-7" />
        </div>
      )}
      <div>
        <p className="font-heading text-base text-ink">{titulo}</p>
        {descripcion && <p className="mx-auto mt-1 max-w-sm text-sm text-ink-soft">{descripcion}</p>}
      </div>
      {accion}
    </div>
  )
}
