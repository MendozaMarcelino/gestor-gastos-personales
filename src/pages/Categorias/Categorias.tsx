import { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Badge } from 'react-bootstrap';
import { getAllIngresos } from '../../services/ingresosStorage';
import { getAllGastos } from '../../services/gastosStorage';

interface CategoriaStats {
  nombre: string;
  tipo: 'Ingreso' | 'Gasto';
  cantidad: number;
  total: number;
}

export default function Categorias() {
  const [stats, setStats] = useState<CategoriaStats[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaStats | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const ingresos = getAllIngresos();
    const gastos = getAllGastos();

    const ingresosStats = new Map<string, { cantidad: number; total: number }>();
    ingresos.forEach(ing => {
      const current = ingresosStats.get(ing.categoria) || { cantidad: 0, total: 0 };
      ingresosStats.set(ing.categoria, {
        cantidad: current.cantidad + 1,
        total: current.total + ing.monto
      });
    });

    const gastosStats = new Map<string, { cantidad: number; total: number }>();
    gastos.forEach(gasto => {
      const current = gastosStats.get(gasto.categoria) || { cantidad: 0, total: 0 };
      gastosStats.set(gasto.categoria, {
        cantidad: current.cantidad + 1,
        total: current.total + gasto.monto
      });
    });

    const allStats: CategoriaStats[] = [
      ...Array.from(ingresosStats.entries()).map(([nombre, data]) => ({
        nombre,
        tipo: 'Ingreso' as const,
        cantidad: data.cantidad,
        total: data.total
      })),
      ...Array.from(gastosStats.entries()).map(([nombre, data]) => ({
        nombre,
        tipo: 'Gasto' as const,
        cantidad: data.cantidad,
        total: data.total
      }))
    ];

    setStats(allStats.sort((a, b) => b.total - a.total));
  };

  const handleViewDetails = (categoria: CategoriaStats) => {
    setSelectedCategoria(categoria);
    setShowModal(true);
  };

  const totalIngresos = stats.filter(s => s.tipo === 'Ingreso').reduce((sum, s) => sum + s.total, 0);
  const totalGastos = stats.filter(s => s.tipo === 'Gasto').reduce((sum, s) => sum + s.total, 0);

  return (
    <div>
      <h1 className="mb-4">
        <i className="bi bi-tags me-2 text-info"></i>
        Categorías
      </h1>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-success">
            <div className="card-body">
              <h5 className="text-success"><i className="bi bi-plus-circle me-2"></i>Total Ingresos</h5>
              <h3 className="text-success">$ {totalIngresos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-danger">
            <div className="card-body">
              <h5 className="text-danger"><i className="bi bi-dash-circle me-2"></i>Total Gastos</h5>
              <h3 className="text-danger">$ {totalGastos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Resumen por Categoría</h5>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted">No hay datos disponibles</td>
                </tr>
              ) : (
                stats.map((stat, idx) => (
                  <tr key={idx}>
                    <td>{stat.nombre}</td>
                    <td>
                      <Badge bg={stat.tipo === 'Ingreso' ? 'success' : 'danger'}>
                        {stat.tipo}
                      </Badge>
                    </td>
                    <td>{stat.cantidad}</td>
                    <td className={stat.tipo === 'Ingreso' ? 'text-success' : 'text-danger'}>
                      ${stat.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <Button size="sm" variant="outline-info" onClick={() => handleViewDetails(stat)}>
                        <i className="bi bi-eye">Ver Detalles</i> 
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCategoria?.nombre} - {selectedCategoria?.tipo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Cantidad de registros:</strong> {selectedCategoria?.cantidad}</p>
          <p><strong>Total:</strong> $ {selectedCategoria?.total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
          <p><strong>Promedio:</strong> $ {selectedCategoria ? (selectedCategoria.total / selectedCategoria.cantidad).toLocaleString('es-CO', { minimumFractionDigits: 2 }) : 0}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
