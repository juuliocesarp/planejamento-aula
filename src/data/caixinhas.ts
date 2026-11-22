import type { Caixinha, DiscId } from './tipos';

// Transcrito da "Programação Anual" do guia de referência (seção 2), bloco a bloco.
// semanaGuia = semana inicial no ano (1–40); semanasGuia = duração do bloco.
function c(
  disc: DiscId,
  ini: number,
  fim: number,
  eixo: string,
  titulo: string,
  subtemas: string,
  foco: string,
  bncc: string[] = [],
  revista?: string,
): Caixinha {
  const id = `${disc}-${String(ini).padStart(2, '0')}`;
  return {
    id,
    disc,
    semanaGuia: ini,
    semanasGuia: fim - ini + 1,
    eixo,
    titulo,
    subtemas: subtemas.split(' / ').map((s) => s.trim()),
    foco,
    bncc,
    revista,
    fonte: 'guia',
  };
}

const T = 'Termologia e Calorimetria';
const G = 'Gases e Termodinâmica';
const O = 'Óptica Geométrica';
const W = 'Ondulatória e Acústica';

const fisica: Caixinha[] = [
  c('fis', 1, 2, T, 'Acolhimento, diagnóstico e Termometria', 'Contrato didático / Revisão de energia mecânica / Temperatura e sensação térmica / Equilíbrio térmico e Lei Zero', 'Sondagem diagnóstica; experimento com água em diferentes temperaturas para diferenciar sensação térmica e temperatura.', ['EM13CNT101']),
  c('fis', 3, 4, T, 'Escalas termométricas', 'Calibração de termômetros / Escalas Celsius, Fahrenheit, Kelvin e arbitrárias / Conversão de variações térmicas', 'Problemas contextualizados e leitura de gráficos e tabelas meteorológicas.', ['EM13CNT302']),
  c('fis', 5, 6, T, 'Dilatação térmica de sólidos e líquidos', 'Dilatação linear, superficial e volumétrica / Dilatação real e aparente de líquidos / Comportamento anômalo da água', 'Investigação do termostato do ferro de passar e das juntas de dilatação em pontes e ferrovias.'),
  c('fis', 7, 8, T, 'Calor sensível e latente', 'Calor específico e capacidade térmica / Mudanças de estado físico / Curvas de aquecimento / Diagrama de fases', 'Modelagem gráfica de aquecimento; análise física da válvula da panela de pressão.'),
  c('fis', 9, 10, T, 'Trocas e propagação de calor', 'Sistemas isolados / Condução, convecção e irradiação / Efeito estufa / Arquitetura bioclimática', 'Protótipo térmico sustentável; avaliação integradora do 1º bimestre.', ['EM13CNT102'], 'Base física das ilhas de calor, do albedo e do efeito estufa (Dossiê 4).'),
  c('fis', 11, 12, G, 'Estudo dos gases: variáveis e transformações', 'Variáveis P, V e T / Transformações isotérmica, isobárica e isocórica / Lei Geral dos Gases', 'Simuladores digitais e sensores para investigar transformações gasosas.', ['EM13CNT203', 'EM13CO02']),
  c('fis', 13, 14, G, 'Gases ideais: Clapeyron e teoria cinética', 'Equação do gás ideal (Clapeyron) / Gases ideais vs. reais / Energia interna na visão microscópica', 'Peer Instruction sobre pressão, volume e temperatura em cilindros gasosos.'),
  c('fis', 15, 16, G, 'Trabalho e 1ª Lei da Termodinâmica', 'Trabalho de um gás (gráfico P × V) / Conservação da energia (ΔU = Q − τ) / Transformações particulares e cíclicas', 'Simulações e análise de transformações adiabáticas no cotidiano.', [], 'Explica a conversão de calor em trabalho nas máquinas da Revolução Industrial.'),
  c('fis', 17, 18, G, '2ª Lei e máquinas térmicas', 'Processos reversíveis e irreversíveis / Motores térmicos / Máquinas frigoríficas / Ciclo de Carnot e rendimento', 'Ponte com História (Revolução Industrial) e Geografia (energia); cálculo de rendimento.', [], 'Coração dos Dossiês 1 e 2: máquina a vapor, motor a combustão, termelétricas.'),
  c('fis', 19, 20, G, 'Entropia e sustentabilidade', 'Entropia e irreversibilidade / Degradação energética / Propriedades térmicas de materiais sustentáveis', 'Mapas conceituais de Termodinâmica; avaliação somativa e recuperação do 1º semestre.', ['EM13CNT307'], 'Perdas de energia, eficiência e transição energética (Dossiê 5).'),
  c('fis', 21, 22, O, 'Princípios da óptica e sombras', 'Natureza da luz e meios ópticos / Propagação retilínea / Eclipses / Câmara escura / Cores dos objetos', 'Câmara escura de orifício; problematização sobre eclipses.'),
  c('fis', 23, 24, O, 'Reflexão e espelhos planos', 'Leis da reflexão / Formação e simetria de imagens / Campo visual / Associação de espelhos', 'Atividade experimental com espelhos planos e periscópio.'),
  c('fis', 25, 26, O, 'Espelhos esféricos', 'Foco, centro de curvatura e vértice / Raios notáveis / Estudo analítico (Gauss)', 'Aplicações: faróis, retrovisores, concentradores solares.'),
  c('fis', 27, 28, O, 'Refração, prismas e fibra óptica', 'Lei de Snell-Descartes / Ângulo limite e reflexão total / Fibras ópticas / Dispersão da luz', 'Feixe luminoso em água ou acrílico; conexão com telecomunicações.'),
  c('fis', 29, 30, O, 'Lentes, visão e instrumentos', 'Lentes convergentes e divergentes / Óptica do olho humano / Miopia, hipermetropia e astigmatismo / Instrumentos ópticos', 'Estudo de caso com receitas de óculos; avaliação do 3º bimestre.'),
  c('fis', 31, 32, W, 'Movimento Harmônico Simples', 'Pêndulo simples e sistema massa-mola / Período, frequência e amplitude / Energia no MHS', 'Pêndulo com cronômetro digital e análise gráfica.', ['EM13CNT301']),
  c('fis', 33, 34, W, 'Ondas: natureza, elementos e equação', 'Ondas mecânicas e eletromagnéticas / Classificação / Comprimento de onda, frequência e período / Equação da onda (v = λ·f)', 'Simulações de propagação e testes conceituais entre pares.'),
  c('fis', 35, 36, W, 'Fenômenos ondulatórios', 'Reflexão, refração e difração / Interferência e polarização / Ressonância e ondas estacionárias', 'Polarizadores, cancelamento de ruído, ressonância estrutural e micro-ondas.'),
  c('fis', 37, 38, W, 'Som, nível sonoro e efeito Doppler', 'Altura, timbre e intensidade / Nível sonoro em decibéis / Tubos sonoros / Efeito Doppler', 'Medição de nível sonoro na escola; música, radares e ultrassonografia.'),
  c('fis', 39, 40, W, 'Espectro eletromagnético e radiações', 'Radiações ionizantes e não ionizantes / Aplicações em saúde, indústria e energia / Revisão integrada', 'Seminário ou feira científica sobre riscos e aplicações; avaliação final.', ['EM13CNT103']),
];

