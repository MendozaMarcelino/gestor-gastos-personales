import { useState, useEffect } from 'react';
import { Button, Modal, Form, ProgressBar, Badge } from 'react-bootstrap';
import { getAllMetas, createMeta, updateMeta, removeMeta } from '../../services/metasStorage';
import type { Meta } from '../../types/meta';

export default function Metas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAporteModal, setShowAporteModal] = useState(false);
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null);
  const [selectedMeta, setSelectedMeta] = useState<Meta | null>(null);
  const [aporte, setAporte] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    montoObjetivo: '',
    montoActual: '',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaLimite: '',
    categoria: 'Ahorro',
    descripcion: ''
  });

  useEffect(() => {
    loadMetas();
  }, []);

  const loadMetas = () => setMetas(getAllMetas());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const metaData = {
      ...formData,
      montoObjetivo: parseFloat(formData.montoObjetivo),
      montoActual: parseFloat(formData.montoActual || '0')
    };

    if (editingMeta) {
      updateMeta(editingMeta.id, metaData);
    } else {
      createMeta(metaData);
    }
    resetForm();
    loadMetas();
  };

  const handleAporte = () => {
    if (selectedMeta && aporte) {
      const nuevoMonto = selectedMeta.montoActual + parseFloat(aporte);
      updateMeta(selectedMeta.id, { ...selectedMeta, montoActual: nuevoMonto });
      setShowAporteModal(false);
      setAporte('');
      loadMetas();
    }
  };

  const handleEdit = (meta: Meta) => {
    setEditingMeta(meta);
    setFormData({
      nombre: meta.nombre,
      montoObjetivo: meta.montoObjetivo.toString(),
      montoActual: meta.montoActual.toString(),
      fechaInicio: meta.fechaInicio,
      fechaLimite: meta.fechaLimite,
      categoria: meta.categoria,
      descripcion: meta.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Eliminar esta meta?')) {
      removeMeta(id);
      loadMetas();
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      montoObjetivo: '',
      montoActual: '',
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaLimite: '',
      categoria: 'Ahorro',
      descripcion: ''
    });
    setEditingMeta(null);
    setShowModal(false);
  };

  const calcularProgreso = (meta: Meta) => (meta.montoActual / meta.montoObjetivo) * 100;
  const calcularDiasRestantes = (fechaLimite: string) => {
    const dias = Math.ceil((new Date(fechaLimite).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return dias;
  };


  const totalAhorrado = metas.reduce((sum, m) => sum + m.montoActual, 0);
  const metasCompletadas = metas.filter(m => m.montoActual >= m.montoObjetivo).length;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="bi bi-bullseye me-2 text-danger"></i>
          Metas Financieras
        </h1>
        <Button variant="danger" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-circle me-2"></i>Nueva Meta
        </Button>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-danger">
            <div className="card-body">
              <h6 className="text-danger"><i className="bi bi-flag me-2"></i>Total Metas</h6>
              <h3>{metas.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-success">
            <div className="card-body">
              <h6 className="text-success"><i className="bi bi-check-circle me-2"></i>Completadas</h6>
              <h3>{metasCompletadas}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm border-info">
            <div className="card-body">
              <h6 className="text-info"><i className="bi bi-piggy-bank me-2"></i>Total Ahorrado</h6>
              <h3>$ {totalAhorrado.toLocaleString('es-CO')}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {metas.length === 0 ? (
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body text-center p-5">
                <i className="bi bi-bullseye" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                <p className="text-muted mt-3">No hay metas registradas</p>
              </div>
            </div>
          </div>
        ) : (
          metas.map(meta => {
            const progreso = calcularProgreso(meta);
            const diasRestantes = calcularDiasRestantes(meta.fechaLimite);
            const completada = progreso >= 100;

            return (
              <div key={meta.id} className="col-md-6 mb-3">
                <div className={`card shadow-sm h-100 ${completada ? 'border-success' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="mb-1">{meta.nombre}</h5>
                        <Badge bg="secondary">{meta.categoria}</Badge>
                      </div>
                      {completada && <Badge bg="success"><i className="bi bi-check-circle"></i> Completada</Badge>}
                    </div>
                    
                    {meta.descripcion && <p className="text-muted small mb-3">{meta.descripcion}</p>}
                    
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Progreso del ahorro: {progreso.toFixed(1)}%</small>
                        <small>$ {meta.montoActual.toLocaleString('es-CO')} / $ {meta.montoObjetivo.toLocaleString('es-CO')}</small>
                      </div>
                      <ProgressBar 
                        now={progreso} 
                        variant={completada ? 'success' : progreso > 75 ? 'info' : progreso > 50 ? 'warning' : 'danger'}
                        style={{ height: '10px' }}
                      />
                    </div>

                    <div className="d-flex justify-content-between text-muted small mb-3">
                      <span><i className="bi bi-calendar-event"></i> {new Date(meta.fechaLimite).toLocaleDateString('es-CO')}</span>
                      <span className={diasRestantes < 30 ? 'text-danger' : ''}>
                        <i className="bi bi-clock"></i> {diasRestantes > 0 ? `${diasRestantes} días` : 'Fecha de Vencimiento'}
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-success" onClick={() => { setSelectedMeta(meta); setShowAporteModal(true); }}>
                        <i className="bi bi-plus-circle"></i> Aportar
                      </Button>
                      <Button size="sm" variant="outline-primary" onClick={() => handleEdit(meta)}>
                        <i className="bi bi-pencil"></i> Editar
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(meta.id)}>
                        <i className="bi bi-trash"></i> Eliminar 
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal show={showModal} onHide={resetForm}>
        <Modal.Header closeButton>
          <Modal.Title>{editingMeta ? 'Editar Meta' : 'Nueva Meta'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}>
                <option>Ahorro</option>
                <option>Viaje</option>
                <option>Educación</option>
                <option>Vivienda</option>
                <option>Vehículo</option>
                <option>Emergencia</option>
                <option>Otro</option>
              </Form.Select>
            </Form.Group>
            <div className="row">
              <Form.Group className="col-md-6 mb-3">
                <Form.Label>Monto Objetivo</Form.Label>
                <Form.Control type="number" required value={formData.montoObjetivo} onChange={e => setFormData({...formData, montoObjetivo: e.target.value})} />
              </Form.Group>
              <Form.Group className="col-md-6 mb-3">
                <Form.Label>Monto Actual</Form.Label>
                <Form.Control type="number" value={formData.montoActual} onChange={e => setFormData({...formData, montoActual: e.target.value})} />
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="col-md-6 mb-3">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control type="date" required value={formData.fechaInicio} onChange={e => setFormData({...formData, fechaInicio: e.target.value})} />
              </Form.Group>
              <Form.Group className="col-md-6 mb-3">
                <Form.Label>Fecha Límite</Form.Label>
                <Form.Control type="date" required value={formData.fechaLimite} onChange={e => setFormData({...formData, fechaLimite: e.target.value})} />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" rows={2} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm}>Cancelar</Button>
            <Button variant="danger" type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showAporteModal} onHide={() => setShowAporteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aportar a: {selectedMeta?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted">Actual: ${selectedMeta?.montoActual.toLocaleString('es-CO')}</p>
          <Form.Group>
            <Form.Label>Monto del Aporte</Form.Label>
            <Form.Control type="number" value={aporte} onChange={e => setAporte(e.target.value)} placeholder="0.00" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAporteModal(false)}>Cancelar</Button>
          <Button variant="success" onClick={handleAporte}>Aportar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
