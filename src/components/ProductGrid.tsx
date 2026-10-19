import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "./ProductCard";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Search,
} from "lucide-react";
import { ProductCategory } from "../types";

const ALL_CATEGORIES: ProductCategory[] = [
  "T-Shirts & Shirts",
  "Jeans & Trousers",
  "Hoodies & Sweatshirts",
  "Jackets",
  "Dresses & Ethnic Wear",
  "Accessories",
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = ["Beige", "Black", "Camel", "White", "Gray", "Navy", "Taupe"];
const BRANDS = ["LUXE Atelier", "LUXE Studio", "LUXE Essentials", "LUXE Heritage"];

export const ProductGrid: React.FC = () => {
  const {
    filteredProducts,
    filters,
    setFilters,
    resetFilters,
    products,
    recentlyViewed,
  } = useStore();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const toggleSize = (size: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(size)
        ? prev.selectedSizes.filter((s) => s !== size)
        : [...prev.selectedSizes, size],
    }));
  };

  const toggleColor = (color: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(color)
        ? prev.selectedColors.filter((c) => c !== color)
        : [...prev.selectedColors, color],
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      selectedBrands: prev.selectedBrands.includes(brand)
        ? prev.selectedBrands.filter((b) => b !== brand)
        : [...prev.selectedBrands, brand],
    }));
  };

  const activeFiltersCount =
    (filters.gender !== "all" ? 1 : 0) +
    (filters.category !== "all" ? 1 : 0) +
    filters.selectedSizes.length +
    filters.selectedColors.length +
    filters.selectedBrands.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.onlyNewArrivals ? 1 : 0) +
    (filters.onlyBestSellers ? 1 : 0) +
    (filters.onlySale ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E2D7]">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8C7355] font-semibold">
            LUXE WEAR Catalog
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#18181B] tracking-tight">
            {filters.category !== "all"
              ? filters.category
              : filters.gender !== "all"
              ? `${filters.gender.toUpperCase()}'S READY-TO-WEAR`
              : filters.onlyNewArrivals
              ? "NEW ARRIVALS 2026"
              : filters.onlyBestSellers
              ? "TIMELESS BEST SELLERS"
              : "ALL COLLECTIONS"}
          </h2>
          <p className="text-sm text-[#71717A]">
            Showing {filteredProducts.length} curated {filteredProducts.length === 1 ? "design" : "designs"}
          </p>
        </div>

        {/* Sort and Filter Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Filter toggle button */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="flex items-center gap-2 border border-[#E8E2D7] bg-white text-[#18181B] py-2 px-4 rounded text-xs uppercase tracking-wider font-semibold hover:border-[#18181B] transition-colors"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#18181B] text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono tabular-nums">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as any,
                }))
              }
              className="appearance-none bg-white border border-[#E8E2D7] text-[#18181B] py-2 pl-3 pr-8 rounded text-xs uppercase tracking-wider font-medium hover:border-[#18181B] focus:outline-none focus:border-[#18181B] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#71717A]"
            />
          </div>
        </div>
      </div>

      {/* Quick Category Segmented Buttons (Interactive Filter Controls as approved by constitution) */}
      <div className="flex items-center gap-2 py-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              category: "all",
              gender: "all",
              onlyNewArrivals: false,
              onlyBestSellers: false,
            }))
          }
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded whitespace-nowrap transition-colors ${
            filters.category === "all" &&
            filters.gender === "all" &&
            !filters.onlyNewArrivals &&
            !filters.onlyBestSellers
              ? "bg-[#18181B] text-white"
              : "bg-white border border-[#E8E2D7] text-[#52525B] hover:text-[#18181B]"
          }`}
        >
          All Items
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              gender: "men",
              category: "all",
              onlyNewArrivals: false,
              onlyBestSellers: false,
            }))
          }
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded whitespace-nowrap transition-colors ${
            filters.gender === "men" && filters.category === "all"
              ? "bg-[#18181B] text-white"
              : "bg-white border border-[#E8E2D7] text-[#52525B] hover:text-[#18181B]"
          }`}
        >
          Men's
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              gender: "women",
              category: "all",
              onlyNewArrivals: false,
              onlyBestSellers: false,
            }))
          }
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded whitespace-nowrap transition-colors ${
            filters.gender === "women" && filters.category === "all"
              ? "bg-[#18181B] text-white"
              : "bg-white border border-[#E8E2D7] text-[#52525B] hover:text-[#18181B]"
          }`}
        >
          Women's
        </button>

        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                category: prev.category === cat ? "all" : cat,
                onlyNewArrivals: false,
                onlyBestSellers: false,
              }))
            }
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded whitespace-nowrap transition-colors ${
              filters.category === cat
                ? "bg-[#18181B] text-white"
                : "bg-white border border-[#E8E2D7] text-[#52525B] hover:text-[#18181B]"
            }`}
          >
            {cat}
          </button>
        ))}

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              onlyNewArrivals: !prev.onlyNewArrivals,
              onlyBestSellers: false,
            }))
          }
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded whitespace-nowrap transition-colors ${
            filters.onlyNewArrivals
              ? "bg-[#8C7355] text-white"
              : "bg-white border border-[#E8E2D7] text-[#52525B] hover:text-[#18181B]"
          }`}
        >
          New Arrivals
        </button>

        <button
          onClick={() =>
            setFilters((prev) => ({
              ...prev,
              onlyBestSellers: !prev.onlyBestSellers,
              onlyNewArrivals: false,
            }))
          }
          className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded whitespace-nowrap transition-colors ${
            filters.onlyBestSellers
              ? "bg-[#8C7355] text-white"
              : "bg-white border border-[#E8E2D7] text-[#52525B] hover:text-[#18181B]"
          }`}
        >
          Best Sellers
        </button>
      </div>

      {/* Collapsible Filter Panel */}
      {isFilterDrawerOpen && (
        <div className="bg-white border border-[#E8E2D7] p-6 mb-8 rounded-sm shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-[#F0ECE1]">
            <span className="text-xs uppercase tracking-wider font-bold text-[#18181B]">
              Refine Search & Attributes
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={resetFilters}
                className="text-xs text-[#8C7355] hover:text-[#5A4634] flex items-center gap-1"
              >
                <RotateCcw size={12} />
                <span>Reset All</span>
              </button>
              <button
                onClick={() => setIsFilterDrawerOpen(false)}
                className="text-[#71717A] hover:text-[#18181B]"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6">
            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                Price Limit:{" "}
                <span className="font-mono tabular-nums text-[#8C7355]">
                  Up to ₹{filters.priceRange[1].toLocaleString("en-IN")}
                </span>
              </label>
              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: [prev.priceRange[0], parseInt(e.target.value)],
                  }))
                }
                className="w-full accent-[#18181B] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#71717A]">
                <span>₹1,000</span>
                <span>₹15,000</span>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`w-9 h-8 text-xs font-mono rounded-xs border transition-colors ${
                      filters.selectedSizes.includes(size)
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-[#FAF9F5] text-[#18181B] border-[#E8E2D7] hover:border-[#18181B]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                Color Tones
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((col) => (
                  <button
                    key={col}
                    onClick={() => toggleColor(col)}
                    className={`px-2.5 py-1 text-xs rounded-xs border transition-colors ${
                      filters.selectedColors.includes(col)
                        ? "bg-[#8C7355] text-white border-[#8C7355]"
                        : "bg-[#FAF9F5] text-[#52525B] border-[#E8E2D7] hover:border-[#18181B]"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand / Atelier Lines */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                Collection Brand
              </label>
              <div className="flex flex-col gap-1.5 text-xs">
                {BRANDS.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={`text-left px-2.5 py-1 text-xs rounded-xs border transition-colors ${
                      filters.selectedBrands.includes(brand)
                        ? "bg-[#18181B] text-white border-[#18181B]"
                        : "bg-[#FAF9F5] text-[#52525B] border-[#E8E2D7] hover:border-[#18181B]"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Ratings */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                Customer Rating
              </label>
              <div className="flex flex-col gap-1 text-xs">
                {[4.5, 4.0, 0].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="minRating"
                      checked={filters.minRating === r}
                      onChange={() => setFilters((prev) => ({ ...prev, minRating: r }))}
                      className="accent-[#18181B]"
                    />
                    <span className="text-[#52525B]">
                      {r === 0 ? "All Ratings" : `${r} Stars & Above`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Search & Filters Pill Bar (removable filters) */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-6 text-xs text-[#52525B]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#71717A]">
            Active filters:
          </span>

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8E2D7] px-2.5 py-1 rounded">
              Search: "{filters.searchQuery}"
              <button
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                className="hover:text-red-600"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.onlySale && (
            <span className="inline-flex items-center gap-1.5 bg-[#8C7355] text-white px-2.5 py-1 rounded">
              On Sale
              <button
                onClick={() => setFilters((prev) => ({ ...prev, onlySale: false }))}
                className="hover:text-[#FAF9F5]"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.gender !== "all" && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8E2D7] px-2.5 py-1 rounded capitalize">
              Gender: {filters.gender}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, gender: "all" }))}
                className="hover:text-red-600"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.category !== "all" && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8E2D7] px-2.5 py-1 rounded">
              {filters.category}
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: "all" }))}
                className="hover:text-red-600"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filters.selectedBrands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1.5 bg-white border border-[#E8E2D7] px-2.5 py-1 rounded font-medium text-[#18181B]"
            >
              Brand: {b}
              <button onClick={() => toggleBrand(b)} className="hover:text-red-600">
                <X size={12} />
              </button>
            </span>
          ))}

          {filters.selectedSizes.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 bg-white border border-[#E8E2D7] px-2.5 py-1 rounded font-mono"
            >
              Size: {s}
              <button onClick={() => toggleSize(s)} className="hover:text-red-600">
                <X size={12} />
              </button>
            </span>
          ))}

          {filters.selectedColors.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 bg-white border border-[#E8E2D7] px-2.5 py-1 rounded"
            >
              Color: {c}
              <button onClick={() => toggleColor(c)} className="hover:text-red-600">
                <X size={12} />
              </button>
            </span>
          ))}

          <button
            onClick={resetFilters}
            className="text-xs text-[#8C7355] hover:underline font-medium ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white border border-[#E8E2D7] rounded-sm p-8 space-y-4">
          <p className="font-serif text-2xl text-[#18181B]">No garments match your filters</p>
          <p className="text-sm text-[#71717A] max-w-md mx-auto">
            Try adjusting your price range, clearing specific sizes, or exploring our full Autumn/Winter 2026 catalog.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 inline-flex items-center gap-2 bg-[#18181B] text-white py-2.5 px-6 rounded text-xs uppercase tracking-widest font-semibold hover:bg-[#27272A] transition-colors"
          >
            <RotateCcw size={14} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

      {/* Recently Viewed Products Section */}
      {recentlyViewed.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#E8E2D7]">
          <div className="space-y-1 mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C7355] font-semibold">
              Your Browsing History
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B]">
              Recently Viewed Pieces
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
