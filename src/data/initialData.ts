import { Product, StoreSettings, Order, RunwaySlide, ShippingOption, Coupon, StoreBrand } from '../types';
import { BRAND_SVGS } from './brandLogos';

export const DEFAULT_STORE_BRANDS: StoreBrand[] = [
  {
    id: "brand-nike",
    name: "Nike",
    label: "NIKE",
    logoUrl: BRAND_SVGS.Nike,
    isActive: true,
    order: 1
  },
  {
    id: "brand-adidas",
    name: "Adidas",
    label: "ADIDAS",
    logoUrl: BRAND_SVGS.Adidas,
    isActive: true,
    order: 2
  },
  {
    id: "brand-jordan",
    name: "Jordan",
    label: "JORDAN",
    logoUrl: BRAND_SVGS.Jordan,
    isActive: true,
    order: 3
  },
  {
    id: "brand-puma",
    name: "Puma",
    label: "PUMA",
    logoUrl: BRAND_SVGS.Puma,
    isActive: true,
    order: 4
  },
  {
    id: "brand-reebok",
    name: "Reebok",
    label: "REEBOK",
    logoUrl: BRAND_SVGS.Reebok,
    isActive: true,
    order: 5
  },
  {
    id: "brand-lacoste",
    name: "Lacoste",
    label: "LACOSTE",
    logoUrl: BRAND_SVGS.Lacoste,
    isActive: true,
    order: 6
  },
  {
    id: "brand-fila",
    name: "FILA",
    label: "FILA",
    logoUrl: BRAND_SVGS.FILA,
    isActive: true,
    order: 7
  },
  {
    id: "brand-joma",
    name: "Joma",
    label: "JOMA",
    logoUrl: BRAND_SVGS.Joma,
    isActive: true,
    order: 8
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "AURA-7K9P",
    discountAmount: 10,
    description: "Sorteo Bienvenida Instagram (S/ 10.00)",
    createdAt: "2026-08-20T10:00:00Z",
    isUsed: false,
    isActive: true
  },
  {
    id: "coup-2",
    code: "SORTEO-20SO",
    discountAmount: 20,
    description: "Premio Ganador Ruleta TikTok (S/ 20.00)",
    createdAt: "2026-08-25T15:30:00Z",
    isUsed: false,
    isActive: true
  },
  {
    id: "coup-3",
    code: "AURA-VIP50",
    discountAmount: 50,
    description: "Sorteo Aniversario Aura (S/ 50.00)",
    createdAt: "2026-08-01T12:00:00Z",
    isUsed: true,
    usedAt: "2026-09-01T20:10:00Z",
    usedInOrderNumber: "AUR-8945",
    isActive: true
  }
];

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  storeName: "AURA MODA & CALZADO",
  slogan: "Estilo, elegancia y distinción a tus pies y en tu vestir",
  logoUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
  whatsappNumber: "51987654321", // 11 digits format standard for wa.me
  whatsappDisplayNumber: "+51 987 654 321",
  whatsappAdvisorName: "Valeria - Asesora de Moda Aura",
  currencySymbol: "S/",
  currencyCode: "PEN",
  freeShippingThreshold: 199,
  standardShippingCost: 15,
  adminPin: "1234",
  adminEmail: "admin@auramoda.com",
  notificationSound: true,
  pushNotifications: true,
  bannerNotice: "✨ ENVÍO GRATIS en compras mayores a S/ 199 | ¡Colección Nueva Temporada con 20% OFF!",
  bannerNoticeActive: true,
  storeAddress: "Av. La Moda 1042, Miraflores, Lima",
  storeInstagram: "@auramoda.pe",
  storeFacebook: "/auramodape",

  // Datos Yape & Plin
  yapeNumber: "987 654 321",
  yapeHolder: "Aura Moda & Calzado S.A.C.",
  yapeQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=YAPE-PLIN-AURA-MODA-987654321&color=742774&bgcolor=ffffff",
  plinNumber: "987 654 321",
  plinHolder: "Aura Moda & Calzado S.A.C.",
  plinQrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=PLIN-AURA-MODA-987654321&color=00d1b2&bgcolor=ffffff",

  // Cuentas Bancarias
  bankAccounts: [
    {
      id: "bank-1",
      bankName: "BCP (Banco de Crédito)",
      accountNumber: "193-98765432-0-12",
      cci: "002-193-009876543201-12",
      accountHolder: "AURA MODA & CALZADO S.A.C.",
      accountType: "Cta. Corriente Soles"
    },
    {
      id: "bank-2",
      bankName: "BBVA Continental",
      accountNumber: "0011-0123-0200987654",
      cci: "011-123-000200987654-15",
      accountHolder: "AURA MODA & CALZADO S.A.C.",
      accountType: "Cta. Ahorros Soles"
    },
    {
      id: "bank-3",
      bankName: "Interbank",
      accountNumber: "200-3001234567",
      cci: "003-200-003001234567-28",
      accountHolder: "AURA MODA & CALZADO S.A.C.",
      accountType: "Cta. Digital Soles"
    },
    {
      id: "bank-4",
      bankName: "Banco de la Nación",
      accountNumber: "04-015-987654",
      cci: "018-015-000401598765-42",
      accountHolder: "AURA MODA & CALZADO S.A.C.",
      accountType: "Cta. Ahorros Soles"
    }
  ],

  // Pasarela de Imágenes de Alta Moda & Calzado (Runway Showcase)
  runwaySlides: [
    {
      id: "runway-1",
      imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=80",
      title: "Alta Costura & Tendencia 2026",
      subtitle: "Prendas icónicas y calzado seleccionados para un estilo inconfundible",
      badge: "PASARELA EXCLUSIVA",
      linkCategory: "ropa",
      linkGender: "mujeres"
    },
    {
      id: "runway-2",
      imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80",
      title: "Colección Calzado & Distinción",
      subtitle: "Cuero legítimo, ergonomía y diseño italiano a tus pies",
      badge: "ALTA GAMA",
      linkCategory: "calzado",
      linkGender: "varones"
    },
    {
      id: "runway-3",
      imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&auto=format&fit=crop&q=80",
      title: "Elegancia Contemporánea",
      subtitle: "Siluetas fluidas y tonos sobrios para ocasiones memorables",
      badge: "NUEVA TEMPORADA",
      linkCategory: "ropa",
      linkGender: "varones"
    },
    {
      id: "runway-4",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&auto=format&fit=crop&q=80",
      title: "Vanguardia & Moda Streetwear Chic",
      subtitle: "La expresión moderna del lujo urbano para hombres y mujeres",
      badge: "TENDENCIA GLOBAL",
      linkCategory: "ropa",
      linkGender: "mujeres"
    }
  ],

  // Pasarela de Marcas Oficiales de la Tienda
  brands: DEFAULT_STORE_BRANDS,

  // Chofer / Repartidor de Envíos
  driverName: "Carlos Méndez R.",
  driverPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  driverWhatsapp: "51987654321",
  driverRole: "Repartidor Elite Autorizado",
  driverVehicle: "Furgón Express de Reparto",

  // Opciones y Métodos de Envío Preestablecidas
  shippingOptions: [
    {
      id: "ship-1",
      name: "Envío Estándar a Domicilio",
      price: 15,
      estimatedTime: "24 a 48 horas hábiles",
      description: "Lima Metropolitana y Callao con reparto a domicilio",
      isActive: true
    },
    {
      id: "ship-2",
      name: "Envío Express Mismo Día",
      price: 25,
      estimatedTime: "Mismo día (pedidos antes de las 2:00 PM)",
      description: "Despacho prioritario en furgón express de reparto",
      isActive: true
    },
    {
      id: "ship-3",
      name: "Envío Nacional a Provincias",
      price: 20,
      estimatedTime: "2 a 4 días hábiles vía Olva Courier / Shalom",
      description: "Cobertura nacional con código de seguimiento oficial",
      isActive: true
    },
    {
      id: "ship-4",
      name: "Recojo en Tienda Central / Almacén",
      price: 0,
      estimatedTime: "Disponible en 2 horas",
      description: "Av. La Moda 1042, Miraflores (Gratis - Sin costo)",
      isActive: true
    }
  ],

  // Cupones de Sorteo / Descuento en Dinero (Un solo uso)
  coupons: INITIAL_COUPONS,

  // Plantillas de WhatsApp
  whatsappTemplates: {
    orderGeneric: "✨ *NUEVO PEDIDO REALIZADO - {{storeName}}* ✨\n📋 *Orden:* #{{orderNumber}}\n👤 *Cliente:* {{customerName}}\n📱 *Teléfono:* {{customerPhone}}\n📍 *Dirección:* {{address}}\n🛒 *Productos:*\n{{itemsList}}\n\n💵 *Total:* {{currencySymbol}} {{total}}\n💳 *Método:* {{paymentMethod}}\n🚚 *Seguimiento:* Rastrearé mi paquete con el código *{{orderNumber}}*.",
    orderContraEntrega: "👋 ¡Hola *{{storeName}}*!\nAcabo de realizar mi pedido *#{{orderNumber}}* con método de pago *PAGO CONTRA ENTREGA* 📦💵.\n\n👤 *Cliente:* {{customerName}}\n📍 *Dirección:* {{address}}\n🛒 *Productos:*\n{{itemsList}}\n\n💵 *Total a Pagar:* *{{currencySymbol}} {{total}}*\n\nPor favor confirmen la recepción de mi pedido.",
    orderYapePlin: "👋 ¡Hola *{{storeName}}*!\nAcabo de realizar el pago mediante *YAPE / PLIN* 📱💸 de mi pedido *#{{orderNumber}}*.\n\n👤 *Cliente:* {{customerName}}\n📍 *Destino:* {{address}}\n💵 *Monto Pagado:* *{{currencySymbol}} {{total}}*\n🛒 *Productos:*\n{{itemsList}}\n\n📸 *Adjunto a este chat la captura de pantalla / comprobante del Yape/Plin.*",
    orderTransferencia: "👋 ¡Hola *{{storeName}}*!\nAcabo de realizar la *TRANSFERENCIA BANCARIA* 🏦📄 de mi pedido *#{{orderNumber}}*.\n\n👤 *Cliente:* {{customerName}}\n📍 *Destino:* {{address}}\n💵 *Monto Transferido:* *{{currencySymbol}} {{total}}*\n🛒 *Productos:*\n{{itemsList}}\n\n📸 *Adjunto en este mensaje la foto / voucher de la transferencia bancaria.*",
    trackingQuery: "👋 ¡Hola *{{storeName}}*!\nDeseo hacer una consulta sobre el estado de mi envío:\n🚚 *Código de Rastreo:* #{{orderNumber}}\n👤 *Cliente:* {{customerName}}\n📍 *Destino:* {{address}}\n📦 *Estado actual:* {{status}}\n\n¿Podrían brindarme información adicional sobre el despacho?",
    driverContact: "👋 ¡Hola {{driverName}}! Le escribo respecto a la entrega de mi pedido:\n🚚 *Guía de Entrega:* #{{orderNumber}}\n👤 *Cliente:* {{customerName}}\n📍 *Destino:* {{address}}\n📦 *Estado:* {{status}}\n\n¿A qué hora aproximadamente estará llegando a mi domicilio?"
  }
};

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Calzado Varones
  {
    id: "prod-1",
    sku: "CAL-VAR-001",
    name: "Sneakers Urban Pro Leather",
    description: "Zapatillas urbanas confeccionadas en cuero vacuno premium con plantilla memory foam ergonómica y suela de caucho vulcanizado antideslizante. Diseñadas para brindar confort superior durante todo el día sin sacrificar elegancia.",
    category: "calzado",
    gender: "varones",
    brand: "Nike",
    price: 289,
    originalPrice: 350,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Rojo Carmesí", hex: "#dc2626" },
      { name: "Negro Obsidiana", hex: "#0f172a" },
      { name: "Blanco Puro", hex: "#f8fafc" }
    ],
    stock: 8,
    lowStockThreshold: 4,
    tags: ["destacado", "urbano", "cuero", "tendencia"],
    isFeatured: true,
    isNew: true,
    materials: "100% Cuero Genuino, Suela de Goma Eva inyectada, Forro textil transpirable.",
    careGuide: "Limpiar con paño ligeramente húmedo y aplicar crema para calzado de cuero neutra.",
    createdAt: "2026-08-15T10:00:00Z"
  },
  {
    id: "prod-2",
    sku: "CAL-VAR-002",
    name: "Botines Chelsea Heritage",
    description: "Botines clásicos Chelsea en gamuza italiana tratada con protección repelente al agua. Elásticos laterales de alta resistencia y tirador posterior para calce fácil. Ideales para ocasiones formales y casuales.",
    category: "calzado",
    gender: "varones",
    brand: "Zara Man",
    price: 320,
    originalPrice: 390,
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["40", "41", "42", "43"],
    colors: [
      { name: "Camel Tabaco", hex: "#b45309" },
      { name: "Negro Carbón", hex: "#18181b" }
    ],
    stock: 3, // Low stock alert
    lowStockThreshold: 5,
    tags: ["elegante", "gamuza", "chelsea", "invierno"],
    isFeatured: true,
    isNew: false,
    materials: "Gamuza vacuna hidrófuga, Suela de cuero y goma cosida goodyear.",
    careGuide: "Cepillar con cerdas de goma para gamuza. No mojar directamente.",
    createdAt: "2026-08-10T12:00:00Z"
  },
  {
    id: "prod-3",
    sku: "CAL-VAR-003",
    name: "Zapatillas Running Swift Aero",
    description: "Calzado de running ultraligero con tejido Knit transpirable y amortiguación de doble densidad para absorción de impactos en asfalto y pista.",
    category: "calzado",
    gender: "varones",
    brand: "Adidas",
    price: 245,
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["39", "40", "41", "42", "43"],
    colors: [
      { name: "Azul Medianoche", hex: "#1e3a8a" },
      { name: "Gris Platino", hex: "#94a3b8" }
    ],
    stock: 14,
    lowStockThreshold: 4,
    tags: ["deporte", "running", "ligero"],
    isFeatured: false,
    isNew: true,
    materials: "Malla Primeknit transpirable con refuerzos TPU termosellados.",
    createdAt: "2026-08-20T14:30:00Z"
  },

  // 2. Calzado Mujeres
  {
    id: "prod-4",
    sku: "CAL-MUJ-001",
    name: "Stilettos Velvet Glamour",
    description: "Tacones de punta fina con diseño ergonómico de arco equilibrado y tacón aguja de 8.5 cm forrado. Acabado acharolado de alto brillo para fiestas, eventos de gala y noches especiales.",
    category: "calzado",
    gender: "mujeres",
    brand: "Aura Couture",
    price: 279,
    originalPrice: 340,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["35", "36", "37", "38", "39"],
    colors: [
      { name: "Nude Elegance", hex: "#e2c4b0" },
      { name: "Negro Charol", hex: "#09090b" },
      { name: "Rojo Pasión", hex: "#b91c1c" }
    ],
    stock: 6,
    lowStockThreshold: 3,
    tags: ["fiesta", "tacones", "elegante", "gala"],
    isFeatured: true,
    isNew: true,
    materials: "Sintético microfibra premium acharolado, plantilla acolchada.",
    createdAt: "2026-08-18T09:00:00Z"
  },
  {
    id: "prod-5",
    sku: "CAL-MUJ-002",
    name: "Sneakers Chunky Platform Chic",
    description: "Zapatillas con plataforma elevada de 4.5cm, detalles en tonos pastel y suela dentada de alta tracción. Comodidad absoluta para elevar cualquier look urbano o universitario.",
    category: "calzado",
    gender: "mujeres",
    brand: "Puma",
    price: 239,
    originalPrice: 280,
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["36", "37", "38", "39", "40"],
    colors: [
      { name: "Blanco / Rosa Pastel", hex: "#fce7f3" },
      { name: "Beige Vainilla", hex: "#fef3c7" }
    ],
    stock: 2, // Low stock alert
    lowStockThreshold: 4,
    tags: ["chunky", "plataforma", "moda"],
    isFeatured: true,
    isNew: false,
    materials: "Cuero ecológico y malla suave, suela de poliuretano expandido.",
    createdAt: "2026-08-01T15:00:00Z"
  },
  {
    id: "prod-6",
    sku: "CAL-MUJ-003",
    name: "Sandalias Strappy Doradas",
    description: "Sandalias de tiras finas entrelazadas con baño metalizado dorado y tacón block de 5cm, perfectas para días soleados, cócteles y bodas de día.",
    category: "calzado",
    gender: "mujeres",
    brand: "Zara",
    price: 189,
    images: [
      "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["36", "37", "38", "39"],
    colors: [
      { name: "Oro Champagne", hex: "#d97706" },
      { name: "Plata Espejo", hex: "#cbd5e1" }
    ],
    stock: 10,
    lowStockThreshold: 3,
    tags: ["verano", "sandalias", "dorado"],
    isFeatured: false,
    isNew: true,
    materials: "Material metalizado suave, suela antideslizante.",
    createdAt: "2026-08-22T11:00:00Z"
  },

  // 3. Calzado Niños
  {
    id: "prod-7",
    sku: "CAL-NIN-001",
    name: "Zapatillas Sparkle Kids con Luces",
    description: "Zapatillas interactivas con sistema de luces LED en la entresuela activadas por el impacto al caminar. Cierre de doble velcro para ajuste rápido y seguro sin necesidad de amarrar pasadores.",
    category: "calzado",
    gender: "ninos",
    brand: "Puma Kids",
    price: 159,
    originalPrice: 190,
    images: [
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["26", "27", "28", "29", "30", "31", "32"],
    colors: [
      { name: "Azul Eléctrico", hex: "#2563eb" },
      { name: "Fucsia Neón", hex: "#db2777" }
    ],
    stock: 12,
    lowStockThreshold: 5,
    tags: ["luces", "niños", "comodo", "velcro"],
    isFeatured: true,
    isNew: true,
    materials: "Textil transpirable reforzado, batería sellada impermeable.",
    createdAt: "2026-08-12T13:00:00Z"
  },
  {
    id: "prod-8",
    sku: "CAL-NIN-002",
    name: "Botitas Invierno Fleece Kids",
    description: "Botitas acolchadas con forro interior de sherpa/fleece térmico para proteger los pies de los más pequeños en épocas de frío. Suela de goma flexible antideslizante.",
    category: "calzado",
    gender: "ninos",
    brand: "Converse Kids",
    price: 135,
    images: [
      "https://images.unsplash.com/photo-1519748771451-a94c5963879f?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["24", "25", "26", "27", "28", "29"],
    colors: [
      { name: "Marrón Miel", hex: "#92400e" },
      { name: "Gris Perla", hex: "#64748b" }
    ],
    stock: 1, // Critical low stock
    lowStockThreshold: 4,
    tags: ["invierno", "calido", "botas"],
    isFeatured: false,
    isNew: false,
    materials: "Microgamuza sintética suave y forro de borreguito térmico.",
    createdAt: "2026-08-05T10:00:00Z"
  },

  // 4. Ropa Varones
  {
    id: "prod-9",
    sku: "ROP-VAR-001",
    name: "Casaca Bomber Cuero Biker Luxe",
    description: "Chaqueta biker clásica de corte slim contemporáneo, cierres metálicos pulidos YKK y forro interior satinado con bolsillo oculto para teléfono. Prenda imprescindible en cualquier guardarropa masculino.",
    category: "ropa",
    gender: "varones",
    brand: "Aura Men",
    price: 349,
    originalPrice: 420,
    images: [
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Negro Mate", hex: "#18181b" },
      { name: "Café Moka", hex: "#451a03" }
    ],
    stock: 9,
    lowStockThreshold: 3,
    tags: ["cuero", "casaca", "exclusivo", "elegante"],
    isFeatured: true,
    isNew: true,
    materials: "Cuero sintético ecológico ultra resistente y forro 100% poliéster satinado.",
    careGuide: "No lavar a máquina. Limpiar en seco o con paño suave especializado.",
    createdAt: "2026-08-16T16:00:00Z"
  },
  {
    id: "prod-10",
    sku: "ROP-VAR-002",
    name: "Camisa Lino Premium Relaxed",
    description: "Camisa de lino 100% natural prelavado con cuello mao y botones de nácar natural. Ideal para climas cálidos y ocasiones semi-formales con máxima frescura.",
    category: "ropa",
    gender: "varones",
    brand: "Zara Man",
    price: 189,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Blanco Lino", hex: "#f8fafc" },
      { name: "Azul Cielo", hex: "#38bdf8" },
      { name: "Verde Salvia", hex: "#84cc16" }
    ],
    stock: 15,
    lowStockThreshold: 5,
    tags: ["lino", "verano", "fresco", "casual"],
    isFeatured: false,
    isNew: true,
    materials: "100% Lino francés cultivado naturalmente.",
    createdAt: "2026-08-21T08:00:00Z"
  },
  {
    id: "prod-11",
    sku: "ROP-VAR-003",
    name: "Pantalón Chino Confort Stretch",
    description: "Pantalón estilo chino con tecnología de elasticidad en 4 direcciones, pretina anatómica y acabados limpios para uso diario en oficina o salidas casuales.",
    category: "ropa",
    gender: "varones",
    brand: "Levi's",
    price: 219,
    originalPrice: 260,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: "Beige Khaki", hex: "#d4b996" },
      { name: "Azul Marino", hex: "#1e293b" },
      { name: "Gris Grafito", hex: "#475569" }
    ],
    stock: 7,
    lowStockThreshold: 3,
    tags: ["chino", "oficina", "confort"],
    isFeatured: false,
    isNew: false,
    materials: "97% Algodón Pima, 3% Elastano.",
    createdAt: "2026-08-08T10:00:00Z"
  },

  // 5. Ropa Mujeres
  {
    id: "prod-12",
    sku: "ROP-MUJ-001",
    name: "Vestido Midi Seda Silk Noir",
    description: "Vestido midi de satén de seda fluida con escote drapeado en cascada, espalda descubierta sutil con tirantes cruzados ajustables y abertura lateral.",
    category: "ropa",
    gender: "mujeres",
    brand: "Aura Couture",
    price: 299,
    originalPrice: 380,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Verde Esmeralda", hex: "#065f46" },
      { name: "Negro Noche", hex: "#0a0a0a" },
      { name: "Rojo Rubí", hex: "#991b1b" }
    ],
    stock: 4, // Low stock
    lowStockThreshold: 5,
    tags: ["fiesta", "vestido", "seda", "elegante", "gala"],
    isFeatured: true,
    isNew: true,
    materials: "Satén de seda premium con caída pesada que no transparenta.",
    createdAt: "2026-08-17T18:00:00Z"
  },
  {
    id: "prod-13",
    sku: "ROP-MUJ-002",
    name: "Blazer Oversize Sartorial Wool",
    description: "Blazer estructurado de corte oversize con hombreras discretas, solapa en pico y bolsillos con solapa. Una pieza clave para proyectar empoderamiento y estilo contemporáneo.",
    category: "ropa",
    gender: "mujeres",
    brand: "Zara",
    price: 310,
    originalPrice: 360,
    images: [
      "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Crudo Crema", hex: "#fef3c7" },
      { name: "Gris Melange", hex: "#6b7280" },
      { name: "Negro Clásico", hex: "#111827" }
    ],
    stock: 6,
    lowStockThreshold: 3,
    tags: ["blazer", "oversize", "elegante", "oficina"],
    isFeatured: true,
    isNew: true,
    materials: "Mezcla de lana fina y viscosa estructurada.",
    createdAt: "2026-08-14T11:00:00Z"
  },
  {
    id: "prod-14",
    sku: "ROP-MUJ-003",
    name: "Conjunto Deportivo Seamless Sculpt",
    description: "Set de dos piezas (Top deportivo de alto soporte + Legging cintura alta compresión) fabricado con tecnología sin costuras que moldea la silueta y ofrece secado ultra rápido.",
    category: "ropa",
    gender: "mujeres",
    brand: "Nike",
    price: 220,
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Lila Lavanda", hex: "#c084fc" },
      { name: "Verde Matcha", hex: "#65a30d" },
      { name: "Azul Marino", hex: "#1e3a8a" }
    ],
    stock: 18,
    lowStockThreshold: 5,
    tags: ["deporte", "fitness", "seamless", "conjunto"],
    isFeatured: false,
    isNew: true,
    materials: "88% Nylon reciclado, 12% Spandex de alta compresión.",
    createdAt: "2026-08-19T09:30:00Z"
  },

  // 6. Ropa Niños
  {
    id: "prod-15",
    sku: "ROP-NIN-001",
    name: "Conjunto Algodón Pima Kids 2 Piezas",
    description: "Conjunto de sudadera suave con capucha y pantalón jogger con cordón ajustable. Confeccionado en 100% algodón orgánico hipoalergénico, perfecto para el juego y descanso.",
    category: "ropa",
    gender: "ninos",
    brand: "Aura Kids",
    price: 129,
    originalPrice: 160,
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["2T", "4T", "6", "8", "10", "12"],
    colors: [
      { name: "Mostaza Cálido", hex: "#eab308" },
      { name: "Gris Jaspe", hex: "#94a3b8" },
      { name: "Verde Menta", hex: "#10b981" }
    ],
    stock: 11,
    lowStockThreshold: 4,
    tags: ["niños", "algodon", "conjunto", "comodo"],
    isFeatured: true,
    isNew: true,
    materials: "100% Algodón Pima orgánico certificado.",
    createdAt: "2026-08-11T14:00:00Z"
  },
  {
    id: "prod-16",
    sku: "ROP-NIN-002",
    name: "Casaca Acolchada Térmica Dino Park",
    description: "Casaca acolchada resistente al viento con capucha decorativa, forro interior térmico y bolsillos laterales. Repelente a lloviznas ligeras.",
    category: "ropa",
    gender: "ninos",
    brand: "Zara Kids",
    price: 175,
    originalPrice: 210,
    images: [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&auto=format&fit=crop&q=80"
    ],
    sizes: ["4", "6", "8", "10"],
    colors: [
      { name: "Azul Real", hex: "#1d4ed8" },
      { name: "Rojo Fuego", hex: "#ef4444" }
    ],
    stock: 3, // Low stock alert
    lowStockThreshold: 4,
    tags: ["invierno", "termico", "casaca", "niños"],
    isFeatured: false,
    isNew: false,
    materials: "Exterior de microfibra repelente al agua, relleno térmico sintético.",
    createdAt: "2026-08-03T11:20:00Z"
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-101",
    orderNumber: "AUR-8942",
    customerName: "Carlos Mendoza Silva",
    customerPhone: "+51 984 551 223",
    customerEmail: "carlos.mendoza@gmail.com",
    shippingAddress: "Av. Pardo y Aliaga 640, Dpto 802, San Isidro",
    city: "Lima",
    notes: "Por favor llamar antes de llegar a la portería.",
    items: [
      {
        id: "item-1",
        product: INITIAL_PRODUCTS[0],
        selectedSize: "42",
        selectedColor: { name: "Rojo Carmesí", hex: "#dc2626" },
        quantity: 1
      },
      {
        id: "item-2",
        product: INITIAL_PRODUCTS[9],
        selectedSize: "L",
        selectedColor: { name: "Blanco Lino", hex: "#f8fafc" },
        quantity: 1
      }
    ],
    subtotal: 478,
    shippingCost: 0,
    discount: 0,
    total: 478,
    paymentMethod: "yape_plin",
    status: "entregado",
    createdAt: "2026-08-25T14:30:00Z",
    updatedAt: "2026-08-26T16:00:00Z"
  },
  {
    id: "ord-102",
    orderNumber: "AUR-8943",
    customerName: "Mariana Rojas Delgado",
    customerPhone: "+51 992 118 764",
    customerEmail: "mariana.rojas@outlook.com",
    shippingAddress: "Calle Las Dalias 320, Urb. California",
    city: "Trujillo",
    notes: "Dejar en conserjería.",
    items: [
      {
        id: "item-3",
        product: INITIAL_PRODUCTS[11],
        selectedSize: "M",
        selectedColor: { name: "Verde Esmeralda", hex: "#065f46" },
        quantity: 1
      },
      {
        id: "item-4",
        product: INITIAL_PRODUCTS[3],
        selectedSize: "37",
        selectedColor: { name: "Nude Elegance", hex: "#e2c4b0" },
        quantity: 1
      }
    ],
    subtotal: 578,
    shippingCost: 0,
    discount: 30,
    total: 548,
    paymentMethod: "whatsapp",
    status: "enviado",
    createdAt: "2026-08-28T18:15:00Z",
    updatedAt: "2026-08-29T10:00:00Z"
  },
  {
    id: "ord-103",
    orderNumber: "AUR-8944",
    customerName: "Jorge Luis Paredes",
    customerPhone: "+51 971 443 890",
    customerEmail: "jorge.paredes@gmail.com",
    shippingAddress: "Jr. Ayacucho 450, Int 3",
    city: "Arequipa",
    notes: "Envío urgente por favor.",
    items: [
      {
        id: "item-5",
        product: INITIAL_PRODUCTS[1],
        selectedSize: "41",
        selectedColor: { name: "Camel Tabaco", hex: "#b45309" },
        quantity: 1
      }
    ],
    subtotal: 320,
    shippingCost: 0,
    discount: 0,
    total: 320,
    paymentMethod: "transferencia",
    status: "en_preparacion",
    createdAt: "2026-08-31T09:40:00Z",
    updatedAt: "2026-08-31T11:00:00Z"
  },
  {
    id: "ord-104",
    orderNumber: "AUR-8945",
    customerName: "Fiorella Castro Montes",
    customerPhone: "+51 965 332 109",
    customerEmail: "fio.castro@hotmail.com",
    shippingAddress: "Av. El Derby 254, Torre B Piso 10, Surco",
    city: "Lima",
    notes: "Coordinar horario de entrega por WhatsApp.",
    items: [
      {
        id: "item-6",
        product: INITIAL_PRODUCTS[14],
        selectedSize: "6",
        selectedColor: { name: "Mostaza Cálido", hex: "#eab308" },
        quantity: 2
      },
      {
        id: "item-7",
        product: INITIAL_PRODUCTS[6],
        selectedSize: "29",
        selectedColor: { name: "Azul Eléctrico", hex: "#2563eb" },
        quantity: 1
      }
    ],
    subtotal: 417,
    shippingCost: 0,
    discount: 0,
    total: 417,
    paymentMethod: "whatsapp",
    status: "pendiente",
    createdAt: "2026-09-01T20:10:00Z",
    updatedAt: "2026-09-01T20:10:00Z"
  }
];
