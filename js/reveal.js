// Animações de entrada ao rolar a página. Cada seção ganha a classe "is-in" ao aparecer na tela (uma vez só).
// Respeita "reduzir movimento" do sistema. Para forçar as animações mesmo assim: localStorage.setItem("mc-motion", "on")
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches && localStorage.getItem("mc-motion") !== "on";
  if (reduce || !("IntersectionObserver" in window)) return;

  // Endereço "escrito" letra por letra
  const addr = document.querySelector(".visit .h2");
  if (addr) {
    const t = addr.textContent;
    addr.setAttribute("aria-label", t);
    addr.innerHTML = [...t].map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c}</span>`).join("");
  }

  document.documentElement.classList.add("reveal");
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: 0, rootMargin: "0px 0px -18% 0px" });
  document.querySelectorAll("main > section:not(.hero):not(.menu)").forEach((s) => io.observe(s));
  // Cardápio: só começa quando a lista de pratos já está bem dentro da tela
  const menu = document.querySelector(".menu"), panel = document.querySelector(".menu__panel");
  if (menu && panel) {
    const io2 = new IntersectionObserver(([e]) => { if (e.isIntersecting) { menu.classList.add("is-in"); io2.disconnect(); } }, { threshold: 0, rootMargin: "0px 0px -35% 0px" });
    io2.observe(panel);
  }
})();
