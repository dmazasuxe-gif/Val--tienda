import React from 'react';
import { motion } from 'motion/react';
import { Product, StoreSettings } from '../types';
import { MessageCircle, ShoppingBag, Eye, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

interface ProductCardProps {
  product: Product;
  settings: StoreSettings;
  index?: number;
  onOpenDetails?: (product: Product) => void;
  onOpenDetail?: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
  onAddToCart?: (size: string, color: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  settings,
  index = 0,
  onOpenDetails,
  onOpenDetail,
  onQuickAddToCart,
  onAddToCart
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) 
    : 0;

  const handleOpenProduct = () => {
    if (onOpenDetails) {
      onOpenDetails(product);
    } else if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  // Direct WhatsApp link for this product
  const whatsAppProductUrl = getProductWhatsAppUrl(
    settings,
    product,
    product.sizes[0],
    product.colors[0]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ 
        duration: 0.5, 
        delay: Math.min((index % 4) * 0.06, 0.24),
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="group relative bg-white border border-sky-100 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col"
    >
      
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/5] bg-sky-50 overflow-hidden cursor-pointer" onClick={handleOpenProduct}>
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="bg-rose-500 text-white text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-sky-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              NUEVO
            </span>
          )}
        </div>

        {/* Quick Add Button on Hover */}
        {!isOutOfStock && onQuickAddToCart && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            title="Agregar directamente al carrito"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-sky-600 shadow-md border border-sky-100 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer z-20"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}

        {/* Stock Alert Badge over Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {isOutOfStock ? (
            <span className="bg-slate-900/80 border border-red-400/80 text-red-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 shadow-sm">
              <XCircle className="w-3 h-3 text-red-400" />
              <span>Agotado</span>
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-950/80 border border-amber-400/80 text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1 shadow-sm animate-pulse">
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>¡Últimas {product.stock}!</span>
            </span>
          ) : (
            <span className="bg-slate-900/70 text-emerald-300 border border-emerald-400/30 text-[10px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>En stock ({product.stock})</span>
            </span>
          )}

          {/* Image counter if multiple images */}
          {product.images.length > 1 && (
            <span className="bg-slate-900/70 text-white/90 border border-white/10 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-md">
              +{product.images.length} fotos
            </span>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Brand & Category & Full Product Name */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-1 text-[11px] font-medium">
            <span className="text-sky-600 font-bold uppercase tracking-wider truncate">{product.brand}</span>
            <span className="text-slate-400 capitalize">{product.category} ({product.gender})</span>
          </div>

          {/* Product Title - Displayed Completely Without Truncation */}
          <h3 
            onClick={handleOpenProduct}
            className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors cursor-pointer font-['Playfair_Display',serif] leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Price Box */}
        <div className="pt-2 border-t border-sky-100 flex items-baseline justify-between">
          <div>
            <span className="text-lg sm:text-xl font-black text-slate-900">
              {settings.currencySymbol} {product.price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through ml-2">
                {settings.currencySymbol} {product.originalPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: WhatsApp Consultation + Add to Cart (Fully Visible Text) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {/* Direct WhatsApp Consultation Button */}
          <a
            href={whatsAppProductUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all text-center hover:scale-[1.02] shadow-2xs whitespace-nowrap cursor-pointer"
            title="Consultar dudas sobre este producto por WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600 shrink-0" />
            <span className="font-bold">WhatsApp</span>
          </a>

          {/* Add to cart / Select Options */}
          <button
            onClick={handleOpenProduct}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-center whitespace-nowrap ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 hover:scale-[1.02] cursor-pointer'
            }`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="font-bold">{isOutOfStock ? 'Agotado' : 'Comprar'}</span>
          </button>
        </div>

      </div>
    </motion.div>
  );
};
