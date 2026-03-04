import type { Meta } from '../types/meta';

const STORAGE_KEY = 'metas';

export const getAllMetas = (): Meta[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const createMeta = (meta: Omit<Meta, 'id'>): Meta => {
  const metas = getAllMetas();
  const newId = metas.length > 0 ? Math.max(...metas.map(m => m.id)) + 1 : 1;
  const newMeta: Meta = { ...meta, id: newId };
  metas.push(newMeta);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
  return newMeta;
};

export const updateMeta = (id: number, updatedMeta: Omit<Meta, 'id'>): Meta | null => {
  const metas = getAllMetas();
  const index = metas.findIndex(m => m.id === id);
  if (index === -1) return null;
  metas[index] = { ...updatedMeta, id };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
  return metas[index];
};

export const removeMeta = (id: number): boolean => {
  const metas = getAllMetas();
  const filtered = metas.filter(m => m.id !== id);
  if (filtered.length === metas.length) return false;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};
