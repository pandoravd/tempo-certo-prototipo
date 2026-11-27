import { runModality, listModalities } from './vendor/calculation-core/index.js';

const NAME_TO_ID = {
  'Cálculo de tempo de contribuição comum e especial': 'tempo-contribuicao',
  'Cálculo ou Simulação da RMI: Lei 9.876 de 29/11/99': 'rmi-lei-9876',
  'Cálculo ou Simulação da RMI Lei 9.876 de 29/11/99': 'rmi-lei-9876',
  'Cálculo ou Simulação da RMI: Lei 9.876 de 29/11/99 - atividades concomitantes': 'rmi-lei-9876-concomitantes',
  'Cálculo da RMI: Revisão da ORTN/OTN e Lei 8.213/91 (texto original)': 'rmi-ortn-otn-8213',
  'Apuração das Diferenças entre a RMI ORIGINAL e a NOVA RMI': 'diferencas-rmi',
  'Apuração das Diferenças pelo sistema de atualização do Salário-de-benefício': 'diferencas-salario-beneficio',
  'Apuração das Diferenças (apenas salário mínimo)': 'diferencas-salario-minimo',
  'Apuração das diferenças (art. 45 da Lei 8.213/91)': 'diferencas-art45',
  'Simular valores dos salários-de-benefício': 'simular-salarios-beneficio',
  'Melhor Benefício de 05/10/1988 a 14/12/1998 - Ap. por tempo de serviço': 'melhor-beneficio-tempo',
  'Melhor Benefício de 05/10/1988 a 28/11/1999 - Ap. por idade': 'melhor-beneficio-idade',
  'Melhor Benefício de 05/10/1988 a 28/11/1999 - Ap. especial': 'melhor-beneficio-especial',
  'Calcular Contribuições Previdenciárias em Atraso': 'contribuicoes-atraso',
  'Cálculo do valor do benefício - EC 103/2019': 'beneficio-ec103',
  'Simulação de tempo de contribuição - EC 103/2019': 'tempo-ec103',
  'Pensão por morte - Acumulação': 'pensao-acumulacao',
  'Apuração do divisor mínimo': 'divisor-minimo',
  'Súmula 2 do TRF 4ª Região': 'sumula-2-trf4',
  'Teto EC 20/98 e EC 41/03': 'teto-ec20-ec41',
  'Buraco Negro': 'buraco-negro',
  'Art. 58 do ADCT': 'art58-adct',
  'IRSM 02/94': 'irsm-0294',
  'Art. 21': 'art21',
  'Art. 26': 'art26',
};

function parseMoney(br) {
  if (typeof br === 'number') return br;
  const s = String(br || '')
    .replace(/\s/g, '')
    .replace(/R\$/gi, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function parseFactor(f) {
  if (typeof f === 'number') return f;
  const s = String(f || '1').replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function competenceToIso(comp) {
  const m = String(comp || '').match(/^(\d{2})\/(\d{4})$/);
  if (m) return `${m[2]}-${m[1]}`;
  if (/^\d{4}-\d{2}/.test(comp || '')) return String(comp).slice(0, 7);
  return '';
}

function toEngineCase(item) {
  return {
    id: item.id || 'ui',
    title: item.title || 'Caso',
    status: item.status || 'Em andamento',
    client: {
      nome: item.client?.nome || 'Segurado',
      nascimento: item.client?.nascimento || '',
      requerimento: item.client?.requerimento || '',
      cpf: item.client?.cpf || '',
      nit: item.client?.nit || '',
    },
    jobs: (item.jobs || [])
      .filter((j) => j.start && j.end)
      .map((j, i) => ({
        id: `job-${i}`,
        employer: j.employer || `Tempo ${i + 1}`,
        cargo: j.cargo || '',
        start: j.start,
        end: j.end,
        factor: parseFactor(j.factor),
        especial: false,
      })),
    salaries: (item.salaries || [])
      .map((s, i) => {
        const competence = competenceToIso(s.competencia || s.competence);
        return {
          id: `sal-${i}`,
          competence,
          value: parseMoney(s.valor ?? s.value),
        };
      })
      .filter((s) => s.competence && s.value > 0),
    modalities: [],
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    schemaVersion: 1,
  };
}

function resolveId(modalityName) {
  if (NAME_TO_ID[modalityName]) return NAME_TO_ID[modalityName];
  const lower = modalityName.toLowerCase();
  if (lower.includes('tempo de contribuição') && lower.includes('ec 103')) return 'tempo-ec103';
  if (lower.includes('tempo de contribuição')) return 'tempo-contribuicao';
  if (lower.includes('rmi') && lower.includes('concomit')) return 'rmi-lei-9876-concomitantes';
  if (lower.includes('rmi') && lower.includes('9.876')) return 'rmi-lei-9876';
  if (lower.includes('divisor')) return 'divisor-minimo';
  if (lower.includes('atraso')) return 'contribuicoes-atraso';
  if (lower.includes('pensão') || lower.includes('pensao')) return 'pensao-acumulacao';
  if (lower.includes('ec 103') && lower.includes('benefício')) return 'beneficio-ec103';
  if (lower.includes('melhor') && lower.includes('idade')) return 'melhor-beneficio-idade';
  if (lower.includes('melhor') && lower.includes('especial')) return 'melhor-beneficio-especial';
  if (lower.includes('melhor')) return 'melhor-beneficio-tempo';
  if (lower.includes('irsm')) return 'irsm-0294';
  if (lower.includes('buraco')) return 'buraco-negro';
  if (lower.includes('súmula') || lower.includes('sumula')) return 'sumula-2-trf4';
  if (lower.includes('teto') && lower.includes('ec')) return 'teto-ec20-ec41';
  if (lower.includes('art. 58') || lower.includes('adct')) return 'art58-adct';
  if (lower.includes('art. 21') || lower === 'art 21') return 'art21';
  if (lower.includes('art. 26') || lower === 'art 26') return 'art26';
  throw new Error(`Modalidade sem mapeamento no motor: ${modalityName}`);
}

function calculateItem(item, modalityName) {
  const id = resolveId(modalityName || item.modalities?.[item.selected || 0] || '');
  const engineCase = toEngineCase(item);
  return runModality(id, engineCase);
}

window.__tcEngine = {
  listModalities,
  calculateItem,
  resolveId,
  ready: true,
};

window.dispatchEvent(new Event('tc-engine-ready'));
