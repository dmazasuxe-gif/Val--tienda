import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Product, 
  CartItem, 
  StoreSettings, 
  Order, 
  CategoryType, 
  GenderType, 
  FilterState, 
  ProductColor, 
  OrderStatus,
  OrderNotification
} from './types';
import { 
  getStoredProducts, 
  saveStoredProducts,
  getStoredOrders, 
  saveStoredOrders,
  getStoredSettings, 
  saveStoredSettings,
  getStoredCart, 
  saveStoredCart,
  isAdminAuthenticated, 
  setAdminAuthenticated, 
  clearAdminAuthenticated,
  getStoredNotifications,
  saveStoredNotifications,
  getLastTrackedCode
} from './utils/storage';
import { playNotificationChime, sendPushNotification } from './utils/sound';
import { testFirebaseConnection } from './services/firebase';
import { 
  subscribeToProducts, 
  subscribeToOrders, 
  subscribeToStoreSettings,
  syncSaveProduct,
  syncDeleteProduct,
  syncReduceStock,
  syncCreateOrder,
  syncUpdateOrderStatus,
  syncSaveStoreSettings
} from './services/firestoreSync';

// Public Components
import { Header } from './components/Header';
import { Banner } from './components/Banner';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FilterDrawer } from './components/FilterDrawer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { NotificationToast } from './components/NotificationToast';
import { OrderTrackingModal } from './components/OrderTrackingModal';

// Admin Components
import { AdminLayout } from './components/Admin/AdminLayout';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { AdminPortalLogin } from './components/Admin/AdminPortalLogin';

// Icons
import { 
  Sparkles, 
  ShoppingBag, 
  Filter, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Heart,
  Store as StoreIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  search: '',
  category: 'all',
  gender: 'all',
  selectedBrands: [],
  selectedSizes: [],
  selectedColors: [],
  minPrice: 0,
  maxPrice: 800,
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'popular'
};

