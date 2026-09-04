import React from 'react';
import { CategoryType, GenderType } from '../types';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CategoryFilterBarProps {
  currentCategory?: 'all' | CategoryType;
  selectedCategory?: 'all' | CategoryType;
  currentGender?: 'all' | GenderType;
  selectedGender?: 'all' | GenderType;
  onSelect?: (category: 'all' | CategoryType, gender: 'all' | GenderType) => void;
  onSelectCategory?: (category: 'all' | CategoryType) => void;
  onSelectGender?: (gender: 'all' | GenderType) => void;
  onOpenFilterDrawer?: () => void;
  onOpenFilters?: () => void;
  activeFilterCount?: number;
  activeFiltersCount?: number;
  totalProductsCount?: number;
  sortBy?: string;
  onSortChange?: (sort: 'popular' | 'price_asc' | 'price_desc' | 'newest' | 'discount') => void;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  currentCategory,
  selectedCategory,
  currentGender,
  selectedGender,
  onSelect,
  onSelectCategory,
  onSelectGender,
  onOpenFilterDrawer,
  onOpenFilters,
  activeFilterCount,
  activeFiltersCount,
  totalProductsCount = 0,
  sortBy = 'popular',
  onSortChange
}) => {
  const activeCategory = selectedCategory || currentCategory || 'all';
  const activeGender = selectedGender || currentGender || 'all';
  const filterCount = activeFilterCount ?? activeFiltersCount ?? 0;

  const handleCategorySelection = (cat: 'all' | CategoryType, gen: 'all' | GenderType) => {
    if (onSelect) onSelect(cat, gen);
    if (onSelectCategory) onSelectCategory(cat);
    if (onSelectGender) onSelectGender(gen);
  };

  const handleOpenDrawer = () => {
    if (onOpenFilterDrawer) onOpenFilterDrawer();
    else if (onOpenFilters) onOpenFilters();
  };

  const isSelected = (cat: 'all' | CategoryType, gen: 'all' | GenderType) => {
    return activeCategory === cat && activeGender === gen;
  };

  const navItems = [
    { label: '✨ Todo', cat: 'all' as const, gen: 'all' as const },
    { label: '👟 Calzado Varones', cat: 'calzado' as const, gen: 'varones' as const },
    { label: '👠 Calzado Mujeres', cat: 'calzado' as const, gen: 'mujeres' as const },
    { label: '🧒 Calzado Niños', cat: 'calzado' as const, gen: 'ninos' as const },
    { label: '👔 Ropa Varones', cat: 'ropa' as const, gen: 'varones' as const },
    { label: '👗 Ropa Mujeres', cat: 'ropa' as const, gen: 'mujeres' as const },
    { label: '👕 Ropa Niños', cat: 'ropa' as const, gen: 'ninos' as const },
  ];

  return (
    <div className="space-y-3 mb-6">
      {/* Scrollable Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {navItems.map((item) => {
          const active = isSelected(item.cat, item.gen);
          return (
            <button
              key={`${item.cat}-${item.gen}`}
              onClick={() => handleCategorySelection(item.cat, item.gen)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                active
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-102 font-extrabold'
                  : 'bg-white/80 text-slate-700 hover:bg-sky-50 hover:text-sky-800 border border-sky-100 shadow-xs'
              }`}
            >
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Count Summary Strip */}
      <div className="flex items-center justify-between gap-3 bg-white/80 backdrop-blur-xl p-3 rounded-2xl border border-sky-100 shadow-sm">
        
        {/* Left: Filter Trigger Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenDrawer}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-full text-xs font-semibold border border-sky-200 transition-all shadow-xs cursor-pointer"
            id="btn-open-filter-drawer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
            <span>Filtros Avanzados</span>
            {filterCount > 0 && (
              <span className="bg-sky-600 text-white px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {filterCount}
              </span>
            )}
          </button>

          <span className="text-xs text-slate-700 font-medium inline">
            <strong className="text-slate-950 font-bold">{totalProductsCount}</strong> productos encontrados
          </span>
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as any)}
            className="bg-white text-slate-700 text-xs rounded-full px-3 py-1.5 border border-sky-200 focus:outline-none focus:border-sky-500 font-medium cursor-pointer shadow-xs"
            id="select-sort-by"
          >
            <option value="popular">Más Populares</option>
            <option value="newest">Más Recientes</option>
            <option value="price_asc">Menor Precio</option>
            <option value="price_desc">Mayor Precio</option>
            <option value="discount">Mayor Descuento</option>
          </select>
        </div>
      </div>
    </div>
  );
};
