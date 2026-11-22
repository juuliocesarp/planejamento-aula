import { useStore } from '../store/store';
import { SUG_DISC, SUG_PROJETO } from '../data/sugestoes';
import { disc } from '../data/base';
import { Votacao } from '../components/Votacao';
import { VerSugestao } from '../components/ui';

export function Objetivos() {
  const s = useStore();
  const d = s.minhaDisc!;
  const doc = s.discs[d];
  const sug = SUG_DISC[d];
  const set = (fn: (x: typeof doc) => typeof doc) => s.atualizarDisc(d, fn);

  return (
    <>
      <div className="page-head">
        <h1>Objetivos</h1>
        <p>Duas camadas: os objetivos do projeto inteiro, decididos por votação entre os 5, e os objetivos da sua disciplina, que só você edita.</p>
      </div>

      <Votacao
        campo="objetivos"
        titulo="Objetivos do projeto (geral e específicos)"
        sugestao={{ texto: 'Objetivo geral\n' + SUG_PROJETO.objetivoGeral.texto + '\n\nObjetivos específicos\n' + SUG_PROJETO.objetivosEspecificos.texto, fontes: SUG_PROJETO.objetivoGeral.fontes }}
      />

      <section className="card">
        <h2>Objetivos de {disc(d).nome}</h2>
        <p className="small muted">Lembrete: o objetivo geral diz o que a disciplina quer alcançar no projeto; os específicos dizem o que os alunos vão conseguir fazer, inclusive além do conteúdo (pesquisar, trabalhar em equipe, criticar fontes).</p>
        <label className="field">
          <span>Objetivo geral da disciplina</span>
          <textarea className="textarea" value={doc.objetivoGeral.valor} onChange={(e) => set((x) => ({ ...x, objetivoGeral: { valor: e.target.value, origem: x.objetivoGeral.origem === 'ia' ? 'editado' : x.objetivoGeral.origem } }))} />
        </label>
        <div style={{ margin: '0.5rem 0 1rem' }}>
          <VerSugestao texto={sug.objetivoGeral} fontes={sug.fontes} onUsar={(t) => set((x) => ({ ...x, objetivoGeral: { valor: t, origem: 'ia' } }))} />
        </div>

        <div className="field">
          <span>Objetivos específicos</span>
          <div className="stack">
            {doc.objetivosEspecificos.map((o, i) => (
              <div key={i} className="row" style={{ flexWrap: 'nowrap' }}>
                <span className="num muted">{i + 1}.</span>
                <input
                  className="input"
                  value={o}
                  onChange={(e) => set((x) => ({ ...x, objetivosEspecificos: x.objetivosEspecificos.map((y, j) => (j === i ? e.target.value : y)) }))}
                />
                <button className="btn sm ghost" aria-label={`Remover objetivo ${i + 1}`} onClick={() => set((x) => ({ ...x, objetivosEspecificos: x.objetivosEspecificos.filter((_, j) => j !== i) }))}>
                  ✕
                </button>
              </div>
            ))}
            <div className="row">
              <button className="btn sm" onClick={() => set((x) => ({ ...x, objetivosEspecificos: [...x.objetivosEspecificos, ''] }))}>
                + Adicionar objetivo
              </button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '0.6rem' }}>
          <VerSugestao texto={sug.objetivosEspecificos} fontes={sug.fontes} onUsar={(t) => set((x) => ({ ...x, objetivosEspecificos: t.split('\n') }))} />
        </div>
      </section>
    </>
  );
}
