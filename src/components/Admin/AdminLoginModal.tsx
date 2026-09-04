import React, { useState } from 'react';
import { ShieldCheck, KeyRound, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { StoreSettings } from '../../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  settings: StoreSettings;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  settings
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === settings.adminPin || pin.trim() === '1234') {
      onSuccess();
      setError('');
      setPin('');
    } else {
      setError('PIN o contraseña incorrecta. (PIN por defecto: 1234)');
    }
  };

  const handleQuickKey = (num: string) => {
    if (pin.length < 8) {
      setPin((prev) => prev + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white border border-sky-100 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 space-y-5 animate-scale-in text-slate-800">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mx-auto shadow-sm">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-['Playfair_Display',serif]">
            Acceso Administrativo
          </h2>
          <p className="text-xs text-slate-500">
            Panel protegido de <strong className="text-slate-800">{settings.storeName}</strong>
          </p>
        </div>

        {/* PIN Input Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <div className="flex items-center justify-center gap-2 bg-slate-50 p-3 rounded-2xl border border-sky-200 shadow-inner">
              <KeyRound className="w-4 h-4 text-sky-600 shrink-0" />
              <input
                type={showPin ? 'text' : 'password'}
                placeholder="Ingresa tu PIN"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                maxLength={8}
                autoFocus
                className="bg-transparent text-center text-lg tracking-widest font-black text-slate-900 focus:outline-none w-36"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-[11px] text-rose-600 text-center mt-2 flex items-center justify-center gap-1 font-semibold">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Quick Number Keypad for mobile convenience */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (key === 'C') setPin('');
                  else if (key === '⌫') handleBackspace();
                  else handleQuickKey(key);
                }}
                className="h-11 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-800 font-bold text-sm border border-slate-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              >
                {key}
              </button>
            ))}
          </div>

          {/* Login Action */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold rounded-xl text-sm shadow-md shadow-sky-500/25 transition-all hover:scale-101 active:scale-98 cursor-pointer uppercase tracking-wider"
          >
            Desbloquear Panel Admin
          </button>

          <p className="text-[11px] text-slate-400 text-center">
            🔐 PIN de seguridad predeterminado: <strong className="text-sky-700 font-bold">1234</strong>
          </p>
        </form>

      </div>
    </div>
  );
};
