import type { Momento, Placement } from '../data/tipos';
import type { PerfilId } from '../data/base';

export type Origem = 'ia' | 'editado' | 'manual';
export type Modo = 'referencia' | 'projeto' | 'vazio';

export interface AulaEstado {
  titulo: string;
  metodologia: string;
  momentos: Momento[];
  duracao: number;
  caixinhas: string[];
  dica?: string;
  fontes: string[];
  origem: Origem;
}

export interface ItemAvaliacao {
  id: string;
  forma: string;
  nome: string;
  pontos: number;
  caixinhas: string[];
  semConteudo: boolean;
  origem: Origem;
}

export interface Criterio {
  id: string;
  texto: string;
  pontos: number;
}

export interface Texto {
  valor: string;
  origem: Origem;
}

export interface DiscDoc {
  modo: Modo | null;
  placements: Record<string, Placement>;
  aulas: Record<string, AulaEstado>; // chave "bim-sem-n"
  aulasSemana: number;
  avaliacao: Record<string, ItemAvaliacao[]>; // chave = bimestre
  rubrica: Criterio[];
  objetivoGeral: Texto;
  objetivosEspecificos: string[];
  justificativa: Texto;
  produto: Texto;
  recorte: number[]; // bimestres
}

export interface ProjetoDoc {
  justificativa: Texto & { por?: string; em?: string };
  objetivos: Texto & { por?: string; em?: string };
  unificada: { justificativa: string; objetivos: string };
}

export interface FrentesDoc {
  red?: PerfilId;
  gl?: PerfilId;
}

export const novoDisc = (): DiscDoc => ({
  modo: null,
  placements: {},
  aulas: {},
  aulasSemana: 2,
  avaliacao: {},
  rubrica: [],
  objetivoGeral: { valor: '', origem: 'manual' },
  objetivosEspecificos: [],
  justificativa: { valor: '', origem: 'manual' },
  produto: { valor: '', origem: 'manual' },
  recorte: [3],
});

export const novoProjeto = (): ProjetoDoc => ({
  justificativa: { valor: '', origem: 'manual' },
  objetivos: { valor: '', origem: 'manual' },
  unificada: { justificativa: '', objetivos: '' },
});

export type CampoVoto = 'justificativa' | 'objetivos';

export interface PropostaOutro {
  id: string;
  texto: string;
}

export interface Resultado {
  liberado: boolean;
  votos: number;
  contagem: { id: string; texto: string; votos: number }[];
}
