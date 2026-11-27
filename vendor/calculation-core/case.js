function nowIso() {
    return new Date().toISOString();
}
function makeId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
export function createCase(input) {
    const nome = input.nome?.trim();
    if (!nome) {
        throw new Error('Nome do segurado é obrigatório');
    }
    const ts = nowIso();
    return {
        id: makeId('case'),
        title: input.title?.trim() || `Cálculo - ${nome}`,
        status: 'Em andamento',
        client: { nome },
        jobs: [],
        salaries: [],
        modalities: [],
        createdAt: ts,
        updatedAt: ts,
        schemaVersion: 1,
    };
}
export function validateCase(caseRecord) {
    const issues = [];
    if (!caseRecord.client?.nome?.trim()) {
        issues.push({ field: 'client.nome', message: 'Nome do segurado é obrigatório' });
    }
    for (const [i, job] of caseRecord.jobs.entries()) {
        if (!job.start || !job.end) {
            issues.push({ field: `jobs[${i}]`, message: 'Vínculo exige início e fim' });
        }
    }
    for (const modalityId of caseRecord.modalities) {
        if (!modalityId?.trim()) {
            issues.push({ field: 'modalities', message: 'Modalidade vazia não é permitida' });
        }
    }
    return issues;
}
export function addJob(caseRecord, job) {
    const next = {
        ...caseRecord,
        jobs: [...caseRecord.jobs, { ...job, id: job.id || makeId('job') }],
        updatedAt: nowIso(),
    };
    return next;
}
export function updateJob(caseRecord, jobId, patch) {
    return {
        ...caseRecord,
        jobs: caseRecord.jobs.map((j) => (j.id === jobId ? { ...j, ...patch, id: j.id } : j)),
        updatedAt: nowIso(),
    };
}
export function removeJob(caseRecord, jobId) {
    return {
        ...caseRecord,
        jobs: caseRecord.jobs.filter((j) => j.id !== jobId),
        updatedAt: nowIso(),
    };
}
export function addSalary(caseRecord, salary) {
    return {
        ...caseRecord,
        salaries: [...caseRecord.salaries, { ...salary, id: salary.id || makeId('sal') }],
        updatedAt: nowIso(),
    };
}
export function removeSalary(caseRecord, salaryId) {
    return {
        ...caseRecord,
        salaries: caseRecord.salaries.filter((s) => s.id !== salaryId),
        updatedAt: nowIso(),
    };
}
export function setModalities(caseRecord, modalities) {
    return { ...caseRecord, modalities: [...modalities], updatedAt: nowIso() };
}
export function exportCaseJson(caseRecord) {
    return JSON.stringify(caseRecord, null, 2);
}
export function importCaseJson(raw) {
    const parsed = JSON.parse(raw);
    const issues = validateCase(parsed);
    if (issues.length) {
        throw new Error(issues.map((i) => i.message).join('; '));
    }
    if (!parsed.id || !Array.isArray(parsed.jobs) || !Array.isArray(parsed.salaries)) {
        throw new Error('JSON de caso inválido');
    }
    return {
        ...parsed,
        jobs: parsed.jobs ?? [],
        salaries: parsed.salaries ?? [],
        modalities: parsed.modalities ?? [],
        schemaVersion: parsed.schemaVersion ?? 1,
    };
}
export function previewCnisJson(raw) {
    const data = JSON.parse(raw);
    return {
        client: data.client ?? {},
        jobs: (data.jobs ?? []).map((j) => ({
            employer: j.employer || 'Vínculo CNIS',
            cargo: j.cargo,
            start: j.start || '',
            end: j.end || '',
            factor: j.factor ?? 1,
            especial: j.especial ?? false,
        })),
        salaries: (data.salaries ?? []).map((s) => ({
            competence: s.competence || '',
            value: Number(s.value) || 0,
        })),
    };
}
export function applyCnisPreview(caseRecord, preview, confirmed) {
    if (!confirmed) {
        return caseRecord;
    }
    let next = {
        ...caseRecord,
        client: { ...caseRecord.client, ...preview.client, nome: preview.client.nome?.trim() || caseRecord.client.nome },
        updatedAt: nowIso(),
    };
    for (const job of preview.jobs) {
        next = addJob(next, job);
    }
    for (const salary of preview.salaries) {
        next = addSalary(next, salary);
    }
    return next;
}
//# sourceMappingURL=case.js.map