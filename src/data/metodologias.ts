import type { FormaAvaliacao, Metodologia, Momento } from './tipos';

const m = (titulo: string, min: number, desc: string, espaco = 'Sala de aula', recursos: string[] = []): Momento => ({ titulo, desc, min, espaco, recursos });

// Resumos e etapas a partir da seção 3 do guia de referência ("Repertório Sistemático de Metodologias de Ensino").
export const METODOLOGIAS: Metodologia[] = [
  {
    id: 'expositiva', nome: 'Aula expositiva dialogada', matriz: 'Expositiva / mediadora', fonte: 'metativas',
    resumo: 'Sistematização do professor permeada por perguntas problematizadoras e pelos conhecimentos prévios dos alunos (Ausubel).',
    momentos: [
      m('Pergunta de abertura', 8, 'Lançar uma pergunta ligada ao cotidiano e anotar no quadro as hipóteses da turma.', 'Sala de aula', ['Quadro']),
      m('Exposição dialogada', 25, 'Apresentar o conceito em blocos curtos, voltando às hipóteses e pedindo exemplos aos alunos.', 'Sala de aula', ['Quadro', 'Projetor', 'Livro didático']),
      m('Aplicação rápida', 12, 'Duplas resolvem uma situação-problema curta usando o conceito.', 'Sala de aula', ['Caderno']),
      m('Síntese', 5, 'Retomar as hipóteses iniciais: o que se confirmou e o que mudou.', 'Sala de aula', ['Quadro']),
    ],
  },
  {
    id: 'freire', nome: 'Método Paulo Freire (Círculo de Cultura)', matriz: 'Crítico-libertadora', fonte: 'freire',
    resumo: 'Diálogo horizontal a partir de temas geradores do cotidiano: investigação, tematização e problematização.',
    momentos: [
      m('Investigação', 12, 'Em roda, levantar o que os alunos vivem sobre o tema (situações, palavras, dados do bairro).', 'Sala em círculo', []),
      m('Tematização', 18, 'Codificar o tema (imagem, notícia ou objeto) e decodificá-lo em grupo, ligando ao conhecimento científico.', 'Sala em círculo', ['Notícia ou imagem impressa']),
      m('Problematização', 15, 'Formular perguntas críticas: por que isso acontece? quem é afetado? o que pode mudar?', 'Sala em círculo', ['Quadro']),
      m('Registro', 5, 'Cada aluno anota uma pergunta que quer investigar.', 'Sala em círculo', ['Caderno de bordo']),
    ],
  },
  {
    id: 'phc', nome: 'Pedagogia Histórico-Crítica (Gasparin)', matriz: 'Crítico-dialética', fonte: 'gasparin',
    resumo: 'Cinco passos: prática social inicial, problematização, instrumentalização, catarse e prática social final.',
    momentos: [
      m('Prática social inicial', 7, 'Levantar o que os alunos já sabem e vivem sobre o conteúdo.', 'Sala de aula'),
      m('Problematização', 8, 'Transformar o tema em questões científicas, sociais e éticas.', 'Sala de aula', ['Quadro']),
      m('Instrumentalização', 22, 'Mediação do professor com o saber sistematizado (texto, exposição, fonte).', 'Sala de aula', ['Livro didático', 'Projetor']),
      m('Catarse', 8, 'Alunos expressam a nova síntese (pequeno texto, esquema ou fala).', 'Sala de aula', ['Caderno']),
      m('Prática social final', 5, 'Compromisso de ação: como o conteúdo muda o olhar sobre a realidade.', 'Sala de aula'),
    ],
  },
  {
    id: 'peer', nome: 'Peer Instruction (Instrução pelos Pares)', matriz: 'Ativa / conceitual', fonte: 'mazur',
    resumo: 'Miniexposições de 10–15 min intercaladas com testes conceituais; discussão entre pares quando o acerto fica entre 30% e 70%.',
    momentos: [
      m('Miniexposição', 12, 'Apresentar o conceito-chave de forma objetiva.', 'Sala de aula', ['Projetor']),
      m('Teste conceitual 1', 5, 'Pergunta de múltipla escolha; cada aluno vota sozinho (cartões ou celular).', 'Sala de aula', ['Cartões de resposta']),
      m('Discussão entre pares', 8, 'Se o acerto ficou entre 30% e 70%, alunos com respostas diferentes discutem e votam de novo. Abaixo de 30%, retomar a explicação.', 'Sala de aula', ['Cartões de resposta']),
      m('Teste conceitual 2', 15, 'Novo ciclo com uma segunda pergunta, mais aplicada.', 'Sala de aula', ['Cartões de resposta', 'Projetor']),
      m('Fechamento', 10, 'Explicar as respostas e registrar o conceito no caderno.', 'Sala de aula', ['Quadro']),
    ],
  },
  {
    id: 'tbl', nome: 'TBL (Aprendizagem Baseada em Equipes)', matriz: 'Ativa / colaborativa', fonte: 'metativas',
    resumo: 'Estudo prévio, teste individual, teste em equipe com feedback imediato e aplicação em entrega coletiva.',
    momentos: [
      m('Teste individual', 10, 'Teste curto sobre o material estudado antes da aula.', 'Sala de aula', ['Folha de teste']),
      m('Teste em equipe', 12, 'As mesmas questões resolvidas pelo grupo, com conferência imediata.', 'Sala de aula', ['Folha de teste']),
      m('Esclarecimentos', 8, 'O professor retoma as questões com mais erro.', 'Sala de aula', ['Quadro']),
      m('Aplicação', 20, 'Equipes resolvem um problema complexo e apresentam a decisão.', 'Sala de aula', ['Cartolina ou folhas']),
    ],
  },
  {
    id: 'abp', nome: 'ABP (Aprendizagem Baseada em Projetos)', matriz: 'Ativa / integradora', fonte: 'moran',
    resumo: 'Investigação prolongada para criar um produto ou intervenção real, articulando disciplinas.',
    momentos: [
      m('Retomada da pergunta motriz', 5, 'Relembrar o desafio do projeto e o que falta entregar.', 'Sala de aula'),
      m('Trabalho nos núcleos', 35, 'Grupos avançam na etapa do produto com o professor circulando como orientador.', 'Sala de aula', ['Caderno de bordo']),
      m('Checkpoint', 10, 'Cada grupo registra o que fez, o que falta e uma dúvida.', 'Sala de aula', ['Portfólio do núcleo']),
    ],
  },
  {
    id: 'pbl', nome: 'PBL (Aprendizagem Baseada em Problemas)', matriz: 'Ativa / investigativa', fonte: 'moran',
    resumo: 'Problema aberto e complexo discutido em grupos tutoriais que levantam hipóteses, pesquisam e propõem soluções.',
    momentos: [
      m('Apresentação do problema', 8, 'Ler o problema e destacar termos desconhecidos.', 'Sala de aula', ['Texto do problema']),
      m('Hipóteses e lacunas', 15, 'Grupo levanta hipóteses e lista o que precisa pesquisar.', 'Sala de aula', ['Cartolina']),
      m('Pesquisa orientada', 20, 'Busca em livro didático e fontes confiáveis.', 'Biblioteca', ['Livro didático', 'Computadores']),
      m('Socialização', 7, 'Cada grupo compartilha uma descoberta.', 'Sala de aula'),
    ],
  },
  {
    id: 'invertida', nome: 'Sala de aula invertida', matriz: 'Ativa / híbrida', fonte: 'moran',
    resumo: 'Contato inicial com a teoria fora da aula (texto, vídeo, simulação); em sala, debate, prática e produção.',
    momentos: [
      m('Verificação do estudo prévio', 8, 'Perguntas rápidas sobre o material indicado.', 'Sala de aula'),
      m('Atividade prática', 30, 'Resolução assistida, experimento ou produção em grupo.', 'Sala de aula', ['Material da atividade']),
      m('Debate', 12, 'Discussão das dificuldades e conclusões.', 'Sala de aula'),
    ],
  },
  {
    id: 'estacoes', nome: 'Rotação por estações', matriz: 'Ativa / híbrida', fonte: 'moran',
    resumo: 'Grupos alternam entre estações com propostas diferentes (experimental, digital, leitura, mentoria).',
    momentos: [
      m('Orientação', 5, 'Explicar as estações e o tempo de cada uma.', 'Sala de aula'),
      m('Estação 1 — leitura crítica', 13, 'Leitura de texto ou fonte com roteiro de perguntas.', 'Sala de aula', ['Textos impressos']),
      m('Estação 2 — experimento ou simulação', 13, 'Atividade prática ou simulador.', 'Sala de aula', ['Material de experimento']),
      m('Estação 3 — mentoria', 13, 'Conversa com o professor sobre a dúvida do grupo.', 'Sala de aula'),
      m('Fechamento', 6, 'Síntese coletiva das estações.', 'Sala de aula'),
    ],
  },
  {
    id: 'caso', nome: 'Estudo de caso', matriz: 'Ativa / contextual', fonte: 'moran',
    resumo: 'Análise de um dilema real para tomada de decisão fundamentada.',
    momentos: [
      m('Apresentação do caso', 10, 'Leitura do caso com os dados principais.', 'Sala de aula', ['Texto do caso']),
      m('Análise em grupos', 25, 'Grupos identificam atores, causas, consequências e alternativas.', 'Sala de aula', ['Roteiro de análise']),
      m('Decisão e defesa', 15, 'Cada grupo defende uma decisão com argumentos.', 'Sala de aula'),
    ],
  },
  {
    id: 'debate', nome: 'Debate regrado', matriz: 'Ativa / argumentativa', fonte: 'bncc',
    resumo: 'Confronto organizado de posições com tempo de fala, réplica e síntese.',
    momentos: [
      m('Preparação', 12, 'Grupos organizam argumentos e evidências para sua posição.', 'Sala de aula', ['Fontes impressas']),
      m('Rodadas de fala', 25, 'Exposição, réplica e tréplica com tempo controlado.', 'Sala em círculo', ['Cronômetro']),
      m('Síntese', 13, 'A turma registra os argumentos mais fortes de cada lado.', 'Sala de aula', ['Quadro']),
    ],
  },
  {
    id: 'experimento', nome: 'Ensino por investigação (experimento)', matriz: 'Ativa / investigativa', fonte: 'ldb',
    resumo: 'Investigação prática: pergunta, hipótese, experimento, dados e conclusão (Art. 35-B da LDB pede metodologias investigativas).',
    momentos: [
      m('Pergunta e hipótese', 8, 'Apresentar a pergunta investigável; grupos registram hipóteses.', 'Laboratório', ['Caderno de bordo']),
      m('Experimento', 25, 'Montagem e coleta de dados em grupos.', 'Laboratório', ['Material de experimento', 'Termômetros']),
      m('Análise dos dados', 12, 'Tabela ou gráfico e comparação com as hipóteses.', 'Laboratório', ['Papel milimetrado']),
      m('Conclusão', 5, 'Cada grupo escreve uma frase-conclusão.', 'Laboratório'),
    ],
  },
  {
    id: 'oficina', nome: 'Oficina de produção textual', matriz: 'Ativa / produção', fonte: 'marcuschi',
    resumo: 'Escrita orientada em etapas: planejamento, rascunho, revisão e reescrita.',
    momentos: [
      m('Planejamento', 10, 'Retomar o gênero e montar o roteiro do texto.', 'Sala de aula', ['Ficha do gênero']),
      m('Escrita', 28, 'Produção manuscrita do texto ou trecho.', 'Sala de aula', ['Folhas pautadas']),
      m('Revisão', 12, 'Autorrevisão ou troca com outro núcleo usando a ficha de revisão.', 'Sala de aula', ['Ficha de revisão']),
    ],
  },
  {
    id: 'gamificacao', nome: 'Gamificação', matriz: 'Ativa / lúdica', fonte: 'gamificacao',
    resumo: 'Missões com objetivos claros, regras, narrativa e feedback imediato.',
    momentos: [
      m('Narrativa e regras', 7, 'Apresentar a missão e a pontuação.', 'Sala de aula'),
      m('Missões', 33, 'Equipes cumprem desafios em sequência com feedback a cada etapa.', 'Sala de aula', ['Cartas de missão']),
      m('Placar e reflexão', 10, 'Discutir o que cada missão ensinou.', 'Sala de aula', ['Quadro']),
    ],
  },
  {
    id: 'seminario', nome: 'Seminário / apresentação', matriz: 'Ativa / comunicação', fonte: 'metativas',
    resumo: 'Exposição estruturada de pesquisa pelos alunos, com arguição.',
    momentos: [
      m('Organização', 5, 'Ordem das apresentações e critérios.', 'Sala de aula'),
      m('Apresentações', 35, 'Grupos apresentam com tempo marcado.', 'Sala de aula', ['Projetor']),
      m('Arguição e devolutiva', 10, 'Perguntas da turma e comentários do professor.', 'Sala de aula'),
    ],
  },
];

