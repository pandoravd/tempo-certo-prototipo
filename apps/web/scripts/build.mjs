import { cpSync, mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

function rewriteImports(file, from, to) {
  if (!existsSync(file)) return;
  let src = readFileSync(file, 'utf8');
  src = src.replaceAll(from, to);
  writeFileSync(file, src);
}

rewriteImports(
  join(dist, 'vendor/calculation-core/engine.js'),
  '@tempo-certo/reference-tables',
  '../reference-tables/index.js',
);
rewriteImports(
  join(dist, 'vendor/calculation-core/engine.test.js'),
  '@tempo-certo/reference-tables',
  '../reference-tables/index.js',
);

writeFileSync(
  join(dist, 'calculation-core.js'),
  `export * from './vendor/calculation-core/index.js';\n`,
);

cpSync(join(root, 'src/engine-bridge.js'), join(dist, 'engine-bridge.js'));

// Página simples de debug (mantida)
writeFileSync(
  join(dist, 'debug.html'),
  `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"/><title>Debug motor</title></head><body><p><a href="./">Abrir protótipo com motor</a></p><script type="module" src="./engine-bridge.js"></script></body></html>`,
);

const protoPath = join(repoRoot, 'Tempo_Certo_Prototipo_Interativo_v8.html');
let html = readFileSync(protoPath, 'utf8');

// Injeta bridge do motor antes do fechamento de body
if (!html.includes('engine-bridge.js')) {
  html = html.replace(
    '</body>',
    `  <script type="module" src="./engine-bridge.js"></script>\n</body>`,
  );
}

writeFileSync(join(dist, 'index.html'), html);
cpSync(protoPath, join(dist, 'prototype-raw.html'));

console.log('Web build ready: protótipo com motor em apps/web/dist/index.html');
