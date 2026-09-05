import React from 'react';
import { StoreSettings, StoreBrand } from '../types';
import { DEFAULT_STORE_BRANDS } from '../data/initialData';

interface BrandsStripProps {
  settings?: StoreSettings;
  brands?: StoreBrand[];
  onSelectBrand?: (brand: string) => void;
}

export const BrandsStrip: React.FC<BrandsStripProps> = ({ 
  settings, 
  brands: propBrands, 
  onSelectBrand 
}) => {
  const allBrands: StoreBrand[] = propBrands || settings?.brands || DEFAULT_STORE_BRANDS;
  const activeBrands = allBrands.filter((b) => b.isActive !== false);

  if (activeBrands.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 border-y border-zinc-200 bg-white" id="section-brands-runway">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Carousel / Runway Strip */}
        <div className="flex items-center justify-between gap-6 sm:gap-10 md:gap-12 overflow-x-auto scrollbar-none py-2">
          {activeBrands.map((brand) => (
            <button
              key={brand.id || brand.name}
              onClick={() => onSelectBrand && onSelectBrand(brand.name)}
              className="flex items-center justify-center shrink-0 hover:scale-105 transition-all duration-300 cursor-pointer group px-2 py-1"
              title={`Ver colección y zapatillas de ${brand.name}`}
            >
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-8 sm:h-10 md:h-11 max-w-[100px] sm:max-w-[130px] md:max-w-[150px] object-contain filter grayscale contrast-125 opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-300 pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'inline-block';
                    }
                  }}
                />
              ) : null}

              {/* Text Fallback */}
              <span
                className={`${
                  brand.logoUrl ? 'hidden' : 'inline-block'
                } text-base sm:text-xl md:text-2xl font-black tracking-tighter text-zinc-800 group-hover:text-black font-sans uppercase select-none`}
              >
                {brand.label || brand.name}
              </span>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
