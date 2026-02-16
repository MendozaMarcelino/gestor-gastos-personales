// Página principal del módulo de Ingresos - Gestiona el estado y coordina todos los componentes
import { useState, useEffect, useCallback } from 'react';
import { Button, Card } from 'react-bootstrap';
import IngresoForm from './components/IngresoForm';
import IngresoTable from './components/IngresoTable';
import IngresoFilters from './components/IngresoFilters';
import IngresoStats from './components/IngresoStats';
import IngresoChart from './components/IngresoChart';
import IngresoExport from './components/IngresoExport';
import type { Ingreso } from '../../types/ingreso';
import { getAllIngresos, createIngreso, updateIngreso, removeIngreso } from '../../services/ingresosStorage';

// Interfaz para los filtros aplicables
interface Filters {
  categoria?: Ingreso['categoria'];
  tipo?: Ingreso['tipo'];
  fechaDesde?: string;
  fechaHasta?: string;
}

export default function Ingresos() {
  // Estados principales del componente
  const [ingresos, setIngresos] = useState<Ingreso[]>([]); // Lista completa de ingresos
  const [filteredIngresos, setFilteredIngresos] = useState<Ingreso[]>([]); // Ingresos filtrados
  const [showForm, setShowForm] = useState(false); // Controla la visibilidad del formulario
  const [editingIngreso, setEditingIngreso] = useState<Ingreso | null>(null); // Ingreso en edición
  const [filters, setFilters] = useState<Filters>({}); // Filtros activos

  // Función para cargar todos los ingresos desde localStorage
  const loadIngresos = () => {
    const allIngresos = getAllIngresos().sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    setIngresos(allIngresos);
  };

  // Función que aplica los filtros a la lista de ingresos
  const applyFilters = useCallback(() => {
    let filtered = [...ingresos];

    // Filtra por categoría si está seleccionada
    if (filters.categoria) {
      filtered = filtered.filter(i => i.categoria === filters.categoria);
    }

    // Filtra por tipo si está seleccionado
    if (filters.tipo) {
      filtered = filtered.filter(i => i.tipo === filters.tipo);
    }

    // Filtra por fecha desde
    if (filters.fechaDesde) {
      filtered = filtered.filter(i => i.fecha >= filters.fechaDesde!);
    }

    // Filtra por fecha hasta
    if (filters.fechaHasta) {
      filtered = filtered.filter(i => i.fecha <= filters.fechaHasta!);
    }

    setFilteredIngresos(filtered);
  }, [ingresos, filters]);

  // Efecto que carga los ingresos al montar el componente
  useEffect(() => {
    loadIngresos();
  }, []);

  // Efecto que aplica los filtros cuando cambian los ingresos o filtros
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Función para guardar un ingreso (crear o actualizar)
  const handleSave = (ingresoData: Omit<Ingreso, 'id'>) => {
    if (editingIngreso) {
      updateIngreso(editingIngreso.id, ingresoData); // Actualiza si está editando
    } else {
      createIngreso(ingresoData); // Crea uno nuevo si no está editando
    }
    loadIngresos();
    setEditingIngreso(null);
  };

  // Función para iniciar la edición de un ingreso
  const handleEdit = (ingreso: Ingreso) => {
    setEditingIngreso(ingreso);
    setShowForm(true);
  };

  // Función para eliminar un ingreso con confirmación
  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este ingreso?')) {
      removeIngreso(id);
      loadIngresos();
    }
  };

  // Función para aplicar nuevos filtros
  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  // Función para limpiar todos los filtros
  const handleClear = () => {
    setFilters({});
  };

  // Calcula el total de los ingresos filtrados
  const total = filteredIngresos.reduce((sum, i) => sum + i.monto, 0);

  return (
    <div>
      {/* Encabezado con título y botones de acción */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-plus-circle me-2 text-primary"></i>
          Ingresos
        </h1>
        <div className="d-flex gap-2">
          <IngresoExport ingresos={filteredIngresos} />
          <Button variant="primary" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Ingreso
          </Button>
        </div>
      </div>

      {/* Componente de estadísticas (total, variación, mes anterior) */}
      <IngresoStats ingresos={ingresos} />

      {/* Componente de gráfico comparativo */}
      <IngresoChart ingresos={ingresos} />

      {/* Componente de filtros */}
      <IngresoFilters onFilter={handleFilter} onClear={handleClear} />

      {/* Tarjeta con la tabla de ingresos */}
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Ingresos Registrados</h5>
            <div className="text-primary fw-bold fs-5">
              Total: ${total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <IngresoTable
            ingresos={filteredIngresos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </Card.Body>
      </Card>

      {/* Modal del formulario para crear/editar ingresos */}
      <IngresoForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingIngreso(null);
        }}
        onSave={handleSave}
        editingIngreso={editingIngreso}
      />
    </div>
  );
}
