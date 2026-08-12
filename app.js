/* ==========================================================================
   MOTOR DO SITE — não precisa editar este arquivo.
   Tudo que muda (cursos, vendedores, cores, telefones) está em config.js.
   ========================================================================== */

const $  = (s, base = document) => base.querySelector(s);
const $$ = (s, base = document) => Array.from(base.querySelectorAll(s));

const RASCUNHO = "ijcep:rascunho";
const FILA = "ijcep:pendentes";
const TOTAL_PASSOS = 5;

const estado = {
  passo: 1,
  curso: null,
  turnos: [],
  faixaEtaria: null,
  sexo: null,
  origem: null,
  vendedor: null,        // código do vendedor confirmado ("" = veio por conta própria)
  vendedorDoLink: "",    // o que veio na URL, mesmo se não bateu com ninguém
  enviando: false
};


/* ======================================================= utilidades ===== */

const soDigitos = (v) => (v || "").replace(/\D/g, "");

function mascaraTelefone(v) {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function mascaraCPF(v) {
  const d = soDigitos(v).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

function mascaraData(v) {
  const d = soDigitos(v).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function cpfValido(valor) {
  const d = soDigitos(valor);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digito = (ate) => {
    let soma = 0;
    for (let i = 0; i < ate; i++) soma += Number(d[i]) * (ate + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

/** Converte "15/03/2005" em Date. Devolve null se a data não existir de verdade. */
function dataBR(valor) {
  const p = (valor || "").split("/");
  if (p.length !== 3 || p[2].length !== 4) return null;
  const [dia, mes, ano] = p.map(Number);
  const d = new Date(ano, mes - 1, dia);
  const real = d.getDate() === dia && d.getMonth() === mes - 1 && d.getFullYear() === ano;
  return real ? d : null;
}

function idadeEm(nascimento) {
  const hoje = new Date();
  let anos = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) anos--;
  return anos;
}

const cursoAtual = () => CURSOS.find((c) => c.id === estado.curso) || null;
const vendedorAtual = () => VENDEDORES.find((v) => v.codigo === estado.vendedor) || null;


/* ==================================================== montar a tela ===== */

function aplicarTema() {
  const paleta = PALETAS[TEMA] || PALETAS.januario;
  for (const chave in paleta) document.documentElement.style.setProperty(chave, paleta[chave]);
}

function preencherTextosFixos() {
  document.title = `${INSTITUTO.nome} — Pré-matrícula`;
  $("#topoNome").textContent = INSTITUTO.nome;
  $("#topoSub").textContent = INSTITUTO.subtitulo;
  $("#topoSelo").innerHTML = MARCA.selo(38);
  $("#capaTitulo").textContent = INSTITUTO.chamada;
  $("#capaApoio").textContent = INSTITUTO.apoio;

  $("#rodapeNome").textContent = INSTITUTO.nome;
  $("#rodapeSigla").textContent = `(${INSTITUTO.sigla})`;
  $("#rodapeEndereco").textContent =
    `${INSTITUTO.endereco} — ${INSTITUTO.cidade}/${INSTITUTO.estado}` +
    (INSTITUTO.referencia ? ` · ${INSTITUTO.referencia}` : "");
  $("#rodapeParceria").innerHTML =
    `<span class="rodape-kollarez">${MARCA.kollarez(22)}</span>Uma iniciativa ${INSTITUTO.parceira}`;

  // Os documentos que a pessoa vai precisar levar, na tela de sucesso.
  const docs = $("#sucessoDocumentos");
  if (docs && typeof DOCUMENTOS !== "undefined" && DOCUMENTOS.length) {
    docs.innerHTML = `
      <h3>O que levar no dia</h3>
      <ul>${DOCUMENTOS.map((d) => `<li>${MARCA.icone("checkRedondo")}<span>${d}</span></li>`).join("")}</ul>`;
  }

  $("#inCidade").value = INSTITUTO.cidade;
  $("#inEstado").value = INSTITUTO.estado;
}

/** Uma etiqueta pequena com ícone. Usada para duração, carga e ritmo. */
function etiqueta(icone, texto) {
  return texto ? `<span class="etiqueta">${MARCA.icone(icone)}${texto}</span>` : "";
}

/** O quadro de valores do cartão. Curso sem preço definido não mostra nada —
    é melhor faltar informação do que publicar valor que não foi confirmado. */
function blocoPrecos(precos) {
  if (!precos) return "";
  const linhas = (precos.linhas || [])
    .map((l) => `<span class="preco-linha"><em>${l.rotulo}</em><b>${l.valor}</b></span>`)
    .join("");
  return `
    <span class="curso-precos">
      ${precos.matricula ? `<span class="preco-matricula">Matrícula ${precos.matricula}</span>` : ""}
      ${linhas}
      ${precos.nota ? `<span class="preco-nota">${precos.nota}</span>` : ""}
    </span>`;
}

function montarCursos() {
  const alvo = $("#listaCursos");
  alvo.innerHTML = "";

  CURSOS.filter((c) => c.ativo).forEach((curso, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "curso-cartao entra";
    b.style.setProperty("--ordem", i);      // entrada escalonada
    b.setAttribute("aria-pressed", "false");
    b.dataset.curso = curso.id;

    b.innerHTML = `
      <span class="curso-topo">
        ${MARCA.ilustracao(curso.ilustra)}
        <span class="curso-titulos">
          <span class="curso-nome">${curso.nome}</span>
          <span class="curso-chamada">${curso.chamada}</span>
        </span>
        <span class="curso-marca" aria-hidden="true">${MARCA.icone("check")}</span>
      </span>

      ${curso.paraQuem ? `<span class="curso-paraquem">${curso.paraQuem}</span>` : ""}
      ${curso.descricao ? `<span class="curso-descricao">${curso.descricao}</span>` : ""}

      <span class="curso-etiquetas">
        ${etiqueta("calendario", curso.duracao)}
        ${etiqueta("relogio", curso.cargaHoraria)}
        ${etiqueta("vagas", curso.ritmo)}
      </span>

      ${blocoPrecos(curso.precos)}`;

    b.addEventListener("click", () => escolherCurso(curso.id));
    alvo.appendChild(b);
  });
}

function escolherCurso(id) {
  estado.curso = id;
  estado.turnos = [];
  estado.faixaEtaria = null;

  $$("#listaCursos .curso-cartao").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.curso === id))
  );
  esconderErro($("#erroCurso"));
  montarTurnos();
  montarFaixas();
  atualizarBlocoResponsavel();
  salvarRascunho();
}

/** Como a turma aparece escrita na revisão e na mensagem do WhatsApp.
    Ex.: "Turma 03 · Seg, Qua e Sex · 13:00 às 14:50" */
function rotuloTurma(turma, curso) {
  const prefixo = curso && curso.escolha === "modalidade"
    ? ""
    : `Turma ${turma.id} · `;
  return `${prefixo}${turma.dias} · ${turma.horario}`;
}

function montarTurnos() {
  const curso = cursoAtual();
  const bloco = $("#blocoTurno");
  const lista = $("#listaTurnos");
  lista.innerHTML = "";

  const turmas = (curso && curso.turmas) || [];
  if (!turmas.length) { bloco.hidden = true; return; }
  bloco.hidden = false;

  // Curso EAD não tem horário: o que se escolhe ali é o caminho.
  const porModalidade = curso.escolha === "modalidade";
  $("#tituloTurno").textContent = porModalidade
    ? "Como você prefere estudar?"
    : "Qual horário é melhor para você?";
  $("#dicaTurno").textContent = porModalidade
    ? "Escolha o caminho que combina com a sua vida."
    : "Pode marcar mais de um. Quanto mais horários, mais fácil achar vaga.";

  turmas.forEach((turma, i) => {
    const rotulo = rotuloTurma(turma, curso);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "turma entra";
    b.style.setProperty("--ordem", i);
    b.setAttribute("aria-pressed", String(estado.turnos.includes(rotulo)));
    b.innerHTML = `
      <span class="turma-marca" aria-hidden="true">${MARCA.icone("check")}</span>
      <span class="turma-corpo">
        <span class="turma-dias">${turma.dias}</span>
        <span class="turma-hora">${MARCA.icone("relogio")}${turma.horario}</span>
        ${turma.nota ? `<span class="turma-nota">${turma.nota}</span>` : ""}
      </span>
      ${porModalidade
        ? ""
        : `<span class="turma-etiqueta">Turma ${turma.id}${turma.vagas ? ` · ${turma.vagas} vagas` : ""}</span>`}`;

    b.addEventListener("click", () => {
      const marcado = b.getAttribute("aria-pressed") === "true";
      b.setAttribute("aria-pressed", String(!marcado));
      estado.turnos = marcado
        ? estado.turnos.filter((t) => t !== rotulo)
        : [...estado.turnos, rotulo];
      esconderErro($("#erroTurno"));
      salvarRascunho();
    });
    lista.appendChild(b);
  });
}

function montarFaixas() {
  const curso = cursoAtual();
  const bloco = $("#blocoFaixa");
  const lista = $("#listaFaixas");
  lista.innerHTML = "";

  if (!curso || curso.extra !== "faixaEtaria") { bloco.hidden = true; return; }
  bloco.hidden = false;

  FAIXAS_ETARIAS.forEach((faixa, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opcao entra";
    b.style.setProperty("--ordem", i);
    b.dataset.valor = faixa.valor;
    b.setAttribute("aria-pressed", String(estado.faixaEtaria === faixa.valor));
    b.innerHTML = `<span>${faixa.rotulo}<span class="opcao-detalhe">${faixa.detalhe}</span></span>`;
    b.addEventListener("click", () => {
      estado.faixaEtaria = faixa.valor;
      $$("#listaFaixas .opcao").forEach((o) =>
        o.setAttribute("aria-pressed", String(o.dataset.valor === faixa.valor))
      );
      esconderErro($("#erroFaixa"));
      atualizarBlocoResponsavel();
      atualizarPrecoDoCartao();
      salvarRascunho();
    });
    lista.appendChild(b);
  });
}

/** A turma infantil do Inglês não paga matrícula e tem mensalidade própria.
    Quando a pessoa marca "6 a 10 anos", o cartão do curso troca os valores
    na hora — assim ninguém descobre o preço certo só no atendimento. */
function atualizarPrecoDoCartao() {
  const curso = cursoAtual();
  if (!curso || !curso.precosInfantil) return;

  const faixa = FAIXAS_ETARIAS.find((f) => f.valor === estado.faixaEtaria);
  const precos = faixa && faixa.infantil ? curso.precosInfantil : curso.precos;

  const cartao = $(`#listaCursos .curso-cartao[data-curso="${curso.id}"]`);
  const caixa = cartao && $(".curso-precos", cartao);
  if (!caixa) return;

  const novo = document.createElement("div");
  novo.innerHTML = blocoPrecos(precos);
  caixa.replaceWith(novo.firstElementChild);
}

/** Algumas listas do config chamam a chave de "valor" e outras de "id".
    Aceitar as duas evita o bug silencioso de gravar undefined no estado. */
const valorDe = (item) => (item.valor !== undefined ? item.valor : item.id);

function montarEscolhaUnica(seletor, itens, chaveEstado, aoEscolher) {
  const lista = $(seletor);
  lista.innerHTML = "";
  itens.forEach((item, i) => {
    const valor = valorDe(item);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opcao entra";
    b.style.setProperty("--ordem", i);
    b.setAttribute("aria-pressed", String(estado[chaveEstado] === valor));
    b.dataset.valor = valor;
    b.innerHTML = `<span>${item.rotulo}</span>`;
    b.addEventListener("click", () => {
      estado[chaveEstado] = valor;
      $$(".opcao", lista).forEach((o) =>
        o.setAttribute("aria-pressed", String(o.dataset.valor === valor))
      );
      if (aoEscolher) aoEscolher(item, valor);
      salvarRascunho();
    });
    lista.appendChild(b);
  });
}


/* ================================================= quem indicou ========= */

/** O link pode trazer quem indicou (?v=leticia), mas isso não decide nada
    sozinho: a escolha é sempre confirmada pela própria pessoa, no fim do
    preenchimento. O link só deixa a opção já marcada.

    O cartão no topo da tela saiu de propósito — anunciar o nome antes de
    a pessoa dizer qualquer coisa é dar a atribuição por certa cedo demais,
    e quem foi atendido por outra pessoa acabava passando batido. */
function montarIndicacao() {
  const codigo = new URLSearchParams(location.search).get("v") || "";
  estado.vendedorDoLink = codigo;

  const encontrado = VENDEDORES.find((v) => v.codigo === codigo);
  if (encontrado) estado.vendedor = encontrado.codigo;

  montarQuemAtendeu();
}

/** A pergunta do passo 4. Aparece sempre, e é obrigatória: sem ela, quem
    atendeu não conta para a cota de ninguém. */
function montarQuemAtendeu() {
  const campo = $("#campoQuemAtendeu");
  const lista = $("#listaQuemAtendeu");

  campo.hidden = false;
  lista.innerHTML = "";

  const opcoes = [
    ...VENDEDORES.map((v) => ({ valor: v.codigo, nome: v.nome, detalhe: v.cargo, pessoa: v })),
    { valor: "", nome: "Ninguém — vim por conta própria", detalhe: "", pessoa: null }
  ];

  opcoes.forEach((item, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opcao entra";
    b.style.setProperty("--ordem", i);
    b.dataset.valor = item.valor;
    b.setAttribute("aria-pressed", String(estado.vendedor === item.valor));
    b.innerHTML =
      (item.pessoa
        ? `<span class="indicacao-foto indicacao-foto--pequena">${MARCA.retrato(item.pessoa)}</span>`
        : `<span class="opcao-icone" aria-hidden="true">${MARCA.icone("pessoa")}</span>`) +
      `<span>${item.nome}${item.detalhe ? `<span class="opcao-detalhe">${item.detalhe}</span>` : ""}</span>`;

    b.addEventListener("click", () => {
      estado.vendedor = item.valor;
      $$(".opcao", lista).forEach((o) =>
        o.setAttribute("aria-pressed", String(o.dataset.valor === item.valor))
      );
      esconderErro($("#erroQuemAtendeu"));
      salvarRascunho();
    });

    lista.appendChild(b);
  });
}


/* ============================================ responsável (menor) ======= */

/** Menor de idade se a faixa etária infantil/pré-adolescente foi escolhida
    ou se a data de nascimento indica menos de 18 anos. */
function ehMenorDeIdade() {
  const faixa = FAIXAS_ETARIAS.find((f) => valorDe(f) === estado.faixaEtaria);
  if (faixa && faixa.menorDeIdade) return true;

  const nasc = dataBR($("#inNascimento").value);
  return nasc ? idadeEm(nasc) < 18 : false;
}

function atualizarBlocoResponsavel() {
  const precisa = ehMenorDeIdade();
  $("#blocoResponsavel").hidden = !precisa;
  $("#consentimentoResponsavel").hidden = !precisa;
  if (!precisa) $("#chkResponsavel").checked = false;
}


/* ================================================= validação =========== */

function mostrarErro(campo, mensagem) {
  const alvo = campo.closest(".campo") || campo.parentElement;
  const p = $(".erro", alvo);
  if (p) { p.textContent = mensagem; p.hidden = false; }
  campo.setAttribute("aria-invalid", "true");
}

function limparErro(campo) {
  const alvo = campo.closest(".campo") || campo.parentElement;
  const p = $(".erro", alvo);
  if (p) p.hidden = true;
  campo.removeAttribute("aria-invalid");
}

function esconderErro(p) { if (p) p.hidden = true; }

function exibirErro(p, mensagem) {
  if (!p) return;
  p.textContent = mensagem;
  p.hidden = false;
}

/** Devolve a mensagem de erro do campo, ou "" se estiver tudo certo. */
function checarCampo(campo) {
  const v = campo.value.trim();
  const dispensado = campo.dataset.naotenho === "1";

  switch (campo.id) {
    case "inNome":
    case "inRespNome":
      if (!v) return "Faltou preencher o nome completo.";
      if (v.split(/\s+/).length < 2) return "Escreva o nome e o sobrenome.";
      return "";

    case "inNascimento": {
      if (!v) return "Faltou a data de nascimento.";
      const d = dataBR(v);
      if (!d) return "Essa data não existe. Confira o dia, o mês e o ano.";
      const anos = idadeEm(d);
      if (anos < 0 || anos > 110) return "Confira o ano de nascimento.";
      return "";
    }

    case "inTelefone":
    case "inRespTelefone": {
      const d = soDigitos(v);
      if (!d) return "Faltou o número do WhatsApp.";
      if (d.length < 10) return "Esse número parece incompleto. Não esqueça o DDD.";
      return "";
    }

    case "inEmail":
      if (dispensado || !v) return "";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v)) return "Confira o e-mail. Exemplo: nome@gmail.com";
      return "";

    // O CPF é obrigatório dos dois lados: do aluno e, quando o aluno é
    // menor, também do responsável. Sem ele a secretaria não consegue
    // fechar a matrícula nem emitir o certificado.
    case "inCPF":
    case "inRespCPF":
      if (!v) return campo.id === "inRespCPF"
        ? "Faltou o CPF do responsável."
        : "Faltou o CPF do aluno.";
      if (!cpfValido(v)) return "Esse CPF não confere. Confira os números.";
      return "";

    case "inRG":
      if (dispensado || v) return "";
      return "Faltou o RG. Se não tiver, toque no botão abaixo.";

    case "inRespParentesco":
      if (!v) return "Diga o que a pessoa é do aluno (mãe, pai, avó...).";
      return "";

    case "inRua":    return v ? "" : "Faltou a rua ou avenida.";
    case "inBairro": return v ? "" : "Faltou o bairro.";
    case "inCidade": return v ? "" : "Faltou a cidade.";
    case "inEstado": return v.length === 2 ? "" : "Escreva as duas letras do estado. Exemplo: AM";

    default: return "";
  }
}

