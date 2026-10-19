import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Product,
  CartItem,
  Address,
  UserProfile,
  Order,
  Review,
  ProductCategory,
  GenderCategory,
} from "../types";
import { INITIAL_PRODUCTS, INITIAL_REVIEWS, SAMPLE_COUPONS } from "../data/products";

interface FilterState {
  searchQuery: string;
  gender: GenderCategory | "all";
  category: ProductCategory | "all";
  priceRange: [number, number];
  selectedSizes: string[];
  selectedColors: string[];
  selectedBrands: string[];
  minRating: number;
  onlyNewArrivals: boolean;
  onlyBestSellers: boolean;
  onlySale: boolean;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
}

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: "success" | "info" | "error";
}

interface StoreContextType {
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;

  // Filter state
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Recently Viewed
  recentlyViewed: Product[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: string, color: Product["colors"][0], quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  shippingFee: number;
  finalTotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // User & Auth
  currentUser: UserProfile | null;
  loginUser: (email: string, name?: string, role?: "customer" | "admin") => void;
  logoutUser: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  saveAddress: (address: Omit<Address, "id">, addressId?: string) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  // Orders
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (paymentMethod: "Cash on Delivery (COD)" | "Online Payment (Razorpay / UPI / Cards)", address: Address) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order["orderStatus"]) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date" | "verified">) => void;
  getProductReviews: (productId: string) => Review[];

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: "success" | "info" | "error") => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  gender: "all",
  category: "all",
  priceRange: [0, 15000],
  selectedSizes: [],
  selectedColors: [],
  selectedBrands: [],
  minRating: 0,
  onlyNewArrivals: false,
  onlyBestSellers: false,
  onlySale: false,
  sortBy: "featured",
};

