import type { AulaPronta, DiscId, Momento } from './tipos';

// Aulas do 3º bimestre (27/07 a 05/10/2026) no modo "Recomendação para o projeto".
// Sugestões da IA (Claude) a partir do PDF do projeto, do guia de referência e das fontes citadas.
// Formato do momento: "Título|minutos|descrição|espaço|recurso; recurso"

function M(s: string): Momento {
  const [titulo, min, desc, espaco = 'Sala de aula', rec = ''] = s.split('|');
  return { titulo, min: Number(min), desc, espaco, recursos: rec ? rec.split(';').map((r) => r.trim()) : [] };
}
function A(titulo: string, caixinha: string, metodologia: string, momentos: string[], dica?: string, fontes: string[] = ['projeto']): AulaPronta {
  return { titulo, caixinha, metodologia, momentos: momentos.map(M), dica, fontes };
}

type Semana = [AulaPronta, AulaPronta];

const FIS: Semana[] = [
  [
    A('Lendo a conta de luz', 'fis-proj-problem', 'freire', [
      'Roda de abertura|10|Perguntar: a conta de luz da sua casa muda ao longo do ano? Quando fica mais cara? Anotar as falas no quadro.|Sala em círculo|Quadro',
      'Leitura da conta|20|Em duplas, com contas trazidas de casa (dados pessoais cobertos), localizar consumo em kWh, histórico dos últimos meses e bandeira tarifária.|Sala em círculo|Conta de luz; Caderno de bordo',
      'Problematização|15|Discutir: por que a bandeira fica vermelha justamente na seca? De onde vem a energia que chega à nossa casa?|Sala em círculo|Quadro; Notícia impressa',
      'Registro|5|Cada aluno escreve no caderno de bordo uma pergunta que quer responder até o fim do projeto.|Sala em círculo|Caderno de bordo',
    ], 'Peça na aula anterior que cada aluno traga uma conta de luz de casa, cobrindo nome, endereço e número do cliente. Quem não tiver recebe uma conta-modelo impressa.', ['projeto', 'freire', 'aneel']),
    A('O que já sabemos sobre calor e energia', 'fis-proj-problem', 'expositiva', [
      'Cartões anônimos|10|Cada aluno responde em um cartão sem nome: calor e temperatura são a mesma coisa? Energia e potência são a mesma coisa?||Cartões de resposta',
      'Mapa de hipóteses|20|Agrupar os cartões no quadro por tipo de resposta e discutir, sem corrigir ainda, as ideias que aparecem.||Quadro',
      'Apresentação do percurso|15|Mostrar o caminho do bimestre: Termodinâmica → máquinas térmicas → energia elétrica → revista. Explicar o papel do Consultor Científico em cada núcleo.||Projetor',
      'Combinados|5|Registrar como as hipóteses de hoje serão retomadas na autoavaliação final.||Caderno de bordo',
    ], 'Esta é a avaliação diagnóstica (0 ponto). Guarde a foto do mapa de hipóteses para comparar na semana 10.', ['projeto', 'luckesi']),
  ],
  [
    A('Energia interna, calor e trabalho', 'fis-15', 'expositiva', [
      'Pergunta de abertura|8|Por que a bomba de encher pneu esquenta? Anotar as hipóteses.||Quadro',
      'Exposição dialogada|25|Energia interna, calor e trabalho; sinais de Q e τ; 1ª Lei: ΔU = Q − τ, com exemplos do cotidiano.||Quadro; Livro didático',
      'Demonstração|12|Comprimir o ar de uma seringa tampada e sentir o aquecimento; relacionar com τ < 0 e ΔU > 0.||Seringa sem agulha',
      'Síntese|5|Voltar à bomba de pneu e explicar com a 1ª Lei.||Quadro',
    ], undefined, ['guia', 'projeto']),
    A('Trabalho no gráfico P × V', 'fis-15', 'peer', [
      'Miniexposição|12|Trabalho como área sob a curva P × V; transformações isobárica, isocórica, isotérmica e cíclica.||Projetor',
      'Teste conceitual 1|5|Em qual transformação o gás não realiza trabalho? Votação individual.||Cartões de resposta',
      'Discussão entre pares|8|Se o acerto ficar entre 30% e 70%, discutir com quem votou diferente e votar de novo.||Cartões de resposta',
      'Teste conceitual 2|15|Ciclo fechado no gráfico P × V: o trabalho total é positivo ou negativo? Por quê?||Cartões de resposta; Projetor',
      'Fechamento|10|Ligar o ciclo à ideia de motor: um ciclo que se repete transforma calor em trabalho.||Quadro',
    ], undefined, ['guia', 'mazur']),
  ],
  [
    A('Um motor de garrafa', 'fis-17', 'experimento', [
      'Pergunta|8|Calor pode virar movimento? Grupos registram hipóteses.|Laboratório|Caderno de bordo',
      'Experimento|25|Balão de festa na boca de uma garrafa PET; alternar a garrafa entre água quente e água fria e observar o balão encher e murchar.|Laboratório|Garrafa PET; Balão; Água quente e fria',
      'Análise|12|Desenhar o ciclo: fonte quente, trabalho (balão enche), fonte fria. Onde está a perda?|Laboratório|Papel',
      'Conclusão|5|Frase do grupo: toda máquina térmica precisa de uma fonte quente e de uma fonte fria.|Laboratório',
    ], 'Use água quente da torneira ou de garrafa térmica, nunca fervente. Professor manipula a água quente.', ['projeto']),
    A('A máquina de Watt e o rendimento', 'fis-17', 'phc', [
      'Prática social inicial|7|O que move um carro, um trem antigo e uma usina termelétrica?',
      'Problematização|8|Se a máquina a vapor queimava tanto carvão, por que ela mudou o mundo?||Quadro',
      'Instrumentalização|22|Funcionamento da máquina a vapor de Watt; rendimento η = τ / Q quente; exemplos numéricos.||Livro didático; Projetor',
      'Catarse|8|Cada aluno calcula o rendimento de uma máquina com dados fornecidos e explica o resultado em uma frase.||Caderno',
      'Prática social final|5|Combinar com História: na próxima aula de História, o vapor aparece como motor da Revolução Industrial.',
    ], 'Avise o professor de História: esta aula e a Revolução Industrial (semanas 2–3 de História) se completam.', ['guia', 'gasparin', 'projeto']),
  ],
  [
    A('2ª Lei e o limite de Carnot', 'fis-17', 'expositiva', [
      'Pergunta|8|Existe motor com rendimento de 100%? Votação rápida.||Quadro',
      'Exposição dialogada|25|2ª Lei da Termodinâmica; ciclo de Carnot; η máx = 1 − T fria / T quente (em kelvin).||Quadro; Livro didático',
      'Aplicação|12|Calcular o rendimento máximo de uma termelétrica com temperaturas dadas.||Caderno',
      'Síntese|5|Parte da energia sempre vira calor rejeitado: isso não é defeito de fabricação, é lei física.||Quadro',
    ], undefined, ['guia']),
    A('Por que a termelétrica encarece a conta?', 'fis-17', 'pbl', [
      'Problema|8|Ler: em outubro de 2024, a ANEEL acionou a bandeira vermelha patamar 2 (R$ 7,877 a cada 100 kWh) por causa da pouca chuva nos reservatórios.||Notícia impressa',
      'Hipóteses e lacunas|15|Grupos levantam hipóteses ligando seca, hidrelétrica, termelétrica e rendimento.||Cartolina',
      'Pesquisa orientada|20|Comparar o funcionamento de hidrelétrica e termelétrica no livro didático; calcular o acréscimo na conta de uma casa que consome 200 kWh.|Biblioteca|Livro didático; Calculadora',
      'Socialização|7|Cada grupo apresenta a cadeia causal em uma frase.',
    ], 'Com R$ 7,877 por 100 kWh, uma casa que consome 200 kWh paga cerca de R$ 15,75 a mais no mês, sem contar impostos.', ['aneel', 'projeto']),
  ],
  [
    A('Ilhas de calor: asfalto × cerrado', 'fis-19', 'experimento', [
      'Pergunta|8|Por que o asfalto queima o pé e a grama não? Hipóteses.|Pátio|Caderno de bordo',
      'Experimento|25|Deixar ao sol superfícies claras e escuras (papel branco, papel preto, cimento, terra, grama) e medir a temperatura a cada 5 minutos.|Pátio|Termômetros; Papéis branco e preto; Cronômetro',
      'Análise|12|Montar tabela e gráfico; relacionar com absorção, reflexão (albedo) e calor específico.|Pátio|Papel milimetrado',
      'Conclusão|5|Ligar ao Dossiê 4: por que bairros pouco arborizados do DF ficam mais quentes?|Pátio',
    ], 'Se houver termômetro infravermelho na escola, use-o; se não, termômetros comuns encostados na superfície funcionam.', ['projeto', 'guia']),
    A('Do kWh ao planeta: consumo e entropia', 'fis-19', 'peer', [
      'Miniexposição|12|E = P · Δt; leitura de potência em etiquetas; selo Procel; entropia como energia que se espalha e não volta a ser útil.||Projetor',
      'Teste conceitual 1|5|Quem gasta mais energia: um chuveiro de 5.500 W por 10 min ou um ventilador de 100 W por 8 h?||Cartões de resposta',
      'Discussão entre pares|8|Rodada de discussão e nova votação.||Cartões de resposta',
      'Teste conceitual 2|15|Calcular o consumo mensal de um ar-condicionado e quanto custaria na bandeira vermelha patamar 2.||Cartões de resposta; Calculadora',
      'Fechamento|10|Lista de conceitos que cada Consultor Científico precisa garantir nos textos: calor ≠ temperatura; potência ≠ energia; rendimento < 100%.||Quadro',
    ], undefined, ['guia', 'mazur', 'aneel']),
  ],
  [
    A('Revisão científica dos rascunhos (1)', 'fis-proj-revisao', 'abp', [
      'Retomada|5|Relembrar a ficha de checagem científica (conceitos, unidades, fontes).',
      'Mentoria nos núcleos|35|Cada núcleo lê seu rascunho com o professor circulando; marcar trechos com erro conceitual ou unidade errada.||Rascunhos; Ficha de revisão',
      'Checkpoint|10|Registrar no portfólio: o que corrigir e quem corrige.||Portfólio do núcleo',
    ]),
    A('A Física por trás: rascunho do infográfico', 'fis-proj-revisao', 'oficina', [
      'Planejamento|10|Escolher o fenômeno do dossiê (rendimento de usina, albedo, cálculo de kWh) e o tipo de esquema.||Ficha do gênero',
      'Produção|28|Desenhar à mão o esquema com setas de energia, números e legendas curtas.||Folhas; Lápis de cor',
      'Revisão|12|Troca entre núcleos: o esquema se entende sem o texto?||Ficha de revisão',
    ], 'Cada núcleo da revista tem um box "A Física por Trás", parte da proposta do grupo.'),
  ],
  [
    A('Revisão científica dos rascunhos (2)', 'fis-proj-revisao', 'abp', [
      'Retomada|5|Semana do Cerrado (05 a 11/09): conferir se o Dossiê 4 usa dados de calor e radiação corretamente.',
      'Mentoria nos núcleos|35|Segunda leitura dos textos já reescritos; foco em unidades e números.||Rascunhos; Ficha de revisão',
      'Checkpoint|10|Atualizar o portfólio do núcleo.||Portfólio do núcleo',
    ], 'A Semana do Cerrado está no calendário oficial da SEEDF (05 a 11/09).', ['projeto', 'seedf']),
    A('Prova contextualizada: fase 1', 'fis-proj-revisao', 'expositiva', [
      'Orientações|5|Explicar as duas fases: hoje individual com tempo limitado; na próxima aula, revisão com consulta aos textos da revista.',
      'Fase 1|40|Questões a partir de trechos dos rascunhos das 4 turmas: interpretar, calcular e corrigir afirmações.||Prova impressa',
      'Recolhimento|5|Recolher as provas sem correção.',
    ], 'O teste em duas fases une a avaliação somativa e a formativa: primeiro com tempo limitado, depois com revisão.', ['duasfases']),
  ],
  [
    A('Prova contextualizada: fase 2', 'fis-proj-revisao', 'expositiva', [
      'Devolução|5|Devolver a prova da fase 1 sem nota.',
      'Fase 2|35|Revisar as respostas consultando livro e textos da revista; justificar o que mudou.||Prova; Livro didático',
      'Devolutiva coletiva|10|Comentar os erros mais comuns.||Quadro',
    ], undefined, ['guia']),
    A('Revisão final dos boxes científicos', 'fis-proj-revisao', 'abp', [
      'Retomada|5|O que ainda falta corrigir em cada box?',
      'Ajustes|35|Núcleos finalizam boxes e infográficos com o professor validando.||Ficha de revisão',
      'Aprovação|10|Professor rubrica a versão final de cada box.||Portfólio do núcleo',
    ]),
  ],
  [
    A('Checagem final de conceitos', 'fis-proj-fecha', 'abp', [
      'Retomada|5|Checklist final do Consultor Científico.',
      'Checagem|35|Leitura cruzada entre núcleos usando o checklist.||Ficha de revisão',
      'Registro|10|Declaração de fontes do dossiê.||Portfólio do núcleo',
    ]),
    A('Infográficos na diagramação', 'fis-proj-fecha', 'abp', [
      'Orientação|5|Combinar com o Designer de cada núcleo.',
      'Digitalização|35|Fotografar ou redesenhar os infográficos para a versão digital.|Laboratório de informática|Computadores; Celular',
      'Conferência|10|Conferir legibilidade de números e unidades.|Laboratório de informática',
    ]),
  ],
  [
    A('Mostra de Editoras', 'fis-proj-mostra', 'seminario', [
      'Montagem|5|Organizar a circulação pelos estandes.|Pátio',
      'Defesa oral|35|Professor circula com a rubrica de defesa oral; perguntas sobre o box científico de cada núcleo.|Pátio|Rubrica impressa',
      'Registro|10|Anotar destaques para a devolutiva.|Pátio',
    ]),
    A('Autoavaliação e retorno às hipóteses', 'fis-proj-mostra', 'freire', [
      'Retorno|12|Mostrar a foto do mapa de hipóteses da semana 1.|Sala em círculo|Projetor',
      'Autoavaliação|25|Cada aluno responde: cite um conceito de Física que você não entendia e agora explica; como você contribuiu com seu núcleo?|Sala em círculo|Ficha de autoavaliação',
      'Roda final|13|O que mudou no seu olhar sobre a conta de luz?|Sala em círculo',
    ], 'Pedir evidência concreta na autoavaliação ("cite um conceito que agora você explica") evita respostas vagas.', ['avaliacao', 'freire']),
  ],
];

