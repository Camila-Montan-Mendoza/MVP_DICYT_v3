# Sistema de Diseño Institucional (DESIGN.md)

Este documento establece las directrices fundamentales del sistema de diseño para **SIGEFI DICyT UMSS**, asegurando consistencia institucional, usabilidad minimalista tipo Wizard, uso exclusivo de iconos vectoriales (cero emojis) e integración nativa con Supabase.

---

## 🎨 1. Paleta de Colores Institucionales (Tokens CSS)

Las variables en [`src/app/globals.css`](./src/app/globals.css) definen el tema visual de la aplicación:

| Variable CSS         | Propósito                           | Valor Hex en globals.css | Equivalente Tailwind              |
| :------------------- | :---------------------------------- | :----------------------- | :-------------------------------- |
| `--background`       | Fondo principal de la interfaz      | `#fdfdfd`                | `bg-background`                   |
| `--foreground`       | Color de texto primario             | `#2c3e50`                | `text-foreground`                 |
| `--primary`          | Azul Institucional UMSS             | `#003770`                | `bg-primary` o `text-primary`     |
| `--secondary`        | Rojo Institucional UMSS             | `#BC000C`                | `bg-secondary` o `text-secondary` |
| `--muted`            | Fondo secundario / deshabilitado    | `#f0f4f8`                | `bg-muted`                        |
| `--muted-foreground` | Texto secundario suave              | `#6b7280`                | `text-muted-foreground`           |
| `--border`           | Bordes de tarjetas y divisiones     | `#e5e7eb`                | `border-border`                   |
| `--umss-dark-blue`   | Azul oscuro para títulos y acentos  | `#001B47`                | Variables de acento               |
| `--umss-btn-blue`    | Color para botones de acción        | `#002855`                | Variables de interacción          |

---

## 🪄 2. Patrón de Diseño Minimalista Tipo Wizard (Steppers)

> [!IMPORTANT]
> **Enfoque de Navegación por Pasos (Wizard Stepper):**
> Todas las vistas complejas, procesos de trámites, cargas de documentos y flujos de aprobación MUST estructurarse como un **Wizard Minimalista por Pasos**.

### Reglas de Diseño del Wizard:
1. **Un Solo Objetivo por Paso**: Cada pantalla o estado del wizard debe concentrar la atención del usuario en una sola tarea clara (ej: *Cargar Cotizaciones*, *Revisar Presupuesto*, *Firmar Acta*), eliminando el ruido visual o la saturación de formularios extensos.
2. **Barra de Progreso Clara (Stepper Indicator)**: Mostrar un indicador horizontal de pasos en la parte superior con números o iconos de estado (`Completado`, `En Curso`, `Pendiente`), utilizando los tokens de color azul institucional (`#003770`) para el paso activo.
3. **Controles de Navegación Transparentes**: Botones de navegación explícitos (`Anterior` / `Siguiente` / `Confirmar`) ubicados en la parte inferior o esquina superior derecha del contenedor principal.
4. **Espaciado y Aire Visual**: Márgenes amplios (`p-6`, `gap-6`), tarjetas sin anidamientos innecesarios y divisiones limpias utilizando `border-border`.

---

## 🚫 3. Prohibición Estricta de Emojis y Uso Exclusivo de Iconos Vectoriales (`lucide-react`)

> [!CAUTION]
> **Cero Emojis en Toda la Interfaz de Usuario:**
> Está **estrictamente prohibido** utilizar caracteres emoji en cualquier parte del sistema (encabezados, botones, etiquetas, alertas, tablas, badges o notificaciones).

### Directrices para Iconos:
- **Librería Oficial**: Usar únicamente iconos SVG de `lucide-react` (ej: `CheckCircle2`, `Clock`, `AlertTriangle`, `FileText`, `UploadCloud`, `UserCheck`, `ChevronRight`).
- **Tamaño Estándar**:
  - Iconos dentro de botones o badges: `w-4 h-4` o `w-3.5 h-3.5`.
  - Iconos en encabezados o tarjetas: `w-5 h-5`.
  - Iconos en estados vacíos (empty states): `w-10 h-10` o `w-12 h-12` con opacidad suave (`text-muted-foreground/60`).
- **Colores Semánticos**: Los iconos deben heredar el color del contexto (`text-primary`, `text-secondary`, `text-emerald-600`, `text-amber-500`) y acompañar al texto de manera sobria y profesional.

---

## 🧩 4. Integración de Componentes ShadCN UI + Supabase

1. **Estilo de Componentes**: Todos los componentes de **ShadCN UI** (Dialog, Dropdown, Table, Input, Badge, Button, Tabs) deben heredar directamente las variables de `globals.css`:
   - **Bordes**: `border-border`.
   - **Botones Primarios**: `bg-primary text-primary-foreground hover:bg-primary/90`.
   - **Botones Secundarios**: `bg-secondary text-secondary-foreground hover:bg-secondary/90`.
   - **Inputs / Selecciones**: `bg-input border-border focus-visible:ring-ring`.
2. **Persistencia Directa con Supabase**: Toda la información renderizada en tablas o pasos del wizard debe provenir directamente de consultas activas a Supabase PostgreSQL (`tramite`, `item_tramite`, `cotizacion`, `documento_contractual`, `historial_tarea_tramite`). Se prohíben arreglos estáticos falsos o mock data en memoria.
3. **Estados Vacíos Limpios (Fail-Fast Renders)**: Si no existen registros en la base de datos, mostrar un contenedor minimalista con un icono de `lucide-react` y un mensaje claro de estado ("Sin registros en la base de datos").

---

## 📱 5. Composición Espacial y Layouts Responsivos

- **Escritorio**: Sidebar lateral expandible (`w-16` a `w-64` al pasar el cursor) reservando el margen izquierdo.
- **Móviles**: Navegación inferior fija (`h-16`) con margen de seguridad inferior obligado (`pb-16`) en la zona de contenido.
