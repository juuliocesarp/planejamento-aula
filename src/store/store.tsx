import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { PERFIS, type PerfilId } from '../data/base';
import type { DiscId, Placement } from '../data/tipos';
import { CAIXINHAS } from '../data/caixinhas';
import { AULAS_3BIM, LAYOUT_PROJETO } from '../data/aulas3bim';
import { SEMANAS, semanaGuiaParaPos } from '../data/calendario';
import { backend } from './backend';
import { novoDisc, novoProjeto, type AulaEstado, type DiscDoc, type FrentesDoc, type Modo, type ProjetoDoc } from './tipos';

const DISCS: DiscId[] = ['fis', 'geo', 'his', 'red', 'gl'];

interface Estado {
  perfil: PerfilId | null;
  carregando: boolean;
  erro: string | null;
  salvando: boolean;
  frentes: FrentesDoc;
  discs: Record<DiscId, DiscDoc>;
  projeto: ProjetoDoc;
}

interface Ctx extends Estado {
  demo: boolean;
  minhaDisc: DiscId | null;
  entrar(p: PerfilId, senha: string): Promise<void>;
  sair(): Promise<void>;
  escolherFrente(f: 'red' | 'gl'): void;
  atualizarDisc(d: DiscId, fn: (doc: DiscDoc) => DiscDoc): void;
  atualizarProjeto(fn: (doc: ProjetoDoc) => ProjetoDoc): void;
  recarregar(): Promise<void>;
}

const Contexto = createContext<Ctx | null>(null);

export function useStore() {
  const c = useContext(Contexto);
  if (!c) throw new Error('Store fora do provider');
  return c;
}

const discsVazios = () => Object.fromEntries(DISCS.map((d) => [d, novoDisc()])) as Record<DiscId, DiscDoc>;