const GEO: Semana[] = [
  [
    A('Calor, seca e território', 'geo-proj-problem', 'freire', [
      'Investigação|12|Onde você sente mais calor no seu dia? Na parada de ônibus, em casa, na escola? Mapa falado da turma.|Sala em círculo|Quadro',
      'Tematização|18|Ler notícia: em 2024 Brasília chegou a 164 dias sem chuva (INMET). Quem sofre mais com isso no DF?|Sala em círculo|Notícia impressa',
      'Problematização|15|Por que algumas regiões administrativas são mais quentes que outras? Levantar hipóteses espaciais.|Sala em círculo|Mapa do DF',
      'Registro|5|Pergunta de pesquisa no caderno de bordo.|Sala em círculo|Caderno de bordo',
    ], 'Comece pelo trajeto casa–escola de cada aluno: é a leitura de mundo freireana aplicada ao espaço.', ['seca2024', 'freire', 'projeto']),
    A('Formação dos núcleos: o Analista Espacial', 'geo-proj-problem', 'expositiva', [
      'Diagnóstico|10|Leitura rápida de um mapa temático: o que a legenda diz? Respostas em cartões.||Mapas; Cartões de resposta',
      'Exposição|20|Escala do local ao global; o papel do Analista Espacial e Cartográfico em cada núcleo.||Projetor',
      'Atribuição|15|Núcleos confirmam quem é o Analista e qual dossiê vai mapear.||Caderno de bordo',
      'Combinados|5|Fontes oficiais de dados: IBGE, INMET, EPE, ONS.||Quadro',
    ], undefined, ['projeto']),
  ],
  [
    A('Do vapor à indústria 4.0', 'geo-21', 'expositiva', [
      'Pergunta|8|O que muda numa cidade quando chega uma fábrica?||Quadro',
      'Exposição dialogada|25|1ª, 2ª e 3ª Revoluções Industriais; fatores locacionais (carvão, portos, mão de obra).||Livro didático; Projetor',
      'Aplicação|12|Duplas localizam num mapa as primeiras áreas industriais inglesas e justificam.||Mapas',
      'Síntese|5|Ligar com Física: a máquina a vapor definiu onde as fábricas nasceram.||Quadro',
    ], undefined, ['guia']),
    A('Taylor, Ford e Toyota', 'geo-21', 'tbl', [
      'Teste individual|10|Questões sobre o texto indicado (taylorismo, fordismo e toyotismo).||Folha de teste',
      'Teste em equipe|12|As mesmas questões resolvidas pelo núcleo.||Folha de teste',
      'Esclarecimentos|8|Retomar as questões com mais erro.||Quadro',
      'Aplicação|20|Equipes classificam exemplos atuais (entrega por aplicativo, linha de montagem, fábrica enxuta).||Cartolina',
    ], undefined, ['guia']),
  ],
  [
    A('A industrialização tardia do Brasil', 'geo-23', 'expositiva', [
      'Pergunta|8|Por que a indústria brasileira se concentrou no Sudeste?||Quadro',
      'Exposição dialogada|25|Substituição de importações; concentração e desconcentração industrial.||Livro didático; Mapas',
      'Leitura cartográfica|12|Comparar mapas de concentração industrial em épocas diferentes.||Mapas',
      'Síntese|5|E Brasília? Uma capital planejada sem base industrial.||Quadro',
    ], undefined, ['guia']),
    A('Rodoviarismo e a cidade do automóvel', 'geo-23', 'caso', [
      'Caso|10|Brasília foi planejada para o automóvel: ler trecho e observar fotos do plano urbano.||Texto do caso',
      'Análise|25|Grupos analisam consequências para o transporte e o consumo de combustível no DF.||Roteiro de análise',
      'Decisão|15|Se vocês planejassem uma nova cidade hoje, o que mudariam?',
    ], 'Ponte com o Dossiê 2 (petróleo, motores e rodoviarismo) e com a aula de História sobre o Brasil e o DF (semana 5).', ['projeto']),
  ],
  [
    A('Matriz energética e matriz elétrica', 'geo-25', 'expositiva', [
      'Pergunta|8|De onde vem a eletricidade da sua casa?||Quadro',
      'Exposição dialogada|25|Diferença entre matriz energética e matriz elétrica; fontes renováveis e não renováveis; Sistema Interligado Nacional.||Projetor; Livro didático',
      'Dados|12|Ler o dado do Balanço Energético Nacional 2025: 88,2% da matriz elétrica foi renovável em 2024.||Projetor',
      'Síntese|5|Se a maior parte é renovável, por que a seca pesa tanto?||Quadro',
    ], undefined, ['guia', 'ben2025']),
    A('Seca, reservatório e bandeira vermelha', 'geo-25', 'estacoes', [
      'Orientação|5|Explicar as três estações.',
      'Estação 1 — notícia|13|Ler a notícia da bandeira vermelha patamar 2 e destacar a causa.||Notícia impressa',
      'Estação 2 — mapa|13|Localizar usinas e bacias hidrográficas que nascem no Cerrado.||Mapas',
      'Estação 3 — mentoria|13|Com o professor: montar a cadeia seca → reservatório → termelétrica → tarifa.',
      'Fechamento|6|Cadeia causal no quadro.||Quadro',
    ], 'O Cerrado abriga nascentes de grandes bacias hidrográficas; a Física explica por que a termelétrica é mais cara.', ['aneel', 'ben2025']),
  ],
  [
    A('Trabalho na era industrial e hoje', 'geo-27', 'freire', [
      'Investigação|12|Quem na sua família trabalha em turnos, por aplicativo ou na rua sob o sol?|Sala em círculo',
      'Tematização|18|Comparar a jornada fabril do século XIX com o trabalho por plataforma hoje.|Sala em círculo|Textos impressos',
      'Problematização|15|O calor extremo muda as condições de trabalho? Para quem?|Sala em círculo',
      'Registro|5|Ideias para entrevistas do dossiê.|Sala em círculo|Caderno de bordo',
    ], 'As entrevistas com trabalhadores são um gênero previsto na revista.', ['guia', 'freire', 'projeto']),
    A('Roteiro de entrevista territorial', 'geo-27', 'oficina', [
      'Planejamento|10|Definir quem entrevistar (familiares, funcionários da escola, moradores antigos).',
      'Escrita do roteiro|28|Perguntas sobre mudanças no clima, no bairro e na conta de luz.||Ficha do gênero',
      'Revisão|12|Troca entre núcleos e ajuste das perguntas.||Ficha de revisão',
    ], 'Lembrar do consentimento: o entrevistado autoriza o uso da fala e pode ficar anônimo.'),
  ],
  [
    A('Revisão de dados e mapas (1)', 'geo-proj-revisao', 'abp', [
      'Retomada|5|Checklist: fonte do dado, ano, escala, legenda.',
      'Mentoria|35|Professor circula conferindo números, mapas e escalas nos rascunhos.||Rascunhos; Ficha de revisão',
      'Checkpoint|10|Registro no portfólio.||Portfólio do núcleo',
    ]),
    A('Mapa temático do dossiê', 'geo-proj-revisao', 'oficina', [
      'Planejamento|10|Escolher o fenômeno e a escala do mapa.',
      'Produção|28|Desenhar o mapa temático com título, legenda, fonte e orientação.||Mapas; Papel',
      'Revisão|12|Troca entre núcleos.||Ficha de revisão',
    ]),
  ],
  [
    A('Semana do Cerrado: dados do bioma', 'geo-proj-revisao', 'estacoes', [
      'Orientação|5|Semana do Cerrado (05 a 11/09), no calendário oficial da SEEDF.',
      'Estação 1|13|Dados de queimadas e desmatamento do Cerrado em fontes oficiais.||Computadores',
      'Estação 2|13|Umidade recorde: em 03/09/2024 a estação de Ponte Alta (Gama) marcou 7%.||Notícia impressa',
      'Estação 3|13|Mentoria para o Dossiê 4.',
      'Fechamento|6|Que dado entra na revista?',
    ], undefined, ['seedf', 'umidade2024']),
    A('Prova contextualizada: fase 1', 'geo-proj-revisao', 'expositiva', [
      'Orientações|5|Explicar as duas fases.',
      'Fase 1|40|Questões a partir dos mapas e textos das revistas.||Prova impressa',
      'Recolhimento|5|Recolher sem correção.',
    ], undefined, ['guia']),
  ],
  [
    A('Prova contextualizada: fase 2', 'geo-proj-revisao', 'expositiva', [
      'Devolução|5|Devolver a prova sem nota.',
      'Fase 2|35|Revisão com consulta.||Livro didático',
      'Devolutiva|10|Erros mais comuns.||Quadro',
    ], undefined, ['guia']),
    A('Revisão final dos dados', 'geo-proj-revisao', 'abp', [
      'Retomada|5|Pendências de cada núcleo.',
      'Ajustes|35|Finalizar mapas e conferir fontes.||Ficha de revisão',
      'Aprovação|10|Professor valida.||Portfólio do núcleo',
    ]),
  ],
  [
    A('Checagem final de fontes', 'geo-proj-fecha', 'abp', [
      'Retomada|5|Lista de fontes do dossiê.',
      'Checagem|35|Cada dado tem fonte e data?||Ficha de revisão',
      'Registro|10|Referências no padrão combinado.||Portfólio do núcleo',
    ]),
    A('Mapas na diagramação', 'geo-proj-fecha', 'abp', [
      'Orientação|5|Combinar com o Designer.',
      'Digitalização|35|Digitalizar os mapas.|Laboratório de informática|Computadores; Celular',
      'Conferência|10|Legendas legíveis?|Laboratório de informática',
    ]),
  ],
  [
    A('Mostra de Editoras', 'geo-proj-mostra', 'seminario', [
      'Montagem|5|Circulação.|Pátio',
      'Defesa oral|35|Perguntas sobre os mapas e dados de cada núcleo.|Pátio|Rubrica impressa',
      'Registro|10|Destaques para a devolutiva.|Pátio',
    ]),
    A('Autoavaliação', 'geo-proj-mostra', 'freire', [
      'Retorno|12|Voltar ao mapa falado da semana 1.|Sala em círculo',
      'Autoavaliação|25|Que dado do seu território você passou a entender?|Sala em círculo|Ficha de autoavaliação',
      'Roda|13|O que pode mudar no bairro?|Sala em círculo',
    ], undefined, ['projeto', 'freire']),
  ],
];

