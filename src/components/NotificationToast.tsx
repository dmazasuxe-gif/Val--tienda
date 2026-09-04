import React from 'react';
import { OrderNotification, StoreSettings } from '../types';
import { Bell, ShoppingBag, X, ArrowRight } from 'lucide-react';

interface NotificationToastProps {
  notification: OrderNotification | null;
  onClose: () => void;
  onViewOrder?: (orderId: string) => void;
  settings: StoreSettings;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onViewOrder,
  settings
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-bounce-in">
      <div className="bg-slate-900/95 border border-amber-500/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-white">
        
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Bell className="w-5 h-5 animate-wiggle" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase text-amber-400">¡Nuevo Pedido!</span>
            <span className="text-[11px] text-slate-400">#{notification.orderNumber}</span>
          </div>
          <p className="text-xs text-slate-200 font-semibold truncate">
            {notification.customerName}
          </p>
          <p className="text-[11px] text-slate-400">
            {notification.itemCount} items • <strong className="text-white">{settings.currencySymbol} {notification.total.toFixed(2)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-1">
          {onViewOrder && (
            <button
              onClick={() => {
                onViewOrder(notification.orderId);
                onClose();
              }}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
            >
              Ver
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
