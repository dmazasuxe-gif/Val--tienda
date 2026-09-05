import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StoreSettings, RunwaySlide } from '../types';

interface BannerProps {
  settings: StoreSettings;
  onExploreCategory?: (category: 'calzado' | 'ropa', gender?: 'varones' | 'mujeres' | 'ninos') => void;
  onShopNow?: (category: 'all' | 'calzado' | 'ropa', gender: 'all' | 'varones' | 'mujeres' | 'ninos') => void;
  onOpenSale?: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1800&auto=format&fit=crop&q=80';

const DEFAULT_RUNWAY_SLIDES: RunwaySlide[] = [
  {
    id: "runway-1",
    imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1800&auto=format&fit=crop&q=80",
    title: "LACOSTE X HIGHSNOBIETY\nL003 2K24",
    subtitle: "Zapatillas exclusivas inspiradas en la cultura tenis y moda streetwear",
    badge: "RECIÉN LLEGADO",
    linkCategory: "calzado",
    linkGender: "varones"
  },
  {
    id: "runway-2",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&auto=format&fit=crop&q=80",
    title: "ADIDAS ORIGINALS\nSAMBA & GAZELLE",
    subtitle: "La silueta clásica que marca tendencia global esta temporada",
    badge: "TENDENCIA 2026",
    linkCategory: "calzado",
    linkGender: "mujeres"
  }
];

export const Banner: React.FC<BannerProps> = ({ 
  settings, 
  onExploreCategory, 
  onShopNow 
}) => {
  // Ensure we always have slides to display, falling back to defaults if empty or invalid
  const rawSlides = Array.isArray(settings?.runwaySlides) ? settings.runwaySlides : [];
  const validSlides = rawSlides.filter(s => s && typeof s.imageUrl === 'string' && s.imageUrl.trim().length > 0);
  const slides = validSlides.length > 0 ? validSlides : DEFAULT_RUNWAY_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Safety bounds
  const safeIndex = (currentIndex >= 0 && currentIndex < slides.length) ? currentIndex : 0;

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [slides.length, handleNext, isPaused]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const handleSlideAction = (slide: RunwaySlide) => {
    if (slide.linkCategory) {
      if (onExploreCategory) {
        onExploreCategory(slide.linkCategory as any, slide.linkGender as any);
      } else if (onShopNow) {
        onShopNow(slide.linkCategory as any, slide.linkGender || 'all');
      }
    }
  };

  if (!slides.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2" id="section-pasarela-imagenes">
      <div 
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-900 select-none group shadow-lg shadow-zinc-950/10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        id="hero-banner-yolu"
      >
        <div className="relative w-full h-[340px] sm:h-[460px] md:h-[520px] lg:h-[560px] overflow-hidden bg-black">
          {slides.map((slide, index) => {
            const isActive = index === safeIndex;
            
            return (
              <div
                key={slide.id || `slide-${index}`}
                className="absolute inset-0 w-full h-full"
                style={{
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  zIndex: isActive ? 10 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  visibility: isActive ? 'visible' : 'hidden'
                }}
              >
                {/* Image layer */}
                <img
                  src={slide.imageUrl || FALLBACK_IMAGE}
                  alt={slide.title || 'Pasarela'}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = FALLBACK_IMAGE;
                    }
                  }}
                />

                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 pointer-events-none" />

                {/* Content */}
                <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 max-w-xl text-left space-y-2 sm:space-y-3 z-20">
                  {slide.badge && (
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-black uppercase tracking-widest text-white border border-white/20 shadow-sm">
                      {slide.badge}
                    </span>
                  )}

                  {slide.title && (
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none whitespace-pre-line drop-shadow-lg">
                      {slide.title}
                    </h1>
                  )}

                  {slide.subtitle && (
                    <p className="text-xs sm:text-sm text-zinc-100 line-clamp-2 max-w-md drop-shadow-md font-medium">
                      {slide.subtitle}
                    </p>
                  )}

                  <div className="pt-2 sm:pt-4">
                    <button
                      onClick={() => handleSlideAction(slide)}
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                    >
                      Ver Ahora
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-30 cursor-pointer shadow-lg border border-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-30 cursor-pointer shadow-lg border border-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Indicators */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 right-6 sm:right-12 z-30 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === safeIndex ? 'w-8 sm:w-10 bg-white shadow-md' : 'w-2 sm:w-3 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
