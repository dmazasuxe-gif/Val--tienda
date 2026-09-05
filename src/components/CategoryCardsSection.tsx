import React from 'react';
import { CategoryType, GenderType } from '../types';

interface CategoryCardsSectionProps {
  onSelectCategory: (category: CategoryType | 'all', gender: GenderType | 'all') => void;
}

const CATEGORY_CARDS = [
  {
    title: 'ROPA Y ACCESORIOS',
    category: 'ropa' as CategoryType,
    gender: 'all' as GenderType,
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    subtitle: 'Sudaderas, casacas y accesorios',
  },
  {
    title: 'HOMBRE',
    category: 'all' as CategoryType,
    gender: 'varones' as GenderType,
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80',
    subtitle: 'Zapatillas y estilo urbano',
  },
  {
    title: 'MUJER',
    category: 'all' as CategoryType,
    gender: 'mujeres' as GenderType,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    subtitle: 'Tendencias y calzado exclusivo',
  },
];

export const CategoryCardsSection: React.FC<CategoryCardsSectionProps> = ({
  onSelectCategory,
}) => {
  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase mb-8 sm:mb-10 text-center sm:text-left">
        CATEGORÍAS
      </h2>

      {/* 3 Tall Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {CATEGORY_CARDS.map((card) => (
          <div
            key={card.title}
            onClick={() => onSelectCategory(card.category, card.gender)}
            className="group cursor-pointer flex flex-col"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 shadow-sm">
              <img
                src={card.imageUrl}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
            </div>

            {/* Bottom Title with Indicator Line */}
            <div className="pt-4 text-center">
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-black uppercase group-hover:text-zinc-700 transition-colors">
                {card.title}
              </h3>
              <div className="mt-1.5 w-12 h-0.5 bg-black mx-auto rounded-full group-hover:w-20 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
