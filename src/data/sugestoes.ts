import type { DiscId } from './tipos';

// Sugestões da IA (Claude). Todas aparecem só quando a pessoa clica em "Ver sugestão da IA".
export interface Sugestao {
  texto: string;
  fontes: string[];
}

export const SUG_PROJETO = {
  objetivoGeral: {
    texto:
      'Promover a compreensão crítica e integrada das relações entre energia, trabalho industrial e crise climática, articulando Física, Geografia, História e Língua Portuguesa a partir de problemas reais do Distrito Federal, por meio da pesquisa e da produção colaborativa de uma revista estudantil por turma, formando sujeitos autônomos, leitores críticos da mídia e produtores conscientes de conhecimento.',
    fontes: ['grupo', 'freire', 'bncc'],
  },
  objetivosEspecificos: {
    texto: [
      'Aplicar as leis da Termodinâmica e o cálculo de consumo elétrico para interpretar ondas de calor, ilhas de calor urbanas e a variação da conta de luz.',
      'Analisar historicamente a evolução das fontes de energia, da 1ª Revolução Industrial ao rodoviarismo brasileiro, reconhecendo as relações de trabalho envolvidas.',
      'Relacionar a degradação do Cerrado, a matriz elétrica e a desigualdade socioespacial do DF à justiça climática.',
      'Produzir textos jornalísticos e de divulgação científica rigorosos e acessíveis, mobilizando recursos gramaticais e repertório literário.',
      'Pesquisar com autonomia: formular perguntas, distinguir fontes confiáveis de desinformação e fazer curadoria ética de dados.',
      'Planejar e executar um projeto editorial em equipe, com divisão de tarefas, prazos, revisão por pares e edição gráfica.',
      'Assumir o protagonismo como sujeito curioso e produtor de conhecimento, superando a postura de receptor passivo (educação libertadora).',
      'Usar a inteligência artificial de forma crítica e ética, reconhecendo seus limites e seu impacto energético.',
    ].join('\n'),
    fontes: ['grupo', 'freire', 'bncc'],
  },
  justificativa: {
    texto:
      'Na perspectiva de Paulo Freire, o ato educativo parte da leitura de mundo: das contradições que os estudantes vivem no próprio território. No Distrito Federal, a crise climática não é abstração. Em 2024, Brasília chegou a 164 dias sem chuva, superando o recorde histórico de 1963, segundo o INMET; no mesmo período, a umidade do ar chegou a 7% em uma estação do Gama. Quando falta chuva nos reservatórios, o sistema elétrico aciona usinas termelétricas, mais caras, e a ANEEL aplica a bandeira vermelha patamar 2, que em outubro de 2024 acrescentou R$ 7,877 a cada 100 kWh consumidos. A seca chega, assim, ao corpo e ao orçamento das famílias.\n\nQuestão norteadora: por que as ondas de calor e a seca no Cerrado encarecem a conta de luz em nossas casas, e como as leis físicas da energia, a história da industrialização e a organização desigual do espaço urbano explicam e permitem repensar esse cenário?\n\nA revista responde a duas fragilidades da escola média: a fragmentação curricular, que separa a fórmula do rendimento térmico da história da máquina a vapor e da geografia da energia, e a artificialidade da escrita escolar, feita apenas para receber nota. Ao assumirem o papel de pesquisadores e editores, os estudantes praticam a interdisciplinaridade sem diluir o rigor de cada ciência e escrevem para leitores reais da comunidade escolar.',
    fontes: ['freire', 'seca2024', 'umidade2024', 'aneel', 'fazenda', 'marcuschi'],
  },
};

