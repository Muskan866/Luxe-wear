export interface ProductColor {
  name: string;
  hex: string;
}

export type ProductCategory =
  | "T-Shirts & Shirts"
  | "Jeans & Trousers"
  | "Hoodies & Sweatshirts"
  | "Jackets"
  | "Dresses & Ethnic Wear"
  | "Accessories";

export type GenderCategory = "men" | "women" | "unisex";

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  gender: GenderCategory;
  category: ProductCategory;
  price: number; // in INR (₹)
  originalPrice: number;
  discountPercent: number;
  sizes: string[]; // e.g. ["XS", "S", "M", "L", "XL", "XXL"]
  colors: ProductColor[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  brand: string; // e.g. "LUXE Atelier", "LUXE Studio", "LUXE Essentials"
  images: string[];
  description: string;
  details: string[];
  fabric: string;
  care: string;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  product: Product;
  size: string;
  color: ProductColor;
  quantity: number;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  type: "Home" | "Office";
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
  savedAddresses: Address[];
}

export type OrderStatus =
  | "Order Confirmed"
  | "Processing"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: "Cash on Delivery (COD)" | "Online Payment (Razorpay / UPI / Cards)";
  paymentStatus: "Paid" | "Pending Payment on Delivery";
  shippingAddress: Address;
  orderStatus: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
}
