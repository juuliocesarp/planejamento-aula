import { useMemo, useState } from 'react';
import { DndContext, PointerSensor, TouchSensor, KeyboardSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { DISCIPLINAS, disc } from '../data/base';
import { CAIXINHAS, caixinha } from '../data/caixinhas';
import { BIMESTRES, SEMANAS, fmt, type Semana } from '../data/calendario';
import { FASES } from '../data/aulas3bim';
import type { Caixinha, DiscId } from '../data/tipos';
import { aulaAtual, caixinhasNaSemana, useStore } from '../store/store';
import type { DiscDoc } from '../store/tipos';
import { AvisoIA, DiscTag } from '../components/ui';
import { AulaEditor } from '../components/AulaEditor';

export function Conteudos() {
  const s = useStore();
  const d = s.minhaDisc!;
  const doc = s.discs[d];
  const [bim, setBim] = useState(3);
  const [sobrepor, setSobrepor] = useState<DiscId[]>([]);
  const [lado, setLado] = useState<DiscId | ''>('');
  const [estanteAberta, setEstanteAberta] = useState(false);
  const [aula, setAula] = useState<{ d: DiscId; bim: number; sem: number; n: number } | null>(null);
  const [mover, setMover] = useState<string | null>(null);

  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const colocar = (id: string, b: number, sem: number) => {
    const c = caixinha(id)!;
    const total = SEMANAS[b].length;
    s.atualizarDisc(d, (x) => {
      const atual = x.placements[id];
      const semanas = Math.min(atual?.semanas ?? c.semanasGuia, total - sem + 1);
      return { ...x, placements: { ...x.placements, [id]: { bim: b, sem, semanas: Math.max(1, semanas) } } };
    });
  };
  const tirar = (id: string) =>
    s.atualizarDisc(d, (x) => {
      const p = { ...x.placements };
      delete p[id];
      return { ...x, placements: p };
    });
  const durar = (id: string, delta: number) =>
    s.atualizarDisc(d, (x) => {
      const p = x.placements[id];
      const max = SEMANAS[p.bim].length - p.sem + 1;
      return { ...x, placements: { ...x.placements, [id]: { ...p, semanas: Math.max(1, Math.min(max, p.semanas + delta)) } } };
    });

  const fimArraste = (e: DragEndEvent) => {
    const id = String(e.active.id).replace(/^(estante|colocada):/, '');
    if (!e.over) return;
    const alvo = String(e.over.id);
    if (alvo === 'estante') return tirar(id);
    const [, b, sem] = alvo.split(':');
    colocar(id, Number(b), Number(sem));
  };

  if (!doc.modo)
    return (
      <div className="page-head">
        <h1>Conteúdos e aulas</h1>
        <p>Antes, escolha o ponto de partida do calendário na etapa 1 (Recorte).</p>
        <a className="btn primary" href="#recorte">
          Ir para o recorte
        </a>
      </div>
    );

  const outras = DISCIPLINAS.filter((x) => x.id !== d);
  const mostrarAviso = doc.modo === 'projeto' && bim === 3;

  return (
    <DndContext sensors={sensores} onDragEnd={fimArraste}>
      <div className="page-head">
        <h1>Conteúdos e aulas</h1>
        <p>Arraste as caixinhas da estante para as semanas. Toque numa aula para ver e editar os momentos, a metodologia, o tempo, o espaço e os recursos.</p>
      </div>

      <div className="bim-tabs" role="group" aria-label="Bimestre">
        {BIMESTRES.map((b) => (
          <button key={b.n} className="bim-tab" aria-pressed={bim === b.n} onClick={() => setBim(b.n)}>
            {b.n}º bimestre {doc.recorte.includes(b.n) ? '' : <span className="muted small">(fora do recorte)</span>}
            <small>
              {fmt(b.inicio)} a {fmt(b.fim)} · {SEMANAS[b.n].length} semanas
            </small>
          </button>
        ))}
      </div>

      <div className="row" style={{ marginBottom: '0.8rem' }}>
        <button className="btn sm drawer-btn" onClick={() => setEstanteAberta((v) => !v)} aria-expanded={estanteAberta}>
          {estanteAberta ? 'Fechar estante' : 'Abrir estante de conteúdos'}
        </button>
        <details style={{ position: 'relative' }}>
          <summary className="btn sm">Mostrar outras disciplinas {sobrepor.length ? `(${sobrepor.length})` : ''}</summary>
          <div className="menu-pop" style={{ left: 0, right: 'auto' }}>
            {outras.map((o) => (
              <label key={o.id} className="row">
                <input type="checkbox" checked={sobrepor.includes(o.id)} onChange={() => setSobrepor((v) => (v.includes(o.id) ? v.filter((x) => x !== o.id) : [...v, o.id]))} />
                <DiscTag d={o.id} />
              </label>
            ))}
          </div>
        </details>
        <label className="row so-desktop-largo small">
          Tela dividida com
          <select className="select" style={{ width: 'auto' }} value={lado} onChange={(e) => setLado(e.target.value as DiscId | '')}>
            <option value="">ninguém</option>
            {outras.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      {mostrarAviso && <AvisoIA />}

      <div className={'cal' + (lado ? ' sem-estante' : '')}>
        {!lado && <Estante d={d} doc={doc} aberta={estanteAberta} onMover={setMover} />}
        <div className={lado ? 'split' : ''}>
          <div>
            {lado && <h3><DiscTag d={d} /> (você)</h3>}
            <ListaSemanas d={d} doc={doc} bim={bim} editavel sobrepor={sobrepor} onAula={(sem, n) => setAula({ d, bim, sem, n })} onDurar={durar} onTirar={tirar} onMover={setMover} />
          </div>
          {lado && (
            <div>
              <h3>
                <DiscTag d={lado} /> (leitura)
              </h3>
              <ListaSemanas d={lado} doc={s.discs[lado]} bim={bim} sobrepor={[]} onAula={(sem, n) => setAula({ d: lado, bim, sem, n })} />
            </div>
          )}
        </div>
      </div>

      {aula && <AulaEditor {...aula} somenteLeitura={aula.d !== d} onFechar={() => setAula(null)} />}
      {mover && <MoverPara id={mover} onFechar={() => setMover(null)} onEscolher={(b, sem) => (colocar(mover, b, sem), setMover(null))} onTirar={() => (tirar(mover), setMover(null))} />}
    </DndContext>
  );
}

function Estante({ d, doc, aberta, onMover }: { d: DiscId; doc: DiscDoc; aberta: boolean; onMover: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'estante' });
  const livres = CAIXINHAS.filter((c) => c.disc === d && !doc.placements[c.id]);
  const porEixo = useMemo(() => {
    const m = new Map<string, Caixinha[]>();
    for (const c of livres) m.set(c.eixo, [...(m.get(c.eixo) ?? []), c]);
    return [...m.entries()];
  }, [livres]);
  return (
    <aside ref={setNodeRef} className={'card estante' + (aberta ? ' aberta' : '')} style={isOver ? { outline: '2px dashed var(--focus)' } : undefined} aria-label="Estante de conteúdos">
      <h3>Estante</h3>
      <p className="small muted">{livres.length ? `${livres.length} caixinhas fora do calendário. Arraste para uma semana ou use "Mover para…".` : 'Todas as caixinhas estão no calendário. Arraste uma de volta para cá para tirá-la.'}</p>
      {porEixo.map(([eixo, lista]) => (
        <div key={eixo} className="eixo">
          <p>{eixo}</p>
          {lista.map((c) => (
            <CaixinhaArrastavel key={c.id} c={c} origem="estante" doc={doc} onMover={onMover} />
          ))}
        </div>
      ))}
    </aside>
  );
}

function sugestaoGuia(c: Caixinha) {
  if (c.projeto) return 'Etapa do projeto';
  const b = Math.min(4, Math.ceil(c.semanaGuia / 10));
  const s0 = ((c.semanaGuia - 1) % 10) + 1;
  return `Currículo sugere: ${b}º bim., sem. ${s0}${c.semanasGuia > 1 ? `–${s0 + c.semanasGuia - 1}` : ''}`;
}

function CaixinhaArrastavel({ c, origem, doc, onMover, onDurar, onTirar }: { c: Caixinha; origem: 'estante' | 'colocada'; doc: DiscDoc; onMover: (id: string) => void; onDurar?: (id: string, d: number) => void; onTirar?: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: `${origem}:${c.id}` });
  const p = doc.placements[c.id];
  const curta = p && !c.projeto && p.semanas < c.semanasGuia;
  return (
    <div
      ref={setNodeRef}
      className={'cx' + (isDragging ? ' arrastando' : '')}
      style={{ ['--c' as string]: `var(${disc(c.disc).cor})`, transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined, zIndex: isDragging ? 70 : undefined, position: isDragging ? 'relative' : undefined }}
      {...listeners}
      {...attributes}
      aria-label={`Caixinha ${c.titulo}. Arraste para uma semana.`}
    >
      <strong>{c.titulo}</strong>
      <span className="meta">
        {origem === 'colocada' && p ? `${p.semanas} ${p.semanas === 1 ? 'semana' : 'semanas'} · ` : ''}
        {sugestaoGuia(c)}
        {c.semanasGuia ? ` · ~${c.semanasGuia * doc.aulasSemana} aulas` : ''}
      </span>
      {c.revista && !c.projeto && <span className="selo-revista">Revista: {c.revista}</span>}
      {curta && <span className="alerta" style={{ padding: '0.15rem 0.4rem', fontSize: '0.75rem' }}>O guia sugere {c.semanasGuia} semanas; aqui tem {p.semanas}.</span>}
      <span className="acoes" onPointerDown={(e) => e.stopPropagation()}>
        <button className="btn sm ghost" onClick={() => onMover(c.id)}>
          Mover para…
        </button>
        {origem === 'colocada' && onDurar && (
          <>
            <button className="btn sm ghost" aria-label="Diminuir uma semana" onClick={() => onDurar(c.id, -1)}>
              −
            </button>
            <button className="btn sm ghost" aria-label="Aumentar uma semana" onClick={() => onDurar(c.id, 1)}>
              +
            </button>
            <button className="btn sm ghost" aria-label="Devolver para a estante" onClick={() => onTirar?.(c.id)}>
              ✕
            </button>
          </>
        )}
      </span>
    </div>
  );
}

