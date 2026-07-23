# Sistema de Diseño (DESIGN.md)

Este documento detalla las directrices del sistema de diseño para el proyecto **SIGEFI DICYT FE**, asegurando la consistencia de marca Y el correcto uso de los tokens visuales.

---

## Paleta de Colores Institucionales (Tokens CSS)

Las variables en [globals.css](./src/app/globals.css) se definen de la siguiente manera:

| Variable CSS | Propósito | Valor en globals.css | Equivalente Tailwind |
| :--- | :--- | :--- | :--- |
| `--background` | Color de fondo de la aplicación | `#fdfdfd` | `bg-background` |
| `--foreground` | Color de texto principal | `#2c3e50` | `text-foreground` |
| `--primary` | Azul Institucional UMSS | `#003770` | `bg-primary` o `text-primary` |
| `--secondary` | Rojo Institucional UMSS | `#BC000C` | `bg-secondary` o `text-secondary` |
| `--muted` | Fondo secundario / deshabilitado | `#f0f4f8` | `bg-muted` |
| `--muted-foreground`| Texto secundario / secundario suave | `#6b7280` | `text-muted-foreground` |
| `--border` | Bordes de elementos y tarjetas | `#e5e7eb` | `border-border` |
| `--umss-dark-blue` | Azul obscuro para acentos y títulos | `#001B47` | Mapeado a través de variables |
| `--umss-btn-blue` | Color para botones primarios | `#002855` | Mapeado a través de variables |

---

## Integración de componentes de shadcn/ui

Cuando instales o configures componentes de **shadcn/ui**, estos deben respetar y heredar obligatoriamente las clases y variables semánticas del tema institucional mapeadas en `globals.css`, las cuales prevalecen sobre cualquier color o estilo predeterminado que traiga la plantilla de shadcn o de Tailwind CSS estándar. 

### Pautas para integrar componentes de shadcn/ui:
1. **Configuración en components.json:** El archivo `components.json` está preconfigurado para mapear las carpetas de UI a `@/shared/ui` y los componentes a `@/shared/components`.
2. **Estilo del Componente:** Al crear variantes o customizar elementos de shadcn (como Dialog, Dropdown, Table, Input), asegúrate de heredar las variables de color del tema:
   * **Bordes:** Utiliza siempre la clase `border-border`.
   * **Botones Primarios:** Deben usar `bg-primary text-primary-foreground hover:bg-primary/90`.
   * **Botones Secundarios:** Deben usar `bg-secondary text-secondary-foreground hover:bg-secondary/90`.
   * **Inputs:** La clase por defecto debe ser `bg-input border-border focus-visible:ring-ring`.

---

## Tipografía y Composición Espacial

> [!IMPORTANT]
> **Alineación Minimalista y Enfoque de Contenido:**
> Las vistas del sistema deben ser **estrictamente minimalistas y no sobrecargadas**. Deben evitar el ruido visual innecesario, la duplicidad de bordes, el anidamiento excesivo de tarjetas y la saturación de elementos o textos en pantalla. Prioriza espacios en blanco (aire/padding) generosos y enfoca al usuario en un solo objetivo principal por vista.

* **Fuente Principal:** Mapeada en `globals.css` mediante `@layer base`. Por defecto se hereda la fuente sin serifa del sistema configurada en Next.js.
* **Layouts Responsivos:**
  * El portal utiliza una cuadrícula basada en `AppLayout.tsx`.
  * En **Escritorio**, el Sidebar ocupa un espacio reservado de `w-16` (64px) que se expande a `w-64` al pasar el cursor (hover). Toda la interfaz principal debe dejar libre ese margen.
  * En **Móviles**, el Sidebar se sitúa en la parte inferior con una altura de `h-16`. Las vistas de página deben tener siempre un margen de seguridad inferior (`pb-16` en móviles) para no quedar tapadas por la navegación inferior.