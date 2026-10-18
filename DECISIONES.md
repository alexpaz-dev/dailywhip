# Registro de decisiones

Decisiones tomadas durante el desarrollo de **Daily Whip**, en orden cronológico: desde el brief inicial hasta hoy.

- Se actualiza cada vez que se plantea una pregunta y hay respuesta.
- **Origen** indica quién tomó la decisión:
  - **Usuario**: la tomó el usuario.
  - **Propuesta aprobada**: la propuso el asistente y el usuario la aceptó.
  - **Técnica**: la tomó el asistente durante la implementación, dentro de lo aprobado, y se informó después.

---

## 1. Brief inicial · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D01 | El producto se llama **Daily Whip**. Eslogan: **"15 minutes. No excuses."** | Usuario |
| D02 | Temporizador para dailies en una ventana pequeña (≈ 300×250) **siempre visible por encima** de las demás, independiente de Meet, Teams o Zoom. Para Windows, sin conexión, sin registro y sin servicios externos. | Usuario |
| D03 | Estética **Minimal Pixel**: negro `#000000`, blanco `#FFFFFF` y rojo `#FF0000`, tipografía pixel. Sin esquinas redondeadas, degradados ni sombras. | Usuario |
| D04 | Duración inicial de **15 min**, botones **±5 min** y **mínimo de 5 min**. Los botones funcionan también con el temporizador en marcha. | Usuario |
| D05 | Tres fases: **NORMAL** (menos del 75 % consumido), **WARNING** (desde el 75 %: fondo rojo parpadeante y aparece el látigo) y **TIME'S UP** (00:00). | Usuario |
| D06 | El tiempo se calcula desde una referencia de reloj fiable, nunca restando un segundo en cada intervalo. | Usuario |
| D07 | **Forma de trabajo:** antes de implementar, propuesta técnica y validación de las decisiones. No se hace nada sin permiso. Commits locales; push solo cuando el usuario lo pida. | Usuario |