const geografia: Caixinha[] = [
  c('geo', 1, 2, 'Demografia e Mobilidade', 'Conceitos e indicadores demográficos', 'Categorias espaciais / População absoluta e densidade / Taxas demográficas / Crescimento vegetativo', 'Diagnóstico inicial; leitura cartográfica e estatística de dados censitários.', ['EM13CHS201']),
  c('geo', 3, 4, 'Demografia e Mobilidade', 'Teorias e transição demográfica', 'Teorias malthusiana, neomalthusiana e reformista / Fases da transição / Pirâmides etárias e envelhecimento', 'Debate estruturado comparando teorias demográficas.'),
  c('geo', 5, 6, 'Demografia e Mobilidade', 'População brasileira: diversidade e indicadores', 'Composição étnico-racial / Distribuição territorial / IDH e Índice de Gini / Desigualdade socioeconômica', 'Análise comparativa de indicadores regionais, raciais e de gênero.'),
  c('geo', 7, 8, 'Demografia e Mobilidade', 'Migrações internas', 'Êxodo rural / Fronteiras econômicas / Migração de retorno / Migração pendular', 'Mapeamento colaborativo de fluxos pendulares e trajetórias locais.', [], 'Migração candanga e ocupação do DF (Dossiê 4).'),
  c('geo', 9, 10, 'Demografia e Mobilidade', 'Migrações internacionais e direitos humanos', 'Fluxos globais contemporâneos / Refugiados políticos e climáticos / Muros e xenofobia', 'Estudo de caso sobre migrações contemporâneas; avaliação do 1º bimestre.', ['EM13CHS201']),
  c('geo', 11, 12, 'Geografia Agrária', 'Sistemas agrários mundiais', 'Agricultura tradicional vs. moderna / Revolução Verde e mecanização / Biotecnologia / Natureza e agricultura', 'Mecanização rural e liberação de mão de obra para as cidades.'),
  c('geo', 13, 14, 'Geografia Agrária', 'Estrutura fundiária brasileira', 'Concentração fundiária / Agricultura familiar e latifúndio / Reforma agrária e luta pela terra / Terras indígenas e quilombolas', 'Interpretação de mapas fundiários (Lei nº 11.645/2008).'),
  c('geo', 15, 16, 'Geografia Agrária', 'Complexo agroindustrial e extrativismo', 'Cadeias produtivas agroindustriais / Extrativismo / Impactos socioambientais nos biomas', 'Investigação de impactos de cadeias produtivas regionais.', ['EM13CHS302'], 'Desmatamento do Cerrado e pressão sobre as águas (Dossiê 4).'),
  c('geo', 17, 18, 'Geografia Agrária', 'Segurança alimentar e relação campo-cidade', 'Produção de alimentos e insegurança alimentar / Agroecologia / Relações campo-cidade', 'Pesquisa-ação sobre abastecimento e agricultura familiar local.'),
  c('geo', 19, 20, 'Geografia Agrária', 'Síntese agrária e socioambiental', 'Uso do solo / Recursos hídricos / Sustentabilidade rural', 'Seminário temático; avaliação e recuperação do 1º semestre.'),
  c('geo', 21, 22, 'Indústria, Energia e Trabalho', 'Revoluções industriais e modelos produtivos', '1ª, 2ª e 3ª Revoluções Industriais / Taylorismo, fordismo e toyotismo / Tipos de indústria', 'Ponte com História (Revolução Industrial) e Física (máquinas térmicas).', [], 'Paisagens industriais do vapor ao petróleo (Dossiês 1 e 2).'),
  c('geo', 23, 24, 'Indústria, Energia e Trabalho', 'Industrialização brasileira e dinâmica global', 'Substituição de importações / Reorganização do espaço industrial brasileiro / Polos globais', 'Leitura cartográfica da desconcentração industrial e das cadeias globais.', [], 'Rodoviarismo e industrialização tardia do Brasil (Dossiê 2).'),
  c('geo', 25, 26, 'Indústria, Energia e Trabalho', 'Fontes de energia e transição energética', 'Combustíveis fósseis / Energia nuclear e renováveis / Matriz energética brasileira vs. mundial', 'Análise comparativa de matrizes energéticas articulada à Física.', ['EM13CHS302'], 'Matriz elétrica, termelétricas e bandeira tarifária (Dossiês 3 e 5).'),
  c('geo', 27, 28, 'Indústria, Energia e Trabalho', 'Mundo do trabalho: capitalismo e tecnologias', 'Transformações tecnológicas e automação / Precarização e plataformização / Desigualdades no trabalho', 'Círculo de cultura problematizador sobre juventude e futuro do trabalho.', [], 'Trabalho na era industrial e hoje (Dossiês 1 e 6).'),
  c('geo', 29, 30, 'Urbanização e Geopolítica', 'Regionalização do Brasil', 'Espaço urbano-industrial / Propostas de regionalização (IBGE, Geiger, Milton Santos)', 'Oficina de cartografia comparativa; avaliação do 3º bimestre.'),
  c('geo', 31, 32, 'Urbanização e Geopolítica', 'Urbanização e redes urbanas', 'Industrialização e urbanização / Metropolização e conurbação / Cidades globais e hierarquia urbana', 'Análise da rede urbana e da posição do município do aluno.'),
  c('geo', 33, 34, 'Urbanização e Geopolítica', 'Segregação e problemas urbanos', 'Desigualdade socioespacial / Moradia e mobilidade / Saneamento / Direitos humanos na cidade', 'Mapeamento colaborativo dos problemas do entorno escolar.', ['EM13CHS206'], 'Segregação socioespacial e acesso à arborização no DF (Dossiê 4).'),
  c('geo', 35, 36, 'Urbanização e Geopolítica', 'Planejamento urbano e meio ambiente', 'Ilhas de calor / Enchentes / Resíduos sólidos / Planejamento urbano participativo', 'Simulação de audiência pública com propostas de intervenção urbana.', [], 'Ilhas de calor urbanas (Dossiê 4).'),
  c('geo', 37, 38, 'Urbanização e Geopolítica', 'Globalização: economia, tecnologia e consumo', 'Redes globais / Tecnologia / Consumo responsável / Contradições da globalização', 'Debate orientado sobre benefícios e desafios da globalização.'),
  c('geo', 39, 40, 'Urbanização e Geopolítica', 'Geopolítica ambiental e encerramento', 'Organismos internacionais / Acordos climáticos / Sustentabilidade / Síntese anual', 'Mostra interdisciplinar socioambiental; avaliação final.', [], 'Acordos climáticos e crise climática (Dossiê 5).'),
];

