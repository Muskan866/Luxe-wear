import React from "react";
import { useStore } from "../context/StoreContext";
import { ArrowRight, Sparkles, Shield, RefreshCw, Truck } from "lucide-react";

export const Hero: React.FC = () => {
  const { setCurrentView, setFilters } = useStore();

  const handleShop = (gender: "men" | "women") => {
    setFilters((prev) => ({
      ...prev,
      gender,
      category: "all",
      searchQuery: "",
      onlyNewArrivals: false,
      onlyBestSellers: false,
    }));
    setCurrentView("shop");
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF9F5]">
      {/* Editorial Split Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-10 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pr-4">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
                Autumn / Winter 2026 Collection
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-medium tracking-tight text-[#18181B] leading-[1.08] text-balance">
                WEAR YOUR CONFIDENCE.
              </h1>
            </div>

            <p className="text-base sm:text-lg text-[#52525B] leading-relaxed font-light max-w-xl">
              Discover Your Style. Define Your Identity. Meticulously sculpted silhouettes, natural GOTS-certified textiles, and architectural tailoring engineered for contemporary living.
            </p>

            {/* Direct Shop CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => handleShop("men")}
                className="group inline-flex items-center justify-center gap-3 bg-[#18181B] text-[#FAF9F5] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] rounded hover:bg-[#27272A] transition-all shadow-sm hover:shadow active:scale-[0.99]"
              >
                <span>SHOP MEN</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleShop("women")}
                className="group inline-flex items-center justify-center gap-3 bg-transparent text-[#18181B] border border-[#18181B] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] rounded hover:bg-[#18181B] hover:text-[#FAF9F5] transition-all active:scale-[0.99]"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quiet trust markers */}
            <div className="pt-6 border-t border-[#E8E2D7] grid grid-cols-3 gap-4 text-xs text-[#52525B]">
              <div>
                <p className="font-serif text-base text-[#18181B] font-semibold">100%</p>
                <p className="text-[11px] text-[#71717A]">Pure Natural Fibers</p>
              </div>
              <div>
                <p className="font-serif text-base text-[#18181B] font-semibold">15 Days</p>
                <p className="text-[11px] text-[#71717A]">Complimentary Returns</p>
              </div>
              <div>
                <p className="font-serif text-base text-[#18181B] font-semibold">PAN India</p>
                <p className="text-[11px] text-[#71717A]">Express 48h Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: Large Fashion Model Image */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] xl:aspect-[16/11] rounded-lg overflow-hidden bg-[#E8E2D7] shadow-lg group">
              <img
                src="/src/assets/images/hero_fashion_model_1792439063989.jpg"
                alt="LUXE WEAR Autumn Winter 2026 Editorial Campaign with tailored wool coats and silk garments"
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
                loading="eager"
              />
              
              {/* Subtle architectural gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating campaign tag */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white text-xs space-y-1">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[11px] uppercase tracking-widest font-mono">
                  Look 01 · Milan Runway
                </span>
                <p className="font-serif text-base sm:text-lg text-white font-medium">
                  The Double-Faced Melton Overcoat & Silk Fluted Ensemble
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Feature Value Bar (Full Width row below split hero) */}
        <div className="mt-12 pt-8 border-t border-[#E8E2D7] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-[#8C7355] shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">Free Express Delivery</p>
              <p className="text-xs text-[#71717A]">On all prepaid orders over ₹999</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw size={20} className="text-[#8C7355] shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">15-Day Easy Returns</p>
              <p className="text-xs text-[#71717A]">Doorstep pickup & direct refunds</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Shield size={20} className="text-[#8C7355] shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">Authentic Craftsmanship</p>
              <p className="text-xs text-[#71717A]">GOTS certified organic cottons</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-[#8C7355] shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#18181B]">Bespoke Tailoring</p>
              <p className="text-xs text-[#71717A]">Precision cuts & premium finishes</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
