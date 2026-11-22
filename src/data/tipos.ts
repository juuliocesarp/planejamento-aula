export type DiscId = 'fis' | 'geo' | 'his' | 'red' | 'gl';

export interface Disciplina {
  id: DiscId;
  nome: string;
  curto: string;
  area: string;
  icone: string;
  cor: string; // nome da variável CSS
}

export interface Fonte {
  id: string;
  titulo: string;
  detalhe: string;
  url?: string;
}

export interface Caixinha {
  id: string;
  disc: DiscId;
  /** semana do ano no guia de referência (1–40); 0 para caixinhas criadas para o projeto */
  semanaGuia: number;
  semanasGuia: number;
  eixo: string;
  titulo: string;
  subtemas: string[];
  foco: string;
  bncc: string[];
  revista?: string; // por que alimenta a revista
  projeto?: boolean; // caixinha própria do projeto (não está no guia)
  fonte: string; // id da fonte
}

export interface Momento {
  titulo: string;
  desc: string;
  min: number;
  espaco: string;
  recursos: string[];
}

export interface AulaPronta {
  titulo: string;
  caixinha: string;
  metodologia: string;
  momentos: Momento[];
  dica?: string; // sugestão freireana / ponte com a realidade
  fontes: string[];
}

export interface Metodologia {
  id: string;
  nome: string;
  matriz: string;
  resumo: string;
  fonte: string;
  momentos: Momento[];
}

export interface FormaAvaliacao {
  id: string;
  nome: string;
  definicao: string;
  pros: string;
  contras: string;
  semConteudo?: boolean;
}

export interface Placement {
  bim: number;
  sem: number; // semana dentro do bimestre (1..n)
  semanas: number;
}
