import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, Play, MapPin, Droplet } from 'lucide-react';

export default function EsenciaCafePortal() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [activeLot, setActiveLot] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollPos(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const products = [
    {
      id: 1,
      name: 'Café Origen Único - Tostión Media',
      description: 'Notas de chocolate, frambuesa y cacao',
      price: 45000,
      weight: '250g',
      image: '☕',
      color: '#556B4F',
      grinds: ['Entero', 'Molido Espresso', 'Molido Filtro', 'Molido Turco']
    },
    {
      id: 2,
      name: 'Edición Especial Honey - Fermentado Natural',
      description: 'Notas dulces de miel, caramelo y frutas tropicales',
      price: 52000,
      weight: '250g',
      image: '🌟',
      color: '#C85A3A',
      grinds: ['Entero', 'Molido Espresso', 'Molido Filtro']
    },
    {
      id: 3,
      name: 'Blend Premium - Tostión Oscura',
      description: 'Equilibrio perfecto: nueces, chocolate oscuro y especias',
      price: 48000,
      weight: '250g',
      image: '✨',
      color: '#4A3728',
      grinds: ['Entero', 'Molido Espresso', 'Molido Filtro']
    }
  ];

  const chronicles = [
    {
      id: 1,
      title: 'Cosecha Hoy - Manos Recolectando Frutos',
      image: '🌱',
      description: 'El trabajo de cada madrugada en los cafetales',
      farmers: 'Familia Urrego'
    },
    {
      id: 2,
      title: 'Nuestros Caficultores - El Corazón de Caicedo',
      image: '👨‍🌾',
      description: 'Historias de tradición y dedicación generacional',
      farmers: 'Jorge Urrego, 35 años'
    },
    {
      id: 3,
      title: 'Proceso de Fermentación Natural',
      image: '🍂',
      description: 'El arte científico detrás del café Honey',
      farmers: 'Proceso de 48 horas'
    },
    {
      id: 4,
      title: 'Tostión Artesanal en el Origen',
      image: '🔥',
      description: 'Cada lote tostado con precisión y amor',
      farmers: 'Maestro Tostador Local'
    }
  ];

  const lots = [
    {
      id: 'LOT-2024-001',
      product: 'Origen Único',
      date: 'Octubre 2024',
      altitude: '1900 msnm',
      coordinates: '5.2841° N, 75.5847° W',
      quantity: '450 kg',
      status: 'En tránsito'
    },
    {
      id: 'LOT-2024-002',
      product: 'Honey Especial',
      date: 'Septiembre 2024',
      altitude: '1850 msnm',
      coordinates: '5.2833° N, 75.5839° W',
      quantity: '380 kg',
      status: 'Procesado'
    }
  ];

  const addToCart = (product, grind) => {
    const cartItem = {
      id: `${product.id}-${grind}`,
      ...product,
      grind,
      quantity: 1
    };
    
    const existingItem = cart.find(item => item.id === cartItem.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === cartItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, cartItem]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div ref={containerRef} className="overflow-x-hidden bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white bg-opacity-95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-serif font-bold" style={{ color: '#556B4F' }}>
            ⚜️ Esencia y Café
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-amber-700 transition">Tienda</a>
            <a href="#" className="hover:text-amber-700 transition">Nuestra Tierra</a>
            <a href="#" className="hover:text-amber-700 transition">El Proceso</a>
            <a href="#" className="hover:text-amber-700 transition">Suscripción</a>
          </div>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ShoppingCart size={24} style={{ color: '#556B4F' }} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* SECTION 1: Hero / El Origen */}
      <section className="h-screen w-full pt-20 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              background: 'linear-gradient(135deg, #1a4d2e 0%, #2d5a3d 25%, #556B4F 50%, #8b7355 75%, #d4a574 100%)',
              opacity: Math.max(0.3, 1 - scrollPos / 1000)
            }}
          />
          {/* Coffee field overlay effect */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(212, 165, 116, 0.3) 0%, transparent 50%)',
          }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <div className="mb-8 text-6xl md:text-7xl animate-pulse">🌄</div>
          
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg leading-tight">
            Del Árbol a tu Taza<br />en un Solo Scroll
          </h1>
          
          <p className="text-xl md:text-2xl text-white text-opacity-90 mb-8 drop-shadow-md font-light">
            Café Orgánico de la Montaña.<br />
            Vive la Historia Detrás de Cada Grano.
          </p>

          <button className="px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-2xl"
            style={{
              backgroundColor: '#C85A3A',
              color: 'white',
              transform: `translateY(${Math.max(-10, -scrollPos / 50)}px)`
            }}
          >
            ↓ Empezar el Viaje ↓
          </button>
        </div>
      </section>

      {/* SECTION 2: Traceability / La Trazabilidad */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: '#556B4F' }}>
              El Pasaporte Digital de tu Café
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Cada lote cuenta una historia única. Escanea el código QR en tu bolsa para descubrir el viaje exacto de tu café.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Coffee Bag Visual */}
            <div className="flex justify-center items-center">
              <div className="relative w-64 h-80 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
                style={{ backgroundColor: '#F5F1E8' }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl mb-6">☕</div>
                  <div className="text-center px-6">
                    <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: '#556B4F' }}>
                      Origen Único
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">Tostión Media</p>
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-3xl">⬜</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">LOT-2024-001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Traceability Details */}
            <div>
              <div className="space-y-6">
                {lots.map((lot, idx) => (
                  <button
                    key={lot.id}
                    onClick={() => setActiveLot(activeLot === idx ? null : idx)}
                    className="w-full p-6 rounded-xl transition-all duration-300 text-left border-2 hover:shadow-lg"
                    style={{
                      borderColor: activeLot === idx ? '#C85A3A' : '#e5e7eb',
                      backgroundColor: activeLot === idx ? '#fff5f1' : '#ffffff'
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: '#556B4F' }}>
                          {lot.product}
                        </h3>
                        <p className="text-sm text-gray-600">{lot.date}</p>
                      </div>
                      <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ color: '#C85A3A', backgroundColor: '#ffe4d6' }}>
                        {lot.status}
                      </span>
                    </div>

                    {activeLot === idx && (
                      <div className="space-y-3 pt-4 border-t border-gray-200">
                        <div className="flex items-start gap-3">
                          <MapPin size={18} style={{ color: '#D4A574' }} className="flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Ubicación</p>
                            <p className="text-xs text-gray-600">{lot.coordinates}</p>
                            <p className="text-xs text-gray-600">Altitud: {lot.altitude}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Droplet size={18} style={{ color: '#D4A574' }} className="flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">Cantidad Procesada</p>
                            <p className="text-xs text-gray-600">{lot.quantity}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Store / La Tienda */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: '#556B4F' }}>
              Nuestra Colección Premium
            </h2>
            <p className="text-gray-600 text-lg">
              Selecciones exclusivas, cada una contando una historia diferente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Product Header */}
                <div
                  className="h-48 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: product.color, opacity: 0.1 }}
                >
                  <div className="text-6xl">{product.image}</div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2" style={{ color: '#556B4F' }}>
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Tipo de Molido</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2" style={{ focusRingColor: product.color }}>
                      {product.grinds.map(grind => (
                        <option key={grind} value={grind}>{grind}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: product.color }}>
                        ${product.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{product.weight}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.grinds[0])}
                    className="w-full py-3 rounded-lg font-semibold transition-all duration-300 text-white hover:shadow-lg"
                    style={{
                      backgroundColor: product.color,
                      transform: 'translateY(0)',
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    + Añadir a la Cesta
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Chronicles & Sound / Las Crónicas */}
      <section className="py-24 px-6 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" style={{ color: '#556B4F' }}>
              Las Crónicas de Caicedo
            </h2>
            <p className="text-gray-600 text-lg">
              Historias reales de las personas detrás de cada grano
            </p>
          </div>

          {/* Chronicles Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {chronicles.map((item) => (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div
                  className="h-40 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #556B4F 0%, #8b7355 100%)'
                  }}
                >
                  {item.image}
                </div>
                <div className="p-6 bg-white">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-amber-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <p className="text-xs font-semibold" style={{ color: '#D4A574' }}>
                    👤 {item.farmers}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Audio Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4" style={{ borderColor: '#556B4F' }}>
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div className="flex-1 min-w-64">
                <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: '#556B4F' }}>
                  El Sonido del Cafetal
                </h3>
                <p className="text-gray-600 mb-4">
                  Escucha la atmósfera auténtica del amanecer en las montañas de Caicedo. Grabación real de nuestros cafetales.
                </p>
                <div className="flex gap-2 text-sm">
                  <span style={{ color: '#D4A574' }}>🎵</span>
                  <span className="text-gray-600">5:42 minutos • Sonido envolvente</span>
                </div>
              </div>
              <button
                onClick={() => setAudioPlaying(!audioPlaying)}
                className="p-6 rounded-full transition-all duration-300 text-white hover:shadow-lg"
                style={{
                  backgroundColor: audioPlaying ? '#C85A3A' : '#556B4F',
                  transform: audioPlaying ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <Play size={32} fill="currentColor" />
              </button>
            </div>
            {audioPlaying && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="h-1 bg-gradient-to-r from-green-400 to-amber-400 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse" style={{ width: '35%' }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>1:58</span>
                  <span>5:42</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 5: Footer */}
      <section className="py-16 px-6" style={{ backgroundColor: '#556B4F' }}>
        <div className="max-w-6xl mx-auto text-center text-white text-opacity-90">
          <h3 className="font-serif text-2xl font-bold mb-4">Caicedo, Antioquia</h3>
          <p className="mb-2">Café Orgánico • 1900 msnm • Desde 2015</p>
          <p className="text-sm text-white text-opacity-75 mb-8">
            Comprometidos con la sostenibilidad ambiental y el bienestar de nuestros caficultores
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-sm mb-8">
            <div>
              <p className="font-semibold mb-2">Contacto</p>
              <p>info@esenciacafe.co</p>
              <p>+57 (4) 200-1234</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Síguenos</p>
              <p>Instagram • Facebook • TikTok</p>
            </div>
            <div>
              <p className="font-semibold mb-2">Navegación</p>
              <p>Tienda • Blog • Suscripción</p>
            </div>
          </div>
          <p className="text-xs text-white text-opacity-60 border-t border-white border-opacity-20 pt-8">
            © 2024 Esencia y Café. Todos los derechos reservados.
          </p>
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Cart Header */}
            <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold" style={{ color: '#556B4F' }}>
                Tu Cesta
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Tu cesta está vacía</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-600">{item.grind}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold" style={{ color: '#556B4F' }}>
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                        <div className="flex gap-2 items-center">
                          <button
                            onClick={() => setCart(cart.map(it => 
                              it.id === item.id 
                                ? { ...it, quantity: Math.max(1, it.quantity - 1) }
                                : it
                            ))}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => setCart(cart.map(it => 
                              it.id === item.id 
                                ? { ...it, quantity: it.quantity + 1 }
                                : it
                            ))}
                            className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-sm"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-6 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span style={{ color: '#C85A3A' }}>
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <button
                  className="w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: '#556B4F' }}
                >
                  Proceder al Pago
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}