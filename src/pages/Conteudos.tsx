import { useMemo, useRef, useState } from 'react';
import { DndContext, DragOverlay, pointerWithin, rectIntersection, type CollisionDetection, MouseSensor, TouchSensor, KeyboardSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { DISCIPLINAS, disc } from '../data/base';
import { CAIXINHAS, caixinha } from '../data/caixinhas';
import { BIMESTRES, SEMANAS, fmt, type Semana } from '../data/calendario';
import { FASES } from '../data/aulas3bim';
import { EXPLICACOES } from '../data/explicacoes';
import type { Caixinha, DiscId, Placement } from '../data/tipos';
import { aulaAtual, aulaChave, aulaSugerida, aulaVazia, caixinhasNaSemana, placementsDoModo, useStore } from '../store/store';
import type { DiscDoc } from '../store/tipos';
import { AvisoIA, DiscTag, Fontes, Modal, useCamada } from '../components/ui';
import { AulaEditor } from '../components/AulaEditor';

// Preferências só deste navegador (avisos fechados, estante recolhida).
function lerLocal<T>(k: string, padrao: T): T {
  try {
    const v = localStorage.getItem('revista-ui:' + k);
    return v ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
}
function gravarLocal(k: string, v: unknown) {
  try {
    localStorage.setItem('revista-ui:' + k, JSON.stringify(v));
  } catch {
    /* sem armazenamento */
  }
}

/** Posição sugerida de cada caixinha (ordem lógica recomendada). */
function useSugestao(d: DiscId, doc: DiscDoc) {
  return useMemo(() => placementsDoModo(d, doc.modo === 'referencia' ? 'referencia' : 'projeto'), [d, doc.modo]);
}

export function Conteudos() {
  const s = useStore();
  const d = s.minhaDisc!;
  const doc = s.discs[d];
  const [bim, setBim] = useState(3);
  const [sobrepor, setSobrepor] = useState<DiscId[]>([]);
  const [lado, setLado] = useState<DiscId | ''>('');
  const [estanteAberta, setEstanteAberta] = useState(false);
  const [recolhida, setRecolhida] = useState(() => lerLocal('estante-recolhida', false));
  const [avisoFechado, setAvisoFechado] = useState(() => lerLocal('aviso-ia', false));
  const [aula, setAula] = useState<{ d: DiscId; bim: number; sem: number; n: number } | null>(null);
  const [mover, setMover] = useState<string | null>(null);
  const [detalhe, setDetalhe] = useState<{ id: string; d: DiscId } | null>(null);
  const [confirmarTudo, setConfirmarTudo] = useState(false);
  const [confirmarLimpar, setConfirmarLimpar] = useState(false);
  const [toast, setToast] = useState('');
  const ultimoArraste = useRef(0);
  const [arrastando, setArrastando] = useState<string | null>(null);
  useCamada(estanteAberta, () => setEstanteAberta(false));

  const sensores = useSensors(
    // Mouse arrasta logo; no toque é preciso segurar o dedo, para a rolagem da tela funcionar.
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const avisar = (t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(''), 3500);
  };

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

  /** Preenche as aulas de uma lista de semanas com a sugestão da IA. */
  const sugerirAulas = (semanas: { bim: number; sem: number }[], substituir: boolean, base?: DiscDoc) => {
    let n = 0;
    const x0 = base ?? doc;
    const aulas = { ...x0.aulas };
    for (const w of semanas)
      for (let i = 1; i <= x0.aulasSemana; i++) {
        const atual = aulaAtual(d, x0, w.bim, w.sem, i);
        if (!substituir && !aulaVazia(atual)) continue;
        const sug = aulaSugerida(d, x0, w.bim, w.sem, i);
        if (!sug) continue;
        aulas[aulaChave(w.bim, w.sem, i)] = sug;
        n++;
      }
    s.atualizarDisc(d, (x) => ({ ...x, placements: x0.placements, aulas: { ...x.aulas, ...aulas } }));
    return n;
  };

  const sugerirTudo = (substituir: boolean) => {
    setConfirmarTudo(false);
    let base = doc;
    // Sem conteúdos no bimestre: coloca os sugeridos primeiro.
    if (!Object.values(doc.placements).some((p) => p.bim === bim)) {
      const sug = placementsDoModo(d, doc.modo === 'referencia' ? 'referencia' : 'projeto');
      const placements = { ...doc.placements };
      for (const [id, p] of Object.entries(sug)) if (p.bim === bim && !placements[id]) placements[id] = p;
      base = { ...doc, placements };
    }
    const n = sugerirAulas(
      SEMANAS[bim].map((w) => ({ bim, sem: w.n })),
      substituir,
      base,
    );
    avisar(n ? `A IA sugeriu ${n} aulas no ${bim}º bimestre. Tudo continua editável.` : 'Não havia aulas vazias para preencher neste bimestre.');
  };

  const limparBimestre = () => {
    setConfirmarLimpar(false);
    s.atualizarDisc(d, (x) => {
      const placements = Object.fromEntries(Object.entries(x.placements).filter(([, p]) => p.bim !== bim));
      const aulas = Object.fromEntries(Object.entries(x.aulas).filter(([k]) => !k.startsWith(bim + '-')));
      // Grava aulas vazias para que as sugestões prontas não reapareçam.
      for (const w of SEMANAS[bim]) for (let i = 1; i <= x.aulasSemana; i++) aulas[aulaChave(bim, w.n, i)] = { titulo: '', metodologia: '', momentos: [], duracao: 50, caixinhas: [], fontes: [], origem: 'manual' };
      return { ...x, placements, aulas };
    });
    avisar(`O ${bim}º bimestre foi limpo: conteúdos de volta na estante e aulas zeradas.`);
  };
  const limparTudo = () => {
    setConfirmarLimpar(false);
    s.atualizarDisc(d, (x) => ({ ...x, modo: 'vazio', placements: {}, aulas: {} }));
    avisar('Tudo foi limpo: todos os conteúdos estão na estante e as aulas estão zeradas.');
  };

  const inicioArraste = (e: DragStartEvent) => {
    ultimoArraste.current = Date.now();
    setArrastando(String(e.active.id).replace(/^(estante|colocada):/, ''));
    // No celular a estante cobre as semanas: fecha para dar lugar ao destino.
    setEstanteAberta(false);
  };
  const colocarEAvisar = (id: string, b: number, sem: number) => {
    colocar(id, b, sem);
    setEstanteAberta(false);
    if (b !== bim) setBim(b);
    avisar(`"${caixinha(id)!.titulo}" foi para o ${b}º bimestre, semana ${sem}.`);
    window.setTimeout(() => document.getElementById(`semana-${b}-${sem}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  };
  const fimArraste = (e: DragEndEvent) => {
    setArrastando(null);
    ultimoArraste.current = Date.now();
    const id = String(e.active.id).replace(/^(estante|colocada):/, '');
    if (!e.over) return;
    const alvo = String(e.over.id);
    if (alvo === 'estante') return tirar(id);
    const [, b, sem] = alvo.split(':');
    colocar(id, Number(b), Number(sem));
  };
  const abrirDetalhe = (id: string, dd: DiscId = d) => {
    if (Date.now() - ultimoArraste.current < 300) return;
    setDetalhe({ id, d: dd });
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
  const mostrarAviso = doc.modo === 'projeto' && bim === 3 && !avisoFechado;
  const comEstante = !lado;

  return (
    <DndContext sensors={sensores} collisionDetection={colisao} onDragEnd={fimArraste} onDragStart={inicioArraste} onDragCancel={() => setArrastando(null)}>
      <div className="conteudos-topo">
        <h1 style={{ marginBottom: '0.2rem' }}>Conteúdos e aulas</h1>
        <p className="muted small" style={{ margin: 0 }}>
          Arraste os conteúdos da estante para as semanas. Clique num conteúdo para ver o que ele ensina, ou numa aula para planejá-la.
        </p>
      </div>

      <div className="bim-tabs" role="group" aria-label="Bimestre">
        {BIMESTRES.map((b) => {
          const projeto = b.n === 3;
          return (
            <button key={b.n} className={'bim-tab' + (projeto ? ' bim-projeto' : ' bim-fora')} aria-pressed={bim === b.n} onClick={() => setBim(b.n)}>
              <span className="row" style={{ gap: '0.4rem' }}>
                {b.n}º bimestre {projeto && <span className="selo-bim">Projeto</span>}
              </span>
              <small>
                {fmt(b.inicio)} a {fmt(b.fim)} · {SEMANAS[b.n].length} semanas
              </small>
            </button>
          );
        })}
      </div>

      <div className="barra-ferramentas">
        <button className="btn sm esconde-mobile" onClick={() => (setRecolhida(!recolhida), gravarLocal('estante-recolhida', !recolhida))} disabled={!comEstante}>
          {recolhida ? 'Mostrar estante' : 'Recolher estante'}
        </button>
        <button className="btn sm drawer-btn" onClick={() => setEstanteAberta((v) => !v)} aria-expanded={estanteAberta}>
          {estanteAberta ? 'Fechar estante' : 'Abrir estante de conteúdos'}
        </button>
        <details style={{ position: 'relative' }}>
          <summary className="btn sm">Ver outras disciplinas {sobrepor.length ? `(${sobrepor.length})` : ''}</summary>
          <div className="menu-pop" style={{ left: 0, right: 'auto' }}>
            <span className="small muted">Mostra, em cada semana, o que os colegas planejaram.</span>
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
        <span className="spacer" />
        <button className="btn sm perigo" onClick={() => (setConfirmarLimpar(true), setConfirmarTudo(false))}>
          Limpar…
        </button>
        <button className="btn ia forte" onClick={() => (setConfirmarTudo(true), setConfirmarLimpar(false))}>
          ✦ IA: sugerir tudo do {bim}º bimestre
        </button>
      </div>

      {confirmarTudo && (
        <div className="alerta row" role="alert" style={{ marginBottom: '0.8rem' }}>
          <span>
            A IA vai {Object.values(doc.placements).some((p) => p.bim === bim) ? '' : 'colocar os conteúdos sugeridos e '}sugerir as aulas do {bim}º bimestre. O que fazer com as aulas que já têm conteúdo?
          </span>
          <button className="btn sm primary" onClick={() => sugerirTudo(false)}>
            Preencher só as vazias
          </button>
          <button className="btn sm" onClick={() => sugerirTudo(true)}>
            Substituir todas
          </button>
          <button className="btn sm ghost" onClick={() => setConfirmarTudo(false)}>
            Cancelar
          </button>
        </div>
      )}

      {confirmarLimpar && (
        <div className="alerta row" role="alert" style={{ marginBottom: '0.8rem' }}>
          <span>Limpar devolve os conteúdos para a estante e zera as aulas. Isso não pode ser desfeito.</span>
          <button className="btn sm" onClick={() => limparBimestre()}>
            Limpar só o {bim}º bimestre
          </button>
          <button className="btn sm perigo-forte" onClick={() => limparTudo()}>
            Limpar tudo (todos os bimestres)
          </button>
          <button className="btn sm ghost" onClick={() => setConfirmarLimpar(false)}>
            Cancelar
          </button>
        </div>
      )}

      {mostrarAviso && (
        <div style={{ position: 'relative' }}>
          <AvisoIA />
          <button className="btn sm ghost fechar-aviso" aria-label="Fechar aviso" onClick={() => (setAvisoFechado(true), gravarLocal('aviso-ia', true))}>
            ✕
          </button>
        </div>
      )}

      <div className={'cal' + (!comEstante || recolhida ? ' sem-estante' : '')}>
        {comEstante && estanteAberta && <div className="estante-veu" onClick={() => setEstanteAberta(false)} aria-hidden="true" />}
        {comEstante && <Estante d={d} doc={doc} aberta={estanteAberta} recolhida={recolhida} onFechar={() => setEstanteAberta(false)} onMover={setMover} onDetalhe={abrirDetalhe} />}
        <div className={lado ? 'split' : ''}>
          <div>
            {lado && (
              <h3>
                <DiscTag d={d} /> (você)
              </h3>
            )}
            <ListaSemanas
              d={d}
              doc={doc}
              bim={bim}
              editavel
              sobrepor={sobrepor}
              onAula={(sem, n) => setAula({ d, bim, sem, n })}
              onDetalhe={abrirDetalhe}
              onSugerirSemana={(sem, substituir) => {
                const n = sugerirAulas([{ bim, sem }], substituir);
                avisar(n ? `A IA sugeriu ${n} ${n === 1 ? 'aula' : 'aulas'} para a semana ${sem}.` : 'As aulas desta semana já estavam preenchidas.');
              }}
            />
          </div>
          {lado && (
            <div>
              <h3>
                <DiscTag d={lado} /> (leitura)
              </h3>
              <ListaSemanas d={lado} doc={s.discs[lado]} bim={bim} sobrepor={[]} onAula={(sem, n) => setAula({ d: lado, bim, sem, n })} onDetalhe={(id) => abrirDetalhe(id, lado)} />
            </div>
          )}
        </div>
      </div>

      {aula && <AulaEditor {...aula} somenteLeitura={aula.d !== d} onFechar={() => setAula(null)} />}
      {mover && <MoverPara id={mover} noCalendario={!!doc.placements[mover]} bimAtual={bim} onFechar={() => setMover(null)} onEscolher={(b, sem) => (colocarEAvisar(mover, b, sem), setMover(null))} onTirar={() => (tirar(mover), setMover(null), avisar('Conteúdo devolvido para a estante.'))} />}
      <DragOverlay dropAnimation={null}>
        {arrastando ? (
          <div className="cx arraste-sombra" style={{ ['--c' as string]: `var(${disc(d).cor})` }}>
            <strong>{caixinha(arrastando)!.titulo}</strong>
            <span className="meta">Solte numa semana</span>
          </div>
        ) : null}
      </DragOverlay>
      {detalhe && (
        <DetalheCaixinha
          id={detalhe.id}
          doc={s.discs[detalhe.d]}
          editavel={detalhe.d === d}
          onFechar={() => setDetalhe(null)}
          onMover={() => (setMover(detalhe.id), setDetalhe(null))}
          onDurar={(delta) => durar(detalhe.id, delta)}
          onTirar={() => (tirar(detalhe.id), setDetalhe(null))}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </DndContext>
  );
}

// Solta onde o dedo/ponteiro está; se não estiver sobre nada, usa a maior sobreposição.
const colisao: CollisionDetection = (args) => {
  const sob = pointerWithin(args);
  return sob.length ? sob : rectIntersection(args);
};

function rotuloPos(p?: Placement) {
  if (!p) return 'Fora do calendário sugerido';
  return `${p.bim}º bim., semana ${p.sem}${p.semanas > 1 ? `–${p.sem + p.semanas - 1}` : ''}`;
}

function Estante({ d, doc, aberta, recolhida, onFechar, onMover, onDetalhe }: { d: DiscId; doc: DiscDoc; aberta: boolean; recolhida: boolean; onFechar: () => void; onMover: (id: string) => void; onDetalhe: (id: string) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'estante' });
  const sug = useSugestao(d, doc);
  const livres = CAIXINHAS.filter((c) => c.disc === d && !doc.placements[c.id]).sort((a, b) => {
    const pa = sug[a.id];
    const pb = sug[b.id];
    if (!pa && !pb) return a.semanaGuia - b.semanaGuia;
    if (!pa) return 1;
    if (!pb) return -1;
    return pa.bim - pb.bim || pa.sem - pb.sem;
  });
  const grupos = new Map<string, Caixinha[]>();
  for (const c of livres) {
    const p = sug[c.id];
    const k = p ? `Sugerido para o ${p.bim}º bimestre` : 'Sem posição sugerida';
    grupos.set(k, [...(grupos.get(k) ?? []), c]);
  }
  if (recolhida)
    return (
      <div ref={setNodeRef} className="estante-recolhida esconde-mobile" aria-hidden>
        {isOver ? 'Solte para devolver' : ''}
      </div>
    );
  let primeiro = true;
  return (
    <aside ref={setNodeRef} className={'card estante' + (aberta ? ' aberta' : '')} style={isOver ? { outline: '2px dashed var(--focus)' } : undefined} aria-label="Estante de conteúdos">
      <div className="estante-cab">
        <h3>Estante</h3>
        <button type="button" className="btn sm estante-fechar" onClick={onFechar} aria-label="Fechar estante">
          ✕ Fechar
        </button>
      </div>
      <p className="small muted">
        {livres.length ? (
          <>
            {livres.length} conteúdos fora do calendário, na ordem recomendada.{' '}
            <span className="esconde-mobile">Arraste para uma semana ou clique para ver os detalhes.</span>
            <span className="so-mobile">Toque em "Colocar no calendário" ou segure e arraste até uma semana.</span>
          </>
        ) : (
          'Todos os conteúdos estão no calendário. Arraste um de volta para cá para tirá-lo.'
        )}
      </p>
      {[...grupos.entries()].map(([g, lista]) => (
        <div key={g} className="eixo">
          <p>{g}</p>
          {lista.map((c) => {
            const meta = `${primeiro ? 'Próximo na ordem · ' : ''}${rotuloPos(sug[c.id])}`;
            primeiro = false;
            return <CaixinhaCard key={c.id} c={c} origem="estante" doc={doc} meta={meta} onMover={onMover} onDetalhe={onDetalhe} />;
          })}
        </div>
      ))}
    </aside>
  );
}

function CaixinhaCard({ c, origem, doc, meta, onMover, onDetalhe }: { c: Caixinha; origem: 'estante' | 'colocada'; doc: DiscDoc; meta: string; onMover: (id: string) => void; onDetalhe: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `${origem}:${c.id}` });
  const p = doc.placements[c.id];
  const curta = p && !c.projeto && p.semanas < c.semanasGuia;
  return (
    <div
      ref={setNodeRef}
      className={'cx clicavel' + (isDragging ? ' arrastando' : '')}
      style={{ ['--c' as string]: `var(${disc(c.disc).cor})` }}
      {...listeners}
      {...attributes}
      onClick={() => onDetalhe(c.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onDetalhe(c.id);
        else listeners?.onKeyDown?.(e);
      }}
      aria-label={`${c.titulo}. Arraste para uma semana ou pressione Enter para ver os detalhes.`}
    >
      <strong>{c.titulo}</strong>
      <span className="meta">{meta}</span>
      {c.revista && !c.projeto && <span className="selo-revista">Usado na revista</span>}
      {curta && <span className="meta" style={{ color: 'var(--warn)' }}>Currículo sugere {c.semanasGuia} semanas; aqui tem {p.semanas}.</span>}
      {origem === 'estante' && (
        <span className="acoes">
          <button
            className="btn sm"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onMover(c.id);
            }}
          >
            Colocar no calendário…
          </button>
        </span>
      )}
    </div>
  );
}

function lembretesDaSemana(d: DiscId, doc: DiscDoc, bim: number, sem: number) {
  const aqui = caixinhasNaSemana(doc, bim, sem);
  const aulas = Array.from({ length: doc.aulasSemana }, (_, i) => aulaAtual(d, doc, bim, sem, i + 1));
  return aqui.filter(({ id }) => !aulas.some((a) => !aulaVazia(a) && a.caixinhas.includes(id)));
}

export function ListaSemanas({
  d,
  doc,
  bim,
  editavel,
  sobrepor,
  onAula,
  onDetalhe,
  onSugerirSemana,
}: {
  d: DiscId;
  doc: DiscDoc;
  bim: number;
  editavel?: boolean;
  sobrepor: DiscId[];
  onAula: (sem: number, n: number) => void;
  onDetalhe?: (id: string) => void;
  onSugerirSemana?: (sem: number, substituir: boolean) => void;
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
          <LinhaSemana key={w.n} w={w} d={d} doc={doc} editavel={editavel} sobrepor={sobrepor} onAula={onAula} onDetalhe={onDetalhe} onSugerirSemana={onSugerirSemana} />
        ))}
      </div>
    </div>
  );
}

function LinhaSemana({
  w,
  d,
  doc,
  editavel,
  sobrepor,
  onAula,
  onDetalhe,
  onSugerirSemana,
}: {
  w: Semana;
  d: DiscId;
  doc: DiscDoc;
  editavel?: boolean;
  sobrepor: DiscId[];
  onAula: (sem: number, n: number) => void;
  onDetalhe?: (id: string) => void;
  onSugerirSemana?: (sem: number, substituir: boolean) => void;
}) {
  const s = useStore();
  const { setNodeRef, isOver } = useDroppable({ id: `semana:${w.bim}:${w.n}`, disabled: !editavel });
  const [lamp, setLamp] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [fechados, setFechados] = useState<string[]>(() => lerLocal('lembretes', []));
  const aqui = caixinhasNaSemana(doc, w.bim, w.n);
  const nAulas = doc.aulasSemana;
  const aulas = Array.from({ length: nAulas }, (_, i) => aulaAtual(d, doc, w.bim, w.n, i + 1));
  const todasCheias = aulas.every((a) => !aulaVazia(a));
  const lembretes = editavel ? lembretesDaSemana(d, doc, w.bim, w.n).filter(({ id }) => !fechados.includes(`${d}:${w.bim}:${w.n}:${id}`)) : [];
  const fechar = (id: string) => {
    const novo = [...fechados, `${d}:${w.bim}:${w.n}:${id}`];
    setFechados(novo);
    gravarLocal('lembretes', novo);
  };

  return (
    <section ref={setNodeRef} id={`semana-${w.bim}-${w.n}`} className={'semana' + (isOver ? ' alvo' : '')} aria-label={`Semana ${w.n}`}>
      <div className="semana-cab">
        <strong className="semana-n">Semana {w.n}</strong>
        <span className="muted small">
          {fmt(w.inicio)} a {fmt(w.fim)}
        </span>
        {w.avisos.map((a) => (
          <span key={a} className="chip aviso-chip" title="Pode haver uma aula a menos nesta semana">
            ⚠ {a}
          </span>
        ))}
        {w.datas.map((a) => (
          <span key={a} className="chip">
            📅 {a}
          </span>
        ))}
        <span className="spacer" />
        {editavel && aqui.length > 0 && onSugerirSemana && (
          <button className="btn sm ia" onClick={() => (todasCheias ? setConfirmar(true) : onSugerirSemana(w.n, false))} title="A IA sugere as aulas desta semana a partir dos conteúdos colocados nela">
            ✦ Sugerir aulas da semana
          </button>
        )}
        {editavel && (
          <button className="lampada" aria-expanded={lamp} aria-label="O que as outras disciplinas trabalham nesta semana" title="O que as outras disciplinas trabalham nesta semana" onClick={() => setLamp((v) => !v)}>
            💡
          </button>
        )}
      </div>

      {confirmar && (
        <div className="alerta row" role="alert">
          <span>As aulas desta semana já estão preenchidas. Substituir pela sugestão da IA?</span>
          <button className="btn sm primary" onClick={() => (onSugerirSemana?.(w.n, true), setConfirmar(false))}>
            Substituir
          </button>
          <button className="btn sm ghost" onClick={() => setConfirmar(false)}>
            Cancelar
          </button>
        </div>
      )}

      <div className="semana-corpo">
        <div className="coloc">
          {aqui.map(({ id, p, inicio }) => {
            const c = caixinha(id)!;
            const ordem = w.n - p.sem + 1;
            if (inicio && editavel)
              return <CaixinhaCard key={id} c={c} origem="colocada" doc={doc} meta={`${p.semanas} ${p.semanas === 1 ? 'semana' : 'semanas'} · ~${p.semanas * nAulas} aulas · clique para detalhes`} onMover={() => {}} onDetalhe={onDetalhe ?? (() => {})} />;
            return (
              <button key={id} className={'cx' + (inicio ? '' : ' continua')} style={{ ['--c' as string]: `var(${disc(c.disc).cor})` }} onClick={() => onDetalhe?.(id)}>
                {!inicio && (
                  <span className="meta continua-rotulo">
                    ↳ Continuação · semana {ordem} de {p.semanas} deste conteúdo
                  </span>
                )}
                <strong>{c.titulo}</strong>
              </button>
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
          {!aqui.length && editavel && <span className="soltar-aqui">Solte um conteúdo aqui</span>}
        </div>

        {lembretes.map(({ id, p }) => {
          const c = caixinha(id)!;
          const continua = p.sem !== w.n;
          return (
            <div key={id} className="lembrete" role="note">
              <span>
                {continua ? (
                  <>
                    <strong>{c.titulo}</strong> continua nesta semana. Lembre de fazer as aulas abordarem esse conteúdo.
                  </>
                ) : (
                  <>
                    As aulas desta semana ainda não tratam de <strong>{c.titulo}</strong>.
                  </>
                )}
              </span>
              <button className="btn sm ghost" aria-label="Fechar lembrete" onClick={() => fechar(id)}>
                ✕
              </button>
            </div>
          );
        })}

        <div className="aulas">
          {aulas.map((a, i) => (
            <button key={i} className={'aula-card' + (a.origem === 'ia' ? ' ia' : '')} onClick={() => onAula(w.n, i + 1)}>
              <span className="n">
                Aula {i + 1} · {a.duracao} min {a.origem === 'ia' ? '· ✦ IA' : a.origem === 'editado' ? '· editada' : ''}
              </span>
              {a.titulo ? <span className="t">{a.titulo}</span> : <span className="vazia">{editavel ? 'Planejar esta aula' : 'Não planejada'}</span>}
            </button>
          ))}
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

function DetalheCaixinha({ id, doc, editavel, onFechar, onMover, onDurar, onTirar }: { id: string; doc: DiscDoc; editavel: boolean; onFechar: () => void; onMover: () => void; onDurar: (d: number) => void; onTirar: () => void }) {
  const c = caixinha(id)!;
  const p = doc.placements[id];
  const explic = EXPLICACOES[id];
  const curric = c.projeto ? null : `${Math.min(4, Math.ceil(c.semanaGuia / 10))}º bimestre, ${c.semanasGuia} semanas`;
  return (
    <Modal titulo={c.titulo} onFechar={onFechar}>
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <DiscTag d={c.disc} />
          <p className="small muted" style={{ margin: 0 }}>
            {c.eixo}
          </p>
        </div>
      </div>
      <h2 style={{ marginTop: '0.6rem' }}>{c.titulo}</h2>
      {explic && (
        <div className="ia-box" style={{ marginBottom: '0.9rem' }}>
          <span className="ia-badge">Explicação da IA</span>
          <p style={{ margin: '0.4rem 0' }}>{explic}</p>
          <Fontes ids={[c.fonte]} disc={c.disc} />
        </div>
      )}
      <div className="grid2">
        <div>
          <h3>O que se estuda</h3>
          <ul style={{ marginTop: 0 }}>
            {c.subtemas.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="stack" style={{ gap: '0.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.2rem' }}>Como trabalhar</h3>
            <p className="small" style={{ margin: 0 }}>
              {c.foco}
            </p>
          </div>
          {c.revista && (
            <div>
              <h3 style={{ marginBottom: '0.2rem' }}>Na revista</h3>
              <p className="small" style={{ margin: 0 }}>
                {c.revista}
              </p>
            </div>
          )}
          {c.bncc.length > 0 && (
            <p className="small" style={{ margin: 0 }}>
              <strong>Habilidades da BNCC:</strong> {c.bncc.join(', ')}
            </p>
          )}
          {curric && (
            <p className="small" style={{ margin: 0 }}>
              <strong>Nos currículos de referência:</strong> {curric}
            </p>
          )}
          <p className="small" style={{ margin: 0 }}>
            <strong>No seu calendário:</strong> {p ? rotuloPos(p) : 'na estante (fora do calendário)'}
          </p>
        </div>
      </div>
      {editavel && (
        <div className="row" style={{ marginTop: '1rem' }}>
          <button className="btn sm primary" onClick={onMover}>
            {p ? 'Mudar de semana…' : 'Colocar no calendário…'}
          </button>
          {p && (
            <>
              <span className="small muted">Duração:</span>
              <button className="btn sm" aria-label="Diminuir uma semana" onClick={() => onDurar(-1)}>
                − semana
              </button>
              <span className="num">{p.semanas}</span>
              <button className="btn sm" aria-label="Aumentar uma semana" onClick={() => onDurar(1)}>
                + semana
              </button>
              <button className="btn sm ghost" onClick={onTirar}>
                Devolver para a estante
              </button>
            </>
          )}
        </div>
      )}
    </Modal>
  );
}

function MoverPara({ id, noCalendario, bimAtual, onFechar, onEscolher, onTirar }: { id: string; noCalendario: boolean; bimAtual: number; onFechar: () => void; onEscolher: (b: number, s: number) => void; onTirar: () => void }) {
  const c = caixinha(id)!;
  const [b, setB] = useState(bimAtual);
  const [sem, setSem] = useState(1);
  return (
    <Modal titulo="Colocar no calendário" onFechar={onFechar} classe="stack modal-estreito">
      <h3 style={{ paddingRight: '2.6rem' }}>{noCalendario ? 'Mudar de semana' : 'Colocar no calendário'}</h3>
      <p className="small muted" style={{ margin: 0 }}>
        {c.titulo}
      </p>
      <label className="field">
        <span>Bimestre</span>
        <select className="select" value={b} onChange={(e) => (setB(Number(e.target.value)), setSem(1))}>
          {BIMESTRES.map((x) => (
            <option key={x.n} value={x.n}>
              {x.n}º bimestre{x.n === 3 ? ' (projeto)' : ''}
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
      <div className="row acoes-modal">
        <button className="btn primary" onClick={() => onEscolher(b, sem)}>
          {noCalendario ? 'Mudar para esta semana' : 'Colocar nesta semana'}
        </button>
        {noCalendario && (
          <button className="btn" onClick={onTirar}>
            Devolver para a estante
          </button>
        )}
        <button className="btn ghost" onClick={onFechar}>
          Cancelar
        </button>
      </div>
    </Modal>
  );
}