export function ListaSemanas({
  d,
  doc,
  bim,
  editavel,
  sobrepor,
  onAula,
  onDurar,
  onTirar,
  onMover,
}: {
  d: DiscId;
  doc: DiscDoc;
  bim: number;
  editavel?: boolean;
  sobrepor: DiscId[];
  onAula: (sem: number, n: number) => void;
  onDurar?: (id: string, d: number) => void;
  onTirar?: (id: string) => void;
  onMover?: (id: string) => void;
}) {
  const projeto = doc.modo === 'projeto' && bim === 3;
  return (
    <div>
      {projeto && (
        <div className="fases" aria-label="Fases do projeto">
          {FASES.map((f) => (
            <span key={f.nome} className={'fase ' + f.cor} style={{ flex: f.semanas[1] - f.semanas[0] + 1 }} title={`${f.nome}: semanas ${f.semanas[0]} a ${f.semanas[1]}`}>
              {f.nome}
            </span>
          ))}
        </div>
      )}
      <div className="semanas">
        {SEMANAS[bim].map((w) => (
          <LinhaSemana key={w.n} w={w} d={d} doc={doc} editavel={editavel} sobrepor={sobrepor} onAula={onAula} onDurar={onDurar} onTirar={onTirar} onMover={onMover} />
        ))}
      </div>
    </div>
  );
}

