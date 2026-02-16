// Componente que muestra la tabla de ingresos con opciones de editar y eliminar
import { Table, Button, Badge } from 'react-bootstrap';
import type { Ingreso } from '../../../types/ingreso';

interface Props {
  ingresos: Ingreso[]; // Lista de ingresos a mostrar
  onEdit: (ingreso: Ingreso) => void; // Función para editar un ingreso
  onDelete: (id: number) => void; // Función para eliminar un ingreso
}

export default function IngresoTable({ ingresos, onEdit, onDelete }: Props) {
  // Si no hay ingresos, muestra un mensaje
  if (ingresos.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <i className="bi bi-inbox fs-1 d-block mb-2"></i>
        No hay ingresos registrados
      </div>
    );
  }

  // Renderiza la tabla con todos los ingresos
  return (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Monto</th>
          <th>Categoría</th>
          <th>Tipo</th>
          <th>Descripción</th>
          <th>Etiquetas</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ingresos.map((ingreso) => (
          <tr key={ingreso.id}>
            {/* Muestra la fecha formateada */}
            <td>{new Date(ingreso.fecha).toLocaleDateString()}</td>
            {/* Muestra el monto en formato colombiano */}
            <td className="text-primary fw-bold">${ingreso.monto.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            {/* Muestra la categoría como badge */}
            <td>
              <Badge bg="info">{ingreso.categoria}</Badge>
            </td>
            {/* Muestra el tipo con color diferente según sea Fijo o Variable */}
            <td>
              <Badge bg={ingreso.tipo === 'Fijo' ? 'primary' : 'warning'}>
                {ingreso.tipo}
              </Badge>
            </td>
            {/* Muestra la descripción o un guion si no hay */}
            <td>{ingreso.descripcion || '-'}</td>
            {/* Muestra las etiquetas como badges */}
            <td>
              {ingreso.etiquetas?.map((tag, i) => (
                <Badge key={i} bg="secondary" className="me-1">{tag}</Badge>
              )) || '-'}
            </td>
            {/* Botones de acción para editar y eliminar */}
            <td>
              <Button variant="outline-primary" size="sm" className="me-1" onClick={() => onEdit(ingreso)}>
                <i className="bi bi-pencil"></i>
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => onDelete(ingreso.id)}>
                <i className="bi bi-trash"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