function validarCampo(campo) {
  const erro = checarCampo(campo);
  if (erro) { mostrarErro(campo, erro); return false; }
  limparErro(campo);
  return true;
}

/** Campos que precisam ser conferidos em cada passo. */
function camposDoPasso(passo) {
  if (passo === 2) {
    const base = ["#inNome", "#inNascimento"];
    if (!$("#blocoResponsavel").hidden) {
      base.push("#inRespNome", "#inRespParentesco", "#inRespTelefone", "#inRespCPF");
    }
    return base.map((s) => $(s));
  }
  if (passo === 3) {
    return ["#inTelefone", "#inEmail", "#inRua", "#inBairro", "#inCidade", "#inEstado"].map((s) => $(s));
  }
  if (passo === 4) {
    const base = ["#inCPF", "#inRG"];
    if (!$("#campoOrigemOutro").hidden) base.push("#inOrigemOutro");
    return base.map((s) => $(s));
  }
  return [];
}

function validarPasso(passo) {
  let ok = true;
  let primeiroRuim = null;

  if (passo === 1) {
    if (!estado.curso) { exibirErro($("#erroCurso"), "Escolha um curso para continuar."); ok = false; }
    const curso = cursoAtual();
    const turmas = (curso && curso.turmas) || [];
    if (turmas.length && !estado.turnos.length) {
      exibirErro($("#erroTurno"), curso.escolha === "modalidade"
        ? "Escolha como você prefere estudar."
        : "Escolha pelo menos um horário."); ok = false;
    }
    if (curso && curso.extra === "faixaEtaria" && !estado.faixaEtaria) {
      exibirErro($("#erroFaixa"), "Escolha a idade do aluno."); ok = false;
    }
  }

  if (passo === 2 && !estado.sexo) {
    exibirErro($("#erroSexo"), "Escolha uma opção."); ok = false;
  }

  if (passo === 4) {
    if (!estado.origem) {
      exibirErro($("#erroOrigem"), "Conta pra gente como você soube do curso."); ok = false;
    }
    // null = ainda não respondeu. "" = respondeu "ninguém", o que é válido.
    if (!$("#campoQuemAtendeu").hidden && estado.vendedor === null) {
      exibirErro($("#erroQuemAtendeu"), "Escolha uma opção."); ok = false;
    }
  }

  camposDoPasso(passo).forEach((campo) => {
    if (!campo || campo.closest("[hidden]")) return;
    if (validarCampo(campo)) return;
    ok = false;
    if (!primeiroRuim) primeiroRuim = campo;
  });

  if (primeiroRuim) primeiroRuim.focus({ preventScroll: false });
  return ok;
}

