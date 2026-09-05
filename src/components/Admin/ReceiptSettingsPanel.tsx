import React, { useRef } from 'react';
import { Printer, Upload, Image as ImageIcon } from 'lucide-react';
import { StoreSettings } from '../../types';

interface ReceiptSettingsPanelProps {
  settings: StoreSettings;
  onChange: (updatedSettings: Partial<StoreSettings>) => void;
}

export const ReceiptSettingsPanel: React.FC<ReceiptSettingsPanelProps> = ({ settings, onChange }) => {
  const rs = settings.receiptSettings || { 
    ruc: '', 
    legalName: '', 
    address: '', 
    phone: '', 
    logoUrl: '', 
    footerMessage: '' 
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof typeof rs, value: string) => {
    onChange({ receiptSettings: { ...rs, [field]: value } });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size (max 1MB to avoid bloating firestore document)
    if (file.size > 1024 * 1024) {
      alert("El logo es demasiado pesado. Por favor, sube una imagen de menos de 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      updateField('logoUrl', base64String);
    };
    reader.onerror = () => {
      alert("Error al leer el archivo. Intenta de nuevo.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-sky-100 space-y-4 text-xs shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-bold uppercase tracking-wider text-slate-800 text-xs flex items-center gap-1.5">
          <Printer className="w-4 h-4 text-slate-600" />
          <span>12. Configuración de Boleta / Ticket de Impresora</span>
        </h3>
      </div>
      <p className="text-[11px] text-slate-500">
        Personaliza los datos que aparecerán al imprimir la boleta de venta en tu impresora ticketera. Sube tu logo directamente desde tu dispositivo (PC o Celular).
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Logo Upload */}
        <div className="sm:col-span-2 p-4 border border-dashed border-sky-300 bg-sky-50/50 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-white border border-sky-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
            {rs.logoUrl ? (
              <img src={rs.logoUrl} alt="Logo Boleta" className="max-w-full max-h-full object-contain grayscale" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                <span className="text-[10px]">Sin Logo</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h4 className="font-bold text-slate-700">Logo del Ticket</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500">
              Para un mejor resultado en impresoras térmicas, usa una imagen clara con buen contraste (preferible blanco y negro). Tamaño máximo: 1MB.
            </p>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-sky-300 text-sky-700 font-bold rounded-xl shadow-xs hover:bg-sky-50 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Subir Logo
            </button>
            {rs.logoUrl && (
              <button
                type="button"
                onClick={() => updateField('logoUrl', '')}
                className="mt-2 ml-2 inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 font-bold hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                Quitar
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">RUC de la Empresa</label>
          <input
            type="text"
            value={rs.ruc}
            onChange={(e) => updateField('ruc', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-sky-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs"
            placeholder="Ej: 20123456789"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Razón Social o Nombre Legal</label>
          <input
            type="text"
            value={rs.legalName}
            onChange={(e) => updateField('legalName', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-sky-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs"
            placeholder="Ej: AURA MODA & CALZADO S.A.C."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-slate-700 font-semibold mb-1.5">Dirección de la Tienda (Para el Ticket)</label>
          <input
            type="text"
            value={rs.address}
            onChange={(e) => updateField('address', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-sky-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs"
            placeholder="Ej: Av. Principal 123, Ciudad, País"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1.5">Teléfono (Para el Ticket)</label>
          <input
            type="text"
            value={rs.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-sky-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:border-sky-500 shadow-2xs"
            placeholder="Ej: +51 987 654 321"
          />
        </div>
        
        <div className="hidden sm:block">
           {/* Empty div for layout alignment */}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-slate-700 font-semibold mb-1.5">Mensaje de Agradecimiento o Eslogan (Pie de página)</label>
          <textarea
            value={rs.footerMessage}
            onChange={(e) => updateField('footerMessage', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors resize-y min-h-[80px]"
            placeholder="Ej: ¡Gracias por tu compra! Vuelve pronto."
          />
        </div>
      </div>
    </div>
  );
};
