import { useEffect, useRef, useState } from 'react';
import { PERFIS, PROJETO, disc, type PerfilId } from './data/base';
import { useStore } from './store/store';
import { Avatar, DiscTag, useCamada } from './components/ui';
import { Recorte } from './pages/Recorte';
import { Objetivos } from './pages/Objetivos';
import { Conteudos } from './pages/Conteudos';
import { Avaliacao } from './pages/Avaliacao';
import { Justificativa } from './pages/Justificativa';
import { Documento, DocumentoImpressao, type PedidoDoc } from './pages/Documento';
import { VisaoGeral } from './pages/VisaoGeral';

export type Tela = 'recorte' | 'objetivos' | 'conteudos' | 'avaliacao' | 'justificativa' | 'documento' | 'visao';

const ETAPAS: { id: Tela; nome: string; curto: string }[] = [
  { id: 'recorte', nome: 'Recorte', curto: 'Recorte' },
  { id: 'objetivos', nome: 'Objetivos', curto: 'Objetivos' },
  { id: 'conteudos', nome: 'Conteúdos e aulas', curto: 'Aulas' },
  { id: 'avaliacao', nome: 'Avaliação', curto: 'Avaliação' },
  { id: 'justificativa', nome: 'Justificativa', curto: 'Justific.' },
  { id: 'documento', nome: 'Revisar e gerar documento', curto: 'Documento' },
];

function usePreferenciasVisuais() {
  const [tema, setTema] = useState(() => localStorage.getItem('revista-tema') || 'revista');
  const [modo, setModo] = useState(() => localStorage.getItem('revista-modo') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    document.documentElement.dataset.mode = modo;
    try {
      localStorage.setItem('revista-tema', tema);
      localStorage.setItem('revista-modo', modo);
    } catch {
      /* sem armazenamento */
    }
  }, [tema, modo]);
  return { tema, setTema, modo, setModo };
}

