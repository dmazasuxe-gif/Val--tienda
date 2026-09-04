import React, { useState } from 'react';
import { Product, ProductColor, StoreSettings } from '../types';
import { 
  X, 
  MessageCircle, 
  ShoppingBag, 
  Check, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Ruler
} from 'lucide-react';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen?: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen = true,
  onClose,
  settings,
  onAddToCart
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product?.colors?.[0] || { name: 'Estándar', hex: '#000000' });
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'detalles' | 'materiales' | 'tallas' | 'envios'>('detalles');
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Sync state when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || { name: 'Estándar', hex: '#000000' });
      setQuantity(1);
      setActiveTab('detalles');
    }
  }, [product?.id]);

  if (!product || isOpen === false) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  const whatsAppProductUrl = getProductWhatsAppUrl(
    settings,
    product,
    selectedSize,
    selectedColor
  );

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2500);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/50 backdrop-blur-sm overflow-y-auto animate-fade-in">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white border border-sky-100 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto max-h-[95vh] text-slate-800">
        
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-sky-100 flex items-center justify-between bg-sky-50/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest px-3 py-1 bg-sky-100/80 border border-sky-200 rounded-full">
              {product.brand} • {product.category.toUpperCase()} ({product.gender.toUpperCase()})
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">SKU: {product.sku}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 2 Columns on Tablet/Desktop */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
          
          {/* Column 1: Multi-Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square sm:aspect-[4/4.5] rounded-2xl overflow-hidden bg-slate-50 border border-sky-100">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Prev / Next controls */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition-all border border-sky-100 shadow-md cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition-all border border-sky-100 shadow-md cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Tags on Image */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {hasDiscount && (
                  <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                    AHORRA {discountPercent}%
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-sky-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                    NUEVA COLECCIÓN
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImageIndex === idx
                        ? 'border-sky-500 scale-95 shadow-md shadow-sky-500/20'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Stock Alert Badge */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-sky-100 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-semibold">Disponibilidad en Almacén:</span>
              {isOutOfStock ? (
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Sin stock por el momento</span>
                </span>
              ) : isLowStock ? (
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>¡Solo quedan {product.stock} unidades!</span>
                </span>
              ) : (
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stock Disponible ({product.stock})</span>
                </span>
              )}
            </div>
          </div>

          {/* Column 2: Product Config & Buy Section */}
          <div className="flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug font-['Playfair_Display',serif]">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-2">
                  <span className="text-2xl sm:text-3xl font-black text-sky-700">
                    {settings.currencySymbol} {product.price.toFixed(2)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm sm:text-base text-slate-400 line-through">
                      {settings.currencySymbol} {product.originalPrice!.toFixed(2)}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      Ahorras {settings.currencySymbol} {(product.originalPrice! - product.price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-sky-600" />
                    <span>Seleccionar Talla:</span>
                  </label>
                  <span className="text-xs text-sky-700 font-bold">{selectedSize}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`min-w-11 h-10 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-sky-600 text-white border-sky-600 shadow-md font-black scale-105'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <span>Color Seleccionado:</span>
                  </label>
                  <span className="text-xs text-sky-700 font-bold">{selectedColor.name}</span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((clr, i) => {
                    const isSelected = selectedColor.name === clr.name;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(clr)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-500 font-bold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-sky-300'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: clr.hex }}
                        />
                        <span>{clr.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Cantidad:
                </label>
                <div className="inline-flex items-center bg-slate-50 border border-sky-200 rounded-xl p-1 shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-sky-50 text-slate-800 font-bold flex items-center justify-center disabled:opacity-30 transition-colors border border-sky-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-8 h-8 rounded-lg bg-white hover:bg-sky-50 text-slate-800 font-bold flex items-center justify-center disabled:opacity-30 transition-colors border border-sky-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tab Navigation for Detailed Info */}
              <div className="pt-2">
                <div className="flex border-b border-sky-100 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('detalles')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'detalles' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Descripción
                  </button>
                  <button
                    onClick={() => setActiveTab('materiales')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'materiales' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Materiales & Cuidado
                  </button>
                  <button
                    onClick={() => setActiveTab('tallas')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'tallas' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Guía de Tallas
                  </button>
                  <button
                    onClick={() => setActiveTab('envios')}
                    className={`pb-2 border-b-2 transition-colors cursor-pointer ${
                      activeTab === 'envios' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Envíos
                  </button>
                </div>

                <div className="py-3 text-xs text-slate-600 leading-relaxed min-h-[60px]">
                  {activeTab === 'detalles' && (
                    <p>{product.description}</p>
                  )}
                  {activeTab === 'materiales' && (
                    <div className="space-y-1.5">
                      <p><strong>Composición:</strong> {product.materials || 'Materiales premium seleccionados de alta resistencia.'}</p>
                      {product.careGuide && <p><strong>Cuidados:</strong> {product.careGuide}</p>}
                    </div>
                  )}
                  {activeTab === 'tallas' && (
                    <div className="space-y-1">
                      <p className="font-semibold text-sky-800">¿Dudas con la talla perfecta?</p>
                      <p>Nuestras hormas son estándar internacionales. Si estás entre dos tallas de calzado o prefieres ropa holgada, recomendamos seleccionar una talla superior o consultarnos por WhatsApp.</p>
                    </div>
                  )}
                  {activeTab === 'envios' && (
                    <div className="space-y-1">
                      <p>🚀 <strong>Lima Metropolitana:</strong> Entrega en 24 a 48 horas hábiles.</p>
                      <p>📦 <strong>Provincias / Nacional:</strong> Entrega en 48 a 72 horas por Courier Express Certificado con código de rastreo en vivo.</p>
                      <p>✨ <strong>Envío Gratis:</strong> En compras superiores a {settings.currencySymbol} {settings.freeShippingThreshold}.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* CTAs: WhatsApp Direct Advice + Add to Cart */}
            <div className="space-y-2.5 pt-2 border-t border-sky-100">
              
              {/* WhatsApp direct consultation */}
              <a
                href={whatsAppProductUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-101 active:scale-98 text-xs sm:text-sm"
              >
                <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                <span>Consultar dudas con un Asesor por WhatsApp</span>
              </a>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3.5 px-4 font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all text-xs sm:text-sm ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : addedSuccess
                    ? 'bg-emerald-600 text-white font-bold shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25 hover:scale-101 active:scale-99 cursor-pointer'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>¡Producto Agregado al Carrito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{isOutOfStock ? 'Producto Agotado' : `Agregar al Carrito • ${settings.currencySymbol} ${(product.price * quantity).toFixed(2)}`}</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
