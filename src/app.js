/* =====================================================================
   MOTEUR DE L'APPLICATION
   ===================================================================== */
(() => {
"use strict";

const DEMO = typeof DEMO_MODE !== "undefined" && DEMO_MODE;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const strip = s => String(s ?? "").replace(/<[^>]+>/g, "").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
const norm = s => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const LETTERS = "ABCDEFGHIJKL";
const LS_KEY = DEMO ? "toxiquest-demo-v1" : "toxiquest-115-v1";
const PREF_KEY = "toxiquest-prefs";
const PCOLORS = ["var(--p1)", "var(--p2)", "var(--p3)"];
const WEDGE_BONUS = 20;
const CX = typeof COURSE_FX !== "undefined" ? COURSE_FX : {};
const catById = Object.fromEntries(CATS.map(c => [c.id, c]));
const qById = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
const caseById = Object.fromEntries(CASES.map(c => [c.id, c]));

const rangOf = oic => (oic ? oic.slice(-1) : "C");
const rangBadge = (oic, col) => {
  const r = rangOf(oic);
  return `<span class="rang rang-${r}">[RANG ${r}]</span>` + (col ? ` <span class="rang rang-C">Compl. ${col === true ? "Collège" : esc(col)}</span>` : "");
};
const oicLine = oic => oic ? `<span class="oic">${esc(oic)} · ${esc(OIC[oic] || "")}</span>` : "";
const listFr = xs => xs.length <= 1 ? xs.join("") : xs.slice(0, -1).join(", ") + " et " + xs[xs.length - 1];
const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const initial = name => esc(String(name || "?").charAt(0).toUpperCase());
const bump = (el, cls) => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

/* ---------------- état ---------------- */
function freshCourse() { return { v2: 1, open: {}, recited: {}, cards: {}, games: {}, cheer: false }; }
function freshState() {
  return { v: 1, screen: 0, players: [], settings: { rounds: DEMO ? 2 : 5, timer: 0, level: "hard", mode: "turn" },
    trivial: { turn: 0, round: 1, asked: [], cur: null, done: false, rot: 0 },
    log: [], cases: {}, activeCase: null, course: freshCourse() };
}
function load() {
  try { const raw = localStorage.getItem(LS_KEY); if (!raw) return null; const s = JSON.parse(raw); return s && s.v === 1 ? s : null; }
  catch (e) { return null; }
}
function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(S)); } catch (e) { /* stockage indisponible : la partie reste en mémoire */ } }
let S = load() || freshState();
if (!S.course || !S.course.v2) S.course = freshCourse();
S.settings = Object.assign({ level: "hard", mode: "turn" }, S.settings);

let prefs = { theme: "auto", fs: 1 };
try { prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(PREF_KEY) || "{}")); } catch (e) { /* préférences par défaut */ }
function savePrefs() { try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (e) { /* ignoré */ } }

/* ---------------- scores dérivés ---------------- */
function wedgesOf(i) {
  const w = {};
  S.log.forEach(l => { if (l.p === i && l.pts >= 10) w[qById[l.qid].cat] = true; });
  return w;
}
function streakOf(i) {
  let n = 0;
  const mine = S.log.filter(l => l.p === i);
  for (let k = mine.length - 1; k >= 0 && mine[k].pts >= 10; k--) n++;
  return n;
}
function trivialPts(i) { return S.log.filter(l => l.p === i).reduce((a, l) => a + l.pts, 0); }
function playerScore(i) { return trivialPts(i) + (Object.keys(wedgesOf(i)).length === CATS.length ? WEDGE_BONUS : 0); }
function casePts() { return Object.values(S.cases).reduce((a, c) => a + (c.pts || 0), 0); }
function trivialTotal() { return S.players.reduce((a, _, i) => a + playerScore(i), 0); }
function teamScore() { return trivialTotal() + casePts(); }
function caseMax(C) { return C.steps.reduce((a, st) => a + stepMax(st), 0); }
function stepMax(st) {
  if (st.type === "scorten") return SCORTEN_ITEMS.length * 2 + 6;
  if (st.type === "regiscar") return REGISCAR_ITEMS.length + 5;
  if (st.type === "qcu") return Math.max(...st.o.map(o => o.pts));
  return st.o.filter(o => o.pts > 0).reduce((a, o) => a + o.pts, 0);
}

/* ---------------- utilitaires d'interface ---------------- */
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2700);
}
function arc(cx, cy, r, a0, a1) {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z`;
}
function pie(wedges, size = 30, prev) {
  const c = size / 2, r = c - 1.5;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">` +
    CATS.map((cat, i) => `<path class="${wedges[cat.id] && prev && !prev[cat.id] ? "wedge-new" : ""}" d="${arc(c, c, r, -90 + i * 72, -90 + (i + 1) * 72)}" style="fill:${wedges[cat.id] ? `var(${cat.css})` : "var(--surface-3)"};stroke:var(--surface);stroke-width:1.5"/>`).join("") +
    `</svg>`;
}
const revealed = new Set();
function photo(key, opts = {}) {
  const im = IMG[key]; if (!im) return "";
  const hidden = opts.hidden !== false && !(opts.rid && revealed.has(opts.rid));
  return `<figure class="ph${hidden ? " is-hidden" : ""}${opts.spoiler ? " spoiler" : ""}"${opts.rid ? ` data-rid="${esc(opts.rid)}"` : ""}>
    <div class="ph-frame"><img src="${esc(im.src)}" alt="${hidden ? "Photographie clinique masquée" : esc(im.cap)}" data-cap="${esc(im.cap)}" loading="lazy" decoding="async">
      <div class="ph-cover"><b>📷 Photo masquée</b><small>Décrivez d'abord à voix haute : lésion élémentaire, topographie, couleur, muqueuses, signes associés.</small></div></div>
    <figcaption><button type="button" class="btn-ph" data-ph-toggle>${hidden ? "Révéler la photo clinique" : "Masquer la photo clinique"}</button>
      <span class="cap">${esc(im.cap)}</span>
      <span class="credit">Photo : ${esc(im.credit)} · ${esc(im.lic)} · <a href="${esc(im.page)}" target="_blank" rel="noopener">Wikimedia Commons</a></span></figcaption></figure>`;
}

/* ---------------- préférences : thème, taille, son ---------------- */
function applyPrefs() {
  const root = document.documentElement;
  if (prefs.theme === "auto") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", prefs.theme);
  root.style.setProperty("--fs", prefs.fs);
  $("#theme-btn").textContent = { auto: "Auto", light: "Clair", dark: "Sombre" }[prefs.theme];
  const sb = $("#sound-btn");
  sb.textContent = Sound.on ? "🔊" : "🔇"; sb.classList.toggle("muted", !Sound.on);
  sb.setAttribute("aria-pressed", String(Sound.on));
}
$("#theme-btn").addEventListener("click", () => {
  prefs.theme = { auto: "light", light: "dark", dark: "auto" }[prefs.theme]; savePrefs(); applyPrefs(); Sound.play("click");
});
$("#font-plus").addEventListener("click", () => { prefs.fs = Math.min(1.5, +(prefs.fs + 0.1).toFixed(2)); savePrefs(); applyPrefs(); Sound.play("click"); });
$("#font-minus").addEventListener("click", () => { prefs.fs = Math.max(0.8, +(prefs.fs - 0.1).toFixed(2)); savePrefs(); applyPrefs(); Sound.play("unclick"); });
$("#sound-btn").addEventListener("click", () => { const on = Sound.toggle(); applyPrefs(); toast(on ? "🔊 Sons activés" : "🔇 Sons coupés"); });

/* ---------------- navigation ---------------- */
let timerId = null;
function go(n, silent = false) {
  n = +n;
  if (n >= 2 && !S.players.length) { toast("Entrez d'abord les trois prénoms."); n = 0; }
  if (!silent && n !== S.screen) Sound.play("page");
  S.screen = n; save();
  $$(".screen").forEach(s => s.classList.toggle("active", s.id === "screen-" + n));
  $$("#stepper button").forEach(b => {
    if (+b.dataset.go === n) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    b.disabled = +b.dataset.go >= 2 && !S.players.length;
  });
  clearInterval(timerId);
  if (PHONES()) ensureHost();
  if (n === 0) renderSetup();
  if (n === 1) renderCourseProgress();
  if (n === 2) renderTrivial();
  if (n === 3) renderCases();
  if (n === 4) renderDebrief();
  renderScorebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.addEventListener("click", e => {
  const g = e.target.closest("[data-go]");
  if (g && !g.disabled) { e.preventDefault(); go(g.dataset.go); return; }
  const t = e.target.closest("[data-ph-toggle]");
  if (t) {
    const fig = t.closest(".ph"); const hid = fig.classList.toggle("is-hidden");
    t.textContent = hid ? "Révéler la photo clinique" : "Masquer la photo clinique";
    const img = $("img", fig); if (img) img.alt = hid ? "Photographie clinique masquée" : img.dataset.cap;
    if (fig.dataset.rid) { if (hid) revealed.delete(fig.dataset.rid); else revealed.add(fig.dataset.rid); }
    if (!hid) { bump(fig, "flash"); Sound.play("shutter"); } else Sound.play("unclick");
  }
});
document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName === "IMG" && img.closest(".ph-frame")) {
    const fig = img.closest(".ph"); const link = $(".credit a", fig);
    img.closest(".ph-frame").innerHTML = `<div class="ph-err">Image indisponible (connexion ?).<br><a href="${link ? link.href : "#"}" target="_blank" rel="noopener" style="color:#fff">Ouvrir sur Wikimedia Commons</a></div>`;
    fig.classList.remove("is-hidden");
  }
}, true);

/* ---------------- bandeau des scores (compteurs animés) ---------------- */
let lastScores = null, lastWedges = null;
function renderScorebar() {
  const bar = $("#scorebar");
  if (!S.players.length) { bar.classList.add("hidden"); return; }
  bar.classList.remove("hidden");
  const onTrivial = S.screen === 2 && !S.trivial.done && !PHONES();
  const phoneQ = PHONES() && S.screen === 2 && S.trivial.cur && !S.trivial.cur.revealed ? S.trivial.cur : null;
  const scores = S.players.map((_, i) => playerScore(i)), team = teamScore();
  const wedges = S.players.map((_, i) => wedgesOf(i));
  const prev = lastScores && lastScores.p.length === scores.length ? lastScores : { p: scores, team };
  const prevW = lastWedges || wedges;
  $("#scorebar-inner").innerHTML = S.players.map((p, i) => {
    const turn = onTrivial && S.trivial.turn === i, st = streakOf(i);
    return `<div class="pchip${turn || (phoneQ && phoneQ.answers && phoneQ.answers[i]) ? " turn" : ""}" data-pchip="${i}" style="--pc:${PCOLORS[i]}">
      <div class="avatar">${initial(p.name)}</div>
      <div class="who">${turn ? `<span class="turn-tag">À toi de jouer</span>` : phoneQ ? `<span class="turn-tag">${phoneQ.answers && phoneQ.answers[i] ? "📱 a répondu ✓" : "📱 réfléchit…"}</span>` : ""}<b>${esc(p.name)}${st >= 2 ? `<span class="streak" title="Bonnes réponses d'affilée">🔥${st}</span>` : ""}</b><small>${Object.keys(wedges[i]).length}/5 camemberts</small></div>
      ${pie(wedges[i], 30, prevW[i])}
      <div class="pts">${prev.p[i]}</div></div>`;
  }).join("") +
  `<div class="teamchip"><div><b>Score d'équipe</b><small>Trivial ${trivialTotal()} · Cas cliniques ${casePts()}</small></div><div class="pts" id="team-pts" style="margin-left:auto">${prev.team}</div></div>`;
  S.players.forEach((_, i) => {
    const el = $(`[data-pchip="${i}"] .pts`), d = scores[i] - prev.p[i];
    if (d) { countUp(el, prev.p[i], scores[i]); floatText(el, (d > 0 ? "+" : "−") + Math.abs(d), d > 0 ? "var(--ok)" : "var(--bad)"); }
  });
  const tp = $("#team-pts"), dt = team - prev.team;
  if (dt) { countUp(tp, prev.team, team); floatText(tp, (dt > 0 ? "+" : "−") + Math.abs(dt), dt > 0 ? "var(--accent)" : "var(--bad)"); }
  lastScores = { p: scores, team }; lastWedges = wedges;
}

/* =====================================================================
   ÉTAPE 0 — ÉQUIPE
   ===================================================================== */
