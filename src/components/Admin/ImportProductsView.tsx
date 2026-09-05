import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle2, Play, Loader2, Image as ImageIcon } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Product } from '../../types';

export const ImportProductsView: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [logs, setLogs] = useState<{ type: 'info' | 'error' | 'success', message: string }[]>([]);

  const addLog = (type: 'info' | 'error' | 'success', message: string) => {
    setLogs(prev => [...prev, { type, message }]);
    setStatusMessage(message);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setLogs([]);
      setProgress(0);
      setStatusMessage('');
    }
  };

  const generateBarcode = (name: string, category: string) => {
    const prefix = category === 'calzado' ? 'CZ' : 'RP';
    const rand = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    const namePrefix = name.substring(0, 3).toUpperCase().padEnd(3, 'X');
    return `${prefix}-${namePrefix}-${rand}`;
  };

  const handleImport = async () => {
    if (selectedFiles.length === 0) {
      addLog('error', 'Por favor selecciona archivos primero.');
      return;
    }

    setIsProcessing(true);
    addLog('info', `Iniciando procesamiento de ${selectedFiles.length} archivos...`);

    const BATCH_SIZE = 5; // Process 5 files per chunk to manage memory & API limits
    const allProducts: Partial<Product>[] = [];

    try {
      // Step 1: Extract products using Gemini API (via our server to keep API key safe)
      for (let i = 0; i < selectedFiles.length; i += BATCH_SIZE) {
        const chunk = selectedFiles.slice(i, i + BATCH_SIZE);
        addLog('info', `Enviando lote ${Math.floor(i / BATCH_SIZE) + 1} a la IA para análisis...`);
        
        const formData = new FormData();
        chunk.forEach(file => {
          formData.append('files', file);
        });

        const response = await fetch('/api/extract-products', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error en la API: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.products && Array.isArray(data.products)) {
          allProducts.push(...data.products);
          addLog('success', `Lote ${Math.floor(i / BATCH_SIZE) + 1} procesado. Se extrajeron ${data.products.length} productos.`);
        }
        
        setProgress(Math.round(((i + chunk.length) / selectedFiles.length) * 50));
      }

      // Step 2: Upload products to Firestore using batching
      addLog('info', `Iniciando subida masiva a Firestore de ${allProducts.length} productos...`);
      const FIRESTORE_BATCH_SIZE = 500; // Firestore limit is 500 writes per batch
      
      let currentBatch = writeBatch(db);
      let operationCount = 0;
      let totalSaved = 0;

      for (let i = 0; i < allProducts.length; i++) {
        const prod = allProducts[i];
        
        const newProduct: Product = {
          id: doc(collection(db, 'products')).id,
          sku: `SKU-${Math.floor(Math.random() * 1000000)}`,
          barcode: generateBarcode(prod.name || 'Prod', prod.category || 'calzado'),
          name: prod.name || 'Producto sin nombre',
          description: prod.description || 'Descripción atractiva generada automáticamente.',
          category: (prod.category as any) || 'calzado',
          gender: (prod.gender as any) || 'unisex',
          brand: prod.brand || 'Aura',
          price: Number(prod.price) || 0,
          images: prod.images || ['https://via.placeholder.com/400'],
          sizes: prod.sizes || ['38', '39', '40'],
          colors: prod.colors || [{ name: 'Negro', hex: '#000000' }],
          stock: prod.stock || 10,
          lowStockThreshold: 3,
          createdAt: new Date().toISOString(),
          ...prod
        } as Product;

        const docRef = doc(db, 'products', newProduct.id);
        currentBatch.set(docRef, newProduct);
        operationCount++;
        totalSaved++;

        if (operationCount === FIRESTORE_BATCH_SIZE) {
          addLog('info', `Guardando lote en Firestore... (${totalSaved}/${allProducts.length})`);
          await currentBatch.commit();
          currentBatch = writeBatch(db);
          operationCount = 0;
        }

        setProgress(50 + Math.round((totalSaved / allProducts.length) * 50));
      }

      if (operationCount > 0) {
        await currentBatch.commit();
      }

      addLog('success', `¡Importación completada! ${totalSaved} productos registrados con éxito.`);
      setProgress(100);
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Import error:', error);
      addLog('error', `Error durante la importación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Importación Masiva (Catálogos e Imágenes)</h2>
        <p className="text-slate-500 mt-2 text-sm">
          Sube tus archivos (imágenes1, imágenes2, catalogo1) para que la IA extraiga los detalles, precios y genere descripciones y códigos de barras automáticamente.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <label className="border-2 border-dashed border-sky-300 hover:border-sky-400 bg-sky-50/50 rounded-xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors w-full mb-4">
          <Upload className="w-8 h-8 text-sky-600" />
          <div className="text-center">
            <span className="font-bold text-sky-800 block text-lg">Haz clic para seleccionar archivos</span>
            <span className="text-slate-500 text-sm">PDF o Múltiples Imágenes JPG/PNG</span>
          </div>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />
        </label>

        {selectedFiles.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="font-semibold text-slate-700 mb-2">{selectedFiles.length} archivos seleccionados</p>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {selectedFiles.map((file, i) => (
                <div key={i} className="flex items-center gap-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-600">
                  <ImageIcon className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleImport}
          disabled={selectedFiles.length === 0 || isProcessing}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Procesando... {progress}%
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Iniciar Importación e Inteligencia Artificial
            </>
          )}
        </button>

        {isProcessing && (
          <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
            <div 
              className="bg-sky-500 h-2 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {logs.length > 0 && (
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className={`mb-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-sky-300'}`}>
              <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> {log.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
