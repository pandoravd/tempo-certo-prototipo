import assert from 'node:assert/strict';
import test from 'node:test';
import { compareTotals } from './engine.js';
import { listFixtureFiles, loadFixture, runGoldenFixture } from './fixtures.js';
test('compareTotals falha quando total foge da tolerância', () => {
    const ok = compareTotals({ rmi: 100 }, { rmi: 100 }, 0.01);
    assert.equal(ok.ok, true);
    const bad = compareTotals({ rmi: 100 }, { rmi: 110 }, { rmi: 0.01 });
    assert.equal(bad.ok, false);
    assert.match(bad.diffs[0], /rmi/);
});
test('fixtures P0 e P2 acessíveis', () => {
    const files = listFixtureFiles();
    assert.ok(files.includes('tempo-contribuicao.json'));
    assert.ok(files.includes('irsm-0294.json'));
    assert.equal(loadFixture('tempo-contribuicao.json').source, 'documented-rule');
});
test('golden fixtures passam', () => {
    for (const file of listFixtureFiles()) {
        const result = runGoldenFixture(file);
        assert.equal(result.ok, true, `${file}: ${result.diffs.join('; ')}`);
    }
});
//# sourceMappingURL=golden.test.js.map