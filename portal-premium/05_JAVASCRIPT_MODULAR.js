// ============================================================================
// ESENCIA Y TAZA - JAVASCRIPT MODULAR ARCHITECTURE
// ============================================================================
// Production-ready, dependency-free, performance-optimized
// ============================================================================

/**
 * CORE APP MODULE
 * Inicializador principal y gestor de módulos
 */
const App = (() => {
  const config = {
    environment: process.env.NODE_ENV || 'production',
    debug: false,
    modules: {}
  };

  // Logger utilities
  const logger = {
    log: (msg, data = null) => {
      if (config.debug) {
        console.log(`[APP] ${msg}`, data || '');
      }
    },
    error: (msg, error = null) => {
      console.error(`[APP ERROR] ${msg}`, error || '');
    },
    warn: (msg) => {
      console.warn(`[APP WARN] ${msg}`);
    }
  };

  /**
   * Register a module
   */
  const registerModule = (name, module) => {
    config.modules[name] = module;
    logger.log(`Module registered: ${name}`);
  };

  /**
   * Initialize a module
   */
  const initModule = async (name) => {
    const module = config.modules[name];
    if (!module) {
      logger.warn(`Module not found: ${name}`);
      return;
    }

    try {
      if (typeof module.init === 'function') {
        await module.init();
        logger.log(`Module initialized: ${name}`);
      }
    } catch (err) {
      logger.error(`Failed to initialize module: ${name}`, err);
    }
  };

  /**
   * Initialize all modules
   */
  const init = async () => {
    logger.log('Initializing application...');

    // Use requestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        Object.keys(config.modules).forEach(initModule);
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        Object.keys(config.modules).forEach(initModule);
      }, 1000);
    }
  };

  return {
    registerModule,
    initModule,
    init,
    logger,
    config
  };
})();

// ============================================================================
// LAZY LOADER MODULE
// Cargar imágenes y componentes bajo demanda
// ============================================================================
const LazyLoader = (() => {
  const config = {
    imageSelector: 'img[loading="lazy"]',
    componentSelector: '[data-lazy-module]',
    threshold: 0.1,
    rootMargin: '50px'
  };

  /**
   * Load an image using Intersection Observer
   */
  const loadImage = (img) => {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;

    if (src) {
      img.src = src;
    }
    if (srcset) {
      img.srcset = srcset;
    }

    img.classList.add('loaded');
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
  };

  /**
   * Load a component module
   */
  const loadComponent = async (element) => {
    const moduleName = element.dataset.lazyModule;
    const script = document.createElement('script');
    script.src = `/assets/js/modules/${moduleName}.js`;
    script.defer = true;
    document.body.appendChild(script);
  };

  /**
   * Initialize Intersection Observer
   */
  const initObserver = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.matches(config.imageSelector)) {
            loadImage(entry.target);
          } else if (entry.target.matches(config.componentSelector)) {
            loadComponent(entry.target);
          }
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: config.threshold,
      rootMargin: config.rootMargin
    });

    // Observe all lazy elements
    document.querySelectorAll(config.imageSelector).forEach(img => {
      observer.observe(img);
    });

    document.querySelectorAll(config.componentSelector).forEach(el => {
      observer.observe(el);
    });
  };

  const init = () => {
    if ('IntersectionObserver' in window) {
      initObserver();
    } else {
      // Fallback: load all images immediately
      document.querySelectorAll(config.imageSelector).forEach(loadImage);
    }
  };

  return { init };
})();

// ============================================================================
// NAVIGATION MODULE
// Manejo de navegación y scroll
// ============================================================================
const Navigation = (() => {
  const config = {
    activeClass: 'navbar__link--active',
    stickyClass: 'navbar--sticky'
  };

  let navbar = null;
  let lastScrollTop = 0;

  /**
   * Update active navigation link
   */
  const updateActiveLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar__link');

    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove(config.activeClass);
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add(config.activeClass);
      }
    });
  };

  /**
   * Handle scroll events
   */
  const handleScroll = () => {
    const scrollTop = window.scrollY;

    if (!navbar) {
      navbar = document.querySelector('.navbar');
    }

    // Sticky navbar logic
    if (scrollTop > 100) {
      navbar?.classList.add(config.stickyClass);
    } else {
      navbar?.classList.remove(config.stickyClass);
    }

    // Update active link (throttled)
    if (Math.abs(scrollTop - lastScrollTop) > 10) {
      updateActiveLink();
      lastScrollTop = scrollTop;
    }
  };

  /**
   * Handle smooth scroll for anchor links
   */
  const setupSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  const init = () => {
    setupSmoothScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateActiveLink();
  };

  return { init };
})();