const DEFAULT_USER: UserProfile = {
  id: "usr-01",
  name: "Anchal Yadav",
  email: "anchalyadav092006@gmail.com",
  phone: "+91 98765 43210",
  role: "customer",
  savedAddresses: [
    {
      id: "addr-1",
      name: "Anchal Yadav",
      phone: "+91 98765 43210",
      street: "Flat 402, Signature Palms, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      type: "Home",
      isDefault: true,
    },
    {
      id: "addr-2",
      name: "Anchal Yadav (Studio)",
      phone: "+91 98765 43210",
      street: "Block B, Maker Chambers V, Nariman Point",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400021",
      type: "Office",
      isDefault: false,
    },
  ],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View
  const [currentView, setCurrentView] = useState<string>("home");
  const [selectedProductId, setSelectedProductIdState] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Recently Viewed state
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("luxewear_recent");
      return saved ? JSON.parse(saved) : ["lw-001", "lw-002", "lw-003"];
    } catch {
      return ["lw-001", "lw-002", "lw-003"];
    }
  });

  const setSelectedProductId = (id: string | null) => {
    setSelectedProductIdState(id);
    if (id) {
      setRecentlyViewedIds((prev) => {
        const next = [id, ...prev.filter((i) => i !== id)].slice(0, 8);
        try {
          localStorage.setItem("luxewear_recent", JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  };

  // Products state (persisted)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("luxewear_products");
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart state (persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("luxewear_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state (persisted)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("luxewear_wishlist");
      return saved ? JSON.parse(saved) : ["lw-001", "lw-003"];
    } catch {
      return ["lw-001", "lw-003"];
    }
  });

  // User authentication state (persisted)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("luxewear_user");
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Orders state (persisted)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem("luxewear_orders");
      if (saved) return JSON.parse(saved);
      // Sample historical order for rich preview
      return [
        {
          id: "LX-94021",
          date: "14 Oct 2026",
          items: [
            {
              id: "item-prev-1",
              productId: "lw-003",
              product: INITIAL_PRODUCTS[2],
              size: "L",
              color: INITIAL_PRODUCTS[2].colors[0],
              quantity: 1,
            },
          ],
          subtotal: 3499,
          discount: 350,
          couponCode: "FIRST10",
          shippingFee: 0,
          total: 3149,
          paymentMethod: "Online Payment (Razorpay / UPI / Cards)",
          paymentStatus: "Paid",
          shippingAddress: DEFAULT_USER.savedAddresses[0],
          orderStatus: "Out for Delivery",
          trackingNumber: "LXTRK-88291039IN",
          estimatedDelivery: "21 Oct 2026",
        },
      ];
    } catch {
      return [];
    }
  });

  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Reviews state (persisted)
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem("luxewear_reviews");
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("LUXE20");

  // Filters state
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (title: string, description?: string, type: "success" | "info" | "error" = "success") => {
    const id = "toast-" + Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("luxewear_products", JSON.stringify(products));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem("luxewear_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("luxewear_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem("luxewear_user", JSON.stringify(currentUser));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("luxewear_orders", JSON.stringify(orders));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("luxewear_reviews", JSON.stringify(reviews));
    } catch (e) {
      console.warn("Storage sync error", e);
    }
  }, [reviews]);

  // Product management (CRUD)
  const addProduct = (newProd: Omit<Product, "id" | "createdAt">) => {
    const product: Product = {
      ...newProd,
      id: "lw-" + Date.now().toString(36),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [product, ...prev]);
    showToast("Product Created", `${product.name} is now live in catalog.`);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast("Product Updated", "Inventory and catalog details refreshed.");
  };

  const deleteProduct = (id: string) => {
    const prod = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Product Removed", `${prod?.name || "Item"} has been deleted.`);
  };

  const getProductById = (id: string) => products.find((p) => p.id === id);

  // Cart operations
  const addToCart = (
    product: Product,
    size: string,
    color: Product["colors"][0],
    quantity = 1
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.size === size &&
          item.color.name === color.name
      );
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          quantity: next[existingIdx].quantity + quantity,
        };
        return next;
      }
      return [
        ...prev,
        {
          id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: product.id,
          product,
          size,
          color,
          quantity,
        },
      ];
    });
    showToast("Added to Shopping Bag", `${product.name} (${size} · ${color.name})`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast("Item Removed", "Bag updated successfully.", "info");
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // Coupon application logic
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const coupon = SAMPLE_COUPONS.find((c) => c.code === clean);
    if (!coupon) {
      return { success: false, message: "Invalid voucher code. Try LUXE20 or FIRST10." };
    }
    if (subtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Voucher applies on minimum cart value of ₹${coupon.minSpend.toLocaleString("en-IN")}.`,
      };
    }
    setAppliedCoupon(clean);
    showToast("Coupon Applied", `${clean}: ${coupon.description}`);
    return { success: true, message: "Promo discount applied!" };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon Removed", "Discount has been deducted.", "info");
  };

  let discountAmount = 0;
  if (appliedCoupon) {
    const coupon = SAMPLE_COUPONS.find((c) => c.code === appliedCoupon);
    if (coupon) {
      if (coupon.discountPercent) {
        discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
      } else if (coupon.flatDiscount) {
        discountAmount = coupon.flatDiscount;
      }
    }
  }

  // Delivery: Free for orders >= 999, else ₹99
  const shippingFee = subtotal === 0 || subtotal >= 999 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const prod = products.find((p) => p.id === productId);
      if (exists) {
        showToast("Removed from Wishlist", prod?.name || "Item", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist", prod?.name || "Item", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // User & Auth
  const loginUser = (email: string, name?: string, role: "customer" | "admin" = "customer") => {
    const user: UserProfile = {
      id: "usr-" + Date.now().toString(36),
      name: name || (email.split("@")[0].replace(/[^a-zA-Z]/g, " ") || "Valued Patron"),
      email,
      phone: "+91 98765 43210",
      role: role || (email.toLowerCase().includes("admin") ? "admin" : "customer"),
      savedAddresses: currentUser?.savedAddresses || DEFAULT_USER.savedAddresses,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    showToast("Welcome to LUXE WEAR", `Signed in as ${user.name}`);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast("Signed Out", "You have been logged out securely.", "info");
  };

  const saveAddress = (address: Omit<Address, "id">, addressId?: string) => {
    if (!currentUser) return;
    let nextAddresses: Address[] = [];
    if (addressId) {
      nextAddresses = currentUser.savedAddresses.map((addr) =>
        addr.id === addressId ? { ...address, id: addressId } : addr
      );
    } else {
      const newAddr: Address = {
        ...address,
        id: "addr-" + Date.now().toString(36),
      };
      if (address.isDefault || currentUser.savedAddresses.length === 0) {
        nextAddresses = currentUser.savedAddresses.map((a) => ({ ...a, isDefault: false }));
        nextAddresses.push({ ...newAddr, isDefault: true });
      } else {
        nextAddresses = [...currentUser.savedAddresses, newAddr];
      }
    }
    setCurrentUser({ ...currentUser, savedAddresses: nextAddresses });
    showToast("Address Saved", "Delivery address updated.");
  };

  const deleteAddress = (addressId: string) => {
    if (!currentUser) return;
    const nextAddresses = currentUser.savedAddresses.filter((a) => a.id !== addressId);
    setCurrentUser({ ...currentUser, savedAddresses: nextAddresses });
    showToast("Address Removed", "Address deleted from your address book.", "info");
  };

  const setDefaultAddress = (addressId: string) => {
    if (!currentUser) return;
    const nextAddresses = currentUser.savedAddresses.map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    setCurrentUser({ ...currentUser, savedAddresses: nextAddresses });
    showToast("Default Address Set", "Preferred shipping address updated.");
  };

  // Orders
  const placeOrder = async (
    paymentMethod: "Cash on Delivery (COD)" | "Online Payment (Razorpay / UPI / Cards)",
    address: Address
  ): Promise<Order> => {
    const orderId = "LX-" + Math.floor(10000 + Math.random() * 90000);
    const trackingNo = "LXTRK-" + Math.floor(100000000 + Math.random() * 900000000) + "IN";

    // Estimated delivery in 3 days
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);
    const estDateStr = estDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const newOrder: Order = {
      id: orderId,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      couponCode: appliedCoupon || undefined,
      shippingFee,
      total: finalTotal,
      paymentMethod,
      paymentStatus: paymentMethod === "Cash on Delivery (COD)" ? "Pending Payment on Delivery" : "Paid",
      shippingAddress: address,
      orderStatus: "Order Confirmed",
      trackingNumber: trackingNo,
      estimatedDelivery: estDateStr,
    };

    // Update product stock counts
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = cart.filter((item) => item.productId === prod.id);
        if (cartMatch.length > 0) {
          const qtyBought = cartMatch.reduce((sum, item) => sum + item.quantity, 0);
          const nextStock = Math.max(0, prod.stockCount - qtyBought);
          return {
            ...prod,
            stockCount: nextStock,
            inStock: nextStock > 0,
          };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    clearCart();
    setCurrentView("order-confirmation");
    showToast("Order Confirmed", `Order #${orderId} has been successfully placed.`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["orderStatus"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    showToast("Order Status Updated", `Order #${orderId} marked as ${status}.`);
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, "id" | "date" | "verified">) => {
    const newRev: Review = {
      ...reviewData,
      id: "rev-" + Date.now().toString(36),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      verified: true,
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter((r) => r.productId === reviewData.productId), newRev];
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    updateProduct(reviewData.productId, {
      rating: parseFloat(avg.toFixed(2)),
      reviewsCount: prodReviews.length,
    });
    showToast("Review Published", "Thank you for sharing your experience.");
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter((r) => r.productId === productId);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filtered products calculation
  const filteredProducts = products.filter((prod) => {
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchCat = prod.category.toLowerCase().includes(q);
      const matchDesc = prod.description.toLowerCase().includes(q);
      const matchFabric = prod.fabric.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchDesc && !matchFabric) return false;
    }

    // Gender filter
    if (filters.gender !== "all") {
      if (prod.gender !== "unisex" && prod.gender !== filters.gender) {
        return false;
      }
    }

    // Category filter
    if (filters.category !== "all" && prod.category !== filters.category) {
      return false;
    }

    // Price range
    if (prod.price < filters.priceRange[0] || prod.price > filters.priceRange[1]) {
      return false;
    }

    // Sizes
    if (filters.selectedSizes.length > 0) {
      const hasSize = filters.selectedSizes.some((s) => prod.sizes.includes(s));
      if (!hasSize) return false;
    }

    // Colors
    if (filters.selectedColors.length > 0) {
      const hasColor = filters.selectedColors.some((c) =>
        prod.colors.some((col) => col.name.toLowerCase().includes(c.toLowerCase()))
      );
      if (!hasColor) return false;
    }

    // Brand filter
    if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(prod.brand)) {
      return false;
    }

    // Sale filter
    if (filters.onlySale && prod.discountPercent <= 0) {
      return false;
    }

    // Min rating
    if (filters.minRating > 0 && prod.rating < filters.minRating) {
      return false;
    }

    // New arrivals & Best sellers
    if (filters.onlyNewArrivals && !prod.isNewArrival) return false;
    if (filters.onlyBestSellers && !prod.isBestSeller) return false;

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === "price-asc") return a.price - b.price;
    if (filters.sortBy === "price-desc") return b.price - a.price;
    if (filters.sortBy === "rating") return b.rating - a.rating;
    if (filters.sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // Default featured
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  const recentlyViewed = recentlyViewedIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        quickViewProduct,
        setQuickViewProduct,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        filters,
        setFilters,
        resetFilters,
        filteredProducts,
        recentlyViewed,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        subtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discountAmount,
        shippingFee,
        finalTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentUser,
        loginUser,
        logoutUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        currentOrder,
        placeOrder,
        updateOrderStatus,
        reviews,
        addReview,
        getProductReviews,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
