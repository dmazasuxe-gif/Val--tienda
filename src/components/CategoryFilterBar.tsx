import React from 'react';
import { CategoryType, GenderType } from '../types';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

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
  itemsPerPage?: number;
  onItemsPerPageChange?: (size: number) => void;
  startIndex?: number;
  endIndex?: number;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  currentCategory = 'all',
  selectedCategory,
  currentGender = 'all',
  selectedGender,
  onOpenFilterDrawer,
  onOpenFilters,
  activeFilterCount,
  activeFiltersCount,
  totalProductsCount = 0,
  sortBy = 'popular',
  onSortChange,
  itemsPerPage = 12,
  onItemsPerPageChange,
  startIndex = 0,
  endIndex = 0,
}) => {
  const cat = selectedCategory || currentCategory;
  const gen = selectedGender || currentGender;
  const filterCount = activeFilterCount ?? activeFiltersCount ?? 0;

  const handleOpenDrawer = () => {
    if (onOpenFilterDrawer) onOpenFilterDrawer();
    else if (onOpenFilters) onOpenFilters();
  };

  // Human readable title matching Yolu screenshot 5 ("PRODUCTOS \n HOMBRE")
  let categoryLabel = 'TODO EL CATÁLOGO';
  if (cat === 'ropa') {
    categoryLabel = gen === 'varones' ? 'ROPA HOMBRE' : gen === 'mujeres' ? 'ROPA MUJER' : 'ROPA Y ACCESORIOS';
  } else if (gen === 'varones') {
    categoryLabel = 'HOMBRE';
  } else if (gen === 'mujeres') {
    categoryLabel = 'MUJER';
  } else if (gen === 'ninos') {
    categoryLabel = 'NIÑOS';
  } else if (cat === 'calzado') {
    categoryLabel = 'CALZADO';
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Category Section Header matching Screenshot 5 */}
      <div className="text-left pt-2">
        <span className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">
          PRODUCTOS
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-black uppercase tracking-tight font-sans">
          {categoryLabel}
        </h1>
      </div>

      {/* Yolu Toolbar matching Screenshot 5 & 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-y border-zinc-200 text-xs text-zinc-600">
        
        {/* Left: Results summary */}
        <div className="font-normal text-zinc-500">
          Mostrando {totalProductsCount > 0 ? `${startIndex + 1}–${endIndex}` : '0'} de {totalProductsCount} resultados
        </div>

        {/* Right: Selectors matching Yolu dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Advanced Filter Drawer Trigger */}
          <button
            onClick={handleOpenDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              filterCount > 0 
                ? 'bg-black text-white border-black' 
                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-800'
            }`}
            id="btn-open-filter-drawer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros</span>
            {filterCount > 0 && (
              <span className="ml-0.5 bg-white text-black px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {filterCount}
              </span>
            )}
          </button>

          {/* Items per page selector */}
          {onItemsPerPageChange && (
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="appearance-none bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-full border border-zinc-200 outline-none cursor-pointer"
              >
                <option value={12}>12 por página</option>
                <option value={16}>16 por página</option>
                <option value={24}>24 por página</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Sort By Dropdown */}
          {onSortChange && (
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="appearance-none bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-full border border-zinc-200 outline-none cursor-pointer"
                id="select-sort-by"
              >
                <option value="popular">Orden predeterminado</option>
                <option value="newest">Más recientes</option>
                <option value="price_asc">Precio: de menor a mayor</option>
                <option value="price_desc">Precio: de mayor a menor</option>
                <option value="discount">Mayor descuento</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
