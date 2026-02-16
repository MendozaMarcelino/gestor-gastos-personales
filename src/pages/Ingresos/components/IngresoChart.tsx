// Componente que muestra un gráfico de barras comparativo de ingresos por mes
import { useState } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import type { Ingreso } from '../../../types/ingreso';

interface Props {
  ingresos: Ingreso[]; // Lista de ingresos para graficar
}

// Tipos de períodos disponibles para visualizar
type Period = '1m' | '3m' | '6m' | '1y';

export default function IngresoChart({ ingresos }: Props) {
  // Estado para controlar el período seleccionado
  const [period, setPeriod] = useState<Period>('1m');

  // Función que obtiene los datos agrupados por mes según el período seleccionado
  const getMonthsData = (months: number) => {
    const now = new Date();
    const data: { month: string; total: number }[] = [];

    // Itera hacia atrás desde el mes actual
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      
      // Filtra los ingresos de ese mes específico
      const monthIngresos = ingresos.filter(ing => {
        const ingDate = new Date(ing.fecha);
        return ingDate.getMonth() === date.getMonth() && ingDate.getFullYear() === date.getFullYear();
      });

      // Suma todos los ingresos del mes
      const total = monthIngresos.reduce((sum, ing) => sum + ing.monto, 0);
      data.push({ month: monthName, total });
    }

    return data;
  };

  // Mapeo de períodos a número de meses
  const monthsMap = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 };
  const data = getMonthsData(monthsMap[period]);
  // Encuentra el valor máximo para escalar las barras
  const maxValue = Math.max(...data.map(d => d.total), 1);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        {/* Encabezado con título y botones de período */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5><i className="bi bi-bar-chart me-2"></i>Comparativa de Ingresos</h5>
          <ButtonGroup size="sm">
            <Button variant={period === '1m' ? 'primary' : 'outline-primary'} onClick={() => setPeriod('1m')}>1M</Button>
            <Button variant={period === '3m' ? 'primary' : 'outline-primary'} onClick={() => setPeriod('3m')}>3M</Button>
            <Button variant={period === '6m' ? 'primary' : 'outline-primary'} onClick={() => setPeriod('6m')}>6M</Button>
            <Button variant={period === '1y' ? 'primary' : 'outline-primary'} onClick={() => setPeriod('1y')}>1A</Button>
          </ButtonGroup>
        </div>

        {/* Contenedor del gráfico de barras */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '200px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Etiqueta con el valor del mes */}
              <div style={{ fontSize: '12px', marginBottom: '5px', fontWeight: 'bold', color: '#0d6efd' }}>
                ${item.total.toLocaleString('es-CO')}
              </div>
              {/* Barra del gráfico con altura proporcional al valor */}
              <div
                style={{
                  width: '100%',
                  height: `${(item.total / maxValue) * 150}px`,
                  backgroundColor: '#0d6efd',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '5px',
                  transition: 'height 0.3s ease'
                }}
              ></div>
              {/* Etiqueta con el nombre del mes */}
              <div style={{ fontSize: '11px', marginTop: '5px', textAlign: 'center' }}>
                {item.month}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}
