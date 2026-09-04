import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCheck } from 'lucide-react';
import { StoreSettings } from '../types';
import { getGeneralSupportWhatsAppUrl } from '../utils/whatsapp';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const handleStartChat = (presetText?: string) => {
    const text = presetText || customMsg;
    const url = getGeneralSupportWhatsAppUrl(settings, text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-3.5 sm:p-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
          title="Chatear con Asesor por WhatsApp"
          id="btn-floating-whatsapp"
        >
          {/* Radar Ping Animation */}
          <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping" />
          
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-emerald-900 relative z-10" />

          {/* Tooltip on hover */}
          <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            💬 ¿Tienes dudas? ¡Escríbenos por WhatsApp!
          </span>
        </button>
      )}

      {/* Floating Interactive Chat Card */}
      {isOpen && (
        <div className="w-[320px] sm:w-[350px] bg-slate-950/90 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
          
          {/* Card Header */}
          <div className="bg-emerald-600/30 backdrop-blur-md border-b border-emerald-500/20 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full bg-black/50 border-2 border-emerald-400 overflow-hidden shrink-0 shadow-lg">
                <img
                  src={settings.logoUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80"}
                  alt={settings.storeName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-slate-950 rounded-full" />
              </div>

              <div>
                <h4 className="font-extrabold text-sm leading-tight text-white font-['Playfair_Display',serif]">
                  {settings.whatsappAdvisorName || 'Asesor de Ventas'}
                </h4>
                <p className="text-[11px] text-green-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>En línea ahora</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body Simulation */}
          <div className="p-4 bg-white/5 backdrop-blur-xl space-y-3">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none text-xs text-white/90 leading-relaxed shadow-sm">
              <p>
                👋 ¡Hola! Bienvenido/a a <strong>{settings.storeName}</strong>.
              </p>
              <p className="mt-1 text-white/70">
                ¿En qué podemos asesorarte hoy? Te responderemos de inmediato en WhatsApp.
              </p>
              <div className="flex justify-end mt-1 text-[10px] text-white/40">
                <CheckCheck className="w-3 h-3 text-green-400" />
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">Preguntas Frecuentes:</p>
              <div className="flex flex-col gap-1.5">
                {[
                  '📏 ¿Cómo elijo mi talla correcta?',
                  '🚚 ¿Cuánto tarda el envío a mi ciudad?',
                  '💳 ¿Qué métodos de pago aceptan?',
                  '🛍️ Quisiera consultar el stock de un modelo'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleStartChat(prompt)}
                    className="text-left text-xs bg-white/5 hover:bg-white/10 text-white/80 hover:text-white p-2.5 rounded-xl border border-white/10 transition-colors truncate cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="pt-2">
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-xl p-1.5 backdrop-blur-md">
                <input
                  type="text"
                  placeholder="Escribe tu consulta aquí..."
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleStartChat();
                  }}
                  className="flex-1 bg-transparent text-xs text-white placeholder-white/40 px-2 focus:outline-none"
                />
                <button
                  onClick={() => handleStartChat()}
                  className="p-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-white/5 p-2.5 text-center text-[10px] text-white/40 border-t border-white/10">
            Respuesta promedio: Menos de 5 minutos
          </div>

        </div>
      )}
    </div>
  );
};
