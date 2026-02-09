export default function DashboardHome() {
  return (
    <div>
      <h1 className="mb-4">
        <i className="bi bi-speedometer2 me-2 text-primary"></i>
        Dashboard
      </h1>
      <div className="card shadow-sm">
        <div className="card-body text-center p-5">
          <h5 className="text-primary">¡Bienvenido al Gestor de Gastos Personales!</h5>
          <p className="text-muted mt-3">
            Selecciona un módulo del menú lateral para comenzar
          </p>
        </div>
      </div>
    </div>
  )
}
