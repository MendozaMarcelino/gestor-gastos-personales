import { useState, useEffect, useCallback } from 'react';
import { Button, Alert } from 'react-bootstrap';
import GastoForm from './components/GastoForm';
import GastoTable from './components/GastoTable';
import GastoFilters from './components/GastoFilters';
import type { Gasto } from '../../types/gasto';
import { getAllGastos, createGasto, updateGasto, removeGasto } from '../../services/gastosStorage';

interface Filters {
  categoria?: string;
  fechaExacta?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export default function Gastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [filteredGastos, setFilteredGastos] = useState<Gasto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null);
  const [filters, setFilters] = useState<Filters>({});

  const loadGastos = () => {
    const allGastos = getAllGastos().sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    setGastos(allGastos);
  };

  const applyFilters = useCallback(() => {
    let filtered = [...gastos];

    if (filters.categoria) {
      filtered = filtered.filter(g => g.categoria === filters.categoria);
    }

    if (filters.fechaExacta) {
      filtered = filtered.filter(g => g.fecha === filters.fechaExacta);
    }

    if (filters.fechaDesde) {
      filtered = filtered.filter(g => g.fecha >= filters.fechaDesde!);
    }

    if (filters.fechaHasta) {
      filtered = filtered.filter(g => g.fecha <= filters.fechaHasta!);
    }

    setFilteredGastos(filtered);
  }, [gastos, filters]);

  useEffect(() => {
    loadGastos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSave = (gastoData: Omit<Gasto, 'id'>) => {
    if (editingGasto) {
      updateGasto(editingGasto.id, gastoData);
    } else {
      createGasto(gastoData);
    }
    loadGastos();
    setEditingGasto(null);
  };

  const handleEdit = (gasto: Gasto) => {
    setEditingGasto(gasto);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto?')) {
      removeGasto(id);
      loadGastos();
    }
  };

  const handleFilter = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleClear = () => {
    setFilters({});
  };

  const total = filteredGastos.reduce((sum, g) => sum + g.monto, 0);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-dash-circle me-2 text-danger"></i>
          Gastos
        </h1>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Gasto
        </Button>
      </div>

      <GastoFilters onFilter={handleFilter} onClear={handleClear} />

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Gastos Registrados</h5>
            <Alert variant="info" className="mb-0">
              Total: ${total.toFixed(2)}
            </Alert>
          </div>
          <GastoTable
            gastos={filteredGastos}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      <GastoForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingGasto(null);
        }}
        onSave={handleSave}
        editingGasto={editingGasto}
      />
    </div>
  );
}