const HIS: Semana[] = [
  [
    A('Quem constrói a cidade?', 'his-proj-problem', 'freire', [
      'Investigação|12|De onde veio sua família antes de chegar ao DF? Quando?|Sala em círculo',
      'Tematização|18|Fotos dos candangos e dos acampamentos operários na construção de Brasília.|Sala em círculo|Imagens impressas',
      'Problematização|15|Quem trabalhou para construir a capital? Onde essas pessoas foram morar?|Sala em círculo',
      'Registro|5|Pergunta de pesquisa.|Sala em círculo|Caderno de bordo',
    ], 'A história da família de cada aluno é a porta de entrada para a história do trabalho e do território.', ['freire', 'projeto']),
    A('O Curador Histórico e as fontes', 'his-proj-problem', 'expositiva', [
      'Diagnóstico|10|Cartões: o que é uma fonte histórica?||Cartões de resposta',
      'Exposição|20|Fontes primárias e secundárias; cronologia; o papel do Curador Histórico no núcleo.||Projetor',
      'Atribuição|15|Núcleos confirmam o Curador.||Caderno de bordo',
      'Combinados|5|Como citar uma fonte na revista.||Quadro',
    ]),
  ],
  [
    A('A Revolução Industrial inglesa', 'his-03', 'expositiva', [
      'Pergunta|8|Por que a Inglaterra?||Quadro',
      'Exposição dialogada|25|Cercamentos; manufatura e maquinofatura; pioneirismo inglês.||Livro didático',
      'Aplicação|12|Linha do tempo em duplas.||Caderno',
      'Síntese|5|A máquina a vapor de Watt (combinado com Física).||Quadro',
    ], undefined, ['guia']),
    A('Vozes operárias', 'his-03', 'tbl', [
      'Teste individual|10|Sobre o texto de fontes operárias.||Folha de teste',
      'Teste em equipe|12|Mesmas questões em núcleo.||Folha de teste',
      'Esclarecimentos|8|Retomada.||Quadro',
      'Aplicação|20|Análise de relato de trabalho infantil e feminino; ludismo e cartismo.||Textos impressos',
    ], undefined, ['guia']),
  ],
  [
    A('Disciplina fabril e o tempo do relógio', 'his-03', 'phc', [
      'Prática social inicial|7|Quem controla o seu tempo?',
      'Problematização|8|Por que a fábrica precisou do relógio?',
      'Instrumentalização|22|Disciplina fabril, jornada e urbanização.||Livro didático',
      'Catarse|8|Comparar com jornadas atuais.||Caderno',
      'Prática social final|5|Ideia para artigo de opinião.',
    ], undefined, ['guia', 'gasparin']),
    A('Cidade industrial e literatura', 'his-03', 'debate', [
      'Preparação|12|Trechos de relatos sobre as cidades industriais.||Textos impressos',
      'Rodadas|25|Debate: o progresso técnico melhorou a vida de quem?|Sala em círculo|Cronômetro',
      'Síntese|13|Ponte com Gramática e Literatura (O Cortiço).||Quadro',
    ]),
  ],
  [
    A('2ª Revolução Industrial e imperialismo', 'his-35', 'expositiva', [
      'Pergunta|8|Aço, eletricidade e petróleo: o que mudou?||Quadro',
      'Exposição|25|Capitalismo monopolista; busca de matérias-primas; Conferência de Berlim.||Livro didático; Mapas',
      'Aplicação|12|Mapa da partilha da África.||Mapas',
      'Síntese|5|Raízes da dependência de combustíveis fósseis.||Quadro',
    ], undefined, ['guia']),
    A('Resistências africanas', 'his-35', 'estacoes', [
      'Orientação|5|Explicar as estações.',
      'Estação 1|13|Etiópia (Adwa).||Textos impressos',
      'Estação 2|13|Zulus e Ashanti.||Textos impressos',
      'Estação 3|13|Samori Touré.||Textos impressos',
      'Fechamento|6|Síntese decolonial (Leis nº 10.639/2003 e nº 11.645/2008).',
    ], undefined, ['guia']),
  ],
  [
    A('Brasil: ferrovias, Vargas e JK', 'his-proj-brasil', 'expositiva', [
      'Pergunta|8|Por que a capital saiu do Rio?||Quadro',
      'Exposição|25|Ferrovias do café; Era Vargas (CSN, Petrobras); Plano de Metas e indústria automobilística.||Projetor',
      'Aplicação|12|Linha do tempo da modernização brasileira.||Caderno',
      'Síntese|5|Atenção: nos currículos de referência, este conteúdo costuma ser do 3º ano; aqui é aprofundamento do projeto.||Quadro',
    ], undefined, ['projeto', 'guia']),
    A('A construção de Brasília e os candangos', 'his-proj-brasil', 'caso', [
      'Caso|10|Fontes sobre os acampamentos operários e a formação das cidades-satélites.||Texto do caso',
      'Análise|25|Quem planejou, quem construiu, quem ficou fora do Plano Piloto?||Roteiro de análise',
      'Defesa|15|Relação com a segregação estudada em Geografia.',
    ], undefined, ['projeto']),
  ],
  [
    A('Revisão histórica (1)', 'his-proj-revisao', 'abp', [
      'Retomada|5|Checklist: cronologia, contexto e fonte.',
      'Mentoria|35|Leitura dos rascunhos.||Ficha de revisão',
      'Checkpoint|10|Registro no portfólio.||Portfólio do núcleo',
    ]),
    A('Linha do tempo do dossiê', 'his-proj-revisao', 'oficina', [
      'Planejamento|10|Escolher os marcos.',
      'Produção|28|Linha do tempo ilustrada.||Papel',
      'Revisão|12|Troca entre núcleos.||Ficha de revisão',
    ]),
  ],
  [
    A('Revisão histórica (2)', 'his-proj-revisao', 'abp', [
      'Retomada|5|Pendências.',
      'Mentoria|35|Segunda leitura.||Ficha de revisão',
      'Checkpoint|10|Registro.||Portfólio do núcleo',
    ]),
    A('Prova contextualizada: fase 1', 'his-proj-revisao', 'expositiva', [
      'Orientações|5|As duas fases.',
      'Fase 1|40|Questões a partir das revistas.||Prova impressa',
      'Recolhimento|5|Sem correção.',
    ], undefined, ['guia']),
  ],
  [
    A('Prova contextualizada: fase 2', 'his-proj-revisao', 'expositiva', [
      'Devolução|5|Devolver sem nota.',
      'Fase 2|35|Revisão com consulta.||Livro didático',
      'Devolutiva|10|Erros comuns.||Quadro',
    ], 'Dia do Patrono da Educação, Paulo Freire: 19/09 (calendário SEEDF).', ['guia', 'seedf']),
    A('Revisão final histórica', 'his-proj-revisao', 'abp', [
      'Retomada|5|Pendências.',
      'Ajustes|35|Finalizar linhas do tempo e fontes.||Ficha de revisão',
      'Aprovação|10|Validação.||Portfólio do núcleo',
    ]),
  ],
  [
    A('Créditos e fontes históricas', 'his-proj-fecha', 'abp', [
      'Retomada|5|Lista de fontes.',
      'Checagem|35|Imagens com crédito? Datas certas?||Ficha de revisão',
      'Registro|10|Referências.||Portfólio do núcleo',
    ]),
    A('Memória na diagramação', 'his-proj-fecha', 'abp', [
      'Orientação|5|Com o Designer.',
      'Digitalização|35|Linhas do tempo e imagens.|Laboratório de informática|Computadores',
      'Conferência|10|Revisão.|Laboratório de informática',
    ]),
  ],
  [
    A('Mostra de Editoras', 'his-proj-mostra', 'seminario', [
      'Montagem|5|Circulação.|Pátio',
      'Defesa oral|35|Perguntas sobre contexto e fontes.|Pátio|Rubrica impressa',
      'Registro|10|Destaques.|Pátio',
    ]),
    A('Autoavaliação', 'his-proj-mostra', 'freire', [
      'Retorno|12|A história da sua família mudou de sentido?|Sala em círculo',
      'Autoavaliação|25|Ficha com evidências.|Sala em círculo|Ficha de autoavaliação',
      'Roda|13|Rupturas e permanências.|Sala em círculo',
    ], undefined, ['projeto', 'freire']),
  ],
];

