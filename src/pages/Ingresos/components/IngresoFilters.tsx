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
}
