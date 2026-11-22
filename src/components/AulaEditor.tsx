import { useState } from 'react';
import type { DiscId, Momento } from '../data/tipos';
import { caixinha } from '../data/caixinhas';
import { ESPACOS, METODOLOGIAS, RECURSOS, metodologia } from '../data/metodologias';
import { SEMANAS, fmt } from '../data/calendario';
import { disc } from '../data/base';
import { aulaAtual, aulaChave, aulaPronta, caixinhasNaSemana, useStore } from '../store/store';
import type { AulaEstado } from '../store/tipos';
import { Barra, DiscTag, Fontes, Modal, SeloOrigem } from './ui';

export function AulaEditor({ d, bim, sem, n, somenteLeitura, onFechar }: { d: DiscId; bim: number; sem: number; n: number; somenteLeitura?: boolean; onFechar: () => void }) {
  const s = useStore();
  const doc = s.discs[d];
  const a = aulaAtual(d, doc, bim, sem, n);
  const pronta = aulaPronta(d, doc, bim, sem, n);
  const [trocar, setTrocar] = useState<string | null>(null);
  const [limpar, setLimpar] = useState(false);
  const w = SEMANAS[bim][sem - 1];
  const daSemana = caixinhasNaSemana(doc, bim, sem).map((c) => c.id);
  const opcoesCx = [...new Set([...daSemana, ...a.caixinhas])];
  const total = a.momentos.reduce((t, m) => t + (Number(m.min) || 0), 0);
  const ro = !!somenteLeitura;

  const salvar = (fn: (x: AulaEstado) => AulaEstado) =>
    s.atualizarDisc(d, (x) => {
      const atual = aulaAtual(d, x, bim, sem, n);
      const novo = fn(atual);
      const origem = atual.origem === 'ia' || atual.origem === 'editado' ? 'editado' : 'manual';
      return { ...x, aulas: { ...x.aulas, [aulaChave(bim, sem, n)]: { ...novo, origem } } };
    });
  const setMomento = (i: number, m: Partial<Momento>) => salvar((x) => ({ ...x, momentos: x.momentos.map((y, j) => (j === i ? { ...y, ...m } : y)) }));

  const aplicarMetodologia = (id: string) => {
    const met = metodologia(id);
    s.atualizarDisc(d, (x) => {
      const atual = aulaAtual(d, x, bim, sem, n);
      const momentos = met ? met.momentos.map((m) => ({ ...m, recursos: [...m.recursos] })) : [];
      const novo: AulaEstado = {
        ...atual,
        metodologia: id,
        momentos,
        fontes: met ? [...new Set([...atual.fontes.filter((f) => f !== 'guia'), met.fonte])] : atual.fontes,
        origem: atual.origem === 'manual' && met ? 'ia' : 'editado',
      };
      return { ...x, aulas: { ...x.aulas, [aulaChave(bim, sem, n)]: novo } };
    });
    setTrocar(null);
  };

  const met = metodologia(a.metodologia);

  return (
    <Modal titulo="Aula" onFechar={onFechar}>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <DiscTag d={d} />
          <p className="small muted" style={{ margin: 0 }}>
            {bim}º bimestre · Semana {sem} ({fmt(w.inicio)} a {fmt(w.fim)}) · Aula {n}
          </p>
        </div>
        <span className="spacer" />
        <SeloOrigem origem={a.origem} />
        <button className="btn sm ghost" onClick={onFechar} aria-label="Fechar">
          ✕
        </button>
      </div>
      {ro && <p className="alerta" style={{ marginTop: '0.6rem' }}>Somente leitura: esta aula é de {disc(d).nome}.</p>}

      <div className="stack" style={{ marginTop: '0.9rem' }}>
        <label className="field">
          <span>Tema da aula</span>
          <input className="input" value={a.titulo} readOnly={ro} onChange={(e) => salvar((x) => ({ ...x, titulo: e.target.value }))} placeholder="Ex.: A máquina de Watt e o rendimento" />
        </label>

        <div className="field">
          <span>Conteúdos (caixinhas)</span>
          <div className="row">
            {opcoesCx.length === 0 && <span className="small muted">Nenhuma caixinha nesta semana. Posicione uma no calendário.</span>}
            {opcoesCx.map((id) => {
              const c = caixinha(id);
              if (!c) return null;
              const on = a.caixinhas.includes(id);
              return (
                <label key={id} className="chip" style={{ cursor: ro ? 'default' : 'pointer' }}>
                  <input type="checkbox" disabled={ro} checked={on} onChange={() => salvar((x) => ({ ...x, caixinhas: on ? x.caixinhas.filter((y) => y !== id) : [...x.caixinhas, id] }))} />
                  {c.titulo}
                </label>
              );
            })}
          </div>
          {a.caixinhas.map((id) => {
            const c = caixinha(id);
            return c ? (
              <p key={id} className="small muted" style={{ margin: 0 }}>
                <strong>{c.titulo}:</strong> {c.subtemas.join(' · ')}
                {c.bncc.length ? ` (BNCC: ${c.bncc.join(', ')})` : ''}
              </p>
            ) : null;
          })}
        </div>

        <div className="grid2">
          <label className="field">
            <span>Metodologia</span>
            <select className="select" disabled={ro} value={a.metodologia} onChange={(e) => (a.momentos.length ? setTrocar(e.target.value) : aplicarMetodologia(e.target.value))}>
              <option value="">Escolha uma metodologia</option>
              {METODOLOGIAS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </label>
          <div className="field">
            <span>Duração</span>
            <div className="seg">
              {[50, 100].map((v) => (
                <button key={v} disabled={ro} aria-pressed={a.duracao === v} onClick={() => salvar((x) => ({ ...x, duracao: v }))}>
                  {v === 50 ? 'Aula simples · 50 min' : 'Aula dupla · 100 min'}
                </button>
              ))}
            </div>
          </div>
        </div>
        {met && (
          <p className="small muted" style={{ margin: 0 }}>
            {met.resumo} <Fontes ids={[met.fonte]} disc={d} />
          </p>
        )}
        {trocar && (
          <div className="alerta row" role="alert">
            <span>Trocar a metodologia substitui os momentos atuais pelo modelo de "{metodologia(trocar)?.nome}". Continuar?</span>
            <button className="btn sm primary" onClick={() => aplicarMetodologia(trocar)}>
              Trocar
            </button>
            <button className="btn sm" onClick={() => setTrocar(null)}>
              Manter os momentos
            </button>
          </div>
        )}

        {a.dica && (
          <div className="ia-box">
            <span className="ia-badge">Sugestão da IA</span>
            <p style={{ margin: '0.4rem 0' }}>{a.dica}</p>
          </div>
        )}

        <div className="field">
          <span>Momentos da aula</span>
          <Barra valor={total} max={a.duracao} rotulo="Tempo dos momentos" />
          <div className="stack" style={{ marginTop: '0.5rem' }}>
            {a.momentos.map((m, i) => (
              <div key={i} className={'momento' + (a.origem === 'ia' ? ' ia' : '')}>
                <div className="momento-top">
                  <input className="input" aria-label="Nome do momento" readOnly={ro} value={m.titulo} onChange={(e) => setMomento(i, { titulo: e.target.value })} />
                  <label className="row small" style={{ flexWrap: 'nowrap', gap: '0.3rem' }}>
                    <input className="input num" type="number" min={0} aria-label="Minutos" readOnly={ro} value={m.min} onChange={(e) => setMomento(i, { min: Number(e.target.value) })} />
                    min
                  </label>
                  {!ro && (
                    <span className="row" style={{ gap: 0 }}>
                      <button className="btn sm ghost" aria-label="Subir momento" disabled={i === 0} onClick={() => salvar((x) => ({ ...x, momentos: troca(x.momentos, i, i - 1) }))}>
                        ↑
                      </button>
                      <button className="btn sm ghost" aria-label="Remover momento" onClick={() => salvar((x) => ({ ...x, momentos: x.momentos.filter((_, j) => j !== i) }))}>
                        ✕
                      </button>
                    </span>
                  )}
                </div>
                <textarea className="textarea" style={{ minHeight: '4.5rem' }} aria-label="Descrição" readOnly={ro} value={m.desc} onChange={(e) => setMomento(i, { desc: e.target.value })} />
                <div className="grid2" style={{ gap: '0.5rem' }}>
                  <label className="field">
                    <span className="small">Espaço</span>
                    <select className="select" disabled={ro} value={m.espaco} onChange={(e) => setMomento(i, { espaco: e.target.value })}>
                      {[...new Set([m.espaco, ...ESPACOS])].map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </label>
                  <div className="field">
                    <span className="small">Recursos</span>
                    <div className="row" style={{ gap: '0.3rem' }}>
                      {m.recursos.map((r) => (
                        <span key={r} className="chip">
                          {r}
                          {!ro && (
                            <button aria-label={`Remover ${r}`} onClick={() => setMomento(i, { recursos: m.recursos.filter((x) => x !== r) })}>
                              ✕
                            </button>
                          )}
                        </span>
                      ))}
                      {!ro && (
                        <select className="select" style={{ width: 'auto' }} value="" aria-label="Adicionar recurso" onChange={(e) => e.target.value && setMomento(i, { recursos: [...m.recursos, e.target.value] })}>
                          <option value="">+ recurso</option>
                          {RECURSOS.filter((r) => !m.recursos.includes(r)).map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!ro && (
              <div>
                <button className="btn sm" onClick={() => salvar((x) => ({ ...x, momentos: [...x.momentos, { titulo: 'Novo momento', desc: '', min: 10, espaco: 'Sala de aula', recursos: [] }] }))}>
                  + Adicionar momento
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <Fontes ids={[...a.fontes, ...a.caixinhas.map((c) => caixinha(c)?.fonte ?? '')]} disc={d} />
          <span className="spacer" />
          {!ro && pronta && a.origem !== 'ia' && (
            <button
              className="btn sm ia"
              onClick={() =>
                s.atualizarDisc(d, (x) => {
                  const aulas = { ...x.aulas };
                  delete aulas[aulaChave(bim, sem, n)];
                  return { ...x, aulas };
                })
              }
            >
              ✦ Voltar à sugestão original
            </button>
          )}
          {!ro && (
            <button
              className="btn sm ghost perigo"
              onClick={() => {
                if (!limpar) return setLimpar(true);
                s.atualizarDisc(d, (x) => ({ ...x, aulas: { ...x.aulas, [aulaChave(bim, sem, n)]: { titulo: '', metodologia: '', momentos: [], duracao: 50, caixinhas: [], fontes: [], origem: 'manual' } } }));
                setLimpar(false);
              }}
            >
              {limpar ? 'Confirmar: limpar esta aula' : 'Limpar aula'}
            </button>
          )}
          <button className="btn primary" onClick={onFechar}>
            {ro ? 'Fechar' : 'Concluir'}
          </button>
        </div>
        {!ro && <p className="small muted" style={{ margin: 0 }}>As alterações são salvas automaticamente.</p>}
      </div>
    </Modal>
  );
}

function troca<T>(arr: T[], i: number, j: number) {
  const a = [...arr];
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}
