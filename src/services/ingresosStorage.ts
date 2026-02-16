// Servicio para gestionar el almacenamiento de ingresos en localStorage
import type { Ingreso } from '../types/ingreso';

// Clave para almacenar los ingresos en localStorage
const STORAGE_KEY = 'ingresos';

// Obtiene todos los ingresos almacenados en localStorage
export const getAllIngresos = (): Ingreso[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Crea un nuevo ingreso y lo guarda en localStorage
export const createIngreso = (ingreso: Omit<Ingreso, 'id'>): Ingreso => {
  const ingresos = getAllIngresos();
  // Genera un nuevo ID basado en el máximo ID existente
  const newId = ingresos.length > 0 ? Math.max(...ingresos.map(i => i.id)) + 1 : 1;
  const newIngreso: Ingreso = { ...ingreso, id: newId };
  ingresos.push(newIngreso);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ingresos));
  return newIngreso;
};

// Actualiza un ingreso existente por su ID
export const updateIngreso = (id: number, updatedIngreso: Omit<Ingreso, 'id'>): Ingreso | null => {
  const ingresos = getAllIngresos();
  const index = ingresos.findIndex(i => i.id === id);
  if (index === -1) return null; // Retorna null si no encuentra el ingreso
  ingresos[index] = { ...updatedIngreso, id };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ingresos));
  return ingresos[index];
};

// Elimina un ingreso por su ID
export const removeIngreso = (id: number): boolean => {
  const ingresos = getAllIngresos();
  const filtered = ingresos.filter(i => i.id !== id);
  if (filtered.length === ingresos.length) return false; // Retorna false si no encontró el ingreso
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};