## 2. Propuesta técnica · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D08 | Repositorio nuevo **`dailywhip`**, **público**, en `github.com/alexpaz-dev`. | Usuario |
| D09 | Hay un **Windows real** para validar; si hace falta, una máquina virtual. | Usuario |
| D10 | **-5 se desactiva** cuando dejaría el contador en 00:00 o menos, o la duración por debajo de 5 min. Al llegar a cero: TIME'S UP en rojo parpadeante, con el látigo en movimiento. | Usuario |
| D11 | Los ±5 pulsados después de START solo cambian la sesión en curso: **RESET vuelve a la duración fijada antes de empezar**. | Propuesta aprobada |
| D12 | **+5 en TIME'S UP concede una prórroga**, y la fase vuelve a la que toque según el %: WARNING o NORMAL. | Usuario |
| D13 | Después de TIME'S UP se muestra el **tiempo extra** (`+02:35`). | Propuesta aprobada |
| D14 | **Duración máxima de 30 min, sin excepciones**, tampoco con prórrogas: "una daily de más de 30 minutos no es una daily, es una reunión camuflada de daily". | Usuario |
| D15 | Ventana sin marco, con barra pixel propia. En la PWA no es posible porque Chrome pone su propia barra (ver D21). | Propuesta aprobada |
| D16 | Interruptor de parpadeo en la barra, recordado entre sesiones. Apagado por defecto si Windows tiene desactivadas las animaciones. | Propuesta aprobada |
| D17 | El asistente dibuja el **sprite del látigo** en código (32×32, de 4 a 6 fotogramas). Se podrá sustituir por un PNG. | Propuesta aprobada |
| D18 | Sin firma de código en el MVP. Solo aplica si se acaba en Tauri. | Propuesta aprobada |
| D19 | Supuestos aceptados: interfaz y fecha siempre en inglés; el contador redondea hacia arriba (15:00 al arrancar, 00:00 justo en TIME'S UP); ±5 funcionan en pausa; RESET desactivado en el estado inicial; sin sonido; la ventana no recuerda su posición; fuente Press Start 2P; parpadeo rojo / rojo oscuro a 1 Hz. | Propuesta aprobada |

## 3. Plataforma · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D20 | Se **descarta la extensión de Chrome**: no puede crear ventanas siempre encima, y distribuirla es más difícil. | Propuesta aprobada |
| D21 | Se empieza por un **prototipo PWA con ventana flotante** (Document Picture-in-Picture) para validarlo en Windows. Si no supera las pruebas de [PROTOTIPO.md](https://github.com/alexpaz-dev/dailywhip/blob/prototype/PROTOTIPO.md), el mismo código se lleva a **Tauri 2**. | Usuario |
| D22 | Base: **Vite + TypeScript sin framework**, y **Vitest** para los tests. | Propuesta aprobada |
| D23 | Gestor de paquetes **pnpm**, como en contrast. | Técnica |
| D24 | Publicación en **GitHub Pages**: cada push a `main` pasa los tests y despliega. | Propuesta aprobada |

## 4. Prototipo PWA · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D25 | **START también abre la ventana flotante**: con un clic, el temporizador queda encima de todo. | Técnica |
| D26 | Con la ventana flotante abierta, el refresco se ejecuta desde ella, para que Chrome no lo frene al minimizar la ventana principal. | Técnica |
| D27 | **Service worker propio**, sin dependencias, generado en la build con la lista de archivos: la app abre sin conexión. | Técnica |
| D28 | El día de la fecha lleva siempre dos dígitos (`THU 01 JAN 2026`), para que el ancho no cambie. | Técnica |
| D29 | Icono provisional: una "W" roja pixelada generada por script. El definitivo llega con la versión final. | Técnica |
| D30 | Panel de diagnóstico, solo para el prototipo: si hay ventana flotante, si la app está instalada, el refresco máximo y un registro de eventos. | Técnica |

## 5. Publicación · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D31 | Licencia **MIT**. | Usuario |
| D32 | El brief se guarda en `BRIEF.md`, **solo en local**: está en `.gitignore` y no se publica. | Usuario |

## 6. Validación del prototipo · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D33 | El prototipo **supera las 4 pruebas** en Windows con Chrome, durante una daily real con Google Meet. | Usuario |
| D34 | **Daily Whip será una PWA.** Se descarta Tauri. | Usuario |
| D35 | El prototipo se conserva en la rama **`prototype`** y se publica en **`/dailywhip/prototype/`**. | Usuario |
| D36 | La rama `prototype` no tiene workflow propio: el de `main` la compila y la publica en la subcarpeta, porque Pages solo admite un despliegue por repo. Las dos apps comparten origen y cada una usa su propia caché. | Técnica |
| D37 | Al ser PWA, la ventana flotante lleva la barra de Chrome y **no se puede minimizar**, solo cerrar y reabrir. Se acepta con la prueba 4. | Usuario |
| D38 | **Distribución:** la URL de GitHub Pages, instalable desde Chrome o Edge. Sustituye al instalador en GitHub Releases (§12 del brief). | Propuesta aprobada |
| D39 | **Plan de desarrollo PWA:** F3 interfaz funcional definitiva · F4 estética Minimal Pixel · F5 alertas (parpadeo, interruptor, TIME'S UP) · F6 látigo · F7 versión 1.0 (icono, README y revisión final en Windows). | Propuesta aprobada |

## 7. F3 · Interfaz funcional · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D40 | La **ventana principal** muestra el temporizador cuando no flota, con un botón **FLOAT**. Mientras flota, avisa de que debe seguir abierta (se puede minimizar) y ofrece **BRING BACK**. | Técnica |
| D41 | **Sin ventana flotante** (Firefox, Safari), el temporizador funciona igual dentro de la página y se avisa de usar Chrome o Edge. | Técnica |
| D42 | Se retira el **panel de diagnóstico** del prototipo. El pintado de la interfaz pasa a `view.ts`. | Técnica |

## 8. Herramientas · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D43 | Se instala **Playwright con Chromium**, solo para desarrollo, para poder ver la interfaz desde el Mac. | Usuario |
| D44 | `pnpm screenshots` abre la **ventana flotante real** en Chromium y la captura en cada fase, con reloj simulado. Antes de cada captura espera el texto esperado y falla si hay errores en la página, así que también comprueba el recorrido completo. Las capturas no se suben al repo. | Técnica |

## 9. F4 · Estética Minimal Pixel · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D45 | La fuente Press Start 2P (D19) llega con `@fontsource/press-start-2p` y va **incrustada en el CSS**: la ventana flotante la recibe con los estilos copiados, sin pedirla a la red, también sin conexión. | Técnica |
| D46 | Todos los tamaños son **múltiplos de 8**, la cuadrícula de la fuente: contador 48 px, "TIME'S UP!" 24 px, tiempo extra 16 px y el resto 8 px. Comprobado también con el escalado de Windows al 125 %. | Técnica |
| D47 | **El rojo solo significa "date prisa"**: en NORMAL todo es blanco sobre negro. | Técnica |
| D48 | En TIME'S UP, **"TIME'S UP!" y el tiempo extra ocupan el sitio del contador**, porque el 00:00 no aporta nada. La ventana no cambia de tamaño. | Técnica |
| D49 | Lo **apagado** (botones desactivados y bloques vacíos) usa una versión oscura del fondo: gris sobre negro y rojo oscuro `#990000` sobre rojo. | Técnica |
| D50 | Botones de **borde recto de 2 px**: al pasar el ratón invierten los colores y al pulsarlos bajan 2 px. | Técnica |

## 10. F5 · Alertas · 2026-10-18

| #   | Decisión | Origen |
| :-- | :------- | :----- |
| D51 | WARNING y TIME'S UP **parpadean a 1 Hz** entre el rojo y un rojo más oscuro (`#B30000`). Se percibe, no es rápido y queda muy por debajo del límite de accesibilidad de 3 destellos por segundo. El texto blanco se lee en los dos tonos. | Técnica |
| D52 | El interruptor es un **rayo pixelado** en la cabecera: blanco si está encendido y oscuro si está apagado. Lleva `aria-pressed` y un texto de ayuda ("Blinking on" / "Blinking off"). | Técnica |
| D53 | La preferencia se **guarda en el navegador**. Si nunca se ha tocado, sigue a Windows: empieza apagado cuando los efectos de animación están desactivados. Una elección explícita manda siempre. | Técnica |
| D54 | Lo apagado sobre rojo pasa de `#990000` a **`#660000`**, para que se siga viendo en las dos fases del parpadeo (actualiza D49). Los botones pasan a ser transparentes y parpadean con la ventana. | Técnica |
| D55 | El **rojo de alerta pasa a `#EE0000`** (actualiza D03). Con texto blanco da un contraste de 4,5:1, el mínimo para el texto de 8 px. El brief permite tonos intermedios de rojo cuando mejoran la legibilidad. | Usuario |

---

## Pendientes

Ninguno por ahora.