function validarConsentimentos() {
  let ok = true;
  if (!$("#chkContato").checked) {
    exibirErro($("#erroContato"), "Precisamos da sua autorização para entrar em contato."); ok = false;
  } else esconderErro($("#erroContato"));

  if (!$("#chkDados").checked) {
    exibirErro($("#erroDados"), "Precisamos da sua autorização para guardar os dados."); ok = false;
  } else esconderErro($("#erroDados"));

  if (!$("#consentimentoResponsavel").hidden && !$("#chkResponsavel").checked) {
    exibirErro($("#erroRespDecl"), "O responsável precisa confirmar a autorização."); ok = false;
  } else esconderErro($("#erroRespDecl"));

  return ok;
}


/* =================================================== navegação ========== */

function irParaPasso(numero) {
  estado.passo = Math.min(Math.max(numero, 1), TOTAL_PASSOS);

  $$(".passo").forEach((p) => { p.hidden = Number(p.dataset.passo) !== estado.passo; });

  $("#progressoPreenchido").style.width = `${(estado.passo / TOTAL_PASSOS) * 100}%`;
  $("#progressoTexto").textContent = `Passo ${estado.passo} de ${TOTAL_PASSOS}`;

  $("#btnVoltar").hidden = estado.passo === 1;
  $("#btnContinuar").hidden = estado.passo === TOTAL_PASSOS;

  if (estado.passo === TOTAL_PASSOS) montarRevisao();

  window.scrollTo({ top: 0, behavior: "smooth" });
  salvarRascunho();
}

