/* Cardápio em folha de papel: índice fixo à esquerda e categorias em rolagem contínua. */
(function () {
  const sheet = document.getElementById("menuSheet");
  const menu = window.MENU || [];
  if (!sheet || !menu.length) return;

  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const WA = "https://api.whatsapp.com/send?phone=551333266817&text=";
  const OFFSET = 110; // altura do cabeçalho fixo
  const waIcon = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.2-1.4A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7 3.9zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1.1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>`;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const num = (i) => String(i + 1).padStart(2, "0");

  function priceHtml(d) {
    if (d.price == null) return `<span class="mdish__price">consulte</span>`;
    return `<span class="mdish__price">${d.from ? "<small>a partir de</small> " : ""}${brl.format(d.price)}</span>`;
  }

  function dishHtml(d, i) {
    const href = WA + encodeURIComponent("Olá! Gostaria de pedir: " + d.name);
    return `<li class="mdish" style="--i:${i}">
      <div class="mdish__row">
        <h4 class="mdish__name">${escapeHtml(d.name)}</h4>
        <span class="mdish__dots" aria-hidden="true"></span>
        ${priceHtml(d)}
      </div>
      ${d.desc ? `<p class="mdish__desc">${escapeHtml(d.desc)}</p>` : ""}
      <div class="mdish__foot">
        ${d.tag ? `<span class="mdish__tag">${escapeHtml(d.tag)}</span>` : ""}
        <a class="mdish__order" href="${escapeHtml(href)}" target="_blank" rel="noopener" aria-label="Pedir ${escapeHtml(d.name)} pelo WhatsApp">${waIcon}<span>Pedir este</span></a>
      </div>
    </li>`;
  }

  sheet.innerHTML = `
    <header class="msheet__head">
      <p class="msheet__brand">Monte Carlo</p>
      <h3 class="msheet__title">Cardápio</h3>
      <p class="msheet__since"><span>desde 1989</span></p>
    </header>
    <div class="msheet__body">
      <nav class="msheet__index" aria-label="Categorias do cardápio">
        <ol>${menu.map((c, i) => `<li><a href="#mcat-${escapeHtml(c.id)}" data-id="${escapeHtml(c.id)}"><span class="msheet__num">${num(i)}</span>${escapeHtml(c.label)}</a></li>`).join("")}</ol>
      </nav>
      <div class="msheet__list">
        ${menu.map((c, i) => `<section class="mcat" id="mcat-${escapeHtml(c.id)}" aria-labelledby="mcat-${escapeHtml(c.id)}-t">
          <h3 class="mcat__title" id="mcat-${escapeHtml(c.id)}-t">${escapeHtml(c.label)}</h3>
          <ul class="mcat__items">${c.items.map(dishHtml).join("")}</ul>
        </section>`).join("")}
      </div>
    </div>`;

  const links = [...sheet.querySelectorAll(".msheet__index a")];
  const cats = [...sheet.querySelectorAll(".mcat")];
  const indexEl = sheet.querySelector(".msheet__index");

  function setActive(id) {
    links.forEach((a) => {
      const on = a.dataset.id === id;
      a.classList.toggle("is-active", on);
      if (on) {
        a.setAttribute("aria-current", "true");
        // No celular o índice é uma barra lateral: mantém a pílula ativa à vista
        if (indexEl.scrollWidth > indexEl.clientWidth) {
          indexEl.scrollTo({ left: a.offsetLeft - (indexEl.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
        }
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  indexEl.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const target = document.getElementById("mcat-" + a.dataset.id);
    if (!target) return;
    e.preventDefault();
    // No celular a barra de pílulas também fica fixa: desconta a altura dela
    const mobile = window.matchMedia("(max-width: 820px)").matches;
    const offset = mobile ? 64 + indexEl.offsetHeight + 12 : OFFSET;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActive(a.dataset.id);
  });

  setActive(menu[0].id);

  if (!("IntersectionObserver" in window)) {
    cats.forEach((c) => c.classList.add("is-in"));
    return;
  }

  // Destaca no índice a categoria que está na faixa central da tela
  const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) setActive(e.target.id.replace(/^mcat-/, ""));
  }), { rootMargin: "-35% 0px -60% 0px" });

  // Animação de entrada, uma vez por categoria
  const enter = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); enter.unobserve(e.target); }
  }), { threshold: 0, rootMargin: "0px 0px -15% 0px" });

  cats.forEach((c) => { spy.observe(c); enter.observe(c); });
})();
