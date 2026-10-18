import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

export default defineConfig({
  // Relative paths: the build works under github.io/dailywhip/ or anywhere else.
  base: './',
  plugins: [serviceWorker()],
});

/** Writes dist/sw.js precaching every built file, so the app works offline. */
function serviceWorker(): Plugin {
  return {
    name: 'dailywhip:service-worker',
    apply: 'build',
    writeBundle({ dir }) {
      if (!dir) return;
      const files = readdirSync(dir, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name !== 'sw.js')
        .map((entry) => relative(dir, join(entry.parentPath, entry.name)).split(sep).join('/'))
        .sort();
      const hash = createHash('sha256');
      for (const file of files) hash.update(file).update(readFileSync(join(dir, file)));
      const template = readFileSync(new URL('./src/sw.js', import.meta.url), 'utf8');
      const source = template
        .replace('__VERSION__', hash.digest('hex').slice(0, 12))
        .replace('/* __PRECACHE__ */ []', JSON.stringify(['./', ...files]));
      writeFileSync(join(dir, 'sw.js'), source);
    },
  };
}
