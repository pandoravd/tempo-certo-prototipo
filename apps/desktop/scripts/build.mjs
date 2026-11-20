import { mkdirSync, writeFileSync, cpSync, existsSync, readFileSync } from 'node:fs';
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

cpSync(calcDist, join(dist, 'vendor/calculation-core'), { recursive: true });
cpSync(tablesDist, join(dist, 'vendor/reference-tables'), { recursive: true });

const enginePath = join(dist, 'vendor/calculation-core/engine.js');
let engineSrc = readFileSync(enginePath, 'utf8');
engineSrc = engineSrc.replaceAll('@tempo-certo/reference-tables', '../reference-tables/index.js');
writeFileSync(enginePath, engineSrc);

const engineTestPath = join(dist, 'vendor/calculation-core/engine.test.js');
if (existsSync(engineTestPath)) {
  let t = readFileSync(engineTestPath, 'utf8');
  t = t.replaceAll('@tempo-certo/reference-tables', '../reference-tables/index.js');
  writeFileSync(engineTestPath, t);
}

writeFileSync(
  join(dist, 'cli.js'),
  `#!/usr/bin/env node
import {
  createCase,
  addJob,
  addSalary,
  setModalities,
  exportCaseJson,
  runModality,
} from './vendor/calculation-core/index.js';

const modalityId = process.argv[2] || 'tempo-contribuicao';
const nome = process.argv[3] || 'Segurado Desktop';

let c = createCase({ nome });
c = addJob(c, { employer: 'Tempo 1', start: '1986-02-01', end: '1990-06-12', factor: 1 });
c = addJob(c, { employer: 'Tempo 2', start: '1990-12-03', end: '1994-06-02', factor: 1 });
c = addJob(c, { employer: 'Tempo 3', start: '1994-07-01', end: '2019-09-30', factor: 1 });
c = addSalary(c, { competence: '2019-01', value: 3000 });
c = addSalary(c, { competence: '2020-01', value: 3200 });
c = addSalary(c, { competence: '2021-01', value: 3400 });
c = setModalities(c, [modalityId]);

const result = runModality(modalityId, c);
const payload = { platform: 'desktop-cli', case: JSON.parse(exportCaseJson(c)), result };
console.log(JSON.stringify(payload, null, 2));
`,
);

writeFileSync(
  join(dist, 'tauri-bridge.md'),
  `# Ponte Tauri

Este CLI Node demonstra o mesmo fluxo do desktop. O app Tauri deve:

1. Embutir \`apps/web/dist\` como frontend
2. Expor comandos Rust/\`invoke\` que chamam \`runModality\` via sidecar Node ou porta WASM futura
3. Persistir casos em pasta local do usuário

Enquanto o binário Tauri não é gerado nesta máquina, \`npm start -w @tempo-certo/desktop\` valida o núcleo ponta a ponta.
`,
);

console.log('Desktop build ready at apps/desktop/dist');
