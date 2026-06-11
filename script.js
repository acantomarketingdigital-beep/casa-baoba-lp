/* ═══════════════════════════════════════════
   CASA BAOBÁ — script.js
═══════════════════════════════════════════ */

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
  const filtroBtns    = document.querySelectorAll('.filtro-btn');
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


  // ─── 3. MODAL DE QUALIFICAÇÃO + WHATSAPP ──────────────────────
  const modal        = document.getElementById('wpp-modal');
  const modalOverlay = document.getElementById('wpp-modal-overlay');
  const modalClose   = document.getElementById('wpp-modal-close');
  const modalSubmit  = document.getElementById('wpp-modal-submit');
  const WA_NUMBER    = '5513997260565';

  function abrirModal(prefill = {}) {
    document.getElementById('m-nome').value     = prefill.nome     || '';
    document.getElementById('m-whatsapp').value = prefill.whatsapp || '';
    document.getElementById('m-ambiente').value = prefill.ambiente || '';
    ['m-nome', 'm-whatsapp'].forEach(id => {
      document.getElementById(id).classList.remove('field-error');
    });
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('m-nome').focus(), 100);
  }

  function fecharModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', fecharModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fecharModal(); });

  // btn-enviar: envia direto para WhatsApp com dados do formulário
  const btnEnviar = document.getElementById('btn-enviar');
  if (btnEnviar) {
    btnEnviar.addEventListener('click', () => {
      const nome     = document.getElementById('nome').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const ambienteEl = document.getElementById('ambiente');
      const mensagem = document.getElementById('mensagem').value.trim();
      const ambienteLabel = ambienteEl.options[ambienteEl.selectedIndex]?.text || '';

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
      if (mensagem) {
        msg += `\n*Mensagem:* ${mensagem}`;
      }

      window.open(`https://wa.me/5513997260565?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  // Máscara de telefone brasileiro
  document.getElementById('m-whatsapp').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 6)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    this.value = v;
  });

  // Envio do modal
  modalSubmit.addEventListener('click', () => {
    const nome      = document.getElementById('m-nome').value.trim();
    const whatsapp  = document.getElementById('m-whatsapp').value.trim();
    const ambienteEl = document.getElementById('m-ambiente');
    const ambienteLabel = ambienteEl.options[ambienteEl.selectedIndex]?.text || '';

    // Validação
    let valido = true;
    ['m-nome', 'm-whatsapp'].forEach(id => {
      document.getElementById(id).classList.remove('field-error');
    });
    if (!nome) {
      document.getElementById('m-nome').classList.add('field-error');
      valido = false;
    }
    if (!whatsapp) {
      document.getElementById('m-whatsapp').classList.add('field-error');
      valido = false;
    }
    if (!valido) {
      shake(modalSubmit);
      return;
    }

    // Disparo do evento de conversão no GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'lead_whatsapp_enviado',
      lead_nome: nome,
      lead_ambiente: ambienteLabel !== 'Selecione...' ? ambienteLabel : 'Não informado'
    });

    // Monta a mensagem formatada
    let msg = `Olá, vim pelo site e quero um orçamento.`;
    msg += `\n\n*Nome:* ${nome}`;
    msg += `\n*WhatsApp:* ${whatsapp}`;
    if (ambienteLabel && ambienteLabel !== 'Selecione...') {
      msg += `\n*Ambiente:* ${ambienteLabel}`;
    }

    // Redireciona para WhatsApp e fecha modal
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    fecharModal();
  });

  // Remove erro ao digitar
  ['m-nome', 'm-whatsapp'].forEach(id => {
    document.getElementById(id).addEventListener('input', function () {
      this.classList.remove('field-error');
    });
  });


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

  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); fecharModal(); } });


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


// ─── 7. ANIMAÇÕES CSS EXTRAS (injetadas via JS) ─────────────────
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
