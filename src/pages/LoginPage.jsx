import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, HeartPulse, Lock, Mail, PawPrint, ShieldCheck, Stethoscope } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Marca } from '../components/layout/Marca'
import { Button } from '../components/ui/Button'
import { Label, Input, CampoError } from '../components/ui/Field'

const cuentasDemo = [
  { rol: 'Administrador', email: 'camilo.carvajal@dogato.com', password: 'admin123' },
  { rol: 'Veterinario', email: 'andres.gomez@dogato.com', password: 'vet123' },
]

export function LoginPage() {
  const { iniciarSesion } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const manejarEnvio = (evento) => {
    evento.preventDefault()
    setError('')
    setEnviando(true)
    setTimeout(() => {
      const resultado = iniciarSesion(email, password)
      if (!resultado.ok) setError(resultado.mensaje)
      setEnviando(false)
    }, 400)
  }

  const usarCuenta = (cuenta) => {
    setEmail(cuenta.email)
    setPassword(cuenta.password)
    setError('')
  }

  return (
    <div className="flex min-h-screen bg-cream">
      <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-dark p-12 text-white lg:flex">
        <div className="absolute -right-16 -top-16 size-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 size-80 rounded-full bg-accent/20 blur-3xl" />

        <Marca tamanoTexto="text-xl text-white" className="relative [&_span]:text-white" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <h1 className="font-heading text-4xl leading-tight">
            El cuidado de cada mascota, organizado en un solo lugar.
          </h1>
          <p className="mt-4 max-w-md text-primary-100">
            Agenda citas, consulta historiales clínicos y gestiona a tu equipo veterinario desde un panel pensado
            para el día a día de tu clínica.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icono: PawPrint, texto: 'Mascotas y propietarios centralizados' },
              { icono: HeartPulse, texto: 'Historial clínico completo por consulta' },
              { icono: Stethoscope, texto: 'Agenda de citas sin cruces ni confusiones' },
            ].map((item) => (
              <div key={item.texto} className="flex items-center gap-3 text-sm">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <item.icono className="size-4.5" />
                </div>
                {item.texto}
              </div>
            ))}
          </div>
        </motion.div>

        <p className="relative text-xs text-primary-200">© 2026 DOG-ATO · Plataforma de gestión veterinaria</p>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <Marca />
          </div>

          <h2 className="font-heading text-2xl text-ink">Bienvenido de nuevo</h2>
          <p className="mt-1.5 text-sm text-ink-soft">Ingresa con tu correo y contraseña para continuar.</p>

          <form onSubmit={manejarEnvio} className="mt-7 space-y-4">
            <div>
              <Label htmlFor="email" requerido>
                Correo electrónico
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nombre@dogato.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" requerido>
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-faint" />
                <Input
                  id="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="pl-10 pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((v) => !v)}
                  aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center text-ink-faint hover:text-ink-soft"
                >
                  {mostrarPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <CampoError>{error}</CampoError>

            <Button type="submit" className="w-full" isLoading={enviando}>
              Ingresar
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-sand bg-cream-soft/60 p-4">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
              <ShieldCheck className="size-3.5" />
              Cuentas de prueba (mockup)
            </p>
            <div className="mt-2.5 space-y-1.5">
              {cuentasDemo.map((cuenta) => (
                <button
                  key={cuenta.email}
                  type="button"
                  onClick={() => usarCuenta(cuenta)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-white"
                >
                  <span className="font-medium text-ink">{cuenta.rol}</span>
                  <span className="text-ink-faint">{cuenta.email}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
