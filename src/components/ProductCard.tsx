import React, { useState } from "react";
import { Product } from "../types";
import { useStore } from "../context/StoreContext";
import { Heart, Eye, ShoppingBag, Star, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    setSelectedProductId,
    setCurrentView,
  } = useStore();

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [isHovered, setIsHovered] = useState(false);
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isSaved = isInWishlist(product.id);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setCurrentView("product-detail");
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.sizes.length > 1 && !isSizeSelectorOpen) {
      setIsSizeSelectorOpen(true);
      return;
    }
    addToCart(product, selectedSize, selectedColor, 1);
    setIsSizeSelectorOpen(false);
  };

  const handleSelectSizeAndAdd = (size: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSize(size);
    addToCart(product, size, selectedColor, 1);
    setIsSizeSelectorOpen(false);
  };

  return (
    <div
      className="group relative flex flex-col bg-white border border-[#E8E2D7] rounded-sm overflow-hidden hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsSizeSelectorOpen(false);
      }}
    >
      {/* Visual Asset Container (takes ~70% height) */}
      <div
        onClick={handleCardClick}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F1EA] cursor-pointer"
      >
        {!imgError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#EAE5DC] text-[#71717A] p-4 text-center">
            <span className="font-serif text-lg text-[#18181B] font-medium">{product.name}</span>
            <span className="text-xs uppercase tracking-wider mt-1">{product.category}</span>
          </div>
        )}

        {/* Quiet Subtle Text Tags (Unboxed, NO pill badges) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-[#18181B] text-white text-[10px] tracking-widest uppercase px-2 py-0.5 font-medium">
              New Arrival
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="bg-[#8C7355] text-white text-[10px] tracking-widest uppercase px-2 py-0.5 font-medium">
              Best Seller
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-white/90 text-[#18181B] text-[10px] tracking-wider uppercase px-2 py-0.5 font-mono font-medium">
              {product.discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-[#18181B] hover:text-[#8C7355] hover:bg-white transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355]"
          aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={16}
            className={isSaved ? "fill-[#8C7355] text-[#8C7355]" : "text-[#18181B]"}
          />
        </button>

        {/* Quick View Button (Shows on Hover) */}
        <div className="absolute bottom-3 inset-x-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="w-full bg-white/95 backdrop-blur-sm text-[#18181B] hover:bg-[#18181B] hover:text-white text-xs uppercase tracking-wider font-semibold py-2.5 px-3 rounded-xs shadow transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={14} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Information Section */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          {/* Metadata line with typographic separators (anti-slop rule) */}
          <div className="flex items-center gap-1.5 text-xs text-[#71717A]">
            <span className="uppercase tracking-wider text-[10px] font-semibold text-[#8C7355]">{product.brand || "LUXE Atelier"}</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase tracking-wider text-[11px] font-medium">{product.gender}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={handleCardClick}
            className="font-serif text-base font-semibold text-[#18181B] hover:text-[#8C7355] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-[#71717A] pt-0.5">
            <div className="flex items-center text-[#8C7355]">
              <Star size={12} className="fill-[#8C7355]" />
            </div>
            <span className="font-mono tabular-nums text-[12px] text-[#18181B] font-medium">
              {product.rating}
            </span>
            <span className="text-[11px] text-[#A1A1AA]">
              ({product.reviewsCount})
            </span>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(color);
              }}
              className={`w-3.5 h-3.5 rounded-full border transition-transform ${
                selectedColor.name === color.name
                  ? "scale-125 border-[#18181B] ring-1 ring-[#18181B]/40"
                  : "border-black/20 hover:scale-110"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select color ${color.name}`}
            />
          ))}
          <span className="text-[11px] text-[#71717A] ml-1">
            {selectedColor.name}
          </span>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-[#F0ECE1] flex items-center justify-between gap-2">
          {/* Prices */}
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-semibold text-base text-[#18181B] tabular-nums">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-mono text-xs text-[#A1A1AA] line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Quick Add to Bag / Size Dropdown Trigger */}
          <div className="relative">
            <button
              onClick={handleQuickAdd}
              className="p-2 text-[#18181B] hover:text-white hover:bg-[#18181B] border border-[#E8E2D7] rounded transition-colors"
              title="Add to bag"
              aria-label={`Add ${product.name} to bag`}
            >
              <ShoppingBag size={15} />
            </button>

            {/* Quick Size Popover */}
            {isSizeSelectorOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-2 bg-white border border-[#E8E2D7] shadow-xl p-2.5 rounded-sm z-30 min-w-[140px] animate-fadeIn"
              >
                <p className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold mb-1.5">
                  Select Size
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={(e) => handleSelectSizeAndAdd(sz, e)}
                      className={`text-xs py-1 px-1.5 text-center border font-mono rounded-xs transition-colors ${
                        selectedSize === sz
                          ? "bg-[#18181B] text-white border-[#18181B]"
                          : "border-[#E8E2D7] hover:border-[#18181B] text-[#18181B]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