export function discDoPerfil(p: PerfilId | null, frentes: FrentesDoc): DiscId | null {
  if (!p) return null;
  const perfil = PERFIS.find((x) => x.id === p)!;
  if (perfil.disc !== 'port') return perfil.disc;
  if (frentes.red === p) return 'red';
  if (frentes.gl === p) return 'gl';
  return null;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [st, setSt] = useState<Estado>(() => ({
    perfil: (sessionStorage.getItem('revista-perfil') as PerfilId) || null,
    carregando: false,
    erro: null,
    salvando: false,
    frentes: {},
    discs: discsVazios(),
    projeto: novoProjeto(),
  }));
  const pendentes = useRef<Record<string, unknown>>({});
  const timer = useRef<number | undefined>(undefined);
  const stRef = useRef(st);
  stRef.current = st;

  const recarregar = useCallback(async () => {
    const tudo = await backend.lerTudo();
    setSt((s) => {
      const discs = { ...s.discs };
      for (const d of DISCS) {
        if (pendentes.current['disc:' + d]) continue;
        const v = tudo['disc:' + d] as DiscDoc | undefined;
        if (v) discs[d] = { ...novoDisc(), ...v };
      }
      return {
        ...s,
        discs,
        frentes: (tudo['frentes'] as FrentesDoc) ?? s.frentes,
        projeto: pendentes.current['projeto'] ? s.projeto : { ...novoProjeto(), ...((tudo['projeto'] as ProjetoDoc) ?? {}) },
      };
    });
  }, []);

  const flush = useCallback(async () => {
    const lote = pendentes.current;
    pendentes.current = {};
    const p = stRef.current.perfil;
    if (!p || !Object.keys(lote).length) return;
    setSt((s) => ({ ...s, salvando: true }));
    try {
      for (const [k, v] of Object.entries(lote)) await backend.salvar(k, v, p);
      setSt((s) => ({ ...s, salvando: false, erro: null }));
    } catch (e) {
      Object.assign(pendentes.current, lote);
      setSt((s) => ({ ...s, salvando: false, erro: 'Não foi possível salvar agora. Vou tentar de novo.' }));
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, 4000);
      console.error(e);
    }
  }, []);

  const agendar = useCallback(
    (chave: string, dados: unknown) => {
      pendentes.current[chave] = dados;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, 700);
    },
    [flush],
  );

  // Ao reabrir com sessão salva, recarrega dados.
  useEffect(() => {
    if (st.perfil) {
      setSt((s) => ({ ...s, carregando: true }));
      recarregar()
        .catch(() => setSt((s) => ({ ...s, erro: 'Sessão expirada. Entre de novo.', perfil: null })))
        .finally(() => setSt((s) => ({ ...s, carregando: false })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza o que os colegas fizeram: ao voltar para a aba e a cada 45 s.
  useEffect(() => {
    if (!st.perfil) return;
    const f = () => document.visibilityState === 'visible' && recarregar().catch(() => {});
    document.addEventListener('visibilitychange', f);
    const i = window.setInterval(f, 45000);
    const antes = () => flush();
    window.addEventListener('beforeunload', antes);
    return () => {
      document.removeEventListener('visibilitychange', f);
      window.clearInterval(i);
      window.removeEventListener('beforeunload', antes);
    };
  }, [st.perfil, recarregar, flush]);

  const entrar = useCallback(
    async (p: PerfilId, senha: string) => {
      setSt((s) => ({ ...s, carregando: true, erro: null }));
      try {
        await backend.entrar(p, senha);
        sessionStorage.setItem('revista-perfil', p);
        setSt((s) => ({ ...s, perfil: p }));
        await recarregar();
      } finally {
        setSt((s) => ({ ...s, carregando: false }));
      }
    },
    [recarregar],
  );

  const sair = useCallback(async () => {
    await flush();
    await backend.sair();
    sessionStorage.removeItem('revista-perfil');
    setSt((s) => ({ ...s, perfil: null, discs: discsVazios(), projeto: novoProjeto(), frentes: {} }));
  }, [flush]);

  const escolherFrente = useCallback(
    (f: 'red' | 'gl') => {
      setSt((s) => {
        const frentes = { ...s.frentes, [f]: s.perfil! };
        const outra = f === 'red' ? 'gl' : 'red';
        const colega = PERFIS.find((x) => x.disc === 'port' && x.id !== s.perfil)!.id;
        if (!frentes[outra]) frentes[outra] = colega;
        agendar('frentes', frentes);
        return { ...s, frentes };
      });
    },
    [agendar],
  );

  const atualizarDisc = useCallback(
    (d: DiscId, fn: (doc: DiscDoc) => DiscDoc) => {
      setSt((s) => {
        const novo = fn(s.discs[d]);
        agendar('disc:' + d, novo);
        return { ...s, discs: { ...s.discs, [d]: novo } };
      });
    },
    [agendar],
  );

  const atualizarProjeto = useCallback(
    (fn: (doc: ProjetoDoc) => ProjetoDoc) => {
      setSt((s) => {
        const novo = fn(s.projeto);
        agendar('projeto', novo);
        return { ...s, projeto: novo };
      });
    },
    [agendar],
  );

  const valor = useMemo<Ctx>(
    () => ({
      ...st,
      demo: backend.demo,
      minhaDisc: discDoPerfil(st.perfil, st.frentes),
      entrar,
      sair,
      escolherFrente,
      atualizarDisc,
      atualizarProjeto,
      recarregar,
    }),
    [st, entrar, sair, escolherFrente, atualizarDisc, atualizarProjeto, recarregar],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

// ---------- Regras do calendário ----------

export const aulaChave = (bim: number, sem: number, n: number) => `${bim}-${sem}-${n}`;

function trilha(id: string) {
  if (id.startsWith('gl-gra')) return 'gl-gra';
  if (id.startsWith('gl-lit')) return 'gl-lit';
  return id.split('-')[0];
}

export function placementsDoModo(d: DiscId, modo: Modo): Record<string, Placement> {
  if (modo === 'vazio') return {};
  const doGuia = CAIXINHAS.filter((c) => c.disc === d && !c.projeto);
  const out: Record<string, Placement> = {};
  for (const c of doGuia) {
    const pos = semanaGuiaParaPos(c.semanaGuia);
    out[c.id] = { bim: pos.bim, sem: pos.sem, semanas: c.semanasGuia };
  }
  if (modo === 'referencia') return out;

  // Modo projeto: 3º bimestre reorganizado.
  const layout = LAYOUT_PROJETO[d];
  const noLayout = new Set(layout.map(([id]) => id));
  const deslocadas = doGuia.filter((c) => out[c.id].bim === 3 && !noLayout.has(c.id));
  for (const id of noLayout) delete out[id];
  for (const c of deslocadas) delete out[c.id];
  for (const [id, sem, semanas] of layout) out[id] = { bim: 3, sem, semanas };

  // Deslocadas vão para o início do 4º bimestre, empurrando as do 4º (por trilha).
  const total4 = SEMANAS[4].length;
  const trilhas = new Set([...deslocadas, ...doGuia.filter((c) => out[c.id]?.bim === 4)].map((c) => trilha(c.id)));
  for (const t of trilhas) {
    const fila = [
      ...deslocadas.filter((c) => trilha(c.id) === t),
      ...doGuia.filter((c) => trilha(c.id) === t && out[c.id]?.bim === 4).sort((a, b) => a.semanaGuia - b.semanaGuia),
    ];
    let cursor = 1;
    for (const c of fila) {
      if (cursor + c.semanasGuia - 1 <= total4) {
        out[c.id] = { bim: 4, sem: cursor, semanas: c.semanasGuia };
        cursor += c.semanasGuia;
      } else delete out[c.id];
    }
  }
  return out;
}

export function caixinhasNaSemana(doc: DiscDoc, bim: number, sem: number) {
  return Object.entries(doc.placements)
    .filter(([, p]) => p.bim === bim && sem >= p.sem && sem < p.sem + p.semanas)
    .map(([id, p]) => ({ id, p, inicio: p.sem === sem }));
}

export function aulaPronta(d: DiscId, doc: DiscDoc, bim: number, sem: number, n: number): AulaEstado | null {
  if (doc.modo !== 'projeto' || bim !== 3) return null;
  const t = AULAS_3BIM[d][sem - 1]?.[n - 1];
  if (!t) return null;
  return {
    titulo: t.titulo,
    metodologia: t.metodologia,
    momentos: t.momentos.map((m) => ({ ...m, recursos: [...m.recursos] })),
    duracao: 50,
    caixinhas: [t.caixinha],
    dica: t.dica,
    fontes: t.fontes,
    origem: 'ia',
  };
}

export function aulaAtual(d: DiscId, doc: DiscDoc, bim: number, sem: number, n: number): AulaEstado {
  const salva = doc.aulas[aulaChave(bim, sem, n)];
  if (salva) return salva;
  const pronta = aulaPronta(d, doc, bim, sem, n);
  if (pronta) return pronta;
  return {
    titulo: '',
    metodologia: '',
    momentos: [],
    duracao: 50,
    caixinhas: caixinhasNaSemana(doc, bim, sem).map((c) => c.id),
    fontes: [],
    origem: 'manual',
  };
}
