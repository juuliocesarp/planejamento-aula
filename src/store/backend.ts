import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PERFIS, SENHA, type PerfilId } from '../data/base';
import type { CampoVoto, PropostaOutro, Resultado } from './tipos';

export const PRAZO_VOTACAO = new Date('2026-11-23T14:00:00-03:00');
const EMAIL = (p: PerfilId) => `${p}@example.com`;

export interface Backend {
  demo: boolean;
  entrar(p: PerfilId, senha: string): Promise<void>;
  sair(): Promise<void>;
  lerTudo(): Promise<Record<string, unknown>>;
  salvar(chave: string, dados: unknown, por: PerfilId): Promise<void>;
  minhaProposta(campo: CampoVoto): Promise<string>;
  salvarProposta(campo: CampoVoto, texto: string): Promise<void>;
  propostasOutros(campo: CampoVoto): Promise<PropostaOutro[]>;
  meuVoto(campo: CampoVoto): Promise<string | null>;
  votar(campo: CampoVoto, propostaId: string): Promise<void>;
  resultado(campo: CampoVoto): Promise<Resultado>;
}

// ---------- Supabase ----------
class SupabaseBackend implements Backend {
  demo = false;
  private sb: SupabaseClient;
  constructor(url: string, key: string) {
    this.sb = createClient(url, key, { auth: { persistSession: true, storageKey: 'revista-auth' } });
  }
  async entrar(p: PerfilId, senha: string) {
    if (senha !== SENHA) throw new Error('Senha incorreta.');
    const email = EMAIL(p);
    let r = await this.sb.auth.signInWithPassword({ email, password: senha });
    if (r.error) {
      const s = await this.sb.auth.signUp({ email, password: senha });
      if (s.error && !/registered/i.test(s.error.message)) throw new Error('Não foi possível entrar: ' + s.error.message);
      r = await this.sb.auth.signInWithPassword({ email, password: senha });
      if (r.error) throw new Error('Não foi possível entrar: ' + r.error.message);
    }
  }
  async sair() {
    await this.sb.auth.signOut();
  }
  async lerTudo() {
    const { data, error } = await this.sb.from('docs').select('chave, dados');
    if (error) throw error;
    return Object.fromEntries((data ?? []).map((d) => [d.chave, d.dados]));
  }
  async salvar(chave: string, dados: unknown, por: PerfilId) {
    const { error } = await this.sb.from('docs').upsert({ chave, dados, atualizado_por: por, atualizado_em: new Date().toISOString() });
    if (error) throw error;
  }
  private async rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
    const { data, error } = await this.sb.rpc(fn, args);
    if (error) throw error;
    return data as T;
  }
  minhaProposta(campo: CampoVoto) {
    return this.rpc<string | null>('minha_proposta', { p_campo: campo }).then((t) => t ?? '');
  }
  async salvarProposta(campo: CampoVoto, texto: string) {
    await this.rpc('salvar_proposta', { p_campo: campo, p_texto: texto });
  }
  propostasOutros(campo: CampoVoto) {
    return this.rpc<PropostaOutro[]>('propostas_outros', { p_campo: campo }).then((r) => r ?? []);
  }
  meuVoto(campo: CampoVoto) {
    return this.rpc<string | null>('meu_voto', { p_campo: campo });
  }
  async votar(campo: CampoVoto, propostaId: string) {
    await this.rpc('votar', { p_campo: campo, p_proposta: propostaId });
  }
  async resultado(campo: CampoVoto): Promise<Resultado> {
    const r = await this.rpc<{ liberado: boolean; votos: number; contagem: Resultado['contagem'] }>('resultado', { p_campo: campo });
    return { liberado: r.liberado, votos: r.votos, contagem: r.contagem ?? [] };
  }
}

// ---------- Demonstração (navegador) ----------
interface DemoVoto {
  propostas: Record<string, { autor: PerfilId; texto: string }>;
  votos: Record<string, string>;
}
class DemoBackend implements Backend {
  demo = true;
  private atual: PerfilId | null = null;
  private ler<T>(k: string, padrao: T): T {
    try {
      const v = localStorage.getItem('revista-demo:' + k);
      return v ? (JSON.parse(v) as T) : padrao;
    } catch {
      return padrao;
    }
  }
  private gravar(k: string, v: unknown) {
    try {
      localStorage.setItem('revista-demo:' + k, JSON.stringify(v));
    } catch {
      /* armazenamento indisponível */
    }
  }
  async entrar(p: PerfilId, senha: string) {
    if (senha !== SENHA) throw new Error('Senha incorreta.');
    this.atual = p;
  }
  async sair() {
    this.atual = null;
  }
  async lerTudo() {
    return this.ler<Record<string, unknown>>('docs', {});
  }
  async salvar(chave: string, dados: unknown) {
    const docs = this.ler<Record<string, unknown>>('docs', {});
    docs[chave] = dados;
    this.gravar('docs', docs);
  }
  private voto(campo: CampoVoto) {
    return this.ler<DemoVoto>('voto:' + campo, { propostas: {}, votos: {} });
  }
  async minhaProposta(campo: CampoVoto) {
    return this.voto(campo).propostas[this.atual!]?.texto ?? '';
  }
  async salvarProposta(campo: CampoVoto, texto: string) {
    const v = this.voto(campo);
    v.propostas[this.atual!] = { autor: this.atual!, texto };
    this.gravar('voto:' + campo, v);
  }
  async propostasOutros(campo: CampoVoto) {
    const v = this.voto(campo);
    return Object.entries(v.propostas)
      .filter(([id, p]) => id !== this.atual && p.texto.trim())
      .map(([id, p]) => ({ id, texto: p.texto }));
  }
  async meuVoto(campo: CampoVoto) {
    return this.voto(campo).votos[this.atual!] ?? null;
  }
  async votar(campo: CampoVoto, propostaId: string) {
    if (propostaId === this.atual) throw new Error('Não é possível votar na própria proposta.');
    const v = this.voto(campo);
    v.votos[this.atual!] = propostaId;
    this.gravar('voto:' + campo, v);
  }
  async resultado(campo: CampoVoto): Promise<Resultado> {
    const v = this.voto(campo);
    const votos = Object.keys(v.votos).length;
    const liberado = votos >= PERFIS.length || new Date() >= PRAZO_VOTACAO;
    const contagem = Object.entries(v.propostas)
      .map(([id, p]) => ({ id, texto: p.texto, votos: Object.values(v.votos).filter((x) => x === id).length }))
      .sort((a, b) => b.votos - a.votos);
    return { liberado, votos, contagem: liberado ? contagem : [] };
  }
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const backend: Backend = url && key ? new SupabaseBackend(url, key) : new DemoBackend();