const RED: Semana[] = [
  [
    A('Aulão: o que a turma quer dizer?', 'red-proj-problem', 'freire', [
      'Investigação|12|Que notícias sobre calor, seca e conta de luz vocês viram nas redes?|Sala em círculo',
      'Tematização|18|Ler uma notícia sobre a seca de 2024 e identificar quem fala e quem não fala nela.|Sala em círculo|Notícia impressa',
      'Problematização|15|Se fôssemos a redação de uma revista, que pergunta faríamos?|Sala em círculo',
      'Registro|5|Pauta inicial.|Sala em círculo|Caderno de bordo',
    ], undefined, ['freire', 'seca2024', 'projeto']),
    A('Nasce a editora', 'red-proj-problem', 'abp', [
      'Apresentação|5|Cada turma é uma editora; 6 núcleos de 5 alunos; 6 dossiês.',
      'Formação|35|Núcleos escolhem nome da editora, dossiê e papéis: Editor-Chefe, Curador Histórico, Analista Espacial, Consultor Científico e Designer.||Ficha de papéis',
      'Registro|10|Ata do núcleo no portfólio.||Portfólio do núcleo',
    ], 'Grupos de 5 com papéis definidos (editor-chefe, curador histórico, analista espacial, consultor científico e designer) ajudam a dividir o trabalho e evitar o "efeito carona".', ['grupo']),
  ],
  [
    A('Como é uma revista de divulgação científica', 'red-proj-generos', 'estacoes', [
      'Orientação|5|Explicar as estações.',
      'Estação 1|13|Analisar uma reportagem de revista real.||Revistas impressas',
      'Estação 2|13|Analisar um editorial e um artigo de opinião.||Revistas impressas',
      'Estação 3|13|Analisar um infográfico.||Revistas impressas',
      'Fechamento|6|Quadro comparativo dos gêneros.||Quadro',
    ], 'Use exemplares reais de revistas de divulgação científica, como Pesquisa FAPESP e Ciência Hoje, que têm sites abertos.', ['revistas', 'marcuschi']),
    A('Reportagem e retextualização', 'red-proj-generos', 'expositiva', [
      'Pergunta|8|Como explicar a 2ª Lei da Termodinâmica para sua avó?||Quadro',
      'Exposição|25|Estrutura da reportagem (lide, intertítulos, citações); retextualização sem perder a precisão.||Projetor',
      'Aplicação|12|Retextualizar um parágrafo do livro de Física.||Livro didático',
      'Síntese|5|Critérios da boa reportagem.||Quadro',
    ]),
  ],
  [
    A('Editorial, artigo de opinião e entrevista', 'red-proj-generos', 'tbl', [
      'Teste individual|10|Características de cada gênero.||Folha de teste',
      'Teste em equipe|12|Mesmas questões.||Folha de teste',
      'Esclarecimentos|8|Retomada.||Quadro',
      'Aplicação|20|Núcleos planejam quais gêneros seu dossiê terá.||Ficha do gênero',
    ]),
    A('Pauta do dossiê', 'red-proj-generos', 'oficina', [
      'Planejamento|10|Pergunta central do dossiê.',
      'Escrita|28|Pauta: títulos provisórios, fontes, entrevistados e responsáveis.||Folhas pautadas',
      'Revisão|12|Editor-Chefe apresenta a pauta à turma.',
    ]),
  ],
  [
    A('Curadoria: como checar uma informação', 'red-28', 'caso', [
      'Caso|10|Duas manchetes contraditórias sobre o mesmo dado de energia.||Texto do caso',
      'Análise|25|Quem publicou? Quando? Qual a fonte original?||Roteiro de análise',
      'Decisão|15|Qual manchete entra na revista e por quê?',
    ], undefined, ['guia']),
    A('Caça às alucinações', 'red-28', 'pbl', [
      'Problema|8|Texto gerado por IA sobre "Termodinâmica e seca no DF" com erros de propósito.||Texto do problema',
      'Hipóteses|15|Grupos marcam trechos suspeitos.||Cartolina',
      'Pesquisa|20|Conferir com livro didático e fontes oficiais.|Biblioteca|Livro didático; Computadores',
      'Socialização|7|Quantos erros cada grupo achou?',
    ], 'Mostrar na prática que a IA pode inventar dados e errar conceitos é a forma mais rápida de ensinar a checar fontes.', ['grupo', 'bncc']),
  ],
  [
    A('Repertório interdisciplinar', 'red-21', 'oficina', [
      'Planejamento|10|Banco coletivo de repertórios de Física, História e Geografia.',
      'Escrita|28|Cada núcleo seleciona 3 repertórios legítimos e pertinentes para o seu texto.||Fichas',
      'Revisão|12|Troca entre núcleos.||Ficha de revisão',
    ], undefined, ['guia']),
    A('Contra-argumentação', 'red-21', 'debate', [
      'Preparação|12|Tese: a transição energética resolve a crise climática?',
      'Rodadas|25|Debate regrado com concessão e refutação.|Sala em círculo|Cronômetro',
      'Síntese|13|Estratégias de refutação que vão para os artigos.||Quadro',
    ], undefined, ['guia']),
  ],
  [
    A('Primeira versão manuscrita', 'red-proj-revisao', 'oficina', [
      'Planejamento|10|Retomar a pauta.',
      'Escrita|28|1ª versão à mão, sem IA.||Folhas pautadas',
      'Revisão|12|Autorrevisão.||Ficha de revisão',
    ], 'Escrever a 1ª versão à mão, em sala e sem IA, garante que o texto é dos alunos.', ['grupo']),
    A('Escrita do editorial (Conselho Editorial)', 'red-proj-revisao', 'oficina', [
      'Planejamento|10|Editores-Chefes se reúnem; tese da edição.',
      'Escrita|28|Editorial coletivo da turma.||Folhas pautadas',
      'Revisão|12|Leitura para a turma.',
    ]),
  ],
  [
    A('Revisão por pares', 'red-proj-revisao', 'oficina', [
      'Orientação|10|Ficha de revisão por pares: clareza, gênero, fontes.||Ficha de revisão',
      'Revisão|28|Núcleos trocam textos.||Ficha de revisão',
      'Devolutiva|12|Conversa entre os núcleos.',
    ], 'Semana do Cerrado (05 a 11/09): bom momento para o Dossiê 4.', ['projeto', 'seedf']),
    A('Reescrita', 'red-proj-revisao', 'oficina', [
      'Planejamento|10|Ler os comentários recebidos.',
      'Reescrita|30|2ª versão.||Folhas pautadas',
      'Registro|10|O que mudou e por quê (portfólio).||Portfólio do núcleo',
    ]),
  ],
  [
    A('Uso consciente de IA: revisor, não autor', 'red-proj-revisao', 'oficina', [
      'Orientação|10|Pedir à IA só apontamentos ("não reescreva meu texto").|Laboratório de informática',
      'Prática|28|Registrar no diário de prompts: objetivo, prompt, resposta e o que aceitaram.|Laboratório de informática|Computadores',
      'Revisão|12|Decidir o que incorporar.|Laboratório de informática',
    ], 'Regra do grupo: a IA só aponta problemas, quem reescreve é o aluno; tudo fica registrado no diário de prompts.', ['grupo']),
    A('Versão final dos textos', 'red-proj-revisao', 'oficina', [
      'Planejamento|10|Últimos ajustes.',
      'Escrita|30|Versão final.||Folhas pautadas',
      'Entrega|10|Entrega ao Designer.',
    ]),
  ],
  [
    A('Diagramação da revista', 'red-proj-fecha', 'abp', [
      'Orientação|5|Hierarquia visual: títulos, intertítulos, boxes, legendas.|Laboratório de informática',
      'Diagramação|35|Montagem em ferramenta gratuita (Canva Educação, Google Slides ou LibreOffice).|Laboratório de informática|Computadores',
      'Checkpoint|10|Revisão de páginas.|Laboratório de informática',
    ]),
    A('Capa, sumário e expediente', 'red-proj-fecha', 'abp', [
      'Orientação|5|Elementos obrigatórios.|Laboratório de informática',
      'Produção|35|Capa, sumário e expediente com os créditos e funções.|Laboratório de informática|Computadores',
      'Revisão|10|Conferência final.|Laboratório de informática',
    ]),
  ],
  [
    A('Mostra de Editoras', 'red-proj-mostra', 'seminario', [
      'Montagem|5|Estandes das 4 editoras.|Pátio',
      'Defesa oral|35|Apresentação das revistas e respostas ao público.|Pátio|Rubrica impressa',
      'Registro|10|Destaques.|Pátio',
    ]),
    A('Autoavaliação e portfólio', 'red-proj-mostra', 'freire', [
      'Retorno|12|Comparar a 1ª e a última versão do texto.|Sala em círculo|Portfólio do núcleo',
      'Autoavaliação|25|Ficha com evidências de evolução na escrita.|Sala em círculo|Ficha de autoavaliação',
      'Roda|13|Para quem escrevemos?|Sala em círculo',
    ], undefined, ['projeto', 'freire']),
  ],
];

