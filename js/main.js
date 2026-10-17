/* Menu do celular, abas do cardápio e detalhes gerais. */
(function () {
  // Menu hambúrguer
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  }

  // Cardápio em abas
  const tabsEl = document.getElementById("menuTabs");
  const panel = document.getElementById("menuPanel");
  const menu = window.MENU || [];
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderCategory(id) {
    const cat = menu.find((c) => c.id === id) || menu[0];
    if (!cat) return;
    panel.innerHTML = cat.items.map((d, i) => {
      const price = d.price == null
        ? `<span class="dish__price">consulte</span>`
        : `<span class="dish__price">${d.from ? "<small>a partir de</small>" : ""}${brl.format(d.price)}</span>`;
      return `<article class="dish" style="--i:${i};animation-delay:${i * 40}ms">
        <div class="dish__row">
          <h3 class="dish__name">${escapeHtml(d.name)}</h3>
          <span class="dish__dots" aria-hidden="true"></span>
          ${price}
        </div>
        ${d.desc ? `<p class="dish__desc">${escapeHtml(d.desc)}</p>` : ""}
        ${d.tag ? `<span class="dish__tag">${escapeHtml(d.tag)}</span>` : ""}
      </article>`;
    }).join("");
    panel.setAttribute("aria-labelledby", "tab-" + cat.id);
    tabsEl.querySelectorAll(".tab").forEach((t) => {
      const on = t.dataset.id === cat.id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
  }

  if (tabsEl && panel && menu.length) {
    tabsEl.innerHTML = menu.map((c) =>
      `<button class="tab" role="tab" id="tab-${c.id}" data-id="${c.id}" aria-controls="menuPanel">${escapeHtml(c.label)}</button>`
    ).join("");
    tabsEl.addEventListener("click", (e) => {
      const b = e.target.closest(".tab");
      if (b) renderCategory(b.dataset.id);
    });
    tabsEl.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const tabs = [...tabsEl.querySelectorAll(".tab")];
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const next = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      next.focus(); renderCategory(next.dataset.id);
    });
    renderCategory(menu[0].id);
  }

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
