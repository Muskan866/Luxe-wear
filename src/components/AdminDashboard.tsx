import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Product, ProductCategory, GenderCategory, OrderStatus } from "../types";
import {
  ShieldCheck,
  Package,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Search,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    setCurrentView,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    gender: "men" as GenderCategory,
    category: "Jackets" as ProductCategory,
    brand: "LUXE Atelier",
    price: 3999,
    originalPrice: 5999,
    discountPercent: 33,
    stockCount: 20,
    sizes: "S, M, L, XL",
    colors: "Beige (#C7B89F), Black (#18181B)",
    images: "/src/assets/images/hero_fashion_model_1792439063989.jpg",
    description: "Tailored minimalist silhouette in premium organic weave.",
    fabric: "100% GOTS Organic Cotton",
    care: "Dry clean or gentle cold wash.",
    isNewArrival: true,
    isBestSeller: false,
    isFeatured: true,
  });

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalInventoryUnits = products.reduce((sum, p) => sum + p.stockCount, 0);
  const lowStockCount = products.filter((p) => p.stockCount < 15).length;

  const handleOpenAdd = () => {
    setEditingProductId(null);
    setFormData({
      name: "",
      gender: "men",
      category: "Jackets",
      brand: "LUXE Atelier",
      price: 3999,
      originalPrice: 5999,
      discountPercent: 33,
      stockCount: 20,
      sizes: "S, M, L, XL",
      colors: "Camel (#C49A6C), Charcoal (#2C2D30)",
      images: "/src/assets/images/hero_fashion_model_1792439063989.jpg",
      description: "Modern tailored silhouette with unstructured Italian drape.",
      fabric: "100% Virgin Melton Wool",
      care: "Dry clean only.",
      isNewArrival: true,
      isBestSeller: false,
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProductId(p.id);
    setFormData({
      name: p.name,
      gender: p.gender,
      category: p.category,
      brand: p.brand || "LUXE Atelier",
      price: p.price,
      originalPrice: p.originalPrice,
      discountPercent: p.discountPercent,
      stockCount: p.stockCount,
      sizes: p.sizes.join(", "),
      colors: p.colors.map((c) => `${c.name} (${c.hex})`).join(", "),
      images: p.images.join(", "),
      description: p.description,
      fabric: p.fabric,
      care: p.care,
      isNewArrival: p.isNewArrival,
      isBestSeller: p.isBestSeller,
      isFeatured: p.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedSizes = formData.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const parsedColors = formData.colors.split(",").map((str) => {
      const match = str.match(/(.*)\s*\((#[0-9a-fA-F]{3,6})\)/);
      if (match) {
        return { name: match[1].trim(), hex: match[2].trim() };
      }
      return { name: str.trim(), hex: "#18181B" };
    });
    const parsedImages = formData.images.split(",").map((img) => img.trim()).filter(Boolean);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formData.name,
        gender: formData.gender,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discountPercent: Number(formData.discountPercent),
        stockCount: Number(formData.stockCount),
        inStock: Number(formData.stockCount) > 0,
        sizes: parsedSizes,
        colors: parsedColors,
        images: parsedImages,
        description: formData.description,
        fabric: formData.fabric,
        care: formData.care,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        isFeatured: formData.isFeatured,
      });
    } else {
      addProduct({
        name: formData.name,
        gender: formData.gender,
        category: formData.category,
        brand: formData.brand,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discountPercent: Number(formData.discountPercent),
        stockCount: Number(formData.stockCount),
        inStock: Number(formData.stockCount) > 0,
        sizes: parsedSizes,
        colors: parsedColors,
        images: parsedImages,
        description: formData.description,
        details: [
          "Crafted in small-batch atelier productions",
          "Finished with hand-rolled seams",
        ],
        fabric: formData.fabric,
        care: formData.care,
        rating: 5.0,
        reviewsCount: 1,
        isNewArrival: formData.isNewArrival,
        isBestSeller: formData.isBestSeller,
        isFeatured: formData.isFeatured,
      });
    }

    setIsModalOpen(false);
  };

  const filteredCatalog = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D7]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView("home")}
            className="p-2 border border-[#E8E2D7] rounded-xs text-[#71717A] hover:text-[#18181B]"
            title="Return to Store"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-[#8C7355]" />
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B]">
                LUXE WEAR Atelier & Inventory Control
              </h1>
            </div>
            <p className="text-xs text-[#71717A]">
              Live product catalog administration, stock allocation, and order fulfillment.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#18181B] text-white py-2.5 px-5 rounded-xs text-xs uppercase tracking-wider font-semibold hover:bg-[#27272A] transition-colors flex items-center gap-2 self-start sm:self-auto shadow-xs"
        >
          <Plus size={15} />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="bg-white border border-[#E8E2D7] p-5 rounded-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-medium">
            Total Revenue
          </span>
          <p className="font-mono text-2xl font-bold text-[#18181B] tabular-nums">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-emerald-700 font-medium">
            From {orders.length} confirmed orders
          </span>
        </div>

        <div className="bg-white border border-[#E8E2D7] p-5 rounded-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-medium">
            Catalog Styles
          </span>
          <p className="font-mono text-2xl font-bold text-[#18181B] tabular-nums">
            {products.length}
          </p>
          <span className="text-[10px] text-[#71717A]">Active in digital storefront</span>
        </div>

        <div className="bg-white border border-[#E8E2D7] p-5 rounded-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-medium">
            Total Units in Stock
          </span>
          <p className="font-mono text-2xl font-bold text-[#18181B] tabular-nums">
            {totalInventoryUnits}
          </p>
          <span className="text-[10px] text-[#71717A]">Across all sizes & swatches</span>
        </div>

        <div className="bg-white border border-[#E8E2D7] p-5 rounded-sm space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-[#71717A] font-medium">
            Low Stock Alerts
          </span>
          <p className="font-mono text-2xl font-bold text-[#8C7355] tabular-nums">
            {lowStockCount}
          </p>
          <span className="text-[10px] text-amber-700 font-medium">
            Garments with &lt; 15 units remaining
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8E2D7] gap-8 mb-6 text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 transition-colors ${
            activeTab === "products"
              ? "border-b-2 border-[#18181B] text-[#18181B]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          Product Catalog & Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-colors ${
            activeTab === "orders"
              ? "border-b-2 border-[#18181B] text-[#18181B]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          Customer Orders & Dispatch ({orders.length})
        </button>
      </div>

      {/* Tab: Products List */}
      {activeTab === "products" && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 max-w-md bg-white border border-[#E8E2D7] px-3 py-2 rounded-xs">
            <Search size={16} className="text-[#71717A]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by title, category, SKU..."
              className="w-full text-xs bg-transparent focus:outline-none"
            />
          </div>

          <div className="bg-white border border-[#E8E2D7] rounded-sm overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E8E2D7] text-[#71717A] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (₹)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {filteredCatalog.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt=""
                          className="w-10 h-12 object-cover rounded-xs border border-[#E8E2D7]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-semibold text-[#18181B]">{prod.name}</p>
                          <span className="font-mono text-[10px] text-[#71717A]">
                            {prod.id.toUpperCase()} · {prod.gender}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#52525B]">{prod.category}</td>

                    <td className="py-3 px-4 font-mono font-medium text-[#18181B] tabular-nums">
                      ₹{prod.price.toLocaleString("en-IN")}
                      {prod.originalPrice > prod.price && (
                        <span className="text-[10px] text-[#A1A1AA] line-through ml-1.5">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`font-mono tabular-nums font-semibold ${
                          prod.stockCount < 15 ? "text-amber-700" : "text-emerald-700"
                        }`}
                      >
                        {prod.stockCount} units
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.isNewArrival && (
                          <span className="bg-[#18181B] text-white text-[9px] px-1.5 py-0.5 rounded">
                            New
                          </span>
                        )}
                        {prod.isBestSeller && (
                          <span className="bg-[#8C7355] text-white text-[9px] px-1.5 py-0.5 rounded">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(prod)}
                        className="p-1.5 text-[#52525B] hover:text-[#18181B] border border-[#E8E2D7] rounded-xs"
                        title="Edit product"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${prod.name}?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 text-[#A1A1AA] hover:text-red-700 border border-[#E8E2D7] rounded-xs"
                        title="Delete product"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Orders Management */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#E8E2D7] rounded-sm overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-[#E8E2D7] text-[#71717A] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Total (₹)</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#FAF9F5] transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-[#18181B]">#{o.id}</p>
                      <p className="text-[10px] text-[#71717A]">{o.date}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#18181B]">{o.shippingAddress.name}</p>
                      <p className="text-[11px] text-[#71717A]">{o.shippingAddress.city}, {o.shippingAddress.state}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-[#18181B]">
                        {o.items.length} {o.items.length === 1 ? "piece" : "pieces"}
                      </span>
                      <p className="text-[10px] text-[#71717A] line-clamp-1">
                        {o.items.map((i) => i.product.name).join(", ")}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-[#18181B] block">
                        {o.paymentMethod.includes("COD") ? "COD" : "Prepaid Online"}
                      </span>
                      <span className="text-[10px] text-emerald-700">{o.paymentStatus}</span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-[#18181B] tabular-nums">
                      ₹{o.total.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={o.orderStatus}
                        onChange={(e) =>
                          updateOrderStatus(o.id, e.target.value as OrderStatus)
                        }
                        className="bg-[#FAF9F5] border border-[#E8E2D7] text-[#18181B] text-xs py-1 px-2 rounded-xs font-medium cursor-pointer"
                      >
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D7] w-full max-w-2xl rounded-sm p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
              <h3 className="font-serif text-lg font-semibold text-[#18181B]">
                {editingProductId ? "Edit Garment Specifications" : "Add New Garment to Catalog"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#71717A] hover:text-[#18181B]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as GenderCategory })
                    }
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs bg-white"
                  >
                    <option value="men">Men's</option>
                    <option value="women">Women's</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Collection Brand *</label>
                  <select
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs bg-white"
                  >
                    <option value="LUXE Atelier">LUXE Atelier</option>
                    <option value="LUXE Studio">LUXE Studio</option>
                    <option value="LUXE Essentials">LUXE Essentials</option>
                    <option value="LUXE Heritage">LUXE Heritage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ProductCategory })
                    }
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs bg-white"
                  >
                    <option value="T-Shirts & Shirts">T-Shirts & Shirts</option>
                    <option value="Jeans & Trousers">Jeans & Trousers</option>
                    <option value="Hoodies & Sweatshirts">Hoodies & Sweatshirts</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Dresses & Ethnic Wear">Dresses & Ethnic Wear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Price in ₹ *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Stock Count (Units)</label>
                  <input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) =>
                      setFormData({ ...formData, stockCount: Number(e.target.value) })
                    }
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Sizes (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#71717A] mb-1 font-medium">
                  Colors (Format: Name (#HEX), Name (#HEX))
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                />
              </div>

              <div>
                <label className="block text-[#71717A] mb-1 font-medium">
                  Image Path / URL (comma-separated for multi-image)
                </label>
                <input
                  type="text"
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full p-2.5 border border-[#E8E2D7] rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[#71717A] mb-1 font-medium">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Fabric Composition</label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Garment Care</label>
                  <input
                    type="text"
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) =>
                      setFormData({ ...formData, isNewArrival: e.target.checked })
                    }
                    className="accent-[#18181B]"
                  />
                  <span>Mark as New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) =>
                      setFormData({ ...formData, isBestSeller: e.target.checked })
                    }
                    className="accent-[#18181B]"
                  />
                  <span>Mark as Best Seller</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#F0ECE1]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 text-[#71717A] hover:text-[#18181B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#18181B] text-white py-2.5 px-6 rounded-xs font-semibold uppercase tracking-wider hover:bg-[#27272A]"
                >
                  {editingProductId ? "Update Garment" : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
