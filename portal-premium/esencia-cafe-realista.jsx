import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, MapPin, Droplet, Star, Check, ChevronDown } from 'lucide-react';

export default function EsenciaCafeRealista() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [activeLot, setActiveLot] = useState(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selectedGrind, setSelectedGrind] = useState({});
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
      description: 'Notas de chocolate, frambuesa y cacao con cuerpo sedoso',
      price: 45000,
      weight: '250g',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=500&fit=crop',
      color: '#556B4F',
      altColor: '#2d5a3d',
      origin: 'Caicedo, Antioquia',
      altitude: '1900 msnm',
      rating: 4.8,
      reviews: 247,
      grinds: ['Entero', 'Molido Espresso', 'Molido Filtro', 'Molido Turco'],
      notes: ['Chocolate', 'Frambuesa', 'Cacao', 'Miel']
    },
    {
      id: 2,
      name: 'Edición Especial Honey - Fermentado Natural',
      description: 'Dulzura natural de procesado honey. Notas de caramelo, frutos tropicales y vainilla',
      price: 52000,
      weight: '250g',
      image: 'https://images.unsplash.com/photo-1559522867-a52b6b6b7cdb?w=500&h=500&fit=crop',
      color: '#C85A3A',
      altColor: '#a64729',
      origin: 'Caicedo, Antioquia',
      altitude: '1850 msnm',
      rating: 4.9,
      reviews: 189,
      grinds: ['Entero', 'Molido Espresso', 'Molido Filtro'],
      notes: ['Miel', 'Caramelo', 'Tropical', 'Vainilla']
    },
    {
      id: 3,
      name: 'Blend Premium - Tostión Oscura',
      description: 'Equilibrio perfecto entre robustez y suavidad. Notas de nueces, chocolate oscuro y especias',
      price: 48000,
      weight: '250g',
      image: 'https://images.unsplash.com/photo-1559496417-e4a5a6b11cf0?w=500&h=500&fit=crop',
      color: '#4A3728',
      altColor: '#2d2319',
      origin: 'Caicedo, Antioquia',
      altitude: '1900 msnm',
      rating: 4.7,
      reviews: 312,
      grinds: ['Entero', 'Molido Espresso', 'Molido Filtro'],
      notes: ['Nueces', 'Chocolate', 'Especias', 'Robusto']
    }
  ];

  const chronicles = [
    {
      id: 1,
      title: 'Cosecha Matutina en Altura',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=600&h=400&fit=crop',
      description: 'Cada madrugada en los cafetales. Las manos expertas recolectan solo los frutos maduros, grano a grano.',
      farmers: 'Familia Urrego',
      location: 'Finca Las Nubes, 1900 msnm'
    },
    {
      id: 2,
      title: 'Historias de Generaciones',
      image: 'https://images.unsplash.com/photo-1559522867-a52b6b6b7cdb?w=600&h=400&fit=crop',
      description: 'Jorge Urrego cultiva café hace 35 años. Su familia ha cuidado estas tierras por más de 40 años.',
      farmers: 'Jorge Urrego y familia',
      location: 'Caicedo, Antioquia'
    },
    {
      id: 3,
      title: 'Proceso de Fermentación Natural',
      image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd77c70?w=600&h=400&fit=crop',
      description: 'El arte científico del café honey. 48 horas de fermentación controlada bajo el sol de la montaña.',
      farmers: 'Maestría de Proceso',
      location: 'Secadero en finca'
    },
    {
      id: 4,
      title: 'Tostión Artesanal Perfecta',
      image: 'https://images.unsplash.com/photo-1559056199-643a0acc8b3f?w=600&h=400&fit=crop',
      description: 'Cada lote es tostado con precisión milimétrica. El maestro tostador controla temperatura y tiempo.',
      farmers: 'Maestro Tostador Local',
      location: 'Centro de Procesamiento'
    }
  ];

  const lots = [
    {
      id: 'LOT-2024-CAICEDO-001',
      product: 'Origen Único - Tostión Media',
      date: 'Octubre 2024',
      altitude: '1900 msnm',
      coordinates: '5°17\'02" N, 75°35\'04" W',
      quantity: '450 kg',
      status: 'En tránsito',
      harvestDate: '15 Oct 2024',
      farmerName: 'Jorge Urrego'
    },
    {
      id: 'LOT-2024-CAICEDO-002',
      product: 'Honey Especial - Fermentado Natural',
      date: 'Septiembre 2024',
      altitude: '1850 msnm',
      coordinates: '5°17\'15" N, 75°35\'22" W',
      quantity: '380 kg',
      status: 'Procesado',
      harvestDate: '22 Sep 2024',
      farmerName: 'Familia Urrego'
    }
  ];

  const addToCart = (product) => {
    const grind = selectedGrind[product.id] || product.grinds[0];
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
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div ref={containerRef} className="overflow-x-hidden bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white font-serif font-bold">
              E
            </div>
            <span className="font-serif text-xl font-bold text-gray-900">
              Esencia y Café
            </span>
            <span className="text-xs text-gray-500 font-light">Caicedo, Antioquia</span>
          </div>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
            <a href="#tienda" className="hover:text-amber-700 transition">Tienda</a>
            <a href="#origen" className="hover:text-amber-700 transition">Nuestro Origen</a>
            <a href="#trazabilidad" className="hover:text-amber-700 transition">Trazabilidad</a>
            <a href="#historias" className="hover:text-amber-700 transition">Historias</a>
          </div>
          
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ShoppingCart size={24} className="text-gray-900" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* SECTION 1: Hero - El Origen */}
      <section className="h-screen w-full pt-20 flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=1200&h=900&fit=crop)',
            backgroundAttachment: 'fixed',
            filter: `brightness(${Math.max(0.4, 1 - scrollPos / 800)})`
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50 z-1" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="text-sm font-semibold tracking-widest text-amber-300 uppercase">
              Café de Montaña
            </span>
          </div>
          
          <h1 className="font-serif text-6xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl leading-tight">
            Del Árbol<br />a tu Taza
          </h1>
          
          <p className="text-xl md:text-2xl text-white text-opacity-95 mb-8 drop-shadow-lg font-light max-w-2xl mx-auto">
            Café orgánico cultivado a 1900 metros en las montañas de Caicedo. Trazabilidad completa. Directamente desde el origen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#tienda" className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-2xl bg-amber-700 hover:bg-amber-800 text-white">
              Explorar Tienda
            </a>
            <a href="#trazabilidad" className="px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 bg-white bg-opacity-20 hover:bg-opacity-30 text-white border border-white">
              Ver Trazabilidad
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="text-white text-opacity-70 text-center">
            <p className="text-sm font-light mb-2">Scroll para descubrir</p>
            <ChevronDown size={24} />
          </div>
        </div>
      </section>

      {/* SECTION 2: Historia & Origen */}
      <section id="origen" className="py-32 px-6 bg-gradient-to-b from-white via-amber-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=600&h=600&fit=crop"
                alt="Cafetales de Caicedo"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div>
              <span className="text-amber-700 font-semibold text-sm uppercase tracking-widest">Nuestro Terroir</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 text-gray-900">
                Caicedo, Antioquia
              </h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                A 1900 metros sobre el nivel del mar, en las montañas escarpadas de Caicedo, Antioquia, nuestras plantas de café crecen bajo condiciones climatológicas únicas que producen granos excepcionales.
              </p>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                Cada grano es cultivado según principios de agricultura orgánica certificada, sin químicos sintéticos. Nuestros caficultores trabajan la tierra como sus ancestros lo hicieron hace décadas, respetando el ecosistema montañoso.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-700">
                  <p className="text-2xl font-bold text-amber-700">1900+</p>
                  <p className="text-gray-600 text-sm mt-1">msnm de altitud</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-700">
                  <p className="text-2xl font-bold text-amber-700">100%</p>
                  <p className="text-gray-600 text-sm mt-1">Orgánico certificado</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-700">
                  <p className="text-2xl font-bold text-amber-700">35+</p>
                  <p className="text-gray-600 text-sm mt-1">Años de tradición</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-700">
                  <p className="text-2xl font-bold text-amber-700">100%</p>
                  <p className="text-gray-600 text-sm mt-1">Trazable</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Trazabilidad */}
      <section id="trazabilidad" className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <span className="text-amber-700 font-semibold text-sm uppercase tracking-widest">Sistema de Trazabilidad</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 text-gray-900">
              Tu Café Tiene Historia
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Cada bolsa de Esencia y Café viene con un código QR único. Escanéalo para conocer exactamente dónde fue cultivado, cosechado y procesado tu café.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Coffee Bag Visual */}
            <div className="flex justify-center items-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 to-amber-100 rounded-3xl blur-2xl opacity-40" />
                <div className="relative w-64 h-80 rounded-2xl shadow-2xl overflow-hidden bg-white border border-gray-200 transform hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1559522867-a52b6b6b7cdb?w=400&h=500&fit=crop)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-6">
                    <div className="text-white text-center">
                      <h3 className="font-serif text-2xl font-bold mb-1">
                        Origen Único
                      </h3>
                      <p className="text-sm opacity-80">Tostión Media</p>
                    </div>
                    <div className="w-20 h-20 bg-white rounded-lg p-2 shadow-lg">
                      <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 font-mono">
                        QR CODE
                      </div>
                    </div>
                    <p className="text-white text-xs text-center opacity-70 font-mono">LOT-2024-CAICEDO-001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Traceability Details */}
            <div className="space-y-4">
              {lots.map((lot, idx) => (
                <button
                  key={lot.id}
                  onClick={() => setActiveLot(activeLot === idx ? null : idx)}
                  className="w-full text-left transition-all duration-300"
                >
                  <div className="p-6 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                    style={{
                      borderColor: activeLot === idx ? '#C85A3A' : '#e5e7eb',
                      backgroundColor: activeLot === idx ? '#fffaf5' : '#ffffff'
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {lot.product}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Cosecha: {lot.harvestDate}</p>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-800">
                        ✓ {lot.status}
                      </span>
                    </div>

                    {activeLot === idx && (
                      <div className="pt-4 border-t border-gray-200 space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Altitud</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{lot.altitude}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Cantidad</p>
                            <p className="text-sm font-medium text-gray-900 mt-1">{lot.quantity}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Coordenadas GPS</p>
                          <p className="text-sm font-medium text-gray-900 mt-1 font-mono">{lot.coordinates}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Caficultor</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">{lot.farmerName}</p>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <button className="w-full py-2 px-4 bg-amber-700 text-white rounded-lg text-sm font-medium hover:bg-amber-800 transition">
                            Ver Certificado de Origen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Tienda */}
      <section id="tienda" className="py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <span className="text-amber-700 font-semibold text-sm uppercase tracking-widest">Colección Premium</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 text-gray-900">
              Nuestros Cafés
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Cada variedad, cultivada en la misma tierra, procesada con maestría, pero con perfil único
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col"
              >
                {/* Product Image */}
                <div className="h-64 overflow-hidden relative bg-gray-100">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                    <Star size={16} fill="currentColor" className="text-yellow-500" />
                    <span className="text-sm font-semibold">{product.rating}</span>
                    <span className="text-xs text-gray-600">({product.reviews})</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <p className="text-xs text-amber-700 font-semibold uppercase tracking-widest">Caicedo, Antioquia</p>
                    <h3 className="font-serif text-xl font-bold mt-2 text-gray-900 group-hover:text-amber-700 transition">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 flex-1">
                    {product.description}
                  </p>

                  {/* Flavor Notes */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Notas de Sabor</p>
                    <div className="flex flex-wrap gap-2">
                      {product.notes.map(note => (
                        <span key={note} className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded-full">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Grind Selection */}
                  <div className="mb-4">
                    <label className="text-xs text-gray-600 uppercase font-semibold block mb-2">
                      Tipo de Molido
                    </label>
                    <select 
                      value={selectedGrind[product.id] || product.grinds[0]}
                      onChange={(e) => setSelectedGrind({ ...selectedGrind, [product.id]: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                    >
                      {product.grinds.map(grind => (
                        <option key={grind} value={grind}>{grind}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price and Button */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Precio</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        ${product.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{product.weight}</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-32 py-3 rounded-lg font-semibold transition-all duration-300 text-white hover:shadow-lg flex items-center justify-center gap-2"
                      style={{ backgroundColor: product.color }}
                      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                      <ShoppingCart size={18} />
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: Chronicles */}
      <section id="historias" className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20 text-center">
            <span className="text-amber-700 font-semibold text-sm uppercase tracking-widest">Historias Reales</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6 text-gray-900">
              Los Rostros Detrás del Café
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conoce a las personas que cultivan, cosechan y procesan tu café cada día
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {chronicles.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer bg-white"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="p-8 relative">
                  <h3 className="font-serif text-2xl font-bold mb-3 text-gray-900 group-hover:text-amber-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-700 border-t border-gray-200 pt-4">
                    <span className="font-semibold">{item.farmers}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-500">{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Audio */}
      <section className="py-32 px-6 bg-gradient-to-r from-amber-700 to-amber-800 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-amber-100 font-semibold text-sm uppercase tracking-widest">Experiencia Sensorial</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mt-3 mb-6">
              El Sonido del Cafetal
            </h2>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
            <div className="flex items-center justify-between gap-8 flex-wrap">
              <div className="flex-1 min-w-64">
                <h3 className="font-serif text-2xl font-bold mb-3">
                  Amanecer en Caicedo
                </h3>
                <p className="text-white text-opacity-90 mb-4 leading-relaxed">
                  Una grabación auténtica del amanecer en nuestros cafetales a 1900 metros. Escucha los sonidos naturales que acompañan el cultivo del café cada día.
                </p>
                <div className="flex gap-3 text-sm text-white text-opacity-80">
                  <span>🎵 5:42 minutos</span>
                  <span>•</span>
                  <span>Grabación original</span>
                </div>
              </div>
              <button
                onClick={() => setAudioPlaying(!audioPlaying)}
                className="p-8 rounded-full transition-all duration-300 bg-white text-amber-700 hover:scale-110 hover:shadow-2xl flex-shrink-0"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
            
            {audioPlaying && (
              <div className="mt-8 pt-8 border-t border-white border-opacity-20">
                <div className="h-1 bg-white bg-opacity-20 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-white rounded-full" style={{ width: '35%', animation: 'pulse 2s infinite' }} />
                </div>
                <div className="flex justify-between text-xs text-white text-opacity-70">
                  <span>1:58</span>
                  <span>5:42</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 7: Footer */}
      <section className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-serif font-bold">
                  E
                </div>
                <span className="font-serif font-bold">Esencia y Café</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Café orgánico de montaña, cultivado con dedicación en Caicedo, Antioquia desde 2015.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navegación</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Tienda</a></li>
                <li><a href="#" className="hover:text-white transition">Nuestro Origen</a></li>
                <li><a href="#" className="hover:text-white transition">Trazabilidad</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>📧 hola@esenciacafe.co</li>
                <li>📱 +57 (4) 200-1234</li>
                <li>📍 Caicedo, Antioquia</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Síguenos</h4>
              <ul className="text-gray-400 text-sm space-y-2">
                <li><a href="#" className="hover:text-white transition">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-gray-400 text-sm">
            <p>© 2024 Esencia y Café. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition">Política de Privacidad</a>
              <a href="#" className="hover:text-white transition">Términos de Servicio</a>
            </div>
          </div>
        </div>
      </section>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}>
          <div className="absolute right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Cart Header */}
            <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Tu Cesta
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <X size={24} className="text-gray-900" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Tu cesta está vacía</p>
                  <p className="text-gray-400 text-sm mt-2">Añade café para empezar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm text-gray-900">{item.name}</h3>
                          <p className="text-xs text-gray-600 mt-1">Molido: {item.grind}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <X size={18} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                        <div className="flex gap-3 items-center bg-gray-100 p-1 rounded-lg">
                          <button
                            onClick={() => setCart(cart.map(it => 
                              it.id === item.id 
                                ? { ...it, quantity: Math.max(1, it.quantity - 1) }
                                : it
                            ))}
                            className="w-6 h-6 rounded hover:bg-gray-300 text-gray-700 flex items-center justify-center text-sm"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => setCart(cart.map(it => 
                              it.id === item.id 
                                ? { ...it, quantity: it.quantity + 1 }
                                : it
                            ))}
                            className="w-6 h-6 rounded hover:bg-gray-300 text-gray-700 flex items-center justify-center text-sm"
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
              <div className="border-t border-gray-200 px-6 py-6 bg-gray-50 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between items-center text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  className="w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900"
                >
                  Proceder al Pago
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-900 hover:border-gray-400 transition"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}