function abrirFicha(passo = 1) {
  $("#capa").hidden = true;
  $("#ficha").hidden = false;
  irParaPasso(passo);
}


/* ==================================================== revisão =========== */

function linhaRevisao(rotulo, valor) {
  if (!valor) return "";
  return `<div class="revisao-linha">
            <span class="revisao-rotulo">${rotulo}</span>
            <span class="revisao-valor">${valor}</span>
          </div>`;
}

function montarRevisao() {
  const curso = cursoAtual();
  const faixa = FAIXAS_ETARIAS.find((f) => valorDe(f) === estado.faixaEtaria);
  const origem = ORIGENS.find((o) => valorDe(o) === estado.origem);
  const menor = !$("#blocoResponsavel").hidden;

  const blocos = [
    {
      passo: 1, titulo: "Curso escolhido",
      linhas:
        linhaRevisao("Curso", curso ? curso.nome : "") +
        linhaRevisao("Horário", estado.turnos.join(", ")) +
        linhaRevisao("Turma", faixa ? `${faixa.rotulo} (${faixa.detalhe})` : "")
    },
    {
      passo: 2, titulo: "Aluno",
      linhas:
        linhaRevisao("Nome", $("#inNome").value.trim()) +
        linhaRevisao("Nascimento", $("#inNascimento").value.trim()) +
        linhaRevisao("Sexo", estado.sexo) +
        (menor
          ? linhaRevisao("Responsável", $("#inRespNome").value.trim()) +
            linhaRevisao("Parentesco", $("#inRespParentesco").value.trim()) +
            linhaRevisao("WhatsApp resp.", $("#inRespTelefone").value.trim())
          : "")
    },
    {
      passo: 3, titulo: "Contato",
      linhas:
        linhaRevisao("WhatsApp", $("#inTelefone").value.trim()) +
        linhaRevisao("E-mail", $("#inEmail").value.trim()) +
        linhaRevisao("Instagram", $("#inInstagram").value.trim()) +
        linhaRevisao("Endereço",
          [$("#inRua").value.trim(), $("#inBairro").value.trim()].filter(Boolean).join(", ")) +
        linhaRevisao("Cidade", `${$("#inCidade").value.trim()}/${$("#inEstado").value.trim()}`)
    },
    {
      passo: 4, titulo: "Documentos",
      linhas:
        linhaRevisao("CPF", $("#inCPF").value.trim()) +
        linhaRevisao("RG", $("#inRG").dataset.naotenho === "1" ? "Vou levar depois" : $("#inRG").value.trim()) +
        linhaRevisao("Soube por", origem ? origem.rotulo : "") +
        linhaRevisao("Detalhe", $("#inOrigemOutro").value.trim())
    }
  ];

  $("#revisao").innerHTML = blocos
    .filter((b) => b.linhas)
    .map(
      (b) => `
      <div class="revisao-bloco">
        <div class="revisao-topo">
          <h3>${b.titulo}</h3>
          <button type="button" class="revisao-corrigir" data-ir="${b.passo}">Corrigir</button>
        </div>
        ${b.linhas}
      </div>`
    )
    .join("");

  $$("#revisao .revisao-corrigir").forEach((b) =>
    b.addEventListener("click", () => irParaPasso(Number(b.dataset.ir)))
  );

  const vend = vendedorAtual();
  $("#revisaoVendedor").innerHTML = vend
    ? `<span class="indicacao-foto indicacao-foto--pequena">${MARCA.retrato(vend)}</span>
       <p>Sua inscrição fica registrada com<strong>${vend.nome}</strong></p>`
    : "";
}


