import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DiscId } from '../data/tipos';
import type { Ajuda } from '../data/ajudas';
import { Fontes, Modal, useCamada } from './ui';

export interface OpcaoEscolha {
  id: string;
  nome: string;
  detalhe?: string;
}

/**
 * Lista suspensa com botão "?" em cada opção. O "?" abre a explicação sem
 * selecionar nada; ao fechar a explicação, a lista continua aberta onde estava.
 * No celular a lista vira uma folha que sobe da parte de baixo da tela.
 */
export function Escolha({
  rotulo,
  valor,
  opcoes,
  ajudas,
  onEscolher,
  placeholder = 'Escolha uma opção',
  disabled,
  disc,
  tipoAjuda,
}: {
  rotulo: string;
  valor: string;
  opcoes: OpcaoEscolha[];
  ajudas: Record<string, Ajuda>;
  onEscolher: (id: string) => void;
  placeholder?: string;
  disabled?: boolean;
  disc?: DiscId;
  tipoAjuda: string;
}) {
  const [aberta, setAberta] = useState(false);
  const [ajuda, setAjuda] = useState<string | null>(null);
  const [foco, setFoco] = useState(0);
  const [pos, setPos] = useState<{ left: number; top: number; width: number; maxH: number; acima: boolean } | null>(null);
  const [celular, setCelular] = useState(() => window.matchMedia('(max-width: 640px)').matches);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const listaRef = useRef<HTMLUListElement>(null);
  const atual = opcoes.find((o) => o.id === valor);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const f = () => setCelular(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, []);

  const posicionar = () => {
    const b = botaoRef.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    const abaixo = window.innerHeight - r.bottom - 12;
    const acimaEsp = r.top - 12;
    const acima = abaixo < 260 && acimaEsp > abaixo;
    setPos({ left: r.left, width: Math.max(r.width, 300), top: acima ? r.top - 4 : r.bottom + 4, maxH: Math.min(420, acima ? acimaEsp : abaixo), acima });
  };

  useLayoutEffect(() => {
    if (!aberta || celular) return;
    posicionar();
    const f = () => posicionar();
    window.addEventListener('resize', f);
    window.addEventListener('scroll', f, true);
    return () => {
      window.removeEventListener('resize', f);
      window.removeEventListener('scroll', f, true);
    };
  }, [aberta, celular]);

  // Fecha ao clicar fora (mas não enquanto a explicação está aberta).
  useEffect(() => {
    if (!aberta || ajuda) return;
    const fora = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (popRef.current?.contains(t) || botaoRef.current?.contains(t)) return;
      setAberta(false);
    };
    document.addEventListener('mousedown', fora);
    document.addEventListener('touchstart', fora);
    return () => {
      document.removeEventListener('mousedown', fora);
      document.removeEventListener('touchstart', fora);
    };
  }, [aberta, ajuda]);

  // Esc e o botão voltar do celular fecham a lista (a explicação é outra camada, por cima).
  useCamada(aberta, () => {
    setAberta(false);
    botaoRef.current?.focus();
  });

  useEffect(() => {
    if (!aberta) return;
    const i = Math.max(0, opcoes.findIndex((o) => o.id === valor));
    setFoco(i);
    requestAnimationFrame(() => {
      const el = listaRef.current?.querySelectorAll<HTMLButtonElement>('.escolha-opcao')[i];
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: 'nearest' });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberta]);

  const moverFoco = (i: number) => {
    const n = (i + opcoes.length) % opcoes.length;
    setFoco(n);
    listaRef.current?.querySelectorAll<HTMLButtonElement>('.escolha-opcao')[n]?.focus();
  };

  const escolher = (id: string) => {
    onEscolher(id);
    setAberta(false);
    botaoRef.current?.focus();
  };

  const fecharAjuda = () => {
    const id = ajuda;
    setAjuda(null);
    // Devolve o foco ao "?" de onde a explicação saiu: a lista segue igual.
    requestAnimationFrame(() => {
      const i = opcoes.findIndex((o) => o.id === id);
      listaRef.current?.querySelectorAll<HTMLButtonElement>('.escolha-ajuda')[i]?.focus({ preventScroll: true });
    });
  };

  const lista = (
    <ul className="escolha-lista" ref={listaRef} aria-label={rotulo}>
      {opcoes.map((o, i) => (
        <li key={o.id} className={'escolha-item' + (o.id === valor ? ' atual' : '')}>
          <button
            type="button"
            className="escolha-opcao"
            aria-current={o.id === valor ? 'true' : undefined}
            tabIndex={i === foco ? 0 : -1}
            onClick={() => escolher(o.id)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); moverFoco(i + 1); }
              if (e.key === 'ArrowUp') { e.preventDefault(); moverFoco(i - 1); }
              if (e.key === 'Home') { e.preventDefault(); moverFoco(0); }
              if (e.key === 'End') { e.preventDefault(); moverFoco(opcoes.length - 1); }
            }}
          >
            <span className="escolha-check" aria-hidden="true">{o.id === valor ? '✓' : ''}</span>
            <span className="escolha-nome">{o.nome}</span>
            {o.detalhe && <span className="escolha-detalhe">{o.detalhe}</span>}
          </button>
          {ajudas[o.id] && (
            <button
              type="button"
              className="escolha-ajuda"
              aria-label={`O que é ${o.nome}? Ver explicação e exemplo`}
              title="Ver explicação e exemplo"
              onClick={(e) => {
                e.stopPropagation();
                setAjuda(o.id);
              }}
            >
              ?
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  const opAjuda = ajuda ? opcoes.find((o) => o.id === ajuda) : null;
  const dadosAjuda = ajuda ? ajudas[ajuda] : null;

  return (
    <>
      <button
        type="button"
        ref={botaoRef}
        className="select escolha-botao"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={aberta}
        onClick={() => setAberta((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !aberta) { e.preventDefault(); setAberta(true); }
        }}
      >
        <span className={atual ? '' : 'muted'}>{atual ? atual.nome : placeholder}</span>
      </button>

      {aberta &&
        createPortal(
          celular ? (
            <div className="escolha-folha-fundo">
              <div className="escolha-folha" ref={popRef} role="dialog" aria-label={rotulo}>
                <div className="escolha-folha-cab">
                  <strong>{rotulo}</strong>
                  <span className="small muted">Toque em ? para ver a explicação</span>
                  <button type="button" className="btn sm ghost" aria-label="Fechar lista" onClick={() => setAberta(false)}>
                    ✕
                  </button>
                </div>
                {lista}
              </div>
            </div>
          ) : (
            pos && (
              <div
                ref={popRef}
                className="escolha-pop"
                style={{
                  left: Math.min(pos.left, window.innerWidth - pos.width - 8),
                  width: pos.width,
                  maxHeight: pos.maxH,
                  ...(pos.acima ? { bottom: window.innerHeight - pos.top } : { top: pos.top }),
                }}
              >
                <div className="escolha-dica small muted">Clique em ? para ver a explicação sem escolher</div>
                {lista}
              </div>
            )
          ),
          document.body,
        )}

      {opAjuda && dadosAjuda && (
        <Modal titulo={opAjuda.nome} onFechar={fecharAjuda} classe="modal-ajuda">
          <div className="row" style={{ alignItems: 'flex-start' }}>
            <div>
              <span className="small muted">{tipoAjuda}</span>
              <h2 style={{ margin: '0.1rem 0 0' }}>{opAjuda.nome}</h2>
            </div>
          </div>
          <div className="ajuda-bloco">
            <h3>Como funciona</h3>
            <p>{dadosAjuda.comoFunciona}</p>
          </div>
          <div className="ajuda-bloco">
            <h3>Quando usar</h3>
            <p>{dadosAjuda.quandoUsar}</p>
          </div>
          <div className="ajuda-bloco ajuda-exemplo">
            <h3>Exemplo no projeto da revista</h3>
            <p>{dadosAjuda.exemplo}</p>
            <p className="small ajuda-ia"><span aria-hidden="true">✦</span> Exemplo sugerido pela IA para o tema do projeto. Adapte à sua turma.</p>
          </div>
          <Fontes ids={dadosAjuda.fontes} disc={disc} />
          <div className="row" style={{ marginTop: '0.4rem' }}>
            <span className="spacer" />
            <button type="button" className="btn" onClick={fecharAjuda}>
              Voltar à lista
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
