// Calendário Escolar Anual 2026 — SEEDF (Portaria nº 1.300, de 28/11/2025).
export const BIMESTRES = [
  { n: 1, inicio: '2026-02-12', fim: '2026-04-29' },
  { n: 2, inicio: '2026-04-30', fim: '2026-07-10' },
  { n: 3, inicio: '2026-07-27', fim: '2026-10-05' },
  { n: 4, inicio: '2026-10-06', fim: '2026-12-21' },
];

export const FERIADOS: Record<string, string> = {
  '2026-04-03': 'Paixão de Cristo',
  '2026-04-21': 'Aniversário de Brasília e Tiradentes',
  '2026-05-01': 'Dia Mundial do Trabalho',
  '2026-09-07': 'Independência do Brasil',
  '2026-10-12': 'Nossa Senhora Aparecida',
  '2026-10-15': 'Dia dos Professores',
  '2026-11-02': 'Finados',
  '2026-11-20': 'Dia da Consciência Negra',
  '2026-11-30': 'Dia do Evangélico',
};

const RECESSOS: [string, string, string][] = [
  ['2026-02-16', '2026-02-18', 'Carnaval e Quarta de Cinzas'],
  ['2026-06-04', '2026-06-04', 'Corpus Christi'],
];

export const DATAS_PROJETO: { inicio: string; fim: string; nome: string }[] = [
  { inicio: '2026-03-16', fim: '2026-03-16', nome: 'Dia Nacional de Conscientização sobre as Mudanças Climáticas' },
  { inicio: '2026-03-16', fim: '2026-03-20', nome: 'Semana do Uso Sustentável da Água' },
  { inicio: '2026-06-03', fim: '2026-06-03', nome: 'Dia Nacional da Educação Ambiental' },
  { inicio: '2026-09-05', fim: '2026-09-11', nome: 'Semana do Cerrado' },
  { inicio: '2026-09-19', fim: '2026-09-19', nome: 'Paulo Freire, Patrono da Educação' },
  { inicio: '2026-10-23', fim: '2026-10-29', nome: 'Semana Nacional do Livro e da Biblioteca' },
];

const d = (s: string) => new Date(s + 'T12:00:00');
const iso = (dt: Date) => dt.toISOString().slice(0, 10);

export interface Semana {
  bim: number;
  n: number; // semana dentro do bimestre
  inicio: string; // segunda-feira (ou 1º dia letivo)
  fim: string; // sexta-feira (ou último dia letivo)
  avisos: string[]; // feriados e recessos na semana
  datas: string[]; // datas comemorativas ligadas ao projeto
}

function semanasDoBimestre(b: (typeof BIMESTRES)[number]): Semana[] {
  const ini = d(b.inicio);
  const fim = d(b.fim);
  const seg = new Date(ini);
  seg.setDate(seg.getDate() - ((seg.getDay() + 6) % 7));
  const out: Semana[] = [];
  let n = 1;
  for (let s = new Date(seg); s <= fim; s.setDate(s.getDate() + 7)) {
    const sex = new Date(s);
    sex.setDate(sex.getDate() + 4);
    const a = s < ini ? ini : s;
    const z = sex > fim ? fim : sex;
    if (a > z) continue;
    const avisos: string[] = [];
    for (let x = new Date(a); x <= z; x.setDate(x.getDate() + 1)) {
      const k = iso(x);
      if (FERIADOS[k]) avisos.push(`${fmt(k)}: ${FERIADOS[k]}`);
    }
    for (const [ri, rf, nome] of RECESSOS) if (ri <= iso(z) && rf >= iso(a)) avisos.push(`Recesso: ${nome}`);
    const datas = DATAS_PROJETO.filter((p) => p.inicio <= iso(z) && p.fim >= iso(a)).map((p) => p.nome);
    out.push({ bim: b.n, n: n++, inicio: iso(a), fim: iso(z), avisos, datas });
  }
  return out;
}

export const SEMANAS: Record<number, Semana[]> = Object.fromEntries(BIMESTRES.map((b) => [b.n, semanasDoBimestre(b)]));

export function fmt(isoDate: string) {
  const [, m, dd] = isoDate.split('-');
  return `${dd}/${m}`;
}

export const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const mesDe = (isoDate: string) => Number(isoDate.slice(5, 7)) - 1;

/** Converte a semana do guia (1–40) em bimestre/semana. */
export function semanaGuiaParaPos(sg: number) {
  const bim = Math.min(4, Math.ceil(sg / 10));
  return { bim, sem: ((sg - 1) % 10) + 1 };
}
