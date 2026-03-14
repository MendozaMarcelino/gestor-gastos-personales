import { Card } from 'react-bootstrap';
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// INTERFAZ: Estructura de datos para cada punto de la gráfica
interface ChartData {
  name: string;      
  ingresos: number;  
  gastos: number;    
}

// INTERFAZ: Propiedades que recibe el componente
interface LineChartProps {
  data: ChartData[];  // Array con los datos de 30 días
}

export default function LineChart({ data }: LineChartProps) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h5 className="mb-3"><center>Ingresos y Gastos del Mes</center></h5>
        {/* CONTENEDOR RESPONSIVO: Se adapta al ancho disponible */}
        <ResponsiveContainer width="100%" height={250}>
          <RechartsLine data={data}>
            {/* CUADRÍCULA: Líneas de fondo con estilo punteado */}
            <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
            {/* EJE X: Muestra los días del mes */}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            {/* EJE Y: Muestra los valores monetarios */}
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#666"
              width={60}
            />
            {/* TOOLTIP: Información al pasar el mouse, formatea valores como moneda */}
            <Tooltip 
              formatter={(value) => `$ ${Number(value).toFixed(2)}`}
              contentStyle={{ fontSize: '13px' }}
            />
            {/* LEYENDA: Muestra qué representa cada línea */}
            <Legend wrapperStyle={{ fontSize: '13px' }} />
            {/* LÍNEA DE INGRESOS: Color azul con mayor grosor */}
            <Line 
              type="monotone" 
              dataKey="ingresos" 
              stroke="#ed0dfd" 
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            {/* LÍNEA DE GASTOS: Color rojo con mayor grosor */}
            <Line 
              type="monotone" 
              dataKey="gastos" 
              stroke="#3549dc" 
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </RechartsLine>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
}
