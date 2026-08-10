/* ==========================================================================
   CONFIG — Instituto Januário (IJ-CEP)

   ESTE É O ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR.
   Trocar nomes, cores, cursos, vendedores e telefones é tudo aqui.
   Não mexa em app.js — ele só lê o que está escrito abaixo.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1) DADOS DO INSTITUTO
   -------------------------------------------------------------------------- */
const INSTITUTO = {
  nome: "Instituto Januário",
  sigla: "IJ-CEP",
  subtitulo: "Centro de Ensino Profissional",
  parceira: "Kollarez Soluções e Comércio",

  // Número usado quando o curso não tiver um número próprio (seção 3).
  // Formato: 55 + DDD + número, só dígitos.
  whatsappGeral: "5592986139273",

  cidade: "Presidente Figueiredo",
  estado: "AM",
  endereco: "Av. Galo da Serra, nº 80 — Galo da Serra I",
  referencia: "Rua da Escola Deisy",
  instagram: "kollarez.solucoes.ofc",

  // Frase grande da abertura do site
  chamada: "Comece um curso e mude o seu futuro",
  apoio: "Cursos presenciais em Presidente Figueiredo. Faça sua pré-matrícula pelo celular, em poucos minutos."
};


/* --------------------------------------------------------------------------
   2) CORES
   Troque o TEMA para "januario", "floresta" ou "cachoeira".
   -------------------------------------------------------------------------- */
const TEMA = "januario";

const PALETAS = {
  januario: {
    "--fundo":     "#f4f6fb",
    "--caixa":     "#ffffff",
    "--texto":     "#16213e",
    "--texto2":    "#5a6785",
    "--borda":     "#dbe2f0",
    "--marca":     "#123a75",
    "--marca2":    "#c9992e",
    "--marcaSuave":"#e8effa",
    "--ok":        "#1a7f4b",
    "--erro":      "#c0392b"
  },
  floresta: {
    "--fundo":     "#f2f7f3",
    "--caixa":     "#ffffff",
    "--texto":     "#12291c",
    "--texto2":    "#4d6655",
    "--borda":     "#d3e3d8",
    "--marca":     "#1d6b3f",
    "--marca2":    "#d0a227",
    "--marcaSuave":"#e3f1e8",
    "--ok":        "#1a7f4b",
    "--erro":      "#c0392b"
  },
  cachoeira: {
    "--fundo":     "#f1f7fa",
    "--caixa":     "#ffffff",
    "--texto":     "#0f2b38",
    "--texto2":    "#4c6b78",
    "--borda":     "#d2e4ec",
    "--marca":     "#0e6079",
    "--marca2":    "#e0a83c",
    "--marcaSuave":"#e0f0f6",
    "--ok":        "#1a7f4b",
    "--erro":      "#c0392b"
  }
};


/* --------------------------------------------------------------------------
   3) CURSOS

   id        → aparece no link do site (?curso=libras)
   whatsapp  → NÚMERO QUE RECEBE AS FICHAS DESTE CURSO.
               Toda pré-matrícula vai para cá, com o nome de quem indicou
               escrito na mensagem. Deixe "" para usar o número geral.
               Formato: 55 + DDD + número, só dígitos.
   turnos    → opções que a pessoa escolhe. Se vazio, não pergunta turno.
   extra     → "faixaEtaria" mostra as turmas por idade (usado só no Inglês)
   ativo     → false esconde o curso do site sem apagar nada

   ATENÇÃO: só os turnos de LIBRAS vieram da ficha real do Instituto.
   Os demais estão como Manhã/Tarde/Noite por suposição — confirmar.
   Os números por curso também precisam ser confirmados.
   -------------------------------------------------------------------------- */
