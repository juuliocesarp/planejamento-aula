import { useState } from 'react';
import { ALUNOS_POR_TURMA, PROJETO, TURMAS, disc } from '../data/base';
import { BIMESTRES, fmt } from '../data/calendario';
import { placementsDoModo, useStore } from '../store/store';
import type { Modo } from '../store/tipos';
import type { Tela } from '../App';
import { DiscTag } from '../components/ui';

const MODOS: { id: Modo; nome: string; desc: string }[] = [
  {
    id: 'projeto',
    nome: 'Recomendação para o projeto',
    desc: 'O 3º bimestre é reorganizado para a revista: problematização, teoria, escrita com revisão, fechamento e Mostra. As aulas do 3º bimestre já vêm sugeridas pela IA. O que sai do 3º bimestre vai para o 4º.',
  },
  {
    id: 'referencia',
    nome: 'Plano de referência',
    desc: 'As caixinhas ficam onde o guia de referência sugere, nas datas do calendário SEEDF 2026. As aulas começam vazias.',
  },
  { id: 'vazio', nome: 'Começar do zero', desc: 'Todas as caixinhas ficam na estante para você posicionar uma a uma. As aulas começam vazias.' },
];

export function Recorte({ ir }: { ir: (t: Tela) => void }) {
  const s = useStore();
  const d = s.minhaDisc!;
  const doc = s.discs[d];
  const [confirmar, setConfirmar] = useState<Modo | null>(null);

  const aplicar = (m: Modo) => {
    s.atualizarDisc(d, (x) => ({ ...x, modo: m, placements: placementsDoModo(d, m), aulas: {} }));
    setConfirmar(null);
  };

  return (
    <>
      <div className="page-head">
        <h1>Recorte do plano</h1>
        <p>Escolha como o seu calendário começa e quais bimestres entram no plano. Você pode mudar tudo depois na etapa de conteúdos e aulas.</p>
      </div>

      <section className="card">
        <h2>Dados de identificação</h2>
        <div className="grid2">
          <dl style={{ margin: 0 }}>
            <dt className="muted small">Projeto</dt>
            <dd style={{ margin: '0 0 0.5rem' }}>{PROJETO.nome}</dd>
            <dt className="muted small">Tema gerador</dt>
            <dd style={{ margin: '0 0 0.5rem' }}>{PROJETO.tema}</dd>
          </dl>
          <dl style={{ margin: 0 }}>
            <dt className="muted small">Série e turmas</dt>
            <dd style={{ margin: '0 0 0.5rem' }}>
              {PROJETO.serie} · {TURMAS.join(', ')} · {ALUNOS_POR_TURMA} estudantes por turma ({ALUNOS_POR_TURMA * TURMAS.length} no total)
            </dd>
            <dt className="muted small">Sua disciplina</dt>
            <dd style={{ margin: 0 }}>
              <DiscTag d={d} /> <span className="small muted">· {disc(d).area}</span>
            </dd>
          </dl>
        </div>
      </section>

      <section className="card">
        <h2>Ponto de partida do calendário</h2>
        {doc.modo && (
          <p className="small muted">
            Atual: <strong>{MODOS.find((m) => m.id === doc.modo)!.nome}</strong>. Trocar reorganiza as caixinhas e apaga as edições das aulas.
          </p>
        )}
        <div className="grid2">
          {MODOS.map((m) => (
            <button
              key={m.id}
              className="perfil-card"
              aria-pressed={doc.modo === m.id}
              onClick={() => (doc.modo && doc.modo !== m.id ? setConfirmar(m.id) : aplicar(m.id))}
            >
              <strong>{m.nome}</strong>
              <span className="small">{m.desc}</span>
              {m.id === 'projeto' && <span className="ia-badge">Aulas sugeridas pela IA</span>}
            </button>
          ))}
        </div>
        {confirmar && (
          <div className="alerta row" style={{ marginTop: '0.8rem' }} role="alert">
            <span>Trocar para "{MODOS.find((m) => m.id === confirmar)!.nome}" reorganiza o calendário e apaga as aulas editadas. Continuar?</span>
            <button className="btn sm primary" onClick={() => aplicar(confirmar)}>
              Trocar
            </button>
            <button className="btn sm" onClick={() => setConfirmar(null)}>
              Cancelar
            </button>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Bimestres do plano</h2>
        <p className="small muted">O projeto acontece no 3º bimestre. Inclua outros se quiser planejar além dele. No documento final você ainda escolhe um recorte menor (meses, semanas ou aulas).</p>
        <div className="row">
          {BIMESTRES.map((b) => {
            const on = doc.recorte.includes(b.n);
            return (
              <label key={b.n} className="bim-tab" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() =>
                    s.atualizarDisc(d, (x) => ({
                      ...x,
                      recorte: on ? x.recorte.filter((n) => n !== b.n) : [...x.recorte, b.n].sort(),
                    }))
                  }
                />
                <span>
                  {b.n}º bimestre
                  <small>
                    {fmt(b.inicio)} a {fmt(b.fim)}
                  </small>
                </span>
              </label>
            );
          })}
        </div>
        <label className="field" style={{ maxWidth: '18rem', marginTop: '1rem' }}>
          <span>Aulas por semana de {disc(d).curto}</span>
          <input
            className="input"
            type="number"
            min={1}
            max={6}
            value={doc.aulasSemana}
            onChange={(e) => s.atualizarDisc(d, (x) => ({ ...x, aulasSemana: Math.max(1, Math.min(6, Number(e.target.value) || 1)) }))}
          />
        </label>
        <p className="small muted" style={{ marginTop: '0.4rem' }}>
          Padrão: 2 aulas de 50 minutos por semana. Valor de referência do grupo; ajuste se a escola usar outro.
        </p>
      </section>

      <p style={{ marginTop: '1.2rem' }}>
        <button className="btn primary" onClick={() => ir('objetivos')} disabled={!doc.modo}>
          Continuar para objetivos
        </button>
        {!doc.modo && <span className="small muted"> Escolha um ponto de partida para continuar.</span>}
      </p>
    </>
  );
}
