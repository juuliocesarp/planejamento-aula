import { useCallback, useEffect, useMemo, useState } from 'react';
import { backend, PRAZO_VOTACAO } from '../store/backend';
import { useStore } from '../store/store';
import type { CampoVoto, PropostaOutro, Resultado } from '../store/tipos';
import { VerSugestao } from './ui';
import { PERFIS } from '../data/base';

type Aba = 'minha' | 'outras' | 'resultado' | 'oficial';

function embaralhar<T>(arr: T[], semente: string) {
  let h = 0;
  for (const c of semente) h = (h * 31 + c.charCodeAt(0)) | 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) | 0;
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function Votacao({ campo, titulo, sugestao }: { campo: CampoVoto; titulo: string; sugestao: { texto: string; fontes: string[] } }) {
  const s = useStore();
  const [aba, setAba] = useState<Aba>('minha');
  const [minha, setMinha] = useState('');
  const [salva, setSalva] = useState('');
  const [outras, setOutras] = useState<PropostaOutro[]>([]);
  const [voto, setVoto] = useState<string | null>(null);
  const [res, setRes] = useState<Resultado | null>(null);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      const [m, o, v, r] = await Promise.all([backend.minhaProposta(campo), backend.propostasOutros(campo), backend.meuVoto(campo), backend.resultado(campo)]);
      setMinha((atual) => (atual === '' || atual === salva ? m : atual));
      setSalva(m);
      setOutras(o);
      setVoto(v);
      setRes(r);
    } catch (e) {
      setErro('Não foi possível carregar a votação: ' + (e as Error).message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campo]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const ordem = useMemo(() => embaralhar(outras, (s.perfil ?? '') + campo), [outras, s.perfil, campo]);
  const oficial = s.projeto[campo];
  const unificada = s.projeto.unificada[campo];
  const empate = res?.liberado && res.contagem.length > 1 && res.contagem[0].votos > 0 && res.contagem[0].votos === res.contagem[1].votos;
  const vencedora = res?.liberado && res.contagem[0]?.votos > 0 && !empate ? res.contagem[0] : null;

  const salvarOficial = (valor: string) =>
    s.atualizarProjeto((p) => ({ ...p, [campo]: { valor, origem: 'manual', por: s.perfil!, em: new Date().toISOString() } }));

  return (
    <section className="card">
      <h2>{titulo}</h2>
      <p className="small muted">
        Texto do projeto inteiro. Cada pessoa escreve uma proposta, as propostas aparecem anônimas e cada um vota em uma proposta de outra pessoa. A contagem só aparece quando os 5 votarem ou
        depois de {PRAZO_VOTACAO.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}.
      </p>
      <div className="tabs" role="tablist">
        {(
          [
            ['minha', 'Minha proposta'],
            ['outras', `Propostas dos colegas (${outras.length})`],
            ['resultado', 'Resultado'],
            ['oficial', 'Texto oficial'],
          ] as [Aba, string][]
        ).map(([id, nome]) => (
          <button
            key={id}
            role="tab"
            className="tab"
            aria-selected={aba === id}
            onClick={() => {
              setAba(id);
              carregar();
            }}
          >
            {nome}
          </button>
        ))}
      </div>
      {erro && <p className="alerta">{erro}</p>}

      {aba === 'minha' && (
        <div className="stack">
          <textarea className="textarea" style={{ minHeight: '11rem' }} value={minha} onChange={(e) => setMinha(e.target.value)} placeholder="Escreva a sua proposta. Você pode editar quando quiser, mesmo depois de enviar." />
          <div className="row">
            <button
              className="btn primary"
              disabled={minha === salva}
              onClick={async () => {
                try {
                  await backend.salvarProposta(campo, minha);
                  setSalva(minha);
                } catch (e) {
                  setErro((e as Error).message);
                }
              }}
            >
              {salva ? 'Salvar alterações' : 'Enviar proposta'}
            </button>
            {minha === salva && salva && <span className="small muted">Proposta enviada.</span>}
          </div>
          <VerSugestao texto={sugestao.texto} fontes={sugestao.fontes} onUsar={(t) => setMinha(t)} />
        </div>
      )}

      {aba === 'outras' && (
        <div className="stack">
          {!ordem.length && <p className="muted">Nenhum colega enviou proposta ainda. Combinem pelo WhatsApp.</p>}
          {ordem.map((p, i) => (
            <div key={p.id} className={'proposta' + (voto === p.id ? ' votada' : '')}>
              <p className="small muted" style={{ margin: '0 0 0.4rem' }}>
                Proposta {String.fromCharCode(65 + i)}
              </p>
              {p.texto}
              <div className="row" style={{ marginTop: '0.6rem' }}>
                <button
                  className={'btn sm' + (voto === p.id ? ' primary' : '')}
                  onClick={async () => {
                    try {
                      await backend.votar(campo, p.id);
                      setVoto(p.id);
                      carregar();
                    } catch (e) {
                      setErro((e as Error).message);
                    }
                  }}
                >
                  {voto === p.id ? 'Seu voto' : 'Votar nesta'}
                </button>
              </div>
            </div>
          ))}
          <p className="small muted">Você vê só as propostas dos outros. Pode trocar o voto enquanto quiser.</p>
        </div>
      )}

      {aba === 'resultado' && res && (
        <div className="stack">
          {!res.liberado ? (
            <p>
              Votos recebidos: <strong className="num">{res.votos}</strong> de {PERFIS.length}. A contagem fica oculta até todos votarem ou até o prazo.
            </p>
          ) : (
            <>
              {res.contagem.map((c, i) => (
                <div key={c.id} className="proposta">
                  <p className="small muted" style={{ margin: '0 0 0.4rem' }}>
                    {c.votos} {c.votos === 1 ? 'voto' : 'votos'} {i === 0 && vencedora ? '· mais votada' : ''}
                  </p>
                  {c.texto}
                </div>
              ))}
              {vencedora && (
                <button className="btn primary" onClick={() => salvarOficial(vencedora.texto)}>
                  Usar a mais votada como texto oficial
                </button>
              )}
              {empate && <p className="alerta">Deu empate. Alguém do grupo pode escrever a proposta unificada abaixo, com base nas propostas empatadas.</p>}
            </>
          )}
          <Unificada campo={campo} valor={unificada} onUsar={() => salvarOficial(unificada)} />
        </div>
      )}

      {aba === 'oficial' && (
        <div className="stack">
          <textarea className="textarea" style={{ minHeight: '12rem' }} value={oficial.valor} onChange={(e) => salvarOficial(e.target.value)} placeholder="Ainda sem texto oficial. Use a mais votada, a unificada ou escreva aqui." />
          {oficial.por && (
            <span className="small muted">
              Última edição por {PERFIS.find((p) => p.id === oficial.por)?.nome} em {new Date(oficial.em!).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </span>
          )}
          <Unificada campo={campo} valor={unificada} onUsar={() => salvarOficial(unificada)} />
        </div>
      )}
    </section>
  );
}

function Unificada({ campo, valor, onUsar }: { campo: CampoVoto; valor: string; onUsar: () => void }) {
  const s = useStore();
  return (
    <details>
      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>Proposta unificada (qualquer pessoa edita)</summary>
      <div className="stack" style={{ marginTop: '0.6rem' }}>
        <textarea
          className="textarea"
          value={valor}
          onChange={(e) => s.atualizarProjeto((p) => ({ ...p, unificada: { ...p.unificada, [campo]: e.target.value } }))}
          placeholder="Escreva aqui uma proposta que junte as ideias das propostas enviadas."
        />
        <div>
          <button className="btn sm" disabled={!valor.trim()} onClick={onUsar}>
            Usar a unificada como texto oficial
          </button>
        </div>
      </div>
    </details>
  );
}
