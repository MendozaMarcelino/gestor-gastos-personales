import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import type { Gasto } from '../../../types/gasto';

interface GastoFormProps {
  show: boolean;
  onHide: () => void;
  onSave: (gasto: Omit<Gasto, 'id'>) => void;
  editingGasto?: Gasto | null;
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

export default function GastoForm({ show, onHide, onSave, editingGasto }: GastoFormProps) {
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingGasto) {
      setMonto(editingGasto.monto.toString());
      setCategoria(editingGasto.categoria);
      setFecha(editingGasto.fecha);
      setDescripcion(editingGasto.descripcion || '');
    } else {
      setMonto('');
      setCategoria('');
      setFecha(new Date().toISOString().split('T')[0]);
      setDescripcion('');
    }
    setErrors({});
  }, [editingGasto]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!monto || parseFloat(monto) <= 0) newErrors.monto = 'Monto debe ser mayor a 0';
    if (!categoria) newErrors.categoria = 'Categoría es obligatoria';
    if (!fecha) newErrors.fecha = 'Fecha es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      monto: parseFloat(monto),
      categoria,
      fecha,
      descripcion: descripcion || undefined
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingGasto ? 'Editar Gasto' : 'Nuevo Gasto'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Monto *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  isInvalid={!!errors.monto}
                />
                <Form.Control.Feedback type="invalid">{errors.monto}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  isInvalid={!!errors.categoria}
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.categoria}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Fecha *</Form.Label>
            <Form.Control
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              isInvalid={!!errors.fecha}
            />
            <Form.Control.Feedback type="invalid">{errors.fecha}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            {editingGasto ? 'Actualizar' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}