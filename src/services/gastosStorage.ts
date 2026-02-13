import type { Gasto } from '../types/gasto';

const STORAGE_KEY = 'gastos';

export const getAllGastos = (): Gasto[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const createGasto = (gasto: Omit<Gasto, 'id'>): Gasto => {
  const gastos = getAllGastos();
  const newId = gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 1;
  const newGasto: Gasto = { ...gasto, id: newId };
  gastos.push(newGasto);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gastos));
  return newGasto;
};

export const updateGasto = (id: number, updatedGasto: Omit<Gasto, 'id'>): Gasto | null => {
  const gastos = getAllGastos();
  const index = gastos.findIndex(g => g.id === id);
  if (index === -1) return null;
  gastos[index] = { ...updatedGasto, id };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gastos));
  return gastos[index];
};

export const removeGasto = (id: number): boolean => {
  const gastos = getAllGastos();
  const filtered = gastos.filter(g => g.id !== id);
  if (filtered.length === gastos.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};