/* ============================================ montar o envio =========== */

function montarDados() {
  const menor = !$("#blocoResponsavel").hidden;
  const curso = cursoAtual();
  const faixa = FAIXAS_ETARIAS.find((f) => valorDe(f) === estado.faixaEtaria);
  const origem = ORIGENS.find((o) => valorDe(o) === estado.origem);
  const vend = vendedorAtual();

  return {
    curso: curso ? curso.nome : "",
    cursoId: estado.curso || "",
    turno: estado.turnos.join(", "),
    faixaEtaria: faixa ? `${faixa.rotulo} (${faixa.detalhe})` : "",

    nome: $("#inNome").value.trim(),
    nascimento: $("#inNascimento").value.trim(),
    sexo: estado.sexo || "",
    cpf: $("#inCPF").value.trim(),
    rg: $("#inRG").dataset.naotenho === "1" ? "Não informado" : $("#inRG").value.trim(),

    telefone: $("#inTelefone").value.trim(),
    email: $("#inEmail").value.trim(),
    instagram: $("#inInstagram").value.trim(),
    rua: $("#inRua").value.trim(),
    bairro: $("#inBairro").value.trim(),
    cidade: $("#inCidade").value.trim(),
    estado: $("#inEstado").value.trim().toUpperCase(),

    comoSoube: origem ? origem.rotulo : "",
    comoSoubeOutro: $("#inOrigemOutro").value.trim(),

    vendedor: vend ? vend.nome : "Sem vendedor",
    vendedorCodigo: estado.vendedor || "",
    vendedorCodigoLink: estado.vendedorDoLink,

    responsavelNome: menor ? $("#inRespNome").value.trim() : "",
    responsavelParentesco: menor ? $("#inRespParentesco").value.trim() : "",
    responsavelCPF: menor ? $("#inRespCPF").value.trim() : "",
    responsavelTelefone: menor ? $("#inRespTelefone").value.trim() : "",

    consenteContato: $("#chkContato").checked ? "Sim" : "Não",
    consenteDados: $("#chkDados").checked ? "Sim" : "Não",
    consenteResponsavel: menor ? ($("#chkResponsavel").checked ? "Sim" : "Não") : "",

    paginaOrigem: location.href,
    campoWebsite: $("#campoWebsite").value
  };
}

