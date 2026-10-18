# Revisión de la versión 1.0 en Windows

Los criterios de aceptación del brief (§13), adaptados a la PWA. Se revisan en Windows con Chrome o Edge, sobre la versión publicada en https://alexpaz-dev.github.io/dailywhip/. Si todo sale bien, se etiqueta `v1.0.0`.

Si tenías instalado el prototipo desde esa misma dirección, ahora abre la versión nueva. Si aún ves la anterior, cierra la app y vuelve a abrirla.

| # | Criterio | Cómo comprobarlo | ¿OK? |
| :-- | :-- | :-- | :-- |
| 1 | Se ejecuta en Windows | Instálala desde la URL (ver README) y ábrela desde el menú Inicio. | Sí |
| 2 | Visible sobre Google Meet | Pulsa START y usa Meet en ventana y a pantalla completa. La ventana flotante se ve siempre encima. | Sí |
| 3 | Empieza en 15 minutos | Al abrirla: 15:00, parada, fondo negro, barra vacía y sin látigo. | Sí |
| 4 | +5 y -5 | Parado: 15 → 20 → 25 → 30, y +5 se desactiva. Abajo, el mínimo es 5 y -5 se desactiva. En marcha: con 08:00, +5 deja 13:00. -5 se desactiva cuando quedan 05:00 o menos. | Sí |
| 5 | START, PAUSE, RESUME, RESET | Cada uno hace lo suyo. RESET vuelve a la duración elegida antes de START. | Sí |
| 6 | Precisión | Una cuenta de 15 min contra un cronómetro, con la ventana principal minimizada: el 00:00 coincide (±1 s). | Sí |
| 7 | Fecha del día | Arriba, con el formato `SUN 18 OCT 2026`. | Sí |
| 8 | Barra de progreso | 20 bloques; a mitad de la cuenta, 10 llenos. | Sí |
| 9 | WARNING al 75 % | Con 15 min, salta cuando quedan 03:45. | Sí |
| 10 | Rojo y parpadeo | El fondo se pone rojo y parpadea. El rayo lo apaga, y al reabrir la app sigue apagado. | Sí |
| 11 | El látigo | Sube desde la esquina inferior izquierda y da latigazos periódicos sin tapar nada. | Sí |
| 12 | TIME'S UP | Al acabar: "TIME'S UP!", el tiempo extra y latigazos sin pausa. +5 da una prórroga sin pasar de 30 min. | Sí |
| 13 | Sin conexión | Con la app instalada, desconecta la red (modo avión) y ábrela: funciona igual, ventana flotante incluida. | Sí |
| 14 | Estética Minimal Pixel | Negro, blanco y rojo, letra pixelada, sin esquinas redondeadas ni degradados. | Sí |
| 15 | Distribuible | Otra persona la instala desde la URL sin ayuda, siguiendo el README. | Sí |

Comprobaciones extra:

| # | Comprobación | Cómo | ¿OK? |
| :-- | :-- | :-- | :-- |
| A | Escalado de pantalla | Con Windows al 125 % o al 150 %, el texto y el látigo se leen bien. | Sí |
| B | Animaciones de Windows desactivadas | Configuración → Accesibilidad → Efectos visuales → Efectos de animación desactivados. Si nunca has tocado el rayo, empieza sin parpadeo; el látigo aparece quieto siempre. | Sí |

## Resultado

Revisado por el usuario el 2026-10-18: **todo correcto**. Se publica la versión `v1.0.0`.
