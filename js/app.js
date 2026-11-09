// =====================================================================
//  IL GIARDINO DELLA DIETA — logica dell'app
// =====================================================================
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseYmd(s); d.setDate(d.getDate() + n); return ymd(d); };
const todayStr = () => ymd(new Date());
const fmtLong = s => parseYmd(s).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
const fmtShort = s => parseYmd(s).toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" });
const num = v => { const n = parseFloat(String(v ?? "").replace(",", ".")); return isNaN(n) ? 0 : Math.round(n); };
const isValidDate = s => /^\d{4}-\d{2}-\d{2}$/.test(s || "");

// ---------------------------------------------------------------------
//  Icone (tratto sottile, stile "linea")
// ---------------------------------------------------------------------
const ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  notebook: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="M9 7h7M9 11h5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  left: '<path d="m15 18-6-6 6-6"/>',
  right: '<path d="m9 18 6-6-6-6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  login: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  drop: '<path d="M12 2.7s-6 6.3-6 11.3a6 6 0 0 0 12 0c0-5-6-11.3-6-11.3z"/>',
  star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  device: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  users: '<path d="M8 2h8M9 2v6l-4 8a3 3 0 0 0 2.7 4.3h8.6A3 3 0 0 0 19 16l-4-8V2"/>',
  bowl: '<path d="M3 11h18a9 9 0 0 1-18 0Z"/><path d="M7 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M17 7c0-1.5 1-2 1-3.5"/>',
};
const icon = (n, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;

// ---------------------------------------------------------------------
//  Scale del diario
// ---------------------------------------------------------------------
const SCALE_COLORS = ["#b5654a", "#d39a5c", "#cdb46a", "#94b083", "#5f8f68"];
const SCALES = {
  mood:   { label: "Umore", values: ["Giù di morale", "Così così", "Normale", "Bene", "Benissimo"] },
  energy: { label: "Energia", values: ["Stanchissimo", "Stanco", "Normale", "Carico", "Pieno di energia"] },
  belly:  { label: "Pancia", values: ["Dolori / molto gonfio", "Fastidi", "Un po' gonfio", "Quasi bene", "Serena"] },
};

const RECIPE_COLORS = {
  colazione: "#d9b36a", primo: "#c98b5e", secondo: "#8fa57d", "piatto unico": "#6f9a86",
  zuppa: "#d39a5c", "pranzo al sacco": "#8aa6b8", spuntino: "#c7a2a0", dolce: "#c7a2a0", contorno: "#9bb28a",
};
const recipeColor = c => RECIPE_COLORS[(c || "").toLowerCase()] || "#a9b49e";

const NAV = [
  { id: "oggi", label: "Oggi", icon: "sun" },
  { id: "calendario", label: "Calendario", icon: "calendar" },
  { id: "piano", label: "Piano", icon: "book" },
  { id: "ricette", label: "Ricette", icon: "utensils" },
  { id: "cibi", label: "Cibi", icon: "leaf", secondary: true, desc: "Ingredienti da ricordare e provare" },
  { id: "diario", label: "Diario", icon: "notebook", secondary: true, desc: "Le note di fine giornata" },
  { id: "profilo", label: "Profilo", icon: "user", secondary: true, desc: "Dati, obiettivi, account e backup" },
];

// ---------------------------------------------------------------------
//  Helper dati
// ---------------------------------------------------------------------
const getProfile = () => ({ ...DEFAULT_PROFILE, ...(Store.list("profile")[0] || {}) });
const targets = () => computeTargets(getProfile());
const mealsOn = date => Store.list("meal").filter(m => m.date === date)
  .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
const noteOn = date => Store.list("note").find(n => n.date === date);
const allRecipes = () => [...Store.list("recipe").sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)), ...BUILTIN_RECIPES];
const findRecipe = id => allRecipes().find(r => r.id === id);
const totals = meals => meals.reduce((t, m) => ({
  kcal: t.kcal + (m.kcal || 0), p: t.p + (m.p || 0), c: t.c + (m.c || 0), f: t.f + (m.f || 0),
}), { kcal: 0, p: 0, c: 0, f: 0 });
const findOption = title => {
  for (const s of Object.keys(MEAL_OPTIONS)) {
    const o = MEAL_OPTIONS[s].find(x => x.title === title);
    if (o) return o;
  }
};
const slotKcal = (t, s) => Math.round(t.kcal * s.share / 10) * 10;
const slotForNow = () => {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  return h < 10.5 ? "colazione" : h < 12 ? "spuntino" : h < 15 ? "pranzo" : h < 18.5 ? "merenda" : "cena";
};
const macroPills = m => (m.kcal || m.p || m.c || m.f) ? `<div class="pills">
  <span class="pill k">${m.kcal || 0} kcal</span><span class="pill p">P ${m.p || 0} g</span><span class="pill c">C ${m.c || 0} g</span><span class="pill f">G ${m.f || 0} g</span></div>` : "";

// ---------------------------------------------------------------------
//  UI helpers
// ---------------------------------------------------------------------
let toastTimer;
function toast(msg, err = false) {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast show" + (err ? " err" : "");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.className = "toast"), 2600);
}
function openModal(html) {
  $("#modal-body").innerHTML = html;
  $("#modal").classList.remove("hidden");
  $(".modal-card").scrollTop = 0;
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $("#modal").classList.add("hidden");
  document.body.style.overflow = "";
}
async function safe(fn, okMsg) {
  try {
    await fn();
    if (okMsg) toast(okMsg);
    return true;
  } catch (e) {
    console.error(e);
    toast("Qualcosa è andato storto: " + (e.message || e), true);
    return false;
  }
}
const emptyState = (msg, ic = "leaf") => `<div class="empty">${icon(ic)}<p>${msg}</p></div>`;

// ---------------------------------------------------------------------
//  Componenti
// ---------------------------------------------------------------------
function ring(eaten, planned, target) {
  const R = 56, C = 2 * Math.PI * R;
  const pe = Math.min(1, eaten / target), pp = Math.min(1, planned / target);
  return `
  <div class="ring">
    <svg width="132" height="132" viewBox="0 0 132 132">
      <circle cx="66" cy="66" r="${R}" fill="none" stroke="#efe9dc" stroke-width="9"/>
      <circle cx="66" cy="66" r="${R}" fill="none" stroke="#cdd4e6" stroke-width="9" stroke-linecap="round"
        stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pp)}"/>
      <circle cx="66" cy="66" r="${R}" fill="none" stroke="#7d9b7f" stroke-width="9" stroke-linecap="round"
        stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pe)}" style="transition:stroke-dashoffset .6s"/>
    </svg>
    <div class="ring-text"><b>${eaten}</b><span>di ${target} kcal</span></div>
  </div>`;
}
function bar(label, val, plan, target, color) {
  const w = Math.min(100, (val / target) * 100);
  const wp = Math.max(0, Math.min(100, (plan / target) * 100) - w);
  return `
  <div class="bar">
    <div class="bar-label"><span>${label}</span><span>${val} / ${target} g</span></div>
    <div class="bar-track">
      <div class="bar-fill" style="width:${w}%;background:${color}"></div>
      <div class="bar-plan" style="left:${w}%;width:${wp}%;background:${color}"></div>
    </div>
  </div>`;
}
function macroSummary(e, all, t) {
  return `
  <div class="summary">
    ${ring(e.kcal, all.kcal, t.kcal)}
    <div class="bars">
      ${bar("Proteine", e.p, all.p, t.protein, "#b86f4c")}
      ${bar("Carboidrati", e.c, all.c, t.carbs, "#c49a45")}
      ${bar("Grassi", e.f, all.f, t.fat, "#7d9b7f")}
    </div>
  </div>
  <div class="legend-line">
    <span><i style="background:#7d9b7f"></i>Mangiato</span>
    <span><i style="background:#cdd4e6"></i>Pianificato · ${all.kcal} kcal in totale</span>
  </div>`;
}

