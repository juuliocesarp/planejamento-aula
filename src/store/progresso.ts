import type { DiscId } from '../data/tipos';
import { SEMANAS } from '../data/calendario';
import { aulaAtual, aulaVazia } from './store';
import type { DiscDoc, ProjetoDoc } from './tipos';

export interface Item {
  texto: string;
  etapa: string;
  feito: number; // 0 a 1
}

/** O que falta em uma disciplina para o plano dela ficar completo (foco no 3º bimestre). */
export function itensDisciplina(d: DiscId, doc: DiscDoc): Item[] {
  let aulasFeitas = 0;
  let aulasTotal = 0;
  if (doc.modo)
    for (const w of SEMANAS[3])
      for (let n = 1; n <= doc.aulasSemana; n++) {
        aulasTotal++;
        if (!aulaVazia(aulaAtual(d, doc, 3, w.n, n))) aulasFeitas++;
      }
  const pontos = (doc.avaliacao[3] ?? []).reduce((t, i) => t + i.pontos, 0);
  return [
    { texto: 'Ponto de partida do calendário escolhido', etapa: 'recorte', feito: doc.modo ? 1 : 0 },
    { texto: 'Objetivo geral da disciplina', etapa: 'objetivos', feito: doc.objetivoGeral.valor.trim() ? 1 : 0 },
    { texto: 'Objetivos específicos da disciplina', etapa: 'objetivos', feito: doc.objetivosEspecificos.some((x) => x.trim()) ? 1 : 0 },
    { texto: `Aulas do 3º bimestre planejadas (${aulasFeitas} de ${aulasTotal || '—'})`, etapa: 'conteudos', feito: aulasTotal ? aulasFeitas / aulasTotal : 0 },
    { texto: `Avaliação do 3º bimestre somando 10 pontos (está em ${String(pontos).replace('.', ',')})`, etapa: 'avaliacao', feito: pontos === 10 ? 1 : Math.min(0.99, pontos / 10) },
    { texto: 'Justificativa da disciplina', etapa: 'justificativa', feito: doc.justificativa.valor.trim() ? 1 : 0 },
    { texto: 'Produto final da disciplina na revista', etapa: 'justificativa', feito: doc.produto.valor.trim() ? 1 : 0 },
  ];
}

export function itensProjeto(p: ProjetoDoc): Item[] {
  return [
    { texto: 'Objetivos do projeto (texto oficial da votação)', etapa: 'objetivos', feito: p.objetivos.valor.trim() ? 1 : 0 },
    { texto: 'Justificativa do projeto (texto oficial da votação)', etapa: 'justificativa', feito: p.justificativa.valor.trim() ? 1 : 0 },
  ];
}

export const percentual = (itens: Item[]) => (itens.length ? Math.round((itens.reduce((t, i) => t + i.feito, 0) / itens.length) * 100) : 0);
