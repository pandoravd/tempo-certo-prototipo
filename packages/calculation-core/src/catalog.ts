export type Wave = 'P0' | 'P1' | 'P2';

export interface ModalityVariant {
  id: string;
  name: string;
  subgroup?: string;
}

export interface ModalityDefinition {
  id: string;
  delphiIndex: number | null;
  name: string;
  group: string;
  wave: Wave;
  variants?: ModalityVariant[];
}

const CATALOG: ModalityDefinition[] = [
  {
    id: 'tempo-contribuicao',
    delphiIndex: 0,
    name: 'Cálculo de tempo de contribuição comum e especial',
    group: 'tempo',
    wave: 'P0',
  },
  {
    id: 'rmi-lei-9876',
    delphiIndex: 1,
    name: 'Cálculo ou Simulação da RMI Lei 9.876 de 29/11/99',
    group: 'rmi',
    wave: 'P0',
  },
  {
    id: 'rmi-lei-9876-concomitantes',
    delphiIndex: 2,
    name: 'Cálculo ou Simulação da RMI Lei 9.876 de 29/11/99 - atividades concomitantes',
    group: 'rmi',
    wave: 'P1',
  },
  {
    id: 'rmi-ortn-otn-8213',
    delphiIndex: 3,
    name: 'Cálculo da RMI: Revisão da ORTN/OTN e Lei 8.213/91 (texto original)',
    group: 'rmi',
    wave: 'P1',
  },
  {
    id: 'diferencas-rmi',
    delphiIndex: 4,
    name: 'Apuração das Diferenças entre a RMI ORIGINAL e a NOVA RMI (pelo sistema de atualização da RMI)',
    group: 'diferencas',
    wave: 'P1',
  },
  {
    id: 'diferencas-salario-beneficio',
    delphiIndex: 5,
    name: 'Apuração das Diferenças (pelo sistema de atualização do Salário-de-benefício - correção do valor real)',
    group: 'diferencas',
    wave: 'P1',
  },
  {
    id: 'simular-salarios-beneficio',
    delphiIndex: 6,
    name: 'Simular valores dos salários-de-benefício',
    group: 'extras',
    wave: 'P1',
  },
  {
    id: 'melhor-beneficio-tempo',
    delphiIndex: 7,
    name: 'Melhor Benefício de 05/10/1988 a 14/12/1998 - Ap. por tempo de serviço',
    group: 'melhor-beneficio',
    wave: 'P1',
  },
  {
    id: 'melhor-beneficio-idade',
    delphiIndex: 8,
    name: 'Melhor Benefício de 05/10/1988 a 28/11/1999 - Ap. por idade',
    group: 'melhor-beneficio',
    wave: 'P1',
  },
  {
    id: 'melhor-beneficio-especial',
    delphiIndex: 9,
    name: 'Melhor Benefício de 05/10/1988 a 28/11/1999 - Ap. especial',
    group: 'melhor-beneficio',
    wave: 'P1',
  },
  {
    id: 'diferencas-salario-minimo',
    delphiIndex: 10,
    name: 'Apuração das Diferenças (apenas salário mínimo)',
    group: 'diferencas',
    wave: 'P1',
  },
  {
    id: 'calculo-versao-anterior',
    delphiIndex: 11,
    name: 'Cálculo da versão anterior.',
    group: 'legado',
    wave: 'P2',
  },
  {
    id: 'diferencas-art45',
    delphiIndex: 12,
    name: 'Apuração das diferenças (art. 45 da Lei 8.213/91)',
    group: 'diferencas',
    wave: 'P1',
  },
  {
    id: 'contribuicoes-atraso',
    delphiIndex: 13,
    name: 'Calcular Contribuições Previdenciárias em Atraso',
    group: 'extras',
    wave: 'P2',
  },
  {
    id: 'beneficio-ec103',
    delphiIndex: 14,
    name: 'Cálculo do valor do benefício - EC 103/2019',
    group: 'ec103',
    wave: 'P0',
    variants: [
      { id: 'ec103-art15-voluntaria', name: 'Artigo 15 da EC 103/2019 (apos. voluntária)', subgroup: 'regras-transicao' },
      { id: 'ec103-art16-voluntaria', name: 'Artigo 16 da EC 103/2019 (apos. voluntária)', subgroup: 'regras-transicao' },
      { id: 'ec103-art17-pedagio-50', name: 'Artigo 17 da EC 103/2019 (apos. voluntária - pedágio 50%)', subgroup: 'regras-transicao' },
      { id: 'ec103-art20-pedagio-100', name: 'Artigo 20 da EC 103/2019 (apos. voluntária - pedágio 100%)', subgroup: 'regras-transicao' },
      { id: 'ec103-art18-idade', name: 'Artigo 18 da EC 103/2019 (apos. por idade)', subgroup: 'regras-transicao' },
      { id: 'ec103-art21-especial', name: 'Artigo 21 da EC 103/2019 (apos. especial)', subgroup: 'regras-transicao' },
      { id: 'ec103-art19-voluntaria', name: 'Artigo 19 da EC 103/2019 (apos. voluntária)', subgroup: 'disposicoes-transitorias' },
      { id: 'ec103-art19-especial', name: 'Artigo 19 da EC 103/2019 (apos. especial voluntária)', subgroup: 'disposicoes-transitorias' },
      { id: 'ec103-art23-pensao', name: 'Artigo 23 da EC 103/2019 (pensão por morte)', subgroup: 'disposicoes-transitorias' },
      { id: 'ec103-art26-incapacidade', name: 'Artigo 26 da EC 103/2019 (aposentadoria por incapacidade permanente)', subgroup: 'disposicoes-transitorias' },
      { id: 'ec103-auxilio-doenca', name: 'Auxílio-doença EC 103/2019', subgroup: 'disposicoes-transitorias' },
    ],
  },
  {
    id: 'tempo-ec103',
    delphiIndex: 15,
    name: 'Simulação de tempo de contribuição - EC 103/2019',
    group: 'ec103',
    wave: 'P0',
    variants: [
      { id: 'tempo-ec103-art15', name: 'Simulação art. 15 da EC 103/2019' },
      { id: 'tempo-ec103-art16', name: 'Simulação art. 16 da EC 103/2019' },
    ],
  },
  {
    id: 'pensao-acumulacao',
    delphiIndex: 16,
    name: 'Pensão por morte - Acumulação',
    group: 'extras',
    wave: 'P2',
  },
  {
    id: 'divisor-minimo',
    delphiIndex: null,
    name: 'Apuração do divisor mínimo',
    group: 'extras',
    wave: 'P1',
  },
  {
    id: 'sumula-2-trf4',
    delphiIndex: null,
    name: 'Súmula 2 do TRF 4ª Região',
    group: 'revisao',
    wave: 'P2',
  },
  {
    id: 'teto-ec20-ec41',
    delphiIndex: null,
    name: 'Teto EC 20/98 e EC 41/03',
    group: 'revisao',
    wave: 'P2',
  },
  {
    id: 'buraco-negro',
    delphiIndex: null,
    name: 'Buraco Negro',
    group: 'revisao',
    wave: 'P2',
  },
  {
    id: 'art58-adct',
    delphiIndex: null,
    name: 'Art. 58 do ADCT',
    group: 'revisao',
    wave: 'P2',
  },
  {
    id: 'irsm-0294',
    delphiIndex: null,
    name: 'IRSM 02/94',
    group: 'revisao',
    wave: 'P2',
  },
  {
    id: 'art21',
    delphiIndex: null,
    name: 'Art. 21',
    group: 'revisao',
    wave: 'P2',
  },
  {
    id: 'art26',
    delphiIndex: null,
    name: 'Art. 26',
    group: 'revisao',
    wave: 'P2',
  },
];

export function listModalities(): ModalityDefinition[] {
  return CATALOG.map((m) => ({ ...m, variants: m.variants?.map((v) => ({ ...v })) }));
}

export function getModality(id: string): ModalityDefinition {
  const found = CATALOG.find((m) => m.id === id || m.variants?.some((v) => v.id === id));
  if (!found) {
    throw new Error(`Modalidade inexistente: ${id}`);
  }
  return { ...found, variants: found.variants?.map((v) => ({ ...v })) };
}

export function resolveModalityId(id: string): { parentId: string; variantId?: string } {
  const direct = CATALOG.find((m) => m.id === id);
  if (direct) return { parentId: direct.id };
  for (const m of CATALOG) {
    const variant = m.variants?.find((v) => v.id === id);
    if (variant) return { parentId: m.id, variantId: variant.id };
  }
  throw new Error(`Modalidade inexistente: ${id}`);
}

export function catalogVersion(): string {
  return '1.1.0';
}