const historia: Caixinha[] = [
  c('his', 1, 2, 'Iluminismo e Revoluções Atlânticas', 'Conceitos políticos e Iluminismo', 'Estado, Nação, Pátria e País / Crítica ao Absolutismo / Filósofos iluministas / Liberalismo econômico / Despotismo esclarecido', 'Diagnóstico; leitura de excertos de Locke, Montesquieu e Rousseau.'),
  c('his', 3, 4, 'Iluminismo e Revoluções Atlânticas', 'Revolução Industrial', 'Pioneirismo inglês / Fases produtivas / Trabalho feminino e infantil / Urbanização fabril / Ludismo e cartismo', 'Ponte com Física (máquinas térmicas) e Geografia (indústria); fontes operárias.', [], 'Núcleo histórico do Dossiê 1 (o vapor e a fábrica).'),
  c('his', 5, 6, 'Iluminismo e Revoluções Atlânticas', 'Independência dos Estados Unidos', 'Treze Colônias / Crise imperial britânica / Declaração de 1776 / Constituição de 1787 / Contradições escravistas e de gênero', 'Análise documental: a exclusão de negros, indígenas e mulheres.'),
  c('his', 7, 8, 'Iluminismo e Revoluções Atlânticas', 'Revolução Francesa', 'Crise do Antigo Regime / Etapas revolucionárias / Declaração dos Direitos do Homem / Declaração dos Direitos da Mulher (Olympe de Gouges)', 'Debate historiográfico sobre cidadania e perspectivas femininas (Lei nº 14.986/2024).'),
  c('his', 9, 10, 'Iluminismo e Revoluções Atlânticas', 'Era Napoleônica e Congresso de Viena', 'Consulado e Império / Código Civil / Bloqueio Continental / Restauração europeia', 'Análise cartográfica das fronteiras napoleônicas; avaliação do 1º bimestre.'),
  c('his', 11, 12, 'Crise Colonial e Independências', 'Crise colonial no Brasil', 'Inconfidência Mineira (1789) / Conjuração Baiana (1798) / Revolução Pernambucana (1817)', 'Quadro comparativo de projetos políticos e participação popular.'),
  c('his', 13, 14, 'Crise Colonial e Independências', 'Independências nas Américas e Revolução Haitiana', 'Revolução Haitiana (1791–1804) / Independências da América Espanhola / Bolívar, San Martín e México', 'Protagonismo negro haitiano (Lei nº 11.645/2008).'),
  c('his', 15, 16, 'Crise Colonial e Independências', 'Período joanino e Independência do Brasil', 'Corte no Rio e Abertura dos Portos / Revolução do Porto (1820) / 7 de Setembro / Guerras de Independência', 'Desconstrução do mito da independência pacífica; Maria Quitéria, Joana Angélica e Maria Felipa.'),
  c('his', 17, 18, 'Brasil Império (1822–1889)', 'Primeiro Reinado', 'Constituinte de 1823 / Constituição de 1824 e Poder Moderador / Confederação do Equador / Cisplatina e Abdicação', 'Leitura crítica de dispositivos constitucionais (voto censitário).'),
  c('his', 19, 20, 'Brasil Império (1822–1889)', 'Período Regencial', 'Ato Adicional / Regresso conservador / Rebeliões regenciais (Cabanagem, Sabinada, Balaiada, Malês, Farroupilha) / Maioridade', 'Seminário em equipes sobre as rebeliões; avaliação do 1º semestre.'),
  c('his', 21, 22, 'Brasil Império (1822–1889)', 'Segundo Reinado: política e café', 'Parlamentarismo às avessas / Revolução Praieira / Economia cafeeira / Era Mauá / Imigração', 'Conexão com Geografia (ocupação econômica) e Literatura (Machado de Assis).', [], 'Era Mauá: ferrovias e primeira modernização técnica no Brasil.'),
  c('his', 23, 24, 'Brasil Império (1822–1889)', 'Segundo Reinado: política externa e Guerra do Paraguai', 'Intervenções platinas / Questão Christie / Guerra do Paraguai: causas, mobilização e impactos', 'Análise de iconografia, imprensa e charges oitocentistas.'),
  c('his', 25, 27, 'Brasil Império (1822–1889)', 'Escravidão e Abolicionismo', 'Leis de 1850 (Eusébio de Queirós e Terras) / Ventre Livre e Sexagenários / Protagonismo negro e feminino / Lei Áurea e pós-abolição', 'Biografias de Luiz Gama, André Rebouças, José do Patrocínio e Maria Firmina dos Reis.'),
  c('his', 28, 30, 'Brasil Império (1822–1889)', 'Crise do Império e Proclamação da República', 'Questões abolicionista, religiosa e militar / Movimento republicano / 15 de novembro', 'Debate sobre rupturas e permanências; avaliação do 3º bimestre.'),
  c('his', 31, 32, 'O Século XIX Global', 'Revoluções e ideologias do século XIX', 'Ondas de 1830 e 1848 / Liberalismo, nacionalismo, socialismo e anarquismo / Comuna de Paris', 'Análise comparativa de manifestos e correntes ideológicas.', [], 'Movimento operário e crítica ao trabalho fabril (Dossiê 1).'),
  c('his', 33, 34, 'O Século XIX Global', 'Unificações tardias e EUA no século XIX', 'Unificações italiana e alemã / Marcha para o Oeste / Guerra de Secessão / Segregação pós-guerra', 'Estudo cartográfico da reconfiguração geopolítica.'),
  c('his', 35, 36, 'O Século XIX Global', 'Imperialismo e partilha da África', 'Capitalismo monopolista / Darwinismo social / Conferência de Berlim / Resistências africanas', 'Abordagem decolonial e História da África (Leis nº 10.639/2003 e nº 11.645/2008).', [], '2ª Revolução Industrial, petróleo e busca de matérias-primas (Dossiê 2).'),
  c('his', 37, 38, 'O Século XIX Global', 'Imperialismo na Ásia e rumo ao século XX', 'Índia (Cipaios) / China (Guerras do Ópio e Boxers) / Era Meiji / Corrida imperialista pré-1914', 'Rivalidades imperialistas e origens da Primeira Guerra.'),
  c('his', 39, 40, 'O Século XIX Global', 'História pública, memória e encerramento', 'Memória e patrimônio / Narrativas históricas na cultura digital / Revisão anual', 'Mostra interdisciplinar (podcasts e exposições); avaliação final.'),
];

