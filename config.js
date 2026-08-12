/* ==========================================================================
   INSTITUTO JANUÁRIO — FICHA DE PRÉ-MATRÍCULA
   config.js — TUDO que muda fica aqui. Não precisa mexer no app.js.

   Se você não programa: mexa só no texto entre aspas.
   Não apague vírgulas, chaves { } nem colchetes [ ].

   Os dados abaixo vieram do calendário oficial de turmas e dos panfletos
   do Instituto. Onde estiver escrito CONFERIR, é porque o material tinha
   informação faltando ou divergente.
   ========================================================================== */


/* --------------------------------------------------------------------------
   1) IDENTIDADE E CONTATO
   -------------------------------------------------------------------------- */
const INSTITUTO = {
  nome: "Instituto Januário",
  sigla: "IJ-CEP",
  subtitulo: "Centro de Ensino Profissional",
  parceira: "Kollarez Soluções e Comércio",

  // Número que recebe as fichas quando o curso não tiver um número próprio.
  // Formato: 55 + DDD + número, só dígitos.
  whatsappGeral: "5592984456744",
  whatsappVisivel: "(92) 98445-6744",

  cidade: "Presidente Figueiredo",
  estado: "AM",
  endereco: "Rua Gaivota, nº 272 — Bairro Orquídeas",
  referencia: "ao lado da Borracharia",
  instagram: "kollarez.solucoes.ofc",

  // Frase grande da abertura
  chamada: "Sua vaga começa aqui",
  apoio: "Cursos presenciais em Presidente Figueiredo. Preencha pelo celular em dois minutos e a gente te chama no WhatsApp."
};


/* --------------------------------------------------------------------------
   2) CORES
   Amostradas pixel a pixel do material impresso do Instituto.
   Trocar o TEMA troca o site inteiro de cor.
   -------------------------------------------------------------------------- */
const PALETAS = {
  januario: {
    "--fundo":      "#eef1f7",
    "--caixa":      "#ffffff",
    "--texto":      "#0C1A3C",
    "--texto2":     "#5a6785",
    "--borda":      "#d8dfec",
    "--marca":      "#0C1A3C",
    "--marcaClara": "#1B4F9C",
    "--marca2":     "#D9A22B",
    "--marca2Clara":"#F0C25A",
    "--marcaSuave": "#e7ecf6",
    "--ok":         "#1a7f4b",
    "--erro":       "#c0392b"
  }
};
const TEMA = "januario";


/* --------------------------------------------------------------------------
   3) CURSOS

   id         → aparece no link (?curso=informatica)
   ilustra    → qual desenho usar (ver marca.js)
   whatsapp   → número que recebe as fichas DESTE curso.
                Vazio "" usa o número geral lá de cima.
   turmas     → os horários reais. O aluno pode marcar mais de um.
                  id      = número da turma no calendário oficial
                  dias    = os dias da semana
                  horario = a faixa de hora
                  vagas   = quantas vagas a turma tem
   escolha    → "horario" (padrão) ou "modalidade", para os cursos EAD
   precos     → o que aparece no cartão do curso
   extra      → "faixaEtaria" mostra as turmas por idade (só no Inglês)
   ativo      → false esconde o curso sem apagar nada
   -------------------------------------------------------------------------- */
