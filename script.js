(() => {
  'use strict';

  // Edit this one value to change every WhatsApp link on the page.
  const WHATSAPP_NUMBER = '5544999297681';
  const WHATSAPP_MESSAGES = Object.freeze({
    general: 'Olá! Vim pelo site da USEGET e gostaria de saber mais sobre as placas de avaliação no Google.',
    azul: 'Olá! Vim pelo site da USEGET e tenho interesse no modelo Azul. Pode me informar o valor e as condições de entrega?',
    preto: 'Olá! Vim pelo site da USEGET e tenho interesse no modelo Preto. Pode me informar o valor e as condições de entrega?'
  });

  function initialize() {
    document.documentElement.classList.add('js');
    configureContact();
    configureMenu();
    configureHeader();
    configureMotion();
  }

  function configureContact() {
    const validNumber = /^55[1-9]\d\d{8,9}$/.test(WHATSAPP_NUMBER);

    document.querySelectorAll('[data-whatsapp]').forEach((link) => {
      const message = WHATSAPP_MESSAGES[link.dataset.whatsapp];
      if (!validNumber || !message) {
        link.removeAttribute('href');
        link.removeAttribute('target');
        link.setAttribute('aria-disabled', 'true');
        link.setAttribute('tabindex', '-1');
        return;
      }

      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
