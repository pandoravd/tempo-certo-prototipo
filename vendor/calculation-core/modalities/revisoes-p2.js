import { lookupBuracoNegro, lookupCoeficiente, lookupIndex, lookupIrsm, lookupMinimumWage, lookupTetoEc20, lookupTetoEc41, } from '../../reference-tables/index.js';
import { baseResult, computeRmiCore, requireSalaries, round2, round4, } from './shared.js';
export function runIrsm0294(caseRecord, tables) {
    requireSalaries(caseRecord, 'Salários obrigatórios para revisão IRSM 02/94');
    const fator = lookupIrsm(tables, '1994-02');
    const { sb, coefficient, rmi, indexed } = computeRmiCore(caseRecord, tables, {
        salaryTransform: (s) => {
            if (s.competence <= '1994-02') {
                return { ...s, value: s.value * fator };
            }
            return s;
        },
    });
    return baseResult('irsm-0294', 'irsm-0294', tables, {
        rmi: round2(rmi),
        fatorIrsm: round4(fator),
        salarioBeneficio: round2(sb),
        coeficiente: round4(coefficient),
    }, indexed.map((s) => ({
        label: s.competence,
        value: round2(s.indexed),
        meta: { original: s.value },
    })));
}
export function runTetoEc20Ec41(caseRecord, tables) {
    requireSalaries(caseRecord, 'Salários obrigatórios para revisão de teto EC 20/41');
    const { rmi } = computeRmiCore(caseRecord, tables);
    const req = (caseRecord.client.requerimento || '2004-01-01').slice(0, 7);
    const c20 = lookupTetoEc20(tables, req);
    const c41 = lookupTetoEc41(tables, req);
    const tetoAjustado = round2(rmi * Math.max(c20, c41));
    return baseResult('teto-ec20-ec41', 'teto-ec20-ec41', tables, {
        rmiOriginal: round2(rmi),
        coeficienteEc20: round4(c20),
        coeficienteEc41: round4(c41),
        rmi: tetoAjustado,
    }, [
        { label: 'RMI original', value: round2(rmi) },
        { label: 'Coef. EC20', value: round4(c20) },
        { label: 'Coef. EC41', value: round4(c41) },
        { label: 'RMI teto revisada', value: tetoAjustado },
    ]);
}
export function runBuracoNegro(caseRecord, tables) {
    requireSalaries(caseRecord, 'Salários obrigatórios para revisão Buraco Negro');
    const { sb, rmi, indexed } = computeRmiCore(caseRecord, tables, {
        indexFn: (t, competence) => {
            const base = lookupIndex(t, competence);
            try {
                return base * lookupBuracoNegro(t, competence);
            }
            catch {
                return base;
            }
        },
    });
    return baseResult('buraco-negro', 'buraco-negro', tables, { rmi: round2(rmi), salarioBeneficio: round2(sb) }, indexed.map((s) => ({ label: s.competence, value: round2(s.indexed) })));
}
export function runArt58Adct(caseRecord, tables) {
    requireSalaries(caseRecord, 'Salários obrigatórios para Art. 58 ADCT');
    const { rmi } = computeRmiCore(caseRecord, tables);
    const req = (caseRecord.client.requerimento || '1988-10-05').slice(0, 7);
    const sm = lookupMinimumWage(tables, req);
    let smBase = 1;
    try {
        smBase = lookupCoeficiente(tables, 'art58SmBase');
    }
    catch {
        /* */
    }
    const emSm = sm > 0 ? rmi / sm : 0;
    const revisada = round2(emSm * sm * smBase);
    return baseResult('art58-adct', 'art58-adct', tables, { rmi: revisada, equivalentesSm: round4(emSm), salarioMinimo: sm }, [
        { label: 'RMI em SM', value: round4(emSm) },
        { label: 'RMI revisada', value: revisada },
    ]);
}
export function runArt21(caseRecord, tables) {
    requireSalaries(caseRecord, 'Salários obrigatórios para Art. 21');
    const original = computeRmiCore(caseRecord, tables).rmi;
    const nova = computeRmiCore(caseRecord, tables, {
        indexFn: (t, c) => lookupIndex(t, c) * 1.1,
    }).rmi;
    return baseResult('art21', 'art21', tables, {
        rmiOriginal: round2(original),
        rmi: round2(nova),
        diferenca: round2(nova - original),
    }, [
        { label: 'RMI original', value: round2(original) },
        { label: 'RMI Art.21', value: round2(nova) },
    ]);
}
export function runArt26(caseRecord, tables) {
    requireSalaries(caseRecord, 'Salários obrigatórios para Art. 26');
    const { sb, rmi } = computeRmiCore(caseRecord, tables);
    const revisada = round2(sb); // Art.26 documented: RMI = 100% do SB (incapacidade)
    return baseResult('art26', 'art26', tables, { rmi: revisada, salarioBeneficio: round2(sb), rmiOriginal: round2(rmi) }, [
        { label: 'SB', value: round2(sb) },
        { label: 'RMI Art.26 (100% SB)', value: revisada },
    ]);
}
export function runSumula2Trf4(caseRecord, tables) {
    requireSalaries(caseRecord, 'Salários obrigatórios para Súmula 2 TRF4');
    const { rmi } = computeRmiCore(caseRecord, tables);
    let fator = 1;
    try {
        fator = lookupCoeficiente(tables, 'sumula2');
    }
    catch {
        /* */
    }
    const revisada = round2(rmi * fator);
    return baseResult('sumula-2-trf4', 'sumula-2-trf4', tables, { rmi: revisada, fator: round4(fator), rmiOriginal: round2(rmi) }, [
        { label: 'RMI original', value: round2(rmi) },
        { label: 'Fator Súmula 2', value: round4(fator) },
        { label: 'RMI revisada', value: revisada },
    ]);
}
//# sourceMappingURL=revisoes-p2.js.map