const gramatica: Caixinha[] = [
  c('gl', 1, 3, 'Gramática · Sociolinguística', 'Variação e preconceito linguístico', 'Dimensões da variação / Níveis da variação / Adequação situacional / Norma-padrão e preconceito linguístico', 'Análise de corpus autêntico (redes, literatura, imprensa).', ['EM13LP10', 'EM13LGG402']),
  c('gl', 4, 6, 'Gramática · Morfologia', 'Classes variáveis e efeitos de sentido', 'Substantivo e adjetivo / Pronomes e referenciação / Sentido em textos publicitários e midiáticos', 'Leitura crítica de campanhas digitais e peças publicitárias.', ['EM13LGG101']),
  c('gl', 7, 10, 'Gramática · Morfologia', 'Verbos e classes invariáveis', 'Tempos, modos e vozes verbais / Advérbios, preposições e conjunções / Conjunções como operadores argumentativos', 'Voz passiva em notícias e subjuntivo em teses; avaliação bimestral.'),
  c('gl', 11, 13, 'Gramática · Período simples', 'Termos essenciais da oração', 'Frase, oração e período / Tipos de sujeito / Predicação verbal e tipos de predicado', 'Análise sintática em manchetes e crônicas (ênfase e ambiguidade).'),
  c('gl', 14, 16, 'Gramática · Período simples', 'Termos integrantes', 'Objeto direto e indireto / Complemento nominal / Agente da passiva', 'Reescrita entre voz ativa e passiva aplicada à clareza.'),
  c('gl', 17, 20, 'Gramática · Período simples', 'Termos acessórios e pontuação', 'Adjunto adnominal vs. complemento nominal / Adjunto adverbial / Aposto e vocativo / Vírgula no período simples', 'Oficina de revisão sintática dos textos da turma; avaliação semestral.'),
  c('gl', 21, 23, 'Gramática · Período composto', 'Coordenação e operadores argumentativos', 'Orações coordenadas assindéticas e sindéticas / Valores semânticos das conjunções coordenativas', 'Articulação direta com os operadores argumentativos da Redação.', [], 'Costura das explicações causais nas reportagens da revista.'),
  c('gl', 24, 26, 'Gramática · Período composto', 'Subordinação substantiva e adjetiva', 'Orações substantivas / Pronomes relativos / Adjetivas restritivas vs. explicativas', 'Ambiguidade sintática provocada pela pontuação em textos públicos.'),
  c('gl', 27, 30, 'Gramática · Período composto', 'Subordinação adverbial e reduzidas', 'As 9 relações adverbiais (causa, consequência, concessão, condição) / Orações reduzidas / Períodos mistos', 'Reescrita de parágrafos argumentativos; avaliação do 3º bimestre.', [], 'Causa e consequência: seca → reservatório → termelétrica → tarifa.'),
  c('gl', 31, 33, 'Gramática · Normatividade', 'Concordância verbal e nominal', 'Casos gerais / Verbos impessoais (haver, fazer) / Partícula se / Concordância nominal especial', 'Diagnóstico de desvios nas redações e oficina de revisão.'),
  c('gl', 34, 36, 'Gramática · Normatividade', 'Regência e crase', 'Regência verbal e nominal / Casos obrigatórios, facultativos e proibidos da crase', 'Prática em gêneros formais e dissertativos.'),
  c('gl', 37, 40, 'Gramática · Normatividade', 'Colocação pronominal, pontuação e síntese', 'Próclise, mesóclise e ênclise / Pontuação estilística / Revisão geral', 'Consolidação da análise linguística aplicada à escrita; avaliação final.'),
];

