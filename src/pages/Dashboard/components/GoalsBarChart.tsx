import { Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Goal {
  nombre: string;
  progreso: number;
}

interface GoalsBarChartProps {
  goals: Goal[];
}

export default function GoalsBarChart({ goals }: GoalsBarChartProps) {
  const COLORS = ['#0d6efd', '#6610f2', '#57fd2d', '#d63384', '#dc3545'];

  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <h5 className="mb-4">Progreso de Metas</h5>
        {goals.length > 0 ? (
          <ResponsiveContainer width="37%" height={150}>
            <BarChart data={goals}>
              <XAxis dataKey="nombre" tick={{ fontSize: 7 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value} %`} />
              <Bar dataKey="progreso" radius={[8, 8, 0, 0]}>
                {goals.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-center">No hay metas registradas</p>
        )}
      </Card.Body>
    </Card>
  );
}
