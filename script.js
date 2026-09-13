/* ─────────────────────────────────────────────
   Daniel Raj V Portfolio — script.js
   Phase 2 Hybrid Multi-Page Routing Engine
───────────────────────────────────────────── */

(()=>{
'use strict';
const qs=(s,c=document)=>c.querySelector(s);
const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
const lerp=(a,b,t)=>a+(b-a)*t;

/* ── 1. CLIENT-SIDE HASH ROUTER ENGINE ───────── */
(function(){
  const views = qsa('.view-page');
  const breadcrumbEl = qs('#hud-breadcrumb');

  const ROUTE_MAP = {
    '': { id: 'view-overview', path: '~/overview' },
    '#overview': { id: 'view-overview', path: '~/overview' },
    '#about': { id: 'view-about', path: '~/about' },
    '#lytrix': { id: 'view-lytrix', path: '~/projects/lytrix' },
    '#parkin-today': { id: 'view-parkin-today', path: '~/projects/parkin-today' },
    '#luna-carin': { id: 'view-luna-carin', path: '~/projects/luna-carin' },
    '#eseva': { id: 'view-eseva', path: '~/projects/eseva' },
    '#roam': { id: 'view-roam', path: '~/projects/roam' },
    '#adder': { id: 'view-adder', path: '~/projects/2-bit-adder' },
    '#log': { id: 'view-log', path: '~/log' },
    '#resume': { id: 'view-resume', path: '~/resume' },
    '#now': { id: 'view-now', path: '~/now' },
    '#contact': { id: 'view-contact', path: '~/contact' }
  };

  function handleRoute() {
    const hash = window.location.hash || '#overview';
    const route = ROUTE_MAP[hash] || { id: 'view-404', path: '~/segfault-404' };

    function renderView() {
      views.forEach(v => v.classList.remove('active-view'));
      const activeEl = qs('#' + route.id);
      if (activeEl) {
        activeEl.classList.add('active-view');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
      if (breadcrumbEl) {
        breadcrumbEl.innerHTML = `<span class="text-stone-500">SYS //</span> <span class="crumb-active">${route.path}</span>`;
      }
      // Re-trigger scroll reveals inside active view
      qsa('.rv', activeEl).forEach(el => el.classList.add('in'));
    }

    if (document.startViewTransition) {
      document.startViewTransition(renderView);
    } else {
      renderView();
    }
  }

  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('DOMContentLoaded', handleRoute);
})();

/* ── 2. BOOT SEQUENCE INTRO ──────────────────── */
(function(){
  const bootScreen = qs('#boot-screen');
  const bootLog = qs('#boot-log');
  const skipBtn = qs('#boot-skip');
  if (!bootScreen || !bootLog) return;

  if (sessionStorage.getItem('booted') === '1') {
    bootScreen.classList.add('dismissed');
    return;
  }

  const logs = [
    "[SYS_INIT] Loading LyTrix language kernel...",
    "[MEM_CHK] 64KB stack space allocated.",
    "[NET_SCAN] Probing Cloudflare Tunnels & ngrok...",
    "[GPU_ACCEL] WebGL 2D Particle matrix online.",
    "[COMPILER] QBE IR Backend linked successfully.",
    "[EXEC_READY] Daniel Raj V Portfolio active."
  ];

  let lineIdx = 0, charIdx = 0;
  function typeNextChar() {
    if (lineIdx >= logs.length) {
      setTimeout(dismissBoot, 300);
      return;
    }
    const currentLine = logs[lineIdx];
    if (charIdx === 0) {
      const p = document.createElement('div');
      p.className = 'boot-line';
      p.style.marginBottom = '4px';
      bootLog.appendChild(p);
    }
    const lastLine = bootLog.lastElementChild;
    lastLine.textContent += currentLine[charIdx];
    charIdx++;
    if (charIdx < currentLine.length) {
      setTimeout(typeNextChar, 12);
    } else {
      charIdx = 0;
      lineIdx++;
      setTimeout(typeNextChar, 100);
    }
  }

  function dismissBoot() {
    sessionStorage.setItem('booted', '1');
    bootScreen.classList.add('dismissed');
  }

  if (skipBtn) skipBtn.addEventListener('click', dismissBoot);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') dismissBoot();
  }, { once: true });

  setTimeout(typeNextChar, 150);
})();

/* ── 3. HERO CANVAS PARTICLES ────────────────── */
(function(){
  const canvas = qs('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -1000, y: -1000 };
  let isVisible = true;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  window.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  function P() { this.reset(); }
  P.prototype.reset = function() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 1.5 + 0.5;
    this.a = Math.random() * 0.5 + 0.15;
  };
  P.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  for (let i = 0; i < 70; i++) particles.push(new P());

  function draw() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          const a = (1 - d / 120) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 95, 31, ${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      const dx = particles[i].x - mouse.x, dy = particles[i].y - mouse.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 160) {
        const a = (1 - d / 160) * 0.45;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(255, 95, 31, ${a})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      particles[i].update();
      ctx.beginPath();
      ctx.arc(particles[i].x, particles[i].y, particles[i].r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 95, 31, ${particles[i].a})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();

  const io = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible) draw();
  });
  io.observe(canvas);
})();

