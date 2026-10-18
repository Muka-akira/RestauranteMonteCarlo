/* Agenda musical: lê os próximos shows de uma planilha do Google publicada como CSV (ver LEIA-ME.md). */
(function () {
  const SHEET_CSV_URL = ""; // link CSV da planilha (Arquivo → Compartilhar → Publicar na Web → CSV)
  const MAX_SHOWS = 6;

  const list = document.getElementById("agendaList");
  if (!list) return;

  const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const DAY = 86400000;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

  // CSV com campos entre aspas, aspas duplicadas ("") e quebras \n ou \r\n
  function parseCsv(text) {
    const rows = [];
    let row = [], field = "", quoted = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (quoted) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
        } else field += c;
      } else if (c === '"') quoted = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += c;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // "Hoje" à meia-noite no horário de Brasília, como data UTC (só dia/mês/ano importam)
  function todayBrasilia() {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit" })
      .formatToParts(new Date());
    const get = (t) => Number(parts.find((p) => p.type === t).value);
    return Date.UTC(get("year"), get("month") - 1, get("day"));
  }

  // dd/mm/aaaa, dd/mm/aa ou dd/mm (ano atual)
  function parseDate(s, today) {
    const m = String(s).trim().match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2}|\d{4}))?$/);
    if (!m) return null;
    const d = +m[1], mo = +m[2];
    let y = m[3] ? +m[3] : new Date(today).getUTCFullYear();
    if (m[3] && m[3].length === 2) y += 2000;
    const t = Date.UTC(y, mo - 1, d);
    const check = new Date(t);
    if (check.getUTCDate() !== d || check.getUTCMonth() !== mo - 1) return null;
    return t;
  }

  // "20h", "20:30", "20h30" → "20h" / "20h30"
  function formatTime(s) {
    const m = String(s).trim().match(/^(\d{1,2})\s*(?:h|:)\s*(\d{2})?\s*h?$/i);
    if (!m) return String(s).trim();
    return `${+m[1]}h${m[2] && m[2] !== "00" ? m[2] : ""}`;
  }

  function showsFromCsv(text, today) {
    const rows = parseCsv(text);
    if (!rows.length) return [];
    const head = rows[0].map(norm);
    const col = (name) => head.indexOf(name);
    const iData = col("data"), iHora = col("hora"), iBanda = col("banda"), iEstilo = col("estilo");
    if (iData < 0 || iBanda < 0) return [];
    const cell = (r, i) => (i >= 0 && r[i] != null ? r[i].trim() : "");
    return rows.slice(1).map((r) => ({
      date: parseDate(cell(r, iData), today),
      time: cell(r, iHora),
      band: cell(r, iBanda),
      style: cell(r, iEstilo),
    })).filter((s) => s.date != null && s.band);
  }

  function sampleShows(today) {
    return [
      { date: today, time: "20h", band: "Trio Maresia", style: "MPB" },
      { date: today + DAY, time: "20h30", band: "Banda Pé na Areia", style: "Pop rock" },
      { date: today + 2 * DAY, time: "19h", band: "Duo Enseada", style: "Bossa nova" },
      { date: today + 5 * DAY, time: "21h", band: "Samba do Monte", style: "Samba" },
    ];
  }

  function gigHtml(s, i, today) {
    const d = new Date(s.date);
    const diff = Math.round((s.date - today) / DAY);
    const badge = diff === 0 ? "Hoje" : diff === 1 ? "Amanhã" : "";
    const meta = [s.style, s.time && formatTime(s.time)].filter(Boolean).map(escapeHtml).join(" · ");
    return `<li class="gig${diff === 0 ? " gig--today" : ""}" style="--i:${i}">
      <p class="gig__date">
        <span class="gig__wd">${WEEKDAYS[d.getUTCDay()]}</span>
        <span class="gig__day">${d.getUTCDate()}</span>
        <span class="gig__mon">${MONTHS[d.getUTCMonth()]}</span>
      </p>
      <div class="gig__info">
        <p class="gig__band">${escapeHtml(s.band)}</p>
        ${meta ? `<p class="gig__meta">${meta}</p>` : ""}
      </div>
      ${badge ? `<span class="gig__badge">${badge}</span>` : ""}
    </li>`;
  }

  function message(text) {
    list.innerHTML = `<li class="gig gig--empty">${text}</li>`;
  }

  function render(shows, today) {
    const next = shows.filter((s) => s.date >= today).sort((a, b) => a.date - b.date).slice(0, MAX_SHOWS);
    if (!next.length) return message("A programação desta semana sai em breve no nosso Instagram.");
    list.innerHTML = next.map((s, i) => gigHtml(s, i, today)).join("");
  }

  const today = todayBrasilia();
  if (!SHEET_CSV_URL) { render(sampleShows(today), today); return; }

  fetch(SHEET_CSV_URL, { cache: "no-store" })
    .then((r) => { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); })
    .then((text) => render(showsFromCsv(text, today), today))
    .catch(() => message("Veja a programação da semana no nosso Instagram."));
})();
