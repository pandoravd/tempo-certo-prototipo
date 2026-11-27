import assert from 'node:assert/strict';
import test from 'node:test';
import { addJob, addSalary, createCase, runModality } from './index.js';
test('paridade desktop vs web: mesmos totais no mesmo núcleo', () => {
    const build = () => {
        let c = createCase({ nome: 'Paridade' });
        c = addJob(c, { employer: 'A', start: '1994-07-01', end: '2019-09-30', factor: 1 });
        c = addSalary(c, { competence: '2019-01', value: 3000 });
        c = addSalary(c, { competence: '2020-01', value: 3200 });
        return c;
    };
    const webLike = runModality('rmi-lei-9876', build());
    const desktopLike = runModality('rmi-lei-9876', build());
    assert.deepEqual(webLike.totals, desktopLike.totals);
    assert.equal(webLike.tablesVersionId, desktopLike.tablesVersionId);
});
//# sourceMappingURL=parity.test.js.map