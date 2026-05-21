/* ═══════════════════════════════════════════
   CASA BAOBÁ — script.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. REVEAL ON SCROLL ───────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered delay para elementos em sequência
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
  const filtroBtns = document.querySelectorAll('.filtro-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filtroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.categoria;

      // Atualiza botão ativo
      filtroBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtra itens com fade
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


  // ─── 3. FORMULÁRIO → WHATSAPP ──────────────────────────────────
  const btnEnviar = document.getElementById('btn-enviar');

  if (btnEnviar) {
    btnEnviar.addEventListener('click', () => {
      const nome      = document.getElementById('nome').value.trim();
      const whatsapp  = document.getElementById('whatsapp').value.trim();
      const ambiente  = document.getElementById('ambiente').value;
      const mensagem  = document.getElementById('mensagem').value.trim();

      // Validação básica
      if (!nome || !whatsapp) {
        shake(btnEnviar);
        alert('Por favor, preencha seu nome e WhatsApp para continuar.');
        return;
      }

      // Monta a mensagem
      const ambienteLabel = document.getElementById('ambiente').options[document.getElementById('ambiente').selectedIndex]?.text || '';
      let msg = `Olá Casa Baobá, vim pelo anúncio e quero um orçamento.`;
      msg += `\n\n*Nome:* ${nome}`;
      msg += `\n*WhatsApp:* ${whatsapp}`;
      if (ambienteLabel && ambienteLabel !== 'Selecione...') {
        msg += `\n*Ambiente:* ${ambienteLabel}`;
      }
      if (mensagem) {
        msg += `\n*Mensagem:* ${mensagem}`;
      }

      const url = `https://wa.me/5513997260565?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
    });
  }


  // ─── 4. HELPER: SHAKE ANIMATION ───────────────────────────────
  function shake(el) {
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => {
      el.style.animation = '';
    }, { once: true });
  }


  // ─── 5. LIGHTBOX ──────────────────────────────────────────────
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.portfolio-item img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });


  // ─── 6. SMOOTH SCROLL (fallback para Safari) ──────────────────
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


// ─── 6. ANIMAÇÕES CSS EXTRAS (injetadas via JS) ─────────────────
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
