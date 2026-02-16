// Componente para exportar ingresos en diferentes formatos (CSV, Excel, PDF)
import { Dropdown } from 'react-bootstrap';
import type { Ingreso } from '../../../types/ingreso';

interface Props {
  ingresos: Ingreso[]; // Lista de ingresos a exportar
}

export default function IngresoExport({ ingresos }: Props) {
  // Función para exportar los ingresos en formato CSV
  const exportToCSV = () => {
    // Define los encabezados de las columnas
    const headers = ['ID', 'Fecha', 'Monto', 'Categoría', 'Tipo', 'Descripción', 'Etiquetas'];
    // Convierte cada ingreso en una fila de datos
    const rows = ingresos.map(i => [
      i.id,
      i.fecha,
      i.monto,
      i.categoria,
      i.tipo,
      i.descripcion || '',
      i.etiquetas?.join('; ') || ''
    ]);

    // Combina encabezados y filas en formato CSV (separado por comas)
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    // Crea un archivo blob con el contenido CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    // Crea un enlace temporal y lo hace clic para descargar el archivo
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingresos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Función para exportar los ingresos en formato Excel
  const exportToExcel = () => {
    const headers = ['ID', 'Fecha', 'Monto', 'Categoría', 'Tipo', 'Descripción', 'Etiquetas'];
    const rows = ingresos.map(i => [
      i.id,
      i.fecha,
      i.monto,
      i.categoria,
      i.tipo,
      i.descripcion || '',
      i.etiquetas?.join('; ') || ''
    ]);

    // Combina datos separados por tabulaciones (formato compatible con Excel)
    const table = [headers, ...rows].map(row => row.join('\t')).join('\n');
    const blob = new Blob([table], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingresos_${new Date().toISOString().split('T')[0]}.xls`;
    a.click();
  };

  // Función para exportar los ingresos en formato PDF (HTML)
  const exportToPDF = () => {
    // Genera un documento HTML con estilos para el reporte
    const content = `
      <html>
        <head>
          <title>Reporte de Ingresos</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0d6efd; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #0d6efd; color: white; }
            .total { font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Reporte de Ingresos</h1>
          <p>Fecha de generación: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Monto</th>
                <th>Categoría</th>
                <th>Tipo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              ${ingresos.map(i => `
                <tr>
                  <td>${new Date(i.fecha).toLocaleDateString()}</td>
                  <td>${i.monto.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${i.categoria}</td>
                  <td>${i.tipo}</td>
                  <td>${i.descripcion || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <p class="total">Total: ${ingresos.reduce((sum, i) => sum + i.monto, 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </body>
      </html>
    `;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ingresos_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
  };

  // Renderiza un menú desplegable con las opciones de exportación
  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-primary" size="sm">
        <i className="bi bi-download me-2"></i>
        Exportar
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={exportToPDF}>
          <i className="bi bi-file-pdf me-2"></i>PDF
        </Dropdown.Item>
        <Dropdown.Item onClick={exportToExcel}>
          <i className="bi bi-file-excel me-2"></i>Excel
        </Dropdown.Item>
        <Dropdown.Item onClick={exportToCSV}>
          <i className="bi bi-file-earmark-text me-2"></i>CSV
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