const literatura: Caixinha[] = [
  c('gl', 101, 102, 'Literatura · Romantismo', 'Introdução e raízes do Romantismo', 'Gêneros literários / Contexto histórico europeu e português (Garrett, Camilo Castelo Branco)', 'Ponte com História (Revoluções Burguesas); leitura expressiva.', ['EM13LGG201']),
  c('gl', 103, 105, 'Literatura · Romantismo', 'Poesia romântica no Brasil', 'Indianismo (Gonçalves Dias) / Ultrarromantismo (Álvares de Azevedo) / Poesia condoreira (Castro Alves)', 'Idealização romântica vs. denúncia da escravidão.'),
  c('gl', 106, 110, 'Literatura · Romantismo', 'Prosa romântica e autoria feminina e negra', 'José de Alencar / Manuel Antônio de Almeida / Maria Firmina dos Reis (Úrsula)', 'Clube de leitura com matriz afro-brasileira e perspectivas femininas; avaliação bimestral.'),
  c('gl', 111, 113, 'Literatura · Realismo e Naturalismo', 'Fundamentos do Realismo e Realismo português', 'Ruptura com o Romantismo / Cientificismo do século XIX / Eça de Queirós', 'Ironia e intencionalidade discursiva.'),
  c('gl', 114, 117, 'Literatura · Realismo e Naturalismo', 'Machado de Assis', 'Narrador não confiável / Metalinguagem / Crítica às elites escravistas / Contos e crônicas', 'Leitura orientada de contos e debate sobre gênero, classe e escravidão.', [], 'Crônica urbana e crítica ao "progresso" (Dossiê 6).'),
  c('gl', 118, 120, 'Literatura · Realismo e Naturalismo', 'Naturalismo: determinismo e sociedade', 'Romance de tese / Zoomorfização / O Cortiço (Aluísio Azevedo) / O Ateneu (Raul Pompeia)', 'Problematização do determinismo racial do século XIX; avaliação semestral.', [], 'Espaço urbano precário e trabalho em O Cortiço (Dossiê 6).'),
  c('gl', 121, 124, 'Literatura · Fim de século', 'Parnasianismo', 'Descritivismo / Rigor métrico e rima / Olavo Bilac, Raimundo Correia, Alberto de Oliveira, Francisca Júlia', 'Oficina de estrutura poética e contraste com a poesia contemporânea.'),
  c('gl', 125, 128, 'Literatura · Fim de século', 'Simbolismo', 'Sinestesia, aliteração e assonância / Crise do cientificismo / Cruz e Sousa e Alphonsus de Guimaraens', 'Fruição sonora e enfrentamento ao racismo em Cruz e Sousa.', ['EM13LGG602']),
  c('gl', 129, 130, 'Literatura · Fim de século', 'Síntese estética do século XIX', 'Romantismo, Realismo, Naturalismo, Parnasianismo e Simbolismo comparados', 'Mapa comparativo dos movimentos; avaliação do 3º bimestre.'),
  c('gl', 131, 134, 'Literatura · Pré-Modernismo', 'O Brasil profundo', 'Euclides da Cunha (Os Sertões) / Lima Barreto (Triste Fim de Policarpo Quaresma, Clara dos Anjos)', 'Conexão com História e Geografia: regionalismo, urbanização e exclusão pós-abolição.'),
  c('gl', 135, 136, 'Literatura · Pré-Modernismo', 'Outras vertentes do Pré-Modernismo', 'Monteiro Lobato e debates críticos atuais / Augusto dos Anjos (Eu)', 'Leitura analítica de poemas e debate ético sobre recepção de obras.'),
  c('gl', 137, 140, 'Literatura · Diálogos contemporâneos', 'Diálogos contemporâneos e sarau digital', 'Escritoras negras e autores indígenas / Saraus e slams / Divulgação digital', 'Sarau escolar e projetos colaborativos digitais; avaliação final.', ['EM13LP20', 'EM13LP24']),
];
// Literatura usa 101–140 só para gerar ids distintos; a semana real é (n − 100).
for (const l of literatura) {
  l.semanaGuia -= 100;
  l.id = `gl-lit-${String(l.semanaGuia).padStart(2, '0')}`;
}
for (const g of gramatica) g.id = `gl-gra-${String(g.semanaGuia).padStart(2, '0')}`;

