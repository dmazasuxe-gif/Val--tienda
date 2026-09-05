import React, { useState } from 'react';
import { CartItem, StoreSettings } from '../types';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck 
} from 'lucide-react';

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

      setAppliedPromo({
        code: foundCoupon.code,
        discountAmount: foundCoupon.discountAmount,
        description: foundCoupon.description
      });
      setPromoCode('');
      return;
    }

    if (code === 'AURA10') {
      setAppliedPromo({ code: 'AURA10', discountAmount: 10, description: 'Descuento S/ 10.00' });
      setPromoCode('');
    } else if (code === 'BIENVENIDO') {
      setAppliedPromo({ code: 'BIENVENIDO', discountAmount: 15, description: 'Bienvenida S/ 15.00' });
      setPromoCode('');
    } else {
      setPromoError('Cupón no válido o no encontrado.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white border-l border-zinc-200 h-full flex flex-col shadow-2xl z-10 animate-slide-left text-zinc-900">
        
        {/* Minimal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-black" />
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-black">
              Carrito de Compras
            </h2>
            <span className="text-[11px] font-bold bg-black text-white px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Cerrar carrito"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-200 shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-600 font-medium flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-black" />
              {isFreeShipping ? (
                <span className="text-emerald-700 font-bold">¡Genial! Calificas para ENVÍO GRATIS</span>
              ) : (
                <span>
                  Faltan <strong className="text-black font-bold">{settings.currencySymbol} {amountNeededForFreeShipping.toFixed(2)}</strong> para Envío Gratis
                </span>
              )}
            </span>
            <span className="text-[11px] text-zinc-500 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isFreeShipping ? 'bg-emerald-600' : 'bg-black'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-black uppercase tracking-tight">Tu carrito está vacío</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                  Explora nuestro catálogo exclusivo para agregar tus zapatillas y prendas favoritas.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white border border-zinc-200 flex gap-3.5 items-center group transition-colors hover:border-zinc-300"
              >
                {/* Thumbnail */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-[#f4f4f5] border border-zinc-100 shrink-0 flex items-center justify-center">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'}
                    alt={item.product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80';
                      }
                    }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 truncate uppercase tracking-tight">
                      {item.product.name}
                    </h4>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-zinc-400 hover:text-black p-1 -mr-1 transition-colors cursor-pointer"
                      title="Eliminar producto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Size and Color badges */}
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <span className="bg-zinc-100 px-2 py-0.5 rounded text-zinc-900 font-semibold border border-zinc-200">
                      Talla: {item.selectedSize}
                    </span>
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-zinc-300 inline-block"
                        style={{ backgroundColor: item.selectedColor.hex }}
                      />
                      <span className="truncate max-w-[80px]">{item.selectedColor.name}</span>
                    </span>
                  </div>

                  {/* Price & Stepper */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs sm:text-sm font-black text-black">
                      {settings.currencySymbol} {(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Quantity Stepper */}
                    <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-lg p-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-white text-zinc-700 hover:bg-zinc-100 flex items-center justify-center text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.min(item.product.stock, item.quantity + 1))}
                        disabled={item.quantity >= item.product.stock}
                        className="w-6 h-6 rounded bg-white text-zinc-700 hover:bg-zinc-100 flex items-center justify-center text-xs font-bold disabled:opacity-30 cursor-pointer transition-colors shadow-2xs"
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
          <div className="p-4 sm:p-5 border-t border-zinc-200 bg-white space-y-3.5 shrink-0">
            
            {/* Promo Code Input */}
            <div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="CUPÓN DE DESCUENTO"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-black uppercase placeholder-zinc-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                >
                  Aplicar
                </button>
              </div>

              {appliedPromo && (
                <div className="mt-2 p-2 bg-zinc-50 border border-zinc-200 rounded-xl text-[11px] text-zinc-800 flex items-center justify-between gap-2 font-medium">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      Cupón <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-300 font-bold text-black">{appliedPromo.code}</strong> (-{settings.currencySymbol} {appliedPromo.discountAmount.toFixed(2)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAppliedPromo(null)}
                    className="text-zinc-500 hover:text-black text-[10px] font-bold underline cursor-pointer shrink-0"
                  >
                    Quitar
                  </button>
                </div>
              )}
              {promoError && (
                <p className="mt-1 text-[11px] text-rose-600 font-medium">{promoError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-zinc-600 border-t border-zinc-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-zinc-900">{settings.currencySymbol} {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span className={`font-semibold ${isFreeShipping ? 'text-emerald-700 font-bold' : 'text-zinc-900'}`}>
                  {isFreeShipping ? 'GRATIS' : `${settings.currencySymbol} ${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Descuento cupón:</span>
                  <span>-{settings.currencySymbol} {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-black pt-2 border-t border-zinc-200">
                <span>Total Estimado:</span>
                <span>{settings.currencySymbol} {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 bg-black hover:bg-zinc-800 text-white font-black rounded-full flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                <span>Continuar Compra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClearCart}
                className="w-full text-center text-[11px] text-zinc-400 hover:text-black py-1 transition-colors cursor-pointer font-medium"
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
