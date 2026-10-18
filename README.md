# Daily Whip · prototipo

> 15 minutes. No excuses.

**Rama congelada.** Es el prototipo con el que se validó que Daily Whip podía ser una PWA con ventana flotante (Document Picture-in-Picture). Superó las pruebas: los resultados están en [PROTOTIPO.md](PROTOTIPO.md).

- Publicado en https://alexpaz-dev.github.io/dailywhip/prototype/
- La app se desarrolla en la rama [`main`](https://github.com/alexpaz-dev/dailywhip).
- Esta rama no tiene workflow propio: el de `main` la compila y la publica en `/prototype/`.

## Desarrollo

Requisitos: Node 24 y pnpm.

```sh
pnpm install
pnpm dev       # servidor de desarrollo
pnpm test      # tests
pnpm build     # build de producción en dist/
```

## Licencia

[MIT](LICENSE)
