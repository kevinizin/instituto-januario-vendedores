/* Silhuetas usadas quando o vendedor ainda não tem foto real.
   SVG embutido: não baixa nada da internet e funciona offline. */

const AVATARES = (() => {
  const svg = (corpo) =>
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
         <circle cx="60" cy="60" r="60" fill="#dbe2f0"/>
         <g fill="#8c9ab8">${corpo}</g>
       </svg>`
    );

  return {
    m: svg(`<circle cx="60" cy="45" r="21"/>
            <path d="M60 71c-19 0-34 12-37 28a3 3 0 0 0 3 3h68a3 3 0 0 0 3-3c-3-16-18-28-37-28z"/>`),

    f: svg(`<path d="M60 24c-13 0-22 9-22 22 0 6 2 11 5 15-4 2-6 5-6 8h46c0-3-2-6-6-8 3-4 5-9 5-15 0-13-9-22-22-22z"/>
            <path d="M60 71c-19 0-34 12-37 28a3 3 0 0 0 3 3h68a3 3 0 0 0 3-3c-3-16-18-28-37-28z"/>`)
  };
})();

function avatarDe(vendedor) {
  return vendedor.foto || AVATARES[vendedor.genero] || AVATARES.m;
}
