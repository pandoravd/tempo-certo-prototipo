import assert from 'node:assert/strict';
import test from 'node:test';
import { applyCeiling, betweenDates, monthProportion, ymdToDays } from './dates.js';
test('EntreDatas exemplo básico', () => {
    const ymd = betweenDates('2000-01-01', '2000-01-30');
    assert.equal(ymd.years, 0);
    assert.equal(ymd.months, 1);
    assert.equal(ymd.days, 0);
    const year = betweenDates('2000-01-01', '2000-12-31');
    assert.equal(year.years, 1);
});
test('proporção e teto', () => {
    assert.equal(monthProportion(15, 30), 0.5);
    assert.equal(applyCeiling(9000, 8000), 8000);
    assert.ok(ymdToDays({ years: 1, months: 0, days: 0 }) >= 365);
});
//# sourceMappingURL=dates.test.js.map