/** Mensagem do WhatsApp — é o relatório que a secretaria recebe.

    O CPF vai junto, do aluno e do responsável, porque sem ele não dá
    para fechar matrícula nem emitir certificado. O RG continua fora:
    não é exigido para abrir o cadastro e é um documento a menos
    circulando em celular. */
function textoWhatsApp(d) {
  const linhas = [
    `*PRÉ-MATRÍCULA — ${INSTITUTO.nome.toUpperCase()}*`,
    "",
    `*Curso:* ${d.curso}`
  ];
  if (d.turno) linhas.push(`*Horário:* ${d.turno}`);
  if (d.faixaEtaria) linhas.push(`*Turma:* ${d.faixaEtaria}`);

  // Quem indicou vem logo depois do curso, em destaque: é o que a
  // secretaria precisa ver de primeira para creditar a venda.
  linhas.push("", d.vendedorCodigo
    ? `*INDICADO POR:* ${d.vendedor}`
    : "*INDICADO POR:* ninguém — chegou direto pelo site");

  linhas.push("", `*Aluno:* ${d.nome}`, `*Nascimento:* ${d.nascimento}`);
  if (d.cpf) linhas.push(`*CPF do aluno:* ${d.cpf}`);
  if (d.responsavelNome) {
    linhas.push(`*Responsável:* ${d.responsavelNome} (${d.responsavelParentesco})`);
    if (d.responsavelCPF) linhas.push(`*CPF do responsável:* ${d.responsavelCPF}`);
    linhas.push(`*WhatsApp do responsável:* ${d.responsavelTelefone}`);
  }
  linhas.push(`*WhatsApp:* ${d.telefone}`);
  if (d.email) linhas.push(`*E-mail:* ${d.email}`);
  linhas.push(`*Bairro:* ${d.bairro} — ${d.cidade}/${d.estado}`);
  linhas.push("", `*Soube por:* ${d.comoSoube}${d.comoSoubeOutro ? ` — ${d.comoSoubeOutro}` : ""}`);
  return linhas.join("\n");
}