// ============================================================================
// FORM HANDLER MODULE
// Validación y manejo de formularios
// ============================================================================
const FormHandler = (() => {
  const config = {
    formSelector: 'form',
    successClass: 'form--success',
    errorClass: 'form--error'
  };

  /**
   * Validate email
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate form
   */
  const validateForm = (form) => {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (input.type === 'email') {
        if (!isValidEmail(input.value)) {
          isValid = false;
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.setAttribute('aria-invalid', 'false');
        }
      } else if (!input.value.trim()) {
        isValid = false;
        input.setAttribute('aria-invalid', 'true');
      } else {
        input.setAttribute('aria-invalid', 'false');
      }
    });

    return isValid;
  };

  /**
   * Submit form
   */
  const submitForm = async (form) => {
    if (!validateForm(form)) {
      form.classList.add(config.errorClass);
      return;
    }

    const formData = new FormData(form);
    const url = form.getAttribute('action');
    const method = form.getAttribute('method') || 'POST';

    try {
      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.classList.remove(config.errorClass);
        form.classList.add(config.successClass);
        form.reset();

        // Show success message
        setTimeout(() => {
          form.classList.remove(config.successClass);
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      console.error('Form error:', err);
      form.classList.add(config.errorClass);
    }
  };

  /**
   * Setup form event listeners
   */
  const setupForms = () => {
    document.querySelectorAll(config.formSelector).forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm(form);
      });

      // Real-time validation
      form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', () => {
          validateForm(form);
        });
      });
    });
  };

  const init = () => {
    setupForms();
  };

  return { init };
})();

// ============================================================================
// ANIMATIONS MODULE
// Scroll-triggered animations usando Intersection Observer
// ============================================================================
const Animations = (() => {
  const config = {
    animationSelector: '[data-animate]',
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  /**
   * Setup animations observer
   */
  const setupObserver = () => {
    if (!('IntersectionObserver' in window)) {
      // Fallback: animate all elements immediately
      document.querySelectorAll(config.animationSelector).forEach(el => {
        el.classList.add('animate--fade-in');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.dataset.animate;
          entry.target.classList.add(`animate--${animation}`);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: config.threshold,
      rootMargin: config.rootMargin
    });

    document.querySelectorAll(config.animationSelector).forEach(el => {
      observer.observe(el);
    });
  };

  const init = () => {
    setupObserver();
  };

  return { init };
})();

// ============================================================================
// THREE.JS 3D CUP MODULE
// Modelo 3D interactivo de la taza (Lazy loaded)
// ============================================================================
const Cup3D = (() => {
  let scene, camera, renderer, cup;

  /**
   * Create 3D scene
   */
  const createScene = (container) => {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFAF0);

    // Camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create cup
    createCup();

    // Animation loop
    animate();

    // Handle resize
    window.addEventListener('resize', onWindowResize);
  };

  /**
   * Create cup geometry
   */
  const createCup = () => {
    const geometry = new THREE.LatheGeometry(
      [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(1, 0),
        new THREE.Vector2(1, 2),
        new THREE.Vector2(0.8, 2.2),
        new THREE.Vector2(0.8, 2.4)
      ],
      32
    );

    const material = new THREE.MeshStandardMaterial({
      color: 0xFFFAF0,
      metalness: 0.1,
      roughness: 0.8
    });

    cup = new THREE.Mesh(geometry, material);
    scene.add(cup);
  };

  /**
   * Animation loop
   */
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotate cup
    if (cup) {
      cup.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
  };

  /**
   * Handle window resize
   */
  const onWindowResize = () => {
    const container = renderer.domElement.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  /**
   * Load Three.js and initialize
   */
  const load = async () => {
    // Dynamic import of Three.js
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@r128/build/three.module.js');
    window.THREE = THREE;

    const container = document.querySelector('[data-3d-cup]');
    if (!container) return;

    createScene(container);
  };

  const init = () => {
    // Only load if viewport is large enough
    if (window.innerWidth > 768) {
      load().catch(err => console.error('3D Cup loading failed:', err));
    }
  };

  return { init };
})();

// ============================================================================
// REGISTRATION & INITIALIZATION
// ============================================================================

// Register modules
App.registerModule('LazyLoader', LazyLoader);
App.registerModule('Navigation', Navigation);
App.registerModule('FormHandler', FormHandler);
App.registerModule('Animations', Animations);

// Conditionally register 3D module
if (document.querySelector('[data-3d-cup]')) {
  App.registerModule('Cup3D', Cup3D);
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

if ('PerformanceObserver' in window) {
  // Track Largest Contentful Paint (LCP)
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      App.logger.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // Ignore if not supported
  }

  // Track First Input Delay (FID)
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        App.logger.log('FID:', entry.processingDuration);
      });
    });
    observer.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // Ignore if not supported
  }
}

// Send Core Web Vitals to analytics
if ('sendBeacon' in navigator) {
  window.addEventListener('unload', () => {
    const metrics = {
      lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.renderTime || 0,
      fid: performance.getEntriesByType('first-input')[0]?.processingDuration || 0,
      cls: 0 // Handled by separate observer
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/metrics', JSON.stringify(metrics));
    }
  });
}

// ============================================================================
// EXPORT FOR TESTING
// ============================================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, LazyLoader, Navigation, FormHandler, Animations, Cup3D };
}