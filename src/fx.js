/* =====================================================================
   EFFETS : sons synthétisés (Web Audio, aucun fichier), confettis,
   écrans d'annonce, compteurs animés
   ===================================================================== */
const REDUCED = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

const Sound = (() => {
  const KEY = "toxiquest-sound";
  let on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) { /* sons actifs par défaut */ }
  let ctx = null, master = null, noiseBuf = null;

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  function tone(f, dur, o = {}) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + (o.when || 0), v = o.vol === undefined ? 0.2 : o.vol, att = o.attack || 0.008;
    const osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || "sine";
    osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + dur);
    if (o.vibrato) {
      const l = c.createOscillator(), lg = c.createGain();
      l.frequency.value = o.vibrato; lg.gain.value = f * 0.035;
      l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + dur + 0.05);
    }
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + att);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    let node = osc;
    if (o.lp) { const flt = c.createBiquadFilter(); flt.type = "lowpass"; flt.frequency.value = o.lp; osc.connect(flt); node = flt; }
    node.connect(g); g.connect(master);
    osc.start(t); osc.stop(t + dur + 0.05);
  }
  function noise(dur, o = {}) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + (o.when || 0);
    const src = c.createBufferSource(); src.buffer = noiseBuf;
    const flt = c.createBiquadFilter(); flt.type = o.ftype || "bandpass";
    flt.frequency.setValueAtTime(o.f || 2000, t);
    if (o.fto) flt.frequency.exponentialRampToValueAtTime(o.fto, t + dur);
    flt.Q.value = o.q || 1;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol === undefined ? 0.2 : o.vol, t + (o.attack || 0.004));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(flt); flt.connect(g); g.connect(master);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.05);
  }
  const notes = (arr, step, o = {}) => arr.forEach((f, i) => tone(f, o.dur || 0.18, Object.assign({}, o, { when: (o.when || 0) + i * step })));

  const fx = {
    click:   () => tone(760, 0.05, { type: "triangle", vol: 0.12 }),
    unclick: () => tone(520, 0.05, { type: "triangle", vol: 0.1 }),
    pop:     () => tone(380, 0.13, { vol: 0.2, to: 900 }),
    ratchet: () => { noise(0.025, { f: 4200, q: 3, vol: 0.32 }); tone(2400, 0.018, { type: "square", vol: 0.025 }); },
    whoosh:  () => noise(0.55, { f: 300, fto: 2800, q: 0.8, vol: 0.3, attack: 0.15 }),
    land:    () => notes([523.25, 783.99, 1046.5], 0.08, { type: "triangle", vol: 0.16, dur: 0.24 }),
    correct: () => { notes([523.25, 659.25, 783.99, 1046.5], 0.075, { type: "triangle", vol: 0.18, dur: 0.26 }); tone(2093, 0.45, { when: 0.3, vol: 0.05 }); },
    partial: () => notes([587.33, 698.46], 0.13, { type: "triangle", vol: 0.16, dur: 0.26 }),
    wrong:   () => { tone(196, 0.45, { type: "sawtooth", vol: 0.11, to: 98, lp: 900 }); tone(207.65, 0.45, { type: "sawtooth", vol: 0.08, to: 104, lp: 900 }); },
    tick:    () => tone(1150, 0.03, { type: "square", vol: 0.035, lp: 3200 }),
    tock:    () => tone(820, 0.03, { type: "square", vol: 0.035, lp: 2600 }),
    urgent:  () => tone(1320, 0.08, { type: "square", vol: 0.09, lp: 4000 }),
    buzzer:  () => { tone(110, 0.75, { type: "square", vol: 0.12, lp: 1200 }); tone(116, 0.75, { type: "sawtooth", vol: 0.08, lp: 1200 }); },
    wedge:   () => notes([1046.5, 1318.5, 1568, 2093], 0.06, { vol: 0.15, dur: 0.32 }),
    fanfare: () => [[523.25, 0, .15], [523.25, .16, .15], [523.25, .32, .15], [659.25, .48, .36], [783.99, .86, .2], [659.25, 1.06, .15], [783.99, 1.21, .7]]
                    .forEach(([f, w, d]) => { tone(f, d, { type: "sawtooth", vol: 0.08, when: w, lp: 2400 }); tone(f * 2, d, { type: "triangle", vol: 0.05, when: w }); }),
    sad:     () => [[392, 0], [369.99, 0.45], [349.23, 0.9], [329.63, 1.35]]
                    .forEach(([f, w], i) => tone(f, i === 3 ? 1.1 : 0.42, { type: "sawtooth", vol: 0.1, when: w, lp: 1100, vibrato: i === 3 ? 6 : 0, to: i === 3 ? f * 0.94 : 0 })),
    alarm:   () => [0, 0.22, 0.44].forEach(w => tone(988, 0.16, { type: "square", vol: 0.07, when: w, lp: 3000 })),
    heart:   () => { tone(72, 0.13, { vol: 0.4, to: 45 }); tone(72, 0.13, { vol: 0.28, to: 45, when: 0.19 }); },
    shutter: () => { noise(0.05, { f: 3000, q: 0.7, vol: 0.3 }); noise(0.07, { f: 1800, q: 0.7, vol: 0.25, when: 0.07 }); },
    turn:    () => notes([659.25, 880], 0.09, { type: "triangle", vol: 0.15, dur: 0.22 }),
    streak:  () => notes([783.99, 987.77, 1174.66, 1567.98, 1975.53], 0.05, { type: "square", vol: 0.05, dur: 0.15, lp: 3500 }),
    drumroll:(d = 1.2) => { for (let t = 0; t < d; t += 0.045) noise(0.05, { when: t, f: 900, q: 0.6, vol: 0.1 + 0.16 * (t / d) }); noise(0.45, { when: d, f: 500, q: 0.5, vol: 0.45 }); },
    start:   () => { fx.whoosh(); notes([392, 523.25, 659.25, 783.99], 0.07, { type: "triangle", vol: 0.12, dur: 0.2, when: 0.15 }); },
    page:    () => noise(0.18, { f: 1200, fto: 4000, q: 0.6, vol: 0.12, attack: 0.03 }),
    ding:    () => { tone(1318.5, 0.35, { vol: 0.16 }); tone(1975.5, 0.3, { vol: 0.06, when: 0.04 }); },
    nope:    () => tone(233, 0.18, { type: "square", vol: 0.06, to: 180, lp: 1500 }),
    flip:    () => noise(0.12, { f: 2500, fto: 900, q: 0.8, vol: 0.14, attack: 0.02 })
  };

  return {
    play(n, ...a) { if (!on) return; try { if (fx[n]) fx[n](...a); } catch (e) { /* audio indisponible */ } },
    get on() { return on; },
    toggle() {
      on = !on;
      try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) { /* ignoré */ }
      if (on) this.play("pop");
      return on;
    }
  };
})();

