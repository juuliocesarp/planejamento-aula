import { createPortal } from 'react-dom';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { FONTES, disc, expandirFontes, type Perfil } from '../data/base';
import type { DiscId } from '../data/tipos';
import type { Origem } from '../store/tipos';

export function Avatar({ perfil, cor, grande }: { perfil: Perfil; cor?: string; grande?: boolean }) {
  return (
    <span className={'avatar' + (grande ? ' lg' : '')} style={{ ['--c' as string]: cor ?? 'var(--ink)' }} aria-hidden>
      {perfil.iniciais}
    </span>
  );
}

export function DiscTag({ d, curto }: { d: DiscId; curto?: boolean }) {
  const x = disc(d);
  return (
    <span className="disc-tag" style={{ ['--c' as string]: `var(${x.cor})` }}>
      <span className="disc-dot" aria-hidden />
      {curto ? x.curto : x.nome}
    </span>
  );
}

export function Fontes({ ids, disc: d }: { ids: string[]; disc?: DiscId }) {
  const lista = expandirFontes(ids, d);
  if (!lista.length) return null;
  return (
    <span className="row small" style={{ gap: '0.5rem' }}>
      <span className="muted">{lista.length > 1 ? 'Fontes:' : 'Fonte:'}</span>
      {lista.map((id) => (
        <Fonte key={id} id={id} />
      ))}
    </span>
  );
}

export function Fonte({ id }: { id: string }) {
  const f = FONTES[id];
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false);
    document.addEventListener('click', fechar);
    return () => document.removeEventListener('click', fechar);
  }, [aberto]);
  if (!f) return null;
  return (
    <span className="fonte" ref={ref} onMouseEnter={() => setAberto(true)} onMouseLeave={() => setAberto(false)}>
      <button type="button" onClick={() => setAberto((a) => !a)} aria-expanded={aberto}>
        {f.titulo}
      </button>
      {aberto && (
        <span className="fonte-tip" role="tooltip">
          {f.detalhe}
          {f.url ? (
            <>
              {' '}
              <a href={f.url} target="_blank" rel="noreferrer">
                Abrir a fonte original ↗
              </a>
            </>
          ) : null}
        </span>
      )}
    </span>
  );
}

export function SeloOrigem({ origem }: { origem: Origem }) {
  if (origem === 'ia') return <span className="ia-badge">Sugestão da IA</span>;
  if (origem === 'editado') return <span className="edit-badge">Editado por você · a partir de sugestão da IA</span>;
  return null;
}

export function AvisoIA() {
  return (
    <div className="aviso-ia" role="note">
      <span aria-hidden style={{ fontSize: '1.3rem', color: 'var(--ia)' }}>
        ✦
      </span>
      <div>
        <strong>O conteúdo destas aulas foi sugerido por inteligência artificial.</strong>
        <p className="small" style={{ margin: '0.2rem 0 0' }}>
          Ele foi preenchido para agilizar o planejamento, já que falta pouco tempo para vocês apresentarem o projeto. Tudo aqui é editável: ajuste, reescreva ou apague do seu jeito. Cada sugestão
          mostra a fonte de onde saiu.
        </p>
      </div>
    </div>
  );
}

/** Caixa que mostra uma sugestão da IA só quando a pessoa pede. */
export function VerSugestao({ texto, fontes, onUsar, rotulo = 'Ver sugestão da IA', disc: d }: { texto: string; fontes: string[]; onUsar: (t: string) => void; rotulo?: string; disc?: DiscId }) {
  const [aberto, setAberto] = useState(false);
  if (!aberto)
    return (
      <button type="button" className="btn sm ia" onClick={() => setAberto(true)}>
        ✦ {rotulo}
      </button>
    );
  return (
    <div className="ia-box stack">
      <div className="row">
        <span className="ia-badge">Sugestão da IA</span>
        <span className="spacer" />
        <button type="button" className="btn sm ghost" onClick={() => setAberto(false)}>
          Fechar
        </button>
      </div>
      <div style={{ whiteSpace: 'pre-wrap' }}>{texto}</div>
      <div className="row">
        <Fontes ids={fontes} disc={d} />
        <span className="spacer" />
        <button
          type="button"
          className="btn sm primary"
          onClick={() => {
            onUsar(texto);
            setAberto(false);
          }}
        >
          Usar esta sugestão
        </button>
      </div>
    </div>
  );
}

const pilhaModais: number[] = [];
let proxModal = 1;

export function Modal({ titulo, onFechar, children, classe }: { titulo: string; onFechar: () => void; children: ReactNode; classe?: string }) {
  const fecharRef = useRef(onFechar);
  fecharRef.current = onFechar;
  useEffect(() => {
    const id = proxModal++;
    pilhaModais.push(id);
    // Só o modal do topo responde ao Esc (modal de ajuda aberto por cima de outro).
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pilhaModais[pilhaModais.length - 1] === id) {
        e.stopPropagation();
        fecharRef.current();
      }
    };
    document.addEventListener('keydown', esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      pilhaModais.splice(pilhaModais.indexOf(id), 1);
      document.body.style.overflow = prev;
    };
  }, []);
  return createPortal(
    <div className="modal-fundo" onMouseDown={(e) => e.target === e.currentTarget && onFechar()}>
      <div className={'modal' + (classe ? ' ' + classe : '')} role="dialog" aria-modal="true" aria-label={titulo}>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function modalAberto() {
  return pilhaModais.length;
}

export function Barra({ valor, max, rotulo }: { valor: number; max: number; rotulo: string }) {
  const pct = Math.min(100, (valor / max) * 100);
  const passou = valor > max;
  return (
    <div>
      <div className={'barra' + (passou ? ' estourou' : '')} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={valor} aria-label={rotulo}>
        <i style={{ width: pct + '%' }} />
      </div>
      <div className="barra-legenda">
        <span className="num">
          {fmtN(valor)} / {max}
        </span>
        <span className={passou ? '' : 'muted'} style={passou ? { color: 'var(--hot)', fontWeight: 600 } : undefined}>
          {passou ? `Passou ${fmtN(valor - max)}` : valor === max ? 'Completo' : `Faltam ${fmtN(max - valor)}`}
        </span>
      </div>
    </div>
  );
}

export const fmtN = (n: number) => (Math.round(n * 100) / 100).toString().replace('.', ',');
