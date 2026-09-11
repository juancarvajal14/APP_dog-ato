import { Search } from 'lucide-react'

export function SearchInput({ value, onChange, placeholder = 'Buscar...' }) {
  return (
    <div className="relative w-full max-w-xs">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-sand-dark bg-white py-2.5 pl-10 pr-3.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-100"
      />
    </div>
  )
}
