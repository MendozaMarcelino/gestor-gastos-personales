import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar/Sidebar'
import './DashboardLayout.css'

interface DashboardLayoutProps {
  user: string | null
  onLogout: () => void
}

export default function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setSidebarOpen(false)
    navigate('/')
    onLogout()
  }

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* CONTENEDOR PRINCIPAL */}
      <div className="dashboard-main">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="header-left">
            <button
              className="btn btn-outline-secondary d-md-none"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Abrir menú"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>

          <div className="header-right">
            <div className="user-info d-flex align-items-center">
              <span className="me-3">
                <i className="bi bi-person-circle me-2"></i>
                {user}
              </span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