function renderSetup() {
  const has = S.players.length > 0;
  const names = has ? S.players.map(p => p.name) : ["", "", ""];
  const r = S.settings.rounds, t = S.settings.timer, nq = QUESTIONS.length;
  $("#screen-0").innerHTML = `
  <div class="hero">
    <div>
      <div class="eyebrow">${DEMO ? "Page de test · contenu fictif" : "Étape 0 · Équipe"}</div>
      <h1 id="t0">${DEMO ? "Répétition <span>générale</span>" : "Sous-colle <span>Toxidermies</span>"}</h1>
      <p class="lead">${DEMO
        ? "Même moteur que le vrai jeu, mais avec un mini-cours, des questions et un cas <b>inventés</b> : vous pouvez tout vérifier (sons, chrono, roue, photos, fiches interactives, calculateur, bilan) sans rien découvrir des vraies questions. Cette partie de test est enregistrée à part et n'efface rien du vrai jeu."
        : "Item 115 du programme EDN (LiSA 2026), plus la pharmacovigilance de l'item 325. Trois joueurs, un seul écran, environ 90 minutes."}</p>
      <ol class="steps-list">
        <li style="--i:0"><span class="n">1</span><div><b>Fiches interactives</b><br><small>${DEMO ? "3 fiches d'exemple et la liste de vérification." : "9 fiches à lire, réciter en texte à trous, jouer (mini-jeux) et vérifier (cartes flash)."}</small></div></li>
        <li style="--i:1"><span class="n">2</span><div><b>Trivial Pursuit</b><br><small>${nq} questions en 5 catégories. Tour par tour, +10 par bonne réponse (QRM notées comme à l'EDN), un camembert par catégorie réussie, +${WEDGE_BONUS} pour le camembert complet.</small></div></li>
        <li style="--i:2"><span class="n">3</span><div><b>${CASES.length > 1 ? CASES.length + " dossiers progressifs" : "Un dossier progressif"} en équipe</b><br><small>${DEMO ? "Un patient fictif en trois étapes, dont un calculateur." : "DRESS sous allopurinol, puis Lyell aux urgences avec calcul du SCORTEN."} Chaque décision fait varier le score et la stabilité du patient.</small></div></li>
        <li style="--i:3"><span class="n">4</span><div><b>Bilan</b><br><small>Podium, points forts et points faibles par joueur, fiche mémo des erreurs et des cartes à revoir.</small></div></li>
      </ol>
    </div>
    <div class="card">
      <h2>Qui joue ?</h2>
      ${has ? `<div class="note info">Partie en cours : ${S.log.length} question(s) jouée(s), score d'équipe ${teamScore()}. Modifier les prénoms ne remet pas les scores à zéro.</div>` : ""}
      <form id="setup-form" class="players-form" autocomplete="off">
        ${[0, 1, 2].map(i => `<label class="pfield" style="--pc:${PCOLORS[i]}"><span class="avatar" aria-hidden="true">${names[i] ? initial(names[i]) : i + 1}</span>
          <input name="p${i}" maxlength="18" placeholder="Prénom du joueur ${i + 1}" value="${esc(names[i])}" aria-label="Prénom du joueur ${i + 1}"></label>`).join("")}
        <div class="opts-row">
          <label>Manches de Trivial (questions par joueur)
            <select name="rounds">${(DEMO ? [[1, "1 manche"], [2, "2 manches"]] : [[3, "3 · express (≈ 20 min)"], [5, "5 · standard (≈ 35 min)"], [8, "8 · marathon (≈ 55 min)"], [99, `Jusqu'à épuisement (${nq} questions)`]]).map(([v, l]) => `<option value="${v}"${r === v ? " selected" : ""}>${l}</option>`).join("")}</select></label>
          <label>Chronomètre par question (avec tic-tac)
            <select name="timer">${[[0, "Sans chrono"], [20, "20 secondes (pour tester)"], [60, "60 secondes"], [90, "90 secondes"], [120, "120 secondes"]].filter(([v]) => DEMO || v !== 20).map(([v, l]) => `<option value="${v}"${t === v ? " selected" : ""}>${l}</option>`).join("")}</select></label>
        </div>
        <div class="opts-row">
          <label>Comment répond-on au Trivial ?
            <select name="mode">${[["turn", "🔄 Tour par tour sur cet écran"], ["phones", "📱 Chacun sur son téléphone, en même temps"]].map(([v, l]) => `<option value="${v}"${S.settings.mode === v ? " selected" : ""}>${l}</option>`).join("")}</select></label>
          <label>Niveau des questions
            <select name="level">${[["hard", `💀 Difficiles d'abord (${NHARD} questions EDN+)`], ["all", "Tout mélangé"], ["std", "Standard seulement"]].map(([v, l]) => `<option value="${v}"${S.settings.level === v ? " selected" : ""}>${l}</option>`).join("")}</select></label>
        </div>
        <div class="btn-row" style="margin-top:8px">
          <button class="btn btn-primary btn-big pulse" type="submit" data-next="1">${has ? "Enregistrer et ouvrir le cours" : "Commencer par les fiches"}</button>
          <button class="btn" type="submit" data-next="2">${has ? "Reprendre le Trivial" : "Directement au Trivial"}</button>
        </div>
      </form>
      ${has ? `<div class="btn-row" style="margin-top:14px"><button class="btn" id="reset-btn" type="button">Nouvelle partie (tout effacer)</button></div>` : ""}
      <div class="note info" style="margin-top:14px"><b>📱 Sur un téléphone ?</b> Pour rejoindre une partie lancée sur l'ordinateur, scannez son QR code, ou tapez le code de salle : <form id="join-form" style="display:inline-flex;gap:6px;margin-top:6px"><input name="code" maxlength="5" placeholder="CODE" style="width:92px;text-transform:uppercase;border:1px solid var(--border);border-radius:8px;padding:6px 8px;background:var(--surface);color:var(--text);font-weight:800;letter-spacing:.1em"><button class="btn" type="submit" style="padding:6px 12px">Rejoindre</button></form></div>
      <p style="margin-top:12px"><small>La partie est enregistrée dans ce navigateur : un rechargement de la page ne fait rien perdre. Raccourcis : <span class="kbd">A</span>–<span class="kbd">E</span> pour cocher, <span class="kbd">Entrée</span> pour valider, <span class="kbd">M</span> pour couper le son (bouton 🔊 en haut à droite).</small></p>
    </div>
  </div>`;
  $("#join-form").addEventListener("submit", e => {
    e.preventDefault();
    const c = e.target.code.value.trim().toUpperCase();
    if (c.length >= 4) location.href = `${location.pathname}?join=${encodeURIComponent(c)}`;
  });
  let next = 1;
  $$("#setup-form [data-next]").forEach(b => b.addEventListener("click", () => { next = +b.dataset.next; }));
  $$("#setup-form input").forEach((inp, i) => inp.addEventListener("input", () => {
    const av = inp.previousElementSibling;
    av.textContent = inp.value.trim() ? inp.value.trim().charAt(0).toUpperCase() : String(i + 1);
    bump(av, "bounce");
    Sound.play("tick");
  }));
  $("#setup-form").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const nm = [0, 1, 2].map(i => f["p" + i].value.trim()).map((v, i) => v || `Joueur ${i + 1}`);
    if (S.players.length) S.players.forEach((p, i) => p.name = nm[i]);
    else S.players = nm.map(name => ({ name }));
    S.settings.rounds = +f.rounds.value; S.settings.timer = +f.timer.value;
    S.settings.level = f.level.value;
    const wasPhones = PHONES(); S.settings.mode = f.mode.value;
    if (wasPhones && !PHONES()) Net.stop();
    if (S.trivial.done && S.trivial.round <= S.settings.rounds && remainingTotal() > 0) S.trivial.done = false;
    save(); Sound.play("start"); go(next, true);
  });
  const rb = $("#reset-btn");
  if (rb) rb.addEventListener("click", () => {
    if (confirm("Effacer la partie en cours (scores, réponses, cas cliniques, progression des fiches) ?")) { resetAll(); Sound.play("whoosh"); go(0, true); }
  });
}
function resetAll() {
  if (Net.role === "host") { Net.send("down", null, true); Net.stop(); }
  S = freshState(); lastScores = null; lastWedges = null; save();
  $$(".game[data-game]").forEach(g => startGame(g.dataset.game));
  $$("details.acc").forEach(d => { d.classList.remove("reciting"); setMode(d, "read"); });
  $$(".flash").forEach(f => f.classList.remove("ok", "ko", "flipped"));
  renderCourseProgress();
}

/* =====================================================================
   ÉTAPE 1 — FICHES INTERACTIVES
   ===================================================================== */
const TL = [
  { l: "Urticaire, anaphylaxie", s: "minutes → heures", a: 1, b: 360, c: "var(--bad)" },
  { l: "Érythème pigmenté fixe", s: "< 48 h", a: 30, b: 2880, c: "var(--c-semio)" },
  { l: "Phototoxicité", s: "heures (après le soleil)", a: 60, b: 1440, c: "var(--c-semio)" },
  { l: "PEAG", s: "1 → 11 j", a: 1440, b: 15840, c: "var(--c-urg)" },
  { l: "Exanthème maculo-papuleux", s: "4 → 14 j", a: 5760, b: 20160, c: "var(--c-semio)" },
  { l: "Nécrolyse épidermique", s: "4 → 28 j", a: 5760, b: 40320, c: "var(--bad)" },
  { l: "Photoallergie", s: "7 → 21 j", a: 10080, b: 30240, c: "var(--c-semio)" },
  { l: "DRESS", s: "2 → 6 sem", a: 20160, b: 60480, c: "var(--bad)" },
  { l: "Psoriasiforme, lupus induit", s: "semaines → mois", a: 30240, b: 259200, c: "var(--c-semio)" }
];
const TL_MAX = Math.log10(300000);
const tlPos = m => (Math.log10(Math.max(m, 1)) / TL_MAX * 100);
function renderTimeline() {
  const ticks = [[1, "1 min"], [60, "1 h"], [1440, "1 j"], [10080, "1 sem"], [43200, "1 mois"], [259200, "6 mois"]];
  $("#timeline").innerHTML = TL.map((r, i) => `<div class="tl-row"><div class="lbl">${r.l}<small>${r.s}</small></div>
      <div class="tl-track"><div class="tl-bar" style="left:${tlPos(r.a)}%;width:${tlPos(r.b) - tlPos(r.a)}%;--bc:${r.c};--i:${i}" title="${r.l} : ${r.s}">${r.s}</div></div></div>`).join("") +
    `<div class="tl-axis"><div></div><div class="ticks">${ticks.map(([m, l]) => `<span style="left:${tlPos(m)}%">${l}</span>`).join("")}</div></div>`;
}
const OIC_SECTIONS = {
  "OIC-115-01-A": ["c-def"], "OIC-115-02-B": ["c-def"], "OIC-115-03-B": ["c-def"], "OIC-115-04-B": ["c-semio"],
  "OIC-115-05-B": ["c-def"], "OIC-115-06-A": ["c-semio", "c-urg", "c-cat"], "OIC-115-07-A": ["c-semio"],
  "OIC-115-08-A": ["c-semio", "c-cat"], "OIC-115-09-A": ["c-chrono", "c-semio"], "OIC-115-10-A": ["c-imput", "c-drugs"],
  "OIC-115-11-A": ["c-semio", "c-urg", "c-scores"], "OIC-325-01-A": ["c-pv"], "OIC-325-08-A": ["c-pv"],
  "OIC-325-09-B": ["c-imput"], "OIC-325-10-A": ["c-pv"], "OIC-325-20-B": ["c-pv"], "OIC-325-21-B": ["c-pv"], "OIC-332-13-A": ["c-cat"]
};
function renderOicTable() {
  let covered = 0;
  const rows = Object.keys(OIC).map(k => {
    const nq = QUESTIONS.filter(q => q.oic === k).length;
    const nc = CASES.reduce((a, C) => a + C.steps.filter(s => s.oic === k).length, 0);
    const ok = nq + nc > 0 && (OIC_SECTIONS[k] || []).length > 0;
    if (ok) covered++;
    const secs = (OIC_SECTIONS[k] || []).map(id => { const d = document.getElementById(id); return `<a href="#${id}" data-open="${id}">§${d ? d.dataset.sec : "?"}</a>`; }).join(" ");
    return `<tr><td>${ok ? "✅" : "⚠️"}</td><th>${k}</th><td><span class="rang rang-${rangOf(k)}">${rangOf(k)}</span></td><td>${esc(OIC[k])}</td><td>${secs}</td><td>${nq}</td><td>${nc}</td></tr>`;
  }).join("");
  $("#oic-table").innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>OIC</th><th>Rang</th><th>Objectif</th><th>Fiches</th><th>Questions</th><th>Étapes de cas</th></tr></thead><tbody>${rows}</tbody></table></div>
    <p class="muted">Les 11 objectifs de l'item 115 (7 de rang A, 4 de rang B) et les objectifs connexes des items 325 et 332 sont travaillés à la fois dans les fiches et dans le jeu.</p>`;
  $("#oic-cov-chip").textContent = `${covered}/${Object.keys(OIC).length} OIC couverts`;
}

const courseSecs = () => $$("details.acc[data-sec]").filter(d => +d.dataset.sec <= 9);
function secTasks(d) {
  const C = S.course, id = d.id, fx = CX[id] || {};
  const tasks = [{ k: "open", label: "📖 Lue", done: !!C.open[id] }];
  if ($$(".acc-body b.kw", d).length) tasks.push({ k: "recite", label: "🙈 Récitée", done: !!C.recited[id] });
  if (fx.game) tasks.push({ k: "game", label: "🎯 Mini-jeu", done: !!C.games[id] });
  if (fx.cards && fx.cards.length) tasks.push({ k: "cards", label: "🧠 Cartes", done: fx.cards.every((_, i) => C.cards[`${id}:${i}`]) });
  return tasks;
}
function renderCourseProgress() {
  const secs = courseSecs();
  if (!secs.length) return;
  let total = 0, done = 0;
  secs.forEach(d => {
    const tasks = secTasks(d), n = tasks.filter(t => t.done).length;
    total += tasks.length; done += n;
    d.classList.toggle("seen", n === tasks.length);
    const m = $(".mastery", d);
    if (m) { m.textContent = n === tasks.length ? "✓ maîtrisée" : `${n}/${tasks.length}`; m.classList.toggle("full", n === tasks.length); }
    const tl = $(".tasks", d);
    if (tl) tl.innerHTML = tasks.map(t => `<span class="task${t.done ? " done" : ""}">${t.label}</span>`).join("");
  });
  const pct = Math.round(done / total * 100);
  $("#course-progress").style.width = pct + "%";
  $("#course-progress-lbl").textContent = `Préchauffage : ${done} / ${total} étapes (${pct} %)`;
  if (done === total && !S.course.cheer) {
    S.course.cheer = true; save();
    setTimeout(() => { Sound.play("fanfare"); Confetti.rain(); splash({ title: "Fiches maîtrisées !", sub: "Place au Trivial Pursuit", icon: "📚", ms: 1600 }); }, 250);
  }
}
function markTask() { save(); renderCourseProgress(); }

/* --- texte à trous --- */
function prepareCloze(d) {
  $$(".acc-body b", d).forEach(b => {
    if (b.closest(".study-bar, .game, .flash-zone, .semio-card h4, figure")) return;
    const t = b.textContent.trim();
    if (!t || /:\s*$/.test(t) || t.length > 70) return;
    b.classList.add("kw");
  });
}
function setMode(d, mode) {
  const kws = $$("b.kw", d);
  d.classList.toggle("reciting", mode === "recite");
  kws.forEach(k => k.classList.remove("shown"));
  $$(".study-mode button", d).forEach(b => b.classList.toggle("on", b.dataset.mode === mode));
  updateKwCount(d);
}
function updateKwCount(d) {
  const kws = $$("b.kw", d), shown = kws.filter(k => k.classList.contains("shown")).length;
  const c = $(".kw-count", d);
  if (c) c.textContent = d.classList.contains("reciting") ? `${shown} / ${kws.length} mots-clés retrouvés` : `${kws.length} mots-clés à retenir`;
}

/* --- mini-jeux : association, tri, photo-quiz --- */
const games = {};
function gameBlock(id, g) {
  return `<div class="game" id="game-${id}" data-game="${id}">
    <div class="game-head"><h3>🎯 ${esc(g.title)}</h3><span class="chip game-score"></span><button type="button" class="btn-ph" data-game-reset>🔄 Rejouer</button></div>
    <p class="muted game-help">${esc(g.help || { match: "Cliquez un élément à gauche, puis sa correspondance à droite.", sort: "Cliquez une étiquette, puis la colonne où elle doit aller.", photo: "Regardez la photo et choisissez le bon diagnostic." }[g.type])}</p>
    <div class="game-body"></div></div>`;
}
function startGame(id) {
  const g = CX[id].game, box = $(`#game-${id}`); if (!box) return;
  const el = $(".game-body", box);
  const st = games[id] = { err: 0, ok: 0, sel: null, total: 0, order: null, qi: 0, over: false };
  box.classList.remove("won");
  if (g.type === "match") {
    st.total = g.pairs.length;
    const right = shuffle(g.pairs.map((_, i) => i));
    el.innerHTML = `<div class="match enter-anim"><div class="col">${shuffle(g.pairs.map((_, i) => i)).map((i, k) => `<button type="button" class="mitem" data-ml="${i}" style="--i:${k}">${esc(g.pairs[i][0])}</button>`).join("")}</div>
      <div class="col">${right.map((i, k) => `<button type="button" class="mitem" data-mr="${i}" style="--i:${k}">${esc(g.pairs[i][1])}</button>`).join("")}</div></div>`;
  } else if (g.type === "sort") {
    st.total = g.items.length;
    el.innerHTML = `<div class="sort-pool enter-anim">${shuffle(g.items.map((_, i) => i)).map((i, k) => `<button type="button" class="mitem" data-si="${i}" style="--i:${k}">${esc(g.items[i][0])}</button>`).join("")}</div>
      <div class="buckets" style="--n:${g.buckets.length}">${g.buckets.map((b, j) => `<div class="bucket" data-bk="${j}" role="button" tabindex="0"><div class="bk-title">${esc(b)}</div><div class="bk-drop"></div></div>`).join("")}</div>`;
  } else if (g.type === "photo") {
    st.total = g.items.length; st.order = shuffle(g.items.map((_, i) => i));
    renderPhotoQ(id);
  }
  updateGameScore(id);
}
function renderPhotoQ(id) {
  const g = CX[id].game, st = games[id], el = $(`#game-${id} .game-body`);
  const it = g.items[st.order[st.qi]], im = IMG[it[0]];
  el.innerHTML = `<div class="pq"><div class="pq-photo"><img src="${esc(im.src)}" alt="Photo à identifier"></div>
    <div><p class="pq-q">Photo ${st.qi + 1} / ${st.order.length} : ${esc(g.ask || "de quelle toxidermie s'agit-il ?")}</p>
    <div class="pq-choices enter-anim">${g.choices.map((c, j) => `<button type="button" class="mitem" data-pc="${j}" style="--i:${j}">${esc(c)}</button>`).join("")}</div></div></div>`;
}
function updateGameScore(id) {
  const st = games[id], sc = $(`#game-${id} .game-score`);
  if (sc) sc.textContent = `${st.ok} / ${st.total}${st.err ? ` · ${st.err} erreur${st.err > 1 ? "s" : ""}` : ""}`;
}
function finishGame(id) {
  const st = games[id], box = $(`#game-${id}`);
  st.over = true; box.classList.add("won");
  const perfect = st.err === 0;
  $(".game-body", box).insertAdjacentHTML("beforeend", `<div class="game-result">${perfect ? "🏆 Sans faute !" : "🎉 Terminé"} · ${st.ok}/${st.total}${st.err ? ` · ${st.err} erreur${st.err > 1 ? "s" : ""} : rejouez pour faire un sans-faute` : ""}</div>`);
  const prev = S.course.games[id];
  S.course.games[id] = { done: true, err: prev && prev.done ? Math.min(prev.err, st.err) : st.err };
  markTask();
  Sound.play(perfect ? "fanfare" : "wedge");
  Confetti.fromEl(box, { n: perfect ? 110 : 60 });
}
document.addEventListener("click", e => {
  const box = e.target.closest(".game[data-game]"); if (!box) return;
  const id = box.dataset.game, g = CX[id] && CX[id].game, st = games[id];
  if (!g) return;
  if (e.target.closest("[data-game-reset]")) { startGame(id); Sound.play("whoosh"); return; }
  if (!st || st.over) return;
  const b = e.target.closest("button.mitem");
  if (g.type === "match" && b) {
    if (b.classList.contains("matched")) return;
    if (b.dataset.ml !== undefined) {
      $$("[data-ml]", box).forEach(x => x.classList.remove("picked"));
      b.classList.add("picked"); st.sel = +b.dataset.ml; Sound.play("click"); return;
    }
    if (st.sel === null) { bump(b, "nope"); Sound.play("nope"); toast("Choisissez d'abord un élément à gauche."); return; }
    const l = $(`[data-ml="${st.sel}"]`, box);
    if (g.pairs[st.sel][1] === g.pairs[+b.dataset.mr][1]) {
      l.classList.remove("picked"); l.classList.add("matched"); b.classList.add("matched");
      st.ok++; Sound.play("ding");
    } else { st.err++; bump(b, "nope"); bump(l, "nope"); Sound.play("nope"); }
    st.sel = null; $$("[data-ml]", box).forEach(x => x.classList.remove("picked"));
    updateGameScore(id);
    if (st.ok === st.total) finishGame(id);
    return;
  }
  if (g.type === "sort") {
    if (b && b.dataset.si !== undefined && !b.classList.contains("matched")) {
      $$("[data-si]", box).forEach(x => x.classList.remove("picked"));
      b.classList.add("picked"); st.sel = +b.dataset.si;
      $$(".bucket", box).forEach(x => x.classList.add("armed"));
      Sound.play("click"); return;
    }
    const bk = e.target.closest(".bucket");
    if (bk) {
      if (st.sel === null) { bump(bk, "nope"); Sound.play("nope"); toast("Choisissez d'abord une étiquette."); return; }
      const chip = $(`[data-si="${st.sel}"]`, box);
      if (g.items[st.sel][1] === +bk.dataset.bk) {
        chip.classList.remove("picked"); chip.classList.add("matched"); $(".bk-drop", bk).appendChild(chip);
        st.ok++; Sound.play("ding");
      } else { st.err++; bump(bk, "nope"); bump(chip, "nope"); Sound.play("nope"); }
      st.sel = null; $$(".bucket", box).forEach(x => x.classList.remove("armed"));
      updateGameScore(id);
      if (st.ok === st.total) finishGame(id);
    }
    return;
  }
  if (g.type === "photo" && b && b.dataset.pc !== undefined) {
    const it = g.items[st.order[st.qi]], choice = g.choices[+b.dataset.pc];
    $$("[data-pc]", box).forEach(x => { x.disabled = true; if (g.choices[+x.dataset.pc] === it[1]) x.classList.add("right"); });
    if (choice === it[1]) { st.ok++; Sound.play("ding"); } else { st.err++; b.classList.add("wrongc"); bump(b, "nope"); Sound.play("nope"); }
    updateGameScore(id);
    setTimeout(() => {
      st.qi++;
      if (st.qi >= st.order.length) { $(".pq-choices", box).innerHTML = ""; finishGame(id); }
      else renderPhotoQ(id);
    }, choice === it[1] ? 750 : 1500);
  }
});

