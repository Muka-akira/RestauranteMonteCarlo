/* Avaliações do Google.
   A página chama /api/reviews (função serverless em netlify/functions/reviews.js),
   que consulta a Places API (New) com a chave guardada no servidor.
   Se a função não responder (por exemplo, abrindo o arquivo direto no computador),
   aparecem cartões de exemplo marcados como tal, só para visualizar o layout. */
(function () {
  const ENDPOINT = "/api/reviews";
  const track = document.getElementById("reviewsTrack");
  const score = document.getElementById("score");
  if (!track) return;

  const esc = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const stars = (n) => "★★★★★".slice(0, Math.round(n || 0)) + "☆☆☆☆☆".slice(0, 5 - Math.round(n || 0));
  const fmt = (n) => Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  function card(r) {
    const initial = esc((r.author || "?").trim().charAt(0).toUpperCase());
    const avatar = r.photo
      ? `<img class="review__avatar" src="${esc(r.photo)}" alt="" width="40" height="40" loading="lazy" referrerpolicy="no-referrer">`
      : `<span class="review__avatar" aria-hidden="true">${initial}</span>`;
    const name = r.authorUri
      ? `<a href="${esc(r.authorUri)}" target="_blank" rel="noopener">${esc(r.author)}</a>`
      : esc(r.author);
    return `<article class="review">
      <div class="review__head">${avatar}
        <div class="review__who"><p class="review__name">${name}</p><p class="review__time">${esc(r.time)}</p></div>
      </div>
      <span class="review__stars" aria-label="${r.rating} de 5 estrelas">${stars(r.rating)}</span>
      <p class="review__text">${esc(r.text)}</p>
      <span class="review__link">Publicado no Google</span>
    </article>`;
  }

  function renderExamples() {
    const ex = `<article class="review review--example">
      <span class="review__badge">Exemplo de layout</span>
      <div class="review__head"><span class="review__avatar" aria-hidden="true">G</span>
        <div class="review__who"><p class="review__name">Nome do cliente</p><p class="review__time">há 2 semanas</p></div>
      </div>
      <span class="review__stars" aria-hidden="true">★★★★★</span>
      <p class="review__text">Aqui entra o texto da avaliação, puxado automaticamente do Google quando o site estiver publicado com a chave da API.</p>
    </article>`;
    track.innerHTML = ex.repeat(3);
  }

  function render(data) {
    if (!data || !Array.isArray(data.reviews) || !data.reviews.length) return renderExamples();
    track.innerHTML = data.reviews.map(card).join("");
    if (data.rating) {
      document.getElementById("scoreNum").textContent = fmt(data.rating);
      document.getElementById("scoreStars").textContent = stars(data.rating);
      document.getElementById("scoreTotal").textContent = data.total ? `${data.total.toLocaleString("pt-BR")} avaliações no Google` : "no Google";
      score.hidden = false;
      const fr = document.getElementById("factRating");
      const fl = document.getElementById("factRatingLabel");
      if (fr) fr.textContent = `★ ${fmt(data.rating)}`;
      if (fl && data.total) fl.textContent = `${data.total.toLocaleString("pt-BR")} avaliações no Google`;
    }
    if (data.mapsUri) {
      const all = document.getElementById("reviewsAll");
      if (all) all.href = data.mapsUri;
    }
  }

  renderExamples();
  fetch(ENDPOINT, { headers: { Accept: "application/json" } })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(render)
    .catch(() => { /* mantém os exemplos */ });
})();
