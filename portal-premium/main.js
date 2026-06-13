/* ============================================================================
   ESENCIA Y TAZA - MAIN.JS
   JavaScript modular para interactividad
   =========================================================================== */

// ============================================================================
// MÓDULO: Carrito
// ============================================================================
const Cart = (() => {
  let items = [];

  const addItem = (productId, name, price) => {
    const existingItem = items.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.push({
        id: productId,
        name: name,
        price: price,
        quantity: 1
      });
    }

    updateCartUI();
  };

  const removeItem = (productId) => {
    items = items.filter(item => item.id !== productId);
    updateCartUI();
  };

  const updateCartUI = () => {
    const cartBtn = document.querySelector('.btn-sm');
    if (cartBtn) {
      cartBtn.textContent = `🛒 Carrito (${getTotalItems()})`;
    }
    console.log('Cart updated:', items);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getItems = () => items;

  return {
    addItem,
    removeItem,
    getItems,
    getTotalItems
  };
})();

// ============================================================================
// MÓDULO: Lots (Trazabilidad)
// ============================================================================
const Lots = (() => {
  const init = () => {
    const lots = document.querySelectorAll('.lot');
    lots.forEach(lot => {
      lot.addEventListener('click', () => {
        lot.classList.toggle('active');
      });
    });
  };

  return { init };
})();

// ============================================================================
// MÓDULO: Navigation
// ============================================================================
const Navigation = (() => {
  let lastScrollTop = 0;

  const init = () => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    setupActiveLinks();
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const header = document.querySelector('.header');

    // Sticky header logic
    if (scrollTop > 100) {
      header?.classList.add('sticky');
    } else {
      header?.classList.remove('sticky');
    }

    lastScrollTop = scrollTop;
  };

  const setupActiveLinks = () => {
    const navLinks = document.querySelectorAll('.navbar-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('navbar-link--active'));
        // Add active class to clicked link
        link.classList.add('navbar-link--active');
      });
    });
  };

  return { init };
})();

// ============================================================================
// MÓDULO: Products
// ============================================================================
const Products = (() => {
  const products = [
    {
      id: 1,
      name: 'Café Origen Santa Rosa',
      price: 45000
    },
    {
      id: 2,
      name: 'Café Honey Especial',
      price: 52000
    },
    {
      id: 3,
      name: 'Blend Premium',
      price: 48000
    }
  ];

  const init = () => {
    const addCartButtons = document.querySelectorAll('.btn-add-cart');

    addCartButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(btn.getAttribute('data-product'));
        const product = products.find(p => p.id === productId);

        if (product) {
          Cart.addItem(product.id, product.name, product.price);
          
          // Visual feedback
          btn.textContent = '✓ Añadido';
          btn.disabled = true;
          
          setTimeout(() => {
            btn.textContent = '+ Añadir';
            btn.disabled = false;
          }, 2000);
        }
      });
    });
  };

  return { init };
})();

// ============================================================================
// MÓDULO: Lazy Loading
// ============================================================================
const LazyLoad = (() => {
  const init = () => {
    if ('IntersectionObserver' in window) {
      const images = document.querySelectorAll('img[loading="lazy"]');

      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute('loading');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  };

  return { init };
})();

// ============================================================================
// MÓDULO: Animations
// ============================================================================
const Animations = (() => {
  const init = () => {
    if ('IntersectionObserver' in window) {
      const elements = document.querySelectorAll('[data-animate]');

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      });

      elements.forEach(el => observer.observe(el));
    }
  };

  return { init };
})();

// ============================================================================
// MÓDULO: Form Validation
// ============================================================================
const FormValidation = (() => {
  const init = () => {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!validateForm(form)) {
          e.preventDefault();
        }
      });
    });
  };

  const validateForm = (form) => {
    const inputs = form.querySelectorAll('[required]');
    let isValid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.setAttribute('aria-invalid', 'true');
        isValid = false;
      } else {
        input.setAttribute('aria-invalid', 'false');
      }
    });

    return isValid;
  };

  return { init };
})();

// ============================================================================
// APP INITIALIZATION
// ============================================================================
const App = (() => {
  const init = () => {
    console.log('🚀 Esencia y Taza - Inicializando aplicación...');

    // Inicializar módulos
    Navigation.init();
    Lots.init();
    Products.init();
    LazyLoad.init();
    Animations.init();
    FormValidation.init();

    console.log('✅ Aplicación lista');
  };

  return { init };
})();

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}

// ============================================================================
// PERFORMANCE MONITORING (opcional)
// ============================================================================
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⏱️ Tiempo de carga: ${pageLoadTime}ms`);
  });
}
