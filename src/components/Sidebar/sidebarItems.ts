export interface SidebarItem {
  label: string
  path: string
  icon: string
}

export const sidebarItems: SidebarItem[] = [
  {
    label: 'Ingresos',
    path: '/dashboard/ingresos',
    icon: 'bi-plus-circle'
  },
  {
    label: 'Gastos',
    path: '/dashboard/gastos',
    icon: 'bi-dash-circle'
  },
  {
    label: 'Categorías',
    path: '/dashboard/categorias',
    icon: 'bi-tags'
  },
  {
    label: 'Transacciones',
    path: '/dashboard/transacciones',
    icon: 'bi-arrow-left-right'
  },
  {
    label: 'Informes',
    path: '/dashboard/informes',
    icon: 'bi-bar-chart'
  },
  {
    label: 'Metas',
    path: '/dashboard/metas',
    icon: 'bi-bullseye'
  },
  {
    label: 'Inversiones',
    path: '/dashboard/inversiones',
    icon: 'bi-graph-up'
  }
]
