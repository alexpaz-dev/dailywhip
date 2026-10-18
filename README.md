# Daily Whip

> 15 minutes. No excuses.

Un temporizador minimalista con estética pixel art para que las dailies terminen a tiempo. Se mantiene por encima de Meet, Teams o Zoom, funciona sin conexión y no recoge datos.

**Estado:** en desarrollo como PWA. El prototipo con el que se validó está en la rama [`prototype`](https://github.com/alexpaz-dev/dailywhip/tree/prototype) y publicado en https://alexpaz-dev.github.io/dailywhip/prototype/.

## Uso

1. Abre https://alexpaz-dev.github.io/dailywhip/ en **Chrome o Edge** de escritorio.
2. Opcional: instálala como app con el icono de instalar de la barra de direcciones.
3. Pulsa **START**: el temporizador pasa a una ventana flotante siempre visible.
4. Deja abierta la ventana principal mientras flota (puedes minimizarla): si la cierras, se cierra el temporizador.

## Desarrollo

Requisitos: Node 24 y pnpm.

```sh
pnpm install
pnpm dev       # servidor de desarrollo
pnpm test      # tests
pnpm build     # build de producción en dist/
pnpm preview   # sirve la build, con service worker
pnpm screenshots  # capturas de cada fase en screenshots/ (Playwright)
```

La ventana flotante solo funciona en Chrome y Edge; Safari y Firefox no la soportan. Cada push a `main` pasa los tests y se publica en GitHub Pages, junto con el prototipo en `/prototype/`.

Las decisiones del proyecto están en [DECISIONES.md](DECISIONES.md).

## Licencia

[MIT](LICENSE)
