/* ═══════════════════════════════════════
   ORBITWATCH — TRACKER JS
   ═══════════════════════════════════════ */

// ── State ────────────────────────────────────────────────────────────────────
let selectedSat = null;
let filterCat = 'all';
let searchQuery = '';
let rotX = 0.3, rotY = 0;
let targetRotX = 0.3, targetRotY = 0;
let zoom = 1, targetZoom = 1;
let isDragging = false, lastMX = 0, lastMY = 0;
let altHistoryData = {};

// ── Canvas ───────────────────────────────────────────────────────────────────
const canvas = document.getElementById('globeCanvas');
const ctx = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  const wrap = document.getElementById('globeWrap');
  canvas.width = wrap.offsetWidth * (window.devicePixelRatio || 1);
  canvas.height = wrap.offsetHeight * (window.devicePixelRatio || 1);
  W = canvas.width; H = canvas.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── Stars ───────────────────────────────────────────────────────────────────
const STARS = Array.from({ length: 200 }, () => ({
  lat: Math.random() * 180 - 90,
  lng: Math.random() * 360 - 180,
  r: Math.random() * 1.8 + 0.3,
  op: Math.random() * 0.7 + 0.2,
}));

// ── Continent data (simplified great-circle segments) ───────────────────────
const CONTINENTS = [
  [[49,-66],[47,-53],[44,-52],[40,-52],[35,-75],[25,-80],[20,-87],[12,-85],[8,-77],[5,-76],[2,-74],[0,-75],[0,-78],[-5,-81],[-8,-74],[-10,-75],[-17,-71],[-30,-71],[-52,-69],[-55,-68],[-55,-65],[-50,-58],[-45,-52],[-35,-56],[-27,-49],[-23,-44],[-20,-40],[-10,-37],[-5,-35],[0,-35],[5,-35],[5,-60],[8,-62],[10,-61],[12,-65],[15,-61],[18,-66],[22,-74],[22,-80],[25,-81],[28,-82],[30,-85],[35,-76],[38,-75],[40,-74],[42,-70],[44,-66],[49,-64],[49,-66]],
  [[71,28],[68,18],[65,14],[63,10],[60,5],[58,5],[55,8],[53,8],[51,3],[50,2],[48,-2],[44,-2],[43,-8],[36,-6],[36,0],[36,10],[38,14],[40,18],[38,20],[37,22],[36,26],[37,28],[38,28],[40,26],[42,24],[44,28],[46,30],[48,38],[52,38],[55,38],[58,38],[60,30],[62,26],[65,26],[68,28],[71,28]],
  [[37,10],[22,38],[12,44],[12,50],[5,46],[0,42],[-5,40],[-10,38],[-20,36],[-26,33],[-34,26],[-34,18],[-28,17],[-22,14],[-10,14],[-5,10],[0,8],[5,2],[5,-3],[0,-8],[-5,-12],[-10,-14],[-15,-12],[-18,-12],[-22,-14],[-26,-15],[-33,-18],[-35,-20],[-34,-26],[-34,-30],[-26,-33],[-18,-34],[-10,-37],[-5,-35],[0,-35],[5,-35],[5,-36],[0,-40],[0,-45],[5,-55],[5,-60],[5,-62],[8,-62],[10,-63],[10,-60],[12,-60],[12,-62],[14,-61],[18,-66],[20,-68],[22,-74],[22,-80],[25,-77],[25,-81],[25,-82],[28,-82],[30,-85],[35,-76],[38,-75],[40,-74],[42,-70],[44,-66],[49,-64],[49,-66],[10,-63]],
  [[71,28],[71,50],[70,60],[68,60],[65,60],[60,60],[55,60],[50,60],[45,60],[42,50],[38,48],[37,40],[36,36],[37,28]],
  [[60,60],[60,80],[60,100],[55,100],[50,100],[45,100],[42,86],[40,80],[38,70],[40,60],[45,60],[50,60],[55,60],[60,60]],
  [[60,100],[60,120],[55,120],[50,120],[40,120],[30,120],[22,114],[20,110],[15,108],[10,104],[5,104],[0,104],[0,110],[5,108],[15,108],[20,112],[22,114],[28,120],[35,120],[40,124],[45,130],[50,140],[55,140],[60,140],[60,160],[60,180]],
  [[-22,114],[-17,122],[-15,130],[-12,136],[-15,136],[-17,140],[-22,150],[-28,154],[-34,151],[-38,148],[-38,140],[-36,136],[-34,136],[-34,130],[-36,118],[-32,116],[-28,114],[-22,114]],
  [[10,-63],[8,-60],[5,-62],[0,-50],[-5,-36],[-10,-38],[-20,-40],[-30,-52],[-40,-62],[-55,-68],[-55,-65],[-52,-69],[-48,-52],[-42,-52],[-38,-55],[-35,-56],[-27,-49],[-23,-44],[-20,-40],[-15,-39],[-10,-37],[-5,-35],[0,-35],[5,-35],[5,-55],[5,-60],[5,-62],[8,-62],[10,-62],[10,-63]],
];

