import React, { useState, useEffect } from 'react';
import { 
  Order, 
  OrderStatus, 
  StoreSettings 
} from '../types';
import { 
  Search, 
  X, 
  CheckCircle2, 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  User, 
  MessageCircle, 
  Copy, 
  Check, 
  Building2, 
  Home, 
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { 
  getCustomerTrackingWhatsAppUrl,
  getDriverWhatsAppUrl,
  formatPaymentMethod, 
  formatStatus 
} from '../utils/whatsapp';
import { saveLastTrackedCode } from '../utils/storage';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderCode?: string;
  settings: StoreSettings;
}

const TRACKING_STEPS = [
  {
    id: 'almacen',
    title: 'En Almacén',
    subtitle: 'Pedido Confirmado',
    desc: 'Orden registrada en el almacén central con reserva de prendas y calzado.',
    statusKey: 'pendiente'
  },
  {
    id: 'preparacion',
    title: 'En Preparación',
    subtitle: 'Empaque & Calidad',
    desc: 'Inspección de tallas, sellado hermético y empaque protector.',
    statusKey: 'en_preparacion'
  },
  {
    id: 'camino',
    title: 'En Camino',
    subtitle: 'Furgón en Ruta',
    desc: 'Paquete en la unidad de transporte express rumbo a tu dirección.',
    statusKey: 'enviado'
  },
  {
    id: 'entregado',
    title: 'Entregado',
    subtitle: 'Recepción Conforme',
    desc: 'Paquete entregado al cliente a total conformidad.',
    statusKey: 'entregado'
  }
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderCode,
  settings
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderCode || '');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [notFoundError, setNotFoundError] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync when modal opens or initialOrderCode changes
  useEffect(() => {
    if (initialOrderCode) {
      setSearchInput(initialOrderCode);
      const found = orders.find(
        (o) => o.orderNumber.toLowerCase() === initialOrderCode.toLowerCase().trim()
      );
      if (found) {
        setActiveOrder(found);
        setNotFoundError(false);
      } else {
        setActiveOrder(null);
      }
    } else if (orders.length > 0 && !activeOrder) {
      // Default to the newest order if available
      setActiveOrder(orders[0]);
      setSearchInput(orders[0].orderNumber);
    }
  }, [initialOrderCode, isOpen, orders]);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchInput.trim().toLowerCase();
    if (!query) return;

    const found = orders.find(
      (o) =>
        o.orderNumber.toLowerCase() === query ||
        o.orderNumber.toLowerCase().replace('-', '') === query.replace('-', '') ||
        o.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        o.customerName.toLowerCase().includes(query)
    );

    if (found) {
      setActiveOrder(found);
      setNotFoundError(false);
      saveLastTrackedCode(found.orderNumber);
    } else {
      setActiveOrder(null);
      setNotFoundError(true);
    }
  };

  const handleSelectSuggested = (order: Order) => {
    setActiveOrder(order);
    setSearchInput(order.orderNumber);
    setNotFoundError(false);
    saveLastTrackedCode(order.orderNumber);
  };

  const copyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Status to step index helper (0: Almacén, 1: Preparación, 2: Camino, 3: Entregado)
  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pendiente': return 0;
      case 'en_preparacion': return 1;
      case 'enviado': return 2;
      case 'entregado': return 3;
      case 'cancelado': return -1;
      default: return 0;
    }
  };

  // Helper timeline steps calculation
  const getTimelineSteps = (status: OrderStatus, createdAt: string, updatedAt: string) => {
    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updatedAt);

    const formatTime = (d: Date, hoursOffset = 0) => {
      const target = new Date(d.getTime() + hoursOffset * 3600000);
      return target.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const isStep1Done = true;
    const isStep2Done = status === 'en_preparacion' || status === 'enviado' || status === 'entregado';
    const isStep3Done = status === 'enviado' || status === 'entregado';
    const isStep4Done = status === 'entregado';

    return [
      {
        step: 1,
        title: 'Orden Confirmada & en Almacén',
        desc: 'Pedido verificado en el sistema central. Stock de prendas y calzado apartado de forma segura.',
        location: `${settings.storeName} • Hub de Distribución Central`,
        time: formatTime(createdDate),
        completed: isStep1Done,
        active: status === 'pendiente',
        icon: Clock
      },
      {
        step: 2,
        title: 'Inspección de Calidad & Embalaje',
        desc: 'Prendas y calzado inspeccionados minuciosamente, enfundados con precinto de seguridad.',
        location: 'Área de Clasificación & Empaque',
        time: isStep2Done ? formatTime(createdDate, 1.2) : 'En espera de sellado',
        completed: isStep2Done,
        active: status === 'en_preparacion',
        icon: Package
      },
      {
        step: 3,
        title: 'En Camino / Furgón en Ruta',
        desc: 'Paquete en la unidad de transporte express en trayecto directo hacia tu domicilio.',
        location: `En ruta hacia ${activeOrder?.city || 'destino'}`,
        time: isStep3Done ? formatTime(updatedDate) : 'Esperando salida de almacén',
        completed: isStep3Done,
        active: status === 'enviado',
        icon: Truck
      },
      {
        step: 4,
        title: 'Entrega en Destino Concluida',
        desc: 'Recepción confirmada con el cliente a plena satisfacción con el código de seguridad.',
        location: `${activeOrder?.shippingAddress || 'Dirección del cliente'}, ${activeOrder?.city || ''}`,
        time: isStep4Done ? formatTime(updatedDate) : 'Estimado al arribo del furgón',
        completed: isStep4Done,
        active: status === 'entregado',
        icon: Home
      }
    ];
  };

  const currentStep = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80 flex flex-col max-h-[92vh] overflow-hidden my-auto z-10 animate-scale-in text-slate-100">
        
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-slate-800 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/25 shrink-0 border border-sky-400/30">
              <Truck className="w-5 h-5 text-sky-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-lg font-black text-white tracking-tight truncate font-['Playfair_Display',serif]">
                  Rastreo de Pedido en Vivo
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-950/80 text-sky-300 border border-sky-500/30 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Despacho Express</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate mt-0.5">
                Consulta el estado de tu compra desde el almacén hasta tu domicilio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/80 transition-colors shrink-0 cursor-pointer ml-2"
            aria-label="Cerrar rastreador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area - 100% Overflow Protected for Mobile & PC */}
        <div className="overflow-y-auto overflow-x-hidden p-3 sm:p-5 flex-1 space-y-4 sm:space-y-5 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 w-full min-w-0">
          
          {/* Search Bar for Tracking Code */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-inner w-full min-w-0">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Código de Pedido (ej. AUR-8943) o Teléfono de compra"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (notFoundError) setNotFoundError(false);
                  }}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all uppercase font-semibold shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-sky-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-101 active:scale-98 shrink-0 border border-sky-400/20"
              >
                <Search className="w-4 h-4" />
                <span>Rastrear</span>
              </button>
            </form>

            {/* Quick Suggestions / Recent Orders Pills */}
            {orders.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 sm:gap-2 overflow-x-auto text-[11px] pb-1 scrollbar-none">
                <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1 text-[10px] sm:text-[11px]">
                  <Sparkles className="w-3 h-3 text-sky-400" />
                  <span>Recientes:</span>
                </span>
                {orders.slice(0, 4).map((ord) => {
                  const isSelected = activeOrder?.id === ord.id;
                  return (
                    <button
                      key={ord.id}
                      type="button"
                      onClick={() => handleSelectSuggested(ord)}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg border text-[10px] sm:text-[11px] font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-sky-500 text-white border-sky-400 shadow-sm shadow-sky-500/40'
                          : 'bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="font-mono">#{ord.orderNumber}</span>
                      <span className={`text-[9px] px-1 py-0.5 rounded font-semibold ${
                        ord.status === 'entregado' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        ord.status === 'enviado' ? 'bg-sky-950 text-sky-300 border border-sky-800' :
                        ord.status === 'en_preparacion' ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {formatStatus(ord.status)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Not Found Error State */}
          {notFoundError && (
            <div className="p-4 sm:p-5 rounded-2xl bg-red-950/40 border border-red-800/80 text-center space-y-3 animate-fade-in w-full min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-900/50 text-red-400 flex items-center justify-center mx-auto border border-red-700/60">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-red-200">No encontramos ningún pedido con ese código</h3>
                <p className="text-[11px] sm:text-xs text-red-400/90 mt-1 max-w-md mx-auto leading-relaxed">
                  Verifica que el código coincida con el de tu recibo o busca usando tu número de teléfono registrado.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {orders.length > 0 && (
                  <button
                    onClick={() => handleSelectSuggested(orders[0])}
                    className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-600 cursor-pointer shadow-xs"
                  >
                    Ver mi último pedido #{orders[0].orderNumber}
                  </button>
                )}
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, quisiera consultar sobre el estado de mi pedido por favor.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-950/60 hover:bg-emerald-900/70 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-700/80 flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Consultar por WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Active Order Details */}
          {activeOrder && (
            <div className="space-y-4 sm:space-y-5 w-full min-w-0">
              
              {/* Top Banner Guide Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-md w-full min-w-0 overflow-hidden">
                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0 flex-1 w-full">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-sky-500/30 text-sky-400 shadow-inner shrink-0 mt-0.5 sm:mt-0">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 shrink-0">Guía de Despacho:</span>
                      <button
                        onClick={() => copyTrackingCode(activeOrder.orderNumber)}
                        className="inline-flex items-center gap-1 text-xs font-mono font-black text-sky-300 hover:text-sky-100 bg-slate-900 px-2 py-0.5 rounded-md border border-sky-500/40 cursor-pointer shadow-xs transition-colors shrink-0"
                        title="Copiar código de rastreo"
                      >
                        <span>#{activeOrder.orderNumber}</span>
                        {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                      </button>
                    </div>
                    
                    {/* Destination Address - Strictly Contained with zero overflow */}
                    <div className="mt-1 flex items-start gap-1.5 min-w-0 w-full">
                      <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="text-xs sm:text-sm font-medium text-slate-200 leading-snug break-words">
                          <span className="text-slate-400 font-normal">Destino: </span>
                          <strong className="text-sky-300 font-bold">{activeOrder.city}</strong>
                          <span className="text-slate-500 mx-1">•</span>
                          <span className="break-words text-white">{activeOrder.shippingAddress}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="shrink-0 self-start sm:self-center mt-1 sm:mt-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold tracking-wide border shadow-md ${
                    activeOrder.status === 'entregado'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/60 shadow-emerald-950/50'
                      : activeOrder.status === 'enviado'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-500/60 shadow-sky-950/50'
                      : activeOrder.status === 'en_preparacion'
                      ? 'bg-blue-950/80 text-blue-300 border-blue-500/60 shadow-blue-950/50'
                      : 'bg-amber-950/80 text-amber-300 border-amber-500/60 shadow-amber-950/50'
                  }`}>
                    {activeOrder.status === 'entregado' && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />}
                    {activeOrder.status === 'enviado' && <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 animate-pulse" />}
                    {activeOrder.status === 'en_preparacion' && <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />}
                    {activeOrder.status === 'pendiente' && <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />}
                    <span>{formatStatus(activeOrder.status).toUpperCase()}</span>
                  </span>
                </div>
              </div>

              {/* -------------------------------------------------------------------------- */}
              {/* LÍNEA DE RASTREO CON CARRITO FURGÓN Y PUNTOS                               */}
              {/* -------------------------------------------------------------------------- */}
              <div className="bg-slate-950 border border-slate-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl w-full min-w-0 overflow-hidden">
                
                {/* Status Bar inside the Track Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-6 border-b border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                      <Truck className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                        Ruta del Pedido en Tiempo Real
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Ubicación actual del furgón de reparto
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-sky-300">
                    <span className={`w-2 h-2 rounded-full ${
                      activeOrder.status === 'entregado' ? 'bg-emerald-400' :
                      activeOrder.status === 'enviado' ? 'bg-sky-400 animate-ping' :
                      activeOrder.status === 'cancelado' ? 'bg-red-400' : 'bg-amber-400'
                    }`} />
                    <span>{formatStatus(activeOrder.status)}</span>
                  </div>
                </div>

                {/* THE PROGRESS TRACK WITH POINTS & MOVING COURIER VAN */}
                <div className="relative px-1 sm:px-4 pt-8 pb-3 w-full min-w-0">
                  
                  {/* Background Track Line (Connecting column centers: 12.5% to 87.5%) */}
                  <div className="absolute top-[48px] sm:top-[52px] left-[12.5%] right-[12.5%] h-1.5 sm:h-2 bg-slate-800 rounded-full pointer-events-none" />

                  {/* Active Progress Fill Line */}
                  <div 
                    className="absolute top-[48px] sm:top-[52px] left-[12.5%] h-1.5 sm:h-2 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-500 rounded-full transition-all duration-700 pointer-events-none shadow-sm shadow-sky-500/30"
                    style={{
                      width: activeOrder.status === 'cancelado' 
                        ? '0%' 
                        : `${(Math.max(0, currentStep) / 3) * 75}%`
                    }}
                  />

                  {/* 4 Points Grid */}
                  <div className="relative grid grid-cols-4 gap-1 sm:gap-2 w-full">
                    {TRACKING_STEPS.map((step, idx) => {
                      const isCompleted = idx < currentStep || activeOrder.status === 'entregado';
                      const isCurrent = idx === currentStep && activeOrder.status !== 'entregado';
                      const isPending = idx > currentStep;

                      return (
                        <div key={step.id} className="flex flex-col items-center text-center relative group min-w-0">
                          
                          {/* Courier Van Indicator Floating Over Active Point */}
                          {(isCurrent || (idx === 3 && activeOrder.status === 'entregado')) && (
                            <div className="absolute -top-8 sm:-top-9 z-20 flex flex-col items-center animate-bounce pointer-events-none">
                              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-[9px] sm:text-[10px] font-black shadow-lg shadow-sky-500/40 border border-sky-300/40 whitespace-nowrap">
                                <Truck className="w-3 h-3 shrink-0" />
                                <span className="hidden xs:inline">Furgón</span>
                              </div>
                              <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[4px] border-t-blue-600" />
                            </div>
                          )}

                          {/* Point Node Circle */}
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white ring-3 sm:ring-4 ring-slate-950 shadow-md shadow-emerald-500/30'
                              : isCurrent
                              ? 'bg-sky-500 text-white ring-3 sm:ring-4 ring-sky-500/30 shadow-lg shadow-sky-500/50 scale-105 sm:scale-110'
                              : 'bg-slate-800 text-slate-500 ring-3 sm:ring-4 ring-slate-950 border border-slate-700'
                          }`}>
                            {isCompleted ? (
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                            ) : isCurrent ? (
                              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              <span className="text-[11px] sm:text-xs font-bold font-mono">{idx + 1}</span>
                            )}
                          </div>

                          {/* Point Text Labels */}
                          <div className="mt-2.5 space-y-0.5 w-full px-0.5">
                            <p className={`text-[10px] xs:text-[11px] sm:text-xs font-bold leading-tight break-words ${
                              isCurrent 
                                ? 'text-sky-300 font-extrabold' 
                                : isCompleted 
                                ? 'text-white' 
                                : 'text-slate-500'
                            }`}>
                              {step.title}
                            </p>
                            <p className="hidden sm:block text-[10px] text-slate-400 leading-tight">
                              {step.subtitle}
                            </p>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Status Explanation Banner */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300 text-[11px] sm:text-xs min-w-0 flex-1">
                    <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">
                      {activeOrder.status === 'pendiente' && `El furgón está listo en el Almacén Central de ${settings.storeName}.`}
                      {activeOrder.status === 'en_preparacion' && 'El pedido está en embalaje e inspección de calidad.'}
                      {activeOrder.status === 'enviado' && `Furgón en camino hacia ${activeOrder.city}.`}
                      {activeOrder.status === 'entregado' && `¡Pedido entregado con éxito en ${activeOrder.shippingAddress}!`}
                      {activeOrder.status === 'cancelado' && 'El pedido se encuentra cancelado.'}
                    </span>
                  </div>

                  <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 shrink-0">
                    Actualizado: {new Date(activeOrder.updatedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

              </div>

              {/* -------------------------------------------------------------------------- */}
              {/* DATOS DEL CHOFER / REPARTIDOR ASIGNADO (GESTIÓN DIRECTA VÍA WHATSAPP)      */}
              {/* -------------------------------------------------------------------------- */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-md w-full min-w-0">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="relative shrink-0">
                    {settings.driverPhoto ? (
                      <img
                        src={settings.driverPhoto}
                        alt={settings.driverName || 'Chofer'}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-2 border-sky-400/60 shadow-md bg-slate-800"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-slate-800 border-2 border-sky-400/50 flex items-center justify-center text-white font-black text-sm sm:text-base shadow-md">
                        {settings.driverName ? settings.driverName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'CM'}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
                      ✓
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm sm:text-base text-white">
                        {settings.driverName || 'Carlos Méndez R.'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] sm:text-[11px] font-bold">
                        ★ {settings.driverRole || 'Repartidor Elite Autorizado'}
                      </span>
                      {settings.driverVehicle && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                          {settings.driverVehicle}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-snug">
                      Conductor asignado al despacho de tu pedido • Coordinación directa y entrega segura
                    </p>
                  </div>
                </div>

                <a
                  href={getDriverWhatsAppUrl(settings, activeOrder)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border border-emerald-400/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/40 cursor-pointer shrink-0 hover:scale-102"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Contactar Chofer</span>
                </a>
              </div>

              {/* -------------------------------------------------------------------------- */}
              {/* TIMELINE STEPS (BITÁCORA DE TRAZABILIDAD) - 100% RESPONSIVE EN MÓVILES    */}
              {/* -------------------------------------------------------------------------- */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-sm space-y-3.5 w-full min-w-0 overflow-hidden">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-['Playfair_Display',serif]">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Bitácora de Trazabilidad y Puntos de Control</span>
                </h4>

                <div className="space-y-3 w-full min-w-0">
                  {getTimelineSteps(activeOrder.status, activeOrder.createdAt, activeOrder.updatedAt).map((step, sIdx, sArr) => {
                    const isLast = sIdx === sArr.length - 1;
                    return (
                      <div key={step.step} className="flex items-start gap-2.5 sm:gap-3.5 w-full min-w-0">
                        {/* Timeline Node Column */}
                        <div className="flex flex-col items-center shrink-0 pt-0.5">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all shadow-md shrink-0 ${
                            step.completed
                              ? 'bg-emerald-600 text-white shadow-emerald-500/30 ring-2 ring-emerald-950'
                              : step.active
                              ? 'bg-sky-500 text-white shadow-sky-500/30 ring-2 ring-sky-950 animate-pulse'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}>
                            {step.completed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.step}
                          </div>
                          
                          {/* Vertical connector line */}
                          {!isLast && (
                            <div className="w-0.5 flex-1 min-h-[34px] bg-slate-800 my-1 rounded-full" />
                          )}
                        </div>

                        {/* Step Details Card - Strictly Contained with zero overflow */}
                        <div className="flex-1 min-w-0 bg-slate-950/90 p-3 sm:p-3.5 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors overflow-hidden">
                          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 mb-1">
                            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                              <h5 className={`text-xs sm:text-sm font-bold leading-tight break-words ${
                                step.completed ? 'text-white' : step.active ? 'text-sky-300' : 'text-slate-400'
                              }`}>
                                {step.title}
                              </h5>
                              {step.active && (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-sky-950 text-sky-300 border border-sky-600 shrink-0">
                                  EN PROGRESO
                                </span>
                              )}
                              {step.completed && (
                                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                                  COMPLETO
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono shrink-0">
                              {step.time}
                            </span>
                          </div>

                          <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed break-words">
                            {step.desc}
                          </p>

                          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 mt-1.5 font-mono min-w-0">
                            <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                            <span className="truncate">{step.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* -------------------------------------------------------------------------- */}
              {/* PACKAGE & RECIPIENT SUMMARY                                                */}
              {/* -------------------------------------------------------------------------- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full min-w-0">
                
                {/* Recipient Details */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5 text-xs shadow-sm w-full min-w-0 overflow-hidden">
                  <h5 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Datos del Destinatario</span>
                  </h5>
                  <div className="space-y-1.5 text-slate-300 text-[11px] sm:text-xs break-words">
                    <p><strong className="text-white">Nombre:</strong> {activeOrder.customerName}</p>
                    <p><strong className="text-white">Teléfono / WhatsApp:</strong> {activeOrder.customerPhone}</p>
                    {activeOrder.customerEmail && <p><strong className="text-white">Email:</strong> {activeOrder.customerEmail}</p>}
                    <p><strong className="text-white">Dirección de Entrega:</strong> {activeOrder.shippingAddress}</p>
                    <p><strong className="text-white">Ciudad / Destino:</strong> {activeOrder.city}</p>
                    {activeOrder.notes && <p><strong className="text-white">Referencia:</strong> {activeOrder.notes}</p>}
                  </div>
                </div>

                {/* Package & Payment Summary */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-2.5 text-xs shadow-sm w-full min-w-0 overflow-hidden">
                  <h5 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                    <Package className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span>Contenido del Paquete ({activeOrder.items.length} productos)</span>
                  </h5>
                  
                  <div className="max-h-36 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    {activeOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <img
                          src={it.product.images[0] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100'}
                          alt={it.product.name}
                          className="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-[11px] truncate">{it.product.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Talla: <strong className="text-sky-300">{it.selectedSize}</strong> | Color: <strong className="text-slate-200">{it.selectedColor.name}</strong> | Cant: <strong className="text-white">{it.quantity}x</strong>
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-white shrink-0 font-mono">
                          {settings.currencySymbol} {(it.product.price * it.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Total Liquidado:</span>
                    <span className="text-sky-400 font-black text-sm font-mono">
                      {settings.currencySymbol} {activeOrder.total.toFixed(2)} ({formatPaymentMethod(activeOrder.paymentMethod)})
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
          <p className="text-[11px] text-slate-400 text-center sm:text-left flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Despacho oficial certificado por {settings.storeName}. Envíos 100% garantizados.</span>
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {activeOrder && (
              <a
                href={getCustomerTrackingWhatsAppUrl(settings, activeOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all hover:scale-101"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <span>Hablar con Soporte</span>
              </a>
            )}

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 cursor-pointer transition-colors shadow-sm"
            >
              Cerrar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