/* ── 4. DUAL CURSOR ENGINE ───────────────────── */
(function(){
  const dot = qs('#c-dot'), ring = qs('#c-ring');
  if (!dot || !ring) return;
  let mx = -200, my = -200, rx = -200, ry = -200;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
  }, { passive: true });

  (function loop(){
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  qsa('a, button, .data-panel, .pipe-node, .acc-trigger, .nav-link, .adder-toggle-btn, .doorway-card, .graph-chip').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('on-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('on-link'));
  });
})();

/* ── 5. COMMAND PALETTE (CMD+K) ──────────────── */
(function(){
  const backdrop = qs('#cmd-palette-backdrop');
  const input = qs('#cmd-input');
  const results = qs('#cmd-results');
  if (!backdrop || !input || !results) return;

  const items = [
    { label: "Overview Home Page", hash: "#overview" },
    { label: "About Me & Timeline (/about)", hash: "#about" },
    { label: "LyTrix Language Case Study (/lytrix)", hash: "#lytrix" },
    { label: "Parkin Today ANPR Case Study (/parkin-today)", hash: "#parkin-today" },
    { label: "Luna Carin AI Assistant (/luna-carin)", hash: "#luna-carin" },
    { label: "E-Seva Complaint Portal (/eseva)", hash: "#eseva" },
    { label: "ROAM.ver Pocket Server (/roam)", hash: "#roam" },
    { label: "2-Bit Binary Adder Sandbox (/adder)", hash: "#adder" },
    { label: "Systems Log Changelog (/log)", hash: "#log" },
    { label: "Interactive Resume (/resume)", hash: "#resume" },
    { label: "Currently Building (/now)", hash: "#now" },
    { label: "Get In Touch (/contact)", hash: "#contact" }
  ];

  function render(query = "") {
    results.innerHTML = "";
    const filtered = items.filter(i => i.label.toLowerCase().includes(query.toLowerCase()));
    filtered.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = `cmd-item ${idx === 0 ? 'selected' : ''}`;
      li.innerHTML = `<span>${item.label}</span><span style="font-size:0.6rem;color:var(--accent-ore);border:1px solid rgba(255,95,31,0.3);padding:2px 6px;border-radius:4px">ROUTE</span>`;
      li.addEventListener('click', () => {
        window.location.hash = item.hash;
        close();
      });
      results.appendChild(li);
    });
  }

  function open() {
    backdrop.classList.add('open');
    input.value = "";
    render();
    setTimeout(() => input.focus(), 50);
  }
  function close() { backdrop.classList.remove('open'); }

  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      backdrop.classList.contains('open') ? close() : open();
    }
    if (e.key === 'Escape' && backdrop.classList.contains('open')) close();
  });

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) close();
  });
  input.addEventListener('input', () => render(input.value));
})();

/* ── 6. SYSTEMS LOG TAG FILTERING ────────────── */
(function(){
  const filterBtns = qsa('.log-filter-btn');
  const logEntries = qsa('.log-feed-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'bg-orange-500', 'text-black'));
      filterBtns.forEach(b => b.classList.add('border-white/10', 'text-gray-400'));
      btn.classList.add('active', 'bg-orange-500', 'text-black');
      btn.classList.remove('border-white/10', 'text-gray-400');

      const tag = btn.dataset.tag;
      logEntries.forEach(entry => {
        if (tag === 'all' || entry.dataset.tags.includes(tag)) {
          entry.style.display = 'flex';
        } else {
          entry.style.display = 'none';
        }
      });
    });
  });
})();

