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
})();
