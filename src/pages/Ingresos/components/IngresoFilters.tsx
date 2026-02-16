// Componente para filtrar ingresos por categoría, tipo y rango de fechas
import { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import type { Ingreso } from '../../../types/ingreso';

interface Filters {
  categoria?: Ingreso['categoria']; // Filtro por categoría
  tipo?: Ingreso['tipo']; // Filtro por tipo (Fijo/Variable)
  fechaDesde?: string; // Fecha inicial del rango
  fechaHasta?: string; // Fecha final del rango
}

interface Props {
  onFilter: (filters: Filters) => void; // Función que aplica los filtros
  onClear: () => void; // Función que limpia todos los filtros
}

export default function IngresoFilters({ onFilter, onClear }: Props) {
  // Estados para cada filtro
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  // Función que construye el objeto de filtros y lo envía al componente padre
  const handleFilter = () => {
    const filters: Filters = {};
    if (categoria) filters.categoria = categoria as Ingreso['categoria'];
    if (tipo) filters.tipo = tipo as Ingreso['tipo'];
    if (fechaDesde) filters.fechaDesde = fechaDesde;
    if (fechaHasta) filters.fechaHasta = fechaHasta;
    onFilter(filters);
  };

  // Función que limpia todos los campos de filtro
  const handleClear = () => {
    setCategoria('');
    setTipo('');
    setFechaDesde('');
    setFechaHasta('');
    onClear();
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <h6 className="mb-3"><i className="bi bi-funnel me-2"></i>Filtros</h6>
        <Row>
          {/* Filtro por categoría */}
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas</option>
                <option value="Salario">Salario</option>
                <option value="Ventas">Ventas</option>
                <option value="Inversiones">Inversiones</option>
                <option value="Otros">Otros</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {/* Filtro por tipo */}
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Tipo</Form.Label>
              <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Todos</option>
                <option value="Fijo">Fijo</option>
                <option value="Variable">Variable</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {/* Filtro por fecha desde */}
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Desde</Form.Label>
              <Form.Control type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
            </Form.Group>
          </Col>
          {/* Filtro por fecha hasta */}
          <Col md={3}>
            <Form.Group className="mb-2">
              <Form.Label>Hasta</Form.Label>
              <Form.Control type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
            </Form.Group>
          </Col>
        </Row>
        {/* Botones para aplicar o limpiar filtros */}
        <div className="d-flex gap-2 mt-2">
          <Button variant="primary" size="sm" onClick={handleFilter}>
            <i className="bi bi-search me-1"></i>Filtrar
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={handleClear}>
            <i className="bi bi-x-circle me-1"></i>Limpiar
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