const CURSOS = [

  {
    id: "informatica",
    nome: "Informática e Empregabilidade",
    chamada: "Do zero ao mercado de trabalho",
    descricao: "Aprenda a usar o computador desde o começo: ligar, digitar, internet, e-mail, Word e Excel. No final, você sai preparado para as vagas que pedem informática.",
    paraQuem: "Para trabalhar em escritório, comércio e atendimento",
    ilustra: "informatica",
    whatsapp: "",
    duracao: "6 meses",
    cargaHoraria: "144 horas",
    ritmo: "3 aulas por semana, de 2 horas cada",
    escolha: "horario",
    turmas: [
      { id: "01", dias: "Seg, Qua e Sex", horario: "08:00 às 09:50", vagas: 10 },
      { id: "02", dias: "Seg, Qua e Sex", horario: "10:00 às 11:50", vagas: 10 },
      { id: "03", dias: "Seg, Qua e Sex", horario: "13:00 às 14:50", vagas: 10 },
      { id: "04", dias: "Seg, Qua e Sex", horario: "15:00 às 16:50", vagas: 10 },
      { id: "05", dias: "Seg, Qua e Sex", horario: "18:00 às 19:50", vagas: 10 },
      { id: "06", dias: "Seg, Qua e Sex", horario: "20:00 às 21:50", vagas: 10 },
      { id: "11", dias: "Ter, Qui e Sáb", horario: "18:00 às 19:50", vagas: 10 }
    ],
    precos: {
      matricula: "R$ 50,00",
      linhas: [
        { rotulo: "1º ao 3º mês", valor: "R$ 129,90" },
        { rotulo: "4º ao 6º mês", valor: "R$ 150,00" }
      ]
    },
    extra: null,
    ativo: true
  },

  {
    id: "ingles",
    nome: "Inglês e Empregabilidade",
    chamada: "Do básico ao avançado",
    descricao: "Conversação desde as primeiras aulas, gramática na prática, pronúncia e inglês para o trabalho. Turmas separadas por idade.",
    paraQuem: "Para quem quer falar inglês e crescer no trabalho",
    ilustra: "ingles",
    whatsapp: "",
    duracao: "6 meses",
    cargaHoraria: "144 horas",
    ritmo: "3 aulas por semana, de 2 horas cada",
    escolha: "horario",
    turmas: [
      { id: "08", dias: "Ter, Qui e Sáb", horario: "10:00 às 12:00", vagas: 10 },
      { id: "09", dias: "Ter, Qui e Sáb", horario: "13:00 às 15:00", vagas: 10 },
      { id: "12", dias: "Ter, Qui e Sáb", horario: "20:00 às 22:00", vagas: 10 }
    ],
    precos: {
      matricula: "R$ 50,00",
      linhas: [
        { rotulo: "1º ao 3º mês", valor: "R$ 129,90" },
        { rotulo: "4º ao 6º mês", valor: "R$ 150,00" }
      ]
    },
    // A turma infantil tem regra própria: não paga matrícula e a
    // mensalidade é outra. Vem do panfleto do Inglês Infantil.
    precosInfantil: {
      matricula: "grátis",
      linhas: [
        { rotulo: "Mensalidade", valor: "R$ 200,00" }
      ],
      nota: "Material didático incluso (apostila)."
    },
    extra: "faixaEtaria",
    ativo: true
  },

  {
    id: "monitor",
    nome: "Monitor Escolar",
    chamada: "Preparação para concurso público",
    descricao: "Qualificação profissional para trabalhar em escola: acompanhamento de alunos, apoio ao professor e rotina escolar. Também prepara para concurso.",
    paraQuem: "Para trabalhar em escola e creche",
    ilustra: "monitor",
    whatsapp: "",
    duracao: "6 meses",
    cargaHoraria: "144 horas",
    ritmo: "3 aulas por semana, de 2 horas cada",
    escolha: "horario",
    turmas: [
      { id: "07", dias: "Ter, Qui e Sáb", horario: "08:00 às 09:50", vagas: 10 },
      { id: "12", dias: "Ter, Qui e Sáb", horario: "20:00 às 22:00", vagas: 10 }
    ],
    precos: {
      matricula: "R$ 50,00",
      linhas: [
        { rotulo: "1º ao 3º mês", valor: "R$ 129,90" },
        { rotulo: "4º ao 6º mês", valor: "R$ 150,00" }
      ]
    },
    extra: null,
    ativo: true
  },

  {
    id: "administrativo",
    nome: "Assistente Administrativo e Financeiro",
    chamada: "Curso rápido, prática no computador",
    descricao: "Contas a pagar e receber, notas, planilhas, atendimento e rotina de escritório. Aulas práticas direto no computador.",
    paraQuem: "Para trabalhar em escritório, loja e setor financeiro",
    ilustra: "administrativo",
    whatsapp: "",
    duracao: "1 mês e meio",
    cargaHoraria: "14 aulas — 42 horas",
    ritmo: "3 aulas por semana, de 2 horas cada",
    escolha: "horario",
    turmas: [
      { id: "10", dias: "Ter, Qui e Sáb", horario: "15:00 às 17:00", vagas: 10 }
    ],
    precos: {
      matricula: "R$ 50,00",
      linhas: [
        { rotulo: "À vista", valor: "R$ 270,00" },
        { rotulo: "Ou no boleto", valor: "3x R$ 99,90" }
      ]
    },
    extra: null,
    ativo: true
  },

  {
    id: "libras",
    nome: "Leitura e Interpretação de Libras",
    chamada: "Um encontro por semana, dia inteiro",
    descricao: "Alfabeto, conversação, gramática da Libras, cultura surda e prática de interpretação. Comunique-se com pessoas surdas e abra portas em escola, saúde e atendimento.",
    paraQuem: "Para trabalhar em escola, saúde e atendimento ao público",
    ilustra: "libras",
    whatsapp: "",
    duracao: "6 meses",
    cargaHoraria: "144 horas",
    ritmo: "4 encontros por mês, de 8 horas cada",
    escolha: "horario",
    turmas: [
      { id: "A", dias: "Todos os sábados", horario: "08:00 às 17:00", vagas: 15, nota: "Almoço das 12:00 às 13:00" },
      { id: "B", dias: "Todos os domingos", horario: "08:00 às 17:00", vagas: 15, nota: "Almoço das 12:00 às 13:00" }
    ],
    precos: {
      matricula: "R$ 50,00",
      linhas: [
        { rotulo: "Mensalidade", valor: "R$ 197,00" }
      ],
      nota: "Também dá para pagar à vista com desconto ou em 6x no cartão, sem juros."
    },
    extra: null,
    ativo: true
  },

  /* ---- CURSOS TÉCNICOS — 100% EAD, diploma reconhecido no Brasil ----
     Aqui o aluno não escolhe horário, escolhe o caminho. Por isso
     escolha: "modalidade".
     CONFERIR: os valores dos técnicos não estavam no material. */
  {
    id: "eletrotecnica",
    nome: "Técnico em Eletrotécnica",
    chamada: "Diploma reconhecido em todo o Brasil",
    descricao: "Curso técnico 100% EAD. Você estuda de onde estiver, no seu tempo, e recebe diploma de técnico.",
    paraQuem: "Para trabalhar com energia, instalações e manutenção elétrica",
    ilustra: "generico",
    whatsapp: "",
    duracao: "",
    cargaHoraria: "",
    ritmo: "100% EAD",
    escolha: "modalidade",
    turmas: [
      { id: "COMP", dias: "Por competência", horario: "Em até 15 dias úteis", nota: "Para quem já trabalha na área — sua experiência é reconhecida" },
      { id: "CONV", dias: "Convencional", horario: "De 6 meses a 1 ano", nota: "Formação completa, do começo ao fim" }
    ],
    precos: null,
    extra: null,
    ativo: true
  },

  {
    id: "mineracao",
    nome: "Técnico em Mineração",
    chamada: "Diploma reconhecido em todo o Brasil",
    descricao: "Curso técnico 100% EAD, para um dos setores que mais crescem no país. Você estuda de onde estiver e recebe diploma de técnico.",
    paraQuem: "Para trabalhar em mineração e áreas ligadas",
    ilustra: "generico",
    whatsapp: "",
    duracao: "",
    cargaHoraria: "",
    ritmo: "100% EAD",
    escolha: "modalidade",
    turmas: [
      { id: "COMP", dias: "Por competência", horario: "Em até 15 dias úteis", nota: "Para quem já trabalha na área — sua experiência é reconhecida" },
      { id: "CONV", dias: "Convencional", horario: "De 6 meses a 1 ano", nota: "Formação completa, do começo ao fim" }
    ],
    precos: null,
    extra: null,
    ativo: true
  }
];