const Confetti = (() => {
  let cv = null, cx = null, parts = [], raf = null;
  const COLORS = ["#2f6fdc", "#d63384", "#f5c518", "#e8740c", "#1f9d55", "#2dd4bf", "#7c5cff"];
  function resize() {
    const r = window.devicePixelRatio || 1;
    cv.width = innerWidth * r; cv.height = innerHeight * r;
    cx.setTransform(r, 0, 0, r, 0, 0);
  }
  function ensure() {
    if (cv) return;
    cv = document.createElement("canvas"); cv.className = "confetti"; cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv); cx = cv.getContext("2d"); resize();
    addEventListener("resize", resize);
  }
  function loop() {
    cx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life < p.max && p.y < innerHeight + 40);
    parts.forEach(p => {
      p.vy += p.g; p.vx *= 0.985; p.vy *= 0.985; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      cx.save(); cx.globalAlpha = Math.max(0, 1 - p.life / p.max); cx.translate(p.x, p.y); cx.rotate(p.rot);
      cx.fillStyle = p.c;
      if (p.round) { cx.beginPath(); cx.arc(0, 0, p.s / 2.4, 0, Math.PI * 2); cx.fill(); }
      else cx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2 * Math.abs(Math.cos(p.life / 6)) + 1);
      cx.restore();
    });
    raf = parts.length ? requestAnimationFrame(loop) : (cx.clearRect(0, 0, innerWidth, innerHeight), null);
  }
  function burst(o = {}) {
    if (REDUCED) return;
    ensure();
    const x = o.x === undefined ? innerWidth / 2 : o.x, y = o.y === undefined ? innerHeight / 3 : o.y;
    const n = o.n || 110, power = o.power || 11, spread = o.spread || Math.PI * 2, dir = o.dir === undefined ? -Math.PI / 2 : o.dir;
    const colors = o.colors || COLORS;
    for (let i = 0; i < n; i++) {
      const a = dir + (Math.random() - 0.5) * spread, v = power * (0.45 + Math.random() * 0.75);
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0.28, s: 6 + Math.random() * 7, rot: Math.random() * 6.3,
        vr: (Math.random() - 0.5) * 0.35, c: colors[i % colors.length], life: 0, max: 80 + Math.random() * 70, round: Math.random() < 0.3 });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }
  function fromEl(el, o = {}) {
    if (!el) return burst(o);
    const r = el.getBoundingClientRect();
    burst(Object.assign({ x: r.left + r.width / 2, y: r.top + r.height / 2, n: 60, power: 8 }, o));
  }
  function rain(o = {}) {
    if (REDUCED) return;
    [0.15, 0.5, 0.85].forEach((fx, k) => setTimeout(() => burst(Object.assign({ x: innerWidth * fx, y: innerHeight * 0.35, n: 90, power: 13 }, o)), k * 180));
  }
  return { burst, fromEl, rain };
})();

function splash({ title, sub = "", icon = "", color = "var(--accent)", ms = 1150 }) {
  document.querySelectorAll(".splash").forEach(s => s.remove());
  const d = document.createElement("div");
  d.className = "splash"; d.setAttribute("role", "status"); d.style.setProperty("--sc", color);
  d.innerHTML = `<div class="splash-card">${icon ? `<div class="splash-icon">${icon}</div>` : ""}<div class="splash-title">${title}</div>${sub ? `<div class="splash-sub">${sub}</div>` : ""}</div>`;
  const close = () => { d.classList.add("out"); setTimeout(() => d.remove(), 350); };
  d.addEventListener("click", close);
  document.body.appendChild(d);
  setTimeout(close, REDUCED ? 700 : ms);
}
function floatText(el, text, color = "var(--ok)") {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const s = document.createElement("div");
  s.className = "float-pts"; s.textContent = text; s.style.color = color;
  s.style.left = (r.left + r.width / 2) + "px"; s.style.top = (r.top + 4) + "px";
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1400);
}
function countUp(el, from, to, dur = 750) {
  if (!el || from === to) return;
  if (REDUCED) { el.textContent = to; return; }
  const t0 = performance.now();
  el.classList.remove("counting"); void el.offsetWidth; el.classList.add("counting");
  const step = now => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function redFlash() {
  if (REDUCED) return;
  const d = document.createElement("div"); d.className = "flash-red";
  document.body.appendChild(d); setTimeout(() => d.remove(), 950);
}
