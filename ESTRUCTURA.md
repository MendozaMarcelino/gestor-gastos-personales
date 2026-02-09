# Estructura de Carpetas - Gestor de Gastos Personales

## Resumen de Cambios

Tu proyecto ha sido refactorizado exitosamente. Aquí está la estructura nueva:

```
src/
├── App.tsx                          (Mínimo - solo Router)
├── app.css
├── index.css
├── main.tsx
├── components/
│   └── Sidebar/
│       ├── Sidebar.tsx              (Componente del menú lateral)
│       ├── Sidebar.css              (Estilos del sidebar)
│       └── sidebarItems.ts          (Configuración de items del menú)
├── layouts/
│   ├── DashboardLayout.tsx          (Layout principal del dashboard)
│   └── DashboardLayout.css          (Estilos del layout)
├── pages/
│   ├── Home/
│   │   └── Home.tsx                 (Página de login/autenticación)
│   ├── Dashboard/
│   │   └── DashboardHome.tsx        (Página de inicio del dashboard)
│   ├── Ingresos/
│   │   └── Ingresos.tsx
│   ├── Gastos/
│   │   └── Gastos.tsx
│   ├── Categorias/
│   │   └── Categorias.tsx
│   ├── Transacciones/
│   │   └── Transacciones.tsx
│   ├── Informes/
│   │   └── Informes.tsx
│   ├── Metas/
│   │   └── Metas.tsx
│   └── Inversiones/
│       └── Inversiones.tsx
└── routes/
    └── AppRouter.tsx                (Configuración de rutas)
```

## Rutas Implementadas

### Página de Autenticación
- **/** - Página de login (incluye recuperar contraseña y crear cuenta)

### Dashboard (Protegido - solo usuarios logueados)
- **/dashboard** - Página de inicio del dashboard
- **/dashboard/ingresos** - Módulo de Ingresos
- **/dashboard/gastos** - Módulo de Gastos
- **/dashboard/categorias** - Módulo de Categorías
- **/dashboard/transacciones** - Módulo de Transacciones
- **/dashboard/informes** - Módulo de Informes
- **/dashboard/metas** - Módulo de Metas
- **/dashboard/inversiones** - Módulo de Inversiones

## Cómo Funciona

### Flujo de Autenticación
1. Usuario accede a `/` (inicio)
2. Ingresa credenciales en Home.tsx
3. Al hacer clic en "Iniciar Sesión", se ejecuta:
   - `handleLogin()` en Home.tsx
   - `onLogin()` callback actualiza estado en App.tsx
   - Navega a `/dashboard`
4. AppRouter verifica que `user` no sea null
5. Muestra DashboardLayout con Sidebar y contenido

### Flujo de Navegación en Dashboard
1. Sidebar muestra 7 módulos con íconos
2. Cada enlace navega a `/dashboard/módulo`
3. El contenido se renderiza en el `<Outlet />` de DashboardLayout
4. El Header muestra usuario y botón de logout

## Uso de Componentes

### DashboardLayout.tsx
- Recibe `user` y `onLogout` como props
- Contiene el Header y el Sidebar
- Usa `<Outlet />` de React Router para renderizar el contenido de cada página

### Sidebar.tsx
- Recibe `isOpen` (boolean) y `onClose` (función)
- Muestra los 7 módulos con navegación activa
- Responsive: en móviles ocupa toda la pantalla

### Páginas (Ingresos, Gastos, etc.)
- Todas son componentes simples que actualmente muestran placeholders
- Fáciles de crear: copia uno de ellos y reemplaza el contenido

## Pasos Siguientes

### Para expandir un módulo (ejemplo: Ingresos)
1. Abre [src/pages/Ingresos/Ingresos.tsx](src/pages/Ingresos/Ingresos.tsx)
2. Reemplaza el contenido placeholder con tu componente real
3. Importa componentes reutilizables que crees en `src/components`

### Para crear componentes reutilizables
Crea una carpeta en `src/components/`, por ejemplo:
```
src/components/
├── Sidebar/
├── Header/
├── Card/
├── Form/
└── ... (otros componentes)
```

### Para agregar estilos globales
Edita:
- [src/App.css](src/App.css) - Estilos globales
- [src/index.css](src/index.css) - Estilos base

### Para modificar el tema
Los estilos están en los archivos `.css` respectivos:
- [src/layouts/DashboardLayout.css](src/layouts/DashboardLayout.css)
- [src/components/Sidebar/Sidebar.css](src/components/Sidebar/Sidebar.css)

## Dependencias Instaladas

- **react-router-dom** - Sistema de enrutamiento (ya instalado ✓)
- Bootstrap - Framework CSS (ya estaba)
- React Bootstrap - Componentes (ya estaba)

## Comandos Útiles

```bash
# Iniciar desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar build generado
npm run preview

# Lint del código
npm run lint
```

## Notas Importantes

1. **Estado de Usuario**: Se mantiene en App.tsx y se pasa a través del Router
2. **Protección de Rutas**: Si accedes a `/dashboard` sin estar logueado, te redirige a `/`
3. **Responsive**: El Sidebar se adapta automáticamente en dispositivos móviles
4. **Logout**: Al hacer logout, se limpia el estado y se redirige a `/`
5. **Kaiser Icons**: Se están usando icons de Bootstrap (bi-*), asegúrate de que Bootstrap esté incluido

## Estructura Lista para Producción

App.tsx es ahora mínimo y limpio:
- Solo inicializa estado
- Renderiza Router
- Delega lógica a componentes especializados

Esto facilita:
- Testing
- Mantenimiento
- Escalabilidad
- Documentación
