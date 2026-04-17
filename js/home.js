/* ═══════════════════════════════════════
   ORBITWATCH — HOME PAGE JS
   ═══════════════════════════════════════ */

// ── Star field ───────────────────────────────────────────────────────────────
(function buildStars() {
  const sf = document.getElementById('starField');
  if (!sf) return;
  for (let i = 0; i < 140; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    const op = (Math.random() * 0.6 + 0.2).toFixed(2);
    const dur = (Math.random() * 4 + 2).toFixed(1);
    const delay = (Math.random() * 5).toFixed(1);
    Object.assign(s.style, {
      width: size + 'px', height: size + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      '--op': op, '--dur': dur + 's', '--delay': delay + 's',
    });
    sf.appendChild(s);
  }
})();

// ── Reveal on scroll ─────────────────────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

// ── Featured Cards ───────────────────────────────────────────────────────────
function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = SATELLITES.filter(s => FEATURED_NAMES.includes(s.name));
  featured.forEach((sat, i) => {
    const card = document.createElement('div');
    card.className = 'sat-feature-card reveal';
    card.style.transitionDelay = (i * 0.08) + 's';
    card.innerHTML = `
      ${INDIAN_NORADS.includes(sat.norad) ? '<div style="position:absolute;top:12px;right:12px;font-size:18px;opacity:.85">🇮🇳</div>' : ''}
      <div class="sfc-header">
        <div>
          <div class="sfc-name">${sat.name}</div>
          <span class="sat-badge ${BADGE_CLASSES[sat.cat] || ''}">${BADGE_LABELS[sat.cat] || sat.cat}</span>
        </div>
        <div class="sfc-icon">${sat.icon}</div>
      </div>
      <div class="sfc-desc">${sat.desc.split('.')[0] + '.'}</div>
      <div class="sfc-telemetry">
        <div class="sfc-telem-item">
          <div class="sfc-telem-label">Altitude</div>
          <div class="sfc-telem-val" id="home-alt-${sat.norad}">…</div>
        </div>
        <div class="sfc-telem-item">
          <div class="sfc-telem-label">Velocity</div>
          <div class="sfc-telem-val" id="home-vel-${sat.norad}">…</div>
        </div>
      </div>
      <a href="pages/tracker.html?norad=${sat.norad}" class="btn-track">Track Now →</a>
    `;
    grid.appendChild(card);
    revealObs.observe(card);
  });
}

// ── Live telemetry on home cards ─────────────────────────────────────────────
function updateHomeTelemetry() {
  const now = new Date();
  SATELLITES.filter(s => FEATURED_NAMES.includes(s.name)).forEach(sat => {
    const pos = getSatPosition(sat, now);
    if (!pos) return;
    const altEl = document.getElementById('home-alt-' + sat.norad);
    const velEl = document.getElementById('home-vel-' + sat.norad);
    if (altEl) altEl.textContent = Math.round(pos.alt) + ' km';
    if (velEl) velEl.textContent = (pos.vel * 3.6).toFixed(0) + ' km/h';
  });
}

// ── Mobile menu ──────────────────────────────────────────────────────────────
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
  document.getElementById('mobileNav')?.classList.toggle('open');
});

// ── Section reveals ──────────────────────────────────────────────────────────
document.querySelectorAll('.feature-item, .testimonial-card').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// ── India Spotlight Grid ──────────────────────────────────────────────────────
function renderIndiaGrid() {
  const grid = document.getElementById('indiaGrid');
  if (!grid) return;
  const indianSats = SATELLITES.filter(s => INDIAN_NORADS.includes(s.norad));
  indianSats.forEach((sat, i) => {
    const card = document.createElement('div');
    card.className = 'reveal';
    card.style.cssText = `
      background: var(--surface2);
      border: 1px solid rgba(255,153,0,.2);
      border-radius: 12px; padding: 20px;
      transition: all .25s; cursor: pointer;
      transition-delay: ${i * 0.1}s;
    `;
    card.onmouseover = () => { card.style.borderColor = 'rgba(255,153,0,.5)'; card.style.transform = 'translateY(-3px)'; };
    card.onmouseout  = () => { card.style.borderColor = 'rgba(255,153,0,.2)'; card.style.transform = 'translateY(0)'; };
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
        <div>
          <div style="font-family:var(--font-display);font-size:17px;font-weight:800;margin-bottom:6px;">${sat.icon} ${sat.name}</div>
          <span class="sat-badge ${BADGE_CLASSES[sat.cat]||''}">${BADGE_LABELS[sat.cat]||sat.cat}</span>
        </div>
        <span style="font-size:26px;">🇮🇳</span>
      </div>
      <div style="font-size:12px;color:var(--muted);line-height:1.65;margin:10px 0 14px;">${sat.desc.split('.')[0]}.</div>
      <div style="display:flex;gap:10px;margin-bottom:14px;">
        <div style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 10px;">
          <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Altitude</div>
          <div style="font-family:var(--font-display);font-size:15px;font-weight:700;color:#ff9900;" id="india-alt-${sat.norad}">…</div>
        </div>
        <div style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 10px;">
          <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Velocity</div>
          <div style="font-family:var(--font-display);font-size:15px;font-weight:700;color:#ff9900;" id="india-vel-${sat.norad}">…</div>
        </div>
        <div style="flex:1;background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:8px 10px;">
          <div style="font-size:9px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Launch</div>
          <div style="font-family:var(--font-display);font-size:11px;font-weight:700;color:var(--text);margin-top:3px;">${sat.launch||'—'}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <a href="pages/tracker.html?norad=${sat.norad}" style="flex:1;text-align:center;padding:10px;border-radius:8px;background:rgba(255,153,0,.1);border:1px solid rgba(255,153,0,.3);color:#ff9900;font-size:12px;font-family:var(--font-mono);transition:all .2s;" onmouseover="this.style.background='rgba(255,153,0,.2)'" onmouseout="this.style.background='rgba(255,153,0,.1)'">🛰️ Track Live</a>
        <a href="pages/chat.html" style="flex:1;text-align:center;padding:10px;border-radius:8px;background:rgba(123,97,255,.08);border:1px solid rgba(123,97,255,.25);color:var(--accent2);font-size:12px;font-family:var(--font-mono);transition:all .2s;" onmouseover="this.style.background='rgba(123,97,255,.15)'" onmouseout="this.style.background='rgba(123,97,255,.08)'">🤖 Ask ARIA</a>
      </div>
    `;
    grid.appendChild(card);
    revealObs.observe(card);
  });
}

function updateIndiaTelemetry() {
  const now = new Date();
  SATELLITES.filter(s => INDIAN_NORADS.includes(s.norad)).forEach(sat => {
    const pos = getSatPosition(sat, now);
    if (!pos) return;
    const a = document.getElementById('india-alt-' + sat.norad);
    const v = document.getElementById('india-vel-' + sat.norad);
    if (a) a.textContent = Math.round(pos.alt) + ' km';
    if (v) v.textContent = (pos.vel * 3.6).toFixed(0) + ' km/h';
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────
renderFeatured();
renderIndiaGrid();
updateHomeTelemetry();
updateIndiaTelemetry();
setInterval(() => { updateHomeTelemetry(); updateIndiaTelemetry(); }, 2000);
