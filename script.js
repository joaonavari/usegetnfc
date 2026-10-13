(() => {
  'use strict';

  // Edit this one value to change every WhatsApp link on the page.
  const WHATSAPP_NUMBER = '5544999297681';
  const WHATSAPP_MESSAGES = Object.freeze({
    general: 'Olá! Vim pelo site da USEGET e gostaria de saber mais sobre as placas NFC.',
    quantidade: 'Olá! Vim pelo site da USEGET e gostaria de consultar as condições para um pedido em quantidade.'
  });
  const validNumber = /^55[1-9]\d\d{8,9}$/.test(WHATSAPP_NUMBER);
  // Outside DDDs 11-19, 21, 22, 24, 27 and 28, WhatsApp registers mobile numbers
  // without the leading 9, and wa.me fails to find the account when it is present.
  const WHATSAPP_LINK_NUMBER = /^55(1[1-9]|2[1247-8])/.test(WHATSAPP_NUMBER)
    ? WHATSAPP_NUMBER
    : WHATSAPP_NUMBER.replace(/^(55\d{2})9(\d{8})$/, '$1$2');

  function productMessage(product, variant) {
    const color = product.variantes.length > 1 ? ` (${variant.nome})` : '';
    return `Olá! Vim pelo site da USEGET e tenho interesse na placa ${product.nome}${color}. Pode me passar valores e condições?`;
  }

  function whatsappUrl(message) {
    return `https://wa.me/${WHATSAPP_LINK_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function initialize() {
    document.documentElement.classList.add('js');
    renderProducts();
    configureContact();
    configureMenu();
    configureHeader();
    configureFloatingButton();
    configureSetup();
    configureMotion();
  }

  function imageSources(name) {
    const base = `assets/images/produtos/${name}`;
    return {
      src: `${base}-600.webp`,
      srcset: `${base}-600.webp 600w, ${base}-1143.webp 1143w`
    };
  }

  function renderProducts() {
    const grid = document.getElementById('products-grid');
    const filters = document.getElementById('product-filters');
    const products = Array.isArray(window.USEGET_PRODUTOS) ? window.USEGET_PRODUTOS : [];
    const categories = window.USEGET_CATEGORIAS || {};
    if (!grid || !products.length) return;

    products.forEach((product) => {
      let current = product.variantes[0];
      const card = document.createElement('article');
      card.className = 'product reveal';
      card.dataset.reveal = '';
      card.dataset.category = product.categoria;

      const media = document.createElement('div');
      media.className = 'product-media';
      const img = document.createElement('img');
      img.width = 1143;
      img.height = 846;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.sizes = '(max-width: 760px) calc(100vw - 40px), 560px';
      media.append(img);

      const body = document.createElement('div');
      body.className = 'product-body';

      const tag = document.createElement('p');
      tag.className = 'product-tag';
      tag.textContent = categories[product.categoria] || '';

      const title = document.createElement('h3');
      title.textContent = product.nome;

      const description = document.createElement('p');
      description.className = 'product-desc';
      description.textContent = product.descricao;

      const foot = document.createElement('div');
      foot.className = 'product-foot';

      const link = document.createElement('a');
      link.className = 'button button-primary button-small';
      link.href = '#contato';
      link.dataset.whatsapp = 'custom';
      link.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-whatsapp"></use></svg>Quero esta placa';

      function apply(variant) {
        current = variant;
        const sources = imageSources(variant.imagem);
        img.src = sources.src;
        img.srcset = sources.srcset;
        img.alt = `Placa USEGET ${product.nome}${product.variantes.length > 1 ? ` ${variant.nome.toLowerCase()}` : ''}, em acrílico com NFC e QR Code.`;
        link.dataset.whatsappText = productMessage(product, variant);
        if (validNumber && link.hasAttribute('href') && link.href.startsWith('https://wa.me')) {
          link.href = whatsappUrl(link.dataset.whatsappText);
        }
      }

      body.append(tag, title, description);

      if (product.variantes.length > 1) {
        const swatches = document.createElement('div');
        swatches.className = 'swatches';
        swatches.setAttribute('role', 'radiogroup');
        swatches.setAttribute('aria-label', `Cor da placa ${product.nome}`);
        const label = document.createElement('span');
        label.className = 'swatch-label';

        product.variantes.forEach((variant, index) => {
          const swatch = document.createElement('button');
          swatch.type = 'button';
          swatch.className = 'swatch';
          swatch.style.setProperty('--swatch', variant.cor || '#999');
          swatch.setAttribute('role', 'radio');
          swatch.setAttribute('aria-checked', String(index === 0));
          swatch.setAttribute('aria-label', variant.nome);
          swatch.addEventListener('click', () => {
            swatches.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-checked', String(s === swatch)));
            label.textContent = variant.nome;
            media.classList.remove('is-switching');
            void media.offsetWidth;
            media.classList.add('is-switching');
            apply(variant);
          });
          swatches.append(swatch);
        });
        label.textContent = product.variantes[0].nome;
        swatches.append(label);
        body.append(swatches);

        // Preload the other colours so switching is instant.
        product.variantes.slice(1).forEach((variant) => {
          const preload = new Image();
          preload.src = imageSources(variant.imagem).src;
        });
      }

      const spec = document.createElement('span');
      spec.className = 'product-spec';
      spec.textContent = '10 × 10 cm · NFC + QR Code';
      foot.append(spec, link);
      body.append(foot);

      card.append(media, body);
      grid.append(card);
      apply(current);
    });

    // Filters only appear when there is more than one category in use.
    const used = [...new Set(products.map((p) => p.categoria))];
    if (!filters || used.length < 2) return;
    const options = [['todas', 'Todas'], ...used.map((key) => [key, categories[key] || key])];
    options.forEach(([key, name], index) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'filter-chip';
      chip.textContent = name;
      chip.setAttribute('aria-pressed', String(index === 0));
      chip.addEventListener('click', () => {
        filters.querySelectorAll('.filter-chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        grid.querySelectorAll('.product').forEach((card) => {
          card.hidden = !(key === 'todas' || card.dataset.category === key);
        });
      });
      filters.append(chip);
    });
    filters.hidden = false;
  }

  // "Como ativar": the clicked option gets the highlight.
  function configureSetup() {
    const cards = Array.from(document.querySelectorAll('[data-setup-card]'));
    if (cards.length < 2) return;
    function select(card) {
      cards.forEach((c) => {
        const active = c === card;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
    }
    cards.forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', String(card.classList.contains('is-active')));
      card.addEventListener('click', () => select(card));
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select(card);
        }
      });
    });
  }

  function configureFloatingButton() {
    const button = document.querySelector('.floating-whatsapp');
    const hero = document.querySelector('.hero');
    const contact = document.getElementById('contato');
    if (!button || !hero || !('IntersectionObserver' in window)) return;
    let heroVisible = true;
    let contactVisible = false;
    const update = () => button.classList.toggle('is-visible', !heroVisible && !contactVisible);
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; update(); }).observe(hero);
    if (contact) new IntersectionObserver(([entry]) => { contactVisible = entry.isIntersecting; update(); }).observe(contact);
  }

  function configureContact() {
    document.querySelectorAll('[data-whatsapp]').forEach((link) => {
      const message = link.dataset.whatsapp === 'custom' ? link.dataset.whatsappText : WHATSAPP_MESSAGES[link.dataset.whatsapp];
      if (!validNumber || !message) {
        link.removeAttribute('href');
        link.removeAttribute('target');
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('tabindex', '-1');
        return;
      }

      link.href = whatsappUrl(message);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
    });

    document.querySelectorAll('[data-contact-number]').forEach((element) => {
      if (!validNumber) {
        element.hidden = true;
        return;
      }
      const nationalNumber = WHATSAPP_NUMBER.slice(4);
      const prefix = nationalNumber.slice(0, -4);
      const suffix = nationalNumber.slice(-4);
      element.textContent = `+55 (${WHATSAPP_NUMBER.slice(2, 4)}) ${prefix}-${suffix}`;
    });

    // Use the visitor-facing Brazilian timezone rather than the server timezone.
    const year = new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      timeZone: 'America/Sao_Paulo'
    }).format(new Date());
    document.querySelectorAll('[data-copyright-year]').forEach((element) => {
      element.textContent = year;
    });
  }

  function listenToMedia(query, listener) {
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', listener);
    } else {
      query.addListener(listener);
    }
  }

  function configureMenu() {
    const toggle = document.getElementById('menu-toggle');
    const navigation = document.getElementById('primary-nav');
    const header = document.getElementById('site-header') || document.querySelector('.site-header');
    if (!toggle || !navigation || !header) return;

    const compactViewport = window.matchMedia('(max-width: 760px)');
    let open = false;
    toggle.setAttribute('aria-controls', navigation.id);

    function setOpen(nextOpen, returnFocus = false) {
      open = compactViewport.matches && nextOpen;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      header.classList.toggle('menu-open', open);
      navigation.hidden = compactViewport.matches && !open;
      navigation.inert = compactViewport.matches && !open;
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', () => setOpen(!open));
    navigation.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        setOpen(false, true);
      }
    });
    document.addEventListener('pointerdown', (event) => {
      if (open && event.target instanceof Node && !header.contains(event.target)) setOpen(false);
    });
    listenToMedia(compactViewport, () => setOpen(false));
    setOpen(false);
  }

  function configureHeader() {
    const header = document.getElementById('site-header') || document.querySelector('.site-header');
    if (!header) return;
    let scheduled = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      scheduled = false;
    }
    window.addEventListener('scroll', () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  function configureMotion() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const productPointer = window.matchMedia('(min-width: 761px) and (hover: hover) and (pointer: fine)');
    const canAnimate = typeof window.requestAnimationFrame === 'function';
    const runningSprings = new Set();
    const allSprings = new Set();
    const buttonResets = [];
    let animationFrame = null;
    let previousTime = null;
    let motionEnabled = canAnimate && !reducedMotion.matches;
    let revealObserver = null;
    let revealEverything = () => {};

    // Semi-implicit integration of F = -kx - cv. Targets can change at any time;
    // existing velocity is retained, so a reversed interaction keeps its inertia.
    class Spring {
      constructor(initial, render, options = {}) {
        this.values = { ...initial };
        this.targets = { ...initial };
        this.velocities = Object.fromEntries(Object.keys(initial).map((key) => [key, 0]));
        this.reducedValues = { ...initial, ...options.reducedValues };
        this.render = render;
        this.stiffness = options.stiffness || 210;
        this.damping = options.damping || 25;
        this.mass = options.mass || 1;
        this.epsilon = options.epsilon || {};
        this.onRest = options.onRest || (() => {});
        allSprings.add(this);
      }

      set(target) {
        Object.assign(this.targets, target);
        if (!motionEnabled) {
          this.snap(this.reducedValues);
          return;
        }
        runningSprings.add(this);
        if (animationFrame === null) animationFrame = window.requestAnimationFrame(tick);
      }

      snap(target) {
        Object.assign(this.values, target);
        Object.assign(this.targets, target);
        Object.keys(this.velocities).forEach((key) => { this.velocities[key] = 0; });
        runningSprings.delete(this);
        this.render(this.values);
        this.onRest(this.values);
      }

      advance(elapsed) {
        // Small steps keep integration stable at low refresh rates or after a pause.
        const steps = Math.max(1, Math.ceil(elapsed / (1 / 120)));
        const delta = elapsed / steps;
        for (let step = 0; step < steps; step += 1) {
          Object.keys(this.values).forEach((key) => {
            const displacement = this.values[key] - this.targets[key];
            const acceleration = (-this.stiffness * displacement - this.damping * this.velocities[key]) / this.mass;
            this.velocities[key] += acceleration * delta;
            this.values[key] += this.velocities[key] * delta;
          });
        }

        const resting = Object.keys(this.values).every((key) => {
          const epsilon = this.epsilon[key] || 0.01;
          return Math.abs(this.values[key] - this.targets[key]) < epsilon && Math.abs(this.velocities[key]) < epsilon;
        });
        if (resting) {
          this.snap(this.targets);
        } else {
          this.render(this.values);
        }
      }
    }

    function tick(time) {
      animationFrame = null;
      const elapsed = previousTime === null ? 1 / 60 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      runningSprings.forEach((spring) => spring.advance(elapsed));
      if (runningSprings.size && motionEnabled) {
        animationFrame = window.requestAnimationFrame(tick);
      } else {
        previousTime = null;
      }
    }

    function cleanTransform(element) {
      element.style.removeProperty('transform');
      element.removeAttribute('data-spring-active');
    }

    document.querySelectorAll('.button').forEach((button) => {
      let hovered = false;
      let focused = false;
      let pressed = false;
      const spring = new Spring({ y: 0, scale: 1 }, ({ y, scale }) => {
        button.style.transform = `translate3d(0, ${y.toFixed(3)}px, 0) scale(${scale.toFixed(5)})`;
      }, {
        stiffness: 320,
        damping: 28,
        epsilon: { y: 0.01, scale: 0.0001 },
        onRest: ({ y, scale }) => {
          button.removeAttribute('data-spring-active');
          if (y === 0 && scale === 1) cleanTransform(button);
        }
      });

      function update() {
        if (!motionEnabled) return;
        button.setAttribute('data-spring-active', '');
        spring.set(pressed ? { y: 0.7, scale: 0.975 } : hovered || focused ? { y: -1.5, scale: 1.012 } : { y: 0, scale: 1 });
      }

      button.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'touch') return;
        hovered = true;
        update();
      });
      button.addEventListener('pointerleave', () => {
        hovered = false;
        pressed = false;
        update();
      });
      button.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 || button.getAttribute('aria-disabled') === 'true') return;
        pressed = true;
        update();
      });
      button.addEventListener('pointercancel', () => { pressed = false; update(); });
      button.addEventListener('focus', () => { focused = button.matches(':focus-visible'); update(); });
      button.addEventListener('blur', () => { focused = false; pressed = false; update(); });
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || (event.key === ' ' && button.tagName === 'BUTTON')) {
          pressed = true;
          update();
        }
      });
      button.addEventListener('keyup', () => { pressed = false; update(); });
      buttonResets.push(() => { pressed = false; update(); });
    });

    window.addEventListener('pointerup', () => buttonResets.forEach((reset) => reset()), { passive: true });
    window.addEventListener('blur', () => buttonResets.forEach((reset) => reset()));

    document.querySelectorAll('[data-spring-product]').forEach((product) => {
      const surface = product.parentElement || product;
      const neutral = { x: 0, y: 0, rx: 0, ry: 0, scale: 1 };
      const spring = new Spring(neutral, ({ x, y, rx, ry, scale }) => {
        product.style.transform = `perspective(1400px) translate3d(${x.toFixed(3)}px, ${y.toFixed(3)}px, 0) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${scale.toFixed(5)})`;
      }, {
        stiffness: 180,
        damping: 23,
        epsilon: { x: 0.02, y: 0.02, rx: 0.004, ry: 0.004, scale: 0.0001 },
        onRest: (values) => {
          product.removeAttribute('data-spring-active');
          if (Object.keys(neutral).every((key) => values[key] === neutral[key])) cleanTransform(product);
        }
      });

      surface.addEventListener('pointermove', (event) => {
        if (!motionEnabled || !productPointer.matches || event.pointerType === 'touch') return;
        const bounds = surface.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
        const y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
        product.setAttribute('data-spring-active', '');
        spring.set({ x: x * 8, y: y * 6, rx: -y * 3, ry: x * 3, scale: 1.01 });
      }, { passive: true });
      surface.addEventListener('pointerleave', () => spring.set(neutral));
      listenToMedia(productPointer, () => {
        if (!productPointer.matches) spring.snap(neutral);
      });
      window.addEventListener('blur', () => spring.set(neutral));
    });

    const revealElements = Array.from(document.querySelectorAll('[data-reveal]'));
    function restoreReveal(element) {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.removeAttribute('data-reveal-active');
    }

    if (motionEnabled && 'IntersectionObserver' in window) {
      const revealSprings = new Map();
      try {
        revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const spring = revealSprings.get(entry.target);
            if (!spring) return;
            entry.target.setAttribute('data-reveal-active', '');
            spring.set({ y: 0, opacity: 1 });
            revealObserver.unobserve(entry.target);
          });
        }, { threshold: 0.01, rootMargin: '0px 0px -40px 0px' });

        revealElements.forEach((element) => {
          // Keep the opening content immediately visible and preserve its LCP.
          if (element.getBoundingClientRect().top < window.innerHeight * 0.92) return;
          const spring = new Spring({ y: 20, opacity: 0 }, ({ y, opacity }) => {
            element.style.transform = `translate3d(0, ${y.toFixed(3)}px, 0)`;
            element.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(4);
          }, {
            stiffness: 150,
            damping: 24,
            epsilon: { y: 0.02, opacity: 0.001 },
            reducedValues: { y: 0, opacity: 1 },
            onRest: () => restoreReveal(element)
          });
          revealSprings.set(element, spring);
          revealObserver.observe(element);
          spring.render(spring.values);
          // A keyboard user should never arrive at a temporarily invisible control.
          element.addEventListener('focusin', () => {
            spring.snap({ y: 0, opacity: 1 });
            revealObserver.unobserve(element);
          }, { once: true });
        });

        revealEverything = () => {
          revealObserver.disconnect();
          revealSprings.forEach((spring) => spring.snap({ y: 0, opacity: 1 }));
          revealElements.forEach(restoreReveal);
        };
      } catch {
        if (revealObserver) revealObserver.disconnect();
        revealSprings.forEach((spring) => spring.snap({ y: 0, opacity: 1 }));
        revealElements.forEach(restoreReveal);
      }
    }

    listenToMedia(reducedMotion, () => {
      motionEnabled = canAnimate && !reducedMotion.matches;
      if (!motionEnabled) {
        if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
        previousTime = null;
        allSprings.forEach((spring) => spring.snap(spring.reducedValues));
        revealEverything();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
