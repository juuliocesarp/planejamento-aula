// Explicações curtas (com exemplo no projeto) mostradas pelo botão "?" das listas
// de metodologia e de forma de avaliação. A explicação resume a fonte indicada;
// o exemplo é uma sugestão da IA aplicada ao tema "Energia, Trabalho e Território".

export interface Ajuda {
  comoFunciona: string;
  quandoUsar: string;
  exemplo: string;
  fontes: string[];
}

export const AJUDA_METODOLOGIA: Record<string, Ajuda> = {
  expositiva: {
    comoFunciona: 'O professor apresenta o conteúdo em blocos curtos, mas interrompe a exposição com perguntas, pede exemplos e parte do que a turma já sabe. Não é palestra: os alunos falam durante a aula.',
    quandoUsar: 'Para introduzir conceitos novos e organizar um conteúdo que os alunos ainda não conseguem descobrir sozinhos.',
    exemplo: 'Geografia abre com "o que muda numa cidade quando chega uma fábrica?", anota as hipóteses no quadro e explica as Revoluções Industriais voltando a elas. No fim, a turma confere quais hipóteses se confirmaram.',
    fontes: ['metativas'],
  },
  freire: {
    comoFunciona: 'Em roda, a turma investiga um tema gerador do próprio cotidiano. Ele é apresentado como uma imagem ou notícia (codificação), analisado em grupo (decodificação) e transformado em perguntas críticas sobre a realidade.',
    quandoUsar: 'Quando o conteúdo toca a vida dos alunos e você quer partir do que eles vivem para chegar ao conhecimento científico.',
    exemplo: 'A turma recebe uma foto da conta de luz de uma família do DF. Em roda, conversa sobre o que pesa na conta, quem paga mais e por quê, e cada aluno sai com uma pergunta para investigar na revista.',
    fontes: ['freire'],
  },
  phc: {
    comoFunciona: 'Cinco passos: prática social inicial (o que se sabe e vive), problematização (perguntas científicas e sociais), instrumentalização (estudo do saber sistematizado), catarse (o aluno expressa a nova síntese) e prática social final (como o olhar sobre a realidade mudou).',
    quandoUsar: 'Para conteúdos com dimensão social e histórica forte, em que se quer ligar teoria e realidade de forma crítica.',
    exemplo: 'História parte do trabalho dos pais dos alunos, problematiza "por que a jornada de 8 horas foi uma conquista?", estuda as greves do século XIX e termina com um parágrafo de síntese sobre o trabalho hoje.',
    fontes: ['gasparin'],
  },
  peer: {
    comoFunciona: 'O professor faz uma pergunta conceitual de múltipla escolha. Cada aluno vota sozinho; se os acertos ficam entre cerca de 30% e 70%, os colegas discutem em duplas tentando convencer um ao outro e votam de novo. Depois o professor fecha a explicação.',
    quandoUsar: 'Para conceitos em que a turma costuma ter ideias erradas, principalmente em Física.',
    exemplo: 'Física pergunta: "Um motor a gasolina pode transformar 100% do calor em trabalho?". Os alunos votam com cartões A/B/C, discutem em duplas e votam de novo antes da explicação sobre a 2ª Lei da Termodinâmica.',
    fontes: ['mazur'],
  },
  tbl: {
    comoFunciona: 'Os alunos estudam um material antes, fazem um teste individual, depois o mesmo teste em equipe, recebem esclarecimentos do professor e aplicam o conteúdo num problema maior.',
    quandoUsar: 'Para garantir estudo prévio e trabalho em equipe com responsabilidade individual.',
    exemplo: 'Geografia indica um texto sobre taylorismo, fordismo e toyotismo. A turma faz o teste sozinha, depois em equipe, e as equipes classificam exemplos atuais (entrega por aplicativo, linha de montagem).',
    fontes: ['metativas'],
  },
  abp: {
    comoFunciona: 'A turma desenvolve um produto real ao longo de várias semanas, a partir de uma pergunta motriz. O professor orienta etapas, prazos e revisões, e o produto é apresentado a um público.',
    quandoUsar: 'Para projetos longos e interdisciplinares com produto final. É a lógica da revista.',
    exemplo: 'Cada turma vira uma editora: escolhe pautas sobre energia e território, apura, escreve, revisa e lança a revista na Mostra de Editoras.',
    fontes: ['moran'],
  },
  pbl: {
    comoFunciona: 'Um problema aberto vem antes da teoria. Em grupos, os alunos levantam o que já sabem, o que precisam descobrir, pesquisam e propõem uma solução justificada.',
    quandoUsar: 'Quando há um problema real e controverso que exige pesquisa e argumentação.',
    exemplo: 'Problema: "O DF deveria instalar painéis solares em todas as escolas públicas?". Os grupos pesquisam custo, insolação e impacto e defendem uma resposta.',
    fontes: ['moran'],
  },
  invertida: {
    comoFunciona: 'O primeiro contato com o conteúdo acontece em casa (vídeo curto, texto). A aula vira espaço de tirar dúvidas e fazer atividades práticas com o professor por perto.',
    quandoUsar: 'Quando a turma tem acesso ao material fora da escola e o tempo de aula precisa ir para a prática.',
    exemplo: 'Os alunos assistem em casa a um vídeo curto sobre o efeito estufa. Em sala, começam com um quiz rápido e passam a montar um infográfico para a revista.',
    fontes: ['moran'],
  },
  estacoes: {
    comoFunciona: 'A sala é dividida em estações com atividades diferentes sobre o mesmo tema (leitura, vídeo, experimento, exercício). Os grupos giram por todas em tempos marcados.',
    quandoUsar: 'Para turmas grandes e conteúdos que podem ser vistos por vários ângulos.',
    exemplo: 'Quatro estações sobre matriz energética: gráfico do Balanço Energético Nacional, mapa de usinas, notícia sobre a seca de 2024 e um cálculo de consumo de aparelhos.',
    fontes: ['moran'],
  },
  caso: {
    comoFunciona: 'A turma analisa uma situação real ou realista com dados, personagens e um dilema. Os grupos identificam o problema, as causas e as opções, e defendem uma decisão.',
    quandoUsar: 'Para ligar o conteúdo a decisões concretas e treinar análise de informações.',
    exemplo: 'Caso de uma cidade que recebeu uma hidrelétrica: os grupos analisam ganhos de energia e impactos sobre ribeirinhos e decidem que recomendações fariam ao prefeito.',
    fontes: ['moran'],
  },
  debate: {
    comoFunciona: 'Dois ou mais lados defendem posições com tempos e regras definidos: abertura, réplica, tréplica e fechamento. Um grupo ou o professor faz a mediação e a avaliação dos argumentos.',
    quandoUsar: 'Para temas controversos e para desenvolver argumentação oral, como pede a BNCC.',
    exemplo: 'Debate "Carro elétrico resolve a crise climática?". Um lado defende, outro questiona com dados de mineração e matriz elétrica, e a plateia vota no argumento mais bem sustentado.',
    fontes: ['bncc'],
  },
  experimento: {
    comoFunciona: 'Os alunos partem de uma pergunta, levantam hipóteses, fazem um experimento simples, registram os dados e concluem comparando com as hipóteses.',
    quandoUsar: 'Para conteúdos de ciências em que dá para observar o fenômeno com material simples.',
    exemplo: 'Física pergunta "qual cor de garrafa esquenta mais ao sol?". Os grupos medem a temperatura de garrafas pretas e brancas a cada 5 minutos e explicam o resultado com absorção de radiação.',
    fontes: ['ldb'],
  },
  oficina: {
    comoFunciona: 'A aula é dedicada a escrever: o professor apresenta o gênero com exemplos reais, os alunos produzem, trocam com colegas e reescrevem a partir do retorno.',
    quandoUsar: 'Para a produção dos textos da revista e para trabalhar gêneros textuais.',
    exemplo: 'Redação lê uma reportagem de divulgação científica, mostra como ela se organiza e os alunos escrevem a primeira versão de uma reportagem sobre energia no bairro.',
    fontes: ['marcuschi'],
  },
  gamificacao: {
    comoFunciona: 'Elementos de jogo (missões, pontos, níveis, desafios em equipe) organizam as atividades para aumentar o engajamento. O jogo serve ao conteúdo, não o contrário.',
    quandoUsar: 'Para revisões e treinos em que a motivação da turma está baixa.',
    exemplo: 'Missão "Usina em crise": as equipes respondem desafios sobre fontes de energia e ganham "megawatts" para manter uma cidade fictícia abastecida.',
    fontes: ['gamificacao'],
  },
  seminario: {
    comoFunciona: 'Grupos pesquisam um subtema e apresentam para a turma, com tempo marcado e perguntas da plateia. O professor define o roteiro e os critérios antes.',
    quandoUsar: 'Para dividir um tema grande entre os grupos e treinar comunicação oral.',
    exemplo: 'Cada grupo apresenta uma fonte de energia (hidrelétrica, solar, eólica, petróleo) em 7 minutos, com um dado do Balanço Energético Nacional e uma pergunta para a turma.',
    fontes: ['metativas'],
  },
};

