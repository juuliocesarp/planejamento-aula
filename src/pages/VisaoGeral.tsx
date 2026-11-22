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
import type { PedidoDoc } from './Documento';
import { itensDisciplina, itensProjeto, percentual } from '../store/progresso';

export function VisaoGeral({ onGerar }: { onGerar: (p: PedidoDoc) => void }) {
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
      <ProgressoProjeto onGerar={onGerar} dono={dono} />

      <h2 style={{ marginTop: '1.5rem' }}>Calendário das cinco disciplinas</h2>
      <div className="bim-tabs">
        {BIMESTRES.map((b) => (
          <button key={b.n} className={'bim-tab' + (b.n === 3 ? ' bim-projeto' : ' bim-fora')} aria-pressed={bim === b.n} onClick={() => setBim(b.n)}>
            <span className="row" style={{ gap: '0.4rem' }}>
              {b.n}º bimestre {b.n === 3 && <span className="selo-bim">Projeto</span>}
            </span>
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

function ProgressoProjeto({ onGerar, dono }: { onGerar: (p: PedidoDoc) => void; dono: (d: DiscId) => string }) {
  const s = useStore();
  const [aberto, setAberto] = useState<DiscId | 'projeto' | null>(null);
  const linhas = DISCIPLINAS.map((x) => ({ id: x.id as DiscId | 'projeto', nome: x.nome, quem: dono(x.id), itens: itensDisciplina(x.id, s.discs[x.id]) }));
  linhas.push({ id: 'projeto', nome: 'Textos do projeto (votação)', quem: 'todos', itens: itensProjeto(s.projeto) });
  const total = Math.round(linhas.reduce((t, l) => t + percentual(l.itens), 0) / linhas.length);
  const pronto = linhas.every((l) => percentual(l.itens) === 100);
  const pedido: PedidoDoc = { tipo: 'projeto', disc: s.minhaDisc!, modo: 'bimestres', bims: [3], meses: [], bim: 3, de: 1, ate: SEMANAS[3].length };
  return (
    <section className="card">
      <div className="row">
        <h2 style={{ margin: 0 }}>Documento do projeto integrado</h2>
        <span className="spacer" />
        <span className="num">{total}% do trabalho</span>
      </div>
      <p className="small muted" style={{ maxWidth: '75ch' }}>
        Junta as cinco disciplinas, a linha do tempo do 3º bimestre e o roteiro de apresentação para montar os slides. Ele é liberado quando todas as barras chegarem a 100%. Depois, qualquer pessoa do
        grupo pode baixar.
      </p>
      <div className="progresso-lista">
        {linhas.map((l) => {
          const pct = percentual(l.itens);
          return (
            <div key={l.id} className="progresso-linha">
              <button className="progresso-cab" onClick={() => setAberto(aberto === l.id ? null : l.id)} aria-expanded={aberto === l.id}>
                <span className="progresso-nome">{l.id === 'projeto' ? <strong>{l.nome}</strong> : <DiscTag d={l.id} />}</span>
                <span className="small muted">{l.quem}</span>
                <span className="barra progresso-barra" aria-hidden>
                  <i style={{ width: pct + '%' }} />
                </span>
                <span className="num small">{pct}%</span>
              </button>
              {aberto === l.id && (
                <ul className="checklist">
                  {l.itens.map((x) => (
                    <li key={x.texto} className={x.feito >= 1 ? 'ok' : 'falta'}>
                      <span aria-hidden className="check-ico">
                        {x.feito >= 1 ? '✓' : '○'}
                      </span>
                      <span>{x.texto}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <div className="row" style={{ marginTop: '0.9rem' }}>
        <button className="btn primary" disabled={!pronto} onClick={() => onGerar(pedido)}>
          {pronto ? 'Baixar documento do projeto' : 'Documento liberado quando todos chegarem a 100%'}
        </button>
        {!pronto && (
          <button className="btn sm ghost" onClick={() => onGerar(pedido)} title="Abre o documento com as partes que faltam marcadas como não preenchidas">
            Ver prévia com pendências
          </button>
        )}
      </div>
    </section>
  );
}
