import React, { useState } from "react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";
import { X, Heart, Star, Check, ShieldCheck, Truck, RefreshCw } from "lucide-react";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProductId, setCurrentView } = useStore();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  const handleViewFullDetails = () => {
    setSelectedProductId(product.id);
    setCurrentView("product-detail");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-[#FAF9F5] border border-[#E8E2D7] w-full max-w-4xl shadow-2xl rounded-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-[#71717A] hover:text-[#18181B] bg-white/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery View */}
          <div className="bg-[#F3EFE6] p-6 flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xs bg-[#E8E2D7]">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail switcher if multiple images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-18 overflow-hidden border transition-all ${
                      activeImageIdx === idx
                        ? "border-[#18181B] scale-105"
                        : "border-[#D4C7B5] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Purchase Form */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[85vh]">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#71717A]">
                <span className="uppercase tracking-wider font-medium">{product.gender}</span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#8C7355] font-semibold">{product.stockCount} in stock</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B]">
                {product.name}
              </h2>

              {/* Price & Discount */}
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-[#18181B] tabular-nums">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="font-mono text-sm text-[#A1A1AA] line-through tabular-nums">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-[#8C7355] font-semibold">
                      Save {product.discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-2 text-xs text-[#71717A] pb-2">
                <div className="flex text-[#8C7355]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(product.rating) ? "fill-[#8C7355]" : "text-[#D4C7B5]"}
                    />
                  ))}
                </div>
                <span className="font-mono tabular-nums text-sm font-semibold text-[#18181B]">
                  {product.rating}
                </span>
                <span>({product.reviewsCount} customer reviews)</span>
              </div>

              <p className="text-sm text-[#52525B] leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Select Color */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                Color: <span className="font-normal text-[#71717A]">{selectedColor.name}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xs text-xs transition-all ${
                      selectedColor.name === color.name
                        ? "border-[#18181B] bg-white text-[#18181B] font-medium ring-1 ring-[#18181B]"
                        : "border-[#E8E2D7] bg-[#FAF9F5] text-[#71717A] hover:border-[#18181B]"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: color.hex }} />
                    <span>{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Select Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="uppercase tracking-wider font-semibold text-[#18181B]">
                  Size: <span className="font-normal text-[#71717A]">{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={handleViewFullDetails}
                  className="text-[#8C7355] underline hover:text-[#5A4634]"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 text-xs font-mono font-medium rounded-xs border text-center transition-all ${
                      selectedSize === sz
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-white text-[#18181B] border-[#E8E2D7] hover:border-[#18181B]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#E8E2D7] bg-white rounded-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-sm hover:bg-[#F3EFE6] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-mono tabular-nums font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                    className="px-3 py-2 text-sm hover:bg-[#F3EFE6] transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#18181B] hover:bg-[#27272A] text-white py-3 px-6 rounded-xs text-xs uppercase tracking-widest font-semibold transition-all shadow-sm active:scale-[0.99]"
                >
                  Add to Shopping Bag
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 border rounded-xs transition-colors ${
                    isSaved
                      ? "border-[#8C7355] bg-[#8C7355]/10 text-[#8C7355]"
                      : "border-[#E8E2D7] hover:border-[#18181B] text-[#18181B]"
                  }`}
                  aria-label="Wishlist toggle"
                >
                  <Heart size={18} className={isSaved ? "fill-[#8C7355]" : ""} />
                </button>
              </div>

              <button
                onClick={handleViewFullDetails}
                className="w-full text-center text-xs uppercase tracking-wider text-[#8C7355] hover:text-[#5A4634] font-medium py-1"
              >
                View Complete Product Details & Reviews →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