const redacao: Caixinha[] = [
  c('red', 1, 3, 'Tipologias e Gêneros', 'Panorama e diagnóstico', 'Tipologia e gênero / Narrativo, descritivo, expositivo, injuntivo e argumentativo / Suporte e interlocutor', 'Redação diagnóstica; leitura analítica de textos opinativos.'),
  c('red', 4, 6, 'Textualidade', 'Coesão referencial e lexical', 'Sinônimos e hiperônimos / Substituições lexicais / Pronomes para evitar repetição', 'Laboratório de reescrita e precisão vocabular.'),
  c('red', 7, 10, 'Textualidade', 'Coerência e artigo de opinião', 'Informatividade e progressão / Não contradição / Operadores argumentativos / Artigo de opinião', 'Produção, revisão por pares e versão final de artigo de opinião.', ['EM13LGG301'], 'Artigo de opinião é um dos gêneros de cada dossiê.'),
  c('red', 11, 13, 'Dissertação-argumentativa', 'Recorte temático e projeto de texto', 'Textos motivadores / Assunto, tema e tese / Planejamento estrutural', 'Exercícios de recorte para evitar fuga ao tema.'),
  c('red', 14, 16, 'Dissertação-argumentativa', 'Introdução', 'Alusão histórica, literária, dado ou conceito / Problematização / Tese explícita', 'Introduções com repertório de História, Geografia e Literatura.'),
  c('red', 17, 20, 'Dissertação-argumentativa', 'Desenvolvimento (parte I)', 'Tópico frasal / Causa e consequência / Exemplificação / Dados estatísticos', '1ª dissertação completa com devolutiva por rubrica.'),
  c('red', 21, 24, 'Dissertação-argumentativa', 'Repertório e contra-argumentação', 'Repertório legitimado, pertinente e produtivo / Argumento de autoridade / Concessão e refutação', 'Banco coletivo interdisciplinar de repertórios; 2ª dissertação.', [], 'Argumentação dos artigos de opinião e do editorial da revista.'),
  c('red', 25, 27, 'Dissertação-argumentativa', 'Conclusão e proposta de intervenção', 'Síntese crítica / Proposta de intervenção (agente, ação, meio, finalidade, detalhamento) / Direitos humanos', 'Exequibilidade de propostas ligadas a políticas públicas reais.'),
  c('red', 28, 30, 'Curadoria e Reescrita', 'Curadoria e vida pública: carta aberta e manifesto', 'Curadoria de fontes confiáveis / Combate à desinformação / Intervenção social pela escrita digital', 'Produção colaborativa de campanha ou carta aberta.', ['EM13LP32', 'EM13LGG305', 'EM13CO20'], 'Checagem de fontes (IBGE, INMET, ONS, ANEEL) dos textos da revista.'),
  c('red', 31, 34, 'Curadoria e Reescrita', 'Resumo e resenha crítica', 'Estratégias de estudo / Paráfrase ética e prevenção ao plágio / Avaliação crítica fundamentada', 'Resenha crítica de obra literária ou documentário do ano.', ['EM13LP28']),
  c('red', 35, 37, 'Dissertação-argumentativa', 'Matriz de competências e simulado', 'Norma / Tema e repertório / Projeto de texto / Coesão / Intervenção', 'Simulado cronometrado e autocorreção por rubrica.'),
  c('red', 38, 40, 'Curadoria e Reescrita', 'Reescrita, portfólio e publicação digital', 'Seleção evolutiva de textos / Reflexão metacognitiva / Publicação ética', 'Portfólio anual de Redação e avaliação final.', ['EM13CO22']),
];

