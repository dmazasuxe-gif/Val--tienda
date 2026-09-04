import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Product } from '../../types';
import { Package, ScanLine, XCircle } from 'lucide-react';

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

  useEffect(() => {
    // We create an instance of the scanner
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 150 } },
      false
    );

    const onScanSuccess = (decodedText: string) => {
      setScanResult(decodedText);
      // Optional: auto-stop on scan
      // scanner.clear();
    };

    scanner.render(onScanSuccess, (error) => {
      // Handle parse errors silently
    });

    // Cleanup when component unmounts
    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const handleAction = () => {
    if (!scanResult) return;
    
    // Find if a product has this barcode (we need to assume products have a barcode field)
    // First, let's search for an existing barcode on the product level
    const existingProduct = products.find(p => p.sku === scanResult || p.barcode === scanResult);
    
    if (existingProduct) {
      onEditProduct(existingProduct);
    } else {
      onOpenProductForm(scanResult);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-3xl border border-sky-100 shadow-xs max-w-2xl mx-auto space-y-6 text-center">
      <div>
        <h2 className="text-lg font-bold text-sky-900 flex items-center justify-center gap-2">
          <ScanLine className="w-5 h-5 text-sky-600" />
          <span>Lector de Códigos de Barras</span>
        </h2>
        <p className="text-xs text-slate-500 mt-2">
          Escanea un código de barras usando la cámara de tu celular o PC. Si el producto ya existe, podrás ver su información completa. Si no existe, podrás registrarlo rápidamente con este código.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden border-2 border-sky-100 shadow-inner bg-slate-50 relative">
        <div id="reader" className="w-full"></div>
      </div>

      {scanResult && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-3 animate-in fade-in">
          <p className="text-sm font-bold text-sky-800">
            Código detectado: <span className="font-mono bg-white px-2 py-0.5 rounded border border-sky-200">{scanResult}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button
              onClick={handleAction}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>Ver Producto / Registrar</span>
            </button>
            <button
              onClick={() => setScanResult(null)}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Escanear Otro</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
