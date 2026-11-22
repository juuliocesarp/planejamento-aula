import { useState } from 'react';
import { ALUNOS_POR_TURMA, PROJETO, TURMAS, disc } from '../data/base';
import { BIMESTRES, fmt } from '../data/calendario';
import { placementsDoModo, useStore } from '../store/store';
import type { Modo } from '../store/tipos';
import type { Tela } from '../App';
import { DiscTag } from '../components/ui';

const MODOS: { id: Modo; nome: string; resumo: string; acontece: string[]; voce: string; paraQuem: string }[] = [
  {
    id: 'projeto',
    nome: 'Recomendação para o projeto',
    resumo: 'O calendário já vem montado para a revista, com as aulas do 3º bimestre prontas para você revisar.',
    acontece: [
      'O 3º bimestre (27/07 a 05/10) é organizado em 5 fases: problematização, teoria, escrita com revisão, fechamento e Mostra de Editoras.',
      'Cada aula do 3º bimestre já vem com tema, metodologia, momentos, tempo, espaço e recursos, sugeridos pela IA e com fonte.',
      'Os conteúdos que não cabem no 3º bimestre são levados para o 4º bimestre.',
    ],
    voce: 'Abrir as aulas, ler, ajustar o que quiser e seguir para a avaliação.',
    paraQuem: 'Recomendado para este trabalho: é o caminho mais rápido.',
  },
  {
    id: 'referencia',
    nome: 'Plano de referência',
    resumo: 'Os conteúdos já ficam distribuídos no ano, na ordem dos currículos de referência (organizadores curriculares de Pernambuco, Sergipe e IFPB, alinhados à BNCC).',
    acontece: [
      'Cada conteúdo (caixinha) fica na semana sugerida por esses currículos, usando as datas do calendário da SEEDF 2026.',
      'O projeto da revista não é montado: o 3º bimestre segue a ordem desses currículos (por exemplo, Óptica em Física).',
      'As aulas começam vazias.',
    ],
    voce: 'Escolher a metodologia e preencher cada aula do zero.',
    paraQuem: 'Para quem quer planejar o ano todo sem o projeto.',
  },
  {
    id: 'vazio',
    nome: 'Começar do zero',
    resumo: 'O calendário começa em branco e todos os conteúdos ficam guardados na estante ao lado.',
    acontece: ['Nenhum conteúdo é colocado no calendário.', 'As aulas começam vazias.'],
    voce: 'Arrastar cada conteúdo da estante para a semana que preferir e depois planejar as aulas.',
    paraQuem: 'Para quem quer montar tudo com as próprias mãos.',
  },
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
        <p className="small muted" style={{ maxWidth: '70ch' }}>
          O calendário é onde você distribui os conteúdos da sua disciplina pelas semanas e planeja cada aula. Escolha como ele começa. Não se preocupe: depois você pode mover, ajustar e reescrever
          tudo.
        </p>
        {doc.modo && (
          <p className="small muted">
            Atual: <strong>{MODOS.find((m) => m.id === doc.modo)!.nome}</strong>. Trocar reorganiza as caixinhas e apaga as edições das aulas.
          </p>
        )}
        <div className="grid3">
          {MODOS.map((m) => (
            <button
              key={m.id}
              className="perfil-card"
              aria-pressed={doc.modo === m.id}
              onClick={() => (doc.modo && doc.modo !== m.id ? setConfirmar(m.id) : aplicar(m.id))}
            >
              <span className="row" style={{ width: '100%' }}>
                <strong style={{ fontSize: '1.05rem' }}>{m.nome}</strong>
                {doc.modo === m.id && <span className="chip">Escolhido</span>}
              </span>
              <span>{m.resumo}</span>
              <span className="small" style={{ fontWeight: 600 }}>O que acontece ao escolher</span>
              <ul className="small" style={{ margin: 0, paddingLeft: '1.1rem' }}>
                {m.acontece.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <span className="small">
                <strong>Depois você vai:</strong> {m.voce}
              </span>
              <span className={m.id === 'projeto' ? 'ia-badge' : 'small muted'}>{m.paraQuem}</span>
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
        <div className="aviso-ia" style={{ borderStyle: 'solid', borderColor: 'var(--line)', background: 'var(--paper)' }}>
          <span aria-hidden style={{ fontSize: '1.2rem' }}>📌</span>
          <div className="small">
            <strong style={{ color: 'var(--ink)' }}>Para o projeto de vocês, o 3º bimestre foi o escolhido</strong> por ser o que integra melhor todas as disciplinas, por isso ele fica sempre marcado. Se
            quiser, você pode incluir e planejar aulas de outros bimestres.
            <br />
            <strong>Dica:</strong> para este trabalho, foque só no 3º bimestre.
          </div>
        </div>
        <div className="row">
          {BIMESTRES.map((b) => {
            const fixo = b.n === 3;
            const on = fixo || doc.recorte.includes(b.n);
            return (
              <label key={b.n} className={'bim-tab' + (fixo ? ' fixo' : '')} title={fixo ? 'O 3º bimestre é o do projeto e fica sempre no plano' : `Incluir o ${b.n}º bimestre no plano`} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={on}
                  disabled={fixo}
                  onChange={() =>
                    s.atualizarDisc(d, (x) => ({
                      ...x,
                      recorte: on ? x.recorte.filter((n) => n !== b.n) : [...new Set([...x.recorte, b.n, 3])].sort(),
                    }))
                  }
                />
                <span>
                  {b.n}º bimestre {fixo && '· projeto'}
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
