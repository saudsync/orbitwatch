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

// ── Init ──────────────────────────────────────────────────────────────────────
renderFeatured();
updateHomeTelemetry();
setInterval(updateHomeTelemetry, 2000);
