import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Product } from '../../types';
import { Package, ScanLine, AlertCircle, Loader2 } from 'lucide-react';

interface BarcodeScannerViewProps {
  products: Product[];
  onOpenProductForm: (barcode?: string) => void;
  onEditProduct: (product: Product) => void;
}

export const BarcodeScannerView: React.FC<BarcodeScannerViewProps> = ({
  products,
  onOpenProductForm,
  onEditProduct
}) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use refs to prevent multiple triggers and store scanner instance
  const isScanningRef = useRef(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    isScanningRef.current = true;
    scannerRef.current = new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        await scannerRef.current?.start(
          { facingMode: "environment" }, // Forzar cámara trasera (principal)
          { 
            fps: 10, 
            qrbox: { width: 250, height: 150 },
            aspectRatio: 1.0 // Mejor adaptabilidad en móviles
          },
          (decodedText) => {
            // Escaneo exitoso
            if (isScanningRef.current) {
              isScanningRef.current = false; // Bloquear escaneos adicionales
              setScanResult(decodedText);
              setIsProcessing(true);
              
              // Detener cámara y redirigir
              if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().then(() => {
                  const existingProduct = products.find(p => p.sku === decodedText || p.barcode === decodedText);
                  
                  // Pequeña pausa para que el usuario vea que escaneó con éxito
                  setTimeout(() => {
                    if (existingProduct) {
                      onEditProduct(existingProduct);
                    } else {
                      onOpenProductForm(decodedText);
                    }
                  }, 800);
                }).catch(console.error);
              }
            }
          },
          (errorMessage) => {
            // Se ignora: el escáner falla constantemente mientras no enfoca nada legible, es normal.
          }
        );
      } catch (err: any) {
        console.error("Error al iniciar escáner:", err);
        setError("No se pudo acceder a la cámara. Por favor, asegúrate de haber dado los permisos en tu navegador (celular) o revisa tu conexión.");
      }
    };

    // Pequeño delay para asegurar que el DOM <div id="reader"> existe
    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      clearTimeout(timer);
      isScanningRef.current = false;
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().then(() => {
          scannerRef.current?.clear();
        }).catch(console.error);
      }
    };
  }, [products, onEditProduct, onOpenProductForm]);

  return (
    <div className="p-4 sm:p-6 bg-white rounded-3xl border border-sky-100 shadow-xs max-w-2xl mx-auto space-y-6 text-center">
      <div>
        <h2 className="text-lg font-bold text-sky-900 flex items-center justify-center gap-2">
          <ScanLine className="w-5 h-5 text-sky-600" />
          <span>Lector Automático de Códigos</span>
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          La cámara trasera está activa. Enfoca un código de barras para detectarlo automáticamente. El sistema abrirá el producto si existe, o te permitirá registrarlo.
        </p>
      </div>

      {error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex flex-col items-center gap-2 text-sm">
          <AlertCircle className="w-6 h-6" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border-2 border-sky-100 shadow-inner bg-black relative w-full max-w-md mx-auto aspect-square sm:aspect-video flex items-center justify-center">
          
          <div id="reader" className="w-full h-full [&>video]:object-cover [&>video]:w-full [&>video]:h-full"></div>
          
          {isProcessing && scanResult && (
            <div className="absolute inset-0 bg-slate-900/95 flex flex-col items-center justify-center text-white p-6 space-y-4 animate-in fade-in zoom-in duration-300 z-10">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-300 font-medium">¡Código detectado!</p>
                <p className="text-2xl font-mono font-bold tracking-wider text-emerald-400">{scanResult}</p>
              </div>
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium mt-4">
                <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                <span>Abriendo información...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