export const SUG_DISC: Record<DiscId, { objetivoGeral: string; objetivosEspecificos: string; justificativa: string; produto: string; fontes: string[] }> = {
  fis: {
    objetivoGeral: 'Compreender as leis da Termodinâmica e a conversão de energia em máquinas térmicas e no consumo elétrico doméstico, usando esse conhecimento para explicar com rigor científico os fenômenos tratados na revista.',
    objetivosEspecificos: [
      'Diferenciar calor, temperatura e energia interna e aplicar a 1ª Lei da Termodinâmica.',
      'Explicar o funcionamento de máquinas térmicas e calcular rendimentos, reconhecendo o limite imposto pela 2ª Lei.',
      'Relacionar absorção de radiação e albedo à formação de ilhas de calor.',
      'Calcular consumo de energia elétrica (E = P · Δt) e o impacto da bandeira tarifária na conta.',
      'Garantir a correção conceitual dos textos e infográficos da revista como Consultor Científico.',
    ].join('\n'),
    justificativa: 'A Termodinâmica é o "motor" do tema: sem ela, a Revolução Industrial vira só data e a conta de luz vira só número. Ao calcular o rendimento de uma termelétrica e medir o aquecimento do asfalto, o estudante entende fisicamente por que a seca encarece a energia e por que bairros pouco arborizados ficam mais quentes.',
    produto: 'Boxes "A Física por Trás" e infográficos de cada núcleo (rendimento de usinas, albedo, cálculo de kWh), revisados conceitualmente pelos Consultores Científicos.',
    fontes: ['grupo', 'guia'],
  },
  geo: {
    objetivoGeral: 'Analisar a industrialização, as matrizes energéticas e a urbanização como processos que organizam o território, relacionando-os à crise climática e à desigualdade socioespacial no Distrito Federal.',
    objetivosEspecificos: [
      'Explicar os fatores locacionais e os modelos produtivos das revoluções industriais.',
      'Comparar matriz energética e matriz elétrica e explicar a vulnerabilidade da matriz hidrelétrica à seca.',
      'Relacionar o desmatamento do Cerrado às águas que abastecem hidrelétricas.',
      'Mapear a desigualdade de acesso à arborização e ao conforto térmico no DF.',
      'Produzir mapas temáticos com título, legenda, escala e fonte para a revista.',
    ].join('\n'),
    justificativa: 'O espaço é onde a crise climática se distribui de forma desigual. A Geografia permite que o estudante leia o próprio trajeto, o bairro e o DF como resultado de escolhas históricas e econômicas, e transforme dados oficiais em mapas que a comunidade consegue ler.',
    produto: 'Mapas temáticos, dados verificados (IBGE, INMET, EPE, ONS) e entrevistas territoriais em cada núcleo.',
    fontes: ['grupo', 'guia'],
  },
  his: {
    objetivoGeral: 'Compreender as revoluções industriais e a modernização brasileira como processos que transformaram o trabalho, a energia e as cidades, reconhecendo os sujeitos que construíram esse percurso.',
    objetivosEspecificos: [
      'Analisar a transição da manufatura à maquinofatura e as condições de trabalho fabril.',
      'Relacionar a 2ª Revolução Industrial ao imperialismo e à dependência de combustíveis fósseis.',
      'Reconhecer resistências africanas e operárias (Leis nº 10.639/2003 e nº 11.645/2008).',
      'Compreender a construção de Brasília e o papel dos candangos na formação do DF.',
      'Usar fontes históricas com crítica e crédito correto na revista.',
    ].join('\n'),
    justificativa: 'A História mostra que a máquina não é neutra: ela reorganizou o trabalho, o espaço e as relações de poder. Partir da história da família de cada aluno no DF transforma a Revolução Industrial em algo que chega até a cidade onde ele vive.',
    produto: 'Linhas do tempo, curadoria de fontes e contextualização histórica de cada núcleo.',
    fontes: ['grupo', 'guia'],
  },
  red: {
    objetivoGeral: 'Desenvolver a produção de textos jornalísticos e de divulgação científica com função social real, conduzindo o processo editorial da revista do planejamento à publicação.',
    objetivosEspecificos: [
      'Reconhecer a estrutura e a finalidade da reportagem, do editorial, do artigo de opinião, da entrevista e do infográfico.',
      'Retextualizar conhecimento científico para o leitor leigo sem perder precisão.',
      'Argumentar com repertório interdisciplinar, contra-argumentação e proposta de intervenção.',
      'Checar fontes e combater a desinformação.',
      'Revisar por pares e reescrever, registrando a evolução no portfólio.',
      'Usar IA como revisora crítica, nunca como autora.',
    ].join('\n'),
    justificativa: 'Escrever só para o professor dar nota esvazia a escrita. Na revista, o texto tem leitor real, gênero definido e compromisso com a verdade, o que dá sentido à revisão, à curadoria de fontes e à argumentação.',
    produto: 'A revista de cada turma: capa, editorial, sumário, 6 temas (um por núcleo), seção Cultura e Memória e seção de bastidores e transparência de IA.',
    fontes: ['grupo', 'guia'],
  },
  gl: {
    objetivoGeral: 'Mobilizar a análise linguística e a leitura literária do século XIX para dar coesão, precisão e repertório cultural aos textos da revista.',
    objetivosEspecificos: [
      'Usar orações coordenadas e subordinadas adverbiais para construir explicações causais.',
      'Revisar concordância, regência e pontuação nos textos jornalísticos.',
      'Respeitar a variação linguística na transcrição de entrevistas.',
      'Relacionar Realismo e Naturalismo às transformações urbanas e industriais.',
      'Produzir crônica ou ensaio para a seção Cultura e Memória.',
    ].join('\n'),
    justificativa: 'A gramática ganha sentido quando serve para ligar seca, reservatório, termelétrica e tarifa numa explicação clara. A literatura realista e naturalista registrou, no século XIX, as mesmas transformações que a Física, a História e a Geografia explicam.',
    produto: 'Revisão linguística de todas as páginas e a seção Cultura, Literatura e Memória (crônicas e ensaios).',
    fontes: ['grupo', 'guia'],
  },
};