export default function App() {
  const vis = usePreferenciasVisuais();
  const s = useStore();
  const [tela, setTela] = useState<Tela>(() => (location.hash.slice(1) as Tela) || 'conteudos');
  const [doc, setDoc] = useState<PedidoDoc | null>(null);

  // A cor da disciplina de quem está usando vira a cor de destaque do tema Sóbrio.
  useEffect(() => {
    document.documentElement.dataset.disc = s.minhaDisc ?? '';
  }, [s.minhaDisc]);
  useEffect(() => {
    const f = () => setTela((location.hash.slice(1) as Tela) || 'conteudos');
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  // O documento para imprimir ocupa a tela toda: o botão voltar do celular volta ao sistema.
  useCamada(!!doc, () => setDoc(null));
  useEffect(() => {
    if (doc) scrollTo({ top: 0 });
  }, [doc]);
  const ir = (t: Tela) => {
    location.hash = t;
    scrollTo({ top: 0 });
  };

  if (!s.perfil) return <Login />;
  if (s.carregando) return <p style={{ padding: '2rem' }}>Carregando o planejamento…</p>;
  if (!s.minhaDisc) return <EscolhaFrente />;
  if (doc) return <DocumentoImpressao pedido={doc} onVoltar={() => setDoc(null)} />;

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <div className="marca">
            Revista
            <small className="esconde-mobile">{PROJETO.tema}</small>
          </div>
          <span className="spacer" />
          <button className="btn sm" onClick={() => ir('visao')} aria-current={tela === 'visao' ? 'page' : undefined}>
            Visão geral do projeto
          </button>
          <MenuPerfil {...vis} />
        </div>
        <nav className="etapas" aria-label="Etapas do plano">
          {ETAPAS.map((e, i) => (
            <button key={e.id} className="etapa" aria-current={tela === e.id ? 'step' : undefined} onClick={() => ir(e.id)}>
              <span className="n">{i + 1}</span>
              <span className="esconde-mobile">{e.nome}</span>
              <span className="curto">
                {e.curto}
              </span>
            </button>
          ))}
        </nav>
      </header>
      {s.demo && (
        <p className="alerta" style={{ maxWidth: '90rem', margin: '0.6rem auto 0', borderRadius: 0 }}>
          Modo de demonstração: o que você faz fica salvo só neste navegador.
        </p>
      )}
      {s.erro && (
        <p className="alerta" role="alert" style={{ maxWidth: '90rem', margin: '0.6rem auto 0' }}>
          {s.erro}
        </p>
      )}
      <main className="main">
        {tela === 'recorte' && <Recorte ir={ir} />}
        {tela === 'objetivos' && <Objetivos />}
        {tela === 'conteudos' && <Conteudos />}
        {tela === 'avaliacao' && <Avaliacao />}
        {tela === 'justificativa' && <Justificativa />}
        {tela === 'documento' && <Documento onGerar={setDoc} />}
        {tela === 'visao' && <VisaoGeral onGerar={setDoc} />}
      </main>
    </>
  );
}

function corDoPerfil(p: PerfilId, frentes: { red?: PerfilId; gl?: PerfilId }) {
  const perfil = PERFIS.find((x) => x.id === p)!;
  const d = perfil.disc !== 'port' ? perfil.disc : frentes.red === p ? 'red' : frentes.gl === p ? 'gl' : null;
  return d ? `var(${disc(d).cor})` : 'var(--ink-2)';
}

function Login() {
  const s = useStore();
  const [sel, setSel] = useState<PerfilId | null>(null);
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const senhaRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (sel) senhaRef.current?.focus();
  }, [sel]);
  return (
    <div className="login">
      <div className="login-hero">
        <div className="thermal-rule" aria-hidden />
        <p className="tema">{PROJETO.tema}</p>
        <p className="muted" style={{ maxWidth: '55ch' }}>
          Planejamento interdisciplinar da revista da {PROJETO.serie}: Física, Geografia, História, Redação, Gramática e Literatura. Trabalho de {PROJETO.disciplinaFaculdade}.
        </p>
        <h1 style={{ fontSize: '1.3rem', marginTop: '1.5rem' }}>Quem está planejando?</h1>
      </div>
      <div>
        <div className="perfis" role="group" aria-label="Perfis">
          {PERFIS.map((p) => (
            <button key={p.id} className="perfil-card" aria-pressed={sel === p.id} onClick={() => setSel(p.id)}>
              <Avatar perfil={p} cor={corDoPerfil(p.id, s.frentes)} grande />
              <strong>{p.nome}</strong>
              <span className="small muted">{p.disc === 'port' ? 'Português' : disc(p.disc).nome}</span>
            </button>
          ))}
        </div>
        {sel && (
          <form
            className="senha-box stack"
            onSubmit={async (e) => {
              e.preventDefault();
              setErro('');
              try {
                await s.entrar(sel, senha);
              } catch (err) {
                setErro((err as Error).message);
              }
            }}
          >
            <label className="field">
              <span>Senha de {PERFIS.find((p) => p.id === sel)!.nome}</span>
              <input ref={senhaRef} className="input" type="password" inputMode="numeric" autoComplete="off" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </label>
            {erro && (
              <p className="alerta" role="alert">
                {erro}
              </p>
            )}
            <div>
              <button className="btn primary" disabled={!senha || s.carregando}>
                {s.carregando ? 'Entrando…' : 'Entrar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function EscolhaFrente() {
  const s = useStore();
  const perfil = PERFIS.find((p) => p.id === s.perfil)!;
  const ocupada = (f: 'red' | 'gl') => s.frentes[f] && s.frentes[f] !== s.perfil;
  return (
    <div className="main" style={{ maxWidth: '46rem' }}>
      <div className="thermal-rule" aria-hidden />
      <h1>Olá, {perfil.nome}. Qual frente de Português é sua?</h1>
      <p className="muted">
        Português está dividido em duas disciplinas. Quem entra primeiro escolhe, e a outra fica com a colega. Cada frente tem o próprio calendário e a própria avaliação de 10 pontos.
      </p>
      <div className="grid2" style={{ marginTop: '1rem' }}>
        {(['red', 'gl'] as const).map((f) => (
          <button key={f} className="perfil-card" disabled={!!ocupada(f)} onClick={() => s.escolherFrente(f)} style={ocupada(f) ? { opacity: 0.5 } : undefined}>
            <DiscTag d={f} />
            <span className="small">
              {f === 'red'
                ? 'Gêneros jornalísticos, argumentação, curadoria de fontes e todo o processo editorial da revista.'
                : 'Análise linguística, operadores argumentativos, revisão e a literatura do século XIX.'}
            </span>
            {ocupada(f) && <span className="small">Já escolhida pela colega.</span>}
          </button>
        ))}
      </div>
      <p style={{ marginTop: '1.5rem' }}>
        <button className="btn ghost" onClick={() => s.sair()}>
          Trocar de perfil
        </button>
      </p>
    </div>
  );
}

function MenuPerfil({ tema, setTema, modo, setModo }: ReturnType<typeof usePreferenciasVisuais>) {
  const s = useStore();
  const [aberto, setAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const perfil = PERFIS.find((p) => p.id === s.perfil)!;
  useCamada(aberto, () => setAberto(false));
  useEffect(() => {
    if (!aberto) return;
    const f = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setAberto(false);
    document.addEventListener('click', f);
    return () => document.removeEventListener('click', f);
  }, [aberto]);
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button className="btn ghost sm" onClick={() => setAberto((a) => !a)} aria-expanded={aberto} aria-label="Menu do perfil">
        <Avatar perfil={perfil} cor={`var(${disc(s.minhaDisc!).cor})`} />
      </button>
      {aberto && (
        <div className="menu-pop">
          <div>
            <strong>{perfil.nome}</strong>
            <div>
              <DiscTag d={s.minhaDisc!} />
            </div>
            <span className="small muted">{s.salvando ? 'Salvando…' : 'Tudo salvo'}</span>
          </div>
          <div className="field">
            <span>Tema</span>
            <div className="seg">
              <button aria-pressed={tema === 'revista'} onClick={() => setTema('revista')}>
                Revista
              </button>
              <button aria-pressed={tema === 'sobrio'} onClick={() => setTema('sobrio')}>
                Sóbrio
              </button>
            </div>
          </div>
          <div className="field">
            <span>Modo</span>
            <div className="seg">
              <button aria-pressed={modo === 'light'} onClick={() => setModo('light')}>
                Claro
              </button>
              <button aria-pressed={modo === 'dark'} onClick={() => setModo('dark')}>
                Escuro
              </button>
            </div>
          </div>
          <button className="btn sm" onClick={() => s.sair()}>
            Sair e trocar de perfil
          </button>
        </div>
      )}
    </div>
  );
}
