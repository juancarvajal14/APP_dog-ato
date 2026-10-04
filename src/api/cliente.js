const URL_BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '')

let token = null
let alExpirarSesion = () => {}

export function configurarToken(nuevoToken) {
  token = nuevoToken
}

// El AuthContext se registra aquí para enterarse cuando el API responde 401 con un token activo.
export function registrarAlExpirarSesion(callback) {
  alExpirarSesion = callback
}

export class ErrorApi extends Error {
  constructor(estado, mensaje) {
    super(mensaje)
    this.estado = estado
  }
}

function extraerMensaje(cuerpo, estado) {
  if (typeof cuerpo?.detail === 'string') return cuerpo.detail
  if (estado === 422) return 'Los datos enviados no son válidos'
  return 'Ocurrió un error inesperado'
}

export async function peticion(ruta, { metodo = 'GET', cuerpo } = {}) {
  let respuesta
  try {
    respuesta = await fetch(`${URL_BASE}${ruta}`, {
      method: metodo,
      headers: {
        ...(cuerpo !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new ErrorApi(0, 'No se pudo conectar con el servidor. Verifica que el API esté encendido')
  }

  if (respuesta.status === 204) return null

  const datos = await respuesta.json().catch(() => null)
  if (!respuesta.ok) {
    if (respuesta.status === 401 && token) alExpirarSesion()
    throw new ErrorApi(respuesta.status, extraerMensaje(datos, respuesta.status))
  }
  return datos
}
