export interface Gasto {
  id: number;
  monto: number;
  categoria: string;
  fecha: string; // formato YYYY-MM-DD
  descripcion?: string;
}