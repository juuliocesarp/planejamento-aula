import { useState, type ReactNode } from 'react';
import { ALUNOS_POR_TURMA, DISCIPLINAS, FONTES, FONTES_CURRICULO, PERFIS, PROJETO, TURMAS, disc, expandirFontes } from '../data/base';
import { BIMESTRES, MESES, SEMANAS, fmt, mesDe, type Semana } from '../data/calendario';
import { caixinha } from '../data/caixinhas';
import { FASES } from '../data/aulas3bim';
import { formaAvaliacao, metodologia } from '../data/metodologias';
import type { DiscId } from '../data/tipos';
import { aulaAtual, caixinhasNaSemana, useStore } from '../store/store';
import type { DiscDoc, ProjetoDoc } from '../store/tipos';
import { DiscTag } from '../components/ui';
import { itensDisciplina, percentual } from '../store/progresso';

export interface PedidoDoc {
  tipo: 'disciplina' | 'projeto';
  disc: DiscId;
  modo: 'bimestres' | 'meses' | 'semanas';
  bims: number[];
  meses: number[];
  bim: number;
  de: number;
  ate: number;
}

export function Documento({ onGerar }: { onGerar: (p: PedidoDoc) => void }) {
  const s = useStore();
  const d = s.minhaDisc!;
  const doc = s.discs[d];
  const [p, setP] = useState<PedidoDoc>({ tipo: 'disciplina', disc: d, modo: 'bimestres', bims: [3], meses: [7, 8], bim: 3, de: 1, ate: SEMANAS[3].length });
  const set = (m: Partial<PedidoDoc>) => setP((x) => ({ ...x, ...m }));
  const itens = itensDisciplina(d, doc);
  const pend = itens.filter((i) => i.feito < 1);
  const pct = percentual(itens);

  return (
    <>
      <div className="page-head">
        <h1>Revisar e gerar documento</h1>
        <p>Confira o que ainda falta e exporte o documento da sua disciplina. Ele abre numa página pronta para imprimir ou salvar em PDF.</p>
      </div>

      <section className="card">
        <div className="row">
          <h2 style={{ margin: 0 }}>Antes de finalizar</h2>
          <span className="spacer" />
          <span className="num">{pct}% do plano de {disc(d).curto}</span>
        </div>
        <div style={{ margin: '0.7rem 0 0.9rem' }}>
          <div className="barra" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Progresso do plano">
            <i style={{ width: pct + '%' }} />
          </div>
        </div>
        <p className="nota-ok small">
          ℹ As pendências <strong>não impedem</strong> você de exportar o documento nem de continuar trabalhando. Elas só mostram o que ainda falta. No documento, o que estiver vazio aparece marcado como
          "não preenchido".
        </p>
        <ul className="checklist">
          {itens.map((x) => (
            <li key={x.texto} className={x.feito >= 1 ? 'ok' : 'falta'}>
              <span aria-hidden className="check-ico">
                {x.feito >= 1 ? '✓' : '○'}
              </span>
              <span>{x.texto}</span>
              {x.feito < 1 && (
                <a className="small resolver" href={'#' + x.etapa}>
                  Resolver
                </a>
              )}
            </li>
          ))}
        </ul>
        {!pend.length && <p className="small" style={{ color: 'var(--ok)', margin: 0 }}>Tudo pronto na sua disciplina. 🎉</p>}
        <p className="small muted" style={{ margin: '0.6rem 0 0' }}>
          O documento do projeto inteiro (as 5 disciplinas juntas e o roteiro de apresentação) fica na <a href="#visao">Visão geral do projeto</a>, e é liberado quando todos completarem os planos.
        </p>
      </section>

      <section className="card stack">
        <h2>
          Exportar seu documento de <DiscTag d={d} />
        </h2>
        <h3 style={{ margin: 0 }}>Período</h3>
        <div className="seg">
          {(
            [
              ['bimestres', 'Bimestres'],
              ['meses', 'Meses'],
              ['semanas', 'Semanas'],
            ] as const
          ).map(([id, nome]) => (
            <button key={id} aria-pressed={p.modo === id} onClick={() => set({ modo: id })}>
              {nome}
            </button>
          ))}
        </div>
        {p.modo === 'bimestres' && (
          <div className="row">
            {BIMESTRES.map((b) => (
              <label key={b.n} className="row">
                <input type="checkbox" checked={p.bims.includes(b.n)} onChange={() => set({ bims: p.bims.includes(b.n) ? p.bims.filter((x) => x !== b.n) : [...p.bims, b.n].sort() })} />
                {b.n}º bimestre{b.n === 3 ? ' (projeto)' : ''}
              </label>
            ))}
          </div>
        )}
        {p.modo === 'meses' && (
          <div className="row">
            {MESES.map((m, i) =>
              i < 1 ? null : (
                <label key={m} className="row">
                  <input type="checkbox" checked={p.meses.includes(i)} onChange={() => set({ meses: p.meses.includes(i) ? p.meses.filter((x) => x !== i) : [...p.meses, i].sort((a, b) => a - b) })} />
                  {m}
                </label>
              ),
            )}
          </div>
        )}
        {p.modo === 'semanas' && (
          <div className="row">
            <select className="select" style={{ width: 'auto' }} value={p.bim} onChange={(e) => set({ bim: Number(e.target.value), de: 1, ate: SEMANAS[Number(e.target.value)].length })}>
              {BIMESTRES.map((b) => (
                <option key={b.n} value={b.n}>
                  {b.n}º bimestre
                </option>
              ))}
            </select>
            da semana
            <select className="select" style={{ width: 'auto' }} value={p.de} onChange={(e) => set({ de: Number(e.target.value) })}>
              {SEMANAS[p.bim].map((w) => (
                <option key={w.n} value={w.n}>
                  {w.n} ({fmt(w.inicio)})
                </option>
              ))}
            </select>
            até a semana
            <select className="select" style={{ width: 'auto' }} value={p.ate} onChange={(e) => set({ ate: Number(e.target.value) })}>
              {SEMANAS[p.bim]
                .filter((w) => w.n >= p.de)
                .map((w) => (
                  <option key={w.n} value={w.n}>
                    {w.n} ({fmt(w.fim)})
                  </option>
                ))}
            </select>
          </div>
        )}
        <div>
          <button className="btn primary" onClick={() => onGerar({ ...p, tipo: 'disciplina', disc: d })} disabled={!semanasDoPedido(p).length}>
            Exportar documento de {disc(d).curto}
          </button>
        </div>
      </section>
    </>
  );
}

