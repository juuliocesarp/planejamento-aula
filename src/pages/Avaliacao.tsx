import { useState } from 'react';
import { DndContext, MouseSensor, TouchSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { disc } from '../data/base';
import { BIMESTRES } from '../data/calendario';
import { caixinha } from '../data/caixinhas';
import { FORMAS_AVALIACAO, formaAvaliacao } from '../data/metodologias';
import { Escolha } from '../components/Escolha';
import { AJUDA_AVALIACAO } from '../data/ajudas';
import { SUG_AVALIACAO } from '../data/sugestoes';
import { useStore } from '../store/store';
import type { ItemAvaliacao } from '../store/tipos';
import { Barra, DiscTag, Fontes, SeloOrigem, fmtN } from '../components/ui';

const uid = () => Math.random().toString(36).slice(2, 9);

export function Avaliacao() {
  const s = useStore();
  const d = s.minhaDisc!;
  const doc = s.discs[d];
  const [bim, setBim] = useState(3);
  const itens = doc.avaliacao[bim] ?? [];
  const total = itens.reduce((t, i) => t + (Number(i.pontos) || 0), 0);
  const sensores = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }));

  const setItens = (fn: (x: ItemAvaliacao[]) => ItemAvaliacao[]) => s.atualizarDisc(d, (x) => ({ ...x, avaliacao: { ...x.avaliacao, [bim]: fn(x.avaliacao[bim] ?? []) } }));
  const setItem = (id: string, m: Partial<ItemAvaliacao>) => setItens((l) => l.map((i) => (i.id === id ? { ...i, ...m, origem: i.origem === 'ia' ? 'editado' : i.origem } : i)));
  const doBim = Object.entries(doc.placements)
    .filter(([, p]) => p.bim === bim)
    .sort((a, b) => a[1].sem - b[1].sem)
    .map(([id]) => id);

  const fim = (e: DragEndEvent) => {
    if (!e.over) return;
    const cx = String(e.active.id).replace('cx:', '');
    const item = String(e.over.id).replace('item:', '');
    setItens((l) => l.map((i) => (i.id === item && !i.caixinhas.includes(cx) ? { ...i, caixinhas: [...i.caixinhas, cx], semConteudo: false } : i)));
  };

  const preencher = () =>
    setItens(() =>
      SUG_AVALIACAO[d].map((x) => ({ id: uid(), forma: x.forma, nome: x.nome, pontos: x.pontos, caixinhas: x.caixinhas, semConteudo: !x.caixinhas.length, origem: 'ia' as const })),
    );

  return (
    <DndContext sensors={sensores} onDragEnd={fim}>
      <div className="page-head">
        <h1>Avaliação</h1>
        <p>Monte o processo avaliativo do bimestre até somar 10 pontos. Arraste conteúdos para uma avaliação ou marque que ela não precisa de conteúdo.</p>
      </div>
      <div className="bim-tabs">
        {BIMESTRES.map((b) => (
          <button key={b.n} className={'bim-tab' + (b.n === 3 ? ' bim-projeto' : ' bim-fora')} aria-pressed={bim === b.n} onClick={() => setBim(b.n)}>
            <span className="row" style={{ gap: '0.4rem' }}>
              {b.n}º bimestre {b.n === 3 && <span className="selo-bim">Projeto</span>}
            </span>
            <small>{fmtN((doc.avaliacao[b.n] ?? []).reduce((t, i) => t + i.pontos, 0))} de 10 pontos</small>
          </button>
        ))}
      </div>

      <section className="card">
        <div className="row">
          <h2 style={{ margin: 0 }}>
            <DiscTag d={d} /> · {bim}º bimestre
          </h2>
          <span className="spacer" />
          {bim === 3 && (
            <button className="btn sm ia" onClick={preencher} title="Substitui as avaliações deste bimestre pela sugestão">
              ✦ Preencher com a sugestão
            </button>
          )}
        </div>
        <div style={{ margin: '0.9rem 0' }}>
          <Barra valor={total} max={10} rotulo="Pontos distribuídos" />
        </div>
        {!itens.length && <p className="muted">Nenhuma avaliação ainda. Adicione a primeira forma de avaliação abaixo.</p>}
        <div className="stack">
          {itens.map((it) => (
            <ItemCard key={it.id} it={it} onMudar={(m) => setItem(it.id, m)} onRemover={() => setItens((l) => l.filter((i) => i.id !== it.id))} opcoes={doBim} />
          ))}
        </div>
        <div className="row" style={{ marginTop: '0.9rem' }}>
          <button
            className="btn primary"
            onClick={() => setItens((l) => [...l, { id: uid(), forma: 'dissertativa', nome: '', pontos: 0, caixinhas: [], semConteudo: false, origem: 'manual' }])}
          >
            + Adicionar avaliação
          </button>
          {bim === 3 && itens.some((i) => i.origem !== 'manual') && <Fontes ids={['avaliacao', 'duasfases', 'portfolio', 'grupo']} />}
        </div>
      </section>

      <section className="card">
        <h3>Conteúdos do {bim}º bimestre</h3>
        <p className="small muted">Arraste uma caixinha até uma avaliação acima.</p>
        <div className="row">
          {doBim.map((id) => (
            <CxArrastavel key={id} id={id} />
          ))}
          {!doBim.length && <span className="small muted">Nenhum conteúdo posicionado neste bimestre.</span>}
        </div>
      </section>

    </DndContext>
  );
}

