# Prototipo PWA: pruebas en Windows

Este prototipo sirve para decidir si Daily Whip puede ser una PWA o necesita Tauri (D21 en [DECISIONES.md](DECISIONES.md)). Es funcional pero aún no tiene estética: sin fuente pixel, sin parpadeo y sin látigo.

**URL:** https://alexpaz-dev.github.io/dailywhip/ (disponible tras el primer despliegue)

## Preparación

1. En Windows, abre la URL con **Chrome o Edge**.
2. Instala la app con el icono de instalar de la barra de direcciones y ábrela.
3. El panel "Prototipo · diagnóstico" debe decir **"Ventana flotante: disponible"** y **"Modo: app instalada"**.
4. Pulsa **START**: el temporizador pasa a una ventana flotante.

Para ver todas las fases en poco tiempo, baja la duración a 5 min con **-5** antes de START. WARNING empieza a los 3:45 y TIME'S UP llega a los 5:00.

## Pruebas

| # | Prueba | Cómo | Se supera si |
| :-- | :-- | :-- | :-- |
| 1 | **Encima de Meet** | Entra en una reunión de Meet (puedes estar tú solo). Pruébalo con Meet en ventana y a pantalla completa (F11), y con Teams o Zoom de escritorio si los usáis. | La ventana flotante se ve siempre encima. |
| 2 | **Ventana flotante de Meet** | Con Daily Whip flotando, cambia de pestaña o de app. Después, abre la ventana flotante de Meet desde su menú (⋮). | Anota qué pasa. Si Meet cierra la nuestra, el registro dirá "ventana flotante cerrada". Se supera si no ocurre, o si te vale desactivar la de Meet. |
| 3 | **Refresco minimizado** | Con 15 min, pulsa START, minimiza la ventana principal y espera hasta el final. | El contador cambia cada segundo, la línea "refresco máx." no pasa de unos 1000 ms y el 00:00 coincide con un cronómetro (±1 s). |
| 4 | **Experiencia** | Úsalo en una daily real. | No molestan la barra de Chrome, el clic para abrir ni el no poder minimizar. |

Comprueba también que, al cerrar la ventana flotante con su X, el temporizador vuelve a la ventana principal sin perder el tiempo.

## Resultado

| # | ¿Se supera? | Notas |
| :-- | :-- | :-- |
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
