import React from "react";
import { useStore } from "../context/StoreContext";
import { Hero } from "./Hero";
import { ProductCard } from "./ProductCard";
import { ArrowRight, Sparkles, Tag, ShieldCheck, ChevronRight } from "lucide-react";

export const HomeView: React.FC = () => {
  const { products, setCurrentView, setFilters } = useStore();

  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  const navigateTo = (
    gender: "all" | "men" | "women",
    category = "all",
    extra?: { onlyNewArrivals?: boolean; onlyBestSellers?: boolean }
  ) => {
    setFilters((prev) => ({
      ...prev,
      gender,
      category: category as any,
      onlyNewArrivals: extra?.onlyNewArrivals || false,
      onlyBestSellers: extra?.onlyBestSellers || false,
      searchQuery: "",
    }));
    setCurrentView("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Visual Editorial Category Showcase (3-Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
              Curated Chapters
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#18181B] tracking-tight">
              Seasonal Collections
            </h2>
          </div>
          <button
            onClick={() => navigateTo("all")}
            className="text-xs uppercase tracking-widest font-semibold text-[#18181B] hover:text-[#8C7355] flex items-center gap-2 group transition-colors"
          >
            <span>Explore All 10 Categories</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1: Men's Tailoring */}
          <div
            onClick={() => navigateTo("men", "Jackets")}
            className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-[#E8E2D7] cursor-pointer shadow-xs"
          >
            <img
              src="/src/assets/images/men_collection_suit_1792439065640.jpg"
              alt="Men's unstructured tailoring"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#D4C7B5] font-mono">
                Men's Tailoring
              </span>
              <h3 className="font-serif text-2xl font-medium leading-snug">
                Architectural Overcoats & Pleated Trousers
              </h3>
              <p className="text-xs text-[#E8E2D7] flex items-center gap-1 group-hover:underline">
                <span>View Collection</span>
                <ChevronRight size={14} />
              </p>
            </div>
          </div>

          {/* Card 2: Women's Fluid Silks */}
          <div
            onClick={() => navigateTo("women", "Dresses & Ethnic Wear")}
            className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-[#E8E2D7] cursor-pointer shadow-xs"
          >
            <img
              src="/src/assets/images/women_collection_dress_1792439065141.jpg"
              alt="Women's silk dresses"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#D4C7B5] font-mono">
                Women's Ready-to-Wear
              </span>
              <h3 className="font-serif text-2xl font-medium leading-snug">
                Pleated Silk Georgette & Sculpted Blazers
              </h3>
              <p className="text-xs text-[#E8E2D7] flex items-center gap-1 group-hover:underline">
                <span>View Collection</span>
                <ChevronRight size={14} />
              </p>
            </div>
          </div>

          {/* Card 3: Heavyweight Essentials */}
          <div
            onClick={() => navigateTo("all", "Hoodies & Sweatshirts")}
            className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-[#E8E2D7] cursor-pointer shadow-xs"
          >
            <img
              src="/src/assets/images/product_luxe_hoodie_1792439065897.jpg"
              alt="Heavyweight organic cotton hoodies"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#D4C7B5] font-mono">
                Atelier Essentials
              </span>
              <h3 className="font-serif text-2xl font-medium leading-snug">
                480 GSM Heavyweight Organic French Terry
              </h3>
              <p className="text-xs text-[#E8E2D7] flex items-center gap-1 group-hover:underline">
                <span>View Collection</span>
                <ChevronRight size={14} />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. New Arrivals Carousel/Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
              Fresh From The Atelier
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#18181B] tracking-tight">
              New Arrivals
            </h2>
          </div>
          <button
            onClick={() => navigateTo("all", "all", { onlyNewArrivals: true })}
            className="text-xs uppercase tracking-widest font-semibold text-[#18181B] hover:text-[#8C7355] flex items-center gap-2 group transition-colors"
          >
            <span>See All New Pieces</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Promotional Banner (Clean editorial aesthetic, not gaudy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181B] text-[#FAF9F5] rounded-sm p-8 sm:p-12 relative overflow-hidden border border-[#27272A]">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C49A6C] font-semibold flex items-center gap-2">
              <Tag size={14} /> Private Atelier Privilege
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium leading-tight text-white">
              Complimentary 20% Saving on Your Autumn Wardrobe
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed">
              Apply code <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">LUXE20</strong> at checkout on orders exceeding ₹2,499. Includes express courier shipment & bespoke garment bag.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo("all")}
                className="bg-[#FAF9F5] text-[#18181B] hover:bg-[#E8E2D7] py-3 px-7 rounded-xs text-xs uppercase tracking-[0.2em] font-semibold transition-all inline-flex items-center gap-2"
              >
                <span>Shop The Private Sale</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Decorative subtle texture lines */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block opacity-10 pointer-events-none">
            <div className="w-full h-full border-l border-white/20 transform rotate-12" />
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
              Time-Honored Silhouettes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#18181B] tracking-tight">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => navigateTo("all", "all", { onlyBestSellers: true })}
            className="text-xs uppercase tracking-widest font-semibold text-[#18181B] hover:text-[#8C7355] flex items-center gap-2 group transition-colors"
          >
            <span>Explore All Best Sellers</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Brand Atelier Craftsmanship Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F5] border border-[#E8E2D7] rounded-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto">
            <img
              src="/src/assets/images/atelier_craft_story_1792439065996.jpg"
              alt="LUXE WEAR Atelier craftsmanship"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
              The Art of Longevity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#18181B] leading-tight text-balance">
              Designed with Architectural Integrity. Crafted to Outlast Trends.
            </h2>
            <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed">
              Every LUXE WEAR pattern begins with anatomical precision. From 13.5 oz Japanese selvedge denim woven on shuttle looms in Kurashiki to Normandy flax linen and Grade-A Mongolian cashmere, our pieces are cut for an effortless, sovereign presence.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigateTo("all")}
                className="border border-[#18181B] text-[#18181B] hover:bg-[#18181B] hover:text-white py-3 px-6 rounded-xs text-xs uppercase tracking-[0.2em] font-semibold transition-colors inline-flex items-center gap-2"
              >
                <span>Explore The Atelier Catalog</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
