import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

interface Filters {
  categoria?: string;
  fechaExacta?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

interface GastoFiltersProps {
  onFilter: (filters: Filters) => void;
  onClear: () => void;
}

const categorias = [
  'Alimentación',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Educación',
  'Hogar',
  'Otros'
];

export default function GastoFilters({ onFilter, onClear }: GastoFiltersProps) {
  const [categoria, setCategoria] = useState('');
  const [fechaExacta, setFechaExacta] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const handleFilter = () => {
    onFilter({
      categoria: categoria || undefined,
      fechaExacta: fechaExacta || undefined,
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    });
  };

  const handleClear = () => {
    setCategoria('');
    setFechaExacta('');
    setFechaDesde('');
    setFechaHasta('');
    onClear();
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5>Filtros</h5>
        <Form>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="">Todas</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Exacta</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaExacta}
                  onChange={(e) => setFechaExacta(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Desde</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={handleFilter}>
              Filtrar
            </Button>
            <Button variant="outline-secondary" onClick={handleClear}>
              Limpiar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}