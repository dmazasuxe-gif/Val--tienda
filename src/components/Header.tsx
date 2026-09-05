import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  Truck,
  MessageCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { StoreSettings } from '../types';
import { getGeneralSupportWhatsAppUrl } from '../utils/whatsapp';

interface HeaderProps {
  settings: StoreSettings;
  cartCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenAdminAuth?: () => void;
  isAdmin?: boolean;
  onOpenAdminPanel?: () => void;
  onOpenAdmin?: () => void;
  onSelectCategoryFilter?: (category: 'all' | 'calzado' | 'ropa', gender: 'all' | 'varones' | 'mujeres' | 'ninos') => void;
  onOpenTracking?: () => void;
  cartBounceTrigger?: number;
  showAdminButton?: boolean;
  currentCategory?: string;
  currentGender?: string;
  onSelectSpecialFilter?: (type: 'nuevo' | 'sale') => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenAdminAuth,
  isAdmin = false,
  onOpenAdminPanel,
  onOpenAdmin,
  onSelectCategoryFilter,
  onOpenTracking,
  cartBounceTrigger = 0,
  showAdminButton = false,
  currentCategory = 'all',
  currentGender = 'all',
  onSelectSpecialFilter,
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart bounce indicators
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [bounceKey, setBounceKey] = useState(0);
  const [showFloatingPlus, setShowFloatingPlus] = useState(false);
  const [floatingQty, setFloatingQty] = useState(1);
  const prevCartCountRef = useRef(cartCount);

  const triggerCartBounce = (addedAmount = 1) => {
    setFloatingQty(addedAmount > 0 ? addedAmount : 1);
    setBounceKey((k) => k + 1);
    setIsCartBouncing(true);
    setShowFloatingPlus(true);
  };