function LinhaSemana({ w, d, doc, editavel, sobrepor, onAula, onDurar, onTirar, onMover }: { w: Semana; d: DiscId; doc: DiscDoc; editavel?: boolean; sobrepor: DiscId[]; onAula: (sem: number, n: number) => void; onDurar?: (id: string, d: number) => void; onTirar?: (id: string) => void; onMover?: (id: string) => void }) {
  const s = useStore();
  const { setNodeRef, isOver } = useDroppable({ id: `semana:${w.bim}:${w.n}`, disabled: !editavel });
  const [lamp, setLamp] = useState(false);
  const aqui = caixinhasNaSemana(doc, w.bim, w.n);
  const nAulas = doc.aulasSemana;
  return (
    <section ref={setNodeRef} className={'semana' + (isOver ? ' alvo' : '')} aria-label={`Semana ${w.n}`}>
      <div className="semana-data">
        <strong>Semana {w.n}</strong>
        <span className="muted">
          {fmt(w.inicio)} a {fmt(w.fim)}
        </span>
        {editavel && (
          <div style={{ marginTop: '0.4rem' }}>
            <button className="lampada" aria-expanded={lamp} aria-label="O que as outras disciplinas trabalham nesta semana" title="O que as outras disciplinas trabalham nesta semana" onClick={() => setLamp((v) => !v)}>
              💡
            </button>
          </div>
        )}
      </div>
      <div className="semana-corpo">
        {(w.avisos.length > 0 || w.datas.length > 0) && (
          <div className="row small">
            {w.avisos.map((a) => (
              <span key={a} className="alerta" style={{ padding: '0.1rem 0.5rem' }}>
                {a} · pode haver uma aula a menos
              </span>
            ))}
            {w.datas.map((a) => (
              <span key={a} className="chip">
                📅 {a}
              </span>
            ))}
          </div>
        )}
        <div className="coloc">
          {aqui.map(({ id, inicio }) => {
            const c = caixinha(id)!;
            return inicio && editavel ? (
              <CaixinhaArrastavel key={id} c={c} origem="colocada" doc={doc} onMover={onMover!} onDurar={onDurar} onTirar={onTirar} />
            ) : (
              <div key={id} className="cx outro" style={{ ['--c' as string]: `var(${disc(c.disc).cor})` }}>
                <strong>{c.titulo}</strong>
                {!inicio && <span className="meta">continuação</span>}
              </div>
            );
          })}
          {sobrepor.flatMap((o) =>
            caixinhasNaSemana(s.discs[o], w.bim, w.n).map(({ id }) => {
              const c = caixinha(id)!;
              return (
                <div key={o + id} className="cx outro" style={{ ['--c' as string]: `var(${disc(o).cor})` }}>
                  <span className="meta">{disc(o).curto}</span>
                  <strong>{c.titulo}</strong>
                </div>
              );
            }),
          )}
          {!aqui.length && editavel && <span className="small muted">Solte uma caixinha aqui.</span>}
        </div>
        <div className="aulas">
          {Array.from({ length: nAulas }, (_, i) => i + 1).map((n) => {
            const a = aulaAtual(d, doc, w.bim, w.n, n);
            return (
              <button key={n} className={'aula-card' + (a.origem === 'ia' ? ' ia' : '')} onClick={() => onAula(w.n, n)}>
                <span className="n">
                  Aula {n} · {a.duracao} min {a.origem === 'ia' ? '· ✦ IA' : a.origem === 'editado' ? '· editada' : ''}
                </span>
                {a.titulo ? <span className="t">{a.titulo}</span> : <span className="vazia">{editavel ? 'Planejar esta aula' : 'Não planejada'}</span>}
              </button>
            );
          })}
        </div>
        {lamp && (
          <div className="acordeao">
            {DISCIPLINAS.filter((x) => x.id !== d).map((o) => {
              const od = s.discs[o.id];
              const cxs = caixinhasNaSemana(od, w.bim, w.n);
              return (
                <details key={o.id}>
                  <summary>
                    <DiscTag d={o.id} /> <span className="small muted">· {cxs.length ? cxs.map((c) => caixinha(c.id)!.titulo).join('; ') : 'nada nesta semana'}</span>
                  </summary>
                  <ul className="small">
                    {od.modo &&
                      Array.from({ length: od.aulasSemana }, (_, i) => i + 1).map((n) => {
                        const a = aulaAtual(o.id, od, w.bim, w.n, n);
                        return (
                          <li key={n}>
                            Aula {n}: {a.titulo || <em className="muted">não planejada</em>}
                          </li>
                        );
                      })}
                    {!od.modo && <li className="muted">Ainda não começou o calendário.</li>}
                  </ul>
                </details>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function MoverPara({ id, onFechar, onEscolher, onTirar }: { id: string; onFechar: () => void; onEscolher: (b: number, s: number) => void; onTirar: () => void }) {
  const c = caixinha(id)!;
  const [b, setB] = useState(3);
  const [sem, setSem] = useState(1);
  return (
    <div className="modal-fundo" onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
      <div className="modal stack" role="dialog" aria-modal="true" aria-label="Mover caixinha" style={{ width: 'min(28rem, 100%)' }}>
        <h3>Mover "{c.titulo}"</h3>
        <label className="field">
          <span>Bimestre</span>
          <select className="select" value={b} onChange={(e) => (setB(Number(e.target.value)), setSem(1))}>
            {BIMESTRES.map((x) => (
              <option key={x.n} value={x.n}>
                {x.n}º bimestre
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Semana de início</span>
          <select className="select" value={sem} onChange={(e) => setSem(Number(e.target.value))}>
            {SEMANAS[b].map((w) => (
              <option key={w.n} value={w.n}>
                Semana {w.n} ({fmt(w.inicio)} a {fmt(w.fim)})
              </option>
            ))}
          </select>
        </label>
        <div className="row">
          <button className="btn primary" onClick={() => onEscolher(b, sem)}>
            Mover
          </button>
          <button className="btn" onClick={onTirar}>
            Devolver para a estante
          </button>
          <button className="btn ghost" onClick={onFechar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