// Caixinhas criadas para o projeto (não estão na programação do guia).
function p(disc: DiscId, id: string, titulo: string, subtemas: string, foco: string, extra?: Partial<Caixinha>): Caixinha {
  return {
    id: `${disc}-proj-${id}`,
    disc,
    semanaGuia: 0,
    semanasGuia: 1,
    eixo: 'Projeto Revista',
    titulo,
    subtemas: subtemas.split(' / '),
    foco,
    bncc: [],
    revista: 'Etapa do projeto da revista.',
    projeto: true,
    fonte: 'projeto',
    ...extra,
  };
}

const ETAPAS = (disc: DiscId, revisao: string) => [
  p(disc, 'problem', 'Problematização: a conta de luz e o calor no DF', 'Leitura de mundo / Conta de luz real / Notícias sobre seca e calor / Formação das editoras', 'Fase 1 do projeto (leitura de mundo, Paulo Freire).'),
  p(disc, 'revisao', revisao, 'Leitura dos rascunhos / Devolutiva por núcleo / Reescrita orientada', 'Fase 3 do projeto (escrita e retextualização).', { semanasGuia: 3 }),
  p(disc, 'fecha', 'Fechamento editorial', 'Versão final / Diagramação / Checagem final de fontes', 'Fase 4 do projeto (curadoria e diagramação).'),
  p(disc, 'mostra', 'Mostra de Editoras e autoavaliação', 'Estandes das 4 editoras / Defesa oral / Autoavaliação', 'Fase 5 do projeto (culminância).'),
];