  useEffect(() => {
    if (cartBounceTrigger && cartBounceTrigger > 0) {
      triggerCartBounce(1);
    }
  }, [cartBounceTrigger]);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      const diff = cartCount - prevCartCountRef.current;
      triggerCartBounce(diff);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    if (isCartBouncing) {
      const timer = setTimeout(() => setIsCartBouncing(false), 950);
      return () => clearTimeout(timer);
    }
  }, [isCartBouncing, bounceKey]);

  useEffect(() => {
    if (showFloatingPlus) {
      const timer = setTimeout(() => setShowFloatingPlus(false), 1050);
      return () => clearTimeout(timer);
    }
  }, [showFloatingPlus, bounceKey]);

  const handleAdminClick = () => {
    if (isAdmin) {
      if (onOpenAdminPanel) onOpenAdminPanel();
      else if (onOpenAdmin) onOpenAdmin();
    } else {
      if (onOpenAdminAuth) onOpenAdminAuth();
      else if (onOpenAdmin) onOpenAdmin();
    }
  };

  const handleCategoryClick = (
    cat: 'all' | 'calzado' | 'ropa',
    gen: 'all' | 'varones' | 'mujeres' | 'ninos'
  ) => {
    if (onSelectCategoryFilter) {
      onSelectCategoryFilter(cat, gen);
    }
    setMobileMenuOpen(false);
  };

  const handleNuevoClick = () => {
    if (onSelectSpecialFilter) {
      onSelectSpecialFilter('nuevo');
    } else if (onSelectCategoryFilter) {
      onSelectCategoryFilter('all', 'all');
    }
    setMobileMenuOpen(false);
  };

  const supportUrl = getGeneralSupportWhatsAppUrl(settings);

  // Top ticker announcement items matching Yolu.pe
  const announcementItems = [
    'Solo vendemos zapatillas originales y nada más!',
    '¡LA CASA DE LAS ZAPATILLAS!',
    `Síguenos en Instagram ${settings.storeInstagram || '@auramoda.pe'}`,
    'Envíos rápidos a todo el Perú'
  ];

  if (settings.bannerNoticeActive && settings.bannerNotice) {
    announcementItems.unshift(settings.bannerNotice);
  }

  // Duplicate items to create a seamless infinite scroll effect
  const marqueeItems = [...announcementItems, ...announcementItems, ...announcementItems];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 select-none overflow-hidden">
      {/* Top Announcement Bar - Ticker Style */}
      <div className="bg-zinc-900 border-b border-zinc-950 py-1.5 px-3 text-[11px] text-zinc-200 overflow-hidden font-medium relative group flex">
        <div className="animate-promo-marquee flex items-center gap-6 whitespace-nowrap min-w-max pr-6">
          {marqueeItems.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-2 tracking-wide font-bold uppercase">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                {item}
              </span>
              <span className="text-zinc-600 select-none px-2">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Left: Navigation Categories (Desktop) & Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:gap-4 flex-1">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-zinc-800 hover:text-black rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Abrir menú"
              id="btn-header-mobile-menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Category Nav Links matching Yolu */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={handleNuevoClick}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-zinc-700 hover:text-black transition-all cursor-pointer"
              >
                NUEVO
              </button>

              <button
                onClick={() => handleCategoryClick('all', 'varones')}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  currentGender === 'varones' && currentCategory === 'all'
                    ? 'bg-black text-white font-black shadow-xs'
                    : 'text-zinc-700 hover:text-black font-bold'
                }`}
              >
                HOMBRE
              </button>

              <button
                onClick={() => handleCategoryClick('all', 'mujeres')}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  currentGender === 'mujeres' && currentCategory === 'all'
                    ? 'bg-black text-white font-black shadow-xs'
                    : 'text-zinc-700 hover:text-black font-bold'
                }`}
              >
                MUJER
              </button>

              <button
                onClick={() => handleCategoryClick('all', 'ninos')}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  currentGender === 'ninos' && currentCategory === 'all'
                    ? 'bg-black text-white font-black shadow-xs'
                    : 'text-zinc-700 hover:text-black font-bold'
                }`}
              >
                NIÑOS
              </button>

              <button
                onClick={() => handleCategoryClick('ropa', 'all')}
                className={`px-3.5 py-1.5 rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  currentCategory === 'ropa'
                    ? 'bg-black text-white font-black shadow-xs'
                    : 'text-zinc-700 hover:text-black font-bold'
                }`}
              >
                ROPA Y ACCESORIOS
              </button>
            </nav>
          </div>

          {/* Center: Brand Geometric Logo */}
          <div 
            onClick={() => handleCategoryClick('all', 'all')}
            className="cursor-pointer flex items-center justify-center shrink-0 group py-2"
          >
            {settings.logoUrl ? (
              <div className="h-8 sm:h-10 flex items-center">
                <img
                  src={settings.logoUrl}
                  alt={settings.storeName}
                  className="max-h-8 sm:max-h-10 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-black uppercase font-sans select-none">
                {settings.storeName || 'AURA'}
              </span>
            )}
          </div>

          {/* Right: Search + User + Cart Bag */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 flex-1">
            
            {/* Minimalist Search Bar (Desktop) */}
            <div className="hidden md:flex relative w-44 lg:w-56">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar.."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-7 py-2 bg-[#f4f4f5] hover:bg-[#ededf0] focus:bg-white border border-transparent focus:border-black rounded-full text-xs text-zinc-900 placeholder-zinc-400 transition-all outline-none"
                id="search-input-yolu"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-zinc-700 hover:text-black rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              aria-label="Buscar"
              id="btn-mobile-search-toggle"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Icon Button (Admin / Profile) */}
            <button
              onClick={handleAdminClick}
              className="p-2 text-zinc-700 hover:text-black rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              title={isAdmin ? "Panel de Administración" : "Acceso Administrativo / Cuenta"}
              aria-label="Usuario"
              id="btn-header-user"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className={`relative p-2 text-zinc-900 hover:text-black rounded-full hover:bg-zinc-100 transition-all duration-300 cursor-pointer flex items-center justify-center ${
                isCartBouncing ? 'scale-110' : ''
              }`}
              title="Ver Carrito de Compras"
              aria-label="Carrito de compras"
              id="btn-header-cart"
            >
              <ShoppingBag className={`w-5 h-5 ${isCartBouncing ? 'animate-cart-bounce' : ''}`} />
              
              {/* Badge Counter */}
              <span className={`absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-black flex items-center justify-center transition-transform ${
                cartCount > 0 
                  ? 'bg-black text-white' 
                  : 'bg-zinc-200 text-zinc-600'
              } ${isCartBouncing ? 'animate-badge-pop' : ''}`}>
                {cartCount}
              </span>
            </button>
          </div>

        </div>

        {/* Mobile Search Bar Expansion */}
        {showMobileSearch && (
          <div className="pb-3 md:hidden animate-fade-in">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar zapatillas, ropa, marcas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-[#f4f4f5] border border-zinc-200 rounded-full text-xs text-zinc-900 placeholder-zinc-400 outline-none"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 animate-slide-right">
            
            <div className="space-y-6">
              {/* Top Bar with Logo & Close */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
                <span className="text-xl font-black tracking-tight text-black uppercase font-sans">
                  {settings.storeName || 'AURA'}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-zinc-500 hover:text-black rounded-full hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col gap-2 font-bold uppercase text-sm tracking-wide">
                <button
                  onClick={() => {
                    handleCategoryClick('all', 'all');
                  }}
                  className="py-2.5 px-3 text-left rounded-xl hover:bg-zinc-100 text-zinc-800 transition-colors"
                >
                  TODO EL CATÁLOGO
                </button>
                <button
                  onClick={handleNuevoClick}
                  className="py-2.5 px-3 text-left rounded-xl hover:bg-zinc-100 text-zinc-800 transition-colors"
                >
                  NUEVO
                </button>
                <button
                  onClick={() => handleCategoryClick('all', 'varones')}
                  className="py-2.5 px-3 text-left rounded-xl hover:bg-zinc-100 text-zinc-800 transition-colors"
                >
                  HOMBRE
                </button>
                <button
                  onClick={() => handleCategoryClick('all', 'mujeres')}
                  className="py-2.5 px-3 text-left rounded-xl hover:bg-zinc-100 text-zinc-800 transition-colors"
                >
                  MUJER
                </button>
                <button
                  onClick={() => handleCategoryClick('all', 'ninos')}
                  className="py-2.5 px-3 text-left rounded-xl hover:bg-zinc-100 text-zinc-800 transition-colors"
                >
                  NIÑOS
                </button>
                <button
                  onClick={() => handleCategoryClick('ropa', 'all')}
                  className="py-2.5 px-3 text-left rounded-xl hover:bg-zinc-100 text-zinc-800 transition-colors"
                >
                  ROPA Y ACCESORIOS
                </button>
              </div>

              {/* Extra Services & Tracking */}
              <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs font-semibold text-zinc-600">
                {onOpenTracking && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenTracking();
                    }}
                    className="w-full flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-zinc-100 text-left transition-colors"
                  >
                    <Truck className="w-4 h-4 text-zinc-700" />
                    <span>Rastrear mi Pedido</span>
                  </button>
                )}

                <a
                  href={supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-zinc-100 text-left transition-colors text-emerald-700"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp de Atención</span>
                </a>
              </div>
            </div>

            {/* Admin Portal Bottom Trigger */}
            <div className="pt-4 border-t border-zinc-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminClick();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAdmin ? 'Ir al Panel Admin' : 'Acceso Administrativo'}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
