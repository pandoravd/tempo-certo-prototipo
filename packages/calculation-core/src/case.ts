export interface ClientData {
  nome: string;
  mae?: string;
  nascimento?: string;
  cpf?: string;
  nit?: string;
  requerimento?: string;
  endereco?: string;
  sexo?: 'M' | 'F';
}

export interface JobLink {
  id: string;
  employer: string;
  cargo?: string;
  start: string;
  end: string;
  factor?: number;
  especial?: boolean;
}

export interface SalaryEntry {
  id: string;
  competence: string;
  value: number;
}

export type CaseStatus = 'Em andamento' | 'Exemplo' | 'Concluído';

export interface CaseRecord {
  id: string;
  title: string;
  status: CaseStatus;
  client: ClientData;
  jobs: JobLink[];
  salaries: SalaryEntry[];
  modalities: string[];
  createdAt: string;
  updatedAt: string;
  schemaVersion: number;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createCase(input: { nome: string; title?: string }): CaseRecord {
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

export function validateCase(caseRecord: CaseRecord): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
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

export function addJob(caseRecord: CaseRecord, job: Omit<JobLink, 'id'> & { id?: string }): CaseRecord {
  const next: CaseRecord = {
    ...caseRecord,
    jobs: [...caseRecord.jobs, { ...job, id: job.id || makeId('job') }],
    updatedAt: nowIso(),
  };
  return next;
}

export function updateJob(caseRecord: CaseRecord, jobId: string, patch: Partial<JobLink>): CaseRecord {
  return {
    ...caseRecord,
    jobs: caseRecord.jobs.map((j) => (j.id === jobId ? { ...j, ...patch, id: j.id } : j)),
    updatedAt: nowIso(),
  };
}

export function removeJob(caseRecord: CaseRecord, jobId: string): CaseRecord {
  return {
    ...caseRecord,
    jobs: caseRecord.jobs.filter((j) => j.id !== jobId),
    updatedAt: nowIso(),
  };
}

export function addSalary(caseRecord: CaseRecord, salary: Omit<SalaryEntry, 'id'> & { id?: string }): CaseRecord {
  return {
    ...caseRecord,
    salaries: [...caseRecord.salaries, { ...salary, id: salary.id || makeId('sal') }],
    updatedAt: nowIso(),
  };
}

export function removeSalary(caseRecord: CaseRecord, salaryId: string): CaseRecord {
  return {
    ...caseRecord,
    salaries: caseRecord.salaries.filter((s) => s.id !== salaryId),
    updatedAt: nowIso(),
  };
}

export function setModalities(caseRecord: CaseRecord, modalities: string[]): CaseRecord {
  return { ...caseRecord, modalities: [...modalities], updatedAt: nowIso() };
}

export function exportCaseJson(caseRecord: CaseRecord): string {
  return JSON.stringify(caseRecord, null, 2);
}

export function importCaseJson(raw: string): CaseRecord {
  const parsed = JSON.parse(raw) as CaseRecord;
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

export interface CnisPreview {
  client: Partial<ClientData>;
  jobs: Omit<JobLink, 'id'>[];
  salaries: Omit<SalaryEntry, 'id'>[];
}

export function previewCnisJson(raw: string): CnisPreview {
  const data = JSON.parse(raw) as {
    client?: Partial<ClientData>;
    jobs?: Array<Partial<JobLink>>;
    salaries?: Array<Partial<SalaryEntry>>;
  };
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

export function applyCnisPreview(caseRecord: CaseRecord, preview: CnisPreview, confirmed: boolean): CaseRecord {
  if (!confirmed) {
    return caseRecord;
  }
  let next: CaseRecord = {
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
