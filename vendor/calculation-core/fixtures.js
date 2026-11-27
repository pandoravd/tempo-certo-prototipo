import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTableSet } from '../reference-tables/index.js';
import { addJob, addSalary, createCase } from './case.js';
import { compareTotals, runModality } from './engine.js';
function fixturesDir() {
    return join(dirname(fileURLToPath(import.meta.url)), '..', 'fixtures');
}
export function listFixtureFiles() {
    return readdirSync(fixturesDir()).filter((f) => f.endsWith('.json'));
}
export function loadFixture(fileName) {
    const raw = readFileSync(join(fixturesDir(), fileName), 'utf8');
    return JSON.parse(raw);
}
export function fixtureToCase(fixture) {
    let c = createCase({ nome: fixture.case.client.nome });
    c = {
        ...c,
        client: {
            ...c.client,
            ...fixture.case.client,
        },
    };
    for (const job of fixture.case.jobs) {
        c = addJob(c, job);
    }
    for (const sal of fixture.case.salaries) {
        c = addSalary(c, sal);
    }
    return c;
}
export function runGoldenFixture(fileName) {
    const fixture = loadFixture(fileName);
    const tables = getTableSet(fixture.tablesVersionId);
    const result = runModality(fixture.modalityId, fixtureToCase(fixture), tables);
    const compared = compareTotals(result.totals, fixture.expectedTotals, fixture.tolerance ?? 0.01);
    return { ...compared, actual: result.totals, fixture };
}
//# sourceMappingURL=fixtures.js.map