/* --- cartes flash --- */
function flashBlock(id, cards) {
  return `<div class="flash-zone"><div class="game-head"><h3>🧠 Vérifie-toi : cartes flash</h3><span class="chip flash-count"></span></div>
    <p class="muted game-help">Chacun répond à voix haute, puis on retourne la carte et on est honnête.</p>
    <div class="flash-grid">${cards.map(([q, a], i) => `<div class="flash" data-card="${id}:${i}" tabindex="0" role="button" aria-label="Carte ${i + 1}">
      <div class="flash-inner"><div class="flash-face flash-front"><small>Carte ${i + 1}</small><p>${esc(q)}</p><span class="hint">Cliquer pour retourner ↻</span></div>
      <div class="flash-face flash-back"><small>Réponse</small><p>${esc(a)}</p><div class="know"><button type="button" class="k-ok" data-know="ok">✓ Je savais</button><button type="button" class="k-ko" data-know="ko">↻ À revoir</button></div></div></div></div>`).join("")}</div></div>`;
}
function paintCards(d) {
  $$(".flash", d).forEach(f => { const v = S.course.cards[f.dataset.card]; f.classList.toggle("ok", v === "ok"); f.classList.toggle("ko", v === "ko"); });
  const fz = $(".flash-zone", d); if (!fz) return;
  const all = $$(".flash", d), known = all.filter(f => S.course.cards[f.dataset.card] === "ok").length, seen = all.filter(f => S.course.cards[f.dataset.card]).length;
  $(".flash-count", fz).textContent = `${known} sue${known > 1 ? "s" : ""} · ${seen}/${all.length} vues`;
}
document.addEventListener("click", e => {
  const f = e.target.closest(".flash"); if (!f) return;
  const k = e.target.closest("[data-know]");
  if (k) {
    e.stopPropagation();
    S.course.cards[f.dataset.card] = k.dataset.know;
    Sound.play(k.dataset.know === "ok" ? "ding" : "unclick");
    if (k.dataset.know === "ok") Confetti.fromEl(f, { n: 25, power: 6 });
    setTimeout(() => { f.classList.remove("flipped"); Sound.play("flip"); }, 350);
    paintCards(f.closest("details")); markTask();
    return;
  }
  f.classList.toggle("flipped"); Sound.play("flip");
});
document.addEventListener("keydown", e => {
  const f = e.target.closest && e.target.closest(".flash");
  if (f && (e.key === "Enter" || e.key === " ") && e.target === f) { e.preventDefault(); f.click(); }
});

function initCourse() {
  $$(".ph-slot").forEach(s => { s.outerHTML = photo(s.dataset.img); });
  if ($("#timeline")) renderTimeline();
  if ($("#oic-table")) renderOicTable();
  courseSecs().forEach(d => {
    prepareCloze(d);
    const body = $(".acc-body", d), fx = CX[d.id] || {}, nkw = $$("b.kw", d).length;
    $(".badges", d).insertAdjacentHTML("beforeend", `<span class="chip mastery">0/1</span>`);
    body.insertAdjacentHTML("afterbegin", `<div class="study-bar">
      ${nkw ? `<div class="seg study-mode"><button type="button" data-mode="read" class="on">📖 Lire</button><button type="button" data-mode="recite">🙈 Réciter (texte à trous)</button></div>
      <span class="chip kw-count"></span><button type="button" class="btn-ph" data-reveal-all>Tout révéler</button>` : ""}
      <span class="spacer"></span><span class="tasks"></span></div>`);
    if (fx.game) body.insertAdjacentHTML("beforeend", gameBlock(d.id, fx.game));
    if (fx.cards && fx.cards.length) body.insertAdjacentHTML("beforeend", flashBlock(d.id, fx.cards));
    if (fx.game) startGame(d.id);
    paintCards(d); updateKwCount(d);
  });
  $$("details.acc").forEach(d => d.addEventListener("toggle", () => {
    if (d.open) Sound.play("pop");
    if (d.open && !S.course.open[d.id]) { S.course.open[d.id] = true; markTask(); }
  }));
  document.addEventListener("click", e => {
    const m = e.target.closest(".study-mode [data-mode]");
    if (m) {
      const d = m.closest("details"); setMode(d, m.dataset.mode);
      Sound.play(m.dataset.mode === "recite" ? "whoosh" : "page");
      if (m.dataset.mode === "recite") toast("🙈 Dites chaque mot caché à voix haute, puis cliquez dessus pour vérifier.");
      return;
    }
    const ra = e.target.closest("[data-reveal-all]");
    if (ra) { const d = ra.closest("details"); $$("b.kw", d).forEach(k => k.classList.add("shown")); updateKwCount(d); Sound.play("page"); return; }
    const kw = e.target.closest(".reciting b.kw:not(.shown)");
    if (kw) {
      kw.classList.add("shown"); Sound.play("pop");
      const d = kw.closest("details"); updateKwCount(d);
      if ($$("b.kw", d).every(k => k.classList.contains("shown")) && !S.course.recited[d.id]) {
        S.course.recited[d.id] = true; markTask();
        Sound.play("wedge"); Confetti.fromEl($(".study-bar", d), { n: 70 });
        toast("🙈 Fiche récitée en entier, bravo !");
      }
      return;
    }
    const a = e.target.closest("[data-open]");
    if (a) { e.preventDefault(); openSection(a.dataset.open); }
  });
  $$(".checklist li").forEach(li => li.addEventListener("click", () => {
    li.classList.toggle("done");
    Sound.play(li.classList.contains("done") ? "click" : "unclick");
    if ($$(".checklist li").every(x => x.classList.contains("done"))) { Sound.play("fanfare"); Confetti.rain(); toast("✅ Tout est vérifié : vous pouvez lancer le vrai jeu !"); }
  }));
  renderCourseProgress();
  $("#credits").innerHTML = Object.values(IMG).map(im => `<li>${esc(im.cap)} — ${esc(im.credit)}, ${esc(im.lic)}, <a href="${esc(im.page)}" target="_blank" rel="noopener">source</a></li>`).join("");
}
function openSection(id) {
  if (S.screen !== 1) go(1);
  const d = document.getElementById(id); if (!d) return;
  d.open = true;
  setTimeout(() => d.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
}
function courseStats() {
  const secs = courseSecs(); let total = 0, done = 0;
  secs.forEach(d => { const t = secTasks(d); total += t.length; done += t.filter(x => x.done).length; });
  const toReview = [];
  Object.entries(S.course.cards).forEach(([k, v]) => {
    if (v !== "ko") return;
    const [id, i] = k.split(":"); const c = CX[id] && CX[id].cards && CX[id].cards[+i];
    const d = document.getElementById(id);
    if (c) toReview.push({ q: c[0], a: c[1], sec: d ? $(".t", d).textContent : id });
  });
  const known = Object.values(S.course.cards).filter(v => v === "ok").length;
  return { pct: total ? Math.round(done / total * 100) : 0, toReview, known };
}

/* =====================================================================
   ÉTAPE 2 — TRIVIAL PURSUIT
   ===================================================================== */
const inLevel = q => S.settings.level !== "std" || !q.hard;
const levelQs = () => QUESTIONS.filter(inLevel);
const remaining = cat => QUESTIONS.filter(q => q.cat === cat && inLevel(q) && !S.trivial.asked.includes(q.id)).length;
const remainingTotal = () => levelQs().filter(q => !S.trivial.asked.includes(q.id)).length;
const NHARD = QUESTIONS.filter(q => q.hard).length;
const WHEEL_LABEL = { semio: "Sémio", chrono: "Chrono", grav: "Gravité", urg: "Urgences", pv: "Pharmaco" };
let spinning = false, animKey = null, revealKey = null;

function wheelSVG() {
  const c = 150, r = 144;
  const segs = CATS.map((cat, i) => {
    const a0 = -90 + i * 72, a1 = a0 + 72, mid = (a0 + a1) / 2;
    const tx = c + r * 0.62 * Math.cos(mid * Math.PI / 180), ty = c + r * 0.62 * Math.sin(mid * Math.PI / 180);
    const empty = remaining(cat.id) === 0;
    return `<path d="${arc(c, c, r, a0, a1)}" style="fill:var(${cat.css});opacity:${empty ? 0.25 : 1};stroke:var(--surface);stroke-width:3"/>
      <g transform="translate(${tx.toFixed(1)},${ty.toFixed(1)}) rotate(${mid + 90})">
        <text text-anchor="middle" y="-6" style="font-size:22px;fill:#fff">${cat.icon}</text>
        <text text-anchor="middle" y="16" style="font-size:12.5px;font-weight:800;fill:#fff;letter-spacing:.02em">${esc(WHEEL_LABEL[cat.id])}</text></g>`;
  }).join("");
  const pegs = Array.from({ length: 10 }, (_, k) => { const a = (-90 + k * 36) * Math.PI / 180; return `<circle class="peg" cx="${(c + 136 * Math.cos(a)).toFixed(1)}" cy="${(c + 136 * Math.sin(a)).toFixed(1)}" r="4"/>`; }).join("");
  return `<div class="wheel-box"><div class="pointer"></div>
    <svg id="wheel" viewBox="0 0 300 300" style="transform:rotate(${S.trivial.rot}deg)" role="img" aria-label="Roue des catégories">${segs}${pegs}
      <circle cx="150" cy="150" r="30" style="fill:var(--surface);stroke:var(--border);stroke-width:3"/>
      <text x="150" y="157" text-anchor="middle" style="font-size:${DEMO ? 15 : 20}px;font-weight:800;fill:var(--accent)">${DEMO ? "TEST" : "115"}</text></svg></div>`;
}

function renderTrivial() {
  clearInterval(timerId);
  if (PHONES()) { renderTrivialPhones(); return; }
  const T = S.trivial, root = $("#trivial");
  if (T.done) { root.innerHTML = trivialEnd(); return; }
  const p = S.players[T.turn];
  const maxR = S.settings.rounds >= 99 ? "∞" : S.settings.rounds;
  root.innerHTML = `<div class="trivial-layout">
    <aside class="side">
      <div class="card turn-card" style="--pc:${PCOLORS[T.turn]}">
        <div class="eyebrow">Manche ${T.round} / ${maxR}</div>
        <div class="big">${esc(p.name)}</div><br>
        <small>${T.cur ? (T.cur.answered ? "a répondu" : "répond à la question") : "lance la roue"}</small>
        ${wheelSVG()}
        <button class="btn btn-primary btn-big${T.cur ? "" : " pulse"}" id="spin-btn" style="width:100%" ${T.cur || spinning ? "disabled" : ""}>🎡 Lancer la roue</button>
      </div>
      <div class="card">
        <h3>Catégories</h3>
        <div class="cat-legend">${CATS.map(c => `<div style="--cc:var(${c.css})"><span class="sw"></span><span class="nm">${c.name}</span><small>${remaining(c.id)}</small>
          <button data-pick="${c.id}" title="Choisir cette catégorie sans tourner la roue" ${T.cur || spinning || !remaining(c.id) ? "disabled" : ""}>Choisir</button></div>`).join("")}</div>
        <p style="margin:12px 0 0"><small>Un camembert s'obtient avec une réponse parfaite (10/10) dans la catégorie. Les 5 camemberts rapportent +${WEDGE_BONUS} points.</small></p>
        <div class="btn-row" style="margin-top:10px"><button class="btn" id="end-trivial">Terminer le Trivial</button></div>
      </div>
    </aside>
    <div id="qzone">${T.cur ? questionHTML() : `<div class="card end-card"><div style="font-size:3rem;display:inline-block;animation:wiggle 1.2s ease-in-out infinite">🎡</div><h2>${esc(p.name)}, à toi !</h2><p class="muted">Lance la roue pour tirer une catégorie. Les deux autres écoutent : la question suivante sera pour eux.</p></div>`}</div>
  </div>`;
  $("#spin-btn").addEventListener("click", spin);
  $$("[data-pick]").forEach(b => b.addEventListener("click", () => { Sound.play("land"); pickQuestion(b.dataset.pick); }));
  $("#end-trivial").addEventListener("click", () => {
    if (confirm("Terminer le Trivial maintenant et afficher le classement ?")) { S.trivial.done = true; S.trivial.cur = null; save(); renderTrivial(); renderScorebar(); celebrateEnd(); }
  });
  if (T.cur) bindQuestion();
}

function angleOf(el) {
  const m = getComputedStyle(el).transform;
  if (!m || m === "none") return 0;
  const v = m.match(/matrix\(([^)]+)\)/); if (!v) return 0;
  const [a, b] = v[1].split(",").map(Number);
  return Math.atan2(b, a) * 180 / Math.PI;
}
function spin() {
  if (spinning || S.trivial.cur) return;
  const avail = CATS.filter(c => remaining(c.id) > 0);
  if (!avail.length) { S.trivial.done = true; save(); renderTrivial(); return; }
  const cat = avail[Math.floor(Math.random() * avail.length)];
  const i = CATS.indexOf(cat);
  const target = (i * 72 + 36 + (Math.random() - 0.5) * 44 + 360) % 360;
  const cur = S.trivial.rot || 0;
  const rot = cur - (((cur % 360) + 360) % 360) + 360 * 5 + ((360 - target) % 360);
  spinning = true;
  const btn = $("#spin-btn"); btn.disabled = true; btn.classList.remove("pulse");
  $$("[data-pick]").forEach(b => b.disabled = true);
  const w = $("#wheel"), box = w.closest(".wheel-box"), ptr = $(".pointer", box);
  Sound.play("whoosh");
  requestAnimationFrame(() => { w.style.transform = `rotate(${rot}deg)`; });
  S.trivial.rot = rot; save();
  const dur = REDUCED ? 1300 : 3500, t0 = performance.now();
  let last = null, acc = 0, lastPeg = 0;
  const track = () => {
    const a = angleOf(w);
    if (last !== null) { let d = a - last; if (d < -180) d += 360; if (d > 180) d -= 360; acc += d; }
    last = a;
    const peg = Math.floor(acc / 36);
    if (peg !== lastPeg) { Sound.play("ratchet"); bump(ptr, "flap"); lastPeg = peg; }
    if (performance.now() - t0 < dur) requestAnimationFrame(track);
  };
  requestAnimationFrame(track);
  setTimeout(() => {
    spinning = false;
    box.style.setProperty("--lc", `var(${cat.css})`); box.classList.add("landed");
    Sound.play("land");
    splash({ title: esc(cat.name), icon: cat.icon, color: `var(${cat.css})`, sub: PHONES() ? "Répondez sur vos téléphones 📱" : `Question pour ${esc(S.players[S.trivial.turn].name)}`, ms: 1150 });
    setTimeout(() => pickQuestion(cat.id), REDUCED ? 200 : 650);
  }, dur);
}

function pickQuestion(catId) {
  let pool = QUESTIONS.filter(q => q.cat === catId && inLevel(q) && !S.trivial.asked.includes(q.id));
  if (!pool.length) { toast("Plus de question dans cette catégorie."); return; }
  if (S.settings.level === "hard" && pool.some(q => q.hard)) pool = pool.filter(q => q.hard);
  const q = pool[Math.floor(Math.random() * pool.length)];
  S.trivial.asked.push(q.id);
  S.trivial.cur = { qid: q.id, sel: [], text: "", order: [], shuffled: q.type === "order" ? shuffle(q.items) : null, answered: false, pts: 0,
    deadline: S.settings.timer ? Date.now() + S.settings.timer * 1000 + 900 : 0, answers: {}, revealed: false, results: null };
  save(); renderTrivial();
  if (PHONES()) publishState();
}

function typeLabel(q) {
  return { qcu: "QCU · une seule réponse", qrm: "QRM · plusieurs réponses (barème EDN)", qrp: `QRP · exactement ${q.n} réponses`, qroc: "QROC · réponse courte", num: "Calcul", order: "Classement" }[q.type];
}
function timerHTML() {
  return `<div class="tring" id="timer" title="Temps restant"><svg viewBox="0 0 36 36" aria-hidden="true"><circle class="bg" cx="18" cy="18" r="15.9"/><circle class="fg" cx="18" cy="18" r="15.9" pathLength="100" stroke-dasharray="100" stroke-dashoffset="0"/></svg><b>${S.settings.timer}</b></div>`;
}

