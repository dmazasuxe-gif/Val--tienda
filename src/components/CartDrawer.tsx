import React, { useState } from 'react';
import { CartItem, StoreSettings } from '../types';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  MessageCircle, 
  Tag, 
  Check, 
  Truck 
} from 'lucide-react';
import { getOrderWhatsAppUrl } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenCheckout?: (discount: number, promoCode: string) => void;
  onCheckout?: () => void;
  settings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
  onCheckout,
  settings
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number; description?: string } | null>(null);
  const [promoError, setPromoError] = useState('');

  const handleProceedCheckout = () => {
    if (onOpenCheckout) {
      onOpenCheckout(discountAmount, appliedPromo?.code || '');
    } else if (onCheckout) {
      onCheckout();
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= settings.freeShippingThreshold || subtotal === 0;
  const shippingCost = isFreeShipping ? 0 : settings.standardShippingCost;
  const discountAmount = appliedPromo ? Math.min(subtotal, appliedPromo.discountAmount) : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const amountNeededForFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / settings.freeShippingThreshold) * 100));

  const handleApplyPromo = () => {
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Por favor ingresa un código de cupón');
      return;
    }

    // Buscar en la lista de cupones configurados
    const coupons = settings.coupons || [];
    const foundCoupon = coupons.find((c) => c.code.toUpperCase() === code);

    if (foundCoupon) {
      if (!foundCoupon.isActive) {
        setPromoError(`El cupón "${code}" está inactivo actualmente.`);
        return;
      }
      if (foundCoupon.isUsed) {
        const orderInfo = foundCoupon.usedInOrderNumber ? ` en el pedido #${foundCoupon.usedInOrderNumber}` : '';
        setPromoError(`Este cupón ya fue utilizado${orderInfo}. Es válido para una sola compra.`);
        return;
      }

      // Cupón de descuento en dinero válido y disponible
      setAppliedPromo({
        code: foundCoupon.code,
        discountAmount: foundCoupon.discountAmount,
        description: foundCoupon.description
      });
      setPromoCode('');
      return;
    }

    // Códigos preestablecidos de respaldo
    if (code === 'AURA10') {
      setAppliedPromo({ code: 'AURA10', discountAmount: 10, description: 'Descuento S/ 10.00' });
      setPromoCode('');
    } else if (code === 'BIENVENIDO') {
      setAppliedPromo({ code: 'BIENVENIDO', discountAmount: 15, description: 'Bienvenida S/ 15.00' });
      setPromoCode('');
    } else {
      setPromoError('Cupón no válido o no encontrado. Verifica el código de sorteo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white border-l border-sky-100 h-full flex flex-col shadow-2xl z-10 animate-slide-left text-slate-800">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 flex items-center justify-between bg-sky-50/70 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Playfair_Display',serif]">
              Tu Carrito de Compras
            </h2>
            <span className="text-xs bg-sky-100 text-sky-800 border border-sky-200 font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} ítems
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-sky-50/40 px-4 py-3 border-b border-sky-100 shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-600 font-medium flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-600" />
              {isFreeShipping ? (
                <span className="text-emerald-700 font-bold">¡Genial! Calificas para ENVÍO GRATIS 🎉</span>
              ) : (
                <span>
                  Faltan <strong className="text-sky-700">{settings.currencySymbol} {amountNeededForFreeShipping.toFixed(2)}</strong> para Envío Gratis
                </span>
              )}
            </span>
            <span className="text-[11px] text-slate-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-sky-100">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeShipping ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-sky-400 to-blue-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-['Playfair_Display',serif]">Tu carrito está vacío</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Explora nuestro catálogo de calzado y ropa exclusiva para agregar tus artículos favoritos.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/20 uppercase tracking-wider cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white border border-sky-100 flex gap-3 items-center group shadow-xs hover:border-sky-300 transition-colors"
              >
                {/* Thumbnail */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-sky-50 border border-sky-100 shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-sky-700">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 -mr-1 transition-colors cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Size and Color badges */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="bg-sky-50 px-2 py-0.5 rounded text-sky-800 font-semibold border border-sky-100">
                      Talla: {item.selectedSize}
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 inline-block"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span className="truncate max-w-[80px]">{item.selectedColor.name}</span>
                    </span>
                  </div>

                  {/* Price & Stepper */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {settings.currencySymbol} {(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs font-bold shadow-2xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                        disabled={item.quantity >= item.product.stock}
                        className="w-6 h-6 rounded bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center text-xs font-bold disabled:opacity-30 shadow-2xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-sky-100 bg-sky-50/50 space-y-3 shrink-0">
            
            {/* Promo Code Input */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cupón (ej. AURA10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-sky-200 rounded-xl text-xs text-slate-800 uppercase placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-2xs"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  Aplicar
                </button>
              </div>

              {appliedPromo && (
                <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 flex items-center justify-between gap-2 font-medium">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      Cupón <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300 font-bold text-emerald-900">{appliedPromo.code}</strong> aplicado (-{settings.currencySymbol} {appliedPromo.discountAmount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    className="text-rose-600 hover:text-rose-700 text-[10px] font-bold underline cursor-pointer shrink-0"
                  >
                    Quitar
                  </button>
                </div>
              )}
              {promoError && (
                <p className="mt-1 text-[11px] text-rose-600">{promoError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-sky-100 pt-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{settings.currencySymbol} {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span className={`font-semibold ${isFreeShipping ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {isFreeShipping ? 'GRATIS' : `${settings.currencySymbol} ${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Descuento cupón:</span>
                  <span>-{settings.currencySymbol} {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-sky-100">
                <span>Total Estimado:</span>
                <span className="text-sky-700 font-black">{settings.currencySymbol} {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-sky-500/25 text-xs sm:text-sm transition-all hover:scale-101 active:scale-98 cursor-pointer uppercase tracking-wider"
              >
                <span>Proceder a Pagar</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClearCart}
                className="w-full text-center text-[11px] text-slate-400 hover:text-slate-700 py-1 transition-colors cursor-pointer"
              >
                Vaciar carrito
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