/* ── 7. DATA PANEL 3D TILT & SVG BORDER DRAW ──── */
qsa('.data-panel').forEach(panel => {
  panel.addEventListener('mousemove', e => {
    const r = panel.getBoundingClientRect();
    const ox = (e.clientX - r.left) / r.width;
    const oy = (e.clientY - r.top) / r.height;
    panel.style.setProperty('--mx', (ox * 100).toFixed(1) + '%');
    panel.style.setProperty('--my', (oy * 100).toFixed(1) + '%');
    const rotX = (oy - 0.5) * -4;
    const rotY = (ox - 0.5) * 4;
    panel.style.transform = `perspective(900px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
  });
  panel.addEventListener('mouseleave', () => {
    panel.style.transform = '';
  });
});

(function(){
  function updatePerimeters() {
    qsa('.data-panel').forEach(panel => {
      const svg = panel.querySelector('svg.border-svg');
      const rect = svg && svg.querySelector('rect');
      if (!rect) return;
      const W = panel.offsetWidth, H = panel.offsetHeight;
      rect.setAttribute('width', W - 2);
      rect.setAttribute('height', H - 2);
      const perim = 2 * (W + H);
      rect.style.strokeDasharray = perim;
      rect.style.strokeDashoffset = perim;
    });
  }
  updatePerimeters();
  new ResizeObserver(updatePerimeters).observe(document.body);
  qsa('.data-panel').forEach(p => {
    p.addEventListener('mouseenter', () => p.classList.add('drawn'));
    p.addEventListener('mouseleave', () => p.classList.remove('drawn'));
  });
})();

/* ── 8. LYTRIX PIPELINE VISUALIZER ───────────── */
(function(){
  const STAGES = [
    { label: 'STAGE 01 - SOURCE CODE READOUT', code: 'LTProgramFileCode main() {\n    LTGlobalVar x = 10 + 20;\n    BackLine(x);\n}', telemetry: '[TELEMETRY] Stream Speed: 1.48 Mtok/s | Byte Size: 78 bytes | Status: OK' },
    { label: 'STAGE 02 - LEXER TOKEN STREAM', code: '[LTProgramFileCode, "LTProgramFileCode"] [IDENT, "main"] [LPAREN, "("] [RPAREN, ")"] [LBRACE, "{"]\n[LTGlobalVar, "LTGlobalVar"] [IDENT, "x"] [ASSIGN, "="] [INT, 10] [PLUS, "+"] [INT, 20] [SEMICOLON, ";"]\n[BackLine, "BackLine"] [LPAREN, "("] [IDENT, "x"] [RPAREN, ")"] [SEMICOLON, ";"] [RBRACE, "}"]', telemetry: '[TELEMETRY] Token Count: 14 | Lexer Latency: 0.12ms | Memory Footprint: 2.1 KB' },
    { label: 'STAGE 03 - PARSER / AST TREE DUMP', code: 'FunctionDecl {\n  name: "main",\n  body: [\n    VarDeclStmt  { id: "x", value: BinaryExpr(10 + 20) },\n    BackLineStmt { expr: Identifier("x") }\n  ]\n}', telemetry: '[TELEMETRY] AST Nodes: 6 | Visitor Depth: 3 | Parse Time: 0.28ms' },
    { label: 'STAGE 04 - QBE IR CODE GENERATION', code: 'export function w $main() {\n@start\n    %x =w add 10, 20\n    ret %x\n}', telemetry: '[TELEMETRY] SSA Formats: Enabled | QBE Target: x86_64 | Optimization Pass: 0.4ms' },
    { label: 'STAGE 05 - EXECUTION OUTPUT & RUNTIME', code: '[LyTrix-R Virtual Runtime Execution Output]\n\nReturn value: 30\nProcess exited with code 0.', telemetry: '[TELEMETRY] Memory Alloc: 512 bytes | Exit Code: 0 | CPU Cycles: 1,402' }
  ];

  function setupPipeline(containerId, outId, labelId, telId) {
    const nodes = qsa(`#${containerId} .pipe-node`);
    if (!nodes.length) return;
    nodes.forEach(n => {
      n.addEventListener('click', () => {
        nodes.forEach(x => x.classList.remove('active'));
        n.classList.add('active');
        const d = STAGES[+n.dataset.step];
        const codeBox = qs(`#${outId}`);
        const labelEl = qs(`#${labelId}`);
        const telEl = qs(`#${telId}`);
        if (codeBox) codeBox.textContent = d.code;
        if (labelEl) labelEl.textContent = d.label;
        if (telEl) telEl.textContent = d.telemetry;
      });
    });
  }

  setupPipeline('pipeline', 'pipe-out', 'pipe-label', 'pipe-telemetry');
  setupPipeline('pipeline-cs', 'pipe-out-cs', 'pipe-label-cs', 'pipe-telemetry-cs');
})();

/* ── 9. HARDWARE LOGIC SIMULATION: 2-BIT BINARY ADDER ── */
(function(){
  const state = { a1:0, a0:0, b1:0, b0:0 };
  const readouts = [qs('#adder-readout'), qs('#adder-readout-page')].filter(Boolean);
  if (!readouts.length) return;

  const btnGroups = [
    { a1: qs('#btn-a1'), a0: qs('#btn-a0'), b1: qs('#btn-b1'), b0: qs('#btn-b0') },
    { a1: qs('#btn-a1-page'), a0: qs('#btn-a0-page'), b1: qs('#btn-b1-page'), b0: qs('#btn-b0-page') }
  ];

  function updateAdder() {
    const { a1, a0, b1, b0 } = state;
    const valA = (a1 << 1) | a0;
    const valB = (b1 << 1) | b0;

    const s0 = a0 ^ b0;
    const c1 = a0 & b0;
    const s1 = a1 ^ b1 ^ c1;
    const c2 = (a1 & b1) | (c1 & (a1 ^ b1));

    const text =
`Input A: ${valA} (${a1}${a0}_2)  |  Input B: ${valB} (${b1}${b0}_2)
Stage 0 (Bit 0 Half-Adder): S0 = ${a0} ^ ${b0} = ${s0}  | Carry C1 = ${a0} & ${b0} = ${c1}
Stage 1 (Bit 1 Full-Adder): S1 = ${a1} ^ ${b1} ^ ${c1} = ${s1} | Carry Out C2 = (${a1} & ${b1}) | (${c1} & (${a1} ^ ${b1})) = ${c2}
Binary Output: ${c2}${s1}${s0}_2  |  Decimal Output: ${valA + valB}`;

    readouts.forEach(r => r.textContent = text);

    btnGroups.forEach(btns => {
      Object.keys(btns).forEach(key => {
        if (btns[key]) {
          btns[key].textContent = `${key.toUpperCase()} [${state[key]}]`;
          btns[key].classList.toggle('active', state[key] === 1);
        }
      });
    });
  }

  btnGroups.forEach(btns => {
    Object.keys(btns).forEach(key => {
      if (btns[key]) {
        btns[key].addEventListener('click', () => {
          state[key] = state[key] === 0 ? 1 : 0;
          updateAdder();
        });
      }
    });
  });
  updateAdder();
})();

/* ── 10. COPY EMAIL & ACCORDIONS & MOBILE MENU ── */
(function(){
  const btn = qs('#copy-email');
  const toast = qs('#toast');
  if (btn) {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('fortunebros86@gmail.com').then(() => {
        if (toast) {
          toast.classList.add('in');
          setTimeout(() => toast.classList.remove('in'), 2800);
        }
      });
    });
  }

  qsa('.acc-trigger').forEach(b => {
    b.addEventListener('click', () => {
      const target = qs('#' + b.dataset.target);
      if (!target) return;
      const isOpen = target.classList.contains('open');
      const panel = b.closest('.data-panel') || b.closest('section');
      qsa('.acc-body', panel).forEach(x => x.classList.remove('open'));
      qsa('.acc-trigger', panel).forEach(x => x.classList.remove('open'));
      if (!isOpen) {
        target.classList.add('open');
        b.classList.add('open');
      }
    });
  });

  const ham = qs('#ham-btn'), drawer = qs('#m-drawer');
  if (ham) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('is-open');
      if (drawer) drawer.classList.toggle('open');
      document.body.style.overflow = drawer && drawer.classList.contains('open') ? 'hidden' : '';
    });
  }
  if (drawer) {
    qsa('a', drawer).forEach(a => a.addEventListener('click', () => {
      ham && ham.classList.remove('is-open');
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }
})();

})();