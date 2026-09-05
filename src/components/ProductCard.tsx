import React from 'react';
import { motion } from 'motion/react';
import { Product, StoreSettings } from '../types';
import { ShoppingBag, MessageCircle, AlertTriangle } from 'lucide-react';
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

  const whatsAppProductUrl = getProductWhatsAppUrl(
    settings,
    product,
    product.sizes[0],
    product.colors[0]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ 
        duration: 0.4, 
        delay: Math.min((index % 4) * 0.05, 0.2),
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="flex flex-col group cursor-pointer text-center select-none"
      onClick={handleOpenProduct}
    >
      {/* Yolu Light Grey Image Container */}
      <div className="relative aspect-square w-full bg-[#f4f4f5] group-hover:bg-[#ececee] rounded-2xl p-4 sm:p-5 flex items-center justify-center transition-all duration-300 overflow-hidden">
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="bg-black text-white text-[11px] font-black w-8 h-8 rounded-full flex items-center justify-center shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isNew && !hasDiscount && (
            <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
              NUEVO
            </span>
          )}
        </div>

        {/* Quick Add Button (Desktop hover) */}
        {!isOutOfStock && onQuickAddToCart && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            title="Agregar al carrito"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white text-zinc-800 hover:text-black shadow-xs flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer z-20"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        )}

        {/* Centered Sneaker / Clothing Image */}
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-4/5 h-4/5 object-contain group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = 'true';
              target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80';
            }
          }}
        />

        {/* Low Stock / Out of Stock pill */}
        {isOutOfStock ? (
          <div className="absolute bottom-3 inset-x-3 text-center">
            <span className="bg-black/80 text-white text-[10px] font-bold px-3 py-0.5 rounded-full backdrop-blur-xs inline-block">
              Agotado
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-3 inset-x-3 text-center">
            <span className="bg-amber-900/80 text-amber-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-300" />
              <span>Últimas {product.stock}</span>
            </span>
          </div>
        ) : null}
      </div>

      {/* Info Below Container matching Yolu screenshots */}
      <div className="pt-3 space-y-1">
        {/* Title */}
        <h3 
          className="text-xs sm:text-sm font-semibold text-zinc-900 group-hover:text-black transition-colors line-clamp-1"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price: regular strikethrough in gray, sale in bold black */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
          {hasDiscount && (
            <span className="text-zinc-400 line-through font-normal">
              {settings.currencySymbol} {product.originalPrice!.toFixed(2)}
            </span>
          )}
          <span className="text-black font-extrabold">
            {settings.currencySymbol} {product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
