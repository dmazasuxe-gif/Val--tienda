import React, { useState } from 'react';
import { StoreSettings, RunwaySlide } from '../../types';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Image as ImageIcon, 
  Upload, 
  Link as LinkIcon, 
  Check, 
  RotateCcw, 
  Eye,
  Sliders
} from 'lucide-react';

interface RunwayManagerProps {
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
}

const PRESET_RUNWAY_SLIDES: RunwaySlide[] = [
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

export const RunwayManager: React.FC<RunwayManagerProps> = ({
  settings,
  onSaveSettings
}) => {
  const slides: RunwaySlide[] = (settings.runwaySlides && settings.runwaySlides.length > 0)
    ? settings.runwaySlides
    : PRESET_RUNWAY_SLIDES;

  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [badge, setBadge] = useState('PASARELA 2026');
  const [linkCategory, setLinkCategory] = useState<'all' | 'calzado' | 'ropa'>('all');
  const [linkGender, setLinkGender] = useState<'all' | 'varones' | 'mujeres' | 'ninos'>('all');
  const [inputType, setInputType] = useState<'url' | 'upload'>('url');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewSlide, setPreviewSlide] = useState<RunwaySlide | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const newSlide: RunwaySlide = {
      id: `runway-${Date.now()}`,
      imageUrl: imageUrl.trim(),
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      badge: badge.trim() || undefined,
      linkCategory: linkCategory !== 'all' ? linkCategory : undefined,
      linkGender: linkGender !== 'all' ? linkGender : undefined
    };

    const updatedSlides = [...slides, newSlide];
    onSaveSettings({
      ...settings,
      runwaySlides: updatedSlides
    });

    // Reset form
    setImageUrl('');
    setTitle('');
    setSubtitle('');
    setBadge('PASARELA 2026');
    setLinkCategory('all');
    setLinkGender('all');
    notifySuccess();
  };

  const handleRemoveSlide = (slideId: string) => {
    if (slides.length <= 1) {
      alert('Debe mantenerse al menos una imagen en la pasarela.');
      return;
    }
    const updated = slides.filter((s) => s.id !== slideId);
    onSaveSettings({
      ...settings,
      runwaySlides: updated
    });
    notifySuccess();
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSlides = [...slides];
    const temp = newSlides[index - 1];
    newSlides[index - 1] = newSlides[index];
    newSlides[index] = temp;
    onSaveSettings({
      ...settings,
      runwaySlides: newSlides
    });
    notifySuccess();
  };

  const handleMoveDown = (index: number) => {
    if (index === slides.length - 1) return;
    const newSlides = [...slides];
    const temp = newSlides[index + 1];
    newSlides[index + 1] = newSlides[index];
    newSlides[index] = temp;
    onSaveSettings({
      ...settings,
      runwaySlides: newSlides
    });
    notifySuccess();
  };

  const handleRestoreDefaults = () => {
    if (confirm('¿Restablecer las imágenes oficiales de pasarela recomendadas?')) {
      onSaveSettings({
        ...settings,
        runwaySlides: PRESET_RUNWAY_SLIDES
      });
      notifySuccess();
    }
  };

  const notifySuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* Top Header Card */}
      <div className="p-5 rounded-3xl bg-white border border-sky-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
              Gestión de Pasarela de Imágenes (Runway Showcase)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Sube y administra las imágenes en alta resolución que desfilan en la pasarela principal de tu tienda con efecto de desvanecimiento suave y transiciones cinematográficas.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs animate-fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>¡Pasarela Actualizada!</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Restablecer imágenes de demostración de alta costura"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer Oficiales</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Add New Slide Form */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-sky-600" />
            <span>Agregar Nueva Imagen a la Pasarela</span>
          </h3>

          <form onSubmit={handleAddSlide} className="space-y-3.5 text-xs">
            
            {/* Input Type Selector (URL vs Upload) */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Método de Imagen *
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInputType('url')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    inputType === 'url'
                      ? 'bg-sky-50 border-sky-300 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Enlace Web (URL)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputType('upload')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                    inputType === 'upload'
                      ? 'bg-sky-50 border-sky-300 text-sky-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir de Mi Dispositivo</span>
                </button>
              </div>
            </div>

            {/* URL Input */}
            {inputType === 'url' ? (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  URL de Imagen en Alta Calidad *
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-sky-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Recomendado: formato horizontal panorámico (16:9 o 21:9), mínimo 1200px de ancho.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Seleccionar Archivo de Imagen *
                </label>
                <label className="border-2 border-dashed border-sky-200 hover:border-sky-400 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 text-center cursor-pointer bg-sky-50/40 hover:bg-sky-50 transition-colors">
                  <Upload className="w-6 h-6 text-sky-600" />
                  <span className="font-bold text-sky-800">Haz clic para buscar en tu galería o computadora</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG o WEBP (máx. 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Live Mini Preview of Added Image */}
            {imageUrl && (
              <div className="relative rounded-2xl overflow-hidden border border-sky-200 bg-slate-950 aspect-video shadow-xs">
                <img
                  src={imageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-white text-[10px] font-bold">Vista Previa de la Fotografía</span>
                </div>
              </div>
            )}

            {/* Slide Title */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Título Editorial (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Colección Otoño - Invierno 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-sky-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs"
              />
            </div>

            {/* Slide Subtitle */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Descripción / Subtítulo (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Diseños exclusivos y confección en alta costura"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-sky-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs"
              />
            </div>

            {/* Badge & Link Settings */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Etiqueta / Badge
                </label>
                <input
                  type="text"
                  placeholder="PASARELA 2026"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-sky-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs uppercase text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Vincular a Categoría
                </label>
                <select
                  value={linkCategory}
                  onChange={(e) => setLinkCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-sky-200 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs text-[11px]"
                >
                  <option value="all">Todo el Catálogo</option>
                  <option value="calzado">Solo Calzado</option>
                  <option value="ropa">Solo Ropa</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!imageUrl.trim()}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white font-extrabold rounded-2xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all hover:scale-101 cursor-pointer uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar a la Pasarela</span>
            </button>
          </form>
        </div>

        {/* Right Column: Existing Slides List with Order & Actions */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-sky-600" />
              <span>Imágenes Actuales en la Pasarela ({slides.length})</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              Deslizan automáticamente con desvanecimiento elegante
            </span>
          </div>

          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-sky-50/40 border border-sky-100 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                {/* Thumbnail and Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-24 sm:w-28 h-16 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-sky-200 shadow-2xs">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title || `Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-black/60 text-white text-[9px] font-black">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    {slide.badge && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-extrabold text-[9px] uppercase tracking-wider mb-0.5">
                        {slide.badge}
                      </span>
                    )}
                    <h4 className="font-bold text-slate-900 text-xs truncate">
                      {slide.title || "Fotografía de Pasarela"}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate max-w-xs">
                      {slide.subtitle || slide.imageUrl}
                    </p>
                    {slide.linkCategory && slide.linkCategory !== 'all' && (
                      <span className="text-[10px] text-sky-600 font-semibold">
                        Vinculado a: {slide.linkCategory}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions: Reorder & Delete */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 disabled:opacity-30 border border-sky-200 shadow-2xs transition-colors cursor-pointer"
                    title="Mover arriba en el orden"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === slides.length - 1}
                    className="p-1.5 rounded-xl bg-white hover:bg-sky-50 text-slate-700 disabled:opacity-30 border border-sky-200 shadow-2xs transition-colors cursor-pointer"
                    title="Mover abajo en el orden"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewSlide(slide)}
                    className="p-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-600 border border-sky-200 shadow-2xs transition-colors cursor-pointer"
                    title="Ver en tamaño completo"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveSlide(slide.id)}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 shadow-2xs transition-colors cursor-pointer"
                    title="Eliminar de la pasarela"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Full Preview Modal */}
      {previewSlide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setPreviewSlide(null)}
        >
          <div 
            className="relative max-w-4xl w-full rounded-3xl overflow-hidden bg-slate-950 border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewSlide.imageUrl}
              alt={previewSlide.title || "Vista previa"}
              className="w-full max-h-[70vh] object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-sky-300">{previewSlide.badge}</p>
                <h3 className="text-base font-bold">{previewSlide.title}</h3>
                <p className="text-xs text-slate-300">{previewSlide.subtitle}</p>
              </div>
              <button
                onClick={() => setPreviewSlide(null)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