function questionHTML() {
  const T = S.trivial, cur = T.cur, q = qById[cur.qid], cat = catById[q.cat], ans = cur.answered;
  const pIdx = ans ? cur.p : T.turn, p = S.players[pIdx];
  const key = cur.qid, enter = animKey !== key; animKey = key;
  const reveal = ans && revealKey === key; if (reveal) revealKey = null;
  let body = "";
  if (q.o) {
    body = `<div class="opts${q.o.length > 6 ? " xl" : ""}" role="${q.type === "qcu" ? "radiogroup" : "group"}">${q.o.map((o, i) => {
      let cls = "", tag = "";
      const sel = cur.sel.includes(i);
      if (ans) {
        const good = q.type === "qcu" ? i === q.a : q.a.includes(i);
        if (good && sel) { cls = "good"; tag = "✓ juste"; }
        else if (good) { cls = "miss"; tag = "oubliée"; }
        else if (sel) { cls = "bad"; tag = "✗ fausse"; }
      } else if (sel) cls = "sel";
      return `<button class="opt ${cls}" style="--i:${i}" data-opt="${i}" ${ans ? "disabled" : ""} aria-pressed="${sel}"><span class="l">${LETTERS[i]}</span><span>${esc(o)}</span>${tag ? `<span class="tag">${tag}</span>` : ""}</button>`;
    }).join("")}</div>`;
  } else if (q.type === "qroc" || q.type === "num") {
    body = `<form class="qroc" id="qroc-form"><input id="qroc-in" type="text" inputmode="${q.type === "num" ? "decimal" : "text"}" placeholder="${q.type === "num" ? "Votre résultat (nombre)" : "Votre réponse"}" value="${esc(cur.text)}" ${ans ? "disabled" : ""} autocomplete="off">${q.unit ? `<span class="chip">${esc(q.unit)}</span>` : ""}</form>`;
  } else if (q.type === "order") {
    const pool = cur.shuffled.filter(t => !cur.order.includes(t));
    body = `<div class="order-pool" aria-label="Éléments à classer">${pool.map((t, i) => `<button class="order-item" style="--i:${i}" data-add="${esc(t)}" ${ans ? "disabled" : ""}>${esc(t)}</button>`).join("") || `<small>Tout est placé.</small>`}</div>
      <div class="order-out" aria-label="Votre classement">${cur.order.map(t => `<button class="order-item" data-rem="${esc(t)}" ${ans ? "disabled" : ""}>${esc(t)}</button>`).join("") || `<small>Cliquez les éléments dans l'ordre, du premier au dernier.</small>`}</div>
      ${ans ? "" : `<div class="btn-row" style="margin-top:8px"><button class="btn" id="order-reset">Recommencer le classement</button></div>`}`;
  }
  const hint = qHint(q);
  const grade = ans ? (cur.pts >= 10 ? "ok" : cur.pts > 0 ? "mid" : "ko") : "";
  const hasAnswer = cur.sel.length || cur.text.trim() || (q.items && cur.order.length === q.items.length);
  return `<article class="card qcard${enter ? " enter" : ""}${reveal ? " reveal " + grade : ""}" style="--cc:var(${cat.css})">
    <div class="q-head"><span class="chip cat-chip" style="--cc:var(${cat.css})">${cat.icon} ${esc(cat.name)}</span><span class="chip">${typeLabel(q)}</span>${q.hard ? `<span class="chip hard-chip">💀 EDN+</span>` : ""}<span class="spacer"></span>
      <span class="chip" style="background:color-mix(in srgb,${PCOLORS[pIdx]} 18%,transparent);color:${PCOLORS[pIdx]}">${esc(p.name)}</span>
      ${S.settings.timer && !ans ? timerHTML() : ""}</div>
    <div class="q-text">${esc(q.q)}</div>${hint}
    ${q.img ? photo(q.img, ans ? { hidden: false } : { spoiler: true, rid: "q:" + q.id }) : ""}
    ${body}
    ${ans ? feedbackHTML(q, cur) : `<div class="btn-row" style="margin-top:14px"><button class="btn btn-primary btn-big${hasAnswer ? " pulse" : ""}" id="validate-btn">Valider la réponse</button></div>`}
  </article>`;
}

function qHint(q) {
  if (q.type === "qrm") return `<p class="q-hint">Barème EDN : 0 discordance = 10 · 1 discordance = 5 · 2 = 2 · au-delà = 0.</p>`;
  if (q.type === "qrp") return `<p class="q-hint">Cochez exactement ${q.n} réponses · barème proportionnel au nombre de bonnes réponses.</p>`;
  return "";
}
function rightAnswer(q) {
  if (q.type === "qcu") return `${LETTERS[q.a]}. ${q.o[q.a]}`;
  if (q.type === "qrm" || q.type === "qrp") return q.a.map(i => `${LETTERS[i]}. ${q.o[i]}`).join(" · ");
  if (q.type === "qroc") return q.expected;
  if (q.type === "num") return `${q.a} ${q.unit || ""}`.trim();
  if (q.type === "order") return q.items.join(" → ");
  return "";
}

function feedbackHTML(q, cur) {
  const pts = cur.pts, jury = cur.jury;
  const cls = pts >= 10 ? "ok" : pts > 0 ? "mid" : "ko";
  const label = pts >= 10 ? (jury ? "Validé par le jury" : ["Bonne réponse !", "Parfait !", "Exactement !", "Bien joué !"][cur.qid.length % 4])
    : pts > 0 ? (q.type === "order" ? "Presque : une inversion" : q.type === "qrp" ? `Presque : ${q.n - cur.disc}/${q.n} bonnes réponses` : `Presque : ${cur.disc} discordance${cur.disc > 1 ? "s" : ""}`)
    : cur.timeout ? "Temps écoulé !" : "Raté";
  const showRight = q.type === "qroc" || q.type === "num" || q.type === "order" || pts < 10;
  const contest = (q.type === "qroc" || q.type === "num") && pts === 0 && !jury;
  const lastTurn = isLastQuestion();
  const sec = SKILLS[q.skill] && SKILLS[q.skill].sec;
  return `<div class="feedback" role="status">
    <div class="verdict ${cls}">${pts >= 10 ? "✅" : pts > 0 ? "🟠" : cur.timeout ? "⏰" : "❌"} ${label} <span class="chip">+${pts} pts</span> ${rangBadge(q.oic, q.col)}</div>
    ${showRight ? `<p><b>Réponse attendue :</b> ${esc(rightAnswer(q))}</p>` : ""}
    <div class="exp">${q.exp}</div>
    <div class="src">${oicLine(q.oic)}<span class="spacer" style="flex:1"></span>${sec && document.getElementById(sec) ? `<button class="btn" data-open="${sec}">Revoir la fiche</button>` : ""}</div>
    <div class="btn-row" style="margin-top:12px">
      ${contest ? `<button class="btn" id="jury-btn" title="Si votre formulation est correcte mais non reconnue">Le jury valide la réponse (+10)</button>` : ""}
      <button class="btn btn-primary btn-big pulse" id="next-btn">${lastTurn ? "Voir le classement du Trivial →" : `Au tour de ${esc(S.players[(cur.p + 1) % S.players.length].name)} →`}</button>
    </div></div>`;
}

function isLastQuestion() {
  const T = S.trivial;
  const nextTurn = (T.cur.p + 1) % S.players.length;
  const nextRound = nextTurn === 0 ? T.round + 1 : T.round;
  return nextRound > S.settings.rounds || remainingTotal() === 0;
}

function updateValidatePulse() {
  const cur = S.trivial.cur, q = qById[cur.qid], vb = $("#validate-btn");
  if (!vb) return;
  const has = cur.sel.length || cur.text.trim() || (q.items && cur.order.length === q.items.length);
  vb.classList.toggle("pulse", !!has);
}
function bindQuestion() {
  const cur = S.trivial.cur, q = qById[cur.qid];
  if (!cur.answered) {
    $$("#qzone [data-opt]").forEach(b => b.addEventListener("click", () => toggleOpt(+b.dataset.opt)));
    const inp = $("#qroc-in");
    if (inp) {
      inp.addEventListener("input", () => { cur.text = inp.value; save(); updateValidatePulse(); Sound.play("tick"); });
      $("#qroc-form").addEventListener("submit", e => { e.preventDefault(); validate(); });
      setTimeout(() => inp.focus(), 50);
    }
    $$("[data-add]").forEach(b => b.addEventListener("click", () => { cur.order.push(b.dataset.add); save(); Sound.play("click"); refreshQ(); }));
    $$("[data-rem]").forEach(b => b.addEventListener("click", () => { cur.order = cur.order.filter(t => t !== b.dataset.rem); save(); Sound.play("unclick"); refreshQ(); }));
    const or = $("#order-reset"); if (or) or.addEventListener("click", () => { cur.order = []; save(); Sound.play("whoosh"); refreshQ(); });
    $("#validate-btn").addEventListener("click", () => validate());
    if (S.settings.timer) startTimer();
  } else {
    $("#next-btn").addEventListener("click", nextTurn);
    const j = $("#jury-btn");
    if (j) j.addEventListener("click", () => {
      const had = !!wedgesOf(cur.p)[q.cat];
      cur.pts = 10; cur.jury = true;
      const l = S.log[S.log.length - 1]; if (l && l.qid === cur.qid) { l.pts = 10; l.jury = true; }
      save(); refreshQ(); renderScorebar();
      Sound.play("correct"); Confetti.fromEl($("#qzone .verdict"), { n: 60 });
      celebrateWedge(cur.p, q.cat, had);
    });
  }
}
function refreshQ() { clearInterval(timerId); $("#qzone").innerHTML = questionHTML(); bindQuestion(); }

function toggleOpt(i) {
  const cur = S.trivial.cur; if (!cur || cur.answered) return;
  const q = qById[cur.qid];
  if (!q.o || i >= q.o.length) return;
  const added = q.type === "qcu" ? true : !cur.sel.includes(i);
  if (added && q.type === "qrp" && cur.sel.length >= q.n) { toast(`${q.n} réponses maximum : décochez-en une d'abord.`); Sound.play("nope"); bump($(`#qzone [data-opt="${i}"]`), "nope"); return; }
  cur.sel = q.type === "qcu" ? [i] : (added ? cur.sel.concat(i) : cur.sel.filter(x => x !== i));
  save();
  $$("#qzone [data-opt]").forEach(b => { const on = cur.sel.includes(+b.dataset.opt); b.classList.toggle("sel", on); b.setAttribute("aria-pressed", String(on)); });
  updateValidatePulse();
  Sound.play(added ? "click" : "unclick");
}

function startTimer(onEnd = () => validate(true)) {
  const cur = S.trivial.cur, total = S.settings.timer * 1000;
  let lastSec = null;
  const tick = () => {
    const left = Math.max(0, Math.min(total, cur.deadline - Date.now())), sec = Math.ceil(left / 1000);
    const el = $("#timer");
    if (el) {
      $(".fg", el).setAttribute("stroke-dashoffset", (100 - left / total * 100).toFixed(1));
      $("b", el).textContent = sec;
      el.classList.toggle("low", sec <= 10 && sec > 5);
      el.classList.toggle("crit", sec <= 5 && sec > 0);
    }
    if (lastSec !== null && sec !== lastSec && sec > 0) {
      Sound.play(sec <= 5 ? "urgent" : sec % 2 ? "tick" : "tock");
      bump(el, "tickb");
    }
    lastSec = sec;
    if (left <= 0) { clearInterval(timerId); Sound.play("buzzer"); redFlash(); onEnd(); }
  };
  tick(); timerId = setInterval(tick, 200);
}

function scoreQuestion(q, cur) {
  switch (q.type) {
    case "qcu": return { pts: cur.sel[0] === q.a ? 10 : 0, given: cur.sel.length ? `${LETTERS[cur.sel[0]]}. ${q.o[cur.sel[0]]}` : "(pas de réponse)" };
    case "qrm": {
      let d = 0; q.o.forEach((_, i) => { if (cur.sel.includes(i) !== q.a.includes(i)) d++; });
      const given = cur.sel.length ? cur.sel.slice().sort((a, b) => a - b).map(i => `${LETTERS[i]}. ${q.o[i]}`).join(" · ") : "(aucune case cochée)";
      return { pts: d === 0 ? 10 : d === 1 ? 5 : d === 2 ? 2 : 0, disc: d, given };
    }
    case "qrp": {
      const ok = cur.sel.filter(i => q.a.includes(i)).length;
      const given = cur.sel.length ? cur.sel.slice().sort((a, b) => a - b).map(i => `${LETTERS[i]}. ${q.o[i]}`).join(" · ") : "(aucune case cochée)";
      return { pts: Math.round(10 * ok / q.n), disc: q.n - ok, given };
    }
    case "qroc": {
      const n = norm(cur.text);
      const ok = n.length > 1 && q.accept.some(a => { const na = norm(a); return n === na || n.includes(na); });
      return { pts: ok ? 10 : 0, given: cur.text || "(vide)" };
    }
    case "num": {
      const v = parseFloat(String(cur.text).replace(",", "."));
      return { pts: !isNaN(v) && Math.abs(v - q.a) <= q.tol ? 10 : 0, given: cur.text || "(vide)" };
    }
    case "order": {
      const idx = cur.order.map(t => q.items.indexOf(t));
      let inv = 0; for (let i = 0; i < idx.length; i++) for (let j = i + 1; j < idx.length; j++) if (idx[i] > idx[j]) inv++;
      const full = cur.order.length === q.items.length;
      return { pts: !full ? 0 : inv === 0 ? 10 : inv === 1 ? 5 : 0, disc: inv, given: cur.order.join(" → ") || "(vide)" };
    }
  }
  return { pts: 0, given: "" };
}

function answerProblem(q, a) {
  if (q.type === "qrp" && a.sel.length !== q.n) return `Cochez exactement ${q.n} réponses.`;
  if (q.o && !a.sel.length) return "Répondez d'abord (ou attendez la fin du chrono).";
  if ((q.type === "qroc" || q.type === "num") && !String(a.text || "").trim()) return "Écrivez une réponse.";
  if (q.type === "order" && a.order.length < q.items.length) return "Placez tous les éléments avant de valider.";
  return "";
}
function validate(timeout = false) {
  const T = S.trivial, cur = T.cur; if (!cur || cur.answered) return;
  const q = qById[cur.qid];
  if (!timeout) {
    const msg = answerProblem(q, cur);
    if (msg) { toast(msg); Sound.play("nope"); return; }
  }
  clearInterval(timerId);
  const p = T.turn, had = !!wedgesOf(p)[q.cat];
  const r = scoreQuestion(q, cur);
  Object.assign(cur, { answered: true, pts: r.pts, disc: r.disc, p, timeout });
  S.log.push({ p, qid: q.id, pts: r.pts, given: r.given });
  save();
  revealKey = cur.qid;
  refreshQ(); renderScorebar();
  const tb = $(".turn-card small"); if (tb) tb.textContent = "a répondu";
  if (r.pts >= 10) { Sound.play("correct"); Confetti.fromEl($("#qzone .verdict"), { n: 70 }); }
  else if (r.pts > 0) Sound.play("partial");
  else if (!timeout) Sound.play("wrong");
  if (r.pts >= 10) {
    celebrateWedge(p, q.cat, had);
    const st = streakOf(p);
    if (st >= 3) setTimeout(() => { Sound.play("streak"); toast(`🔥 ${S.players[p].name} enchaîne ${st} bonnes réponses !`); }, 1500);
  }
}

function celebrateWedge(p, cat, had) {
  if (had) return;
  const n = Object.keys(wedgesOf(p)).length;
  setTimeout(() => {
    Sound.play("wedge");
    toast(`🧀 Camembert « ${catById[cat].short} » pour ${S.players[p].name} !`);
    Confetti.fromEl($(`[data-pchip="${p}"]`), { n: 45, power: 7, dir: Math.PI / 2, spread: Math.PI * 1.4 });
  }, 700);
  if (n === CATS.length) setTimeout(() => {
    Sound.play("fanfare"); Confetti.rain();
    splash({ title: "Camembert complet !", sub: `${esc(S.players[p].name)} gagne +${WEDGE_BONUS} points`, icon: "🏆", color: PCOLORS[p], ms: 1800 });
  }, 1500);
}

function nextTurn() {
  const T = S.trivial;
  if (!T.cur || !T.cur.answered) return;
  const last = isLastQuestion();
  T.turn = (T.cur.p + 1) % S.players.length;
  if (T.turn === 0) T.round++;
  T.cur = null;
  if (last) T.done = true;
  save(); renderTrivial(); renderScorebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (last) celebrateEnd();
  else {
    Sound.play("turn");
    splash({ title: `À toi, ${esc(S.players[T.turn].name)} !`, icon: initial(S.players[T.turn].name), color: PCOLORS[T.turn],
      sub: `Manche ${T.round} / ${S.settings.rounds >= 99 ? "∞" : S.settings.rounds}`, ms: 1000 });
  }
}
function celebrateEnd() {
  Sound.play("drumroll", 0.9);
  setTimeout(() => { Sound.play("fanfare"); Confetti.rain(); }, 1000);
}

function trivialEnd() {
  const order = S.players.map((p, i) => ({ p, i, s: playerScore(i) })).sort((a, b) => b.s - a.s);
  const medals = ["🥇", "🥈", "🥉"];
  const canExtend = remainingTotal() > 0;
  return `<div class="card end-card enter qcard" style="--cc:var(--accent)">
    <div class="eyebrow">Fin du Trivial Pursuit</div>
    <h1>Classement provisoire</h1>
    <p class="muted">${S.log.length} réponses données · ${S.log.filter(l => l.pts >= 10).length} parfaites.</p>
    <div class="rank-list">${order.map((o, k) => `<div class="opt" style="--pc:${PCOLORS[o.i]};--i:${k};cursor:default"><span>${medals[k] || ""}</span><span class="avatar" style="width:30px;height:30px;font-size:.9rem">${initial(o.p.name)}</span>${esc(o.p.name)} ${pie(wedgesOf(o.i), 24)}<span class="pts" style="margin-left:auto">${o.s} pts</span></div>`).join("")}</div>
    <div class="btn-row" style="justify-content:center;margin-top:16px">
      <button class="btn btn-primary btn-big pulse" data-go="3">Passer ${CASES.length > 1 ? "aux cas cliniques" : "au cas clinique"} en équipe →</button>
      ${canExtend ? `<button class="btn" id="extend-btn">Jouer une manche de plus</button>` : ""}
      <button class="btn" data-go="4">Voir le bilan</button>
    </div></div>`;
}
document.addEventListener("click", e => {
  if (e.target.id === "extend-btn") {
    S.settings.rounds = Math.max(S.settings.rounds, S.trivial.round);
    S.trivial.done = false; save(); renderTrivial(); renderScorebar(); Sound.play("start");
  }
});

document.addEventListener("keydown", e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
  if (!typing && (e.key === "m" || e.key === "M")) { $("#sound-btn").click(); return; }
  if (S.screen !== 2 || !S.trivial.cur) return;
  const cur = S.trivial.cur;
  if (PHONES()) {
    if (e.key === "Enter" && !typing) { e.preventDefault(); if (cur.revealed) nextPhoneQ(); else if ($("#reveal-btn")) $("#reveal-btn").click(); }
    return;
  }
  if (e.key === "Enter" && !typing) {
    e.preventDefault();
    if (cur.answered) nextTurn(); else validate();
    return;
  }
  if (typing || cur.answered) return;
  const k = e.key.toUpperCase();
  let i = LETTERS.indexOf(k);
  if (i < 0 && /^[1-9]$/.test(e.key)) i = +e.key - 1;
  const qq = qById[cur.qid];
  if (i >= 0 && qq.o && i < qq.o.length) { e.preventDefault(); toggleOpt(i); }
});

