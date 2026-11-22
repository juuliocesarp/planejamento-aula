import type { Disciplina, DiscId, Fonte } from './tipos';

export const DISCIPLINAS: Disciplina[] = [
  { id: 'fis', nome: 'Física', curto: 'Física', area: 'Ciências da Natureza e suas Tecnologias', icone: '⚛', cor: '--c-fis' },
  { id: 'geo', nome: 'Geografia', curto: 'Geografia', area: 'Ciências Humanas e Sociais Aplicadas', icone: '◍', cor: '--c-geo' },
  { id: 'his', nome: 'História', curto: 'História', area: 'Ciências Humanas e Sociais Aplicadas', icone: '⌛', cor: '--c-his' },
  { id: 'red', nome: 'Redação e produção da revista', curto: 'Redação', area: 'Linguagens e suas Tecnologias', icone: '✎', cor: '--c-red' },
  { id: 'gl', nome: 'Gramática e Literatura', curto: 'Gram. e Lit.', area: 'Linguagens e suas Tecnologias', icone: '❦', cor: '--c-gl' },
];

export const disc = (id: DiscId) => DISCIPLINAS.find((d) => d.id === id)!;

export type PerfilId = 'julio' | 'malu' | 'marina' | 'guilherme' | 'vitor';

export interface Perfil {
  id: PerfilId;
  nome: string;
  iniciais: string;
  disc: DiscId | 'port'; // 'port' = escolhe a frente no primeiro acesso
}

export const PERFIS: Perfil[] = [
  { id: 'julio', nome: 'Julio Cesar', iniciais: 'JC', disc: 'geo' },
  { id: 'malu', nome: 'Malu', iniciais: 'MA', disc: 'port' },
  { id: 'marina', nome: 'Marina', iniciais: 'MR', disc: 'port' },
  { id: 'guilherme', nome: 'Guilherme', iniciais: 'GU', disc: 'fis' },
  { id: 'vitor', nome: 'Vitor', iniciais: 'VI', disc: 'his' },
];

export const SENHA = '123456';

export const TURMAS = ['2º A', '2º B', '2º C', '2º D'];
export const ALUNOS_POR_TURMA = 30;

export const PROJETO = {
  nome: 'Revista: Plano Interdisciplinar',
  disciplinaFaculdade: 'Didática Fundamental (UnB)',
  tema: 'Energia, Trabalho e Território: das Máquinas Térmicas à Crise Climática',
  serie: '2ª série do Ensino Médio',
  produto: 'Uma revista científica e cultural por turma (4 editoras estudantis), lançada na Mostra de Editoras',
};

export const FONTES: Record<string, Fonte> = {
  guia: {
    id: 'guia',
    titulo: 'Guia de referência do grupo',
    detalhe: '"Educação Brasileira: Legislação e Currículo" — Guia estruturado de legislação, currículo do 2º ano do EM, metodologias e avaliação (programação anual de 40 semanas, metodologias e 16 formas de avaliação).',
  },
  projeto: {
    id: 'projeto',
    titulo: 'PDF do projeto',
    detalhe: '"Consultoria Pedagógica e Fundamentos Educacionais" — conversa que definiu o tema, os 6 dossiês, os papéis editoriais, as fases e a avaliação da revista.',
  },
  seedf: {
    id: 'seedf',
    titulo: 'Calendário Escolar 2026 — SEEDF',
    detalhe: 'Calendário Escolar Anual 2026 da Rede Pública do DF, Portaria nº 1.300, de 28/11/2025.',
    url: 'https://www.educacao.df.gov.br/calendario-escolar-rede-publica/',
  },
  bncc: {
    id: 'bncc',
    titulo: 'BNCC — Ensino Médio',
    detalhe: 'Base Nacional Comum Curricular, Ensino Médio (MEC, 2018).',
    url: 'https://www.gov.br/mec/pt-br/cne/arquivos/bncc_ensino_medio.pdf',
  },
  freire: {
    id: 'freire',
    titulo: 'Paulo Freire',
    detalhe: 'FREIRE, P. Pedagogia do Oprimido; Pedagogia da Autonomia (tema gerador, leitura de mundo, diálogo). Citado no guia e no PDF do projeto.',
  },
  gasparin: {
    id: 'gasparin',
    titulo: 'Gasparin / Pedagogia Histórico-Crítica',
    detalhe: 'GASPARIN, J. L. Uma didática para a Pedagogia Histórico-Crítica (5 passos). Citado no guia.',
  },
  mazur: {
    id: 'mazur',
    titulo: 'Peer Instruction (Eric Mazur)',
    detalhe: 'Instrução pelos Pares: miniexposições de 10–15 min e testes conceituais; regra 30%–70%. Citado no guia.',
  },
  luckesi: {
    id: 'luckesi',
    titulo: 'Avaliação — Luckesi, Hoffmann, Perrenoud',
    detalhe: 'Avaliação diagnóstica, formativa e mediadora. Citados no guia e no PDF do projeto.',
  },
  aneel: {
    id: 'aneel',
    titulo: 'ANEEL — bandeira vermelha patamar 2',
    detalhe: 'Canal Solar, 30/09/2024: ANEEL acionou a bandeira vermelha patamar 2 para outubro de 2024, com cobrança de R$ 7,877 a cada 100 kWh; fator: risco hidrológico (pouca chuva nos reservatórios).',
    url: 'https://canalsolar.com.br/aneel-anuncia-bandeira-vermelha-patamar-2-outubro/',
  },
  seca2024: {
    id: 'seca2024',
    titulo: 'INMET / SBT News — seca recorde no DF (2024)',
    detalhe: 'SBT News, 04/10/2024: Brasília chegou a 164 dias sem chuva, segundo o INMET, superando o recorde de 1963.',
    url: 'https://sbtnews.sbt.com.br/noticia/brasil/brasilia-chega-a-164-dias-sem-chuva-e-atinge-recorde-historico-de-seca',
  },
  umidade2024: {
    id: 'umidade2024',
    titulo: 'Metrópoles — umidade recorde no DF (2024)',
    detalhe: 'Metrópoles: em 3 de setembro de 2024, a estação de Ponte Alta (Gama) registrou umidade mínima do ar de 7%.',
    url: 'https://www.metropoles.com/distrito-federal/df-bate-novo-recorde-de-dia-mais-quente-do-ano-375c',
  },
  ben2025: {
    id: 'ben2025',
    titulo: 'EPE / MME — Balanço Energético Nacional 2025',
    detalhe: 'A matriz elétrica brasileira atingiu 88,2% de renovabilidade em 2024 (Relatório Síntese do BEN 2025), segundo reportagem da eixos.',
    url: 'https://eixos.com.br/energias-renovaveis/matriz-eletrica-fechou-2024-com-88-de-participacao-renovavel-mostra-balanco-da-epe/',
  },
};