// ── 3D math ─────────────────────────────────────────────────────────────────
function latLngTo3D(lat, lng, r) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lng + 180) * Math.PI / 180;
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta),
  };
}

function project(p, cx, cy, R) {
  let { x, y, z } = p;
  let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
  let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
  let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
  let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
  const fov = 2.5;
  const scale = fov / (fov + z2 / R) * R * zoom;
  return { sx: cx + x1 * scale / R, sy: cy - y2 * scale / R, depth: z2, visible: z2 > -R * 0.1 };
}

// ── Draw globe ───────────────────────────────────────────────────────────────
function drawGlobe() {
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) * 0.34;
  ctx.clearRect(0, 0, W, H);

  // Space
  const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
  bg.addColorStop(0, '#060c1a'); bg.addColorStop(1, '#020409');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Stars
  STARS.forEach(s => {
    const p = project(latLngTo3D(s.lat, s.lng, R * 3.5), cx, cy, R * 3.5);
    if (p.visible) {
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.op})`; ctx.fill();
    }
  });

  // Atmosphere glow
  const atm = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R * 1.18);
  atm.addColorStop(0, 'rgba(0,100,255,0)');
  atm.addColorStop(1, 'rgba(0,140,255,0.18)');
  ctx.beginPath(); ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
  ctx.fillStyle = atm; ctx.fill();

  // Globe body
  const globe = ctx.createRadialGradient(cx - R * 0.25, cy - R * 0.25, R * 0.1, cx, cy, R);
  globe.addColorStop(0, '#0a2040'); globe.addColorStop(0.6, '#061228'); globe.addColorStop(1, '#020a18');
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fillStyle = globe; ctx.fill();

  // Grid
  ctx.strokeStyle = 'rgba(0,80,160,0.15)'; ctx.lineWidth = 0.5;
  for (let lat = -60; lat <= 60; lat += 30) {
    ctx.beginPath(); let first = true;
    for (let lng = -180; lng <= 180; lng += 4) {
      const pj = project(latLngTo3D(lat, lng, R), cx, cy, R);
      if (pj.visible) { first ? ctx.moveTo(pj.sx, pj.sy) : ctx.lineTo(pj.sx, pj.sy); first = false; }
      else first = true;
    }
    ctx.stroke();
  }
  for (let lng = -180; lng <= 180; lng += 30) {
    ctx.beginPath(); let first = true;
    for (let lat = -90; lat <= 90; lat += 4) {
      const pj = project(latLngTo3D(lat, lng, R), cx, cy, R);
      if (pj.visible) { first ? ctx.moveTo(pj.sx, pj.sy) : ctx.lineTo(pj.sx, pj.sy); first = false; }
      else first = true;
    }
    ctx.stroke();
  }

  // Continents
  CONTINENTS.forEach(pts => {
    ctx.beginPath(); let first = true;
    pts.forEach(([lat, lng]) => {
      const pj = project(latLngTo3D(lat, lng, R), cx, cy, R);
      if (pj.visible) { first ? ctx.moveTo(pj.sx, pj.sy) : ctx.lineTo(pj.sx, pj.sy); first = false; }
      else first = true;
    });
    ctx.fillStyle = 'rgba(0,55,110,0.28)'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,180,255,0.4)'; ctx.lineWidth = 0.9; ctx.stroke();
  });

  // Globe edge
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0,140,255,0.28)'; ctx.lineWidth = 1.5; ctx.stroke();

  // Satellites
  const now = new Date();
  const SAT_COLORS = { station: '#00ff9d', comms: '#00d4ff', earth: '#ff8c42', obs: '#ff4560', nav: '#7b61ff' };
  const filtered = getFiltered();

  filtered.forEach(sat => {
    const pos = getSatPosition(sat, now);
    if (!pos) return;
    const orbitR = R + (Math.min(pos.alt, 35786) / 35786) * R * 0.7;
    const pj = project(latLngTo3D(pos.lat, pos.lng, orbitR), cx, cy, R);
    if (!pj.visible) return;

    const col = SAT_COLORS[sat.cat] || '#00d4ff';
    const isSel = selectedSat && selectedSat.norad === sat.norad;

    // Orbit trail for selected
    if (isSel) {
      ctx.beginPath(); let first = true;
      for (let dt = -25; dt <= 0; dt += 2) {
        const pp = getSatPosition(sat, new Date(now.getTime() + dt * 60000));
        if (!pp) continue;
        const or2 = R + (Math.min(pp.alt, 35786) / 35786) * R * 0.7;
        const pj2 = project(latLngTo3D(pp.lat, pp.lng, or2), cx, cy, R);
        if (pj2.visible) {
          first ? ctx.moveTo(pj2.sx, pj2.sy) : ctx.lineTo(pj2.sx, pj2.sy);
          first = false;
        } else first = true;
      }
      ctx.strokeStyle = col + '70'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    // Glow for selected
    if (isSel) {
      ctx.beginPath(); ctx.arc(pj.sx, pj.sy, 14, 0, Math.PI * 2);
      ctx.fillStyle = col + '18'; ctx.fill();
      ctx.beginPath(); ctx.arc(pj.sx, pj.sy, 9, 0, Math.PI * 2);
      ctx.fillStyle = col + '35'; ctx.fill();
    }

    // Dot
    ctx.beginPath(); ctx.arc(pj.sx, pj.sy, isSel ? 5.5 : 3.5, 0, Math.PI * 2);
    ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 0.8; ctx.stroke();

    // Label
    if (isSel) {
      const dpr = window.devicePixelRatio || 1;
      ctx.font = `bold ${11 * dpr}px "Space Mono", monospace`;
      ctx.fillStyle = col;
      ctx.fillText(sat.name, pj.sx + 10, pj.sy - 8);
    }
  });
}

// ── Main loop ─────────────────────────────────────────────────────────────────
function tick() {
  rotX += (targetRotX - rotX) * 0.09;
  rotY += (targetRotY - rotY) * 0.09;
  zoom += (targetZoom - zoom) * 0.09;
  if (!isDragging) targetRotY += 0.0012;
  drawGlobe();
  updateClock();
  updateHUD();
  if (selectedSat) updateDetailLive();
  requestAnimationFrame(tick);
}

// ── Clock ─────────────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('clockTime').textContent =
    now.getUTCHours().toString().padStart(2,'0') + ':' +
    now.getUTCMinutes().toString().padStart(2,'0') + ':' +
    now.getUTCSeconds().toString().padStart(2,'0');
  document.getElementById('clockDate').textContent =
    now.toUTCString().split(' ').slice(0,4).join(' ');
}

// ── HUD ──────────────────────────────────────────────────────────────────────
function updateHUD() {
  document.getElementById('hudCount').textContent = SATELLITES.length;
  if (selectedSat) {
    const pos = getSatPosition(selectedSat, new Date());
    if (pos) {
      document.getElementById('hudAlt').textContent = Math.round(pos.alt) + ' km';
      document.getElementById('hudVel').textContent = (pos.vel * 3.6).toFixed(1) + ' km/h';
    }
  } else {
    document.getElementById('hudAlt').textContent = '—';
    document.getElementById('hudVel').textContent = '—';
  }
}

// ── Sidebar List ──────────────────────────────────────────────────────────────
function getFiltered() {
  return SATELLITES.filter(s => {
    if (filterCat !== 'all' && s.cat !== filterCat) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.norad.includes(q);
    }
    return true;
  });
}

function renderList() {
  const list = document.getElementById('satList');
  const filtered = getFiltered();
  if (!filtered.length) {
    list.innerHTML = '<div style="padding:24px;text-align:center;color:var(--muted);font-size:12px;">No satellites found</div>';
    return;
  }
  list.innerHTML = filtered.map(sat => `
    <div class="sat-list-item ${selectedSat?.norad === sat.norad ? 'selected' : ''}" data-norad="${sat.norad}">
      <div class="sli-header">
        <div class="sli-name">${sat.icon} ${sat.name}</div>
        <span class="sat-badge ${BADGE_CLASSES[sat.cat] || ''}" style="font-size:9px">${BADGE_LABELS[sat.cat]||sat.cat}</span>
      </div>
      <div class="sli-meta">
        <div class="sli-meta-item">ALT <b id="sl-alt-${sat.norad}">…</b></div>
        <div class="sli-meta-item">VEL <b id="sl-vel-${sat.norad}">…</b></div>
      </div>
      <div class="sli-norad">NORAD: ${sat.norad}</div>
    </div>
  `).join('');

  list.querySelectorAll('.sat-list-item').forEach(el => {
    el.addEventListener('click', () => {
      const sat = SATELLITES.find(s => s.norad === el.dataset.norad);
      if (sat) openDetail(sat);
    });
  });
  updateListTelemetry();
}

function updateListTelemetry() {
  const now = new Date();
  SATELLITES.forEach(sat => {
    const pos = getSatPosition(sat, now);
    if (!pos) return;
    const ae = document.getElementById('sl-alt-' + sat.norad);
    const ve = document.getElementById('sl-vel-' + sat.norad);
    if (ae) ae.textContent = Math.round(pos.alt) + 'km';
    if (ve) ve.textContent = (pos.vel * 3.6).toFixed(0) + 'km/h';
  });
}
setInterval(updateListTelemetry, 2500);

// ── Detail Panel ─────────────────────────────────────────────────────────────
function openDetail(sat) {
  selectedSat = sat;
  document.getElementById('detailName').textContent = sat.name;
  const badge = document.getElementById('detailBadge');
  badge.textContent = BADGE_LABELS[sat.cat] || sat.cat;
  badge.className = 'sat-badge ' + (BADGE_CLASSES[sat.cat] || '');
  document.getElementById('detailDesc').textContent = sat.desc;
  updateDetailLive();
  renderOrbitParams(sat);
  drawAltChart(sat);
  document.getElementById('detailPanel').classList.add('open');

  // Highlight in sidebar
  document.querySelectorAll('.sat-list-item').forEach(el => {
    el.classList.toggle('selected', el.dataset.norad === sat.norad);
  });
}

function updateDetailLive() {
  if (!selectedSat) return;
  const pos = getSatPosition(selectedSat, new Date());
  if (!pos) return;
  document.getElementById('telemGrid').innerHTML = `
    <div class="telem-box"><div class="telem-box-label">Altitude</div><div class="telem-box-val">${Math.round(pos.alt)}<span class="telem-unit"> km</span></div></div>
    <div class="telem-box"><div class="telem-box-label">Velocity</div><div class="telem-box-val">${(pos.vel*3.6).toFixed(1)}<span class="telem-unit"> km/h</span></div></div>
    <div class="telem-box"><div class="telem-box-label">Latitude</div><div class="telem-box-val">${pos.lat.toFixed(3)}<span class="telem-unit">°</span></div></div>
    <div class="telem-box"><div class="telem-box-label">Longitude</div><div class="telem-box-val">${pos.lng.toFixed(3)}<span class="telem-unit">°</span></div></div>
  `;
}

function renderOrbitParams(sat) {
  const p = getOrbitalParams(sat);
  if (!p) { document.getElementById('orbitTable').innerHTML = '<div style="padding:8px 0;color:var(--muted);font-size:12px;">Orbital data unavailable</div>'; return; }
  document.getElementById('orbitTable').innerHTML = `
    <div class="orbit-row"><span class="orbit-k">Inclination</span><span class="orbit-v">${p.inc}°</span></div>
    <div class="orbit-row"><span class="orbit-k">Eccentricity</span><span class="orbit-v">${p.ecc}</span></div>
    <div class="orbit-row"><span class="orbit-k">RAAN</span><span class="orbit-v">${p.raan}°</span></div>
    <div class="orbit-row"><span class="orbit-k">Orbital Period</span><span class="orbit-v">${p.period} min</span></div>
    <div class="orbit-row"><span class="orbit-k">Semi-major Axis</span><span class="orbit-v">${p.sma} km</span></div>
    <div class="orbit-row"><span class="orbit-k">NORAD ID</span><span class="orbit-v">${sat.norad}</span></div>
    <div class="orbit-row"><span class="orbit-k">Launch</span><span class="orbit-v">${sat.launch||'—'}</span></div>
    <div class="orbit-row"><span class="orbit-k">Country</span><span class="orbit-v">${sat.country||'—'}</span></div>
    <div class="orbit-row"><span class="orbit-k">Mass</span><span class="orbit-v">${sat.mass||'—'}</span></div>
    <div class="orbit-row"><span class="orbit-k">Purpose</span><span class="orbit-v">${sat.purpose||'—'}</span></div>
  `;
}

// ── Alt Chart ────────────────────────────────────────────────────────────────
function drawAltChart(sat) {
  const c = document.getElementById('altChart');
  const dpr = window.devicePixelRatio || 1;
  c.width = c.offsetWidth * dpr; c.height = 80 * dpr;
  const cc = c.getContext('2d');
  cc.scale(dpr, dpr);
  const W2 = c.offsetWidth, H2 = 80;

  const now = new Date();
  const hist = [];
  for (let i = -60; i <= 0; i += 2) {
    const pp = getSatPosition(sat, new Date(now.getTime() + i * 60000));
    if (pp) hist.push(pp.alt);
  }
  if (!hist.length) return;

  const mn = Math.min(...hist), mx = Math.max(...hist);
  const pad = 10;
  const sy = v => H2 - pad - (v - mn) / (mx - mn || 1) * (H2 - pad * 2);

  // BG
  const gbg = cc.createLinearGradient(0,0,0,H2);
  gbg.addColorStop(0,'rgba(0,212,255,0.22)'); gbg.addColorStop(1,'rgba(0,212,255,0)');
  cc.beginPath(); cc.moveTo(0, H2);
  hist.forEach((v, i) => { const x = i * (W2 / (hist.length - 1)); cc.lineTo(x, sy(v)); });
  cc.lineTo(W2, H2); cc.closePath();
  cc.fillStyle = gbg; cc.fill();

  cc.beginPath();
  hist.forEach((v, i) => { const x = i * (W2 / (hist.length - 1)); i === 0 ? cc.moveTo(x, sy(v)) : cc.lineTo(x, sy(v)); });
  cc.strokeStyle = 'rgba(0,212,255,0.9)'; cc.lineWidth = 2; cc.stroke();

  // Labels
  cc.fillStyle = 'rgba(90,122,154,0.8)'; cc.font = `${9 * dpr}px monospace`;
  cc.fillText(Math.round(mx) + ' km', 4, pad + 9);
  cc.fillText(Math.round(mn) + ' km', 4, H2 - 4);
}

// ── Controls ─────────────────────────────────────────────────────────────────
canvas.addEventListener('mousedown', e => { isDragging = true; lastMX = e.clientX; lastMY = e.clientY; });
window.addEventListener('mouseup', () => isDragging = false);
window.addEventListener('mousemove', e => {
  if (!isDragging) return;
  targetRotY += (e.clientX - lastMX) * 0.005;
  targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX + (e.clientY - lastMY) * 0.005));
  lastMX = e.clientX; lastMY = e.clientY;
});
canvas.addEventListener('wheel', e => {
  targetZoom = Math.max(0.4, Math.min(4, targetZoom - e.deltaY * 0.001));
  e.preventDefault();
}, { passive: false });

// Touch
canvas.addEventListener('touchstart', e => { isDragging = true; lastMX = e.touches[0].clientX; lastMY = e.touches[0].clientY; });
canvas.addEventListener('touchend', () => isDragging = false);
canvas.addEventListener('touchmove', e => {
  if (!isDragging) return;
  targetRotY += (e.touches[0].clientX - lastMX) * 0.005;
  targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX + (e.touches[0].clientY - lastMY) * 0.005));
  lastMX = e.touches[0].clientX; lastMY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

document.getElementById('btnZoomIn').onclick = () => targetZoom = Math.min(4, targetZoom + 0.3);
document.getElementById('btnZoomOut').onclick = () => targetZoom = Math.max(0.4, targetZoom - 0.3);
document.getElementById('btnReset').onclick = () => { targetRotX = 0.3; targetRotY = 0; targetZoom = 1; };
document.getElementById('btnSidebar')?.addEventListener('click', () => {
  document.getElementById('trackerSidebar')?.classList.toggle('open');
});

document.getElementById('closeDetail').addEventListener('click', () => {
  selectedSat = null;
  document.getElementById('detailPanel').classList.remove('open');
  document.querySelectorAll('.sat-list-item').forEach(el => el.classList.remove('selected'));
  document.getElementById('hudAlt').textContent = '—';
  document.getElementById('hudVel').textContent = '—';
});

// Filter tabs
document.getElementById('filterRow').addEventListener('click', e => {
  if (!e.target.classList.contains('ftab')) return;
  filterCat = e.target.dataset.cat;
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  e.target.classList.add('active');
  renderList();
});

// Search
document.getElementById('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value;
  renderList();
});

// Mobile menu
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
  document.getElementById('mobileNav')?.classList.toggle('open');
});

// ── Auto-select from URL param ────────────────────────────────────────────────
function checkURLParam() {
  const params = new URLSearchParams(window.location.search);
  const norad = params.get('norad');
  if (norad) {
    const sat = SATELLITES.find(s => s.norad === norad);
    if (sat) setTimeout(() => openDetail(sat), 600);
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
renderList();
checkURLParam();
tick();

// Auto-open ISS if no param
setTimeout(() => {
  if (!selectedSat && !new URLSearchParams(window.location.search).get('norad')) {
    openDetail(SATELLITES.find(s => s.norad === '25544'));
  }
}, 800);
