// Componente de formulario modal para crear y editar ingresos
import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import type { Ingreso } from '../../../types/ingreso';

interface Props {
  show: boolean; // Controla si el modal está visible
  onHide: () => void; // Función para cerrar el modal
  onSave: (ingreso: Omit<Ingreso, 'id'>) => void; // Función para guardar el ingreso
  editingIngreso: Ingreso | null; // Ingreso a editar (null si es nuevo)
}

export default function IngresoForm({ show, onHide, onSave, editingIngreso }: Props) {
  // Estados para cada campo del formulario
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [categoria, setCategoria] = useState<Ingreso['categoria']>('Salario');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState<Ingreso['tipo']>('Fijo');
  const [etiquetas, setEtiquetas] = useState('');
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [frecuencia, setFrecuencia] = useState<'Mensual' | 'Semanal' | 'Anual'>('Mensual');
  const [fechaEjecucion, setFechaEjecucion] = useState('1');

  // Efecto que carga los datos del ingreso cuando se está editando
  useEffect(() => {
    if (editingIngreso) {
      // Carga los datos del ingreso existente en el formulario
      setMonto(editingIngreso.monto.toString());
      setFecha(editingIngreso.fecha);
      setCategoria(editingIngreso.categoria);
      setDescripcion(editingIngreso.descripcion || '');
      setTipo(editingIngreso.tipo);
      setEtiquetas(editingIngreso.etiquetas?.join(', ') || '');
      setEsRecurrente(!!editingIngreso.recurrente?.activo);
      setFrecuencia(editingIngreso.recurrente?.frecuencia || 'Mensual');
      setFechaEjecucion(editingIngreso.recurrente?.fechaEjecucion.toString() || '1');
    } else {
      resetForm();
    }
  }, [editingIngreso, show]);

  // Función para limpiar todos los campos del formulario
  const resetForm = () => {
    setMonto('');
    setFecha('');
    setCategoria('Salario');
    setDescripcion('');
    setTipo('Fijo');
    setEtiquetas('');
    setEsRecurrente(false);
    setFrecuencia('Mensual');
    setFechaEjecucion('1');
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Construye el objeto de ingreso con todos los datos del formulario
    const ingresoData: Omit<Ingreso, 'id'> = {
      monto: parseFloat(monto),
      fecha,
      categoria,
      descripcion: descripcion || undefined,
      tipo,
      etiquetas: etiquetas ? etiquetas.split(',').map(e => e.trim()).filter(Boolean) : undefined,
      recurrente: esRecurrente ? {
        activo: true,
        frecuencia,
        fechaEjecucion: parseInt(fechaEjecucion)
      } : undefined
    };
    onSave(ingresoData);
    onHide();
    resetForm();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editingIngreso ? 'Editar Ingreso' : 'Nuevo Ingreso'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Campo para el monto del ingreso */}
          <Form.Group className="mb-3">
            <Form.Label>Monto </Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
          </Form.Group>

          {/* Campo para la fecha del ingreso */}
          <Form.Group className="mb-3">
            <Form.Label>Fecha </Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </Form.Group>

          {/* Selector de categoría */}
          <Form.Group className="mb-3">
            <Form.Label>Categoría </Form.Label>
            <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value as Ingreso['categoria'])}>
              <option value="Salario">Salario</option>
              <option value="Ventas">Ventas</option>
              <option value="Inversiones">Inversiones</option>
              <option value="Otros">Otros</option>
            </Form.Select>
          </Form.Group>

          {/* Selector de tipo (Fijo o Variable) */}
          <Form.Group className="mb-3">
            <Form.Label>Tipo </Form.Label>
            <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value as Ingreso['tipo'])}>
              <option value="Fijo">Fijo</option>
              <option value="Variable">Variable</option>
            </Form.Select>
          </Form.Group>

          {/* Campo opcional para descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>

          {/* Campo opcional para etiquetas */}
          <Form.Group className="mb-3">
            <Form.Label>Etiquetas</Form.Label>
            <Form.Control
              type="text"
              value={etiquetas}
              onChange={(e) => setEtiquetas(e.target.value)}
              placeholder="ej: trabajo, extra, bono"
            />
          </Form.Group>

          {/* Checkbox para activar ingreso recurrente */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Ingreso Recurrente"
              checked={esRecurrente}
              onChange={(e) => setEsRecurrente(e.target.checked)}
            />
          </Form.Group>

          {/* Campos adicionales que aparecen solo si es recurrente */}
          {esRecurrente && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Frecuencia</Form.Label>
                <Form.Select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value as any)}>
                  <option value="Semanal">Semanal</option>
                  <option value="Mensual">Mensual</option>
                  <option value="Anual">Anual</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Día de ejecución</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max={frecuencia === 'Mensual' ? '31' : frecuencia === 'Semanal' ? '7' : '365'}
                  value={fechaEjecucion}
                  onChange={(e) => setFechaEjecucion(e.target.value)}
                />
                <Form.Text className="text-muted">
                  {frecuencia === 'Mensual' && 'Día del mes (1-31)'}
                  {frecuencia === 'Semanal' && 'Día de la semana (1=Lunes, 7=Domingo)'}
                  {frecuencia === 'Anual' && 'Día del año (1-365)'}
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancelar</Button>
          <Button variant="primary" type="submit">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