/* =====================================================================
   MODE TÉLÉPHONES : l'écran affiche, chacun répond sur son téléphone
   Relais : MQTT sur WebSocket (broker public, sans compte)
   ===================================================================== */
const PHONES = () => S.settings.mode === "phones";
const MQTT_SRC = "https://cdn.jsdelivr.net/npm/mqtt@5.10.1/dist/mqtt.min.js";
const QR_SRC = "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js";
const BROKERS = ["wss://broker.hivemq.com:8884/mqtt", "wss://broker.emqx.io:8084/mqtt"];
const BROKER_NAMES = ["HiveMQ", "EMQX"];
const ROOM_ALPHA = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const scriptPromises = {};
function loadScript(src) {
  return scriptPromises[src] || (scriptPromises[src] = new Promise((res, rej) => {
    const el = document.createElement("script");
    el.src = src; el.async = true; el.crossOrigin = "anonymous";
    el.onload = () => res(); el.onerror = () => { delete scriptPromises[src]; rej(new Error("chargement impossible : " + src)); };
    document.head.appendChild(el);
  }));
}
const Net = {
  client: null, room: null, role: null, status: "off",
  topic(k) { return `toxiquest/v1/${this.room}/${k}`; },
  async start(role, room, broker, opts) {
    this.stop(true);
    this.role = role; this.room = room; this.opts = opts; this.setStatus("connecting");
    try { await loadScript(MQTT_SRC); } catch (e) { this.setStatus("error"); return; }
    const c = this.client = window.mqtt.connect(BROKERS[broker], {
      clientId: `tq-${role}-${Math.random().toString(16).slice(2, 10)}`, clean: true, keepalive: 30, reconnectPeriod: 2500, connectTimeout: 8000
    });
    c.on("connect", () => {
      this.setStatus("on");
      c.subscribe(this.topic(role === "host" ? "up" : "down"), { qos: 1 });
      if (opts.onConnect) opts.onConnect();
    });
    c.on("reconnect", () => this.setStatus("connecting"));
    c.on("offline", () => this.setStatus("off"));
    c.on("error", () => this.setStatus("error"));
    c.on("message", (t, buf) => {
      const raw = buf.toString(); if (!raw) return;
      let d; try { d = JSON.parse(raw); } catch (e) { return; }
      if (opts.onMessage) opts.onMessage(d);
    });
  },
  send(k, obj, retain = false) {
    if (this.client && this.client.connected) this.client.publish(this.topic(k), obj === null ? "" : JSON.stringify(obj), { qos: 1, retain });
  },
  setStatus(st) { this.status = st; if (this.opts && this.opts.onStatus) this.opts.onStatus(st); },
  stop(silent) { if (this.client) { try { this.client.end(true); } catch (e) { /* déjà fermé */ } } this.client = null; if (!silent) this.setStatus("off"); }
};
const netLabel = st => ({ connecting: "⏳ Connexion au relais…", on: "🟢 Relais connecté", off: "🔴 Hors ligne, reconnexion…", error: "⚠️ Relais injoignable (réseau ou bloqueur ?)" }[st] || "");

/* ---------- côté ordinateur ---------- */
const seen = [0, 0, 0];
let autoRevealT = null, hostFallbackT = null, lobbyTimer = null;
const online = i => seen[i] && Date.now() - seen[i] < 40000;
function genRoom() { let c = ""; for (let i = 0; i < 5; i++) c += ROOM_ALPHA[Math.floor(Math.random() * ROOM_ALPHA.length)]; return c; }
function joinURL() { return `${location.origin}${location.pathname}?join=${S.room.code}&b=${S.room.b}`; }
function totalQuestions() {
  const n = levelQs().length;
  return S.settings.rounds >= 99 ? n : Math.min(n, S.settings.rounds * S.players.length);
}
function ensureHost() {
  if (!PHONES() || !S.players.length) return;
  if (!S.room) { S.room = { code: genRoom(), b: 0 }; save(); }
  if (Net.role === "host" && Net.room === S.room.code && Net.status !== "off" && Net.status !== "error") return;
  startHost();
}
function startHost() {
  clearTimeout(hostFallbackT);
  Net.start("host", S.room.code, S.room.b, {
    onConnect: () => { publishState(); updateLobby(); },
    onStatus: () => updateLobby(),
    onMessage: onHostMsg
  });
  hostFallbackT = setTimeout(() => {
    if (Net.status !== "on" && PHONES()) { S.room.b = (S.room.b + 1) % BROKERS.length; save(); startHost(); renderQR(); }
  }, 15000);
  clearInterval(lobbyTimer); lobbyTimer = setInterval(updateLobby, 8000);
}
function hostState() {
  const T = S.trivial, cur = T.cur;
  const phase = T.done ? "end" : !cur ? "lobby" : cur.revealed ? "reveal" : "question";
  return { v: 1, app: DEMO ? "demo" : "jeu", phase, t: Date.now(),
    roster: S.players.map(p => p.name), n: (T.qn || 0) + 1, total: totalQuestions(),
    q: cur ? { qid: cur.qid, deadline: cur.deadline || 0 } : null,
    answered: cur ? S.players.map((_, i) => !!(cur.answers && cur.answers[i])) : [],
    results: cur && cur.revealed ? cur.results.map(r => r.pts) : null,
    scores: S.players.map((_, i) => playerScore(i)) };
}
function publishState() { if (PHONES() && Net.role === "host") Net.send("down", hostState(), true); }
function sanitizeAns(a) {
  a = a || {};
  return { sel: Array.isArray(a.sel) ? a.sel.filter(Number.isInteger).slice(0, 12) : [],
    text: String(a.text || "").slice(0, 140), order: Array.isArray(a.order) ? a.order.map(String).slice(0, 12) : [] };
}
function onHostMsg(d) {
  if (!d || !Number.isInteger(d.p) || !S.players[d.p]) return;
  const wasOnline = online(d.p);
  seen[d.p] = Date.now();
  if (d.k === "hello") {
    if (!wasOnline) { Sound.play("pop"); toast(`📱 ${S.players[d.p].name} est connecté(e)`); }
    updateLobby(); publishState(); return;
  }
  if (d.k === "answer") {
    const cur = S.trivial.cur;
    if (!cur || cur.revealed || d.qid !== cur.qid) return;
    cur.answers = cur.answers || {};
    const first = !cur.answers[d.p];
    cur.answers[d.p] = { ans: sanitizeAns(d.ans), at: Date.now() };
    save();
    if (first) Sound.play("click");
    updateAnswered(); publishState();
    clearTimeout(autoRevealT);
    if (S.players.every((_, i) => cur.answers[i])) autoRevealT = setTimeout(() => revealAll(), 1500);
  }
}
function updateLobby() {
  const ns = $("#net-status"); if (ns) ns.textContent = netLabel(Net.status) + (S.room ? ` · ${BROKER_NAMES[S.room.b]}` : "");
  S.players.forEach((_, i) => { const dot = $(`[data-lp="${i}"] .dot`); if (dot) dot.classList.toggle("on", !!online(i)); });
}
function renderQR() {
  const box = $("#qr"); if (!box || !S.room) return;
  const url = joinURL();
  const link = $("#join-link"); if (link) { link.href = url; }
  loadScript(QR_SRC).then(() => {
    const qr = window.qrcode(0, "M"); qr.addData(url); qr.make();
    box.innerHTML = qr.createSvgTag(4, 2);
  }).catch(() => { box.innerHTML = `<small>QR code indisponible : utilisez le lien ci-dessous.</small>`; });
}
function lobbyHTML() {
  if (!S.room) return "";
  return `<h3>📱 Rejoindre avec son téléphone</h3>
    <div class="qr-wrap"><div class="qr" id="qr"></div><div><div class="room-code" aria-label="Code de la salle">${S.room.code}</div>
      <small>Scannez le QR code avec l'appareil photo, puis choisissez votre prénom.</small><br><a id="join-link" target="_blank" rel="noopener" class="muted" style="font-size:.74rem">lien direct</a></div></div>
    <div class="net-status" id="net-status">${netLabel(Net.status)}</div>
    <div class="lobby-players">${S.players.map((p, i) => `<div class="lp" data-lp="${i}" style="--pc:${PCOLORS[i]}"><span class="avatar">${initial(p.name)}</span><span>${esc(p.name)}</span><span class="dot${online(i) ? " on" : ""}" title="connecté"></span></div>`).join("")}</div>
    <p class="muted" style="font-size:.72rem;margin:8px 0 0">Relais public gratuit (${BROKER_NAMES.join(" ou ")}) : seuls les prénoms et les réponses y transitent.</p>`;
}
function catsCardHTML() {
  const T = S.trivial;
  return `<div class="card">
    <h3>Catégories</h3>
    <div class="cat-legend">${CATS.map(c => `<div style="--cc:var(${c.css})"><span class="sw"></span><span class="nm">${c.name}</span><small>${remaining(c.id)}</small>
      <button data-pick="${c.id}" title="Choisir cette catégorie sans tourner la roue" ${T.cur || spinning || !remaining(c.id) ? "disabled" : ""}>Choisir</button></div>`).join("")}</div>
    <p style="margin:12px 0 0"><small>Un camembert s'obtient avec une réponse parfaite (10/10) dans la catégorie. Les 5 camemberts rapportent +${WEDGE_BONUS} points.${S.settings.level === "hard" ? " Niveau : 💀 questions EDN+ en priorité." : ""}</small></p>
    <div class="btn-row" style="margin-top:10px"><button class="btn" id="end-trivial">Terminer le Trivial</button></div>
  </div>`;
}
function bindTrivialCommon() {
  $("#spin-btn").addEventListener("click", spin);
  $$("[data-pick]").forEach(b => b.addEventListener("click", () => { Sound.play("land"); pickQuestion(b.dataset.pick); }));
  $("#end-trivial").addEventListener("click", () => {
    if (confirm("Terminer le Trivial maintenant et afficher le classement ?")) { S.trivial.done = true; S.trivial.cur = null; save(); renderTrivial(); renderScorebar(); publishState(); celebrateEnd(); }
  });
}
function renderTrivialPhones() {
  const T = S.trivial, root = $("#trivial");
  ensureHost();
  if (T.done) { root.innerHTML = trivialEnd(); publishState(); return; }
  const total = totalQuestions();
  root.innerHTML = `<div class="trivial-layout">
    <aside class="side">
      <div class="card turn-card" style="--pc:var(--accent)">
        <div class="eyebrow">Question ${Math.min((T.qn || 0) + 1, total)} / ${total}</div>
        <div class="big">📱 Tout le monde joue</div><br>
        <small>${T.cur ? (T.cur.revealed ? "correction" : "réponses sur les téléphones") : "lancez la roue"}</small>
        ${wheelSVG()}
        <button class="btn btn-primary btn-big${T.cur ? "" : " pulse"}" id="spin-btn" style="width:100%" ${T.cur || spinning ? "disabled" : ""}>🎡 Lancer la roue</button>
      </div>
      <div class="card lobby">${lobbyHTML()}</div>
      ${catsCardHTML()}
    </aside>
    <div id="qzone">${T.cur ? phoneQHTML() : `<div class="card end-card"><div style="font-size:3rem;display:inline-block;animation:wiggle 1.2s ease-in-out infinite">📱</div><h2>Tout le monde sur son téléphone !</h2><p class="muted">Scannez le QR code, choisissez votre prénom, puis lancez la roue : la question s'affichera ici et sur chaque téléphone. Chacun répond de son côté, sans voir les réponses des autres.</p></div>`}</div>
  </div>`;
  bindTrivialCommon();
  renderQR();
  if (T.cur) bindPhoneQ();
}
const shortGiven = (q, a) => {
  if (!a) return "pas de réponse";
  if (q.o) return a.ans.sel.length ? a.ans.sel.slice().sort((x, y) => x - y).map(i => LETTERS[i]).join(", ") : "rien coché";
  if (q.type === "order") return a.ans.order.length ? a.ans.order.map(t => t.split(" ")[0]).join(" → ") : "vide";
  return a.ans.text || "vide";
};
function answeredRowHTML() {
  const cur = S.trivial.cur, q = qById[cur.qid], rev = cur.revealed;
  return `<div class="answered-row">${S.players.map((p, i) => {
    const a = cur.answers && cur.answers[i], r = rev && cur.results[i];
    const cls = r ? (r.pts >= 10 ? " ok" : r.pts > 0 ? " mid" : " ko") : a ? " in" : "";
    const line = r ? `${r.pts >= 10 ? "✅" : r.pts > 0 ? "🟠" : "❌"} +${r.pts}${r.jury ? " (jury)" : ""} · ${esc(shortGiven(q, a))}` : a ? "✓ a répondu" : `<span class="dots3">réfléchit</span>`;
    const jury = r && (q.type === "qroc" || q.type === "num") && r.pts === 0 && a ? `<button class="btn-ph" data-jury="${i}">Jury : valider</button>` : "";
    return `<div class="ans-chip${cls}" style="--pc:${PCOLORS[i]}"><span class="avatar">${initial(p.name)}</span><div><b>${esc(p.name)}</b><small>${line}</small></div>${jury}</div>`;
  }).join("")}</div>`;
}
function phoneQHTML() {
  const cur = S.trivial.cur, q = qById[cur.qid], cat = catById[q.cat], rev = cur.revealed;
  const key = "ph:" + cur.qid, enter = animKey !== key; animKey = key;
  const reveal = rev && revealKey === cur.qid; if (reveal) revealKey = null;
  const av = i => `<span class="mini-av" style="--pc:${PCOLORS[i]}" title="${esc(S.players[i].name)}">${initial(S.players[i].name)}</span>`;
  let body = "";
  if (q.o) {
    body = `<div class="opts${q.o.length > 6 ? " xl" : ""}">${q.o.map((o, i) => {
      const good = q.type === "qcu" ? i === q.a : q.a.includes(i);
      const pickers = rev ? S.players.map((_, p) => p).filter(p => cur.answers && cur.answers[p] && cur.answers[p].ans.sel.includes(i)) : [];
      const cls = rev ? (good ? (pickers.length ? "good" : "miss") : pickers.length ? "bad" : "") : "";
      return `<div class="opt ${cls}" style="--i:${i}"><span class="l">${LETTERS[i]}</span><span>${esc(o)}</span>${rev ? `<span class="tag">${pickers.map(av).join("")}</span>` : ""}</div>`;
    }).join("")}</div>`;
  } else if (q.type === "order") {
    body = rev ? `<p><b>Ordre attendu :</b> ${esc(q.items.join(" → "))}</p>`
      : `<div class="order-pool">${q.items.slice().sort((a, b) => a.localeCompare(b)).map(t => `<span class="order-item">${esc(t)}</span>`).join("")}</div><p class="muted">Chacun classe sur son téléphone.</p>`;
  } else if (!rev) body = `<p class="muted">Réponse à taper sur chaque téléphone.</p>`;
  const n = cur.answers ? Object.keys(cur.answers).length : 0;
  return `<article class="card qcard${enter ? " enter" : ""}${reveal ? " reveal" : ""}" style="--cc:var(${cat.css})">
    <div class="q-head"><span class="chip cat-chip" style="--cc:var(${cat.css})">${cat.icon} ${esc(cat.name)}</span><span class="chip">${typeLabel(q)}</span>${q.hard ? `<span class="chip hard-chip">💀 EDN+</span>` : ""}<span class="spacer"></span>
      <span class="chip">📱 tout le monde</span>${S.settings.timer && !rev ? timerHTML() : ""}</div>
    <div class="q-text">${esc(q.q)}</div>${qHint(q)}
    ${q.img ? photo(q.img, rev ? { hidden: false } : { spoiler: true, rid: "q:" + q.id }) : ""}
    ${body}
    ${answeredRowHTML()}
    ${rev ? phoneFeedbackHTML(q, cur)
      : `<div class="btn-row" style="margin-top:14px"><button class="btn btn-primary btn-big${n === S.players.length ? " pulse" : ""}" id="reveal-btn">Révéler la réponse (${n}/${S.players.length} ont répondu)</button></div>`}
  </article>`;
}
function phoneFeedbackHTML(q, cur) {
  const last = isLastPhoneQ();
  const sec = SKILLS[q.skill] && SKILLS[q.skill].sec;
  const best = Math.max(...cur.results.map(r => r.pts));
  return `<div class="feedback" role="status">
    <div class="verdict ${best >= 10 ? "ok" : best > 0 ? "mid" : "ko"}">${best >= 10 ? "✅" : best > 0 ? "🟠" : "❌"} ${cur.results.filter(r => r.pts >= 10).length}/${S.players.length} réponse(s) parfaite(s) ${rangBadge(q.oic, q.col)}</div>
    <p><b>Réponse attendue :</b> ${esc(rightAnswer(q))}</p>
    <div class="exp">${q.exp}</div>
    <div class="src">${oicLine(q.oic)}<span class="spacer" style="flex:1"></span>${sec && document.getElementById(sec) ? `<button class="btn" data-open="${sec}">Revoir la fiche</button>` : ""}</div>
    <div class="btn-row" style="margin-top:12px"><button class="btn btn-primary btn-big pulse" id="next-btn">${last ? "Voir le classement du Trivial →" : "Question suivante →"}</button></div></div>`;
}
const isLastPhoneQ = () => (S.trivial.qn || 0) + 1 >= totalQuestions() || remainingTotal() === 0;
function bindPhoneQ() {
  const cur = S.trivial.cur;
  if (!cur.revealed) {
    $("#reveal-btn").addEventListener("click", () => {
      const n = cur.answers ? Object.keys(cur.answers).length : 0;
      if (n < S.players.length && !confirm(`${S.players.length - n} joueur(s) n'ont pas encore répondu. Révéler quand même ?`)) return;
      revealAll();
    });
    if (S.settings.timer) startTimer(() => revealAll(true));
  } else {
    $("#next-btn").addEventListener("click", nextPhoneQ);
    $$("[data-jury]").forEach(b => b.addEventListener("click", () => juryPhone(+b.dataset.jury)));
  }
}
function updateAnswered() {
  if (S.screen !== 2 || !S.trivial.cur) return;
  const row = $("#qzone .answered-row"); if (row) row.outerHTML = answeredRowHTML();
  const rb = $("#reveal-btn"), n = S.trivial.cur.answers ? Object.keys(S.trivial.cur.answers).length : 0;
  if (rb) { rb.textContent = `Révéler la réponse (${n}/${S.players.length} ont répondu)`; rb.classList.toggle("pulse", n === S.players.length); }
  renderScorebar();
}
function revealAll() {
  const cur = S.trivial.cur; if (!cur || cur.revealed) return;
  clearInterval(timerId); clearTimeout(autoRevealT);
  const q = qById[cur.qid];
  const had = S.players.map((_, i) => !!wedgesOf(i)[q.cat]);
  cur.results = S.players.map((_, i) => {
    const a = cur.answers && cur.answers[i];
    if (!a) return { pts: 0, given: "(pas de réponse)" };
    const r = scoreQuestion(q, { sel: a.ans.sel, text: a.ans.text, order: a.ans.order });
    return { pts: r.pts, given: r.given };
  });
  cur.revealed = true;
  cur.results.forEach((r, i) => S.log.push({ p: i, qid: q.id, pts: r.pts, given: r.given }));
  save(); revealKey = cur.qid;
  if (S.screen === 2) renderTrivial();
  renderScorebar(); publishState();
  const best = Math.max(...cur.results.map(r => r.pts));
  Sound.play(best >= 10 ? "correct" : best > 0 ? "partial" : "wrong");
  cur.results.forEach((r, i) => {
    if (r.pts < 10) return;
    Confetti.fromEl($(`[data-pchip="${i}"]`), { n: 40, power: 7, dir: Math.PI / 2, spread: Math.PI * 1.4 });
    celebrateWedge(i, q.cat, had[i]);
  });
}
function juryPhone(i) {
  const cur = S.trivial.cur, q = qById[cur.qid];
  const had = !!wedgesOf(i)[q.cat];
  cur.results[i].pts = 10; cur.results[i].jury = true;
  const l = S.log.slice().reverse().find(x => x.p === i && x.qid === cur.qid); if (l) { l.pts = 10; l.jury = true; }
  save(); renderTrivial(); renderScorebar(); publishState();
  Sound.play("correct"); celebrateWedge(i, q.cat, had);
}
function nextPhoneQ() {
  const T = S.trivial; if (!T.cur || !T.cur.revealed) return;
  const last = isLastPhoneQ();
  T.qn = (T.qn || 0) + 1; T.cur = null;
  if (last) T.done = true;
  save(); renderTrivial(); renderScorebar(); publishState();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (last) celebrateEnd(); else Sound.play("turn");
}

