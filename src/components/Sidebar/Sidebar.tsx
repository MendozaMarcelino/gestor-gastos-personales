import { NavLink, Link } from 'react-router-dom'
import { sidebarItems } from './sidebarItems'
import './Sidebar.css'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay para dispositivos móviles */}
      {isOpen && (
        <div 
          className="sidebar-overlay d-md-none"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header pb-3 border-bottom">
          <Link to="/dashboard" className="text-decoration-none" onClick={onClose}>
            <h5 className="mb-0 text-primary">
              <i className="bi bi-wallet2 me-2"></i>Gestor de Gastos
            </h5>
          </Link>
        </div>

        <nav className="sidebar-nav mt-4">
          <ul className="nav flex-column">
            {sidebarItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center ${isActive ? 'active' : ''}`
                  }
                  onClick={onClose}
                >
                  <i className={`bi ${item.icon} me-2`}></i>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}
