import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowUpRight
} from 'lucide-react';
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
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=80",
    title: "Alta Costura & Tendencia 2026",
    subtitle: "Prendas icónicas y calzado seleccionados para un estilo inconfundible",
    badge: "PASARELA EXCLUSIVA",
    linkCategory: "ropa",
    linkGender: "mujeres"
  },
  {
    id: "runway-2",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
    title: "Colección Calzado & Distinción",
    subtitle: "Cuero legítimo, ergonomía y diseño italiano a tus pies",
    badge: "ALTA GAMA",
    linkCategory: "calzado",
    linkGender: "varones"
  },
  {
    id: "runway-3",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80",
    title: "Elegancia Contemporánea",
    subtitle: "Siluetas fluidas y tonos sobrios para ocasiones memorables",
    badge: "NUEVA TEMPORADA",
    linkCategory: "ropa",
    linkGender: "varones"
  },
  {
    id: "runway-4",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop&q=80",
    title: "Vanguardia & Moda Streetwear Chic",
    subtitle: "La expresión moderna del lujo urbano para hombres y mujeres",
    badge: "TENDENCIA GLOBAL",
    linkCategory: "ropa",
    linkGender: "mujeres"
  }
];

export const Banner: React.FC<BannerProps> = ({ 
  settings, 
  onExploreCategory, 
  onShopNow 
}) => {
  const slides: RunwaySlide[] = (settings.runwaySlides && settings.runwaySlides.length > 0)
    ? settings.runwaySlides
    : DEFAULT_RUNWAY_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Safely bound index if slides change
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Infinite loop navigation (modulo wraps seamlessly from last to first)
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Infinite non-stop automated runway transition
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [slides.length, handleNext]);

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
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
    <div 
      className="relative mb-6 sm:mb-8 rounded-3xl overflow-hidden border border-sky-200/80 shadow-xl shadow-sky-900/10 bg-slate-950 group select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      id="runway-showcase"
    >
      {/* Viewport Frame with Cinematic Aspect Ratio */}
      <div className="relative w-full h-[280px] xs:h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden">
        
        {/* Slides Stack with Elegant Crossfade (Desvanecimiento Suave) */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                isActive 
                  ? 'opacity-100 scale-100 blur-0 z-10 pointer-events-auto' 
                  : 'opacity-0 scale-105 blur-[2px] z-0 pointer-events-none'
              }`}
            >
              {/* Background Runway Photograph with Cinematic Slow Zoom */}
              {/* Main Image with object-cover */}
              <img
                src={slide.imageUrl}
                alt={slide.title || `Pasarela ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover object-top sm:object-center transition-transform duration-[6000ms] ease-out ${ 
                  isActive ? 'scale-105' : 'scale-100' 
                }`}
                referrerPolicy="no-referrer"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Sophisticated Vignette & Atmospheric Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-black/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/40 pointer-events-none" />

              {/* Editorial Caption with Smooth Fade Transition */}
              <div className={`absolute bottom-0 left-0 right-0 p-5 xs:p-7 sm:p-10 pb-9 sm:pb-12 flex flex-col justify-end transition-all duration-1000 delay-200 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="max-w-2xl space-y-2 sm:space-y-3">
                  
                  {/* Chic Runway Badge */}
                  {slide.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sky-200 text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-md">
                      <Sparkles className="w-3 h-3 text-sky-300" />
                      <span>{slide.badge}</span>
                    </div>
                  )}

                  {/* Runway Title */}
                  {slide.title && (
                    <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl font-black text-white font-['Playfair_Display',serif] tracking-tight leading-tight drop-shadow-md">
                      {slide.title}
                    </h2>
                  )}

                  {/* Runway Subtitle */}
                  {slide.subtitle && (
                    <p className="text-xs sm:text-base text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow-xs line-clamp-2">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* Interactive Explore Tag Button */}
                  {slide.linkCategory && (
                    <div className="pt-1.5">
                      <button
                        onClick={() => handleSlideAction(slide)}
                        className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-900 font-bold text-xs uppercase tracking-wider shadow-lg transition-all hover:scale-103 active:scale-97 cursor-pointer"
                      >
                        <span>Explorar Colección</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-sky-600" />
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </div>
          );
        })}

        {/* Navigation Arrows with Glassmorphism */}
        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Imagen anterior de la pasarela"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Siguiente imagen de la pasarela"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Minimalist Runway Dot Indicators (Centered, Pure Luxury) */}
        {slides.length > 1 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir a la imagen ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 bg-sky-400 shadow-xs'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
