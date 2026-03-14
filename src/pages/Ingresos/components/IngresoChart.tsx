// Componente que muestra un gráfico de líneas comparativo de ingresos por mes
import { useState } from 'react';
import { Card, ButtonGroup, Button } from 'react-bootstrap';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Ingreso } from '../../../types/ingreso';

interface Props {
  ingresos: Ingreso[]; // Lista de ingresos para graficar
}

// Tipos de períodos disponibles para visualizar
type Period = '1m' | '3m' | '6m' | '1y';

export default function IngresoChart({ ingresos }: Props) {
  // Estado para controlar el período seleccionado
  const [period, setPeriod] = useState<Period>('1m');

  // Función que obtiene los datos agrupados por día según el período seleccionado
  const getDaysData = (months: number) => {
    if (ingresos.length === 0) return [];

    const now = new Date();
    const dates = ingresos.map(ing => new Date(ing.fecha).getTime());
    const firstIngresoDate = new Date(Math.min(...dates));
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
    
    // Usa la fecha más antigua entre el primer ingreso y el inicio del período
    const effectiveStartDate = firstIngresoDate < startDate ? firstIngresoDate : startDate;

    // Agrupa ingresos por fecha
    const groupedByDate = ingresos.reduce((acc, ing) => {
      const dateKey = new Date(ing.fecha).toISOString().split('T')[0];
      if (!acc[dateKey]) acc[dateKey] = 0;
      acc[dateKey] += ing.monto;
      return acc;
    }, {} as Record<string, number>);

    // Crea array desde la fecha efectiva hasta hoy
    const data: { month: string; total: number }[] = [];
    const currentDate = new Date(effectiveStartDate);
    
    while (currentDate <= now) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dateLabel = currentDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
      data.push({ 
        month: dateLabel, 
        total: groupedByDate[dateKey] || 0 
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  };

  // Mapeo de períodos a número de meses
  const monthsMap = { '1m': 1, '3m': 3, '6m': 6, '1y': 12 };
  const data = getDaysData(monthsMap[period]);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        {/* Encabezado con título y botones de período */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5><i className="bi bi-graph-up me-2"></i>Comparativa de Ingresos</h5>
          <ButtonGroup size="sm">
            <Button variant={period === '1m' ? 'primary' : 'outline-primary'} onClick={() => setPeriod('1m')}>1 Mes</Button>
            <Button variant={period === '3m' ? 'primary' : 'outline-primary'} onClick={() => setPeriod('3m')}>3 Meses</Button>
            <Button variant={period === '6m' ? 'primary' : 'outline-primary'} onClick={() => setPeriod('6m')}>6 Meses</Button>
            <Button variant={period === '1y' ? 'primary' : 'outline-primary'} onClick={() => setPeriod('1y')}>1 Año</Button>
          </ButtonGroup>
        </div>

        {/* Gráfico de área */}
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#020202" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#000000" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString('es-CO')}`} />
            <Area type="monotone" dataKey="total" stroke="#0d6efd" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
