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
export declare function createCase(input: {
    nome: string;
    title?: string;
}): CaseRecord;
export declare function validateCase(caseRecord: CaseRecord): ValidationIssue[];
export declare function addJob(caseRecord: CaseRecord, job: Omit<JobLink, 'id'> & {
    id?: string;
}): CaseRecord;
export declare function updateJob(caseRecord: CaseRecord, jobId: string, patch: Partial<JobLink>): CaseRecord;
export declare function removeJob(caseRecord: CaseRecord, jobId: string): CaseRecord;
export declare function addSalary(caseRecord: CaseRecord, salary: Omit<SalaryEntry, 'id'> & {
    id?: string;
}): CaseRecord;
export declare function removeSalary(caseRecord: CaseRecord, salaryId: string): CaseRecord;
export declare function setModalities(caseRecord: CaseRecord, modalities: string[]): CaseRecord;
export declare function exportCaseJson(caseRecord: CaseRecord): string;
export declare function importCaseJson(raw: string): CaseRecord;
export interface CnisPreview {
    client: Partial<ClientData>;
    jobs: Omit<JobLink, 'id'>[];
    salaries: Omit<SalaryEntry, 'id'>[];
}
export declare function previewCnisJson(raw: string): CnisPreview;
export declare function applyCnisPreview(caseRecord: CaseRecord, preview: CnisPreview, confirmed: boolean): CaseRecord;
//# sourceMappingURL=case.d.ts.map