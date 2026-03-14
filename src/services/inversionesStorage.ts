export interface Inversion {
  id: number;
  monto: number;
  tipo: string;
  fecha: string;
}

const STORAGE_KEY = 'inversiones';

export const getAllInversiones = (): Inversion[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};