export const AJUDA_AVALIACAO: Record<string, Ajuda> = {
  objetiva: {
    comoFunciona: 'Prova com questões fechadas (múltipla escolha, verdadeiro ou falso, associação). Cada questão tem uma resposta certa.',
    quandoUsar: 'Para verificar muitos conteúdos de uma vez e com correção rápida.',
    exemplo: '10 questões de múltipla escolha sobre fontes de energia e Revoluções Industriais, no estilo do ENEM.',
    fontes: ['avaliacao'],
  },
  dissertativa: {
    comoFunciona: 'Questões abertas em que o aluno escreve a resposta e explica o raciocínio. Fica mais justa com critérios de correção definidos antes.',
    quandoUsar: 'Quando importa ver como o aluno pensa, não só se ele acerta.',
    exemplo: '"Explique por que a seca de 2024 encareceu a conta de luz no Brasil, usando o conceito de matriz energética."',
    fontes: ['avaliacao'],
  },
  duasfases: {
    comoFunciona: 'A mesma prova em dois momentos: na 1ª fase o aluno responde em sala com tempo limitado; na 2ª fase recebe a prova de volta, com tempo maior para revisar e completar. As duas notas contam.',
    quandoUsar: 'Para unir a cobrança da prova com a chance de aprender com o próprio erro.',
    exemplo: 'Física aplica uma prova sobre rendimento de máquinas térmicas; na semana seguinte, os alunos revisam as respostas em casa, com o caderno, e entregam a 2ª versão.',
    fontes: ['duasfases'],
  },
  seminario: {
    comoFunciona: 'O grupo apresenta uma pesquisa para a turma e responde perguntas. A nota considera conteúdo, organização e participação de cada integrante.',
    quandoUsar: 'Quando a pesquisa e a comunicação oral fazem parte do objetivo.',
    exemplo: 'Grupos apresentam a pauta da revista para a "reunião de redação" e são avaliados pela clareza da proposta e pelas respostas às perguntas.',
    fontes: ['avaliacao'],
  },
  diagnostica: {
    comoFunciona: 'Atividade no começo de um conteúdo para saber o que a turma já sabe. Não vale nota punitiva: serve para ajustar o planejamento.',
    quandoUsar: 'No início do bimestre ou de um tema novo.',
    exemplo: 'Na primeira aula do projeto, os alunos respondem "de onde vem a energia da sua casa?" e desenham o caminho até a tomada.',
    fontes: ['avaliacao'],
  },
  formativa: {
    comoFunciona: 'O professor acompanha exercícios, rascunhos e participação ao longo do processo e dá retorno frequente para o aluno melhorar antes da entrega final.',
    quandoUsar: 'Em todo o bimestre, principalmente em projetos com várias etapas.',
    exemplo: 'A cada semana, o professor lê a pauta ou o rascunho de cada editora e devolve dois comentários do que melhorar.',
    fontes: ['avaliacao'],
  },
  somativa: {
    comoFunciona: 'Avaliação no fim de uma etapa que resume o que foi aprendido no ciclo, geralmente com nota.',
    quandoUsar: 'Para fechar um bimestre ou uma sequência de aulas.',
    exemplo: 'Prova final do 3º bimestre de Geografia com questões sobre industrialização e matriz energética.',
    fontes: ['avaliacao'],
  },
  mediadora: {
    comoFunciona: 'Proposta de Jussara Hoffmann: o professor dialoga com o aluno sobre as respostas e trata o erro como uma hipótese a ser entendida, com novas chances de tarefa.',
    quandoUsar: 'Quando se quer acompanhar de perto a construção do conhecimento de cada aluno.',
    exemplo: 'O professor devolve a resposta com uma pergunta ("e se a usina fosse a carvão?") e o aluno reescreve, mostrando o que entendeu.',
    fontes: ['avaliacao'],
  },
  emancipatoria: {
    comoFunciona: 'Proposta de Ana Maria Saul: alunos e professores analisam juntos o processo educativo, com descrição, crítica e criação coletiva de novos caminhos.',
    quandoUsar: 'Para avaliar o projeto como um todo, de forma democrática.',
    exemplo: 'Depois da Mostra, cada turma faz uma roda: o que funcionou na revista, o que não funcionou e o que mudaria numa próxima edição.',
    fontes: ['avaliacao'],
  },
  portfolio: {
    comoFunciona: 'Coleção organizada das produções do aluno ao longo do tempo (rascunhos, versões, reflexões). Mostra o progresso, não só o resultado final.',
    quandoUsar: 'Em projetos longos com várias versões de um mesmo trabalho.',
    exemplo: 'Cada aluno guarda numa pasta (ou no Drive) a pauta, o 1º rascunho, a revisão do colega e a versão publicada do seu texto.',
    fontes: ['portfolio'],
  },
  rubrica: {
    comoFunciona: 'Uma tabela com os critérios de avaliação e os níveis de desempenho (por exemplo: insuficiente, básico, bom, excelente), mostrada aos alunos antes da atividade.',
    quandoUsar: 'Para produções complexas, como a revista, em que a nota precisa ser transparente.',
    exemplo: 'Rubrica da reportagem: uso de fontes confiáveis, clareza do texto, ligação com o tema e revisão da língua, cada critério com 4 níveis.',
    fontes: ['avaliacao'],
  },
  autoavaliacao: {
    comoFunciona: 'O aluno reflete sobre o próprio processo com um roteiro de perguntas ou critérios. Funciona melhor quando os critérios são claros.',
    quandoUsar: 'No fim de etapas, para desenvolver autonomia e consciência do próprio aprendizado.',
    exemplo: 'Ficha final: "Qual foi minha contribuição para a revista? O que aprendi sobre energia que não sabia? O que faria diferente?".',
    fontes: ['avaliacao'],
  },
  pares: {
    comoFunciona: 'Os alunos avaliam trabalhos dos colegas usando um roteiro ou rubrica e dão sugestões antes da versão final.',
    quandoUsar: 'Para multiplicar o retorno sobre rascunhos sem sobrecarregar o professor.',
    exemplo: 'As editoras trocam rascunhos: cada aluno lê a reportagem de um colega e marca um ponto forte e uma sugestão usando a rubrica.',
    fontes: ['avaliacao'],
  },
  diario: {
    comoFunciona: 'Registro contínuo do que o aluno observou, fez e concluiu, em caderno ou relatório. Mostra o caminho da investigação.',
    quandoUsar: 'Em experimentos, saídas de campo e pesquisas.',
    exemplo: 'Durante a investigação sobre o consumo de energia em casa, o aluno anota por uma semana a leitura do relógio de luz e escreve o que percebeu.',
    fontes: ['avaliacao'],
  },
  digital: {
    comoFunciona: 'Quizzes e desafios em plataformas com respostas em tempo real, às vezes com pontos e rankings. O professor vê na hora o que a turma errou.',
    quandoUsar: 'Para revisões rápidas e diagnósticos, quando há internet e aparelhos.',
    exemplo: 'Quiz de 10 perguntas sobre fontes de energia ao fim da aula, com o gráfico de acertos projetado para a turma comentar.',
    fontes: ['gamificacao'],
  },
  integradora: {
    comoFunciona: 'O aluno é avaliado por uma entrega real e pública, que junta conteúdos de várias áreas: protótipo, feira, mostra, simulação.',
    quandoUsar: 'No fechamento de projetos interdisciplinares.',
    exemplo: 'A revista lançada na Mostra de Editoras, avaliada por rubrica comum às disciplinas, com público de outras turmas e famílias.',
    fontes: ['avaliacao'],
  },
};
