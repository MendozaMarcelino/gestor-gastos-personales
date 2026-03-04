import { useState, useEffect } from 'react';
import { Card, Table, Badge, Form, Row, Col } from 'react-bootstrap';
import { getAllIngresos } from '../../services/ingresosStorage';
import { getAllGastos } from '../../services/gastosStorage';
import type { Ingreso } from '../../types/ingreso';
import type { Gasto } from '../../types/gasto';

export default function Informes() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'año'>('mes');

  useEffect(() => {
    setIngresos(getAllIngresos());
    setGastos(getAllGastos());
  }, []);

  const totalIngresos = ingresos.reduce((sum, i) => sum + i.monto, 0);
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const balance = totalIngresos - totalGastos;
  const tasaAhorro = totalIngresos > 0 ? ((balance / totalIngresos) * 100) : 0;

  const getTopCategorias = (tipo: 'ingreso' | 'gasto') => {
    const items = tipo === 'ingreso' ? ingresos : gastos;
    const map = new Map<string, number>();
    items.forEach(item => {
      const cat = tipo === 'ingreso' ? (item as Ingreso).categoria : (item as Gasto).categoria;
      map.set(cat, (map.get(cat) || 0) + item.monto);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const getMensualData = () => {
    const meses = new Map<string, { ingresos: number; gastos: number }>();
    
    ingresos.forEach(i => {
      const mes = i.fecha.substring(0, 7);
      const current = meses.get(mes) || { ingresos: 0, gastos: 0 };
      meses.set(mes, { ...current, ingresos: current.ingresos + i.monto });
    });

    gastos.forEach(g => {
      const mes = g.fecha.substring(0, 7);
      const current = meses.get(mes) || { ingresos: 0, gastos: 0 };
      meses.set(mes, { ...current, gastos: current.gastos + g.monto });
    });

    return Array.from(meses.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 6);
  };

  const topIngresoCategorias = getTopCategorias('ingreso');
  const topGastoCategorias = getTopCategorias('gasto');
  const mensualData = getMensualData();

  return (
    <div>
      <h1 className="mb-4">
        <i className="bi bi-bar-chart me-2 text-primary"></i>
        Informes
      </h1>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-success">
            <Card.Body>
              <small className="text-muted">Total Ingresos</small>
              <h4 className="text-success">$ {totalIngresos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-danger">
            <Card.Body>
              <small className="text-muted">Total Gastos</small>
              <h4 className="text-danger">$ {totalGastos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-primary">
            <Card.Body>
              <small className="text-muted">Balance</small>
              <h4 className={balance >= 0 ? 'text-success' : 'text-danger'}>
                $ {balance.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
              </h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-info">
            <Card.Body>
              <small className="text-muted">Tasa de Ahorro</small>
              <h4 className="text-info">{tasaAhorro.toFixed(1)}%</h4>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Categorías de Ingresos</h5>
              <Table size="sm" hover>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topIngresoCategorias.map(([cat, total], idx) => (
                    <tr key={idx}>
                      <td>{cat}</td>
                      <td className="text-end text-success">
                        $ {total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Categorías de Gastos</h5>
              <Table size="sm" hover>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {topGastoCategorias.map(([cat, total], idx) => (
                    <tr key={idx}>
                      <td>{cat}</td>
                      <td className="text-end text-danger">
                        $ {total.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-3">Evolución Mensual</h5>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Mes</th>
                <th className="text-end">Ingresos</th>
                <th className="text-end">Gastos</th>
                <th className="text-end">Balance</th>
              </tr>
            </thead>
            <tbody>
              {mensualData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted">No hay datos disponibles</td>
                </tr>
              ) : (
                mensualData.map(([mes, data]) => {
                  const bal = data.ingresos - data.gastos;
                  return (
                    <tr key={mes}>
                      <td>{mes}</td>
                      <td className="text-end text-success">
                        $ {data.ingresos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="text-end text-danger">
                        $ {data.gastos.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`text-end ${bal >= 0 ? 'text-success' : 'text-danger'}`}>
                        $ {bal.toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  )
}