/* ---------- côté téléphone (manette) ---------- */
function bootPhone(code, b) {
  document.body.classList.add("phone-mode");
  const root = document.createElement("div"); root.id = "phone"; document.body.appendChild(root);
  const KEY = `toxiquest-phone-${code}`;
  const P = { me: null, st: null, conn: "connecting", draft: { sel: [], text: "", order: [] }, sentQ: null, shuffled: {}, broker: b === null ? 0 : b, fixed: b !== null, got: false, tries: 0 };
  try { const m = JSON.parse(localStorage.getItem(KEY) || "null"); if (m && Number.isInteger(m.me)) P.me = m.me; } catch (e) { /* pas de mémoire */ }
  const persist = () => { try { localStorage.setItem(KEY, JSON.stringify({ me: P.me })); } catch (e) { /* ignoré */ } };
  const vib = p => { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { /* non supporté */ } };
  const hello = () => { if (P.me !== null) Net.send("up", { k: "hello", p: P.me }); };
  let phTimer = null;
  function connect() {
    P.got = false;
    Net.start("phone", code, P.broker, {
      onConnect: hello,
      onStatus: st => { P.conn = st; renderPh(); },
      onMessage: d => { P.got = true; onState(d); }
    });
    if (!P.fixed) setTimeout(() => { if (!P.got && P.tries < 3) { P.tries++; P.broker = (P.broker + 1) % BROKERS.length; connect(); } }, 7000);
  }
  function onState(d) {
    if (!d || d.v !== 1) return;
    const prevQ = P.st && P.st.q ? P.st.q.qid : null, prevPhase = P.st ? P.st.phase : null;
    P.st = d;
    if (d.q && d.q.qid !== prevQ) { P.draft = { sel: [], text: "", order: [] }; P.sentQ = null; if (d.phase === "question") vib(80); }
    if (d.phase === "reveal" && prevPhase !== "reveal") vib([90, 60, 90]);
    if (P.me !== null && d.roster && !d.roster[P.me]) P.me = null;
    renderPh();
  }
  setInterval(hello, 12000);
  function timerLeft() { return P.st && P.st.q && P.st.q.deadline ? Math.max(0, Math.ceil((P.st.q.deadline - Date.now()) / 1000)) : null; }
  function renderPh() {
    clearInterval(phTimer);
    const focused = document.activeElement && document.activeElement.id === "ph-in";
    const st = P.st;
    const head = `<div class="ph-head"><span class="logo">T</span><div><b>ToxiQuest</b><small>Salle ${esc(code)}${DEMO ? " · test" : ""}</small></div><span class="ph-conn ${P.conn}" title="${esc(netLabel(P.conn))}"></span></div>`;
    let body = "";
    if (!st) body = `<div class="ph-card center"><div class="ph-spin"></div><h2>${P.conn === "error" ? "Relais injoignable" : "Connexion…"}</h2><p class="muted">${P.conn === "error" ? "Vérifiez la connexion internet du téléphone, puis rechargez la page." : "En attente de l'ordinateur. Vérifiez que le jeu est ouvert en mode 📱 sur l'écran principal."}</p></div>`;
    else if (P.me === null || !st.roster[P.me]) body = `<div class="ph-card"><h2>Qui es-tu ?</h2><div class="ph-roster">${st.roster.map((n, i) => `<button class="ph-who" data-me="${i}" style="--pc:${PCOLORS[i]}"><span class="avatar">${initial(n)}</span>${esc(n)}</button>`).join("")}</div></div>`;
    else {
      const name = st.roster[P.me], score = st.scores ? st.scores[P.me] : 0;
      const me = `<div class="ph-me" style="--pc:${PCOLORS[P.me]}"><span class="avatar">${initial(name)}</span><b>${esc(name)}</b><span class="ph-score">${score} pts</span><button class="ph-link" id="ph-change">changer</button></div>`;
      if (st.phase === "lobby") body = me + `<div class="ph-card center"><div class="ph-wait">🎡</div><h2>Prêt !</h2><p class="muted">Regardez l'écran : la roue va tirer la question ${st.n} / ${st.total}.</p></div>`;
      else if (st.phase === "end") body = me + `<div class="ph-card center"><div class="ph-wait">🏆</div><h2>Trivial terminé</h2><p>Votre score : <b>${score} points</b>.</p><p class="muted">Le classement est sur l'écran principal.</p></div>`;
      else {
        const q = qById[st.q.qid];
        if (!q) body = me + `<div class="ph-card center"><h2>Question inconnue</h2><p class="muted">Le téléphone et l'ordinateur n'ont pas la même version du jeu : rechargez cette page.</p></div>`;
        else if (st.phase === "reveal") {
          const pts = st.results ? st.results[P.me] : 0;
          body = me + `<div class="ph-card center ph-result ${pts >= 10 ? "ok" : pts > 0 ? "mid" : "ko"}"><div class="ph-big">${pts >= 10 ? "✅" : pts > 0 ? "🟠" : "❌"}</div><h2>${pts >= 10 ? "Bonne réponse !" : pts > 0 ? "Presque !" : "Raté"}</h2><p class="ph-pts">+${pts} pts</p>
            <p><b>Réponse :</b> ${esc(rightAnswer(q))}</p><p class="muted">L'explication est sur l'écran principal.</p></div>`;
        } else body = me + phQuestionHTML(q, st);
      }
    }
    $("#phone").innerHTML = head + body;
    bindPh();
    if (focused) { const inp = $("#ph-in"); if (inp) { inp.focus(); const v = inp.value; inp.setSelectionRange(v.length, v.length); } }
    if (st && st.phase === "question" && st.q.deadline) phTimer = setInterval(() => {
      const t = timerLeft(), el = $("#ph-timer");
      if (el) { el.textContent = t + " s"; el.classList.toggle("low", t <= 10); }
      if (t === 0) { clearInterval(phTimer); renderPh(); }
    }, 500);
  }
  function phQuestionHTML(q, st) {
    const cat = catById[q.cat], d = P.draft, sent = P.sentQ === q.id;
    const over = timerLeft() === 0;
    let inp = "";
    if (q.o) inp = `<div class="ph-opts">${q.o.map((o, i) => `<button class="ph-opt${d.sel.includes(i) ? " sel" : ""}" data-po="${i}" ${over ? "disabled" : ""}><span class="l">${LETTERS[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>`;
    else if (q.type === "order") {
      const sh = P.shuffled[q.id] || (P.shuffled[q.id] = shuffle(q.items));
      inp = `<div class="ph-order">${sh.filter(t => !d.order.includes(t)).map(t => `<button class="ph-chip" data-padd="${esc(t)}" ${over ? "disabled" : ""}>${esc(t)}</button>`).join("") || "<small>Tout est placé.</small>"}</div>
        <ol class="ph-ordered">${d.order.map(t => `<li><button class="ph-chip on" data-prem="${esc(t)}" ${over ? "disabled" : ""}>${esc(t)} ✕</button></li>`).join("")}</ol>`;
    } else inp = `<input id="ph-in" class="ph-input" type="text" inputmode="${q.type === "num" ? "decimal" : "text"}" autocomplete="off" placeholder="${q.type === "num" ? "Nombre" : "Votre réponse"}" value="${esc(d.text)}" ${over ? "disabled" : ""}>${q.unit ? `<small>${esc(q.unit)}</small>` : ""}`;
    const t = timerLeft();
    const others = (st.answered || []).filter(Boolean).length;
    return `<div class="ph-card">
      <div class="ph-q-head"><span class="chip cat-chip" style="--cc:var(${cat.css})">${cat.icon} ${esc(cat.short)}</span>${q.hard ? `<span class="chip hard-chip">💀</span>` : ""}<span class="chip">${esc(typeLabel(q))}</span>${t !== null ? `<span class="ph-timer" id="ph-timer">${t} s</span>` : ""}</div>
      <p class="ph-q">${esc(q.q)}</p>${q.img ? `<p class="muted">📷 La photo est sur l'écran principal.</p>` : ""}
      ${q.type === "qrp" ? `<p class="muted">Cochez exactement ${q.n} réponses.</p>` : ""}
      ${inp}
      <p class="muted ph-status">${over ? "⏰ Temps écoulé" : sent ? "✅ Réponse envoyée : vous pouvez la modifier jusqu'à la correction." : "Votre réponse reste secrète jusqu'à la correction."} · ${others}/${st.roster.length} ont répondu</p>
    </div>
    ${over ? "" : `<button class="ph-send${sent ? " sent" : ""}" id="ph-send">${sent ? "Renvoyer ma réponse" : "Envoyer ma réponse"}</button>`}`;
  }
  function bindPh() {
    $$("[data-me]").forEach(b => b.addEventListener("click", () => { P.me = +b.dataset.me; persist(); hello(); vib(40); renderPh(); }));
    const ch = $("#ph-change"); if (ch) ch.addEventListener("click", () => { P.me = null; persist(); renderPh(); });
    const q = P.st && P.st.q && qById[P.st.q.qid];
    $$("[data-po]").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.po, d = P.draft;
      if (q.type === "qcu") d.sel = [i];
      else if (d.sel.includes(i)) d.sel = d.sel.filter(x => x !== i);
      else if (q.type === "qrp" && d.sel.length >= q.n) { vib(120); return; }
      else d.sel = d.sel.concat(i);
      vib(15); renderPh();
    }));
    $$("[data-padd]").forEach(b => b.addEventListener("click", () => { P.draft.order.push(b.dataset.padd); vib(15); renderPh(); }));
    $$("[data-prem]").forEach(b => b.addEventListener("click", () => { P.draft.order = P.draft.order.filter(t => t !== b.dataset.prem); renderPh(); }));
    const inp = $("#ph-in"); if (inp) inp.addEventListener("input", () => { P.draft.text = inp.value; });
    const send = $("#ph-send");
    if (send) send.addEventListener("click", () => {
      const msg = answerProblem(q, P.draft);
      if (msg) { alert(msg); return; }
      Net.send("up", { k: "answer", p: P.me, qid: q.id, ans: P.draft });
      P.sentQ = q.id; vib([30, 40, 30]); renderPh();
    });
  }
  renderPh();
  connect();
}

/* =====================================================================
   ÉTAPE 3 — CAS CLINIQUES
   ===================================================================== */
let stepKey = null, caseFx = null;
function caseState(id) {
  return S.cases[id] || (S.cases[id] = { i: 0, pts: 0, stab: 100, ans: [], done: false, sel: [], calc: { v: {} }, answered: false });
}
const stabColor = s => s >= 70 ? "var(--ok)" : s >= 40 ? "var(--warn)" : "var(--bad)";
function ecgHTML(stab) {
  const spd = stab >= 70 ? 1.5 : stab >= 40 ? 0.95 : 0.6;
  const bpm = stab >= 70 ? 88 : stab >= 40 ? 118 : 146;
  const d = "M0 20 L18 20 L22 16 L26 20 L34 20 L37 24 L41 3 L45 31 L48 20 L58 20 L64 14 L70 20 L93 20 L97 16 L101 20 L109 20 L112 24 L116 3 L120 31 L123 20 L133 20 L139 14 L145 20 L150 20";
  return `<div class="ecg" style="--ecg:${stabColor(stab)};--ecgs:${spd}s" title="Scope du patient"><span class="heart" aria-hidden="true">♥</span>
    <svg viewBox="0 0 150 34" aria-hidden="true"><path class="trace-bg" d="${d}"/><path class="trace" d="${d}" pathLength="300"/></svg><span>${bpm} /min</span></div>`;
}
function renderCases() {
  const root = $("#cases");
  if (!S.activeCase) {
    root.innerHTML = `<div class="eyebrow">Étape 3 · Mode coopératif</div>
      <h1>${CASES.length > 1 ? "Deux patients à sauver, ensemble" : "Un patient à sauver, ensemble"}</h1>
      <p class="lead">L'équipe décide à voix haute puis valide. Les bonnes décisions rapportent des points, les décisions dangereuses en font perdre et font chuter la stabilité du patient (surveillez le scope).</p>
      <div class="case-picker">${CASES.map((C, k) => {
        const st = S.cases[C.id];
        const status = !st ? "Non commencé" : st.done ? `Terminé · ${st.pts}/${caseMax(C)} pts · stabilité ${st.stab} %` : `En cours · étape ${st.i + 1}/${C.steps.length}`;
        return `<button class="card case-tile" style="animation:cardIn .5s ${k * 0.12}s backwards" data-case="${C.id}"><span class="emoji">${C.icon}</span><h2>${esc(C.title)}</h2><p class="muted" style="margin:0">${esc(C.subtitle)}</p><span class="chip">${status}</span></button>`;
      }).join("")}</div>
      <div class="btn-row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-primary btn-big" data-go="4">Aller au bilan →</button></div>`;
    $$("[data-case]").forEach(b => b.addEventListener("click", () => {
      S.activeCase = b.dataset.case; save(); Sound.play("heart"); renderCases(); window.scrollTo({ top: 0 });
    }));
    return;
  }
  const C = caseById[S.activeCase], st = caseState(C.id);
  if (st.done) { root.innerHTML = caseOutcome(C, st); bindOutcome(C); return; }
  const step = C.steps[st.i];
  const key = `${C.id}:${st.i}`, enter = stepKey !== key; stepKey = key;
  const fxNow = caseFx; caseFx = null;
  root.innerHTML = `
    <div class="case-top">
      <button class="btn" id="back-cases">← Cas</button>
      <div><div class="eyebrow">${esc(C.subtitle)}</div><h2 style="margin:0">${esc(C.title)}</h2></div>
      <span class="spacer"></span>
      ${ecgHTML(st.stab)}
      <div class="gauge${fxNow && fxNow.hurt ? " hurt" : ""}"><div class="lbl"><span>Stabilité du patient</span><span>${st.stab} %</span></div><div class="bar"><i style="width:${st.stab}%;background:${stabColor(st.stab)}"></i></div></div>
      <span class="chip" style="font-size:.95rem">Équipe : ${st.pts} / ${caseMax(C)} pts</span>
    </div>
    <div class="dots" aria-label="Progression">${C.steps.map((_, k) => `<i class="${k < st.i ? "done" : k === st.i ? "cur" : ""}"></i>`).join("")}</div>
    <div class="case-layout" style="margin-top:14px">
      <aside class="card dossier">${dossierHTML(C, st)}</aside>
      <div class="${enter ? "step-enter" : ""}">${stepHTML(C, st, step, enter, fxNow)}</div>
    </div>`;
  $("#back-cases").addEventListener("click", () => { S.activeCase = null; save(); Sound.play("unclick"); renderCases(); });
  bindStep(C, st, step);
}

function dossierHTML(C, st) {
  const evo = [];
  C.steps.forEach((s, k) => {
    if (s.pre && k <= st.i) evo.push({ html: s.pre, fresh: k === st.i && !st.answered });
    if (s.reveal && (k < st.i || (k === st.i && st.answered))) evo.push({ html: s.reveal, fresh: k === st.i });
  });
  return `<h3>🗂️ ${esc(C.patient)}</h3><p class="muted" style="margin:0">${esc(C.intro)}</p>
    ${C.blocks.map(b => `<div class="block"><h4>${b.h}</h4>${
      b.vitals ? `<div class="vitals">${b.vitals.map(([v, l]) => `<div><b>${v}</b><small>${l}</small></div>`).join("")}</div>` :
      b.meds ? `<table class="meds">${b.meds.map(([m, d]) => `<tr><td>${m}</td><td>${d}</td></tr>`).join("")}</table>` : b.html}</div>`).join("")}
    ${evo.length ? `<div class="block"><h4>Évolution et résultats</h4>${evo.map(e => `<p class="${e.fresh ? "new" : ""}">${e.html}</p>`).join("")}</div>` : ""}`;
}

const stepGrade = a => a.pts >= a.max * 0.8 && !a.harm ? "ok" : a.pts > 0 ? "mid" : "ko";
function stepHTML(C, st, step, enter, fxNow) {
  const ans = st.answered;
  const last = st.ans[st.ans.length - 1];
  const reveal = ans && fxNow && fxNow.validated;
  let body = "";
  if (step.type === "qcu" || step.type === "qrm") {
    body = `<div class="opts">${step.o.map((o, i) => {
      const sel = st.sel.includes(i);
      let cls = sel ? "sel" : "", tag = "", why = "";
      if (ans) {
        cls = "";
        if (sel && o.ok) { cls = "good"; tag = `+${o.pts}`; }
        else if (sel && !o.ok) { cls = "bad"; tag = `${o.pts}${o.harm ? ` · stabilité −${o.harm}` : ""}`; }
        else if (!sel && o.ok) { cls = "miss"; tag = o.miss ? `oubliée · stabilité −${o.miss}` : "oubliée"; }
        why = `<span class="why">${esc(o.why)}</span>`;
      }
      return `<button class="opt ${cls}" style="--i:${i}" data-copt="${i}" ${ans ? "disabled" : ""}><span class="l">${LETTERS[i]}</span><span>${esc(o.t)}${why}</span>${tag ? `<span class="tag">${tag}</span>` : ""}</button>`;
    }).join("")}</div>`;
  } else if (step.type === "scorten") body = scortenHTML(st, ans, step);
  else if (step.type === "regiscar") body = regiscarHTML(st, ans, step);

  const lastStep = st.i === C.steps.length - 1;
  const g = ans ? stepGrade(last) : "";
  return `<article class="card qcard${enter ? " enter" : ""}${reveal ? " reveal " + g : ""}" style="--cc:var(--accent)">
    <div class="q-head"><span class="chip">Étape ${st.i + 1} / ${C.steps.length}</span><span class="chip">${step.type === "qrm" ? "Plusieurs réponses" : step.type === "qcu" ? "Une seule réponse" : "Calculateur"}</span><span class="spacer"></span>${ans ? rangBadge(step.oic, step.col) : ""}</div>
    <h2>${esc(step.title)}</h2>
    ${step.pre ? `<div class="note info">${step.pre}</div>` : ""}
    <div class="q-text">${esc(step.q)}</div>
    ${step.img ? photo(step.img, ans ? { hidden: false } : { spoiler: true, rid: `c:${C.id}:${st.i}` }) : ""}
    ${body}
    ${ans ? `<div class="feedback"><div class="verdict ${g}">${{ ok: "✅", mid: "🟠", ko: "❌" }[g]} ${last.pts >= 0 ? "+" : "−"}${Math.abs(last.pts)} pts sur ${last.max} ${last.harm ? `<span class="chip tag-ko">Stabilité −${last.harm}</span>` : `<span class="chip tag-ok">Stabilité préservée</span>`} ${rangBadge(step.oic, step.col)}</div>
        <div class="exp">${step.exp}</div>
        <div class="src">${oicLine(step.oic)}</div>
        <div class="btn-row" style="margin-top:12px"><button class="btn btn-primary btn-big pulse" id="cnext">${lastStep ? "Voir l'issue du cas →" : "Étape suivante →"}</button></div></div>`
      : `<div class="btn-row" style="margin-top:14px"><button class="btn btn-primary btn-big" id="cvalidate">Valider la décision d'équipe</button></div>`}
  </article>`;
}

const scortenTruth = step => SCORTEN_ITEMS.filter(it => step.truth[it.k]).length;
const scortenRightM = step => { const t = scortenTruth(step); return t <= 1 ? 0 : Math.min(t - 1, 4); };
const scortenTotal = st => SCORTEN_ITEMS.filter(it => st.calc.v[it.k] === true).length;
const regiscarTotal = st => REGISCAR_ITEMS.reduce((a, it) => a + (st.calc.v[it.k] !== undefined ? it.choices[st.calc.v[it.k]][1] : 0), 0);
const fmtSigned = n => (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n);

function scortenHTML(st, ans, step) {
  const v = st.calc.v, rightM = scortenRightM(step);
  return `<div class="calc">${SCORTEN_ITEMS.map((it, i) => {
      const truth = step.truth[it.k];
      const cls = ans ? (v[it.k] === truth ? "good" : "bad") : "";
      return `<div class="calc-row ${cls}" style="--i:${i}"><span class="crit">${esc(it.t)}${ans && v[it.k] !== truth ? `<small>Attendu : ${truth ? "oui" : "non"}</small>` : ""}</span>
        <span class="seg">${[[true, "Oui"], [false, "Non"]].map(([b, l]) => `<button type="button" data-sc="${it.k}" data-val="${b}" class="${v[it.k] === b ? "on" : ""}" ${ans ? "disabled" : ""}>${l}</button>`).join("")}</span></div>`;
    }).join("")}
    <div class="calc-total"><span>SCORTEN calculé</span><span class="v">${scortenTotal(st)}</span></div>
    <div class="calc-row ${ans ? (st.calc.m === rightM ? "good" : "bad") : ""}"><span class="crit">Mortalité prédite${ans && st.calc.m !== rightM ? `<small>Attendu : ${SCORTEN_MORT[rightM][1]}</small>` : ""}</span>
      <span class="seg">${SCORTEN_MORT.map(([s, m], i) => `<button type="button" data-mort="${i}" class="${st.calc.m === i ? "on" : ""}" ${ans ? "disabled" : ""} title="SCORTEN ${s}">${m}</button>`).join("")}</span></div></div>`;
}
function regiscarHTML(st, ans, step) {
  const v = st.calc.v;
  return `<div class="calc">${REGISCAR_ITEMS.map((it, i) => {
      const truth = step.truth[it.k];
      const cls = ans ? (v[it.k] === truth ? "good" : "bad") : "";
      return `<div class="calc-row ${cls}" style="--i:${i}"><span class="crit">${esc(it.t)}${ans && v[it.k] !== truth ? `<small>Attendu : ${esc(it.choices[truth][0])} (${fmtSigned(it.choices[truth][1])})</small>` : ""}</span>
        <span class="seg">${it.choices.map(([l, val], ci) => `<button type="button" data-rg="${it.k}" data-ci="${ci}" class="${v[it.k] === ci ? "on" : ""}" ${ans ? "disabled" : ""}>${esc(l)} <small>(${fmtSigned(val)})</small></button>`).join("")}</span></div>`;
    }).join("")}
    <div class="calc-total"><span>Score RegiSCAR calculé</span><span class="v">${fmtSigned(regiscarTotal(st))}</span></div>
    <div class="calc-row ${ans ? (st.calc.c === step.cls ? "good" : "bad") : ""}"><span class="crit">Conclusion${ans && st.calc.c !== step.cls ? `<small>Attendu : ${REGISCAR_CLASSES[step.cls]}</small>` : ""}</span>
      <span class="seg">${REGISCAR_CLASSES.map((c, i) => `<button type="button" data-rc="${i}" class="${st.calc.c === i ? "on" : ""}" ${ans ? "disabled" : ""}>${esc(c)}</button>`).join("")}</span></div></div>`;
}
function updateCalc(step, st) {
  $$("#cases [data-sc]").forEach(b => b.classList.toggle("on", st.calc.v[b.dataset.sc] === (b.dataset.val === "true")));
  $$("#cases [data-mort]").forEach(b => b.classList.toggle("on", st.calc.m === +b.dataset.mort));
  $$("#cases [data-rg]").forEach(b => b.classList.toggle("on", st.calc.v[b.dataset.rg] === +b.dataset.ci));
  $$("#cases [data-rc]").forEach(b => b.classList.toggle("on", st.calc.c === +b.dataset.rc));
  const tv = $("#cases .calc-total .v");
  if (tv) {
    const val = step.type === "scorten" ? String(scortenTotal(st)) : fmtSigned(regiscarTotal(st));
    if (tv.textContent !== val) { tv.textContent = val; bump(tv, "counting"); }
  }
}

function bindStep(C, st, step) {
  if (!st.answered) {
    $$("#cases [data-copt]").forEach(b => b.addEventListener("click", () => {
      const i = +b.dataset.copt;
      const added = step.type === "qcu" ? true : !st.sel.includes(i);
      st.sel = step.type === "qcu" ? [i] : (added ? st.sel.concat(i) : st.sel.filter(x => x !== i));
      save();
      $$("#cases [data-copt]").forEach(x => x.classList.toggle("sel", st.sel.includes(+x.dataset.copt)));
      $("#cvalidate").classList.toggle("pulse", st.sel.length > 0);
      Sound.play(added ? "click" : "unclick");
    }));
    const pick = fn => b => b.addEventListener("click", () => { fn(b); save(); updateCalc(step, st); Sound.play("click"); });
    $$("#cases [data-sc]").forEach(pick(b => { st.calc.v[b.dataset.sc] = b.dataset.val === "true"; }));
    $$("#cases [data-mort]").forEach(pick(b => { st.calc.m = +b.dataset.mort; }));
    $$("#cases [data-rg]").forEach(pick(b => { st.calc.v[b.dataset.rg] = +b.dataset.ci; }));
    $$("#cases [data-rc]").forEach(pick(b => { st.calc.c = +b.dataset.rc; }));
    $("#cvalidate").addEventListener("click", () => validateStep(C, st, step));
  } else {
    $("#cnext").addEventListener("click", () => {
      st.i++; st.sel = []; st.calc = { v: {} }; st.answered = false;
      const finished = st.i >= C.steps.length;
      if (finished) { st.done = true; st.i = C.steps.length - 1; }
      save(); renderCases(); renderScorebar(); window.scrollTo({ top: 0, behavior: "smooth" });
      if (finished) {
        const k = outcomeKey(C, st);
        if (k === "good") { Sound.play("drumroll", 0.8); setTimeout(() => { Sound.play("fanfare"); Confetti.rain(); }, 850); }
        else if (k === "mid") Sound.play("partial");
        else Sound.play("sad");
      } else Sound.play("page");
    });
  }
}

function validateStep(C, st, step) {
  let pts = 0, harm = 0, given = "", right = "";
  const max = stepMax(step);
  if (step.type === "qcu" || step.type === "qrm") {
    if (!st.sel.length) { toast("Choisissez au moins une option."); Sound.play("nope"); return; }
    st.sel.forEach(i => { pts += step.o[i].pts; harm += step.o[i].harm || 0; });
    step.o.forEach((o, i) => { if (o.ok && !st.sel.includes(i) && o.miss) harm += o.miss; });
    given = st.sel.map(i => step.o[i].t).join(" · ");
    right = step.o.filter(o => o.ok).map(o => o.t).join(" · ");
  } else if (step.type === "scorten") {
    if (SCORTEN_ITEMS.some(it => st.calc.v[it.k] === undefined) || st.calc.m === undefined) { toast("Renseignez les 7 critères et la mortalité."); Sound.play("nope"); return; }
    const rightM = scortenRightM(step);
    SCORTEN_ITEMS.forEach(it => { if (st.calc.v[it.k] === step.truth[it.k]) pts += 2; });
    if (st.calc.m === rightM) pts += 6;
    given = `SCORTEN ${scortenTotal(st)}, mortalité ${SCORTEN_MORT[st.calc.m][1]}`;
    right = `SCORTEN ${scortenTruth(step)}, mortalité ${SCORTEN_MORT[rightM][1]}`;
  } else if (step.type === "regiscar") {
    if (REGISCAR_ITEMS.some(it => st.calc.v[it.k] === undefined) || st.calc.c === undefined) { toast("Renseignez les 10 critères et la conclusion."); Sound.play("nope"); return; }
    REGISCAR_ITEMS.forEach(it => { if (st.calc.v[it.k] === step.truth[it.k]) pts += 1; });
    if (st.calc.c === step.cls) pts += 5;
    const truthTot = REGISCAR_ITEMS.reduce((a, it) => a + it.choices[step.truth[it.k]][1], 0);
    given = `RegiSCAR ${fmtSigned(regiscarTotal(st))}, ${REGISCAR_CLASSES[st.calc.c]}`;
    right = `RegiSCAR ${fmtSigned(truthTot)}, ${REGISCAR_CLASSES[step.cls]}`;
  }
  st.pts += pts; st.stab = Math.max(0, Math.min(100, st.stab - harm)); st.answered = true;
  const a = { step: st.i, pts, max, harm, given, right };
  st.ans.push(a);
  caseFx = { hurt: harm > 0, validated: true };
  save(); renderCases(); renderScorebar();
  const g = stepGrade(a);
  if (harm > 0) {
    Sound.play("alarm"); redFlash();
    if (harm >= 15) toast("⚠️ Décision dangereuse : l'état du patient se dégrade.");
  } else if (g === "ok") { Sound.play("correct"); Confetti.fromEl($("#cases .verdict"), { n: 55 }); }
  else if (g === "mid") Sound.play("partial");
  else Sound.play("wrong");
}

function outcomeKey(C, st) {
  const pct = st.pts / caseMax(C);
  if (st.stab < 40 || pct < 0.3) return "bad";
  if (st.stab >= 70 && pct >= 0.6) return "good";
  return "mid";
}
function caseOutcome(C, st) {
  const o = C.outcomes[outcomeKey(C, st)];
  const other = CASES.find(x => x.id !== C.id && !(S.cases[x.id] && S.cases[x.id].done));
  return `<div class="card outcome qcard enter" style="--cc:${stabColor(st.stab)}">
    <div class="emoji" style="display:inline-block;animation:splashIn .8s cubic-bezier(.2,1.3,.4,1)">${o.emoji}</div><div class="eyebrow">${esc(C.title)}</div><h1>${esc(o.title)}</h1>
    <p class="lead" style="margin:0 auto">${esc(o.text)}</p>
    <div style="display:flex;justify-content:center;margin:12px 0">${ecgHTML(st.stab)}</div>
    <div class="kpis" style="margin:18px 0"><div class="kpi"><b>${st.pts}</b><small>points d'équipe sur ${caseMax(C)}</small></div><div class="kpi"><b>${st.stab} %</b><small>stabilité finale</small></div>
      <div class="kpi"><b>${st.ans.filter(a => stepGrade(a) === "ok").length}/${C.steps.length}</b><small>étapes réussies</small></div><div class="kpi"><b>${st.ans.filter(a => a.harm).length}</b><small>étape(s) avec décision dangereuse ou oubli critique</small></div></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Étape</th><th>Points</th><th>Stabilité</th></tr></thead><tbody>${st.ans.map(a => `<tr><td>${esc(C.steps[a.step].title)}</td><td>${a.pts} / ${a.max}</td><td>${a.harm ? `−${a.harm}` : "—"}</td></tr>`).join("")}</tbody></table></div>
    <div class="btn-row" style="justify-content:center">
      ${other ? `<button class="btn btn-primary btn-big pulse" id="other-case" data-id="${other.id}">${esc(other.title)} →</button>` : `<button class="btn btn-primary btn-big pulse" data-go="4">Voir le bilan →</button>`}
      <button class="btn" id="replay-case">Rejouer ce cas</button>
      <button class="btn" id="back-cases2">Liste des cas</button>
    </div></div>`;
}
function bindOutcome(C) {
  const oc = $("#other-case"); if (oc) oc.addEventListener("click", () => { S.activeCase = oc.dataset.id; save(); Sound.play("heart"); renderCases(); window.scrollTo({ top: 0 }); });
  $("#replay-case").addEventListener("click", () => {
    if (!confirm("Rejouer ce cas ? Ses points actuels seront remplacés.")) return;
    delete S.cases[C.id]; stepKey = null; save(); Sound.play("whoosh"); renderCases(); renderScorebar();
  });
  $("#back-cases2").addEventListener("click", () => { S.activeCase = null; save(); Sound.play("unclick"); renderCases(); });
}

/* =====================================================================
   ÉTAPE 4 — BILAN
   ===================================================================== */
function playerSkills(i) {
  const m = {};
  S.log.filter(l => l.p === i).forEach(l => {
    const q = qById[l.qid]; const s = m[q.skill] || (m[q.skill] = { n: 0, s: 0, miss: [] });
    s.n++; s.s += l.pts / 10;
    if (l.pts < 10 && !s.miss.includes(q.topic)) s.miss.push(q.topic);
  });
  return m;
}
function teamSkills() {
  const m = {};
  CASES.forEach(C => { const st = S.cases[C.id]; if (!st) return;
    st.ans.forEach(a => { const step = C.steps[a.step]; const s = m[step.skill] || (m[step.skill] = { n: 0, s: 0, miss: [] });
      s.n++; s.s += Math.max(0, Math.min(1, a.pts / a.max));
      if (a.pts < a.max * 0.8 && !s.miss.includes(step.title.toLowerCase())) s.miss.push(step.title.toLowerCase()); });
  });
  return m;
}
function skillSentence(name, m, verbS = "maîtrise", verbP = "doit revoir") {
  const arr = Object.entries(m).map(([k, v]) => ({ k, r: v.s / v.n, n: v.n, miss: v.miss }));
  if (!arr.length) return { text: `${name} n'a encore rien joué : pas de bilan possible.`, strong: [], weak: [], mid: [] };
  const the = k => (SKILLS[k] ? SKILLS[k].the : k);
  const strong = arr.filter(x => x.r >= 0.8).sort((a, b) => b.r - a.r || b.n - a.n);
  const weak = arr.filter(x => x.r < 0.5).sort((a, b) => a.r - b.r || b.n - a.n);
  const mid = arr.filter(x => x.r >= 0.5 && x.r < 0.8);
  const sP = listFr(strong.slice(0, 3).map(x => the(x.k)));
  const wP = listFr(weak.slice(0, 3).map(x => the(x.k) + (x.miss.length ? ` (${x.miss.slice(0, 2).join(" ; ")})` : "")));
  let text;
  if (strong.length && weak.length) text = `${name} ${verbS} ${sP} mais ${verbP} ${wP}.`;
  else if (strong.length) text = `${name} ${verbS} ${sP}${mid.length ? ` ; à consolider : ${listFr(mid.slice(0, 2).map(x => the(x.k)))}` : " : aucun point faible détecté sur cette session"}.`;
  else if (weak.length) text = `${name} ${verbP} ${wP}${mid.length ? ` ; en progrès sur ${listFr(mid.slice(0, 2).map(x => the(x.k)))}` : ""}.`;
  else text = `${name} est à consolider sur ${listFr(mid.slice(0, 3).map(x => the(x.k)))}.`;
  return { text, strong, weak, mid };
}
function catRatios(i) {
  return CATS.map(c => {
    const ls = S.log.filter(l => l.p === i && qById[l.qid].cat === c.id);
    return { c, n: ls.length, r: ls.length ? ls.reduce((a, l) => a + l.pts, 0) / (10 * ls.length) : 0 };
  });
}
function radarSVG() {
  const cx = 200, cy = 190, R = 130, N = CATS.length;
  const pt = (k, r) => { const a = (-90 + k * 360 / N) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const rings = [0.25, 0.5, 0.75, 1].map(f => `<polygon points="${CATS.map((_, k) => pt(k, R * f).map(v => v.toFixed(1)).join(",")).join(" ")}" style="fill:none;stroke:var(--border);stroke-width:1"/>`).join("");
  const axes = CATS.map((c, k) => { const [x, y] = pt(k, R); const [lx, ly] = pt(k, R + 26);
    return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" style="stroke:var(--border)"/>
      <text x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" text-anchor="middle" style="font-size:12px;font-weight:700;fill:var(${c.css})">${c.icon} ${esc(c.short)}</text>`; }).join("");
  const polys = S.players.map((p, i) => {
    const rs = catRatios(i);
    return `<polygon class="radar-poly" points="${rs.map((x, k) => pt(k, R * Math.max(0.03, x.r)).map(v => v.toFixed(1)).join(",")).join(" ")}" style="fill:${PCOLORS[i]};fill-opacity:.14;stroke:${PCOLORS[i]};stroke-width:2.5;animation-delay:${0.4 + i * 0.25}s"/>`;
  }).join("");
  return `<svg viewBox="0 0 400 390" role="img" aria-label="Taux de réussite par catégorie et par joueur">${rings}${axes}${polys}
    ${["25 %", "50 %", "75 %", "100 %"].map((t, k) => `<text x="${cx + 4}" y="${cy - R * (k + 1) / 4 + 12}" style="font-size:9px;fill:var(--faint)">${t}</text>`).join("")}</svg>`;
}

function errorsList() {
  const out = [];
  S.log.forEach(l => {
    if (l.pts >= 10) return;
    const q = qById[l.qid];
    out.push({ who: S.players[l.p].name, color: PCOLORS[l.p], src: catById[q.cat].short, q: q.q, given: l.given, right: rightAnswer(q), exp: q.exp, oic: q.oic, col: q.col, pts: `${l.pts}/10` });
  });
  CASES.forEach(C => { const st = S.cases[C.id]; if (!st) return;
    st.ans.forEach(a => { if (a.pts >= a.max) return; const step = C.steps[a.step];
      out.push({ who: "Équipe", color: "var(--accent)", src: `${C.title} · ${step.title}`, q: step.q, given: a.given, right: a.right, exp: step.exp, oic: step.oic, col: step.col, pts: `${a.pts}/${a.max}` }); });
  });
  return out;
}

function renderDebrief() {
  const root = $("#debrief");
  const players = S.players.map((p, i) => ({ p, i, s: playerScore(i) }));
  const sorted = players.slice().sort((a, b) => b.s - a.s);
  const places = sorted.map((x, k) => ({ ...x, place: k > 0 && x.s === sorted[k - 1].s ? null : k + 1 }));
  places.forEach((x, k) => { if (x.place === null) x.place = places[k - 1].place; });
  const podiumOrder = [places[1], places[0], places[2]].filter(Boolean);
  const H = { 1: 170, 2: 125, 3: 90 }, DELAY = { 1: 1.0, 2: 0.5, 3: 0 };
  const answered = S.log.length, perfect = S.log.filter(l => l.pts >= 10).length;
  const casesDone = CASES.filter(C => S.cases[C.id] && S.cases[C.id].done).length;
  const errs = errorsList(), cs = courseStats();
  const team = skillSentence("L'équipe", teamSkills(), "maîtrise en situation", "doit retravailler en dossier");
  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const kpis = [[teamScore(), "score d'équipe cumulé", "var(--accent)"], [trivialTotal(), `points du Trivial (${answered} questions)`], [casePts(), `points des cas cliniques (${casesDone}/${CASES.length} terminés)`], [cs.pct, "% du préchauffage (fiches) accompli"]];

  root.innerHTML = `
  <div class="eyebrow">Étape 4 · Débriefing</div>
  <h1>Bilan de la sous-colle</h1>
  <div class="kpis" style="margin:14px 0 18px">${kpis.map(([v, l, c], k) => `<div class="kpi" style="animation:fadeUp .5s ${k * 0.1}s backwards"><b data-count="${v}" ${c ? `style="color:${c}"` : ""}>0</b><small>${l}</small></div>`).join("")}</div>
  <div class="grid g2">
    <div class="card"><h2>Podium</h2>
      <div class="podium">${podiumOrder.map(x => `<div class="pod${x.place === 1 ? " first" : ""}" style="--pc:${PCOLORS[x.i]};--d:${DELAY[x.place] || 0}s"><div class="avatar">${x.place === 1 ? "👑" : initial(x.p.name)}</div><div class="nm">${esc(x.p.name)}</div><div class="pts">${x.s} pts</div>
        <div class="block" style="height:${H[x.place] || 80}px"><span class="place">${x.place}</span>${pie(wedgesOf(x.i), 28)}</div></div>`).join("")}</div></div>
    <div class="card"><h2>Réussite par catégorie</h2>
      <div class="radar-wrap">${radarSVG()}<div class="legend">${S.players.map((p, i) => `<div style="--pc:${PCOLORS[i]}"><i></i>${esc(p.name)}</div>`).join("")}<small>Chaque axe = pourcentage des points obtenus dans la catégorie.</small></div></div></div>
  </div>

  <div class="card" style="margin-top:16px"><h2>Bilan par compétences</h2>
    ${S.players.map((p, i) => { const sk = skillSentence(p.name, playerSkills(i)); return `<div class="skills-player" style="--pc:${PCOLORS[i]};animation-delay:${0.3 + i * 0.15}s">
      <div class="sentence">${esc(sk.text)}</div>
      <div class="bars">${catRatios(i).map(x => `<div class="barrow"><span>${x.c.icon} ${esc(x.c.short)}</span><div class="b"><i style="width:${Math.round(x.r * 100)}%;background:var(${x.c.css})"></i></div><span class="v">${x.n ? Math.round(x.r * 100) + " %" : "—"}</span></div>`).join("")}</div>
      <div class="tags" style="margin-top:10px">${sk.strong.map(x => `<span class="chip tag-ok">✓ ${esc(SKILLS[x.k] ? SKILLS[x.k].label : x.k)}</span>`).join("")}${sk.weak.map(x => SKILLS[x.k] && document.getElementById(SKILLS[x.k].sec) ? `<button class="chip tag-ko" data-open="${SKILLS[x.k].sec}" style="border:0;cursor:pointer">↻ ${esc(SKILLS[x.k].label)} · revoir la fiche</button>` : `<span class="chip tag-ko">↻ ${esc(SKILLS[x.k] ? SKILLS[x.k].label : x.k)}</span>`).join("")}</div>
    </div>`; }).join("")}
    <div class="skills-player" style="--pc:var(--accent);animation-delay:.8s"><div class="sentence">${esc(team.text)}</div>
      <div class="tags">${CASES.map(C => { const st = S.cases[C.id]; return `<span class="chip">${C.icon} ${esc(C.title)} : ${st ? `${st.pts}/${caseMax(C)} pts · stabilité ${st.stab} %${st.done ? " · " + C.outcomes[outcomeKey(C, st)].title : " · en cours"}` : "non joué"}</span>`; }).join("")}
        <span class="chip">📚 Fiches : ${cs.pct} % du préchauffage · ${cs.known} carte${cs.known > 1 ? "s" : ""} sue${cs.known > 1 ? "s" : ""} · ${cs.toReview.length} à revoir</span></div></div>
  </div>

  <div class="card" style="margin-top:16px" id="memo">
    <div class="btn-row no-print" style="justify-content:space-between">
      <h2 style="margin:0">Fiche mémo de la session</h2>
      <div class="btn-row"><button class="btn btn-primary" id="print-memo">🖨️ Imprimer / PDF</button><button class="btn" id="dl-html">Télécharger (.html)</button><button class="btn" id="dl-md">Télécharger (.md)</button></div>
    </div>
    <div id="memo-body">${memoHTML(errs, today, cs)}</div>
  </div>

  <div class="btn-row" style="justify-content:center;margin-top:18px">
    <button class="btn" data-go="1">Retour aux fiches</button><button class="btn" data-go="2">Retour au Trivial</button><button class="btn" data-go="3">Retour aux cas</button><button class="btn" id="new-game">Nouvelle partie</button>
  </div>`;

  $$("#debrief [data-count]").forEach(el => countUp(el, 0, +el.dataset.count, 1200));
  if (S.log.length || casePts()) {
    Sound.play("drumroll", 1.0);
    setTimeout(() => { Sound.play("fanfare"); Confetti.fromEl($("#debrief .pod.first .avatar"), { n: 120, power: 12 }); }, 1150);
  }
  $("#print-memo").addEventListener("click", () => {
    Sound.play("page");
    document.body.classList.add("print-memo");
    window.print();
    setTimeout(() => document.body.classList.remove("print-memo"), 500);
  });
  $("#dl-html").addEventListener("click", () => { Sound.play("pop"); download(`fiche-memo-${DEMO ? "test" : "toxidermies"}-${isoDate()}.html`, standaloneMemo(errs, today, cs), "text/html"); });
  $("#dl-md").addEventListener("click", () => { Sound.play("pop"); download(`fiche-memo-${DEMO ? "test" : "toxidermies"}-${isoDate()}.md`, memoMarkdown(errs, today, cs), "text/markdown"); });
  $("#new-game").addEventListener("click", () => {
    if (confirm("Effacer la partie et recommencer ?")) { resetAll(); Sound.play("whoosh"); go(0, true); }
  });
}
const isoDate = () => new Date().toISOString().slice(0, 10);
const MEMO_TITLE = DEMO ? "Page de test (contenu fictif)" : "Item 115 · Toxidermies";

function memoHTML(errs, today, cs) {
  const byWho = {};
  errs.forEach(e => (byWho[e.who] || (byWho[e.who] = [])).push(e));
  return `<p class="muted">${MEMO_TITLE} — session du ${today} · ${S.players.map(p => esc(p.name)).join(", ")} · score d'équipe ${teamScore()}</p>
    ${errs.length ? Object.entries(byWho).map(([who, list]) => `<h3>${who === "Équipe" ? "Cas cliniques (équipe)" : "Erreurs de " + esc(who)} · ${list.length}</h3>
      ${list.map(e => `<div class="memo-item" style="border-left:4px solid ${e.color}">
        <div class="q-head" style="margin:0 0 6px">${rangBadge(e.oic, e.col)}<span class="chip">${esc(e.src)}</span><span class="chip">${e.pts}</span></div>
        <div class="qq">${esc(e.q)}</div>
        <div class="row"><span>Réponse donnée</span><span class="given">${esc(e.given)}</span></div>
        <div class="row"><span>Correction</span><span class="right">${esc(e.right)}</span></div>
        <div class="row"><span>À retenir</span><span>${e.exp}</span></div>
        <div class="row"><span>Objectif</span><span class="oic">${esc(e.oic)} · ${esc(OIC[e.oic] || "")}</span></div></div>`).join("")}`).join("")
      : `<div class="note info">Aucune erreur enregistrée pour l'instant. Jouez le Trivial et les cas pour remplir la fiche.</div>`}
    ${cs.toReview.length ? `<h3>Cartes flash marquées « à revoir » · ${cs.toReview.length}</h3>${cs.toReview.map(c => `<div class="memo-item" style="border-left:4px solid var(--warn)"><div class="q-head" style="margin:0 0 6px"><span class="chip">${esc(c.sec)}</span></div><div class="qq">${esc(c.q)}</div><div class="row"><span>Réponse</span><span class="right">${esc(c.a)}</span></div></div>`).join("")}` : ""}
    <h3 style="margin-top:18px">${DEMO ? "Les incontournables (exemple)" : "Les incontournables de l'item 115"}</h3>
    <ul class="essentials">${ESSENTIALS.map(x => `<li>${esc(x)}</li>`).join("")}</ul>`;
}
function standaloneMemo(errs, today, cs) {
  const css = `body{font-family:Inter,system-ui,sans-serif;max-width:860px;margin:24px auto;padding:0 16px;color:#111;line-height:1.5}
    h1{font-size:1.6rem}h3{margin-top:1.4em}.memo-item{border:1px solid #ddd;border-radius:10px;padding:10px 12px;margin:10px 0;page-break-inside:avoid}
    .qq{font-weight:700}.row{display:grid;grid-template-columns:130px 1fr;gap:8px;font-size:.92rem;margin-top:5px}.row span:first-child{color:#555;font-weight:700}
    .given{color:#b91c1c}.right{color:#15803d;font-weight:700}.rang{display:inline-block;padding:2px 8px;border-radius:6px;font-size:.75rem;font-weight:800;margin-right:4px}
    .rang-A{background:#ffedd5;color:#b93d0a}.rang-B{background:#dbeafe;color:#1d4ed8}.rang-C{background:#eceff3;color:#555}.chip{display:inline-block;background:#f1f3f6;border-radius:999px;padding:2px 8px;font-size:.75rem;margin-right:4px}
    .oic,.muted{color:#555;font-size:.85rem}.q-head{margin-bottom:6px}.note{background:#eefaf8;padding:10px;border-radius:8px}ul.essentials li{margin:.3em 0}`;
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Fiche mémo · ${MEMO_TITLE} · ${today}</title><style>${css}</style></head><body><h1>Fiche mémo · ${MEMO_TITLE}</h1>${memoHTML(errs, today, cs)}</body></html>`;
}
function memoMarkdown(errs, today, cs) {
  const lines = [`# Fiche mémo · ${MEMO_TITLE}`, ``, `Session du ${today} · ${S.players.map(p => p.name).join(", ")} · score d'équipe ${teamScore()}`, ``];
  if (!errs.length) lines.push("_Aucune erreur enregistrée._", "");
  errs.forEach(e => {
    lines.push(`## [RANG ${rangOf(e.oic)}]${e.col ? " (compl. Collège)" : ""} ${strip(e.q)}`, ``,
      `- **Qui** : ${e.who} · ${e.src} · ${e.pts}`, `- **Réponse donnée** : ${strip(e.given)}`, `- **Correction** : ${strip(e.right)}`,
      `- **À retenir** : ${strip(e.exp)}`, `- **Objectif** : ${e.oic} · ${OIC[e.oic] || ""}`, ``);
  });
  if (cs.toReview.length) {
    lines.push(`## Cartes flash à revoir`, ``);
    cs.toReview.forEach(c => lines.push(`- **${c.q}** → ${c.a} _(${c.sec})_`));
    lines.push("");
  }
  lines.push(`## Les incontournables`, ``, ...ESSENTIALS.map(x => `- ${x}`), ``);
  return lines.join("\n");
}
function download(name, content, type) {
  const blob = new Blob([content], { type: type + ";charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}
window.addEventListener("afterprint", () => document.body.classList.remove("print-memo"));

/* ---------------- démarrage ---------------- */
applyPrefs();
const JOIN = new URLSearchParams(location.search);
if (JOIN.has("join")) { bootPhone(JOIN.get("join").toUpperCase().replace(/[^A-Z0-9]/g, ""), JOIN.has("b") ? (+JOIN.get("b") || 0) : null); return; }
initCourse();
if (S.trivial.cur && !S.trivial.cur.answered && S.settings.timer) S.trivial.cur.deadline = Date.now() + S.settings.timer * 1000;
go(S.players.length ? S.screen : 0, true);
})();
