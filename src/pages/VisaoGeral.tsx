import { useState } from 'react';
import { DISCIPLINAS, PERFIS, disc } from '../data/base';
import { BIMESTRES, SEMANAS, fmt } from '../data/calendario';
import { caixinha } from '../data/caixinhas';
import { FASES } from '../data/aulas3bim';
import type { DiscId } from '../data/tipos';
import { aulaAtual, caixinhasNaSemana, useStore } from '../store/store';
import { DiscTag } from '../components/ui';
import { AulaEditor } from '../components/AulaEditor';
import { ListaSemanas } from './Conteudos';

export function VisaoGeral() {
  const s = useStore();
  const [bim, setBim] = useState(3);
  const [entrar, setEntrar] = useState<DiscId | null>(null);
  const [aula, setAula] = useState<{ d: DiscId; bim: number; sem: number; n: number } | null>(null);
  const semanas = SEMANAS[bim];
  const dono = (d: DiscId) => {
    const p = PERFIS.find((x) => x.disc === d) ?? PERFIS.find((x) => s.frentes[d as 'red' | 'gl'] === x.id);
    return p?.nome ?? 'a definir';
  };

  return (
    <>
      <div className="page-head">
        <h1>Visão geral do projeto</h1>
        <p>As cinco disciplinas lado a lado, semana a semana. Toque numa caixinha para ver as aulas daquela disciplina (somente leitura) ou entre no calendário de um colega.</p>
      </div>
      <div className="bim-tabs">
        {BIMESTRES.map((b) => (
          <button key={b.n} className="bim-tab" aria-pressed={bim === b.n} onClick={() => setBim(b.n)}>
            {b.n}º bimestre
            <small>
              {fmt(b.inicio)} a {fmt(b.fim)}
            </small>
          </button>
        ))}
      </div>
      {bim === 3 && (
        <div className="fases" style={{ maxWidth: '100%' }}>
          {FASES.map((f) => (
            <span key={f.nome} className={'fase ' + f.cor} style={{ flex: f.semanas[1] - f.semanas[0] + 1 }}>
              {f.nome}
            </span>
          ))}
        </div>
      )}
      <div className="card grade">
        <table>
          <thead>
            <tr>
              <th>Disciplina</th>
              {semanas.map((w) => (
                <th key={w.n}>
                  Sem. {w.n}
                  <br />
                  <span className="muted" style={{ fontWeight: 400 }}>
                    {fmt(w.inicio)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DISCIPLINAS.map((x) => {
              const doc = s.discs[x.id];
              return (
                <tr key={x.id}>
                  <th>
                    <DiscTag d={x.id} curto />
                    <br />
                    <span className="small muted">{dono(x.id)}</span>
                    <br />
                    <button className="btn sm" style={{ marginTop: '0.3rem' }} onClick={() => setEntrar(x.id)}>
                      Entrar
                    </button>
                  </th>
                  {semanas.map((w) => {
                    const cxs = caixinhasNaSemana(doc, bim, w.n);
                    return (
                      <td key={w.n}>
                        {!doc.modo && <span className="small muted">—</span>}
                        {cxs.map(({ id, inicio }) => (
                          <button
                            key={id}
                            className="cx"
                            style={{ ['--c' as string]: `var(${disc(x.id).cor})`, marginBottom: '0.25rem' }}
                            onClick={() => setAula({ d: x.id, bim, sem: w.n, n: 1 })}
                            title={aulaAtual(x.id, doc, bim, w.n, 1).titulo}
                          >
                            <strong style={{ fontSize: '0.78rem' }}>{caixinha(id)!.titulo}</strong>
                            {!inicio && <span className="meta">continuação</span>}
                          </button>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {entrar && (
        <section style={{ marginTop: '1.5rem' }}>
          <div className="row">
            <h2 style={{ margin: 0 }}>
              <DiscTag d={entrar} /> · {bim}º bimestre (leitura)
            </h2>
            <span className="spacer" />
            <button className="btn sm" onClick={() => setEntrar(null)}>
              Fechar
            </button>
          </div>
          {s.discs[entrar].modo ? (
            <ListaSemanas d={entrar} doc={s.discs[entrar]} bim={bim} sobrepor={[]} onAula={(sem, n) => setAula({ d: entrar, bim, sem, n })} />
          ) : (
            <p className="muted">{disc(entrar).nome} ainda não começou o calendário.</p>
          )}
        </section>
      )}
      {aula && <AulaEditor {...aula} somenteLeitura={aula.d !== s.minhaDisc} onFechar={() => setAula(null)} />}
    </>
  );
}