export default function App() {
  // Core Store Data
  const [products, setProducts] = useState<Product[]>(getStoredProducts);
  const [orders, setOrders] = useState<Order[]>(getStoredOrders);
  const [settings, setSettings] = useState<StoreSettings>(getStoredSettings);
  const [cart, setCart] = useState<CartItem[]>(getStoredCart);

  // Automatic domain/subdomain separation between Customer Store and Admin ERP System
  const isDedicatedAdminSubdomainOrRoute = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const host = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);

    const isSubdomain = host.startsWith('admin.') || host.startsWith('sistema.') || host.startsWith('erp.');
    const isPath = pathname.startsWith('/admin') || pathname.startsWith('/sistema');
    const isParam = searchParams.get('mode') === 'admin' || searchParams.get('app') === 'admin' || searchParams.get('subdomain') === 'admin';

    return isSubdomain || isPath || isParam;
  }, []);

  // App Mode & Navigation
  const [viewMode, setViewMode] = useState<'store' | 'admin'>(() => {
    if (typeof window === 'undefined') return 'store';
    const host = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    if (
      host.startsWith('admin.') || 
      host.startsWith('sistema.') || 
      host.startsWith('erp.') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/sistema') ||
      searchParams.get('mode') === 'admin' ||
      searchParams.get('app') === 'admin' ||
      searchParams.get('subdomain') === 'admin'
    ) {
      return 'admin';
    }
    return 'store';
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(isAdminAuthenticated);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>('all');
  const [selectedGender, setSelectedGender] = useState<'all' | GenderType>('all');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Modals & Drawers
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackedOrderCode, setTrackedOrderCode] = useState<string>(() => getLastTrackedCode());
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeToast, setActiveToast] = useState<OrderNotification | null>(null);

  // Cart Promo Code & Discount
  const [cartDiscount, setCartDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [cartBounceTrigger, setCartBounceTrigger] = useState(0);

  // Product Pagination State (10 productos por página)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const productsSectionRef = useRef<HTMLDivElement>(null);

  // Real-time Cloud Synchronization via Firebase Firestore
  useEffect(() => {
    testFirebaseConnection();

    // 1. Live Sync Products from Cloud
    const unsubProducts = subscribeToProducts((cloudProducts) => {
      setProducts(cloudProducts);
      saveStoredProducts(cloudProducts);
    }, getStoredProducts());

    // 2. Live Sync Orders from Cloud
    const unsubOrders = subscribeToOrders((cloudOrders) => {
      setOrders(cloudOrders);
      saveStoredOrders(cloudOrders);
    }, getStoredOrders());

    // 3. Live Sync Settings & Coupons from Cloud
    const unsubSettings = subscribeToStoreSettings((cloudSettings) => {
      setSettings(cloudSettings);
      saveStoredSettings(cloudSettings);
    }, getStoredSettings());

    return () => {
      unsubProducts();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  // Reset to page 1 whenever any filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedGender, filters]);

  // Synchronize state with storage
  useEffect(() => {
    saveStoredProducts(products);
  }, [products]);

  useEffect(() => {
    saveStoredOrders(orders);
  }, [orders]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  // Compute unique filter options from current inventory
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  const availableSizes = useMemo(() => {
    const allSizes = products.flatMap((p) => p.sizes);
    return Array.from(new Set(allSizes)).sort();
  }, [products]);

  const availableColors = useMemo(() => {
    const colorMap = new Map<string, ProductColor>();
    products.forEach((p) => {
      p.colors.forEach((c) => {
        if (!colorMap.has(c.name)) {
          colorMap.set(c.name, c);
        }
      });
    });
    return Array.from(colorMap.values());
  }, [products]);

  // Filtered & Sorted Products computation
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);
        const matchesSku = product.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesBrand && !matchesSku) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // 3. Gender Filter
      if (selectedGender !== 'all') {
        if (product.gender !== selectedGender && product.gender !== 'unisex') {
          return false;
        }
      }

      // 4. Sizes Filter
      if (filters.selectedSizes.length > 0) {
        const hasMatchingSize = product.sizes.some((sz) => filters.selectedSizes.includes(sz));
        if (!hasMatchingSize) return false;
      }

      // 5. Colors Filter
      if (filters.selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some((col) => filters.selectedColors.includes(col.name));
        if (!hasMatchingColor) return false;
      }

      // 6. Brands Filter
      if (filters.selectedBrands.length > 0) {
        if (!filters.selectedBrands.includes(product.brand)) return false;
      }

      // 7. Price Range Filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // 8. On Sale Only
      if (filters.onSaleOnly && (!product.originalPrice || product.originalPrice <= product.price)) {
        return false;
      }

      // 9. In Stock Only
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'discount':
          const discountA = a.originalPrice ? a.originalPrice - a.price : 0;
          const discountB = b.originalPrice ? b.originalPrice - b.price : 0;
          return discountB - discountA;
        case 'popular':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });
  }, [products, searchQuery, selectedCategory, selectedGender, filters]);

  // Pagination Calculations
  const totalProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, startIndex, endIndex]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (productsSectionRef.current) {
        productsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: ProductColor, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor.name === color.name
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = { ...updated[existingIndex], quantity: newQty };
        return updated;
      } else {
        const newItem: CartItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity: Math.min(product.stock, quantity)
        };
        return [...prevCart, newItem];
      }
    });

    // Trigger tactile bouncing animation on header cart icon
    setCartBounceTrigger((prev) => prev + 1);

    // Open drawer smoothly so customer can witness the tactile bounce
    setTimeout(() => {
      setCartDrawerOpen(true);
    }, 600);
  };

  const handleUpdateCartQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(item.product.stock, nextQty) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
    setCartDiscount(0);
    setAppliedPromo('');
  };

  // Checkout and Order Placement
  const handleOrderPlaced = (newOrder: Order) => {
    // 1. Add order to state & cloud
    setOrders((prev) => [newOrder, ...prev]);
    syncCreateOrder(newOrder);

    // 2. Reduce products stock in state & cloud
    setProducts((prev) =>
      prev.map((p) => {
        const orderedItem = newOrder.items.find((it) => it.product.id === p.id);
        if (orderedItem) {
          const nextStock = Math.max(0, p.stock - orderedItem.quantity);
          syncReduceStock(p.id, nextStock);
          return { ...p, stock: nextStock };
        }
        return p;
      })
    );

    // 3. Clear Cart & Mark Coupon as Used in state & cloud
    if (appliedPromo) {
      const cleanPromo = appliedPromo.trim().toUpperCase();
      setSettings((prev) => {
        const updatedCoupons = (prev.coupons || []).map((cp) => {
          if (cp.code.toUpperCase() === cleanPromo) {
            return {
              ...cp,
              isUsed: true,
              usedAt: new Date().toISOString(),
              usedInOrderNumber: newOrder.orderNumber
            };
          }
          return cp;
        });
        const updatedSettings = { ...prev, coupons: updatedCoupons };
        saveStoredSettings(updatedSettings);
        syncSaveStoreSettings(updatedSettings);
        return updatedSettings;
      });
    }

    setCart([]);
    setCartDiscount(0);
    setAppliedPromo('');

    // 4. Create Notification
    const notif: OrderNotification = {
      id: `notif-${Date.now()}`,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      customerName: newOrder.customerName,
      total: newOrder.total,
      itemCount: newOrder.items.reduce((s, i) => s + i.quantity, 0),
      timestamp: new Date().toISOString(),
      read: false
    };

    saveStoredNotifications([notif, ...getStoredNotifications()]);
    setActiveToast(notif);

    // 5. Real-Time Audio Chime & Push Alert
    if (settings.notificationSound) {
      playNotificationChime();
    }
    if (settings.pushNotifications) {
      sendPushNotification(
        `🛍️ Nuevo Pedido #${newOrder.orderNumber}`,
        `${newOrder.customerName} ha ordenado ${notif.itemCount} productos por ${settings.currencySymbol} ${newOrder.total.toFixed(2)}`
      );
    }
  };

  const handleOpenTracking = (code?: string) => {
    if (code) {
      setTrackedOrderCode(code);
    } else {
      const stored = getLastTrackedCode();
      if (stored) {
        setTrackedOrderCode(stored);
      } else if (orders.length > 0) {
        setTrackedOrderCode(orders[0].orderNumber);
      }
    }
    setTrackingModalOpen(true);
  };

  // Admin Management Handlers
  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      } else {
        return [product, ...prev];
      }
    });
    syncSaveProduct(product);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    syncDeleteProduct(productId);
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    syncReduceStock(productId, newStock);
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
      )
    );
    syncUpdateOrderStatus(orderId, status);
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    syncSaveStoreSettings(newSettings);
  };

  const handleLoginAdminSuccess = () => {
    setAdminAuthenticated(true);
    setIsAdminLoggedIn(true);
    setAdminLoginModalOpen(false);
    setViewMode('admin');
  };

  const handleLogoutAdmin = () => {
    clearAdminAuthenticated();
    setIsAdminLoggedIn(false);
    setViewMode('store');
  };

  return (
    <div className="min-h-screen bg-sky-50/40 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* If in Dedicated Admin / ERP Subdomain Mode */}
      {viewMode === 'admin' ? (
        isAdminLoggedIn ? (
          <AdminLayout
            products={products}
            orders={orders}
            settings={settings}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateProductStock={handleUpdateProductStock}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSaveSettings={handleSaveSettings}
            onExitAdmin={() => setViewMode('store')}
            onLogoutAdmin={handleLogoutAdmin}
            onPreviewTracking={(code) => handleOpenTracking(code)}
          />
        ) : (
          <AdminPortalLogin
            settings={settings}
            onSuccess={handleLoginAdminSuccess}
            onGoToStore={() => setViewMode('store')}
          />
        )
      ) : (
        /* Public Storefront View (100% Client-Facing, No Admin Buttons) */
        <>
          {/* Header */}
          <Header
            settings={settings}
            cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCart={() => setCartDrawerOpen(true)}
            isAdmin={isAdminLoggedIn}
            showAdminButton={false}
            onOpenAdminAuth={() => setAdminLoginModalOpen(true)}
            onOpenAdminPanel={() => setViewMode('admin')}
            onOpenAdmin={() => {
              if (isAdminLoggedIn) {
                setViewMode('admin');
              } else {
                setAdminLoginModalOpen(true);
              }
            }}
            onSelectCategoryFilter={(cat, gen) => {
              setSelectedCategory(cat);
              setSelectedGender(gen);
            }}
            onOpenTracking={() => handleOpenTracking()}
            cartBounceTrigger={cartBounceTrigger}
          />

          {/* Promotional Banner Carousel / Hero */}
          <Banner
            settings={settings}
            onExploreCategory={(cat, gen) => {
              setSelectedCategory(cat);
              if (gen) setSelectedGender(gen);
            }}
            onShopNow={(cat, gen) => {
              setSelectedCategory(cat);
              setSelectedGender(gen);
            }}
            onOpenSale={() => {
              setFilters((prev) => ({ ...prev, onSaleOnly: true }));
            }}
          />

          {/* Dynamic Category & Gender Filter Bar */}
          <CategoryFilterBar
            currentCategory={selectedCategory}
            selectedCategory={selectedCategory}
            currentGender={selectedGender}
            selectedGender={selectedGender}
            onSelect={(cat, gen) => {
              setSelectedCategory(cat);
              setSelectedGender(gen);
            }}
            onSelectCategory={setSelectedCategory}
            onSelectGender={setSelectedGender}
            onOpenFilterDrawer={() => setFilterDrawerOpen(true)}
            onOpenFilters={() => setFilterDrawerOpen(true)}
            activeFilterCount={
              filters.selectedSizes.length +
              filters.selectedColors.length +
              filters.selectedBrands.length +
              (filters.onSaleOnly ? 1 : 0) +
              (filters.inStockOnly ? 1 : 0)
            }
            activeFiltersCount={
              filters.selectedSizes.length +
              filters.selectedColors.length +
              filters.selectedBrands.length +
              (filters.onSaleOnly ? 1 : 0) +
              (filters.inStockOnly ? 1 : 0)
            }
            totalProductsCount={filteredProducts.length}
            sortBy={filters.sortBy}
            onSortChange={(sort) => setFilters((prev) => ({ ...prev, sortBy: sort }))}
          />

          {/* Main Catalog Grid */}
          <main ref={productsSectionRef} className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
            
            {/* Catalog Section Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-['Playfair_Display',serif] tracking-tight">
                  {selectedCategory === 'all' && selectedGender === 'all'
                    ? 'Colección Destacada'
                    : selectedCategory === 'calzado'
                    ? `Calzado ${selectedGender !== 'all' ? `para ${selectedGender}` : ''}`
                    : `Ropa & Moda ${selectedGender !== 'all' ? `para ${selectedGender}` : ''}`}
                </h2>
                <p className="text-xs text-slate-600 font-medium">
                  Mostrando <strong className="text-sky-800 font-bold">{totalProducts > 0 ? `${startIndex + 1} - ${endIndex}` : '0'}</strong> de <strong className="text-slate-900 font-bold">{totalProducts}</strong> productos {totalPages > 1 && <span className="text-slate-500">(Página {safeCurrentPage} de {totalPages})</span>}
                </p>
              </div>

              {/* Reset filters shortcut if filtered */}
              {(selectedCategory !== 'all' ||
                selectedGender !== 'all' ||
                searchQuery ||
                filters.selectedSizes.length > 0 ||
                filters.selectedColors.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedGender('all');
                    setSearchQuery('');
                    setFilters(INITIAL_FILTERS);
                  }}
                  className="text-xs text-sky-600 hover:text-sky-800 font-bold underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restablecer Todo</span>
                </button>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-sky-100 shadow-sm p-8 space-y-4 max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center text-sky-600 mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No encontramos productos coincidentes</h3>
                <p className="text-xs text-slate-500">
                  Intenta cambiar las tallas, colores o términos de búsqueda seleccionados.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedGender('all');
                    setSearchQuery('');
                    setFilters(INITIAL_FILTERS);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  Ver Catálogo Completo
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {paginatedProducts.map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={idx}
                      settings={settings}
                      onOpenDetails={(p) => setSelectedProduct(p || product)}
                      onOpenDetail={(p) => setSelectedProduct(p || product)}
                      onQuickAddToCart={(p) => {
                        const target = p || product;
                        handleAddToCart(target, target.sizes[0], target.colors[0], 1);
                      }}
                      onAddToCart={(size, color) => handleAddToCart(product, size, color, 1)}
                    />
                  ))}
                </div>

                {/* Product Pagination Bar */}
                {totalPages > 1 && (
                  <div className="mt-8 pt-4 border-t border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 p-4 rounded-2xl border border-sky-100 shadow-2xs">
                    
                    {/* Left: Page Counter */}
                    <div className="text-xs text-slate-600 text-center sm:text-left">
                      <span>Mostrando </span>
                      <strong className="text-slate-900 font-bold">{startIndex + 1} - {endIndex}</strong>
                      <span> de </span>
                      <strong className="text-sky-800 font-bold">{totalProducts}</strong>
                      <span> productos</span>
                      <span className="text-slate-400 mx-1.5">•</span>
                      <span className="text-slate-700 font-semibold">Página {safeCurrentPage} de {totalPages}</span>
                    </div>

                    {/* Center: Numeric Page Navigation Buttons */}
                    <div className="flex items-center gap-1.5 justify-center flex-wrap">
                      {/* Previous Page */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(safeCurrentPage - 1)}
                        disabled={safeCurrentPage <= 1}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-sky-200 text-xs font-bold text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all shadow-2xs"
                        title="Página anterior"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden xs:inline">Anterior</span>
                      </button>

                      {/* Numbered Buttons */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isActive = pageNum === safeCurrentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-8 h-8 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-sky-600 text-white shadow-xs scale-105'
                                : 'bg-slate-50 hover:bg-sky-50 text-slate-700 border border-sky-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Page */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(safeCurrentPage + 1)}
                        disabled={safeCurrentPage >= totalPages}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-sky-200 text-xs font-bold text-slate-700 hover:bg-sky-50 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-all shadow-2xs"
                        title="Página siguiente"
                      >
                        <span className="hidden xs:inline">Siguiente</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Right: Items per page selector */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Por página:</span>
                      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-sky-100">
                        {[10, 16, 24].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => {
                              setItemsPerPage(size);
                              setCurrentPage(1);
                            }}
                            className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                              itemsPerPage === size
                                ? 'bg-sky-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </>
            )}

            {/* Compact Perks Badges (Sin garantía de cambio de talla) */}
            <div className="mt-10 pt-6 border-t border-sky-100 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Envíos rápidos a nivel nacional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Asesoría directa por WhatsApp</span>
              </div>
            </div>

          </main>

          {/* Store Footer */}
          <footer className="bg-white border-t border-sky-100 text-slate-500 text-xs mt-8 py-6 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={settings.logoUrl || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80"}
                  alt={settings.storeName}
                  className="w-8 h-8 rounded-xl object-cover border border-sky-200 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-extrabold text-slate-900 text-xs sm:text-sm">{settings.storeName}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">{settings.slogan}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600 text-[11px] sm:text-xs">
                {/* Dynamic WhatsApp Click-to-Chat Button */}
                <a
                  href={`https://wa.me/${(settings.whatsappNumber || '').replace(/\D/g, '')}?text=${encodeURIComponent(`¡Hola ${settings.storeName}! Quisiera realizar una consulta sobre sus productos.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-emerald-600 font-bold flex items-center gap-1.5 transition-colors cursor-pointer bg-slate-50 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-sky-100 hover:border-emerald-200 shadow-2xs"
                  title="Abrir chat directo en WhatsApp"
                  id="link-footer-whatsapp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>WhatsApp: <strong className="text-slate-900">{settings.whatsappDisplayNumber || settings.whatsappNumber}</strong></span>
                </a>
                <span>•</span>
                <button
                  onClick={() => handleOpenTracking()}
                  className="text-sky-600 hover:text-sky-800 font-bold underline flex items-center gap-1 cursor-pointer"
                  id="btn-footer-tracking"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Rastrear mi Pedido</span>
                </button>
                <span>•</span>
                <button
                  onClick={() => setViewMode('admin')}
                  className="text-slate-400 hover:text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                  title="Acceso al Subdominio / Sistema ERP de Administración"
                  id="btn-footer-admin-portal"
                >
                  Sistema ERP
                </button>
              </div>
            </div>
          </footer>

          {/* Floating WhatsApp Widget */}
          <FloatingWhatsApp settings={settings} />

          {/* Product Detail Modal */}
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            settings={settings}
            onAddToCart={(product, size, color, quantity) => {
              handleAddToCart(product, size, color, quantity);
              setSelectedProduct(null);
            }}
          />

          {/* Advanced Filter Drawer */}
          <FilterDrawer
            isOpen={filterDrawerOpen}
            onClose={() => setFilterDrawerOpen(false)}
            filters={filters}
            onUpdateFilters={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
            onResetFilters={() => setFilters(INITIAL_FILTERS)}
            availableBrands={availableBrands}
            availableSizes={availableSizes}
            availableColors={availableColors}
            settings={settings}
            totalFilteredCount={filteredProducts.length}
          />

          {/* Shopping Cart Drawer */}
          <CartDrawer
            isOpen={cartDrawerOpen}
            onClose={() => setCartDrawerOpen(false)}
            cart={cart}
            onUpdateQuantity={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onOpenCheckout={(disc, promo) => {
              setCartDiscount(disc);
              setAppliedPromo(promo);
              setCartDrawerOpen(false);
              setCheckoutModalOpen(true);
            }}
            onCheckout={() => {
              setCartDrawerOpen(false);
              setCheckoutModalOpen(true);
            }}
            settings={settings}
          />

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={checkoutModalOpen}
            onClose={() => setCheckoutModalOpen(false)}
            cart={cart}
            discount={cartDiscount}
            promoCode={appliedPromo}
            settings={settings}
            onOrderPlaced={handleOrderPlaced}
            onOpenTracking={(code) => handleOpenTracking(code)}
          />

          {/* Admin Login Modal */}
          <AdminLoginModal
            isOpen={adminLoginModalOpen}
            onClose={() => setAdminLoginModalOpen(false)}
            onSuccess={handleLoginAdminSuccess}
            settings={settings}
          />

          {/* Real-time Order Notification Toast */}
          <NotificationToast
            notification={activeToast}
            onClose={() => setActiveToast(null)}
            settings={settings}
            onViewOrder={() => {
              if (isAdminLoggedIn) {
                setViewMode('admin');
              } else {
                setAdminLoginModalOpen(true);
              }
            }}
          />
        </>
      )}

      {/* Order Tracking Live Modal (Accessible globally in store & admin) */}
      <OrderTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        orders={orders}
        initialOrderCode={trackedOrderCode}
        settings={settings}
      />

    </div>
  );
}
