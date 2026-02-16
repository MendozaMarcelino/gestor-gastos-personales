// Componente que muestra estadísticas de ingresos: total actual, variación y mes anterior
import { Card, Row, Col } from 'react-bootstrap';
import type { Ingreso } from '../../../types/ingreso';

interface Props {
  ingresos: Ingreso[]; // Lista completa de ingresos
}

export default function IngresoStats({ ingresos }: Props) {
  // Obtiene la fecha actual y calcula mes y año actual
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  // Calcula el mes y año anterior
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Filtra los ingresos del mes actual
  const currentMonthIngresos = ingresos.filter(i => {
    const date = new Date(i.fecha);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Filtra los ingresos del mes anterior
  const lastMonthIngresos = ingresos.filter(i => {
    const date = new Date(i.fecha);
    return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
  });

  // Calcula los totales de cada mes
  const totalCurrent = currentMonthIngresos.reduce((sum, i) => sum + i.monto, 0);
  const totalLast = lastMonthIngresos.reduce((sum, i) => sum + i.monto, 0);
  // Calcula la variación absoluta y porcentual
  const variation = totalCurrent - totalLast;
  const variationPercent = totalLast > 0 ? ((variation / totalLast) * 100) : 0;
  const isPositive = variation >= 0;

  return (
    <Row className="mb-4">
      {/* Tarjeta del total del mes actual */}
      <Col md={4}>
        <Card className="shadow-sm border-primary">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Total Mes Actual</h6>
                <h3 className="text-primary mb-0">${totalCurrent.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
              </div>
              <i className="bi bi-cash-coin fs-1 text-primary"></i>
            </div>
          </Card.Body>
        </Card>
      </Col>
      {/* Tarjeta de variación con indicador visual */}
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Variación</h6>
                {/* Muestra la variación en verde si es positiva, rojo si es negativa */}
                <h4 className={isPositive ? 'text-success mb-0' : 'text-danger mb-0'}>
                  {isPositive ? '+' : ''}${variation.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <i className={`bi bi-arrow-${isPositive ? 'up' : 'down'}-circle ms-2`}></i>
                </h4>
              </div>
              <div className="text-end">
                <h6 className="text-muted mb-1">Porcentaje</h6>
                {/* Muestra el porcentaje de variación */}
                <h4 className={isPositive ? 'text-success mb-0' : 'text-danger mb-0'}>
                  {isPositive ? '+' : ''}{variationPercent.toFixed(1)}%
                </h4>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
      {/* Tarjeta del total del mes anterior */}
      <Col md={4}>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted mb-1">Mes Anterior</h6>
                <h4 className="mb-0">${totalLast.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
              </div>
              <i className="bi bi-calendar-check fs-1 text-muted"></i>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