function mealRow(m) {
  const eaten = m.status === "eaten";
  return `
  <div class="meal ${eaten ? "eaten" : "planned"}">
    <button class="check" aria-label="${eaten ? "Segna come da fare" : "Segna come mangiato"}" onclick="App.toggleMeal('${m.id}')">${eaten ? icon("check") : ""}</button>
    <div class="meal-body" onclick="App.editMeal('${m.id}')">
      <div class="meal-title">${esc(m.title)}</div>
      ${m.desc ? `<div class="meal-desc">${esc(m.desc)}</div>` : ""}
      <div class="pills">${m.kcal ? `<span class="pill k">${m.kcal} kcal</span>` : ""}${m.p ? `<span class="pill p">P ${m.p} g</span>` : ""}${eaten ? "" : `<span class="pill planned">Pianificato</span>`}</div>
    </div>
    <div class="meal-actions">
      <button class="btn icon small" aria-label="Copia in un altro giorno" title="Copia in un altro giorno" onclick="App.dupMeal('${m.id}')">${icon("copy")}</button>
      <button class="btn icon small" aria-label="Elimina" title="Elimina" onclick="App.delMeal('${m.id}')">${icon("trash")}</button>
    </div>
  </div>`;
}

function slotBlock(s, meals, date, t) {
  return `
  <div class="slot">
    <div class="slot-head">
      <div><span class="slot-name">${s.label}</span><span class="slot-kcal">~${slotKcal(t, s)} kcal</span></div>
      <button class="btn small ghost" onclick="App.addMeal('${date}','${s.id}')">${icon("plus")} Aggiungi</button>
    </div>
    ${meals.length ? meals.map(mealRow).join("") : `<div class="slot-empty">Nessun pasto</div>`}
  </div>`;
}

function scaleField(key, val) {
  const sc = SCALES[key];
  return `
  <div class="scale-field">
    <div class="scale-head"><span>${sc.label}</span><span class="scale-value" id="sv-${key}">${val ? sc.values[val - 1] : "—"}</span></div>
    <div class="scale">
      ${sc.values.map((v, i) => `<button type="button" style="--c:${SCALE_COLORS[i]}" class="${val === i + 1 ? "on" : ""}" aria-label="${v}" title="${v}"
        onclick="App.noteSet('${key}',${i + 1},this)"></button>`).join("")}
    </div>
  </div>`;
}
function noteEditor(date) {
  const n = noteOn(date) || { date, mood: 0, energy: 0, belly: 0, water: 0, text: "" };
  App.noteDraft = { ...n };
  const isToday = date === todayStr();
  return `
  <div class="card-head"><h3>${isToday ? "Com'è andata oggi?" : "Com'è andata?"}</h3></div>
  ${scaleField("mood", n.mood)}
  ${scaleField("energy", n.energy)}
  ${scaleField("belly", n.belly)}
  <div class="scale-field">
    <div class="scale-head"><span>Acqua</span><span class="scale-value" id="sv-water">${n.water || 0} bicchieri</span></div>
    <div class="water" id="water">
      ${Array.from({ length: 10 }, (_, i) => `<button type="button" aria-label="${i + 1} bicchieri" class="${i < (n.water || 0) ? "on" : ""}" onclick="App.waterSet(${i + 1})">${icon("drop")}</button>`).join("")}
    </div>
  </div>
  <label>Note
    <textarea id="note-text" placeholder="Come ti senti? Cosa hai notato dopo i pasti?">${esc(n.text)}</textarea>
  </label>
  <div class="row gap">
    <button class="btn primary" onclick="App.saveNote()">Salva nota</button>
    ${n.id ? `<button class="btn ghost small" onclick="App.delNote('${n.id}')">Elimina</button>` : ""}
  </div>`;
}

function dailyTip(date) {
  const all = [...TIPS.general, ...TIPS.ibs.map(x => ({ ...x, ibs: true }))];
  const idx = Math.floor(parseYmd(date).getTime() / 86400000) % all.length;
  const tip = all[idx];
  return `<span class="kicker">Il consiglio del giorno</span>
    <h3 style="margin:.3rem 0 .4rem">${tip.t}</h3><p class="muted" style="margin:0">${tip.d}</p>`;
}

// ---------------------------------------------------------------------
//  VISTE
// ---------------------------------------------------------------------
function viewDay(date) {
  const t = targets();
  const meals = mealsOn(date);
  const eaten = totals(meals.filter(m => m.status === "eaten"));
  const all = totals(meals);
  const isToday = date === todayStr();
  return `
  <div class="page-head">
    <a class="btn icon" href="#/giorno/${addDays(date, -1)}" aria-label="Giorno precedente">${icon("left")}</a>
    <div class="title center">
      <span class="kicker">${isToday ? "Oggi" : `<a href="#/oggi">Torna a oggi</a>`}</span>
      <h2>${fmtLong(date)}</h2>
    </div>
    <a class="btn icon" href="#/giorno/${addDays(date, 1)}" aria-label="Giorno successivo">${icon("right")}</a>
  </div>
  <div class="grid two">
    <div>
      <div class="card">${macroSummary(eaten, all, t)}</div>
      <div class="card">
        <div class="card-head">
          <h3>Pasti</h3>
          <button class="btn small accent" onclick="App.applySampleDay('${date}')">${icon("sparkle")} Giornata tipo</button>
        </div>
        ${SLOTS.map(s => slotBlock(s, meals.filter(m => m.slot === s.id), date, t)).join("")}
      </div>
    </div>
    <div>
      <div class="card" id="note-card">${noteEditor(date)}</div>
      <div class="card">${dailyTip(date)}</div>
    </div>
  </div>`;
}

// ---------- PIANO ----------
const COMPOSE = {
  colazione: ["1 carboidrato", "1 latte o yogurt", "1 frutta", "½–1 grasso"],
  spuntino: ["1 frutta + ½ grasso", "oppure 1 yogurt greco"],
  pranzo: ["1½–2 carboidrati", "1 proteina", "verdure libere", "1–1½ grassi"],
  merenda: ["Shaker proteico", "+ frutta o gallette"],
  cena: ["1–1½ carboidrati", "1 proteina", "verdure libere", "1 grasso"],
};

