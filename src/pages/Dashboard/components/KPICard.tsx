import { Card } from 'react-bootstrap';
interface KPICardProps {
  title: string;       
  value: string;        
  percentage: number;   
  icon: string;         
  color: string;        
}

export default function KPICard({ title, value, percentage, icon, color }: KPICardProps) {
  // LÓGICA: Determina si el porcentaje es positivo o negativo
  const isPositive = percentage >= 0;
  
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        {/* LAYOUT: Contenedor flex para distribuir contenido */}
        <div className="d-flex justify-content-between align-items-start">
          {/* SECCIÓN IZQUIERDA: Información de la métrica */}
          <div>
            <p className="text-muted mb-1 small">{title}</p>
            <h3 className="mb-2">{value}</h3>
            {/* BADGE: Muestra el porcentaje con color según sea positivo o negativo */}
            <span className={`badge ${isPositive ? 'bg-success' : 'bg-danger'}`}>
              <i className={`bi bi-arrow-${isPositive ? 'up' : 'down'} me-1`}> </i>
              {Math.abs(percentage)} %
            </span>
          </div>
          {/* SECCIÓN DERECHA: Ícono decorativo con fondo de color */}
          <div className={`bg-${color} bg-opacity-10 p-3 rounded`}>
            <i className={`bi bi-${icon} fs-3 text-${color}`}></i>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