/** Avaliação sugerida para o 3º bimestre (10 pontos por disciplina). */
export const SUG_AVALIACAO: Record<DiscId, { forma: string; nome: string; pontos: number; caixinhas: string[] }[]> = {
  fis: [
    { forma: 'diagnostica', nome: 'Mapa de hipóteses sobre calor e energia', pontos: 0, caixinhas: [] },
    { forma: 'portfolio', nome: 'Portfólio do núcleo editorial', pontos: 2, caixinhas: [] },
    { forma: 'duasfases', nome: 'Prova contextualizada em duas fases', pontos: 3, caixinhas: ['fis-15', 'fis-17', 'fis-19'] },
    { forma: 'integradora', nome: 'Revista: parte de Física', pontos: 3, caixinhas: ['fis-proj-revisao'] },
    { forma: 'seminario', nome: 'Defesa oral na Mostra de Editoras', pontos: 1, caixinhas: ['fis-proj-mostra'] },
    { forma: 'autoavaliacao', nome: 'Autoavaliação', pontos: 1, caixinhas: [] },
  ],
  geo: [
    { forma: 'diagnostica', nome: 'Mapa falado: onde sinto calor', pontos: 0, caixinhas: [] },
    { forma: 'portfolio', nome: 'Portfólio do núcleo editorial', pontos: 2, caixinhas: [] },
    { forma: 'duasfases', nome: 'Prova contextualizada em duas fases', pontos: 3, caixinhas: ['geo-21', 'geo-23', 'geo-25', 'geo-27'] },
    { forma: 'integradora', nome: 'Revista: parte de Geografia', pontos: 3, caixinhas: ['geo-proj-revisao'] },
    { forma: 'seminario', nome: 'Defesa oral na Mostra de Editoras', pontos: 1, caixinhas: ['geo-proj-mostra'] },
    { forma: 'autoavaliacao', nome: 'Autoavaliação', pontos: 1, caixinhas: [] },
  ],
  his: [
    { forma: 'diagnostica', nome: 'Roda: de onde veio sua família', pontos: 0, caixinhas: [] },
    { forma: 'portfolio', nome: 'Portfólio do núcleo editorial', pontos: 2, caixinhas: [] },
    { forma: 'duasfases', nome: 'Prova contextualizada em duas fases', pontos: 3, caixinhas: ['his-03', 'his-35', 'his-proj-brasil'] },
    { forma: 'integradora', nome: 'Revista: parte de História', pontos: 3, caixinhas: ['his-proj-revisao'] },
    { forma: 'seminario', nome: 'Defesa oral na Mostra de Editoras', pontos: 1, caixinhas: ['his-proj-mostra'] },
    { forma: 'autoavaliacao', nome: 'Autoavaliação', pontos: 1, caixinhas: [] },
  ],
  red: [
    { forma: 'diagnostica', nome: 'Pauta inicial da turma', pontos: 0, caixinhas: [] },
    { forma: 'portfolio', nome: 'Processo de escrita e reescrita (versões no portfólio)', pontos: 3, caixinhas: ['red-proj-revisao'] },
    { forma: 'pares', nome: 'Revisão por pares', pontos: 2, caixinhas: ['red-proj-revisao'] },
    { forma: 'integradora', nome: 'Revista: parte de Redação', pontos: 3, caixinhas: ['red-proj-generos', 'red-28', 'red-21'] },
    { forma: 'seminario', nome: 'Defesa oral na Mostra de Editoras', pontos: 1, caixinhas: ['red-proj-mostra'] },
    { forma: 'autoavaliacao', nome: 'Autoavaliação', pontos: 1, caixinhas: [] },
  ],
  gl: [
    { forma: 'diagnostica', nome: 'Parágrafo diagnóstico', pontos: 0, caixinhas: [] },
    { forma: 'portfolio', nome: 'Portfólio do núcleo editorial', pontos: 2, caixinhas: [] },
    { forma: 'pares', nome: 'Revisão linguística por pares', pontos: 3, caixinhas: ['gl-gra-21', 'gl-gra-27'] },
    { forma: 'integradora', nome: 'Revista: parte de Gram. e Lit.', pontos: 3, caixinhas: ['gl-lit-14', 'gl-lit-18', 'gl-proj-revisao'] },
    { forma: 'seminario', nome: 'Sarau de crônicas na Mostra', pontos: 1, caixinhas: ['gl-proj-mostra'] },
    { forma: 'autoavaliacao', nome: 'Autoavaliação', pontos: 1, caixinhas: [] },
  ],
};

