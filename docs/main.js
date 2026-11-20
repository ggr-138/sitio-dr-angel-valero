(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = '524443350080';

  // Galería: duplicar fotos para bucle continuo
  const track = document.querySelector('.marquee-track');
  if (track) [...track.children].forEach((img) => {
    const c = img.cloneNode(); c.alt = ''; c.setAttribute('aria-hidden', 'true'); track.appendChild(c);
  });

  // Año footer
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Nav: fondo al hacer scroll
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > window.innerHeight * 0.75);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú móvil
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menu.hidden = !open;
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

  // Reveal al entrar en pantalla
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Indicador de sección + rail + nav activo
  const num = document.getElementById('indNum');
  const label = document.getElementById('indLabel');
  const railLinks = [...document.querySelectorAll('.rail a')];
  const navLinks = [...document.querySelectorAll('.nav-links a')];
  const secIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const s = en.target;
      num.textContent = s.dataset.num;
      label.textContent = s.dataset.label;
      const hash = '#' + s.id;
      railLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === hash));
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === hash));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[data-num]').forEach((s) => secIO.observe(s));

  // Parallax de los pictogramas en el hero (mouse y scroll)
  const tiles = [...document.querySelectorAll('.tile')];
  const hero = document.getElementById('inicio');
  if (!reduce && tiles.length) {
    let mx = 0, my = 0, tx = 0, ty = 0, sy = 0;
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener('pointerleave', () => { mx = 0; my = 0; });
    addEventListener('scroll', () => { sy = Math.min(scrollY, innerHeight); }, { passive: true });
    const loop = () => {
      tx += (mx - tx) * 0.06;
      ty += (my - ty) * 0.06;
      tiles.forEach((t) => {
        const d = parseFloat(t.dataset.depth) || 1;
        t.style.translate = `${(-tx * 60 * d).toFixed(1)}px ${(-ty * 50 * d - sy * 0.25 * d).toFixed(1)}px`;
      });
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // Tarjeta 3D que sigue al cursor
  const card = document.getElementById('card3d');
  if (card && !reduce && matchMedia('(hover: hover)').matches) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${(-6 + x * 12).toFixed(2)}deg) rotateX(${(4 - y * 10).toFixed(2)}deg)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }

  // Formulario → WhatsApp con mensaje prellenado
  document.getElementById('askForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = e.target;
    const motivo = f.motivo.value;
    const extra = f.msg.value.trim();
    let text = `Hola, doctor Valero, quiero informes para una valoración. Motivo: ${motivo}.`;
    if (extra) text += ` ${extra}`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  // Video de proceso: se reproduce (sin sonido) al entrar en pantalla
  const video = document.getElementById('procVideo');
  const soundBtn = document.getElementById('soundBtn');
  if (video) {
    const src = video.querySelector('source');
    src.addEventListener('error', () => { soundBtn.hidden = true; });
    video.addEventListener('loadeddata', () => { soundBtn.hidden = false; });
    const vIO = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !reduce) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.35 });
    vIO.observe(video);
    soundBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      if (!video.muted) video.play().catch(() => {});
      soundBtn.setAttribute('aria-pressed', String(!video.muted));
      soundBtn.querySelector('span').textContent = video.muted ? 'Activar sonido' : 'Silenciar';
    });
  }

  // Antes / después
  document.querySelectorAll('.ba').forEach((ba) => {
    const stage = ba.querySelector('.ba-stage');
    const range = ba.querySelector('.ba-range');
    const { before, after } = ba.dataset;
    if (before) { const el = ba.querySelector('.ba-before'); el.style.backgroundImage = `url("${before}")`; el.querySelector('.ba-ph')?.remove(); }
    if (after) { const el = ba.querySelector('.ba-after'); el.style.backgroundImage = `url("${after}")`; el.querySelector('.ba-ph')?.remove(); }
    const set = (v) => stage.style.setProperty('--pos', v + '%');
    range.addEventListener('input', () => set(range.value));
    set(range.value);
  });

  // Estado del consultorio (hora de San Luis Potosí)
  const status = document.getElementById('hoursStatus');
  if (status) {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Mexico_City', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = get('weekday');
    const mins = (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10);
    const inRange = (a, b) => mins >= a && mins < b;
    const weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].includes(day);
    const open = (weekday && (inRange(600, 840) || inRange(990, 1170))) || (day === 'Sat' && inRange(600, 840));
    status.textContent = open ? 'Abierto ahora: te respondemos pronto' : 'Cerrado ahora: escríbenos y te respondemos en el siguiente horario';
    status.classList.add(open ? 'open' : 'closed');
    status.hidden = false;
  }

  // ---------- v5 ----------
  const DOCTORALIA = 'https://www.doctoralia.com.mx/perfil/angel-gerardo-gonzalez-valero';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Contadores que suben al aparecer
  const counters = document.querySelectorAll('.count[data-to]');
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      cIO.unobserve(en.target);
      const el = en.target, to = parseInt(el.dataset.to, 10);
      if (reduce) { el.textContent = to; return; }
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * e);
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => cIO.observe(c));

  // Retrato del doctor: aparece desde abajo y se desplaza suave con el scroll
  const photo = document.getElementById('profilePhoto');
  if (photo) {
    new IntersectionObserver(([en], obs) => { if (en.isIntersecting) { photo.classList.add('in'); obs.disconnect(); } }, { threshold: 0.2 }).observe(photo);
    // Respaldo: si el navegador limita las animaciones, se revisa la posición al deslizar
    const reveal = () => { if (!photo.classList.contains('in') && photo.getBoundingClientRect().top < innerHeight * 0.85) photo.classList.add('in'); };
    addEventListener('scroll', reveal, { passive: true });
    reveal();
    if (!reduce) {
      const pImg = photo.querySelector('img');
      let ticking = false;
      addEventListener('scroll', () => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
          const r = photo.getBoundingClientRect();
          const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          if (photo.classList.contains('in') && Math.abs(p) < 1.5) pImg.style.translate = `0 ${(p * -40).toFixed(1)}px`;
          ticking = false;
        });
      }, { passive: true });
    }
  }

  // Cursos y reconocimientos (desde cursos.js)
  const cursos = Array.isArray(window.CURSOS) ? window.CURSOS : [];
  const cList = document.getElementById('cursosList');
  if (cList && cursos.length) {
    cList.innerHTML = cursos.map((c) => `
      <li class="${c.premio ? 'premio' : ''}">
        ${c.foto ? `<img src="${esc(c.foto)}" alt="" loading="lazy">` : '<span></span>'}
        <div><span class="c-date">${c.premio ? 'Reconocimiento · ' : ''}${esc(c.fecha)}</span><strong>${esc(c.titulo)}</strong><p>${esc(c.sede)}${c.tema ? '. ' + esc(c.tema) : ''}</p></div>
      </li>`).join('');
    cList.hidden = false;
  }

  // Avisos de opiniones de Doctoralia al deslizar
  const box = document.getElementById('toasts');
  const resenas = (Array.isArray(window.RESENAS) ? window.RESENAS : []).filter((r) => r && r.texto);
  const queue = resenas.length
    ? resenas.map((r) => ({ ...r, kind: 'review' }))
    : [{ kind: 'invite' }];
  let qi = 0, current = null, hideTimer = null;
  const muted = () => sessionStorage.getItem('toastsOff') === '1';
  const initials = (n) => String(n || 'P').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const dismiss = (t) => {
    if (!t) return;
    clearTimeout(hideTimer);
    t.classList.add('hide'); t.classList.remove('show');
    setTimeout(() => t.remove(), 320);
    if (current === t) current = null;
  };
  const showToast = () => {
    if (!box || muted() || current || qi >= queue.length) return;
    if (!document.getElementById('mobile-menu').hidden) return;
    const r = queue[qi++];
    const dur = r.kind === 'review' ? 9000 : 8000;
    const t = document.createElement('div');
    t.className = 'toast';
    t.setAttribute('role', 'status');
    t.style.setProperty('--t', dur + 'ms');
    t.innerHTML = r.kind === 'review'
      ? `<span class="toast-avatar" aria-hidden="true">${esc(initials(r.autor))}</span>
         <div class="toast-body">
           <div class="toast-head"><strong>${esc(r.autor || 'Paciente')}</strong><span class="toast-verified">✓ Doctoralia</span></div>
           <p class="toast-text">“${esc(r.texto)}”</p>
           <a class="toast-link" href="${DOCTORALIA}#profile-reviews" target="_blank" rel="noopener">${esc([r.motivo, r.fecha].filter(Boolean).join(' · ') || 'Ver más opiniones')}</a>
         </div>`
      : `<span class="toast-avatar" aria-hidden="true">390+</span>
         <div class="toast-body">
           <div class="toast-head"><strong>Opiniones verificadas</strong></div>
           <p class="toast-text">Más de 390 pacientes ya compartieron su experiencia con el doctor en Doctoralia.</p>
           <a class="toast-link" href="${DOCTORALIA}#profile-reviews" target="_blank" rel="noopener">Leer opiniones</a>
         </div>`;
    t.insertAdjacentHTML('beforeend', '<button class="toast-close" type="button" aria-label="Cerrar aviso y no mostrar más">×</button><span class="toast-progress" aria-hidden="true"><i></i></span>');
    t.querySelector('.toast-close').addEventListener('click', () => { sessionStorage.setItem('toastsOff', '1'); dismiss(t); });
    let left = dur, started = Date.now();
    const arm = () => { started = Date.now(); hideTimer = setTimeout(() => dismiss(t), left); };
    t.addEventListener('mouseenter', () => { clearTimeout(hideTimer); left -= Date.now() - started; });
    t.addEventListener('mouseleave', arm);
    box.appendChild(t);
    current = t;
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
    arm();
  };
  if (box) {
    // Se muestra un aviso cada vez que el lector avanza un tramo de la página (después del inicio)
    const steps = [0.14, 0.27, 0.4, 0.53, 0.66, 0.79, 0.9];
    let nextStep = 0;
    addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      while (nextStep < steps.length && p >= steps[nextStep]) { nextStep++; showToast(); }
    }, { passive: true });
  }

  // Respaldo general para las apariciones al deslizar (por si el navegador limita las animaciones)
  let lastCheck = 0;
  const revealFallback = () => {
    const now = Date.now(); if (now - lastCheck < 150) return; lastCheck = now;
    document.querySelectorAll('.reveal:not(.in)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight * 0.9 && r.bottom > 0) el.classList.add('in');
    });
  };
  addEventListener('scroll', revealFallback, { passive: true });
  revealFallback();

  // Videos de Higgsfield: se cargan y reproducen solo cuando están a la vista
  const lazyVideos = [...document.querySelectorAll('video[data-src]')];
  if (!reduce && lazyVideos.length) {
    const start = (v) => {
      if (!v.src) { v.src = v.dataset.src; v.addEventListener('playing', () => v.classList.add('playing'), { once: true }); v.addEventListener('error', () => v.remove(), { once: true }); }
      v.play().catch(() => {});
    };
    const vIO2 = new IntersectionObserver((entries) => entries.forEach((en) => (en.isIntersecting ? start(en.target) : en.target.pause())), { rootMargin: '200px 0px' });
    lazyVideos.forEach((v) => vIO2.observe(v));
    // Respaldo por si el navegador limita las animaciones
    addEventListener('scroll', () => lazyVideos.forEach((v) => { const r = v.getBoundingClientRect(); if (r.top < innerHeight + 200 && r.bottom > -200 && v.paused) start(v); }), { passive: true });
  }
})();
