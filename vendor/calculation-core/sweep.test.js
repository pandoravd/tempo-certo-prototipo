import assert from 'node:assert/strict';
import test from 'node:test';
import { getTableSet } from '@tempo-certo/reference-tables';
import { listModalities } from './catalog.js';
import { addJob, addSalary, createCase } from './case.js';
import { CalculationError, runModality } from './engine.js';
function sampleCase() {
    let c = createCase({ nome: 'Varredura' });
    c = {
        ...c,
        client: { ...c.client, requerimento: '2025-09-01', sexo: 'M' },
    };
    c = addJob(c, { employer: 'A', start: '1986-02-01', end: '1990-06-12', factor: 1 });
    c = addJob(c, { employer: 'B', start: '1990-12-03', end: '1994-06-02', factor: 1, especial: true });
    c = addJob(c, { employer: 'C', start: '1994-07-01', end: '2019-09-30', factor: 1 });
    for (const [competence, value] of [
        ['1993-01', 1000],
        ['1994-01', 1200],
        ['2019-01', 3000],
        ['2020-01', 3200],
        ['2021-01', 3400],
    ]) {
        c = addSalary(c, { competence, value });
    }
    return c;
}
function executableIds() {
    const ids = [];
    for (const m of listModalities()) {
        if (m.variants?.length) {
            for (const v of m.variants)
                ids.push(v.id);
        }
        else {
            ids.push(m.id);
        }
    }
    return ids;
}
test('varredura: cada modalidade executável produz resultado', () => {
    const c = sampleCase();
    const tables = getTableSet('tables-sample-v3');
    const empty = createCase({ nome: 'Vazio' });
    for (const id of executableIds()) {
        const result = runModality(id, c, tables);
        assert.equal(typeof result.engineVersion, 'string');
        assert.ok(Object.keys(result.totals).length > 0, id);
    }
    assert.throws(() => runModality('tempo-contribuicao', empty), (err) => {
        assert.ok(err instanceof CalculationError);
        return true;
    });
    assert.throws(() => runModality('irsm-0294', empty, tables), (err) => {
        assert.ok(err instanceof CalculationError);
        assert.match(err.message, /Salários/);
        return true;
    });
});
//# sourceMappingURL=sweep.test.js.map