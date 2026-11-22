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
  // ----- Currículo: de onde vieram os conteúdos (caixinhas) -----
  'pe-fis': {
    id: 'pe-fis',
    titulo: 'SEE-PE: Organizador Curricular de Física (2026)',
    detalhe: 'PERNAMBUCO. Secretaria de Educação e Esportes. Organizador Curricular Trimestral da Formação Geral Básica: Física, Ensino Médio. Recife, jan. 2026.',
    url: 'https://portal.educacao.pe.gov.br/wp-content/uploads/2026/01/Fisica_Organizador-Curricular-Trimestral-da-FGB.pdf',
  },
  'ifpb-fis': {
    id: 'ifpb-fis',
    titulo: 'IFPB: Plano de Ensino de Física II (2º ano)',
    detalhe: 'INSTITUTO FEDERAL DA PARAÍBA. Plano de Ensino do componente Física II (2º ano do Ensino Médio Integrado).',
    url: 'https://estudante.ifpb.edu.br/media/cursos/154/disciplina/Plano_de_Ensino_-_F%C3%ADsica_II.pdf',
  },
  'pe-geo': {
    id: 'pe-geo',
    titulo: 'SEE-PE: Organizador Curricular de Geografia (2026)',
    detalhe: 'PERNAMBUCO. Secretaria de Educação e Esportes. Organizador Curricular Trimestral da Formação Geral Básica: Geografia, Ensino Médio. Recife, fev. 2026.',
    url: 'https://portal.educacao.pe.gov.br/wp-content/uploads/2026/02/Geografia-Organizador-Curricular-Trimestral-da-FGB_.pdf',
  },
  'ufpe-geo': {
    id: 'ufpe-geo',
    titulo: 'UFPE: tese sobre o currículo de Geografia do 2º ano',
    detalhe: 'BORGES FILHO, Emanuel Fernando de Andrade. Tese de doutorado. Recife: Universidade Federal de Pernambuco (UFPE).',
    url: 'https://attena.ufpe.br/bitstream/123456789/65572/1/TESE%20Emanuel%20Fernando%20De%20Andrade%20Borges%20Filho.pdf',
  },
  'pe-his': {
    id: 'pe-his',
    titulo: 'SEE-PE: Organizador Curricular de História',
    detalhe: 'PERNAMBUCO. Secretaria de Educação e Esportes. Organizador Curricular por Bimestre da Formação Geral Básica: História, Ensino Médio. Recife, 2023.',
    url: 'https://portal.educacao.pe.gov.br/wp-content/uploads/2023/08/Organizador_Curricular_FBG_Historia.pdf',
  },
  'se-his': {
    id: 'se-his',
    titulo: 'SEDUC-SE: Plano de Ensino de História (2º ano)',
    detalhe: 'SERGIPE. Secretaria de Estado da Educação. Planejamento anual e bimestral de História, 2º ano do Ensino Médio.',
    url: 'https://site.seduc.se.gov.br/redeEstadual/escolaDisciplinaDetalhes.asp?cdTurma=138350&cdComponente=430',
  },
  'pe-lp': {
    id: 'pe-lp',
    titulo: 'SEE-PE: Organizador Curricular de Língua Portuguesa (2026)',
    detalhe: 'PERNAMBUCO. Secretaria de Educação e Esportes. Organizador Curricular Trimestral da Formação Geral Básica: Língua Portuguesa, Ensino Médio. Recife, fev. 2026.',
    url: 'https://portal.educacao.pe.gov.br/wp-content/uploads/2026/02/Lingua-Portuguesa-Organizador-Curricular-Trimestral-da-FGB.pdf',
  },
  bncc: {
    id: 'bncc',
    titulo: 'BNCC: Ensino Médio (MEC)',
    detalhe: 'BRASIL. Ministério da Educação. Base Nacional Comum Curricular: Ensino Médio. Brasília: MEC, 2018. Fonte dos códigos de habilidade (EM13...).',
    url: 'https://www.gov.br/mec/pt-br/cne/arquivos/bncc_ensino_medio.pdf',
  },
  ldb: {
    id: 'ldb',
    titulo: 'LDB (Lei nº 9.394/1996)',
    detalhe: 'BRASIL. Lei de Diretrizes e Bases da Educação Nacional, texto compilado. O Art. 35-B (Lei nº 14.945/2024) pede metodologias investigativas no Ensino Médio.',
    url: 'https://www.planalto.gov.br/ccivil_03/leis/l9394compilado.htm',
  },
  seedf: {
    id: 'seedf',
    titulo: 'Calendário Escolar 2026: SEEDF',
    detalhe: 'DISTRITO FEDERAL. Secretaria de Educação. Calendário Escolar Anual 2026 da Rede Pública, Portaria nº 1.300, de 28/11/2025.',
    url: 'https://www.educacao.df.gov.br/calendario-escolar-rede-publica/',
  },
  // ----- Proposta do grupo e seus fundamentos -----
  grupo: {
    id: 'grupo',
    titulo: 'Proposta pedagógica do grupo',
    detalhe: 'Desenho do projeto criado pelo grupo para este trabalho de Didática Fundamental: uma revista por turma, núcleos editoriais de 5 estudantes com papéis, temas por núcleo e fases (problematização, teoria, escrita, fechamento e Mostra). Fundamentado em Freire (tema gerador), Fazenda (interdisciplinaridade) e Marcuschi (gêneros textuais).',
  },
  freire: {
    id: 'freire',
    titulo: 'Paulo Freire: Pedagogia da Autonomia',
    detalhe: 'FREIRE, Paulo. Pedagogia da autonomia: saberes necessários à prática educativa. Leitura de mundo, diálogo e tema gerador. Cópia no Repositório Institucional da UFPE.',
    url: 'https://repositorio.ufpe.br/bitstream/123456789/54579/2/freire-pedagogia-da-autonomia.pdf',
  },
  fazenda: {
    id: 'fazenda',
    titulo: 'Ivani Fazenda: Interdisciplinaridade',
    detalhe: 'FAZENDA, Ivani Catarina Arantes. Interdisciplinaridade: história, teoria e pesquisa. 18. ed. Campinas: Papirus, 2012. Livro impresso (sem link público).',
  },
  marcuschi: {
    id: 'marcuschi',
    titulo: 'Marcuschi: gêneros textuais',
    detalhe: 'MARCUSCHI, Luiz Antônio. Produção textual, análise de gêneros e compreensão. São Paulo: Parábola, 2008. Livro impresso (sem link público).',
  },
  revistas: {
    id: 'revistas',
    titulo: 'Revistas de divulgação científica',
    detalhe: 'Exemplos reais para análise em sala: Revista Pesquisa FAPESP e Ciência Hoje (sites abertos).',
    url: 'https://revistapesquisa.fapesp.br/',
  },
  // ----- Metodologias -----
  metativas: {
    id: 'metativas',
    titulo: 'SciELO: Metodologias ativas (Educação em Revista)',
    detalhe: 'Metodologias ativas: em busca de uma caracterização e definição. Educação em Revista, Belo Horizonte, v. 40, e39442, 2024.',
    url: 'https://www.scielo.br/j/edur/a/cSQY74VPYPJCvNLQdv4HZYn/?lang=pt',
  },
  moran: {
    id: 'moran',
    titulo: 'José Moran (ECA-USP): Metodologias ativas',
    detalhe: 'MORAN, José. Metodologias ativas para uma aprendizagem mais profunda. São Paulo: ECA-USP. Projetos, problemas, sala invertida, rotação por estações e estudo de caso.',
    url: 'https://moran.eca.usp.br/wp-content/uploads/2013/12/metodologias_moran1.pdf',
  },
  gasparin: {
    id: 'gasparin',
    titulo: 'SciELO: Método Gaspariano (Pedagogia Histórico-Crítica)',
    detalhe: 'WAGNER, Valdilene; GASPARIN, João Luiz. O método Gaspariano como perspectiva crítica de qualificação didática. Revista Brasileira de Educação, v. 27, e270080, 2022.',
    url: 'https://www.scielo.br/j/rbedu/a/DM3sJtGnrtxXSr6xzzNxFMy/?lang=pt',
  },
  mazur: {
    id: 'mazur',
    titulo: 'SciELO: Peer Instruction no ensino de Física (RBEF)',
    detalhe: 'Uma revisão da literatura acerca da implementação da metodologia Peer Instruction. Revista Brasileira de Ensino de Física.',
    url: 'https://www.scielo.br/j/rbef/a/Vv8MmjJWmm5B3HjJ8hYwKCJ/?lang=pt',
  },
  gamificacao: {
    id: 'gamificacao',
    titulo: 'SciELO: Gamificação no ensino de Física (RBEF)',
    detalhe: 'Gamificação como estratégia de aprendizagem ativa no ensino de Física. Revista Brasileira de Ensino de Física.',
    url: 'https://www.scielo.br/j/rbef/a/Tx3KQcf5G9PvcgQB4vswPbq/?lang=pt',
  },
  // ----- Avaliação -----
  avaliacao: {
    id: 'avaliacao',
    titulo: 'SciELO: Avaliação em Luckesi, Perrenoud e Hoffmann',
    detalhe: 'Revisão sobre avaliação da aprendizagem a partir de Luckesi, Perrenoud e Hoffmann. Ensaio: Pesquisa em Educação em Ciências.',
    url: 'https://www.scielo.br/j/epec/a/tMx689rT8F6Gkv8r95DKKwj/?format=pdf&lang=pt',
  },
  duasfases: {
    id: 'duasfases',
    titulo: 'SciELO: Teste em duas fases e portfólio',
    detalhe: 'A articulação entre a avaliação somativa e a formativa, na prática (teste em duas fases). Ensaio: Avaliação e Políticas Públicas em Educação.',
    url: 'https://www.scielo.br/j/ensaio/a/ZyzxQhwSHR8FQTSxy8JNczk/?lang=pt',
  },
  portfolio: {
    id: 'portfolio',
    titulo: 'SciELO: Portfólios na avaliação',
    detalhe: 'Metodologias ativas e portfólios avaliativos: revisão sistemática integrativa. Educação em Revista.',
    url: 'https://www.scielo.br/j/edur/a/HsS3KwtYmpFjWXn6qV9gcsj/?lang=pt',
  },
  // ----- Dados da atualidade -----
  aneel: {
    id: 'aneel',
    titulo: 'Canal Solar: bandeira vermelha patamar 2 (ANEEL)',
    detalhe: 'Canal Solar, 30/09/2024: a ANEEL acionou a bandeira vermelha patamar 2 para outubro de 2024, com cobrança de R$ 7,877 a cada 100 kWh; fator: risco hidrológico (pouca chuva nos reservatórios).',
    url: 'https://canalsolar.com.br/aneel-anuncia-bandeira-vermelha-patamar-2-outubro/',
  },
  seca2024: {
    id: 'seca2024',
    titulo: 'SBT News / INMET: seca recorde no DF (2024)',
    detalhe: 'SBT News, 04/10/2024: Brasília chegou a 164 dias sem chuva, segundo o INMET, superando o recorde de 1963.',
    url: 'https://sbtnews.sbt.com.br/noticia/brasil/brasilia-chega-a-164-dias-sem-chuva-e-atinge-recorde-historico-de-seca',
  },
  umidade2024: {
    id: 'umidade2024',
    titulo: 'Metrópoles: umidade recorde no DF (2024)',
    detalhe: 'Metrópoles: em 3 de setembro de 2024, a estação de Ponte Alta (Gama) registrou umidade mínima do ar de 7%.',
    url: 'https://www.metropoles.com/distrito-federal/df-bate-novo-recorde-de-dia-mais-quente-do-ano-375c',
  },
  ben2025: {
    id: 'ben2025',
    titulo: 'eixos / EPE: Balanço Energético Nacional 2025',
    detalhe: 'A matriz elétrica brasileira atingiu 88,2% de renovabilidade em 2024 (Relatório Síntese do BEN 2025, MME/EPE), segundo reportagem da eixos.',
    url: 'https://eixos.com.br/energias-renovaveis/matriz-eletrica-fechou-2024-com-88-de-participacao-renovavel-mostra-balanco-da-epe/',
  },
};

/** Fontes do currículo de cada disciplina (substituem o antigo "guia"). */
export const FONTES_CURRICULO: Record<DiscId, string[]> = {
  fis: ['pe-fis', 'ifpb-fis', 'bncc'],
  geo: ['pe-geo', 'ufpe-geo', 'bncc'],
  his: ['pe-his', 'se-his', 'bncc'],
  red: ['pe-lp', 'bncc'],
  gl: ['pe-lp', 'bncc'],
};

/** Troca os apelidos internos ('guia', 'projeto', 'luckesi') pelas fontes reais. */
export function expandirFontes(ids: string[], d?: DiscId): string[] {
  const out: string[] = [];
  for (const id of ids) {
    if (id === 'guia') out.push(...(d ? FONTES_CURRICULO[d] : ['bncc']));
    else if (id === 'projeto') out.push('grupo', 'freire', 'fazenda');
    else if (id === 'luckesi') out.push('avaliacao');
    else out.push(id);
  }
  return [...new Set(out)].filter((x) => FONTES[x]);
}