export const metodologia = (id: string) => METODOLOGIAS.find((x) => x.id === id);

// As 16 formas e instrumentos da seção 4.2 do guia de referência.
export const FORMAS_AVALIACAO: FormaAvaliacao[] = [
  { id: 'objetiva', nome: 'Prova escrita objetiva', definicao: 'Questões fechadas de resposta única ou combinada.', pros: 'Correção rápida e ampla cobertura do conteúdo.', contras: 'Vulnerável ao "chute"; não mostra o raciocínio.' },
  { id: 'dissertativa', nome: 'Prova escrita dissertativa', definicao: 'Questões que exigem resposta elaborada.', pros: 'Revela o raciocínio e a natureza do erro.', contras: 'Correção lenta; subjetiva sem rubrica.' },
  { id: 'duasfases', nome: 'Teste em duas fases', definicao: '1ª fase em sala com tempo limitado; 2ª fase com tempo ampliado para revisão.', pros: 'Une rigor e função formativa.', contras: 'Logística e correção em duas etapas.' },
  { id: 'seminario', nome: 'Seminário / apresentação oral', definicao: 'Exposição estruturada de pesquisa diante da turma.', pros: 'Protagonismo e arguição imediata.', contras: 'Divisão desigual do trabalho; ansiedade.' },
  { id: 'diagnostica', nome: 'Avaliação diagnóstica', definicao: 'Levantamento inicial sem peso punitivo.', pros: 'Torna o planejamento realista.', contras: 'Inútil se não orientar ajustes.', semConteudo: true },
  { id: 'formativa', nome: 'Avaliação formativa contínua', definicao: 'Acompanhamento de exercícios, rascunhos e debates com feedback.', pros: 'Reduz reprovação surpresa.', contras: 'Alta demanda de registro.' },
  { id: 'somativa', nome: 'Avaliação somativa', definicao: 'Balanço ao fim de uma sequência ou bimestre.', pros: 'Síntese objetiva do ciclo.', contras: 'Isolada, induz "estudo só para a nota".' },
  { id: 'mediadora', nome: 'Avaliação mediadora', definicao: 'Prática dialógica que trata o erro como hipótese (Hoffmann).', pros: 'Valoriza o erro como etapa.', contras: 'Difícil de sustentar com sobrecarga.' },
  { id: 'emancipatoria', nome: 'Avaliação emancipatória', definicao: 'Análise democrática do processo educativo (Ana Maria Saul).', pros: 'Comprometimento coletivo.', contras: 'Exige cultura de diálogo.', semConteudo: true },
  { id: 'portfolio', nome: 'Portfólio / webfólio', definicao: 'Coleção organizada de produções, revisões e reflexões.', pros: 'Mostra o progresso real.', contras: 'Vira pasta feita às pressas sem acompanhamento.' },
  { id: 'rubrica', nome: 'Avaliação por rubrica', definicao: 'Critérios e níveis de desempenho apresentados antes da atividade.', pros: 'Reduz arbitrariedade.', contras: 'Rubricas rígidas limitam a criatividade.' },
  { id: 'autoavaliacao', nome: 'Autoavaliação', definicao: 'Reflexão orientada do aluno sobre o próprio processo.', pros: 'Desenvolve metacognição e autonomia.', contras: 'Tende à superestimação sem critérios.', semConteudo: true },
  { id: 'pares', nome: 'Avaliação por pares', definicao: 'Alunos analisam produções dos colegas com roteiro.', pros: 'Multiplica o feedback antes da versão final.', contras: 'Vieses afetivos; precisa de mediação.' },
  { id: 'diario', nome: 'Diário de campo / relatório', definicao: 'Registro contínuo de observações e procedimentos.', pros: 'Evidencia o raciocínio investigativo.', contras: 'Leitura de grande volume.' },
  { id: 'digital', nome: 'Avaliação online / gamificada', definicao: 'Plataformas de resposta em tempo real e missões.', pros: 'Diagnóstico instantâneo.', contras: 'Depende de conectividade.' },
  { id: 'integradora', nome: 'Avaliação integradora / prática', definicao: 'Entregas reais: protótipos, feiras, mostras, simulações.', pros: 'Alta autenticidade.', contras: 'Exige rubricas individuais dentro do grupo.' },
];

export const formaAvaliacao = (id: string) => FORMAS_AVALIACAO.find((x) => x.id === id);

export const ESPACOS = ['Sala de aula', 'Sala em círculo', 'Laboratório', 'Laboratório de informática', 'Biblioteca', 'Auditório', 'Pátio', 'Entorno da escola'];
export const RECURSOS = ['Quadro', 'Projetor', 'Livro didático', 'Caderno de bordo', 'Celular', 'Computadores', 'Folhas pautadas', 'Ficha de revisão', 'Cartões de resposta', 'Material de experimento', 'Termômetros', 'Mapas', 'Notícia impressa', 'Conta de luz', 'Cartolina', 'Gravador de celular'];