/** Toda ficha vai para o número do CURSO, nunca para o do vendedor.
    A indicação viaja escrita dentro da mensagem. */
function urlWhatsApp(d) {
  const curso = cursoAtual();
  const numero = (curso && curso.whatsapp) || INSTITUTO.whatsappGeral;
  return `https://wa.me/${numero}?text=${encodeURIComponent(textoWhatsApp(d))}`;
}

function enviarParaPlanilha(dados) {
  if (!BACKEND_URL) return Promise.resolve();
  return fetch(BACKEND_URL, { method: "POST", body: new URLSearchParams(dados) })
    .then((r) => r.json())
    .then((r) => { if (!r || !r.ok) throw new Error("A planilha recusou o envio"); });
}

function enfileirar(dados) {
  try {
    const fila = JSON.parse(localStorage.getItem(FILA) || "[]");
    fila.push(dados);
    localStorage.setItem(FILA, JSON.stringify(fila));
  } catch (_) { /* armazenamento cheio ou bloqueado — o WhatsApp já garantiu o contato */ }
}

function reenviarPendentes() {
  if (!BACKEND_URL) return;
  let fila;
  try { fila = JSON.parse(localStorage.getItem(FILA) || "[]"); } catch (_) { return; }
  if (!fila.length) return;

  localStorage.removeItem(FILA);
  fila.forEach((dados) => enviarParaPlanilha(dados).catch(() => enfileirar(dados)));
}

function aoEnviar(evento) {
  evento.preventDefault();
  if (estado.enviando) return;

  const primeiroRuim = [1, 2, 3, 4].find((p) => !validarPasso(p));
  if (primeiroRuim) { irParaPasso(primeiroRuim); return; }
  if (!validarConsentimentos()) return;

  const dados = montarDados();
  if (dados.campoWebsite) return;    // robô

  estado.enviando = true;
  $("#btnEnviar").disabled = true;
  $("#btnEnviar").textContent = "Enviando...";

  // O WhatsApp precisa abrir agora, ainda dentro do toque, senão o
  // celular bloqueia como pop-up.
  const link = urlWhatsApp(dados);
  window.open(link, "_blank");

  enviarParaPlanilha(dados).catch(() => enfileirar(dados));

  localStorage.removeItem(RASCUNHO);
  mostrarSucesso(dados, link);
}