const GL: Semana[] = [
  [
    A('Palavras do calor', 'gl-proj-problem', 'freire', [
      'Investigação|12|Que palavras e expressões a família usa para falar do calor e da seca?|Sala em círculo',
      'Tematização|18|Variação linguística nas falas coletadas.|Sala em círculo',
      'Problematização|15|Por que algumas falas aparecem na imprensa e outras não?|Sala em círculo',
      'Registro|5|Lista de expressões.|Sala em círculo|Caderno de bordo',
    ], undefined, ['freire', 'guia']),
    A('Diagnóstico de escrita', 'gl-proj-problem', 'expositiva', [
      'Diagnóstico|20|Pequeno parágrafo explicando por que a conta de luz sobe na seca.||Folhas pautadas',
      'Exposição|20|O que a revisão linguística vai cuidar no projeto.||Projetor',
      'Combinados|10|Ficha de revisão linguística.||Ficha de revisão',
    ], 'O parágrafo diagnóstico vira referência para medir a evolução.', ['luckesi']),
  ],
  [
    A('Coordenação: somar, opor, concluir', 'gl-gra-21', 'expositiva', [
      'Pergunta|8|"Choveu pouco, mas a conta subiu" — o que o "mas" faz?||Quadro',
      'Exposição|25|Orações coordenadas e valores das conjunções.||Livro didático',
      'Aplicação|12|Reescrever frases sobre energia trocando conjunções.||Caderno',
      'Síntese|5|Operadores argumentativos.||Quadro',
    ], undefined, ['guia']),
    A('Operadores em textos jornalísticos', 'gl-gra-21', 'peer', [
      'Miniexposição|12|Operadores de adição, oposição e conclusão.||Projetor',
      'Teste 1|5|Qual conjunção mantém o sentido?||Cartões de resposta',
      'Discussão|8|Pares.||Cartões de resposta',
      'Teste 2|15|Trechos de reportagem.||Cartões de resposta',
      'Fechamento|10|Lista para a ficha de revisão.||Quadro',
    ], undefined, ['guia', 'mazur']),
  ],
  [
    A('Causa e consequência', 'gl-gra-27', 'expositiva', [
      'Pergunta|8|Como ligar seca → reservatório → termelétrica → tarifa numa frase só?||Quadro',
      'Exposição|25|Subordinadas adverbiais causais, consecutivas, concessivas e condicionais.||Livro didático',
      'Aplicação|12|Montar a cadeia causal em períodos compostos.||Caderno',
      'Síntese|5|Pontuação das adverbiais.||Quadro',
    ], undefined, ['guia', 'projeto']),
    A('Reescrita de parágrafos argumentativos', 'gl-gra-27', 'oficina', [
      'Planejamento|10|Parágrafo-modelo com problemas de coesão.',
      'Reescrita|28|Reescrever com períodos compostos variados.||Folhas pautadas',
      'Revisão|12|Troca em duplas.||Ficha de revisão',
    ], undefined, ['guia']),
  ],
  [
    A('Machado de Assis e o progresso', 'gl-lit-14', 'expositiva', [
      'Pergunta|8|Todo progresso é bom para todos?||Quadro',
      'Exposição|25|Realismo; ironia; crônicas de Machado sobre a modernização do Rio.||Livro didático',
      'Leitura|12|Trecho de crônica comentado.||Textos impressos',
      'Síntese|5|Ironia como crítica.||Quadro',
    ], undefined, ['guia', 'projeto']),
    A('Crônica: ontem e hoje', 'gl-lit-14', 'caso', [
      'Caso|10|Uma crônica de Machado e uma crônica atual sobre a cidade.||Textos impressos',
      'Análise|25|O que se repete? O que mudou?||Roteiro de análise',
      'Defesa|15|Ideia de crônica para a revista.',
    ]),
  ],
  [
    A('O Cortiço: espaço, trabalho e determinismo', 'gl-lit-18', 'phc', [
      'Prática social inicial|7|Onde moram os trabalhadores na sua cidade?',
      'Problematização|8|O espaço determina as pessoas?',
      'Instrumentalização|22|Naturalismo; trechos de O Cortiço; crítica ao determinismo racial.||Textos impressos',
      'Catarse|8|Relação com segregação urbana (Geografia).||Caderno',
      'Prática social final|5|Pauta da seção Cultura e Memória.',
    ], undefined, ['guia', 'gasparin']),
    A('Planejando a seção Cultura e Memória', 'gl-lit-18', 'oficina', [
      'Planejamento|10|Ensaio ou crônica ilustrada ligando o século XIX ao DF de hoje.',
      'Escrita|28|Roteiro do texto.||Folhas pautadas',
      'Revisão|12|Troca.||Ficha de revisão',
    ], 'A seção Cultura, Literatura e Memória faz parte da estrutura da revista proposta pelo grupo.', ['grupo']),
  ],
  [
    A('Revisão linguística (1)', 'gl-proj-revisao', 'abp', [
      'Retomada|5|Ficha: concordância, regência, pontuação, operadores.',
      'Mentoria|35|Leitura dos rascunhos.||Ficha de revisão',
      'Checkpoint|10|Registro.||Portfólio do núcleo',
    ]),
    A('Crônica literária: 1ª versão', 'gl-proj-revisao', 'oficina', [
      'Planejamento|10|Retomar o roteiro.',
      'Escrita|28|1ª versão manuscrita.||Folhas pautadas',
      'Revisão|12|Autorrevisão.||Ficha de revisão',
    ]),
  ],
  [
    A('Revisão linguística (2)', 'gl-proj-revisao', 'abp', [
      'Retomada|5|Pendências.',
      'Mentoria|35|Segunda leitura.||Ficha de revisão',
      'Checkpoint|10|Registro.||Portfólio do núcleo',
    ]),
    A('Variação linguística nas entrevistas', 'gl-proj-revisao', 'oficina', [
      'Orientação|10|Transcrição ética: respeitar a fala do entrevistado.',
      'Prática|28|Editar a transcrição das entrevistas sem apagar a variedade linguística.||Transcrições',
      'Revisão|12|Troca.||Ficha de revisão',
    ], 'Variação e preconceito linguístico fazem parte do eixo de Sociolinguística do 2º ano.', ['pe-lp', 'bncc']),
  ],
  [
    A('Revisão por pares linguística', 'gl-proj-revisao', 'oficina', [
      'Orientação|10|Ficha de revisão por pares.||Ficha de revisão',
      'Revisão|28|Troca entre núcleos.||Ficha de revisão',
      'Devolutiva|12|Conversa.',
    ], 'Esta revisão vale como avaliação no lugar da prova (sugestão de avaliação da frente).'),
    A('Crônica literária: versão final', 'gl-proj-revisao', 'oficina', [
      'Planejamento|10|Comentários recebidos.',
      'Reescrita|30|Versão final.||Folhas pautadas',
      'Entrega|10|Ao Designer.',
    ]),
  ],
  [
    A('Revisão final da norma', 'gl-proj-fecha', 'abp', [
      'Retomada|5|Últimos ajustes.',
      'Revisão|35|Leitura final de todas as páginas.||Ficha de revisão',
      'Aprovação|10|Validação.||Portfólio do núcleo',
    ]),
    A('Títulos e legendas', 'gl-proj-fecha', 'oficina', [
      'Planejamento|10|O que faz um bom título?',
      'Escrita|28|Revisar títulos, linhas finas e legendas.||Folhas pautadas',
      'Revisão|12|Votação dos melhores títulos.',
    ]),
  ],
  [
    A('Mostra de Editoras: sarau de crônicas', 'gl-proj-mostra', 'seminario', [
      'Montagem|5|Espaço do sarau.|Pátio',
      'Leituras|35|Leitura das crônicas da seção Cultura e Memória.|Pátio|Rubrica impressa',
      'Registro|10|Destaques.|Pátio',
    ]),
    A('Autoavaliação', 'gl-proj-mostra', 'freire', [
      'Retorno|12|Comparar com o parágrafo diagnóstico da semana 1.|Sala em círculo',
      'Autoavaliação|25|Ficha com evidências.|Sala em círculo|Ficha de autoavaliação',
      'Roda|13|O que a literatura do século XIX diz do DF de hoje?|Sala em círculo',
    ], undefined, ['projeto', 'freire']),
  ],
];

