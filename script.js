/* ═══════════════════════════════════════════
   CASA BAOBÁ — script.js
═══════════════════════════════════════════ */

// ─── 0. CAPTURA CLICK IDs (Google Ads / Meta Ads) ──────────────
var _gclid  = new URLSearchParams(window.location.search).get('gclid')  || sessionStorage.getItem('gclid');
var _fbclid = new URLSearchParams(window.location.search).get('fbclid') || sessionStorage.getItem('fbclid');
if (_gclid)  sessionStorage.setItem('gclid',  _gclid);
if (_fbclid) sessionStorage.setItem('fbclid', _fbclid);

function appendClickIds(msg) {
  if (_gclid)  msg += '\n[ref: GCLID_'  + _gclid  + ']';
  if (_fbclid) msg += '\n[ref: FBCLID_' + _fbclid + ']';
  return msg;
}

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. REVEAL ON SCROLL ───────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));


  // ─── 2. FILTRO DE PORTFÓLIO ────────────────────────────────────
  const filtroBtns     = document.querySelectorAll('.filtro-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.categoria;
      filtroBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      portfolioItems.forEach(item => {
        const match = cat === 'todos' || item.dataset.categoria === cat;
        if (match) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  // ─── 3. FORMULÁRIO LEGADO (btn-enviar) ────────────────────────
  const btnEnviar = document.getElementById('btn-enviar');
  if (btnEnviar) {
    btnEnviar.addEventListener('click', () => {
      const nome       = document.getElementById('nome')?.value.trim();
      const whatsapp   = document.getElementById('whatsapp')?.value.trim();
      const ambienteEl = document.getElementById('ambiente');
      const ambienteLabel = ambienteEl?.options[ambienteEl.selectedIndex]?.text || '';

      if (!nome || !whatsapp) {
        shake(btnEnviar);
        alert('Por favor, preencha seu nome e WhatsApp para continuar.');
        return;
      }

      let msg = `Vim do site gostaria de falar com um consultor.`;
      msg += `\n\n*Nome:* ${nome}`;
      msg += `\n*WhatsApp:* ${whatsapp}`;
      if (ambienteLabel && ambienteLabel !== 'Selecione...') {
        msg += `\n*Ambiente:* ${ambienteLabel}`;
      }
      msg = appendClickIds(msg);
      window.open(`https://wa.me/5513997260565?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // Máscara de telefone (só se o campo existir)
  const mWa = document.getElementById('m-whatsapp');
  if (mWa) {
    mWa.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '').substring(0, 11);
      if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      this.value = v;
    });
  }


  // ─── 4. HELPER: SHAKE ANIMATION ───────────────────────────────
  function shake(el) {
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  }


  // ─── 5. LIGHTBOX ──────────────────────────────────────────────
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  function openLightbox(src, alt) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(img.src, img.alt);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox)      lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });


  // ─── 6. CARROSSÉIS — DRAG SCROLL + LIGHTBOX ──────────────────
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track   = carousel.querySelector('.carousel__track');
    const btnPrev = carousel.querySelector('.carousel__btn--prev');
    const btnNext = carousel.querySelector('.carousel__btn--next');

    let isDragging = false;
    let didDrag    = false;
    let startX     = 0;
    let scrollStart = 0;

    track.addEventListener('mousedown', e => {
      isDragging  = true;
      didDrag     = false;
      startX      = e.pageX - track.getBoundingClientRect().left;
      scrollStart = track.scrollLeft;
      track.classList.add('is-dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const x    = e.pageX - track.getBoundingClientRect().left;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 6) didDrag = true;
      track.scrollLeft = scrollStart - walk;
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
      setTimeout(() => { didDrag = false; }, 60);
    });

    const SCROLL_AMT = 430;
    btnPrev?.addEventListener('click', () => track.scrollBy({ left: -SCROLL_AMT, behavior: 'smooth' }));
    btnNext?.addEventListener('click', () => track.scrollBy({ left:  SCROLL_AMT, behavior: 'smooth' }));

    track.querySelectorAll('.carousel__item').forEach(item => {
      item.addEventListener('click', () => {
        if (didDrag) return;
        const img = item.querySelector('img');
        openLightbox(img.src, img.alt);
      });
    });
  });


  // ─── 7. TOPNAV STICKY ─────────────────────────────────────────
  const topnav = document.getElementById('topnav');
  if (topnav) {
    window.addEventListener('scroll', () => {
      topnav.classList.toggle('visible', window.scrollY > 120);
    }, { passive: true });
  }


  // ─── 8. SMOOTH SCROLL (fallback para Safari) ──────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});


// ─── 9. ANIMAÇÕES CSS EXTRAS (injetadas via JS) ─────────────────
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.97); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(style);
