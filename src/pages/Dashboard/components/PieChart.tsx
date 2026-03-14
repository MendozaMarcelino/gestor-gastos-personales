import { Card } from 'react-bootstrap';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// INTERFAZ: Estructura de datos para cada segmento del gráfico circular
interface PieData {
  name: string;   
  value: number;  
}

// INTERFAZ: Propiedades que recibe el componente
interface PieChartProps {
  data: PieData[];  // Array con las categorías y sus montos
}

// PALETA DE COLORES: Array de colores para cada segmento del gráfico
const COLORS = ['#0d6efd', '#2ef210', '#6f42c1', '#0d0e0e', '#dc3545', '#fd7e14', '#ffc107', '#ee0b93'];

export default function PieChart({ data }: PieChartProps) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <h5 className="mb-3">Gastos por Categoría</h5>
        {/* CONDICIONAL: Muestra gráfico si hay datos, sino muestra mensaje */}
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <RechartsPie>
              <Pie
                data={data}
                cx="50%"             
                cy="50%"              
                labelLine={false}     
                // ETIQUETAS: Muestra nombre y porcentaje en cada segmento
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={75}      // Radio del círculo
                fill="#8884d8"
                dataKey="value"       
              >
                {/* MAPEO DE COLORES: Asigna un color a cada segmento */}
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              {/* TOOLTIP: Muestra información al pasar el mouse */}
              <Tooltip 
                formatter={(value) => `$ ${Number(value).toFixed(2)}`}
                contentStyle={{ fontSize: '13px' }}
              />
              {/* LEYENDA: Lista de categorías con sus colores */}
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </RechartsPie>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-center">No hay gastos registrados</p>
        )}
      </Card.Body>
    </Card>
  );
}