function CxArrastavel({ id }: { id: string }) {
  const c = caixinha(id)!;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: 'cx:' + id });
  return (
    <div
      ref={setNodeRef}
      className={'cx' + (isDragging ? ' arrastando' : '')}
      style={{ ['--c' as string]: `var(${disc(c.disc).cor})`, width: 'auto', transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined, position: 'relative', zIndex: isDragging ? 70 : undefined }}
      {...listeners}
      {...attributes}
    >
      <strong>{c.titulo}</strong>
    </div>
  );
}

function ItemCard({ it, onMudar, onRemover, opcoes }: { it: ItemAvaliacao; onMudar: (m: Partial<ItemAvaliacao>) => void; onRemover: () => void; opcoes: string[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'item:' + it.id });
  const f = formaAvaliacao(it.forma);
  return (
    <div ref={setNodeRef} className={'momento' + (it.origem === 'ia' ? ' ia' : '')} style={isOver ? { outline: '2px dashed var(--focus)' } : undefined}>
      <div className="row">
        <SeloOrigem origem={it.origem} />
        <span className="spacer" />
        <button className="btn sm ghost" aria-label="Remover avaliação" onClick={onRemover}>
          ✕
        </button>
      </div>
      <div className="grid2" style={{ gap: '0.5rem' }}>
        <div className="field">
          <span className="small">Forma de avaliação</span>
          <Escolha
            rotulo="Forma de avaliação"
            tipoAjuda="Forma de avaliação"
            valor={it.forma}
            opcoes={FORMAS_AVALIACAO.map((x) => ({ id: x.id, nome: x.nome }))}
            ajudas={AJUDA_AVALIACAO}
            onEscolher={(id) => onMudar({ forma: id, semConteudo: !!formaAvaliacao(id)?.semConteudo || it.semConteudo })}
          />
        </div>
        <div className="row" style={{ alignItems: 'flex-end', flexWrap: 'nowrap' }}>
          <label className="field" style={{ flex: 1 }}>
            <span className="small">Nome</span>
            <input className="input" value={it.nome} onChange={(e) => onMudar({ nome: e.target.value })} placeholder={f?.nome} />
          </label>
          <label className="field" style={{ width: '6rem' }}>
            <span className="small">Pontos</span>
            <input className="input num" type="number" min={0} max={10} step={0.5} value={it.pontos} onChange={(e) => onMudar({ pontos: Number(e.target.value) })} />
          </label>
        </div>
      </div>
      {f && (
        <p className="small muted" style={{ margin: 0 }}>
          {f.definicao} <strong>Prós:</strong> {f.pros} <strong>Contras:</strong> {f.contras}
        </p>
      )}
      <div className="row">
        <label className="row small">
          <input type="checkbox" checked={it.semConteudo} onChange={(e) => onMudar({ semConteudo: e.target.checked, caixinhas: e.target.checked ? [] : it.caixinhas })} />
          Não precisa de conteúdo atrelado
        </label>
      </div>
      {!it.semConteudo && (
        <div className="row">
          {it.caixinhas.map((id) => (
            <span key={id} className="chip">
              {caixinha(id)?.titulo}
              <button aria-label="Remover conteúdo" onClick={() => onMudar({ caixinhas: it.caixinhas.filter((x) => x !== id) })}>
                ✕
              </button>
            </span>
          ))}
          <select className="select" style={{ width: 'auto' }} value="" aria-label="Ligar conteúdo" onChange={(e) => e.target.value && onMudar({ caixinhas: [...it.caixinhas, e.target.value] })}>
            <option value="">+ ligar conteúdo</option>
            {opcoes
              .filter((x) => !it.caixinhas.includes(x))
              .map((x) => (
                <option key={x} value={x}>
                  {caixinha(x)?.titulo}
                </option>
              ))}
          </select>
          {!it.caixinhas.length && <span className="small muted">ou arraste uma caixinha para cá</span>}
        </div>
      )}
    </div>
  );
}

