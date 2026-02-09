import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Home from '../pages/Home/Home'
import DashboardHome from '../pages/Dashboard/DashboardHome'
import Ingresos from '../pages/Ingresos/Ingresos'
import Gastos from '../pages/Gastos/Gastos'
import Categorias from '../pages/Categorias/Categorias'
import Transacciones from '../pages/Transacciones/Transacciones'
import Informes from '../pages/Informes/Informes'
import Metas from '../pages/Metas/Metas'
import Inversiones from '../pages/Inversiones/Inversiones'

interface AppRouterProps {
  user: string | null
  onLogout: () => void
}

export default function AppRouter({ user, onLogout }: AppRouterProps) {
  return (
    <Routes>
      {/* Ruta de inicio/login */}
      <Route 
        path="/" 
        element={!user ? <Home /> : <Navigate to="/dashboard" replace />}
      />

      {/* Rutas del dashboard (solo si hay usuario logueado) */}
      <Route
        path="/dashboard"
        element={user ? <DashboardLayout user={user} onLogout={onLogout} /> : <Navigate to="/" replace />}
      >
        <Route index element={<DashboardHome />} />
        <Route path="ingresos" element={<Ingresos />} />
        <Route path="gastos" element={<Gastos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="transacciones" element={<Transacciones />} />
        <Route path="informes" element={<Informes />} />
        <Route path="metas" element={<Metas />} />
        <Route path="inversiones" element={<Inversiones />} />
      </Route>

      {/* Ruta por defecto - redirigir a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
