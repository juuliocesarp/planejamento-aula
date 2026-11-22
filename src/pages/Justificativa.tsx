import { useStore } from '../store/store';
import { SUG_DISC, SUG_PROJETO } from '../data/sugestoes';
import { disc } from '../data/base';
import { Votacao } from '../components/Votacao';
import { VerSugestao } from '../components/ui';

export function Justificativa() {
  const s = useStore();
  const d = s.minhaDisc!;
  const doc = s.discs[d];
  const sug = SUG_DISC[d];
  return (
    <>
      <div className="page-head">
        <h1>Justificativa</h1>
        <p>Problematize o tema, apresente a questão a ser investigada e descreva a necessidade do projeto. A justificativa do projeto é votada; a da disciplina é sua.</p>
      </div>
      <Votacao campo="justificativa" titulo="Justificativa do projeto" sugestao={SUG_PROJETO.justificativa} />
      <section className="card">
        <h2>Como {disc(d).nome} contribui para a revista</h2>
        <label className="field">
          <span>Justificativa da disciplina</span>
          <textarea
            className="textarea"
            style={{ minHeight: '10rem' }}
            value={doc.justificativa.valor}
            onChange={(e) => s.atualizarDisc(d, (x) => ({ ...x, justificativa: { valor: e.target.value, origem: x.justificativa.origem === 'ia' ? 'editado' : x.justificativa.origem } }))}
          />
        </label>
        <div style={{ marginTop: '0.5rem' }}>
          <VerSugestao texto={sug.justificativa} fontes={sug.fontes} onUsar={(t) => s.atualizarDisc(d, (x) => ({ ...x, justificativa: { valor: t, origem: 'ia' } }))} />
        </div>
        <label className="field" style={{ marginTop: '1.2rem' }}>
          <span>Produto final da disciplina na revista</span>
          <textarea
            className="textarea"
            value={doc.produto.valor}
            onChange={(e) => s.atualizarDisc(d, (x) => ({ ...x, produto: { valor: e.target.value, origem: x.produto.origem === 'ia' ? 'editado' : x.produto.origem } }))}
          />
        </label>
        <div style={{ marginTop: '0.5rem' }}>
          <VerSugestao texto={sug.produto} fontes={sug.fontes} onUsar={(t) => s.atualizarDisc(d, (x) => ({ ...x, produto: { valor: t, origem: 'ia' } }))} />
        </div>
      </section>
    </>
  );
}