export const AULAS_3BIM: Record<DiscId, Semana[]> = { fis: FIS, geo: GEO, his: HIS, red: RED, gl: GL };

/** Fases do projeto no 3º bimestre (semanas 1 a 10). */
export const FASES = [
  { nome: 'Problematização', semanas: [1, 1], cor: 'f1' },
  { nome: 'Teoria', semanas: [2, 5], cor: 'f2' },
  { nome: 'Escrita e revisão', semanas: [6, 8], cor: 'f3' },
  { nome: 'Fechamento', semanas: [9, 9], cor: 'f4' },
  { nome: 'Mostra', semanas: [10, 10], cor: 'f5' },
];

/** Posição das caixinhas no 3º bimestre no modo projeto: [caixinha, semana inicial, nº de semanas]. */
export const LAYOUT_PROJETO: Record<DiscId, [string, number, number][]> = {
  fis: [['fis-proj-problem', 1, 1], ['fis-15', 2, 1], ['fis-17', 3, 2], ['fis-19', 5, 1], ['fis-proj-revisao', 6, 3], ['fis-proj-fecha', 9, 1], ['fis-proj-mostra', 10, 1]],
  geo: [['geo-proj-problem', 1, 1], ['geo-21', 2, 1], ['geo-23', 3, 1], ['geo-25', 4, 1], ['geo-27', 5, 1], ['geo-proj-revisao', 6, 3], ['geo-proj-fecha', 9, 1], ['geo-proj-mostra', 10, 1]],
  his: [['his-proj-problem', 1, 1], ['his-03', 2, 2], ['his-35', 4, 1], ['his-proj-brasil', 5, 1], ['his-proj-revisao', 6, 3], ['his-proj-fecha', 9, 1], ['his-proj-mostra', 10, 1]],
  red: [['red-proj-problem', 1, 1], ['red-proj-generos', 2, 2], ['red-28', 4, 1], ['red-21', 5, 1], ['red-proj-revisao', 6, 3], ['red-proj-fecha', 9, 1], ['red-proj-mostra', 10, 1]],
  gl: [['gl-proj-problem', 1, 1], ['gl-gra-21', 2, 1], ['gl-gra-27', 3, 1], ['gl-lit-14', 4, 1], ['gl-lit-18', 5, 1], ['gl-proj-revisao', 6, 3], ['gl-proj-fecha', 9, 1], ['gl-proj-mostra', 10, 1]],
};
