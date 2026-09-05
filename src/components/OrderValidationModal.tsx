import React, { useState, useEffect } from 'react';
import { Order, StoreSettings } from '../types';
import { X, CheckCircle2, ShieldCheck, User, Package, Calendar } from 'lucide-react';
import { formatPaymentMethod, formatStatus } from '../utils/whatsapp';

interface OrderValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  receiptOrderCode?: string;
  settings: StoreSettings;
}

export const OrderValidationModal: React.FC<OrderValidationModalProps> = ({
  isOpen,
  onClose,
  orders,
  receiptOrderCode,
  settings
}) => {
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && receiptOrderCode) {
      const order = orders.find(
        (o) => o.orderNumber.toLowerCase() === receiptOrderCode.toLowerCase().trim()
      );
      if (order) {
        setActiveOrder(order);
        setError('');
      } else {
        setActiveOrder(null);
        setError('No se encontró el pedido o el código es incorrecto.');
      }
    }
  }, [isOpen, receiptOrderCode, orders]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-bold text-base sm:text-lg">Validación de Boleta</h2>
              <p className="text-[11px] text-slate-300">
                {settings.storeName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto bg-slate-50 flex-1">
          {error ? (
            <div className="text-center p-8 space-y-3">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <X className="w-8 h-8 text-rose-500" />
              </div>
              <p className="text-rose-600 font-bold">{error}</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          ) : activeOrder ? (
            <div className="space-y-5">
              
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Pedido Verificado
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  {activeOrder.orderNumber}
                </h3>
                <p className="text-slate-500 text-xs flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(activeOrder.createdAt).toLocaleString('es-PE', {
                    dateStyle: 'medium', timeStyle: 'short'
                  })}
                </p>
              </div>

              {/* Customer Info */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-sky-500" />
                  Datos del Cliente
                </h4>
                <div className="space-y-1.5 text-sm text-slate-700">
                  <p><span className="font-semibold text-slate-900">Nombre:</span> {activeOrder.customerName}</p>
                  <p><span className="font-semibold text-slate-900">Teléfono:</span> {activeOrder.customerPhone}</p>
                  <p><span className="font-semibold text-slate-900">Dirección:</span> {activeOrder.shippingAddress}, {activeOrder.district}, {activeOrder.city}</p>
                  <p><span className="font-semibold text-slate-900">Método de Pago:</span> {formatPaymentMethod(activeOrder.paymentMethod)}</p>
                  <p><span className="font-semibold text-slate-900">Estado:</span> {formatStatus(activeOrder.status)}</p>
                </div>
              </div>

              {/* Products */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Package className="w-4 h-4 text-sky-500" />
                  Productos Comprados
                </h4>
                
                <div className="space-y-3 pt-1">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img 
                          src={item.product.images[0] || 'https://via.placeholder.com/150'} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-slate-900 text-sm truncate leading-tight">
                          {item.product.name}
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Talla: <span className="font-semibold text-slate-700">{item.selectedSize}</span> | 
                          Color: <span className="font-semibold text-slate-700">{item.selectedColor.name}</span>
                        </p>
                        <p className="text-xs font-bold text-sky-600 mt-0.5">
                          Cant: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
             <div className="flex justify-center p-8">
               <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
