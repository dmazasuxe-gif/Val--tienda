import React from 'react';
import { FilterState, ProductColor, StoreSettings } from '../types';
import { X, RotateCcw, Check, CheckSquare, Square, SlidersHorizontal } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableBrands: string[];
  availableSizes: string[];
  availableColors: ProductColor[];
  settings: StoreSettings;
  totalFilteredCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  availableBrands,
  availableSizes,
  availableColors,
  settings,
  totalFilteredCount
}) => {
  if (!isOpen) return null;

  const toggleSize = (size: string) => {
    const exists = filters.selectedSizes.includes(size);
    const updated = exists
      ? filters.selectedSizes.filter((s) => s !== size)
      : [...filters.selectedSizes, size];
    onUpdateFilters({ selectedSizes: updated });
  };

  const toggleColor = (colorName: string) => {
    const exists = filters.selectedColors.includes(colorName);
    const updated = exists
      ? filters.selectedColors.filter((c) => c !== colorName)
      : [...filters.selectedColors, colorName];
    onUpdateFilters({ selectedColors: updated });
  };

  const toggleBrand = (brand: string) => {
    const exists = filters.selectedBrands.includes(brand);
    const updated = exists
      ? filters.selectedBrands.filter((b) => b !== brand)
      : [...filters.selectedBrands, brand];
    onUpdateFilters({ selectedBrands: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-md animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white border-l border-sky-100 h-full flex flex-col shadow-2xl z-10 animate-slide-left text-slate-800">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-sky-100 flex items-center justify-between bg-sky-50/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-['Playfair_Display',serif]">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <span>Filtros de Búsqueda</span>
            </h2>
            <p className="text-xs text-slate-500">Refina por talla, color, marca y precio</p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Cerrar filtros"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 text-sm">
          
          {/* 1. Tallas Filter */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                📏 Talla / Medida
              </label>
              {filters.selectedSizes.length > 0 && (
                <span className="text-[11px] text-sky-700 font-bold">
                  {filters.selectedSizes.length} seleccionadas
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => {
                const isSelected = filters.selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`min-w-10 h-10 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/20 font-black scale-102'
                        : 'bg-white text-slate-700 border-sky-100 hover:border-sky-300 hover:bg-sky-50'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Colores Filter */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                🎨 Colores Disponibles
              </label>
              {filters.selectedColors.length > 0 && (
                <span className="text-[11px] text-sky-700 font-bold">
                  {filters.selectedColors.length} seleccionados
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableColors.map((color) => {
                const isSelected = filters.selectedColors.includes(color.name);
                return (
                  <button
                    key={color.name}
                    onClick={() => toggleColor(color.name)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-400'
                        : 'bg-white border-sky-100 text-slate-700 hover:bg-sky-50/50'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-xs flex items-center justify-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 text-white mix-blend-difference" />}
                    </span>
                    <span className="truncate">{color.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Marcas Filter */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="font-bold text-slate-700 text-xs uppercase tracking-wider">
                🏢 Marcas
              </label>
              {filters.selectedBrands.length > 0 && (
                <span className="text-[11px] text-sky-700 font-bold">
                  {filters.selectedBrands.length} seleccionadas
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableBrands.map((brand) => {
                const isSelected = filters.selectedBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-400 text-sky-800'
                        : 'bg-white border-sky-100 text-slate-700 hover:bg-sky-50/50'
                    }`}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-sky-600 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span className="truncate">{brand}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Rango de Precio */}
          <div>
            <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider mb-2.5">
              💰 Precio Máximo: {settings.currencySymbol} {filters.maxPrice}
            </label>
            <input
              type="range"
              min="50"
              max="600"
              step="10"
              value={filters.maxPrice}
              onChange={(e) => onUpdateFilters({ maxPrice: Number(e.target.value) })}
              className="w-full accent-sky-500 bg-slate-100 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>{settings.currencySymbol} 50</span>
              <span>{settings.currencySymbol} 300</span>
              <span>{settings.currencySymbol} 600+</span>
            </div>
          </div>

          {/* 5. Toggles: Stock & Ofertas */}
          <div className="space-y-3 pt-2 border-t border-sky-100">
            <label className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/40 border border-sky-100 cursor-pointer hover:bg-sky-50 transition-colors">
              <span className="text-xs font-semibold text-slate-700">Solo productos en stock</span>
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onUpdateFilters({ inStockOnly: e.target.checked })}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl bg-sky-50/40 border border-sky-100 cursor-pointer hover:bg-sky-50 transition-colors">
              <span className="text-xs font-semibold text-slate-700">Solo productos con descuento (Ofertas)</span>
              <input
                type="checkbox"
                checked={filters.onSaleOnly}
                onChange={(e) => onUpdateFilters({ onSaleOnly: e.target.checked })}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </label>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-sky-100 bg-sky-50/60 flex items-center gap-3">
          <button
            onClick={onResetFilters}
            className="flex items-center justify-center gap-1.5 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold transition-colors border border-sky-100 shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-2xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all hover:scale-101 cursor-pointer uppercase tracking-wider"
          >
            Ver {totalFilteredCount} Resultados
          </button>
        </div>

      </div>
    </div>
  );
};
