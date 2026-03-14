import { useState, useEffect, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import KPICard from './components/KPICard';
import LineChart from './components/LineChart';
import PieChart from './components/PieChart';
import RecentTransactions from './components/RecentTransactions';
import GoalsBarChart from './components/GoalsBarChart';
import { getAllIngresos } from '../../services/ingresosStorage';
import { getAllGastos } from '../../services/gastosStorage';
import { getAllInversiones } from '../../services/inversionesStorage';
import { getAllMetas } from '../../services/metasStorage';

export default function DashboardHome() {
  //  ESTADOS: Almacenan los datos de ingresos, gastos e inversiones
  const [ingresos, setIngresos] = useState(getAllIngresos());
  const [gastos, setGastos] = useState(getAllGastos());
  const [inversiones, setInversiones] = useState(getAllInversiones());
  const [metas, setMetas] = useState(getAllMetas());

  //  ACTUALIZACIÓN AUTOMÁTICA: Refresca los datos cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setIngresos(getAllIngresos());
      setGastos(getAllGastos());
      setInversiones(getAllInversiones());
      setMetas(getAllMetas());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  //  FECHA ACTUAL: Obtiene mes y año para filtrar datos
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  //  KPI 1: Calcula total de ingresos del mes actual
  const ingresosDelMes = useMemo(() => 
    ingresos.filter(i => {
      const fecha = new Date(i.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    }).reduce((sum, i) => sum + i.monto, 0), [ingresos, currentMonth, currentYear]
  );

  //  KPI 2: Calcula total de gastos del mes actual
  const gastosDelMes = useMemo(() =>
    gastos.filter(g => {
      const fecha = new Date(g.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    }).reduce((sum, g) => sum + g.monto, 0), [gastos, currentMonth, currentYear]
  );

  //  KPI 3: Balance = Ingresos - Gastos
  const balance = ingresosDelMes - gastosDelMes;
  //  KPI 4: Total de inversiones
  const totalInversiones = inversiones.reduce((sum, inv) => sum + inv.monto, 0);

  //  GRÁFICA DE LÍNEAS: Datos día por día del mes (30 días)
  const lineChartData = useMemo(() => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    return days.map(day => {
      // Suma ingresos del día
      const ingresosDay = ingresos.filter(i => {
        const fecha = new Date(i.fecha);
        return fecha.getDate() === day && fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
      }).reduce((sum, i) => sum + i.monto, 0);

      // Suma gastos del día
      const gastosDay = gastos.filter(g => {
        const fecha = new Date(g.fecha);
        return fecha.getDate() === day && fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
      }).reduce((sum, g) => sum + g.monto, 0);

      return { name: `${day}`, ingresos: ingresosDay, gastos: gastosDay };
    });
  }, [ingresos, gastos, currentMonth, currentYear]);

  //  GRÁFICA CIRCULAR: Agrupa gastos por categoría
  const pieChartData = useMemo(() => {
    // Filtra gastos del mes y agrupa por categoría
    const categorias = gastos.filter(g => {
      const fecha = new Date(g.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    }).reduce((acc, g) => {
      acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
      return acc;
    }, {} as Record<string, number>);

    // Convierte objeto a array para la gráfica
    return Object.entries(categorias).map(([name, value]) => ({ name, value }));
  }, [gastos, currentMonth, currentYear]);

  //  TRANSACCIONES RECIENTES: Combina ingresos y gastos, ordena por fecha y toma las 5 más recientes
  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...ingresos.map(i => ({ id: i.id, type: 'ingreso' as const, name: i.categoria, date: i.fecha, amount: i.monto })),
      ...gastos.map(g => ({ id: g.id, type: 'gasto' as const, name: g.categoria, date: g.fecha, amount: g.monto }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    return allTransactions;
  }, [ingresos, gastos]);

  //  DATOS DE METAS: Calcula el progreso de cada meta
  const goalsData = useMemo(() => {
    return metas.slice(0, 5).map(meta => ({
      nombre: meta.nombre,
      progreso: Math.min((meta.montoActual / meta.montoObjetivo) * 100, 100)
    }));
  }, [metas]);

  return (
    <div>
      <h1 className="mb-4">
        <i className="bi bi-speedometer2 me-2 text-primary"></i>
        Dashboard
      </h1>

      {/*  SECCIÓN 1: 4 TARJETAS KPI */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <KPICard title="Ingresos del Mes" value={`$ ${ingresosDelMes.toFixed(2)}`} percentage={12} icon="arrow-down-circle" color="" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <KPICard title="Gastos del Mes" value={`$ ${gastosDelMes.toFixed(2)}`} percentage={-8} icon="arrow-up-circle" color="" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <KPICard title="Balance Actual" value={`$ ${balance.toFixed(2)}`} percentage={balance >= 0 ? 15 : -15} icon="wallet2" color="" />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <KPICard title="Inversiones Totales" value={`$ ${totalInversiones.toFixed(2)}`} percentage={5} icon="graph-up-arrow" color="" />
        </Col>
      </Row>

      {/*  SECCIÓN 2: GRÁFICA DE LÍNEAS (Ingresos vs Gastos) */}
      <Row className="mb-4">
        <Col xs={12}>
          <LineChart data={lineChartData} />
        </Col>
      </Row>

      {/*  SECCIÓN 3: TRANSACCIONES RECIENTES Y GRÁFICA CIRCULAR */}
      <Row className="g-3 mb-4">
        <Col xs={12} lg={6}>
          <RecentTransactions transactions={recentTransactions} />
        </Col>
        <Col xs={12} lg={6}>
          <PieChart data={pieChartData} />
        </Col>
      </Row>

      {/*  SECCIÓN 4: GRÁFICA DE BARRAS DE METAS */}
      <Row>
        <Col xs={6}>
          <GoalsBarChart goals={goalsData} />
        </Col>
      </Row>
    </div>
  );
}