function semanasDoPedido(p: PedidoDoc): Semana[] {
  const todas = BIMESTRES.flatMap((b) => SEMANAS[b.n]);
  if (p.modo === 'bimestres') return todas.filter((w) => p.bims.includes(w.bim));
  if (p.modo === 'meses') return todas.filter((w) => p.meses.includes(mesDe(w.inicio)) || p.meses.includes(mesDe(w.fim)));
  return SEMANAS[p.bim].filter((w) => w.n >= p.de && w.n <= p.ate);
}

function descreverPeriodo(p: PedidoDoc, ws: Semana[]) {
  if (!ws.length) return '';
  if (p.modo === 'bimestres') return p.bims.map((b) => `${b}º bimestre`).join(', ') + ` (${fmt(ws[0].inicio)} a ${fmt(ws[ws.length - 1].fim)}/2026)`;
  return `${fmt(ws[0].inicio)} a ${fmt(ws[ws.length - 1].fim)} de 2026`;
}

const NP = () => <span className="nao-preenchido">não preenchido</span>;
const T = ({ v }: { v: string }) => (v.trim() ? <div style={{ whiteSpace: 'pre-wrap' }}>{v}</div> : <NP />);

export function DocumentoImpressao({ pedido, onVoltar }: { pedido: PedidoDoc; onVoltar: () => void }) {
  const s = useStore();
  const ws = semanasDoPedido(pedido);
  const discs: DiscId[] = pedido.tipo === 'projeto' ? DISCIPLINAS.map((x) => x.id) : [pedido.disc];
  const periodo = descreverPeriodo(pedido, ws);
  const fontes = new Set<string>(['grupo', 'freire', 'fazenda', 'marcuschi', 'seedf', 'bncc', 'ldb']);
  const bimsNoPeriodo = [...new Set(ws.map((w) => w.bim))];
  discs.forEach((d) => FONTES_CURRICULO[d].forEach((f) => fontes.add(f)));
  if (discs.some((d) => Object.values(s.discs[d].avaliacao).some((l) => l.length))) ['avaliacao', 'duasfases', 'portfolio'].forEach((f) => fontes.add(f));
  const roteiro = pedido.tipo === 'projeto' ? montarRoteiro(s.discs, s.projeto, ws, periodo) : [];

  // Coleta das aulas no período
  const aulasDe = (d: DiscId) => {
    const doc = s.discs[d];
    const out: { w: Semana; n: number; a: ReturnType<typeof aulaAtual> }[] = [];
    if (!doc.modo) return out;
    for (const w of ws)
      for (let n = 1; n <= doc.aulasSemana; n++) {
        const a = aulaAtual(d, doc, w.bim, w.n, n);
        expandirFontes([...a.fontes, ...a.caixinhas.map((c) => caixinha(c)?.fonte ?? '')], d).forEach((f) => fontes.add(f));
        if (a.metodologia) expandirFontes([metodologia(a.metodologia)?.fonte ?? ''], d).forEach((f) => fontes.add(f));
        out.push({ w, n, a });
      }
    return out;
  };
  const conteudosDe = (d: DiscId) => {
    const doc = s.discs[d];
    const ids = new Set<string>();
    for (const w of ws) caixinhasNaSemana(doc, w.bim, w.n).forEach((c) => ids.add(c.id));
    return [...ids].map((id) => ({ c: caixinha(id)!, p: doc.placements[id] }));
  };

  const secoes = ['Dados de identificação', 'Tema', 'Justificativa', 'Áreas de conhecimento e conteúdos', 'Objetivo geral e objetivos específicos', 'Metodologia', 'Produto final', 'Avaliação', 'Referências', ...(pedido.tipo === 'projeto' ? ['Linha do tempo do projeto', 'Roteiro de apresentação'] : [])];
  const titulo = pedido.tipo === 'projeto' ? 'Plano do projeto integrado' : `Plano de ${disc(pedido.disc).nome}`;
  const dados = aulasPorDisc(discs, aulasDe);

  return (
    <div className="doc-tela">
      <div className="doc-acoes">
        <button className="btn" onClick={onVoltar}>
          Voltar ao sistema
        </button>
        <button className="btn primary" onClick={() => print()}>
          Imprimir ou salvar em PDF
        </button>
        {roteiro.length > 0 && (
          <button className="btn" onClick={() => navigator.clipboard?.writeText(roteiroTexto(roteiro))}>
            Copiar roteiro
          </button>
        )}
      </div>

      <article className="folha capa">
        <div>
          <div className="faixa" />
          <p style={{ marginTop: '14pt', fontWeight: 600 }}>{PROJETO.nome}</p>
          <p className="tema">{PROJETO.tema}</p>
          <p style={{ fontSize: '14pt' }}>{titulo}</p>
        </div>
        <div>
          <p>
            {PROJETO.serie} · {TURMAS.join(', ')}
            <br />
            Período: {periodo}
          </p>
          <p>
            {pedido.tipo === 'projeto' ? (
              <>Equipe: {PERFIS.map((p) => p.nome).join(', ')}</>
            ) : (
              <>Professor(a): {nomeDono(pedido.disc, s.frentes)}</>
            )}
            <br />
            {PROJETO.disciplinaFaculdade} · 2026
          </p>
        </div>
      </article>

      <article className="folha">
        <h2>Sumário</h2>
        <ol className="sumario">
          {secoes.map((x, i) => (
            <li key={x}>
              <a href={'#s' + i}>{x}</a>
            </li>
          ))}
        </ol>
      </article>

      <Folha id="s0" titulo="1. Dados de identificação">
        <table>
          <tbody>
            <tr><th>Projeto</th><td>{PROJETO.nome}</td></tr>
            <tr><th>Etapa e série</th><td>{PROJETO.serie}</td></tr>
            <tr><th>Turmas</th><td>{TURMAS.join(', ')} (4 editoras estudantis)</td></tr>
            <tr><th>Estudantes</th><td>{ALUNOS_POR_TURMA} por turma, {ALUNOS_POR_TURMA * TURMAS.length} no total; 6 núcleos editoriais de 5 estudantes por turma</td></tr>
            <tr><th>Período</th><td>{periodo}</td></tr>
            <tr><th>Calendário</th><td>Calendário Escolar Anual 2026 da SEEDF (Portaria nº 1.300/2025)</td></tr>
            {discs.map((d) => (
              <tr key={d}>
                <th>{disc(d).nome}</th>
                <td>{nomeDono(d, s.frentes)} · {s.discs[d].aulasSemana} aulas de 50 min por semana · {disc(d).area}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Folha>

      <Folha id="s1" titulo="2. Tema">
        <p style={{ fontFamily: "'Fraunces Variable', serif", fontSize: '15pt' }}>{PROJETO.tema}</p>
        <table>
          <thead><tr><th>Disciplina</th><th>Recorte temático no período</th></tr></thead>
          <tbody>
            {discs.map((d) => (
              <tr key={d}>
                <td>{disc(d).nome}</td>
                <td>{conteudosDe(d).map((x) => x.c.titulo).join('; ') || <NP />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Folha>

      <Folha id="s2" titulo="3. Justificativa">
        {pedido.tipo === 'projeto' && (
          <>
            <h3>Do projeto</h3>
            <T v={s.projeto.justificativa.valor} />
          </>
        )}
        {discs.map((d) => (
          <div key={d}>
            <h3>{pedido.tipo === 'projeto' ? disc(d).nome : 'Da disciplina'}</h3>
            <T v={s.discs[d].justificativa.valor} />
          </div>
        ))}
      </Folha>

      <Folha id="s3" titulo="4. Áreas de conhecimento e conteúdos">
        {discs.map((d) => {
          const cs = conteudosDe(d);
          const mets = new Map<string, Set<string>>();
          for (const { a } of dados[d]) for (const c of a.caixinhas) if (a.metodologia) mets.set(c, (mets.get(c) ?? new Set()).add(metodologia(a.metodologia)?.nome ?? a.metodologia));
          return (
            <div key={d}>
              <h3>
                {disc(d).nome} <span style={{ fontWeight: 400, fontSize: '10pt' }}>· {disc(d).area}</span>
              </h3>
              {cs.length ? (
                <table>
                  <thead><tr><th>Conteúdo</th><th>Quando</th><th>O que se aprende</th><th>Metodologias</th></tr></thead>
                  <tbody>
                    {cs.map(({ c, p }) => (
                      <tr key={c.id}>
                        <td><strong>{c.titulo}</strong>{c.bncc.length ? <><br />BNCC: {c.bncc.join(', ')}</> : null}{c.revista ? <><br /><em>Revista: {c.revista}</em></> : null}</td>
                        <td>{p.bim}º bim., sem. {p.sem}{p.semanas > 1 ? `–${p.sem + p.semanas - 1}` : ''}</td>
                        <td>{c.subtemas.join('; ')}</td>
                        <td>{[...(mets.get(c.id) ?? [])].join(', ') || <NP />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <NP />
              )}
            </div>
          );
        })}
      </Folha>

      <Folha id="s4" titulo="5. Objetivo geral e objetivos específicos">
        {pedido.tipo === 'projeto' && (
          <>
            <h3>Do projeto</h3>
            <T v={s.projeto.objetivos.valor} />
          </>
        )}
        {discs.map((d) => {
          const doc = s.discs[d];
          const esp = doc.objetivosEspecificos.filter((x) => x.trim());
          return (
            <div key={d}>
              <h3>{pedido.tipo === 'projeto' ? disc(d).nome : 'Da disciplina'}</h3>
              <p><strong>Objetivo geral:</strong> {doc.objetivoGeral.valor.trim() || <NP />}</p>
              <strong>Objetivos específicos:</strong>
              {esp.length ? <ol>{esp.map((o, i) => <li key={i}>{o}</li>)}</ol> : <> <NP /></>}
            </div>
          );
        })}
      </Folha>

      <Folha id="s5" titulo="6. Metodologia">
        <p>Descrição de cada aula com momentos, previsão de tempo, espaço e recursos.</p>
        {discs.map((d) => (
          <div key={d}>
            <h3>{disc(d).nome}</h3>
            {!dados[d].length && <NP />}
            {dados[d].map(({ w, n, a }) => (
              <div key={`${w.bim}-${w.n}-${n}`} className="aula-doc">
                <strong>
                  {w.bim}º bim. · Semana {w.n} ({fmt(w.inicio)} a {fmt(w.fim)}) · Aula {n}: {a.titulo || <NP />}
                </strong>
                <div style={{ fontSize: '9.5pt' }}>
                  Metodologia: {metodologia(a.metodologia)?.nome ?? <NP />} · Duração: {a.duracao} min · Conteúdos: {a.caixinhas.map((c) => caixinha(c)?.titulo).join('; ') || '—'}
                </div>
                {a.momentos.length > 0 && (
                  <table>
                    <thead><tr><th>Momento</th><th>Descrição</th><th>Tempo</th><th>Espaço</th><th>Recursos</th></tr></thead>
                    <tbody>
                      {a.momentos.map((m, i) => (
                        <tr key={i}><td>{m.titulo}</td><td>{m.desc}</td><td>{m.min} min</td><td>{m.espaco}</td><td>{m.recursos.join(', ')}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {a.dica && <p style={{ fontSize: '9.5pt', margin: 0 }}><em>Observação: {a.dica}</em></p>}
              </div>
            ))}
          </div>
        ))}
      </Folha>

      <Folha id="s6" titulo="7. Produto final">
        <p>{PROJETO.produto}. Cada revista (20 a 24 páginas) reúne capa e expediente, editorial e sumário, 6 temas interdisciplinares (um por núcleo editorial), a seção Cultura, Literatura e Memória e uma seção de bastidores com referências e transparência sobre o uso de IA.</p>
        {discs.map((d) => (
          <div key={d}>
            <h3>{disc(d).nome}</h3>
            <T v={s.discs[d].produto.valor} />
          </div>
        ))}
      </Folha>

      <Folha id="s7" titulo="8. Avaliação">
        {discs.map((d) => (
          <div key={d}>
            <h3>{disc(d).nome}</h3>
            {bimsNoPeriodo.map((b) => {
              const itens = s.discs[d].avaliacao[b] ?? [];
              const tot = itens.reduce((t, i) => t + i.pontos, 0);
              return (
                <div key={b}>
                  <p style={{ margin: '4pt 0' }}><strong>{b}º bimestre</strong> · {tot} de 10 pontos {tot !== 10 && <span className="nao-preenchido">incompleto</span>}</p>
                  {itens.length ? (
                    <table>
                      <thead><tr><th>Avaliação</th><th>Forma</th><th>Conteúdos</th><th>Pontos</th></tr></thead>
                      <tbody>
                        {itens.map((i) => (
                          <tr key={i.id}><td>{i.nome || formaAvaliacao(i.forma)?.nome}</td><td>{formaAvaliacao(i.forma)?.nome}</td><td>{i.semConteudo ? 'Sem conteúdo atrelado' : i.caixinhas.map((c) => caixinha(c)?.titulo).join('; ') || '—'}</td><td>{i.pontos}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <NP />
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <h3>Rubrica compartilhada da revista</h3>
        <table>
          <thead><tr><th>Disciplina</th><th>Critérios</th><th>Pontos</th></tr></thead>
          <tbody>
            {discs.map((d) => (
              <tr key={d}>
                <td>{disc(d).nome}</td>
                <td>{s.discs[d].rubrica.map((c) => `${c.texto} (${c.pontos})`).join('; ') || <NP />}</td>
                <td>{s.discs[d].rubrica.reduce((t, c) => t + c.pontos, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Folha>

      <Folha id="s8" titulo="9. Referências">
        <ul>
          {[...fontes].map((id) => FONTES[id]).filter(Boolean).map((f) => (
            <li key={f.id} style={{ marginBottom: '4pt' }}>
              <strong>{f.titulo}.</strong> {f.detalhe} {f.url && <>Disponível em: {f.url}.</>}
            </li>
          ))}
        </ul>
      </Folha>

      {pedido.tipo === 'projeto' && (
        <>
          <Folha id="s9" titulo="10. Linha do tempo do projeto">
            {bimsNoPeriodo.includes(3) && (
              <p>
                Fases do 3º bimestre: {FASES.map((f) => `${f.nome} (sem. ${f.semanas[0]}${f.semanas[1] !== f.semanas[0] ? '–' + f.semanas[1] : ''})`).join(' → ')}.
              </p>
            )}
            <table style={{ fontSize: '8pt' }}>
              <thead>
                <tr><th>Semana</th>{discs.map((d) => <th key={d}>{disc(d).curto}</th>)}</tr>
              </thead>
              <tbody>
                {ws.map((w) => (
                  <tr key={`${w.bim}-${w.n}`}>
                    <td>{w.bim}º · {w.n}<br />{fmt(w.inicio)}</td>
                    {discs.map((d) => (
                      <td key={d}>{caixinhasNaSemana(s.discs[d], w.bim, w.n).map((c) => caixinha(c.id)!.titulo).join('; ')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Folha>
          <Folha id="s10" titulo="11. Roteiro de apresentação">
            <p>Sugestão de roteiro para montar os slides, com começo, meio e fim.</p>
            {roteiro.map((sl, i) => (
              <div key={i} className="slide-doc">
                <strong>Slide {i + 1}: {sl.titulo}</strong>
                <ul style={{ margin: '2pt 0' }}>{sl.topicos.map((t, j) => <li key={j}>{t}</li>)}</ul>
                <em style={{ fontSize: '9.5pt' }}>Nota de fala: {sl.fala}</em>
              </div>
            ))}
          </Folha>
        </>
      )}
    </div>
  );
}

function aulasPorDisc<T>(discs: DiscId[], f: (d: DiscId) => T[]) {
  return Object.fromEntries(discs.map((d) => [d, f(d)])) as Record<DiscId, T[]>;
}

function Folha({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <article className="folha" id={id}>
      <h2>{titulo}</h2>
      {children}
    </article>
  );
}

function nomeDono(d: DiscId, frentes: { red?: string; gl?: string }) {
  const p = PERFIS.find((x) => x.disc === d) ?? PERFIS.find((x) => frentes[d as 'red' | 'gl'] === x.id);
  return p?.nome ?? 'a definir';
}

interface Slide {
  titulo: string;
  topicos: string[];
  fala: string;
}

const primeiraFrase = (t: string, n = 220) => {
  const x = t.trim().split(/\n+/)[0] ?? '';
  return x.length > n ? x.slice(0, n).replace(/\s\S*$/, '') + '…' : x;
};

function montarRoteiro(discs: Record<DiscId, DiscDoc>, proj: ProjetoDoc, ws: Semana[], periodo: string): Slide[] {
  const todas = DISCIPLINAS.map((x) => x.id);
  const sl: Slide[] = [
    {
      titulo: PROJETO.tema,
      topicos: [PROJETO.nome, `${PROJETO.serie} · 4 turmas de ${ALUNOS_POR_TURMA} estudantes`, `Equipe: ${PERFIS.map((p) => p.nome).join(', ')}`],
      fala: 'Apresentar o grupo e dizer em uma frase o que é o projeto: uma revista por turma que junta Física, Geografia, História e Português.',
    },
    {
      titulo: 'O problema que move o projeto',
      topicos: [primeiraFrase(proj.justificativa.valor) || 'Justificativa ainda não definida pela votação', 'Leitura de mundo: a conta de luz, a seca e o calor no DF'],
      fala: 'Começar pela realidade dos alunos, como propõe Paulo Freire: por que a conta de luz sobe quando falta chuva?',
    },
    {
      titulo: 'Dados de identificação',
      topicos: [`${TURMAS.join(', ')}: cada turma vira uma editora`, '6 núcleos editoriais de 5 estudantes por turma', `Período: ${periodo}`, 'Calendário oficial SEEDF 2026'],
      fala: 'Explicar a organização das turmas e dos papéis editoriais (editor-chefe, curador histórico, analista espacial, consultor científico, designer).',
    },
    {
      titulo: 'Objetivos',
      topicos: proj.objetivos.valor.trim() ? proj.objetivos.valor.split('\n').filter((x) => x.trim()).slice(0, 4) : ['Objetivos ainda não definidos pela votação'],
      fala: 'Destacar que os objetivos vão além do conteúdo: pesquisar, trabalhar em equipe, criticar fontes, usar IA com ética.',
    },
    {
      titulo: 'Como o tempo foi organizado',
      topicos: FASES.map((f) => (f.semanas[1] !== f.semanas[0] ? `${f.nome}: semanas ${f.semanas[0]}–${f.semanas[1]}` : `${f.nome}: semana ${f.semanas[0]}`)),
      fala: 'Mostrar que a teoria vem antes da escrita, e que nas semanas de escrita todas as disciplinas revisam os textos.',
    },
  ];
  for (const d of todas) {
    const doc = discs[d];
    const ids = new Set<string>();
    for (const w of ws) caixinhasNaSemana(doc, w.bim, w.n).forEach((c) => ids.add(c.id));
    const cs = [...ids].map((id) => caixinha(id)!).filter((c) => !c.projeto);
    const mets = new Set<string>();
    let exemplo = '';
    for (const w of ws)
      for (let n = 1; n <= doc.aulasSemana; n++) {
        const a = aulaAtual(d, doc, w.bim, w.n, n);
        if (a.metodologia) mets.add(metodologia(a.metodologia)?.nome ?? '');
        if (!exemplo && a.titulo && a.dica) exemplo = `${a.titulo}: ${a.dica}`;
      }
    sl.push({
      titulo: disc(d).nome,
      topicos: [
        cs.length ? 'Conteúdos: ' + cs.map((c) => c.titulo).join('; ') : 'Conteúdos: a definir',
        mets.size ? 'Metodologias: ' + [...mets].slice(0, 4).join(', ') : 'Metodologias: a definir',
        doc.produto.valor.trim() ? 'Na revista: ' + primeiraFrase(doc.produto.valor, 140) : 'Contribuição para a revista: a definir',
      ],
      fala: exemplo ? `Dar um exemplo de aula: ${primeiraFrase(exemplo, 200)}` : `Explicar como ${disc(d).nome} se liga ao tema e às outras disciplinas.`,
    });
  }
  sl.push(
    {
      titulo: 'O produto: a revista',
      topicos: ['Capa, editorial e sumário', '6 temas interdisciplinares, um por núcleo', 'Cultura, Literatura e Memória', 'Bastidores: referências e uso transparente de IA', 'Mostra de Editoras com as 4 revistas'],
      fala: 'Mostrar como cada disciplina aparece dentro de cada tema da revista, e que a escrita tem leitor real na comunidade escolar.',
    },
    {
      titulo: 'Avaliação',
      topicos: ['10 pontos por disciplina por bimestre', 'Diagnóstica, portfólio, prova em duas fases, rubrica compartilhada da revista, defesa oral e autoavaliação', 'Avaliação formativa e mediadora (Luckesi, Hoffmann, Perrenoud)'],
      fala: 'Explicar a rubrica compartilhada: uma mesma revista avaliada por todas as áreas, cada uma com seus critérios.',
    },
    {
      titulo: 'Fechamento',
      topicos: ['Da leitura de mundo à produção de conhecimento', 'Interdisciplinaridade sem perder o rigor de cada ciência', 'Estudantes como autores, não só receptores'],
      fala: 'Voltar à pergunta do início e mostrar o que os alunos conseguem responder ao final do projeto.',
    },
  );
  return sl;
}

function roteiroTexto(r: Slide[]) {
  return r.map((s, i) => `Slide ${i + 1}: ${s.titulo}\n${s.topicos.map((t) => '- ' + t).join('\n')}\nNota de fala: ${s.fala}`).join('\n\n');
}