function mostrarSucesso(dados, link) {
  $("#ficha").hidden = true;
  $("#sucesso").hidden = false;
  $("#sucessoNome").textContent = `${dados.nome} — ${dados.curso}`;
  $("#linkZapReserva").href = link;
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =================================================== rascunho =========== */

function salvarRascunho() {
  const campos = {};
  $$("#formulario input").forEach((c) => {
    if (c.type === "checkbox" || c.id === "campoWebsite") return;
    campos[c.id] = c.value;
  });

  try {
    localStorage.setItem(RASCUNHO, JSON.stringify({
      passo: estado.passo,
      curso: estado.curso,
      turnos: estado.turnos,
      faixaEtaria: estado.faixaEtaria,
      sexo: estado.sexo,
      origem: estado.origem,
      vendedor: estado.vendedor,
      vendedorDoLink: estado.vendedorDoLink,
      campos
    }));
  } catch (_) { /* sem espaço: o rascunho é conforto, não requisito */ }
}

function carregarRascunho() {
  let salvo;
  try { salvo = JSON.parse(localStorage.getItem(RASCUNHO) || "null"); } catch (_) { return false; }
  if (!salvo || !salvo.campos) return false;

  Object.entries(salvo.campos).forEach(([id, valor]) => {
    const c = document.getElementById(id);
    if (c && valor) c.value = valor;
  });

  if (salvo.curso) escolherCurso(salvo.curso);

  (salvo.turnos || []).forEach((t) => {
    const b = $$("#listaTurnos .opcao").find((o) => o.textContent === t);
    if (b) { b.setAttribute("aria-pressed", "true"); estado.turnos.push(t); }
  });

  if (salvo.faixaEtaria) {
    estado.faixaEtaria = salvo.faixaEtaria;
    $$("#listaFaixas .opcao").forEach((o, i) =>
      o.setAttribute("aria-pressed", String(FAIXAS_ETARIAS[i].id === salvo.faixaEtaria))
    );
  }

  ["sexo", "origem"].forEach((chave) => {
    if (!salvo[chave]) return;
    estado[chave] = salvo[chave];
    const lista = chave === "sexo" ? "#listaSexo" : "#listaOrigens";
    $$(`${lista} .opcao`).forEach((o) =>
      o.setAttribute("aria-pressed", String(o.dataset.valor === salvo[chave]))
    );
  });

  if (estado.origem === "outro") $("#campoOrigemOutro").hidden = false;

  // O link atual manda em quem indicou; o rascunho só vale se não veio ?v=
  if (!estado.vendedorDoLink && salvo.vendedor !== undefined && salvo.vendedor !== null) {
    estado.vendedor = salvo.vendedor;
    $$("#listaQuemAtendeu .opcao").forEach((o) =>
      o.setAttribute("aria-pressed", String(o.dataset.valor === estado.vendedor))
    );
  }

  atualizarBlocoResponsavel();
  return salvo.passo || 0;
}


/* ==================================================== ligações ========== */

function ligarMascaras() {
  const mascaras = {
    inTelefone: mascaraTelefone,
    inRespTelefone: mascaraTelefone,
    inCPF: mascaraCPF,
    inRespCPF: mascaraCPF,
    inNascimento: mascaraData
  };

  Object.entries(mascaras).forEach(([id, fn]) => {
    const campo = document.getElementById(id);
    campo.addEventListener("input", () => {
      campo.value = fn(campo.value);
      limparErro(campo);
      if (id === "inNascimento") atualizarBlocoResponsavel();
    });
  });
}

function ligarValidacaoAoSair() {
  $$("#formulario input[type='text'], #formulario input[type='tel'], #formulario input[type='email']")
    .forEach((campo) => {
      if (campo.id === "campoWebsite") return;
      campo.addEventListener("blur", () => {
        if (campo.value.trim() || campo.hasAttribute("required")) validarCampo(campo);
        salvarRascunho();
      });
      campo.addEventListener("input", () => limparErro(campo));
    });
}

/** Botões "não tenho": desligam o campo e dispensam a validação dele. */
function ligarBotoesNaoTenho() {
  $$("[data-naotenho], [data-limpa]").forEach((botao) => {
    const campo = document.getElementById(botao.dataset.naotenho || botao.dataset.limpa);
    const rotuloOriginal = botao.textContent;

    botao.addEventListener("click", () => {
      const dispensando = campo.dataset.naotenho !== "1";

      campo.dataset.naotenho = dispensando ? "1" : "0";
      campo.disabled = dispensando;
      botao.dataset.ativo = dispensando ? "1" : "0";
      botao.textContent = dispensando ? "✓ " + rotuloOriginal : rotuloOriginal;

      if (dispensando) { campo.value = ""; limparErro(campo); }
      salvarRascunho();
    });
  });
}

function iniciar() {
  aplicarTema();
  preencherTextosFixos();
  montarCursos();
  montarIndicacao();

  montarEscolhaUnica("#listaSexo", [
    { id: "Feminino", rotulo: "Feminino" },
    { id: "Masculino", rotulo: "Masculino" },
    { id: "Outro", rotulo: "Outro" }
  ], "sexo", () => esconderErro($("#erroSexo")));

  montarEscolhaUnica("#listaOrigens", ORIGENS, "origem", (item, valor) => {
    esconderErro($("#erroOrigem"));
    $("#campoOrigemOutro").hidden = valor !== "outro";
  });

  ligarMascaras();
  ligarValidacaoAoSair();
  ligarBotoesNaoTenho();

  $("#btnComecar").addEventListener("click", () => abrirFicha(1));
  $("#btnVoltar").addEventListener("click", () => irParaPasso(estado.passo - 1));
  $("#btnContinuar").addEventListener("click", () => {
    if (validarPasso(estado.passo)) irParaPasso(estado.passo + 1);
  });
  $("#formulario").addEventListener("submit", aoEnviar);

  $("#btnNovaFicha").addEventListener("click", () => {
    localStorage.removeItem(RASCUNHO);
    location.href = location.pathname + location.search;
  });

  // ?curso=libras já deixa o curso escolhido e pula direto para a ficha
  const cursoDoLink = new URLSearchParams(location.search).get("curso");
  const cursoValido = CURSOS.find((c) => c.id === cursoDoLink && c.ativo);

  const passoSalvo = carregarRascunho();
  if (cursoValido) escolherCurso(cursoValido.id);

  if (passoSalvo > 1) abrirFicha(passoSalvo);
  else if (cursoValido) abrirFicha(1);

  reenviarPendentes();
}

document.addEventListener("DOMContentLoaded", iniciar);
