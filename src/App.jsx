import { DataProvider } from './context/DataContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'

function Enrutador() {
  const { sesion, cargando } = useAuth()

  if (cargando) return null

  return sesion ? <DashboardPage /> : <LoginPage />
}

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <Enrutador />
      </AuthProvider>
    </DataProvider>
  )
}

export default App