const CURSOS = [
  {
    id: "informatica",
    nome: "Informática e Empregabilidade",
    chamada: "Do zero ao mercado de trabalho",
    descricao: "Aprenda a usar o computador desde o começo: ligar, digitar, internet, e-mail, Word e Excel. No final, você sai preparado para vagas que pedem informática.",
    icone: "💻",
    whatsapp: "",
    turnos: ["Manhã", "Tarde", "Noite"],
    extra: null,
    ativo: true
  },
  {
    id: "libras",
    nome: "Leitura e Interpretação de Libras",
    chamada: "Do zero ao intermediário",
    descricao: "Aprenda a Língua Brasileira de Sinais e consiga se comunicar com pessoas surdas. Começa do zero, não precisa saber nada antes.",
    icone: "🤟",
    whatsapp: "",
    turnos: ["Sábados", "Domingos"],
    extra: null,
    ativo: true
  },
  {
    id: "ingles",
    nome: "Inglês e Empregabilidade",
    chamada: "Turmas separadas por idade",
    descricao: "Inglês do começo, com turmas para crianças, adolescentes e adultos. Focado em conversação e no que o mercado de trabalho pede.",
    icone: "🌎",
    whatsapp: "",
    turnos: ["Manhã", "Tarde", "Noite"],
    extra: "faixaEtaria",
    ativo: true
  },
  {
    id: "administrativo",
    nome: "Assistente Administrativo e Financeiro",
    chamada: "Prática direto no computador",
    descricao: "Aprenda a cuidar de contas, notas, planilhas e atendimento. Aulas práticas no computador, do jeito que se faz numa empresa de verdade.",
    icone: "📊",
    whatsapp: "",
    turnos: ["Manhã", "Tarde", "Noite"],
    extra: null,
    ativo: true
  },
  {
    id: "monitor",
    nome: "Monitor Escolar",
    chamada: "100% presencial",
    descricao: "Formação para quem quer trabalhar em escola acompanhando alunos, apoiando professores e cuidando da rotina escolar.",
    icone: "🏫",
    whatsapp: "",
    turnos: ["Manhã", "Tarde", "Noite"],
    extra: null,
    ativo: true
  },

  /* --- Cursos que já rolaram. Vire ativo:true para voltarem ao site. --- */
  {
    id: "tecnico-adm",
    nome: "Técnico em Administração",
    chamada: "Curso técnico com diploma",
    descricao: "",
    icone: "📋",
    whatsapp: "",
    turnos: [],
    extra: null,
    ativo: false
  },
  {
    id: "nr6",
    nome: "NR-6 — Segurança do Trabalho",
    chamada: "Parceria Polo Fametro",
    descricao: "",
    icone: "🦺",
    whatsapp: "",
    turnos: [],
    extra: null,
    ativo: false
  },
  {
    id: "supletivo",
    nome: "Ensino Médio (conclusão)",
    chamada: "Termine seus estudos",
    descricao: "",
    icone: "🎓",
    whatsapp: "",
    turnos: [],
    extra: null,
    ativo: false
  }
];


/* Turmas por idade — usado só nos cursos com extra: "faixaEtaria" */
const FAIXAS_ETARIAS = [
  { id: "infantil",       rotulo: "Infantil",            detalhe: "6 a 10 anos",  menorDeIdade: true },
  { id: "preadolescente", rotulo: "Pré-adolescentes",    detalhe: "10 a 14 anos", menorDeIdade: true },
  { id: "adulto",         rotulo: "Jovens e adultos",    detalhe: "14 a 60 anos", menorDeIdade: false }
];


/* --------------------------------------------------------------------------
   4) VENDEDORES / CONSULTORES

   codigo    → o que vai no link: ?v=marcos
   genero    → "m" ou "f", define a silhueta quando não há foto
   foto      → deixe "" para usar a silhueta.
               Quando tiver a foto real: "img/marcos.jpg"

   O vendedor NÃO tem número aqui de propósito: toda ficha vai para o
   WhatsApp do CURSO (seção 3), levando o nome de quem indicou na mensagem.

   >>> OS NOMES ABAIXO SÃO FICTÍCIOS (exemplo). Trocar pelos reais. <<<
   -------------------------------------------------------------------------- */
const VENDEDORES = [
  { codigo: "marcos",  nome: "Marcos Pereira",  cargo: "Consultor educacional",  genero: "m", foto: "" },
  { codigo: "juliana", nome: "Juliana Marques", cargo: "Consultora educacional", genero: "f", foto: "" },
  { codigo: "rafael",  nome: "Rafael Nogueira", cargo: "Consultor educacional",  genero: "m", foto: "" },
  { codigo: "aline",   nome: "Aline Castro",    cargo: "Consultora educacional", genero: "f", foto: "" }
];


/* --------------------------------------------------------------------------
   5) ONDE AS FICHAS SÃO GUARDADAS

   Cole aqui o endereço do App da Web do Google (termina em /exec).
   O passo a passo para gerar está em backend/LEIA-ME-BACKEND.txt

   Enquanto estiver vazio, o site continua funcionando e abrindo o WhatsApp
   normalmente — só não salva nada na planilha.
   -------------------------------------------------------------------------- */
const BACKEND_URL = "";


/* --------------------------------------------------------------------------
   6) DE ONDE A PESSOA CONHECEU O CURSO
   -------------------------------------------------------------------------- */
const ORIGENS = [
  { id: "instagram", rotulo: "Instagram",       icone: "📷" },
  { id: "whatsapp",  rotulo: "WhatsApp",        icone: "💬" },
  { id: "facebook",  rotulo: "Facebook",        icone: "👍" },
  { id: "indicacao", rotulo: "Indicação",       icone: "🗣️" },
  { id: "escola",    rotulo: "Escola/Empresa",  icone: "🏢" },
  { id: "panfleto",  rotulo: "Panfleto",        icone: "📄" },
  { id: "outro",     rotulo: "Outro",           icone: "✏️" }
];