function viewPlan() {
  const t = targets(), p = getProfile();
  const tab = App.planTab || "obiettivi";
  const tabs = [["obiettivi", "Obiettivi"], ["pasti", "Componi i pasti"], ["scambi", "Scambi"], ["giornate", "Giornate tipo"], ["consigli", "Consigli"]];
  let body = "";

  if (tab === "obiettivi") {
    const diff = t.kcal - 2075;
    body = `
    <div class="card">
      <div class="card-head"><h3>Fabbisogno giornaliero</h3></div>
      <div class="stats">
        <div class="stat"><b>${t.kcal}</b><span>kcal</span></div>
        <div class="stat"><b>${t.protein} g</b><span><i class="swatch-dot" style="background:#b86f4c"></i>Proteine · ${Math.round(t.protein * 4 / t.kcal * 100)}%</span></div>
        <div class="stat"><b>${t.carbs} g</b><span><i class="swatch-dot" style="background:#c49a45"></i>Carboidrati · ${Math.round(t.carbs * 4 / t.kcal * 100)}%</span></div>
        <div class="stat"><b>${t.fat} g</b><span><i class="swatch-dot" style="background:#7d9b7f"></i>Grassi · 30%</span></div>
        <div class="stat"><b>~${t.fiber} g</b><span>Fibre, gradualmente</span></div>
        <div class="stat"><b>${t.water}+</b><span>Bicchieri d'acqua</span></div>
      </div>
      <p class="small muted" style="margin:1rem 0 0">Formula di Mifflin-St Jeor su ${p.height} cm, ${p.weight} kg, ${p.age} anni
        (metabolismo basale ≈ ${t.bmr} kcal) × attività ${p.activity}. BMI ${t.bmi}, normopeso.
        L'età è stimata: aggiornala nel <a href="#/profilo">Profilo</a> per un calcolo più preciso.</p>
    </div>
    <div class="card">
      <div class="card-head"><h3>Distribuzione nella giornata</h3></div>
      <div class="table-wrap"><table class="ex">
        <tr><th>Pasto</th><th class="num">kcal</th><th>Struttura</th></tr>
        ${SLOTS.map(s => `<tr><td><b>${s.label}</b></td><td class="num">${slotKcal(t, s)}</td><td class="small muted">${COMPOSE[s.id].join(" · ")}</td></tr>`).join("")}
      </table></div>
      ${Math.abs(diff) >= 150 ? `<div class="notice">Le porzioni del piano sono pensate per circa 2.075 kcal. Con il tuo obiettivo di ${t.kcal} kcal
        ${diff > 0 ? "aggiungi" : "togli"} circa <b>${Math.round(Math.abs(diff) / 200 * 2) / 2} porzioni di carboidrati</b> (o grassi) durante la giornata.</div>` : ""}
    </div>
    <div class="card">
      <span class="kicker">La filosofia del piano</span>
      <p class="quote" style="margin:.5rem 0 .8rem">Non un elenco di divieti, ma una cassetta degli attrezzi.</p>
      <p class="muted">Ogni pasto ha una struttura semplice — carboidrati, proteine, verdure e grassi buoni — e scegli tu <i>cosa</i> metterci,
      usando la tabella degli scambi.</p>
      <p class="muted" style="margin:0">Il piano tiene conto che sei vegetariano, mangi pochi legumi, hai il colon irritabile e prendi uno shaker proteico al giorno
      (ideale a merenda o dopo una camminata). Le proteine arrivano da uova, latticini senza lattosio, tofu, tempeh, seitan ed edamame.</p>
    </div>`;
  }

  if (tab === "pasti") {
    body = `<div class="grid two">` + SLOTS.filter(s => s.id !== "merenda").map(s => `
      <div class="card">
        <div class="card-head"><h3>${s.id === "spuntino" ? "Spuntino e merenda" : s.label}</h3>
          <span class="pill k">~${slotKcal(t, s)} kcal</span></div>
        <div class="compose">${COMPOSE[s.id].map(x => `<span>${x}</span>`).join("")}</div>
        ${MEAL_OPTIONS[s.id].map((o, i) => `
          <div class="option">
            <div class="grow"><b>${esc(o.title)}</b><p>${esc(o.desc)}</p>${macroPills(o)}</div>
            <button class="btn icon small" aria-label="Aggiungi al calendario" title="Aggiungi al calendario" onclick="App.addFromOption('${s.id}',${i})">${icon("plus")}</button>
          </div>`).join("")}
      </div>`).join("") + `</div>`;
  }

  if (tab === "scambi") {
    body = `<p class="muted">Ogni alimento vale più o meno come gli altri dello stesso gruppo: sostituiscili liberamente mantenendo l'equilibrio dei macronutrienti.</p>
      <div class="grid two">` + EXCHANGES.map(g => `
      <div class="card">
        <div class="group-head"><span class="swatch" style="background:${g.color}"></span><h3>${g.group}</h3></div>
        <p class="small muted">${g.note}</p>
        <div class="table-wrap"><table class="ex">
          <tr><th>Alimento</th><th>Quantità</th><th class="num">kcal</th><th class="num">P/C/G</th></tr>
          ${g.items.map(x => `<tr><td>${esc(x.food)}</td><td class="small muted">${esc(x.qty)}</td><td class="num">${x.kcal}</td><td class="num small muted">${x.p}/${x.c}/${x.f}</td></tr>`).join("")}
        </table></div>
      </div>`).join("") + `</div>`;
  }

  if (tab === "giornate") {
    body = `<div class="grid three">` + SAMPLE_DAYS.map((d, i) => {
      const opts = SLOTS.map(s => ({ s, o: findOption(d.meals[s.id]) }));
      const tot = totals(opts.map(x => x.o));
      return `
      <div class="card">
        <h3>${d.name}</h3>
        ${opts.map(({ s, o }) => `<div style="margin-bottom:.55rem"><span class="kicker">${s.label}</span><div class="small">${esc(o.title)}</div></div>`).join("")}
        <hr class="soft"/>
        ${macroPills(tot)}
        <button class="btn primary small" style="margin-top:.9rem;width:100%" onclick="App.pickDateForSample(${i})">${icon("calendar")} Pianifica</button>
      </div>`;
    }).join("") + `</div>`;
  }

  if (tab === "consigli") {
    body = `
    <div class="grid two">
      <div class="card"><div class="card-head"><h3>Consigli generali</h3></div>${TIPS.general.map(x => `<div class="tip"><b>${x.t}</b><p>${x.d}</p></div>`).join("")}</div>
      <div class="card"><div class="card-head"><h3>Colon irritabile</h3></div>${TIPS.ibs.map(x => `<div class="tip ibs"><b>${x.t}</b><p>${x.d}</p></div>`).join("")}</div>
    </div>`;
  }

  return `
  <div class="section-title"><div><span class="kicker">Piano alimentare</span><h2>Il tuo piano</h2></div></div>
  <div class="seg">${tabs.map(([k, l]) => `<button class="${k === tab ? "active" : ""}" onclick="App.setPlanTab('${k}')">${l}</button>`).join("")}</div>
  ${body}`;
}

