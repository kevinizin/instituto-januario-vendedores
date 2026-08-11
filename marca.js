/* ==========================================================================
   INSTITUTO JANUÁRIO — MARCA E ILUSTRAÇÕES

   Tudo aqui é desenho vetorial escrito à mão. Nenhuma imagem é baixada da
   internet, nada depende de arquivo externo, e nada fica borrado — o mesmo
   desenho serve para o ícone de 32px e para o brasão de tela cheia.

   Por que não usamos emoji: emoji é desenhado pelo sistema, muda de cara em
   cada celular, não aceita a cor da marca e passa recado de conversa, não de
   instituição de ensino.
   ========================================================================== */

const MARCA = (() => {

  /* Cores lidas pixel a pixel do material impresso do Instituto. */
  const NAVY  = "#0C1A3C";
  const AZUL  = "#1B4F9C";
  const OURO  = "#D9A22B";
  const OURO2 = "#F0C25A";
  const CLARO = "#FFFFFF";

  /* ------------------------------------------------------------------
     O BRASÃO
     Escudo de campo claro com dupla borda (dourada por fora, azul por
     dentro). Dentro: capelo sobre coluna clássica, a letra J e um livro
     aberto na base. Louros dourados abraçando os dois lados.
     ------------------------------------------------------------------ */

  /* Um ramo de louro. Desenhado uma vez e espelhado para o outro lado. */
  const ramo = `
    <g fill="${OURO}">
      <path d="M44 62 C20 88 18 152 42 182" fill="none" stroke="${OURO}"
            stroke-width="4.5" stroke-linecap="round"/>
      <ellipse cx="30" cy="76"  rx="11" ry="4.6" transform="rotate(-58 30 76)"/>
      <ellipse cx="22" cy="96"  rx="12" ry="4.8" transform="rotate(-42 22 96)"/>
      <ellipse cx="17" cy="117" rx="12" ry="4.8" transform="rotate(-22 17 117)"/>
      <ellipse cx="17" cy="138" rx="12" ry="4.8" transform="rotate(-2 17 138)"/>
      <ellipse cx="22" cy="158" rx="12" ry="4.8" transform="rotate(20 22 158)"/>
      <ellipse cx="32" cy="175" rx="11" ry="4.6" transform="rotate(42 32 175)"/>
    </g>`;

  /* O escudo e o que vive dentro dele. */
  const escudo = `
    <path d="M100 14 L176 40 V126 C176 172 143 205 100 221
             C57 205 24 172 24 126 V40 Z"
          fill="${CLARO}" stroke="${OURO}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M100 26 L166 48 V126 C166 165 137 195 100 209
             C63 195 34 165 34 126 V48 Z"
          fill="${CLARO}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>

    <!-- coluna clássica: base, fuste canelado e capitel -->
    <rect x="72" y="96"  width="30" height="58" fill="${OURO}"/>
    <g stroke="${CLARO}" stroke-width="2.4">
      <path d="M80 100v50M87 100v50M94 100v50"/>
    </g>
    <rect x="66" y="88"  width="42" height="10" rx="2" fill="${OURO}"/>
    <rect x="64" y="154" width="46" height="11" rx="2" fill="${OURO}"/>

    <!-- capelo -->
    <path d="M87 62 L126 78 L87 94 L48 78 Z" fill="${NAVY}"/>
    <path d="M62 84 v14 c0 7 11 12 25 12 s25-5 25-12 V84" fill="none"
          stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>
    <path d="M126 78 v22" fill="none" stroke="${OURO}" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="126" cy="103" r="4.6" fill="${OURO}"/>

    <!-- a letra J, atravessando a coluna. É o elemento mais forte do
         brasão: precisa ser grande o bastante para dominar o campo. -->
    <path d="M130 86 v58 a23 23 0 0 1 -46 0" fill="none"
          stroke="${NAVY}" stroke-width="15" stroke-linecap="round"/>
    <path d="M108 86 h24" fill="none"
          stroke="${NAVY}" stroke-width="15" stroke-linecap="round"/>

    <!-- livro aberto na base -->
    <path d="M100 172 C88 163 72 161 58 163 v20 c14 -2 30 0 42 9
             c12 -9 28 -11 42 -9 v-20 c-14 -2 -30 0 -42 9 z"
          fill="${AZUL}"/>
    <path d="M100 172 v20" stroke="${CLARO}" stroke-width="2.6"/>
    <path d="M66 170 c10 -1 21 1 28 6 M134 170 c-10 -1 -21 1 -28 6"
          fill="none" stroke="${CLARO}" stroke-width="2.2" stroke-linecap="round"/>`;

  /* Versão reduzida: some com os louros e com o livro, que viram sujeira
     abaixo de uns 56px. O escudo, o capelo e o J aguentam bem menor. */
  const escudoSimples = `
    <path d="M100 14 L176 40 V126 C176 172 143 205 100 221
             C57 205 24 172 24 126 V40 Z"
          fill="${CLARO}" stroke="${OURO}" stroke-width="9" stroke-linejoin="round"/>
    <path d="M100 28 L164 50 V126 C164 164 136 193 100 207
             C64 193 36 164 36 126 V50 Z"
          fill="${CLARO}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="74" y="104" width="28" height="52" fill="${OURO}"/>
    <rect x="68" y="96"  width="40" height="10" rx="2" fill="${OURO}"/>
    <rect x="66" y="156" width="44" height="11" rx="2" fill="${OURO}"/>
    <path d="M88 68 L126 84 L88 100 L50 84 Z" fill="${NAVY}"/>
    <path d="M126 98 v54 a21 21 0 0 1 -42 0" fill="none"
          stroke="${NAVY}" stroke-width="14" stroke-linecap="round"/>
    <path d="M107 98 h22" fill="none"
          stroke="${NAVY}" stroke-width="14" stroke-linecap="round"/>`;

  /** O brasão completo, com louros. Use de 56px para cima.
      O campo de desenho é mais largo que o escudo de propósito: o louro
      precisa sobrar para fora, senão fica escondido atrás dele. */
  function brasao(altura) {
    return `<svg class="brasao" viewBox="-18 0 236 236" height="${altura}"
                 role="img" aria-label="Instituto Januário">
      <g transform="translate(-14,0)">${ramo}</g>
      <g transform="translate(214,0) scale(-1,1)">${ramo}</g>
      ${escudo}
    </svg>`;
  }

  /** Só o escudo, sem louros. Para cabeçalho e tamanhos pequenos. */
  function selo(altura) {
    return `<svg class="brasao" viewBox="0 0 200 236" height="${altura}"
                 role="img" aria-label="Instituto Januário">
      ${escudoSimples}
    </svg>`;
  }

  /** A marca da Kollarez, mantenedora. Aparece só no rodapé.
      A haste do K usa currentColor para não sumir em fundo escuro. */
  function kollarez(altura) {
    return `<svg viewBox="0 0 90 64" height="${altura}" role="img"
                 aria-label="Kollarez Soluções e Comércio">
      <path d="M6 6 h16 v52 H6 z" fill="currentColor"/>
      <path d="M26 32 L52 6 h20 L46 32 z" fill="#1C77C4"/>
      <path d="M26 32 L52 58 h20 L46 32 z" fill="#3CA35C"/>
      <path d="M46 32 L70 8 h13 L59 32 z" fill="${OURO}"/>
    </svg>`;
  }


  /* ------------------------------------------------------------------
     ILUSTRAÇÕES DOS CURSOS
     Cada curso ganha uma cena própria, não um ícone genérico. São
     desenhadas na mesma gramática: campo arredondado azul-marinho,
     traço claro de 2,6px e um detalhe dourado que puxa o olho.
     ------------------------------------------------------------------ */

  const cena = (corpo) =>
    `<svg class="ilustra" viewBox="0 0 96 96" aria-hidden="true" focusable="false">
       <rect width="96" height="96" rx="22" fill="${NAVY}"/>
       <g fill="none" stroke="${CLARO}" stroke-width="2.6"
          stroke-linecap="round" stroke-linejoin="round">${corpo}</g>
     </svg>`;

  const ILUSTRACOES = {

    /* Informática — monitor com cursor piscando e teclado. */
    informatica: cena(`
      <rect x="20" y="24" width="56" height="38" rx="4"/>
      <path d="M38 70h20M48 62v8"/>
      <rect x="26" y="72" width="44" height="6" rx="2"/>
      <path d="M28 36h10M28 44h16" stroke="${OURO2}"/>
      <path d="M52 44h14" opacity=".55"/>
      <rect x="28" y="50" width="7" height="3" rx="1.5" fill="${OURO}" stroke="none"/>
    `),

    /* Inglês — globo com meridianos e um balão de fala. */
    ingles: cena(`
      <circle cx="42" cy="46" r="22"/>
      <path d="M20 46h44M42 24c11 12 11 32 0 44c-11-12-11-32 0-44z"/>
      <path d="M60 22h18a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-7l-6 6v-6h-1"
            stroke="${OURO2}" fill="${NAVY}"/>
      <path d="M67 30h8M67 35h5" stroke="${OURO}"/>
    `),

    /* Inglês infantil — o mesmo globo, com um pião de brincar e estrelas. */
    "ingles-infantil": cena(`
      <circle cx="40" cy="44" r="20"/>
      <path d="M20 44h40M40 24c10 11 10 29 0 40c-10-11-10-29 0-40z"/>
      <path d="M68 26l3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1z"
            fill="${OURO}" stroke="${OURO}" stroke-width="1.6"/>
      <path d="M30 74h36" stroke="${OURO2}"/>
      <path d="M40 68v6M52 70v4" opacity=".6"/>
    `),

    /* Libras — duas mãos, uma sinalizando. */
    libras: cena(`
      <path d="M34 54V32a5 5 0 0 1 10 0v18"/>
      <path d="M44 50V28a5 5 0 0 1 10 0v22"/>
      <path d="M54 50V34a5 5 0 0 1 10 0v22a20 20 0 0 1-20 20h-2a18 18 0 0 1-18-18V44a5 5 0 0 1 10 0"/>
      <path d="M22 26l-6-4M26 18l-3-6" stroke="${OURO}"/>
      <path d="M74 30l6-4" stroke="${OURO}"/>
    `),

    /* Assistente Administrativo — prancheta com gráfico e moeda. */
    administrativo: cena(`
      <rect x="22" y="20" width="42" height="56" rx="4"/>
      <path d="M36 20v-4h14v4"/>
      <path d="M32 40h10M32 50h18M32 60h12" stroke="${OURO2}"/>
      <circle cx="68" cy="60" r="14" fill="${NAVY}" stroke="${OURO}"/>
      <path d="M68 53v14M64.5 57h6a3 3 0 0 1 0 6h-5a3 3 0 0 0 0 6h6"
            stroke="${OURO}" stroke-width="2.2"/>
    `),

    /* Monitor Escolar — figura adulta ao lado de duas crianças. */
    monitor: cena(`
      <circle cx="34" cy="30" r="9"/>
      <path d="M20 62a14 14 0 0 1 28 0"/>
      <circle cx="62" cy="40" r="7" stroke="${OURO2}"/>
      <path d="M51 64a11 11 0 0 1 22 0" stroke="${OURO2}"/>
      <path d="M20 74h56" stroke="${OURO}"/>
      <path d="M34 62v12M62 64v10" opacity=".5"/>
    `),

    /* Genérico — usado se um curso novo entrar sem ilustração própria. */
    generico: cena(`
      <path d="M18 36 48 22l30 14-30 14z"/>
      <path d="M30 43v18c0 5 8 9 18 9s18-4 18-9V43"/>
      <path d="M78 36v18" stroke="${OURO}"/>
      <circle cx="78" cy="58" r="3.4" fill="${OURO}" stroke="none"/>
    `)
  };

  /** Devolve a ilustração do curso; cai no genérico se não houver uma. */
  function ilustracao(id) {
    return ILUSTRACOES[id] || ILUSTRACOES.generico;
  }


  /* ------------------------------------------------------------------
     ÍCONES DE INTERFACE
     Traço de 2px com ponta arredondada, herdando a cor do texto ao redor.
     ------------------------------------------------------------------ */

  const traco = (corpo, largura) =>
    `<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
          fill="none" stroke="currentColor" stroke-width="${largura || 2}"
          stroke-linecap="round" stroke-linejoin="round">${corpo}</svg>`;

  const ICONES = {
    check:      traco(`<path d="M4 12.5l5 5L20 6.5"/>`, 2.6),
    checkRedondo: traco(`<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16 9.7"/>`),
    relogio:    traco(`<circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.4 2"/>`),
    calendario: traco(`<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`),
    dinheiro:   traco(`<path d="M12 4v16M8.5 8h5.5a3 3 0 0 1 0 6h-4a3 3 0 0 0 0 6h6"/>`),
    local:      traco(`<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>`),
    pessoa:     traco(`<circle cx="12" cy="8" r="3.8"/><path d="M5 20a7 7 0 0 1 14 0"/>`),
    escudo:     traco(`<path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6l7-3z"/><path d="M9 12.2l2.2 2.2L15.5 10"/>`),
    seta:       traco(`<path d="M5 12h13M12.5 6l6 6-6 6"/>`, 2.4),
    voltar:     traco(`<path d="M19 12H6M11.5 6l-6 6 6 6"/>`, 2.4),
    lapis:      traco(`<path d="M15.5 4.5l4 4L8 20H4v-4z"/>`),
    vagas:      traco(`<circle cx="9" cy="8" r="3.4"/><path d="M3 19a6 6 0 0 1 12 0"/><path d="M16 5.2a3.4 3.4 0 0 1 0 6.6"/><path d="M17.5 14.4A6 6 0 0 1 21 19"/>`),
    zap:        `<svg class="icone" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.22-.17-.47-.29z"/></svg>`
  };

  function icone(nome) {
    return ICONES[nome] || "";
  }


  /* ------------------------------------------------------------------
     RETRATO DA EQUIPE
     Enquanto a foto real não estiver na pasta, entra um monograma com
     as iniciais sobre o azul da marca — bem melhor que uma silhueta
     cinza de banco de imagem.
     ------------------------------------------------------------------ */

  function iniciais(nome) {
    const partes = String(nome || "").trim().split(/\s+/);
    if (!partes[0]) return "IJ";
    const primeira = partes[0][0];
    const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
    return (primeira + ultima).toUpperCase();
  }

  function retrato(pessoa) {
    const mono = `<span class="retrato-monograma" aria-hidden="true">${iniciais(pessoa && pessoa.nome)}</span>`;
    if (!pessoa || !pessoa.foto) return mono;

    // O monograma fica embaixo e a foto por cima. Se o arquivo não existir
    // ainda, a foto se apaga sozinha e sobra o monograma — nunca um
    // quadrado quebrado na frente do cliente.
    return mono +
      `<img class="retrato-img" src="${pessoa.foto}" alt="" loading="lazy"
            decoding="async" onerror="this.remove()">`;
  }


  return { brasao, selo, kollarez, ilustracao, icone, retrato, iniciais, NAVY, OURO };
})();
