// Definición de la interfaz Ingreso con todos sus campos y tipos
export interface Ingreso {
  id: number; // Identificador único del ingreso
  monto: number; // Cantidad de dinero del ingreso
  fecha: string; // Fecha del ingreso en formato YYYY-MM-DD
  categoria: 'Salario' | 'Ventas' | 'Inversiones' | 'Otros'; // Categoría del ingreso
  descripcion?: string; // Descripción opcional del ingreso
  tipo: 'Fijo' | 'Variable'; // Tipo de ingreso (Fijo o Variable)
  etiquetas?: string[]; // Etiquetas opcionales para clasificar el ingreso
  recurrente?: { // Configuración opcional para ingresos recurrentes
    activo: boolean; // Si el ingreso recurrente está activo
    frecuencia: 'Mensual' | 'Semanal' | 'Anual'; // Frecuencia de repetición
    fechaEjecucion: number; // Día de ejecución según la frecuencia
  };
}