// ---------- CALENDARIO ----------
function viewCalendar(ym) {
  if (!/^\d{4}-\d{2}$/.test(ym || "")) ym = todayStr().slice(0, 7);
  const [y, m] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const offset = (first.getDay() + 6) % 7;
  const daysIn = new Date(y, m, 0).getDate();
  const weeks = Math.ceil((offset + daysIn) / 7);
  const prev = ymd(new Date(y, m - 2, 1)).slice(0, 7);
  const next = ymd(new Date(y, m, 1)).slice(0, 7);
  const today = todayStr();

  const byDate = {};
  Store.list("meal").forEach(x => (byDate[x.date] = byDate[x.date] || []).push(x));

  let cells = "";
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(y, m - 1, 1 - offset + i);
    const ds = ymd(d);
    const meals = byDate[ds] || [];
    const kc = totals(meals.filter(x => x.status === "eaten")).kcal;
    const note = noteOn(ds);
    cells += `
    <a class="cal-day ${d.getMonth() !== m - 1 ? "other" : ""} ${ds === today ? "today" : ""}" href="#/giorno/${ds}">
      <span class="num">${d.getDate()}</span>
      ${note ? `<span class="mood-dot" style="background:${note.mood ? SCALE_COLORS[note.mood - 1] : "#c9c2b0"}"></span>` : ""}
      <div class="dots">${meals.slice(0, 6).map(x => `<i class="${x.status === "eaten" ? "dot-eaten" : "dot-planned"}"></i>`).join("")}</div>
      ${kc ? `<span class="kc">${kc} kcal</span>` : ""}
    </a>`;
  }

  const upcoming = Store.list("meal").filter(x => x.status === "planned" && x.date >= today && x.date <= addDays(today, 7))
    .sort((a, b) => a.date.localeCompare(b.date) || SLOTS.findIndex(s => s.id === a.slot) - SLOTS.findIndex(s => s.id === b.slot));

  return `
  <div class="section-title"><div><span class="kicker">Calendario</span><h2>I tuoi pasti</h2></div>
    <button class="btn primary" onclick="App.addMeal('${addDays(today, 1)}','pranzo')">${icon("plus")} Pianifica</button></div>
  <div class="card">
    <div class="cal-head">
      <a class="btn icon" href="#/calendario/${prev}" aria-label="Mese precedente">${icon("left")}</a>
      <h2>${first.toLocaleDateString("it-IT", { month: "long", year: "numeric" })}</h2>
      <a class="btn icon" href="#/calendario/${next}" aria-label="Mese successivo">${icon("right")}</a>
    </div>
    <div class="cal-grid">
      ${["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(d => `<div class="cal-dow">${d}</div>`).join("")}
      ${cells}
    </div>
    <div class="legend">
      <span><i class="dot-eaten"></i>Mangiato</span>
      <span><i class="dot-planned"></i>Pianificato</span>
      <span><i style="background:${SCALE_COLORS[4]}"></i>Umore annotato</span>
    </div>
  </div>
  <div class="card">
    <div class="card-head"><h3>Prossimi 7 giorni</h3></div>
    ${upcoming.length ? upcoming.map(x => `
      <a class="option selectable" href="#/giorno/${x.date}" style="text-decoration:none;color:inherit">
        <div class="grow"><b>${esc(x.title)}</b><p>${fmtShort(x.date)} · ${SLOTS.find(s => s.id === x.slot)?.label || ""}</p></div>
        ${x.kcal ? `<span class="pill k">${x.kcal} kcal</span>` : ""}
      </a>`).join("") : emptyState("Nessun pasto pianificato per i prossimi giorni.", "calendar")}
  </div>`;
}

// ---------- RICETTE ----------
function recipeCards() {
  const f = App.recipeFilter;
  const q = f.q.trim().toLowerCase();
  const list = allRecipes().filter(r =>
    (f.src === "all" || (f.src === "mine" ? !r.builtin : r.builtin)) &&
    (!q || [r.title, r.category, ...(r.tags || []), ...(r.ingredients || [])].join(" ").toLowerCase().includes(q)));
  if (!list.length) return emptyState(f.src === "mine" && !q ? "Non hai ancora aggiunto ricette. Crea la prima." : "Nessuna ricetta trovata.", "bowl");
  return `<div class="grid three">${list.map(r => `
    <div class="card recipe-card" onclick="App.showRecipe('${r.id}')">
      <div class="recipe-band" style="background:${recipeColor(r.category)}"></div>
      <div class="recipe-inner">
        <div class="row between"><span class="kicker">${esc(r.category || "Ricetta")}</span>${r.builtin ? "" : `<span class="pill mine">Mia</span>`}</div>
        <h3>${esc(r.title)}</h3>
        <div class="pills">${(r.tags || []).slice(0, 3).map(t => `<span class="pill">${esc(t)}</span>`).join("")}</div>
        <div class="recipe-meta">
          ${r.time ? `<span>${icon("clock")} ${r.time} min</span>` : ""}
          ${r.kcal ? `<span>${r.kcal} kcal</span>` : ""}
          ${r.p ? `<span>${r.p} g proteine</span>` : ""}
        </div>
      </div>
    </div>`).join("")}</div>`;
}
function viewRecipes() {
  const f = App.recipeFilter;
  return `
  <div class="section-title"><div><span class="kicker">Ricettario</span><h2>Ricette</h2></div>
    <button class="btn primary" onclick="App.recipeForm()">${icon("plus")} Nuova</button></div>
  <div class="toolbar">
    <div class="search-wrap">${icon("search")}<input type="search" placeholder="Cerca per nome o ingrediente" value="${esc(f.q)}" oninput="App.recipeSearch(this.value)" /></div>
    <div class="seg">
      ${[["all", "Tutte"], ["mine", "Le mie"], ["builtin", "Suggerite"]].map(([k, l]) =>
        `<button class="${f.src === k ? "active" : ""}" onclick="App.recipeSrc('${k}')">${l}</button>`).join("")}
    </div>
  </div>
  <div id="recipe-grid">${recipeCards()}</div>`;
}

// ---------- CIBI INTERESSANTI ----------
function stars(n) {
  return `<div class="stars">${[1, 2, 3, 4, 5].map(i => icon("star", i <= n ? "on" : "")).join("")}</div>`;
}
function viewFoods() {
  const filter = App.foodFilter || "all";
  const foods = Store.list("food").filter(x => filter === "all" || (filter === "tried" ? x.tried : !x.tried))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const names = new Set(Store.list("food").map(x => x.name.toLowerCase()));
  return `
  <div class="section-title"><div><span class="kicker">Dispensa</span><h2>Cibi interessanti</h2>
    <p class="muted small">Ingredienti e prodotti da ricordare o provare.</p></div>
    <button class="btn primary" onclick="App.foodForm()">${icon("plus")} Aggiungi</button></div>
  <div class="card">
    <div class="card-head"><h3>Potrebbero piacerti</h3></div>
    <div class="chips">
      ${FOOD_SUGGESTIONS.map((s, i) => names.has(s.name.toLowerCase())
        ? `<span class="chip added">${icon("check")} ${esc(s.name)}</span>`
        : `<button class="chip" title="${esc(s.notes)}" onclick="App.addSuggestedFood(${i})">${icon("plus")} ${esc(s.name)}</button>`).join("")}
    </div>
  </div>
  <div class="seg" style="margin-top:20px">
    ${[["all", "Tutti"], ["todo", "Da provare"], ["tried", "Provati"]].map(([k, l]) =>
      `<button class="${filter === k ? "active" : ""}" onclick="App.setFoodFilter('${k}')">${l}</button>`).join("")}
  </div>
  ${foods.length ? `<div class="grid two">${foods.map(x => `
    <div class="card food-item ${x.tried ? "tried" : ""}">
      <button class="check" style="border-color:var(--sage);${x.tried ? "background:var(--sage)" : ""}" aria-label="${x.tried ? "Segna da provare" : "Segna come provato"}" onclick="App.toggleFood('${x.id}')">${x.tried ? icon("check") : ""}</button>
      <div class="grow" onclick="App.foodForm('${x.id}')" style="cursor:pointer">
        <div class="row gap"><span class="food-name">${esc(x.name)}</span>${x.category ? `<span class="pill">${esc(x.category)}</span>` : ""}</div>
        ${x.rating ? stars(x.rating) : ""}
        ${x.notes ? `<p class="small muted" style="margin:.3rem 0 0">${esc(x.notes)}</p>` : ""}
      </div>
      <div class="meal-actions">
        <button class="btn icon small" aria-label="Elimina" onclick="App.delFood('${x.id}')">${icon("trash")}</button>
      </div>
    </div>`).join("")}</div>` : `<div class="card">${emptyState("La lista è vuota: aggiungi un cibo o tocca un suggerimento.")}</div>`}`;
}

// ---------- DIARIO ----------
function viewDiary() {
  const today = todayStr();
  const notes = [...Store.list("note")].sort((a, b) => b.date.localeCompare(a.date));
  const last7 = notes.filter(n => n.date > addDays(today, -7));
  const avg = k => { const v = last7.filter(n => n[k]).map(n => n[k]); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : 0; };
  const statBox = k => { const a = avg(k); return `<div class="stat"><b style="font-size:1.1rem">${a ? `<i class="swatch-dot" style="background:${SCALE_COLORS[a - 1]}"></i>${SCALES[k].values[a - 1]}` : "—"}</b><span>${SCALES[k].label} medio</span></div>`; };
  const mark = (k, v) => v ? `<span class="mark"><i style="background:${SCALE_COLORS[v - 1]}"></i>${SCALES[k].label}: ${SCALES[k].values[v - 1]}</span>` : "";
  return `
  <div class="section-title"><div><span class="kicker">Diario</span><h2>Note di fine giornata</h2></div></div>
  <div class="grid two">
    <div class="card">${noteEditor(today)}</div>
    <div class="card">
      <div class="card-head"><h3>Ultimi 7 giorni</h3></div>
      <div class="stats">
        ${statBox("mood")}${statBox("energy")}${statBox("belly")}
        <div class="stat"><b>${last7.length}</b><span>Note scritte</span></div>
      </div>
      <p class="small muted" style="margin:1rem 0 0">Rileggendo le note potrai capire quali cibi e abitudini fanno stare bene la tua pancia.</p>
    </div>
  </div>
  <h3 style="margin:24px 0 12px">Tutte le note</h3>
  ${notes.length ? notes.map(n => `
    <div class="card note-entry">
      <div class="row between gap">
        <span class="note-date">${fmtLong(n.date)}</span>
        <a class="btn small ghost" href="#/giorno/${n.date}">Apri ${icon("right")}</a>
      </div>
      <div class="note-marks">${mark("mood", n.mood)}${mark("energy", n.energy)}${mark("belly", n.belly)}${n.water ? `<span class="mark">${n.water} bicchieri d'acqua</span>` : ""}</div>
      ${n.text ? `<p>${esc(n.text)}</p>` : ""}
    </div>`).join("") : `<div class="card">${emptyState("Nessuna nota ancora.", "notebook")}</div>`}`;
}

// ---------- PROFILO ----------
function viewProfile() {
  const p = getProfile(), t = targets();
  const cloud = Store.mode === "cloud";
  return `
  <div class="section-title"><div><span class="kicker">Profilo</span><h2>${p.name ? esc(p.name) : "I tuoi dati"}</h2></div></div>
  <div class="grid two">
    <div class="card">
      <div class="card-head"><h3>Dati personali</h3></div>
      <form id="profile-form" onsubmit="App.saveProfile(event)">
        <label>Nome <input name="name" value="${esc(p.name)}" placeholder="Come ti chiami?" autocomplete="given-name"></label>
        <div class="form-grid">
          <label>Sesso <select name="sex"><option value="M" ${p.sex === "M" ? "selected" : ""}>Maschio</option><option value="F" ${p.sex === "F" ? "selected" : ""}>Femmina</option></select></label>
          <label>Età <input name="age" type="number" inputmode="numeric" min="14" max="99" value="${p.age}"></label>
          <label>Altezza (cm) <input name="height" type="number" inputmode="numeric" min="120" max="230" value="${p.height}"></label>
          <label>Peso (kg) <input name="weight" type="number" inputmode="decimal" step="0.1" min="30" max="200" value="${p.weight}"></label>
        </div>
        <label>Attività fisica <select name="activity">${ACTIVITY_LEVELS.map(a => `<option value="${a.v}" ${a.v == p.activity ? "selected" : ""}>${a.label}</option>`).join("")}</select></label>
        <label>Obiettivo <select name="goal">${GOALS.map(g => `<option value="${g.v}" ${g.v === p.goal ? "selected" : ""}>${g.label}</option>`).join("")}</select></label>
        <button class="btn primary" style="width:100%">Salva e ricalcola</button>
      </form>
    </div>
    <div>
      <div class="card">
        <div class="card-head"><h3>Obiettivi calcolati</h3></div>
        <div class="stats">
          <div class="stat"><b>${t.kcal}</b><span>kcal</span></div>
          <div class="stat"><b>${t.protein} g</b><span>Proteine</span></div>
          <div class="stat"><b>${t.carbs} g</b><span>Carboidrati</span></div>
          <div class="stat"><b>${t.fat} g</b><span>Grassi</span></div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Account</h3></div>
        <p class="muted">${cloud ? `Connesso come <b>${esc(Store.user.email)}</b>. I dati sono sincronizzati su tutti i tuoi dispositivi.`
          : `Stai usando l'app senza account: i dati restano solo su questo dispositivo.`}</p>
        ${cloud ? `<button class="btn" onclick="App.logout()">${icon("logout")} Esci</button>`
          : Store.isConfigured() ? `<button class="btn primary" onclick="App.goLogin()">${icon("login")} Accedi o crea un account</button>`
          : `<p class="small faint" style="margin:0">Per attivare l'account configura Supabase (vedi GUIDA.md).</p>`}
        <hr class="soft"/>
        <p class="small muted">Backup di tutti i dati in un file.</p>
        <div class="row gap">
          <button class="btn small" onclick="App.exportData()">${icon("download")} Esporta</button>
          <label class="btn small" style="margin:0;color:var(--ink)">${icon("upload")} Importa<input type="file" accept=".json,application/json" hidden onchange="App.importData(this)"></label>
        </div>
      </div>
    </div>
  </div>`;
}

// ---------------------------------------------------------------------
//  MODALI
// ---------------------------------------------------------------------
function mealModal(m, heading) {
  const statusDefault = m.status || (m.date > todayStr() ? "planned" : "eaten");
  openModal(`
    <h2>${heading || (m.id ? "Modifica pasto" : "Nuovo pasto")}</h2>
    <form id="meal-form" onsubmit="App.saveMeal(event)">
      <input type="hidden" name="id" value="${m.id || ""}">
      <input type="hidden" name="recipeId" value="${esc(m.recipeId || "")}">
      <div class="form-grid">
        <label>Giorno <input type="date" name="date" value="${m.date}" required></label>
        <label>Pasto <select name="slot" onchange="App.renderPicks()">${SLOTS.map(s => `<option value="${s.id}" ${s.id === m.slot ? "selected" : ""}>${s.label}</option>`).join("")}</select></label>
        <label>Stato <select name="status">
          <option value="eaten" ${statusDefault === "eaten" ? "selected" : ""}>Mangiato</option>
          <option value="planned" ${statusDefault === "planned" ? "selected" : ""}>Pianificato</option></select></label>
      </div>
      <details ${m.title ? "" : "open"} style="margin-bottom:.8rem">
        <summary>Scegli un'idea dal piano o dalle ricette</summary>
        <div class="seg" style="margin:.6rem 0">
          <button type="button" class="active" onclick="App.pickSrc('plan',this)">Dal piano</button>
          <button type="button" onclick="App.pickSrc('recipes',this)">Dalle ricette</button>
        </div>
        <div id="pick-list" style="max-height:280px;overflow-y:auto;overscroll-behavior:contain"></div>
      </details>
      <label>Cosa mangi? <input name="title" required value="${esc(m.title || "")}" placeholder="Es. Pasta al pomodoro con tofu"></label>
      <label>Dettagli e quantità <textarea name="desc" rows="2" placeholder="Es. 90 g pasta, 120 g tofu…">${esc(m.desc || "")}</textarea></label>
      <div class="form-grid macros">
        <label>kcal <input name="kcal" inputmode="numeric" value="${m.kcal || ""}"></label>
        <label>Proteine (g) <input name="p" inputmode="numeric" value="${m.p || ""}"></label>
        <label>Carboidrati (g) <input name="c" inputmode="numeric" value="${m.c || ""}"></label>
        <label>Grassi (g) <input name="f" inputmode="numeric" value="${m.f || ""}"></label>
      </div>
      <p class="small faint" style="margin:-.3rem 0 1rem">Valori facoltativi: servono per confrontarti con gli obiettivi.</p>
      <div class="modal-actions">
        <button class="btn primary">Salva</button>
        ${m.id ? `<button type="button" class="btn danger" onclick="App.delMeal('${m.id}', true)">${icon("trash")} Elimina</button>` : ""}
      </div>
    </form>`);
  App.pickSource = "plan";
  App.renderPicks();
}

function recipeModal(r) {
  openModal(`
    <div class="recipe-detail">
      <span class="kicker" style="color:${recipeColor(r.category)}">${esc(r.category || "Ricetta")}</span>
      <h2 style="margin-top:.2rem">${esc(r.title)}</h2>
      <p class="muted small">${r.time ? `${r.time} minuti` : ""}${r.time && r.servings ? " · " : ""}${r.servings ? `${r.servings} porzion${r.servings == 1 ? "e" : "i"}` : ""}${r.kcal ? " · valori per porzione" : ""}</p>
      ${macroPills(r)}
      ${r.ingredients?.length ? `<h3 style="margin-top:1.2rem">Ingredienti</h3><ul>${r.ingredients.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
      ${r.steps?.length ? `<h3>Procedimento</h3><ol>${r.steps.map(i => `<li>${esc(i)}</li>`).join("")}</ol>` : ""}
      ${r.notes ? `<div class="tip"><b>Nota</b><p>${esc(r.notes)}</p></div>` : ""}
      <div class="modal-actions">
        <button class="btn primary" onclick="App.planRecipe('${r.id}')">${icon("calendar")} Aggiungi al calendario</button>
        ${r.builtin ? `<button class="btn" onclick="App.copyRecipe('${r.id}')">${icon("copy")} Copia nelle mie</button>`
          : `<button class="btn" onclick="App.recipeForm('${r.id}')">${icon("edit")} Modifica</button>
             <button class="btn danger" onclick="App.delRecipe('${r.id}')">${icon("trash")}</button>`}
      </div>
    </div>`);
}

function recipeFormModal(r = {}) {
  openModal(`
    <h2>${r.id ? "Modifica ricetta" : "Nuova ricetta"}</h2>
    <form onsubmit="App.saveRecipe(event)">
      <input type="hidden" name="id" value="${r.id || ""}">
      <label>Nome <input name="title" required value="${esc(r.title || "")}"></label>
      <div class="form-grid">
        <label>Categoria <input name="category" list="cats" value="${esc(r.category || "")}" placeholder="Primo, Colazione…"></label>
        <label>Tempo (min) <input name="time" inputmode="numeric" value="${r.time || ""}"></label>
        <label>Porzioni <input name="servings" inputmode="numeric" value="${r.servings || 1}"></label>
      </div>
      <datalist id="cats">${["Colazione", "Primo", "Secondo", "Piatto unico", "Zuppa", "Contorno", "Spuntino", "Dolce", "Pranzo al sacco"].map(c => `<option>${c}</option>`).join("")}</datalist>
      <span class="kicker">Valori per porzione (facoltativi)</span>
      <div class="form-grid macros" style="margin-top:.4rem">
        <label>kcal <input name="kcal" inputmode="numeric" value="${r.kcal || ""}"></label>
        <label>Proteine (g) <input name="p" inputmode="numeric" value="${r.p || ""}"></label>
        <label>Carboidrati (g) <input name="c" inputmode="numeric" value="${r.c || ""}"></label>
        <label>Grassi (g) <input name="f" inputmode="numeric" value="${r.f || ""}"></label>
      </div>
      <label>Ingredienti (uno per riga) <textarea name="ingredients" rows="5">${esc((r.ingredients || []).join("\n"))}</textarea></label>
      <label>Procedimento (un passaggio per riga) <textarea name="steps" rows="5">${esc((r.steps || []).join("\n"))}</textarea></label>
      <label>Etichette (separate da virgola) <input name="tags" value="${esc((r.tags || []).join(", "))}" placeholder="veloce, proteico"></label>
      <label>Note <textarea name="notes" rows="2">${esc(r.notes || "")}</textarea></label>
      <button class="btn primary">Salva ricetta</button>
    </form>`);
}

function foodFormModal(x = {}) {
  openModal(`
    <h2>${x.id ? "Modifica cibo" : "Nuovo cibo"}</h2>
    <form onsubmit="App.saveFood(event)">
      <input type="hidden" name="id" value="${x.id || ""}">
      <label>Nome <input name="name" required value="${esc(x.name || "")}" placeholder="Es. Tofu affumicato"></label>
      <label>Categoria <input name="category" list="fcats" value="${esc(x.category || "")}"></label>
      <datalist id="fcats">${["Proteine", "Latticini", "Cereali", "Verdure", "Frutta", "Frutta secca", "Semi", "Condimenti", "Spezie", "Snack", "Bevande"].map(c => `<option>${c}</option>`).join("")}</datalist>
      <label>Note <textarea name="notes" placeholder="Dove trovarlo, come usarlo, perché ti incuriosisce…">${esc(x.notes || "")}</textarea></label>
      <label>Voto <select name="rating"><option value="0">Nessun voto</option>${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${x.rating === n ? "selected" : ""}>${n} su 5</option>`).join("")}</select></label>
      <label class="checkbox"><input type="checkbox" name="tried" ${x.tried ? "checked" : ""}> L'ho già provato</label>
      <button class="btn primary">Salva</button>
    </form>`);
}

function moreSheet() {
  openModal(`
    <h2>Altro</h2>
    <div class="sheet-links">
      ${NAV.filter(n => n.secondary).map(n => `<a href="#/${n.id}" onclick="closeModal()">${icon(n.icon)}<div>${n.label}<span>${n.desc}</span></div></a>`).join("")}
    </div>`);
}

// ---------------------------------------------------------------------
//  APP (azioni)
// ---------------------------------------------------------------------
const App = {
  planTab: "obiettivi",
  recipeFilter: { q: "", src: "all" },
  foodFilter: "all",
  noteDraft: null,
  pickSource: "plan",
  currentDate: null,
  _picks: [],

  // ----- pasti -----
  addMeal(date, slot) { mealModal({ date, slot }); },
  editMeal(id) { const m = Store.get("meal", id); if (m) mealModal({ ...m }); },
  dupMeal(id) {
    const m = Store.get("meal", id); if (!m) return;
    const { id: _, ...copy } = m;
    mealModal({ ...copy, date: addDays(m.date, 1), status: "planned" }, "Copia in un altro giorno");
  },
  async delMeal(id, fromModal) {
    if (!confirm("Eliminare questo pasto?")) return;
    if (await safe(() => Store.remove("meal", id), "Pasto eliminato")) { if (fromModal) closeModal(); render(); }
  },
  async toggleMeal(id) {
    const m = Store.get("meal", id); if (!m) return;
    await safe(() => Store.save("meal", { ...m, status: m.status === "eaten" ? "planned" : "eaten" }));
    render();
  },
  async saveMeal(e) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    const existing = fd.id ? Store.get("meal", fd.id) : null;
    const meal = {
      id: fd.id || undefined, date: fd.date, slot: fd.slot, status: fd.status,
      title: fd.title.trim(), desc: fd.desc.trim(), recipeId: fd.recipeId || null,
      kcal: num(fd.kcal), p: num(fd.p), c: num(fd.c), f: num(fd.f),
      createdAt: existing?.createdAt || Date.now(),
    };
    if (await safe(() => Store.save("meal", meal), "Pasto salvato")) { closeModal(); render(); }
  },
  pickSrc(src, btn) {
    App.pickSource = src;
    btn.parentElement.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
    App.renderPicks();
  },
  renderPicks() {
    const form = $("#meal-form"); if (!form) return;
    const slot = form.elements.slot.value;
    App._picks = App.pickSource === "plan"
      ? MEAL_OPTIONS[slot].map(o => ({ ...o }))
      : allRecipes().map(r => ({ title: r.title, desc: (r.ingredients || []).slice(0, 5).join(", "), kcal: r.kcal, p: r.p, c: r.c, f: r.f, recipeId: r.id }));
    $("#pick-list").innerHTML = App._picks.length ? App._picks.map((o, i) => `
      <div class="option selectable" onclick="App.pick(${i})">
        <div class="grow"><b>${esc(o.title)}</b><p>${esc(o.desc)}</p></div>
        ${o.kcal ? `<span class="pill k">${o.kcal} kcal</span>` : ""}
      </div>`).join("") : `<p class="muted small">Nessuna voce.</p>`;
  },
  pick(i) {
    const o = App._picks[i], form = $("#meal-form"), el = form.elements;
    el.title.value = o.title; el.desc.value = o.desc || "";
    el.kcal.value = o.kcal || ""; el.p.value = o.p || ""; el.c.value = o.c || ""; el.f.value = o.f || "";
    el.recipeId.value = o.recipeId || "";
    form.querySelector("details").open = false;
  },
  addFromOption(slot, i) {
    const o = MEAL_OPTIONS[slot][i];
    mealModal({ date: todayStr(), slot, title: o.title, desc: o.desc, kcal: o.kcal, p: o.p, c: o.c, f: o.f }, "Aggiungi al calendario");
  },
  applySampleDay(date) {
    openModal(`<h2>Giornata tipo</h2>
      <p class="muted">I pasti verranno aggiunti come <b>pianificati</b> per ${fmtLong(date)}. Potrai modificarli e spuntarli quando li mangi.</p>
      ${SAMPLE_DAYS.map((d, i) => `<div class="option selectable" onclick="App.applySample(${i},'${date}')">
        <div class="grow"><b>${d.name}</b><p>${SLOTS.map(s => d.meals[s.id]).join(" · ")}</p></div></div>`).join("")}`);
  },
  pickDateForSample(i) {
    openModal(`<h2>In che giorno?</h2>
      <label>Giorno <input type="date" id="sample-date" value="${addDays(todayStr(), 1)}"></label>
      <button class="btn primary" style="width:100%" onclick="App.applySample(${i}, document.getElementById('sample-date').value)">Pianifica</button>`);
  },
  async applySample(i, date) {
    if (!isValidDate(date)) return toast("Scegli una data valida", true);
    const d = SAMPLE_DAYS[i];
    const ok = await safe(async () => {
      let n = 0;
      for (const s of SLOTS) {
        const o = findOption(d.meals[s.id]); if (!o) continue;
        await Store.save("meal", { date, slot: s.id, status: "planned", title: o.title, desc: o.desc, kcal: o.kcal, p: o.p, c: o.c, f: o.f, createdAt: Date.now() + n++ });
      }
    }, "Giornata pianificata");
    if (ok) { closeModal(); location.hash = "#/giorno/" + date; render(); }
  },

  // ----- note -----
  noteSet(key, v, btn) {
    App.noteDraft[key] = App.noteDraft[key] === v ? 0 : v;
    btn.parentElement.querySelectorAll("button").forEach((b, i) => b.classList.toggle("on", App.noteDraft[key] === i + 1));
    const lab = $("#sv-" + key); if (lab) lab.textContent = App.noteDraft[key] ? SCALES[key].values[App.noteDraft[key] - 1] : "—";
  },
  waterSet(v) {
    App.noteDraft.water = App.noteDraft.water === v ? v - 1 : v;
    document.querySelectorAll("#water button").forEach((b, i) => b.classList.toggle("on", i < App.noteDraft.water));
    const lab = $("#sv-water"); if (lab) lab.textContent = `${App.noteDraft.water} bicchieri`;
  },
  async saveNote() {
    const d = App.noteDraft;
    d.text = $("#note-text").value.trim();
    if (!d.text && !d.mood && !d.energy && !d.belly && !d.water) return toast("Scrivi qualcosa o compila un campo", true);
    if (await safe(() => Store.save("note", d), "Nota salvata")) render();
  },
  async delNote(id) {
    if (!confirm("Eliminare la nota di questa giornata?")) return;
    await safe(() => Store.remove("note", id), "Nota eliminata");
    render();
  },

  // ----- piano -----
  setPlanTab(k) { App.planTab = k; render(); },

  // ----- ricette -----
  recipeSearch(q) { App.recipeFilter.q = q; $("#recipe-grid").innerHTML = recipeCards(); },
  recipeSrc(k) { App.recipeFilter.src = k; render(); },
  showRecipe(id) { const r = findRecipe(id); if (r) recipeModal(r); },
  recipeForm(id) { recipeFormModal(id ? { ...Store.get("recipe", id) } : {}); },
  async saveRecipe(e) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    const lines = s => s.split("\n").map(x => x.trim()).filter(Boolean);
    const existing = fd.id ? Store.get("recipe", fd.id) : null;
    const r = {
      ...(existing || {}),
      id: fd.id || undefined, title: fd.title.trim(), category: fd.category.trim(),
      time: num(fd.time), servings: num(fd.servings) || 1,
      kcal: num(fd.kcal), p: num(fd.p), c: num(fd.c), f: num(fd.f),
      ingredients: lines(fd.ingredients), steps: lines(fd.steps),
      tags: fd.tags.split(",").map(x => x.trim()).filter(Boolean), notes: fd.notes.trim(),
      createdAt: existing?.createdAt || Date.now(),
    };
    if (await safe(() => Store.save("recipe", r), "Ricetta salvata")) { closeModal(); render(); }
  },
  async copyRecipe(id) {
    const { id: _, builtin, ...r } = findRecipe(id);
    const saved = { ...r, createdAt: Date.now() };
    if (await safe(() => Store.save("recipe", saved), "Copiata nelle tue ricette")) { render(); recipeFormModal(saved); }
  },
  async delRecipe(id) {
    if (!confirm("Eliminare questa ricetta?")) return;
    if (await safe(() => Store.remove("recipe", id), "Ricetta eliminata")) { closeModal(); render(); }
  },
  planRecipe(id) {
    const r = findRecipe(id);
    const slot = /colazione/i.test(r.category) ? "colazione" : /spuntino|dolce/i.test(r.category) ? "merenda" : "pranzo";
    mealModal({ date: todayStr(), slot, title: r.title, desc: "Ricetta: " + r.title, kcal: r.kcal, p: r.p, c: r.c, f: r.f, recipeId: r.id }, "Aggiungi al calendario");
  },

  // ----- cibi -----
  setFoodFilter(k) { App.foodFilter = k; render(); },
  foodForm(id) { foodFormModal(id ? { ...Store.get("food", id) } : {}); },
  async saveFood(e) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    const existing = fd.id ? Store.get("food", fd.id) : null;
    const x = { id: fd.id || undefined, name: fd.name.trim(), category: fd.category.trim(), notes: fd.notes.trim(),
      rating: num(fd.rating), tried: !!fd.tried, createdAt: existing?.createdAt || Date.now() };
    if (await safe(() => Store.save("food", x), "Cibo salvato")) { closeModal(); render(); }
  },
  async addSuggestedFood(i) {
    const s = FOOD_SUGGESTIONS[i];
    await safe(() => Store.save("food", { ...s, rating: 0, tried: false, createdAt: Date.now() }), `${s.name} aggiunto`);
    render();
  },
  async toggleFood(id) {
    const x = Store.get("food", id);
    await safe(() => Store.save("food", { ...x, tried: !x.tried }));
    render();
  },
  async delFood(id) {
    if (!confirm("Eliminare questo cibo dalla lista?")) return;
    await safe(() => Store.remove("food", id), "Eliminato");
    render();
  },

  // ----- profilo -----
  async saveProfile(e) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.target));
    const cur = Store.list("profile")[0] || {};
    const p = { ...cur, name: fd.name.trim(), sex: fd.sex, age: num(fd.age) || 30, height: num(fd.height) || 169,
      weight: parseFloat(String(fd.weight).replace(",", ".")) || 57, activity: parseFloat(fd.activity), goal: fd.goal };
    if (await safe(() => Store.save("profile", p), "Profilo aggiornato")) { render(); setGreeting(); }
  },
  async logout() {
    await Store.client.auth.signOut();
    localStorage.removeItem("giardino_mode");
    location.hash = "";
    location.reload();
  },
  goLogin() {
    localStorage.removeItem("giardino_mode");
    location.reload();
  },
  exportData() {
    const blob = new Blob([Store.exportJSON()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `giardino-dieta-backup-${todayStr()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  async importData(input) {
    const file = input.files[0]; if (!file) return;
    const text = await file.text();
    if (await safe(() => Store.importJSON(text), "Backup importato")) render();
    input.value = "";
  },
  moreSheet,
};
window.App = App;
window.closeModal = closeModal;

// ---------------------------------------------------------------------
//  NAVIGAZIONE E ROUTER
// ---------------------------------------------------------------------
function renderNav() {
  $("#tabs").innerHTML = NAV.map(n =>
    `<a href="#/${n.id}" class="tab ${n.secondary ? "secondary" : ""}" data-tab="${n.id}">${icon(n.icon)}<span>${n.label}</span></a>`).join("") +
    `<button class="tab more" data-tab="more" onclick="App.moreSheet()">${icon("more")}<span>Altro</span></button>`;
  $("#fab").innerHTML = icon("plus");
  $("#fab").onclick = () => App.addMeal(App.currentDate || todayStr(), (App.currentDate || todayStr()) === todayStr() ? slotForNow() : "pranzo");
}

let lastRoute = null;
function render() {
  const h = location.hash.replace(/^#\/?/, "") || "oggi";
  const [name, arg] = h.split("/");
  let html, tab = name;
  App.currentDate = null;
  switch (name) {
    case "giorno":
      if (!isValidDate(arg)) { location.hash = "#/oggi"; return; }
      html = viewDay(arg); App.currentDate = arg; tab = arg === todayStr() ? "oggi" : "calendario"; break;
    case "piano": html = viewPlan(); break;
    case "calendario": html = viewCalendar(arg); break;
    case "ricette": html = viewRecipes(); break;
    case "cibi": html = viewFoods(); break;
    case "diario": html = viewDiary(); break;
    case "profilo": html = viewProfile(); break;
    default: html = viewDay(todayStr()); App.currentDate = todayStr(); tab = "oggi";
  }
  $("#view").innerHTML = html;
  const secondary = !!NAV.find(n => n.id === tab)?.secondary;
  document.querySelectorAll("#tabs .tab").forEach(a => a.classList.toggle("active", a.dataset.tab === tab || (secondary && a.dataset.tab === "more")));
  $("#fab").classList.toggle("hidden", !App.currentDate);
  if (lastRoute !== h) {
    if (lastRoute !== null && lastRoute.split("/")[0] !== name) window.scrollTo(0, 0);
    lastRoute = h;
  }
}

function setGreeting() {
  const hr = new Date().getHours();
  const hello = hr < 6 ? "Buonanotte" : hr < 13 ? "Buongiorno" : hr < 18 ? "Buon pomeriggio" : "Buonasera";
  const name = getProfile().name;
  const phrases = ["Il vento è dalla tua parte.", "Un passo alla volta.", "Oggi coltiviamo il benessere.",
    "Con calma, come un pomeriggio d'estate.", "Il cielo è grande: respira.", "Ogni pasto è un piccolo rito."];
  const phrase = phrases[new Date().getDate() % phrases.length];
  $("#greeting").textContent = `${hello}${name ? ", " + name : ""}. ${phrase}`;
  $("#hero-date").textContent = new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

function setSyncStatus() {
  $("#sync-status").innerHTML = Store.mode === "cloud"
    ? `${icon("cloud")} Sincronizzato · ${esc(Store.user.email)}`
    : `${icon("device")} Dati salvati su questo dispositivo`;
}

// ---------------------------------------------------------------------
//  AVVIO E AUTENTICAZIONE
// ---------------------------------------------------------------------
let pendingRecovery = false;

async function startApp() {
  try {
    await Store.loadAll();
  } catch (e) {
    console.error(e);
    toast("Impossibile caricare i dati: " + e.message, true);
  }
  $("#auth").classList.add("hidden");
  $("#app").classList.remove("hidden");
  renderNav();
  setGreeting();
  setSyncStatus();
  render();
  $("#loading").classList.add("done");

  if (Store.mode === "cloud") {
    const raw = localStorage.getItem("giardino_data");
    const hasLocal = raw && Object.values(JSON.parse(raw)).some(a => Array.isArray(a) && a.length);
    if (hasLocal && confirm("Ho trovato dei dati salvati su questo dispositivo senza account. Vuoi caricarli nel tuo account?")) {
      await safe(async () => { const n = await Store.importLocalToCloud(); toast(`Caricati ${n} elementi nel tuo account`); });
      render();
    }
    if (pendingRecovery) showNewPasswordModal();
  }
}

function showNewPasswordModal() {
  pendingRecovery = false;
  openModal(`<h2>Nuova password</h2>
    <form onsubmit="event.preventDefault();App.setNewPassword(this.pw.value)">
      <label>Nuova password <input name="pw" type="password" minlength="6" required autocomplete="new-password"></label>
      <button class="btn primary" style="width:100%">Salva</button>
    </form>`);
}
App.setNewPassword = async pw => {
  const { error } = await Store.client.auth.updateUser({ password: pw });
  if (error) return toast(error.message, true);
  closeModal(); toast("Password aggiornata");
};

function showAuth() {
  $("#loading").classList.add("done");
  $("#app").classList.add("hidden");
  $("#auth").classList.remove("hidden");
  const configured = Store.isConfigured();
  $("#auth-cloud").classList.toggle("hidden", !configured);
  $("#auth-not-configured").classList.toggle("hidden", configured);
}

function authMsg(msg, err = false) {
  const el = $("#auth-msg");
  el.textContent = msg;
  el.className = "auth-msg" + (err ? " err" : "");
}

const AUTH_ERRORS = {
  "Invalid login credentials": "Email o password non corrette.",
  "Email not confirmed": "Devi prima confermare l'email: controlla la posta (anche lo spam).",
  "User already registered": "Esiste già un account con questa email: prova ad accedere.",
};
const authErr = e => AUTH_ERRORS[e.message] || e.message;

function bindLocalButton() {
  $("#btn-local").addEventListener("click", () => {
    localStorage.setItem("giardino_mode", "local");
    Store.mode = "local";
    startApp();
  });
}

function bindAuth() {
  const form = $("#auth-form");
  const redirectTo = location.origin + location.pathname;

  form.addEventListener("submit", async e => {
    e.preventDefault();
    authMsg("Un attimo…");
    const { data, error } = await Store.client.auth.signInWithPassword({ email: form.email.value.trim(), password: form.password.value });
    if (error) return authMsg(authErr(error), true);
    Store.mode = "cloud"; Store.user = data.user;
    authMsg("");
    startApp();
  });

  $("#btn-signup").addEventListener("click", async () => {
    if (!form.reportValidity()) return;
    authMsg("Creo il tuo account…");
    const { data, error } = await Store.client.auth.signUp({
      email: form.email.value.trim(), password: form.password.value, options: { emailRedirectTo: redirectTo },
    });
    if (error) return authMsg(authErr(error), true);
    if (data.session) { Store.mode = "cloud"; Store.user = data.user; startApp(); }
    else authMsg("Account creato. Ti ho mandato un'email: clicca sul link per confermare, poi accedi.");
  });

  $("#btn-reset").addEventListener("click", async () => {
    const email = form.email.value.trim();
    if (!email) return authMsg("Scrivi la tua email qui sopra, poi premi di nuovo.", true);
    const { error } = await Store.client.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return authMsg(authErr(error), true);
    authMsg("Ti ho mandato un'email per reimpostare la password.");
  });

  bindLocalButton();
}

// Chiusura modale
$(".modal-x").innerHTML = icon("x");
document.addEventListener("click", e => { if (e.target.closest("[data-close]")) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
window.addEventListener("hashchange", () => { if (!$("#app").classList.contains("hidden")) { closeModal(); render(); } });

// Chiusura del "bottom sheet" trascinando verso il basso (mobile)
(function sheetSwipe() {
  const card = $(".modal-card");
  let y0 = null, dy = 0;
  card.addEventListener("touchstart", e => {
    if (card.scrollTop <= 0 && !e.target.closest("#pick-list, textarea, input, select")) { y0 = e.touches[0].clientY; dy = 0; }
  }, { passive: true });
  card.addEventListener("touchmove", e => {
    if (y0 === null) return;
    dy = e.touches[0].clientY - y0;
    if (dy > 0) card.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  card.addEventListener("touchend", () => {
    if (y0 !== null && dy > 110) closeModal();
    card.style.transform = ""; y0 = null; dy = 0;
  });
})();

(async function init() {
  if (Store.isConfigured()) {
    Store.initClient();
    bindAuth();
    Store.client.auth.onAuthStateChange(event => {
      if (event === "PASSWORD_RECOVERY") {
        pendingRecovery = true;
        if (!$("#app").classList.contains("hidden")) showNewPasswordModal();
      }
    });
    if (localStorage.getItem("giardino_mode") === "local") { Store.mode = "local"; return startApp(); }
    const { data } = await Store.client.auth.getSession();
    if (data.session) {
      Store.mode = "cloud"; Store.user = data.session.user;
      return startApp();
    }
    return showAuth();
  }
  // Supabase non configurato
  if (localStorage.getItem("giardino_mode") === "local") { Store.mode = "local"; return startApp(); }
  bindLocalButton();
  showAuth();
})();
