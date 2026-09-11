export function formatearFecha(valor) {
  if (!valor) return '—'
  const fecha = new Date(valor)
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatearFechaHora(valor) {
  if (!valor) return '—'
  const fecha = new Date(valor)
  return fecha.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const nacimiento = new Date(fechaNacimiento)
  const hoy = new Date()
  let anios = hoy.getFullYear() - nacimiento.getFullYear()
  let meses = hoy.getMonth() - nacimiento.getMonth()
  if (meses < 0 || (meses === 0 && hoy.getDate() < nacimiento.getDate())) {
    anios -= 1
    meses += 12
  }
  if (anios <= 0) {
    return `${Math.max(meses, 1)} ${meses === 1 ? 'mes' : 'meses'}`
  }
  return `${anios} ${anios === 1 ? 'año' : 'años'}`
}