/* --------------------------------------------------------------------------
   4) TURMAS POR IDADE — só o Inglês usa
   -------------------------------------------------------------------------- */
const FAIXAS_ETARIAS = [
  { valor: "6 a 10 anos",  rotulo: "Criança",          detalhe: "6 a 10 anos",  infantil: true },
  { valor: "10 a 14 anos", rotulo: "Pré-adolescente",  detalhe: "10 a 14 anos" },
  { valor: "14 a 60 anos", rotulo: "Jovem ou adulto",  detalhe: "14 a 60 anos" }
];


/* --------------------------------------------------------------------------
   5) EQUIPE
   O link de indicação carrega a pessoa: ?v=leticia

   codigo → o que vai no link
   foto   → arquivo dentro de img/equipe/. Deixe "" para usar o monograma.

   A ficha vai SEMPRE para o WhatsApp do curso, nunca para o número da
   pessoa. O nome de quem indicou viaja escrito dentro da mensagem.
   -------------------------------------------------------------------------- */
const VENDEDORES = [
  { codigo: "leticia",    nome: "Letícia Silva",  cargo: "Instrutora da Educação",              foto: "img/equipe/leticia.jpg" },
  { codigo: "vitoria",    nome: "Vitória Silva",  cargo: "Instrutora da Educação",              foto: "img/equipe/vitoria.jpg" },
  { codigo: "camila",     nome: "Camila da Cruz", cargo: "Instrutora da Educação",              foto: "img/equipe/camila.jpg" },
  { codigo: "ana-rebeca", nome: "Ana Rebeca",     cargo: "Instrutora da Educação",              foto: "img/equipe/ana-rebeca.jpg" },
  { codigo: "yasmin",     nome: "Yasmin Pereira", cargo: "Instrutora da Educação",              foto: "img/equipe/yasmin.jpg" },
  { codigo: "midia",      nome: "Midiã Falcão",   cargo: "Supervisora Comercial e de Vendas",   foto: "img/equipe/midia.jpg" }
];


/* --------------------------------------------------------------------------
   6) COMO A PESSOA FICOU SABENDO
   -------------------------------------------------------------------------- */
const ORIGENS = [
  { valor: "instagram", rotulo: "Instagram" },
  { valor: "whatsapp",  rotulo: "WhatsApp" },
  { valor: "facebook",  rotulo: "Facebook" },
  { valor: "indicacao", rotulo: "Indicação de amigo" },
  { valor: "panfleto",  rotulo: "Panfleto" },
  { valor: "passando",  rotulo: "Passei em frente" },
  { valor: "outro",     rotulo: "Outro" }
];


/* --------------------------------------------------------------------------
   7) DOCUMENTOS PARA FECHAR A MATRÍCULA
   Aparecem na tela final, para a pessoa já ir separando.
   -------------------------------------------------------------------------- */
const DOCUMENTOS = [
  "RG e CPF",
  "Comprovante de residência",
  "Comprovante de escolaridade (quando exigido)"
];


/* --------------------------------------------------------------------------
   8) PLANILHA (opcional)
   Cole aqui o endereço do Google Apps Script para guardar cada ficha numa
   planilha. Deixando vazio, o site só abre o WhatsApp.
   Ver backend/LEIA-ME-BACKEND.txt.
   -------------------------------------------------------------------------- */
const BACKEND_URL = "";
