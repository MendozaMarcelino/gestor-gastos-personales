import { Table, Button } from 'react-bootstrap';
import type { Gasto } from '../../../types/gasto';

interface GastoTableProps {
  gastos: Gasto[];
  onEdit: (gasto: Gasto) => void;
  onDelete: (id: number) => void;
}

export default function GastoTable({ gastos, onEdit, onDelete }: GastoTableProps) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Categoría</th>
          <th>Monto</th>
          <th>Descripción</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {gastos.map(gasto => (
          <tr key={gasto.id}>
            <td>{new Date(gasto.fecha).toLocaleDateString('es-ES')}</td>
            <td>{gasto.categoria}</td>
            <td>${gasto.monto.toFixed(2)}</td>
            <td>{gasto.descripcion || '-'}</td>
            <td>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => onEdit(gasto)}
              >
                Editar
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => onDelete(gasto.id)}
              >
                Eliminar
              </Button>
            </td>
          </tr>
        ))}
        {gastos.length === 0 && (
          <tr>
            <td colSpan={5} className="text-center text-muted">
              No hay gastos registrados
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}