const projeto: Caixinha[] = [
  ...ETAPAS('fis', 'Revisão científica dos textos da revista'),
  ...ETAPAS('geo', 'Revisão de dados e mapas dos textos da revista'),
  ...ETAPAS('his', 'Revisão histórica dos textos da revista'),
  ...ETAPAS('red', 'Escrita, revisão por pares e reescrita'),
  ...ETAPAS('gl', 'Revisão linguística e crônica literária'),
  p('red', 'generos', 'Gêneros jornalísticos e de divulgação científica', 'Reportagem de divulgação científica / Editorial / Artigo de opinião / Entrevista / Infográfico', 'Análise de revistas reais (Pesquisa FAPESP, Ciência Hoje) e estrutura dos gêneros.', { semanasGuia: 2 }),
  p('his', 'brasil', 'Industrialização e urbanização no Brasil e no DF', 'Ferrovias e café / Era Vargas e Plano de Metas / Rodoviarismo / Construção de Brasília e candangos', 'Aprofundamento do projeto. Atenção: nos currículos de referência, este conteúdo não está no 2º ano (costuma ser do 3º ano).'),
];

export const CAIXINHAS: Caixinha[] = [...fisica, ...geografia, ...historia, ...gramatica, ...literatura, ...redacao, ...projeto];

export const caixinha = (id: string) => CAIXINHAS.find((c) => c.id === id);
