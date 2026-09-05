import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, StoreSettings } from '../types';

// Collection references
const PRODUCTS_COLL = 'products';
const ORDERS_COLL = 'orders';
const SETTINGS_COLL = 'store_settings';
const GENERAL_SETTINGS_DOC = 'general';

/**
 * Real-time subscription to Products with initial seeding if empty
 */
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  initialFallback: Product[]
): () => void {
  const collRef = collection(db, PRODUCTS_COLL);

  return onSnapshot(
    collRef,
    async (snapshot) => {
      const cloudProducts: Product[] = [];
      snapshot.forEach((docSnap) => {
        cloudProducts.push(docSnap.data() as Product);
      });
      
      // If it's completely empty, that means the user has deleted all products
      // or hasn't created any yet. We just return the empty array.
      onUpdate(cloudProducts);
    },
    (err) => {
      console.warn('[Firestore] Products subscription error, using local data:', err);
      onUpdate(initialFallback);
    }
  );
}

/**
 * Real-time subscription to Orders
 */
export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  initialFallback: Order[]
): () => void {
  const collRef = collection(db, ORDERS_COLL);

  return onSnapshot(
    collRef,
    (snapshot) => {
      const cloudOrders: Order[] = [];
      snapshot.forEach((docSnap) => {
        cloudOrders.push(docSnap.data() as Order);
      });
      // Sort newest first
      cloudOrders.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      onUpdate(cloudOrders);
    },
    (err) => {
      console.warn('[Firestore] Orders subscription error, using local data:', err);
      onUpdate(initialFallback);
    }
  );
}

/**
 * Real-time subscription to Store Settings (including coupons & shipping)
 */
export function subscribeToStoreSettings(
  onUpdate: (settings: StoreSettings) => void,
  initialFallback: StoreSettings
): () => void {
  const docRef = doc(db, SETTINGS_COLL, GENERAL_SETTINGS_DOC);

  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, initialFallback);
          onUpdate(initialFallback);
        } catch (err) {
          console.warn('[Firestore] Error creating initial settings document:', err);
          onUpdate(initialFallback);
        }
      } else {
        const data = snapshot.data() as Partial<StoreSettings>;
        const mergedSettings: StoreSettings = {
          ...initialFallback,
          ...data,
          runwaySlides: (data.runwaySlides && Array.isArray(data.runwaySlides) && data.runwaySlides.length > 0)
            ? data.runwaySlides
            : (initialFallback.runwaySlides || []),
          brands: (data.brands && Array.isArray(data.brands) && data.brands.length > 0)
            ? data.brands
            : (initialFallback.brands || []),
          shippingOptions: (data.shippingOptions && Array.isArray(data.shippingOptions) && data.shippingOptions.length > 0)
            ? data.shippingOptions
            : (initialFallback.shippingOptions || []),
          coupons: (data.coupons && Array.isArray(data.coupons) && data.coupons.length > 0)
            ? data.coupons
            : (initialFallback.coupons || []),
        };
        onUpdate(mergedSettings);
      }
    },
    (err) => {
      console.warn('[Firestore] Settings subscription error, using local data:', err);
      onUpdate(initialFallback);
    }
  );
}

/**
 * Cloud Operations for Products
 */
export async function syncSaveProduct(product: Product): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLL, product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (err) {
    console.warn('[Firestore] Error saving product:', err);
  }
}

export async function syncDeleteProduct(productId: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLL, productId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[Firestore] Error deleting product:', err);
  }
}

export async function syncReduceStock(productId: string, quantityToDeduct: number): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLL, productId);
    const snap = await docRef;
    // Update local or Firestore doc
    await updateDoc(docRef, {
      stock: Math.max(0, quantityToDeduct)
    });
  } catch (err) {
    console.warn('[Firestore] Error updating stock:', err);
  }
}

/**
 * Cloud Operations for Orders
 */
export async function syncCreateOrder(order: Order): Promise<void> {
  const docRef = doc(db, ORDERS_COLL, order.id);
  await setDoc(docRef, order);
}

export async function syncUpdateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLL, orderId);
    const updates: Partial<Order> = { 
      status,
      updatedAt: new Date().toISOString()
    };
    await updateDoc(docRef, updates);
  } catch (err) {
    console.warn('[Firestore] Error updating order status:', err);
  }
}

export async function syncDeleteOrder(orderId: string): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLL, orderId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('[Firestore] Error deleting order:', err);
  }
}

/**
 * Cloud Operations for Store Settings & Coupons
 */
export async function syncSaveStoreSettings(settings: StoreSettings): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLL, GENERAL_SETTINGS_DOC);
    await setDoc(docRef, settings, { merge: true });
  } catch (err) {
    console.warn('[Firestore] Error saving store settings:', err);
  }
}
