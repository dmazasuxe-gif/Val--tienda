import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles,
  Menu,
  X,
  Truck
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
  showAdminButton = false
}) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Soft tactile cart bounce states
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

  // Trigger bounce whenever explicit cartBounceTrigger increments
  useEffect(() => {
    if (cartBounceTrigger && cartBounceTrigger > 0) {
      triggerCartBounce(1);
    }
  }, [cartBounceTrigger]);

  // Trigger bounce automatically when cartCount increases
  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      const diff = cartCount - prevCartCountRef.current;
      triggerCartBounce(diff);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  // Settle animation states after spring bounce completes
  useEffect(() => {
    if (isCartBouncing) {
      const timer = setTimeout(() => {
        setIsCartBouncing(false);
      }, 950);
      return () => clearTimeout(timer);
    }
  }, [isCartBouncing, bounceKey]);

  useEffect(() => {
    if (showFloatingPlus) {
      const timer = setTimeout(() => {
        setShowFloatingPlus(false);
      }, 1050);
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

  const handleCategorySelect = (category: 'all' | 'calzado' | 'ropa', gender: 'all' | 'varones' | 'mujeres' | 'ninos') => {
    if (onSelectCategoryFilter) {
      onSelectCategoryFilter(category, gender);
    }
  };

  const supportUrl = getGeneralSupportWhatsAppUrl(settings);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-sky-100 shadow-sm transition-all">
      {/* Top Banner Notice - Luxury Sky Blue Accent */}
      {settings.bannerNoticeActive && settings.bannerNotice && (
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white py-1 px-3 text-xs font-semibold text-center flex items-center justify-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-sky-200" />
          <span className="truncate">{settings.bannerNotice}</span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Store Logo & Full Title (Generous space, no cramped clamping) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            {/* Store Navigation Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:px-2.5 sm:py-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-sky-50 border border-transparent hover:border-sky-200 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
              aria-label="Abrir menú de la tienda"
              title="Menú de Navegación y Opciones"
              id="btn-header-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-sky-600" /> : <Menu className="w-5 h-5 text-slate-700" />}
              <span className="hidden sm:inline text-xs font-bold text-slate-800">Menú</span>
            </button>

            {/* Store Logo & Title */}
            <div 
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group min-w-0" 
              onClick={() => handleCategorySelect('all', 'all')}
            >
              {settings.logoUrl ? (
                <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border border-sky-200/80 shadow-md shadow-sky-500/10 shrink-0 bg-sky-50">
                  <img
                    src={settings.logoUrl}
                    alt={settings.storeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-black text-sm sm:text-xl shadow-md shadow-sky-500/20 shrink-0">
                  {settings.storeName.charAt(0)}
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm sm:text-2xl tracking-tight text-slate-900 flex items-center gap-1 font-['Playfair_Display',serif] leading-tight group-hover:text-sky-700 transition-colors">
                  {settings.storeName}
                </span>
                <span className="text-[10px] sm:text-xs text-sky-600 font-semibold tracking-wider uppercase truncate">
                  {settings.slogan || 'Calzado & Moda Exclusiva'}
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
              <input
                type="text"
                placeholder="Buscar calzado, ropa, marcas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-sky-50/70 border border-sky-200/70 rounded-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-400 transition-all shadow-inner"
                id="search-input-desktop"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-sky-100 rounded-full p-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 text-slate-600 hover:text-sky-600 rounded-full hover:bg-sky-50 transition-colors md:hidden cursor-pointer"
              aria-label="Buscar productos"
              id="btn-mobile-search-toggle"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* WhatsApp Contact Header Button (Desktop) */}
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-102 shadow-xs"
              id="btn-header-whatsapp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Icon & Button with Tactile Bouncing Effect */}
            <button
              onClick={onOpenCart}
              className={`relative p-2 sm:px-3.5 sm:py-2 rounded-full transition-all duration-300 flex items-center gap-2 cursor-pointer shrink-0 shadow-md ${
                isCartBouncing 
                  ? 'bg-slate-900 ring-2 ring-sky-400/80 shadow-sky-500/30 scale-105' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-102 shadow-slate-900/10'
              }`}
              title="Ver Carrito de Compras"
              id="btn-header-cart"
            >
              {/* Soft expanding tactile ripple when an item is added */}
              {isCartBouncing && (
                <span 
                  key={`ripple-${bounceKey}`}
                  className="absolute inset-0 rounded-full bg-sky-400/30 animate-cart-ripple pointer-events-none" 
                />
              )}

              {/* Floating +N indicator that flies up playfully */}
              {showFloatingPlus && (
                <span 
                  key={`float-${bounceKey}`}
                  className="absolute -top-3.5 right-1 px-1.5 py-0.5 rounded-full bg-sky-500 text-white text-[10px] font-black pointer-events-none animate-float-up shadow-sm border border-white/40 z-30"
                >
                  +{floatingQty}
                </span>
              )}

              {/* Soft bouncing shopping bag icon */}
              <div className="relative flex items-center justify-center">
                <ShoppingBag 
                  key={`icon-${bounceKey}`}
                  className={`w-4 h-4 sm:w-4.5 sm:h-4.5 text-sky-300 transition-colors ${
                    isCartBouncing ? 'animate-cart-bounce text-sky-200' : ''
                  }`} 
                />
              </div>

              <span className="hidden md:inline text-xs font-bold text-white">Carrito</span>

              {cartCount > 0 && (
                <span 
                  key={`badge-${bounceKey}`}
                  className={`bg-sky-400 text-slate-950 text-[10px] sm:text-[11px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-sm transition-transform ${
                    isCartBouncing ? 'animate-badge-pop' : ''
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Panel Access Button (Only rendered if showAdminButton is true) */}
            {showAdminButton && (
              <button
                onClick={handleAdminClick}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shrink-0 ${
                  isAdmin 
                    ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 shadow-xs' 
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
                title={isAdmin ? 'Ir al Panel Administrativo' : 'Acceso Administrativo'}
                id="btn-admin-access"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${isAdmin ? 'text-purple-600' : 'text-slate-500'}`} />
                <span className="hidden lg:inline">{isAdmin ? 'Panel Admin' : 'Admin'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {showMobileSearch && (
          <div className="pb-3 pt-1 md:hidden animate-fade-in">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500" />
              <input
                type="text"
                placeholder="Buscar calzado, ropa, tallas, marcas..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-9 py-2 bg-sky-50 border border-sky-300 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white shadow-inner"
                id="search-input-mobile"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Store Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-sky-100 bg-white/98 backdrop-blur-2xl shadow-xl animate-fade-in text-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-2 flex items-center justify-between">
              <span>Categorías Principales</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-[11px] text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                Cerrar Menú ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <button
              onClick={() => { handleCategorySelect('calzado', 'varones'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-100 text-slate-800 font-semibold cursor-pointer"
            >
              👟 Calzado Varones
            </button>
            <button
              onClick={() => { handleCategorySelect('calzado', 'mujeres'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-100 text-slate-800 font-semibold cursor-pointer"
            >
              👠 Calzado Mujeres
            </button>
            <button
              onClick={() => { handleCategorySelect('calzado', 'ninos'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-100 text-slate-800 font-semibold cursor-pointer"
            >
              🧒 Calzado Niños
            </button>
            <button
              onClick={() => { handleCategorySelect('ropa', 'varones'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-100 text-slate-800 font-semibold cursor-pointer"
            >
              👔 Ropa Varones
            </button>
            <button
              onClick={() => { handleCategorySelect('ropa', 'mujeres'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-100 text-slate-800 font-semibold cursor-pointer"
            >
              👗 Ropa Mujeres
            </button>
            <button
              onClick={() => { handleCategorySelect('ropa', 'ninos'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 border border-sky-100 text-slate-800 font-semibold cursor-pointer"
            >
              👕 Ropa Niños
            </button>
          </div>

          <div className="pt-2 border-t border-sky-100 flex flex-col gap-2">
            {onOpenTracking && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white py-2.5 rounded-xl font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Rastrear mi Pedido en Tiempo Real</span>
              </button>
            )}

            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-2.5 rounded-xl font-bold text-xs border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span>Chatear con Asesor por WhatsApp</span>
            </a>

            {showAdminButton && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleAdminClick();
                }}
                className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-xl text-xs font-semibold border border-slate-200 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>{isAdmin ? 'Ingresar a Panel de Administración' : 'Acceso Administrador (PIN)'}</span>
              </button>
            )}
          </div>
        </div>
        </div>
      )}
    </header>
  );
};

