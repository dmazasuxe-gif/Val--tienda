import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StoreSettings, RunwaySlide } from '../types';

interface BannerProps {
  settings: StoreSettings;
  onExploreCategory?: (category: 'calzado' | 'ropa', gender?: 'varones' | 'mujeres' | 'ninos') => void;
  onShopNow?: (category: 'all' | 'calzado' | 'ropa', gender: 'all' | 'varones' | 'mujeres' | 'ninos') => void;
  onOpenSale?: () => void;
}

const DEFAULT_RUNWAY_SLIDES: RunwaySlide[] = [
  {
    id: "runway-1",
    imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1800&auto=format&fit=crop&q=85",
    title: "LACOSTE X HIGHSNOBIETY\nL003 2K24",
    subtitle: "Zapatillas exclusivas inspiradas en la cultura tenis y moda streetwear",
    badge: "RECIÉN LLEGADO",
    linkCategory: "calzado",
    linkGender: "varones"
  },
  {
    id: "runway-2",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1800&auto=format&fit=crop&q=85",
    title: "ADIDAS ORIGINALS\nSAMBA & GAZELLE",
    subtitle: "La silueta clásica que marca tendencia global esta temporada",
    badge: "TENDENCIA 2026",
    linkCategory: "calzado",
    linkGender: "mujeres"
  },
  {
    id: "runway-3",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&auto=format&fit=crop&q=85",
    title: "JORDAN RETRO &\nSTREETWEAR VIBES",
    subtitle: "Edición limitada para coleccionistas y amantes del calzado original",
    badge: "COLECCIÓN LIMITADA",
    linkCategory: "ropa",
    linkGender: "varones"
  }
];

export const Banner: React.FC<BannerProps> = ({ 
  settings, 
  onExploreCategory, 
  onShopNow 
}) => {
  // Filter out any broken or empty slides
  const validSlides = (settings.runwaySlides || []).filter(
    (s) => s && typeof s.imageUrl === 'string' && s.imageUrl.trim().length > 0
  );
  const slides: RunwaySlide[] = validSlides.length > 0 ? validSlides : DEFAULT_RUNWAY_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5500);
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

  if (!slides || slides.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2" id="section-pasarela-imagenes">
      <div 
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 select-none group shadow-lg shadow-zinc-950/10"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        id="hero-banner-yolu"
      >
        {/* Cinematic Viewport Frame */}
        <div className="relative w-full h-[340px] sm:h-[460px] md:h-[520px] lg:h-[560px] overflow-hidden">
          
          {/* Slides Stack */}
          {slides.map((slide, index) => {
            const isActive = index === currentIndex;
            
            return (
              <div
                key={slide.id || index}
                className={`absolute inset-0 bg-zinc-950 transition-opacity duration-1000 ease-in-out ${
                  isActive 
                    ? 'opacity-100 z-10 pointer-events-auto' 
                    : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Hero Image */}
                <img
                  src={slide.imageUrl}
                  alt={slide.title || 'Pasarela Aura'}
                  className="w-full h-full object-cover object-center block select-none"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=1800&auto=format&fit=crop&q=85';
                    }
                  }}
                />

                {/* Refined Vignette / Gradient Overlay: Clear visibility of product photo with legible typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10 pointer-events-none" />

                {/* Content Overlay matching Yolu Screenshots 1 & 2 */}
                <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 max-w-xl text-left space-y-2 sm:space-y-3 z-10">
                  {/* Badge */}
                  {slide.badge && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] sm:text-xs font-black uppercase tracking-widest text-white drop-shadow-xs">
                      {slide.badge}
                    </span>
                  )}

                  {/* Big Bold Headline */}
                  {slide.title && (
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none whitespace-pre-line font-sans drop-shadow-md">
                      {slide.title}
                    </h1>
                  )}

                  {/* Subtitle / Teaser */}
                  {slide.subtitle && (
                    <p className="text-xs sm:text-sm text-zinc-200 line-clamp-2 max-w-md drop-shadow-xs font-medium">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* CTA Pill Button matching Yolu */}
                  <div className="pt-2 sm:pt-3">
                    <button
                      onClick={() => handleSlideAction(slide)}
                      className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-white hover:bg-zinc-100 text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
                      id="btn-banner-shop-now"
                    >
                      COMPRAR AHORA
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows on sides */}
          {slides.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 z-20 cursor-pointer shadow-md"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs flex items-center justify-center transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 z-20 cursor-pointer shadow-md"
                aria-label="Slide siguiente"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Slide Indicator Dots */}
          {slides.length > 1 && (
            <div className="absolute bottom-4 right-6 sm:right-12 z-20 flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentIndex ? 'w-7 bg-white shadow-sm' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Ir al slide ${i + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
