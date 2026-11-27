import { cpSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const repoRoot = join(root, '../..');
mkdirSync(dist, { recursive: true });

const calcDist = join(repoRoot, 'packages/calculation-core/dist');
const tablesDist = join(repoRoot, 'packages/reference-tables/dist');
if (!existsSync(calcDist)) {
  console.error('Build calculation-core first');
  process.exit(1);
}

mkdirSync(join(dist, 'vendor'), { recursive: true });
cpSync(calcDist, join(dist, 'vendor/calculation-core'), { recursive: true });
cpSync(tablesDist, join(dist, 'vendor/reference-tables'), { recursive: true });

function walkJs(dir) {
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    if (name.isDirectory()) out.push(...walkJs(full));
    else if (name.isFile() && name.name.endsWith('.js') && !name.name.includes('.test.')) {
      out.push(full);
    }
  }
  return out;
}

const tablesEntry = join(dist, 'vendor/reference-tables/index.js');
for (const file of walkJs(join(dist, 'vendor/calculation-core'))) {
  let src = readFileSync(file, 'utf8');
  if (!src.includes('@tempo-certo/reference-tables')) continue;
  const rel = relative(dirname(file), tablesEntry).split(sep).join('/');
  const importPath = rel.startsWith('.') ? rel : `./${rel}`;
  src = src.replaceAll('@tempo-certo/reference-tables', importPath);
  writeFileSync(file, src);
}

writeFileSync(
  join(dist, 'calculation-core.js'),
  `export * from './vendor/calculation-core/index.js';\n`,
);

cpSync(join(root, 'src/engine-bridge.js'), join(dist, 'engine-bridge.js'));

writeFileSync(
  join(dist, 'debug.html'),
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><title>Debug motor</title></head><body><p><a href="./">Abrir protótipo com motor</a></p><script type="module" src="./engine-bridge.js"></script></body></html>`,
);

const protoPath = join(repoRoot, 'Tempo_Certo_Prototipo_Interativo_v8.html');
let html = readFileSync(protoPath, 'utf8');

if (!html.includes('engine-bridge.js')) {
  html = html.replace(
    '</body>',
    `  <script type="module" src="./engine-bridge.js"></script>\n</body>`,
  );
}

writeFileSync(join(dist, 'index.html'), html);
cpSync(protoPath, join(dist, 'prototype-raw.html'));

// Publica artefatos na raiz do repositório (GitHub Pages em /)
const pagesRoot = repoRoot;
writeFileSync(join(pagesRoot, '.nojekyll'), '');
writeFileSync(join(pagesRoot, 'index.html'), html);
cpSync(join(dist, 'engine-bridge.js'), join(pagesRoot, 'engine-bridge.js'));
cpSync(join(dist, 'calculation-core.js'), join(pagesRoot, 'calculation-core.js'));
rmSync(join(pagesRoot, 'vendor'), { recursive: true, force: true });
cpSync(join(dist, 'vendor'), join(pagesRoot, 'vendor'), { recursive: true });

console.log('Web build ready: apps/web/dist + raiz Pages (index.html + vendor + engine-bridge)');
console.log('Smoke import:', pathToFileURL(join(pagesRoot, 'engine-bridge.js')).href);
