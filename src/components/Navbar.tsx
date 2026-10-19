import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartDrawerOpen,
    wishlist,
    currentUser,
    setIsAuthModalOpen,
    filters,
    setFilters,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchQuery: localSearch }));
    if (currentView !== "shop") {
      setCurrentView("shop");
    }
    setIsSearchOpen(false);
  };

  const navigateToCategory = (
    gender: "all" | "men" | "women",
    category: string = "all",
    extra?: { onlyNewArrivals?: boolean; onlyBestSellers?: boolean }
  ) => {
    setFilters((prev) => ({
      ...prev,
      gender,
      category: category as any,
      onlyNewArrivals: extra?.onlyNewArrivals || false,
      onlyBestSellers: extra?.onlyBestSellers || false,
    }));
    setCurrentView("shop");
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Announcement Bar (Restrained & Elegant) */}
      <div className="bg-[#18181B] text-[#FAF9F5] text-xs py-2 px-4 text-center tracking-widest uppercase font-medium border-b border-[#27272A] flex items-center justify-center gap-2">
        <span>Complimentary Express Shipping on Orders Above ₹999</span>
        <span aria-hidden="true" className="text-[#8C7355]">·</span>
        <span className="hidden sm:inline text-[#D4C7B5]">Use Code <strong className="text-white font-semibold">LUXE20</strong> For 20% Off</span>
      </div>

      {/* Main Top Navigation Bar (Strict 3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E2D7] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-8">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#18181B] hover:text-[#8C7355] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355]"
              aria-label="Open mobile navigation menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#18181B] hover:text-[#8C7355] transition-colors"
              aria-label="Open search input"
            >
              <Search size={20} />
            </button>
          </div>

          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center">
            <button
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  gender: "all",
                  category: "all",
                  searchQuery: "",
                  onlyNewArrivals: false,
                  onlyBestSellers: false,
                }));
                setCurrentView("home");
              }}
              className="group text-left focus-visible:outline-none"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] text-[#18181B] group-hover:text-[#8C7355] transition-colors whitespace-nowrap shrink-0 uppercase">
                LUXE WEAR
              </span>
            </button>
          </div>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wider uppercase text-[#27272A]">
            <button
              onClick={() => {
                setFilters((prev) => ({ ...prev, gender: "all", category: "all", searchQuery: "" }));
                setCurrentView("home");
              }}
              className={`hover:text-[#8C7355] transition-colors whitespace-nowrap shrink-0 pb-1 ${
                currentView === "home" ? "border-b border-[#18181B] text-[#18181B] font-semibold" : "text-[#52525B]"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateToCategory("men")}
              className={`hover:text-[#8C7355] transition-colors whitespace-nowrap shrink-0 pb-1 ${
                filters.gender === "men" && currentView === "shop" ? "border-b border-[#18181B] text-[#18181B] font-semibold" : "text-[#52525B]"
              }`}
            >
              Men
            </button>
            <button
              onClick={() => navigateToCategory("women")}
              className={`hover:text-[#8C7355] transition-colors whitespace-nowrap shrink-0 pb-1 ${
                filters.gender === "women" && currentView === "shop" ? "border-b border-[#18181B] text-[#18181B] font-semibold" : "text-[#52525B]"
              }`}
            >
              Women
            </button>
            <button
              onClick={() => navigateToCategory("all", "all", { onlyNewArrivals: true })}
              className="text-[#52525B] hover:text-[#8C7355] transition-colors whitespace-nowrap shrink-0 pb-1"
            >
              New Arrivals
            </button>
            <button
              onClick={() => navigateToCategory("all", "all", { onlyBestSellers: true })}
              className="text-[#52525B] hover:text-[#8C7355] transition-colors whitespace-nowrap shrink-0 pb-1"
            >
              Best Sellers
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  gender: "all",
                  category: "all",
                  onlySale: false,
                  onlyNewArrivals: false,
                  onlyBestSellers: false,
                  searchQuery: "",
                }));
                setCurrentView("shop");
              }}
              className="text-[#52525B] hover:text-[#8C7355] transition-colors whitespace-nowrap shrink-0 pb-1"
            >
              Collections
            </button>
            <button
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  gender: "all",
                  category: "all",
                  onlySale: true,
                  onlyNewArrivals: false,
                  onlyBestSellers: false,
                  searchQuery: "",
                }));
                setCurrentView("shop");
              }}
              className="text-[#8C7355] hover:text-[#5A4634] font-semibold tracking-widest transition-colors whitespace-nowrap shrink-0 pb-1"
            >
              Sale
            </button>
          </nav>

          {/* Zone 3: Clean action icons with direct handlers */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            {/* Desktop Search trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden lg:flex items-center gap-2 text-xs uppercase tracking-wider text-[#52525B] hover:text-[#18181B] py-1.5 px-2.5 rounded hover:bg-[#F0EBE1] transition-all"
              aria-label="Search clothing catalog"
            >
              <Search size={17} />
              <span className="hidden xl:inline">Search</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setCurrentView("wishlist")}
              className="relative p-2 text-[#18181B] hover:text-[#8C7355] transition-colors"
              aria-label={`Wishlist (${wishlist.length} saved items)`}
            >
              <Heart size={20} className={wishlist.length > 0 ? "fill-[#8C7355] text-[#8C7355]" : ""} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#8C7355] text-white text-[10px] font-semibold rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* User Account / Admin toggle */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (currentUser) {
                    setCurrentView("account");
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex items-center gap-1.5 p-2 text-[#18181B] hover:text-[#8C7355] transition-colors"
                aria-label="User Account"
              >
                <User size={20} />
                {currentUser && (
                  <span className="hidden xl:inline text-xs font-medium text-[#52525B] max-w-[80px] truncate">
                    {currentUser.name.split(" ")[0]}
                  </span>
                )}
              </button>
            </div>

            {/* Shopping Bag Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-[#18181B] text-white py-2 px-3.5 sm:px-4 rounded text-xs uppercase tracking-wider font-medium hover:bg-[#27272A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8C7355]"
              aria-label={`Shopping bag containing ${cartCount} items`}
            >
              <ShoppingBag size={16} />
              <span className="hidden sm:inline">Bag</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px] font-mono tabular-nums">
                {cartCount}
              </span>
            </button>

            {/* Admin Switch Quick Link */}
            <button
              onClick={() => setCurrentView("admin")}
              className={`p-2 text-xs font-medium transition-colors ${
                currentView === "admin"
                  ? "text-[#8C7355] underline"
                  : "text-[#71717A] hover:text-[#18181B]"
              }`}
              title="Admin Dashboard & Inventory Portal"
            >
              <ShieldCheck size={18} />
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {isSearchOpen && (
          <div className="border-t border-[#E8E2D7] bg-[#FAF9F5] py-4 px-4 sm:px-8 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search size={20} className="text-[#71717A] shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search cashmere coats, poplin shirts, pleated trousers, jackets..."
                className="w-full bg-transparent border-b border-[#D4C7B5] py-2 px-1 text-sm focus:outline-none focus:border-[#18181B] text-[#18181B] placeholder-[#A1A1AA]"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#18181B] text-white text-xs uppercase tracking-wider py-2 px-4 rounded hover:bg-[#27272A] transition-colors whitespace-nowrap shrink-0"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-[#71717A] hover:text-[#18181B]"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E2D7] bg-[#FAF9F5] px-6 py-6 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
                Shop Collections
              </p>
              <div className="flex flex-col space-y-2 text-base font-medium text-[#18181B]">
                <button
                  onClick={() => {
                    setCurrentView("home");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-1 hover:text-[#8C7355]"
                >
                  Home
                </button>
                <button
                  onClick={() => navigateToCategory("men")}
                  className="text-left py-1 hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>Men's Ready-to-Wear</span>
                  <ChevronRight size={16} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => navigateToCategory("women")}
                  className="text-left py-1 hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>Women's Collection</span>
                  <ChevronRight size={16} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => navigateToCategory("all", "T-Shirts & Shirts")}
                  className="text-left py-1 hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>T-Shirts & Shirts</span>
                  <ChevronRight size={16} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => navigateToCategory("all", "Jeans & Trousers")}
                  className="text-left py-1 hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>Jeans & Trousers</span>
                  <ChevronRight size={16} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => navigateToCategory("all", "Hoodies & Sweatshirts")}
                  className="text-left py-1 hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>Hoodies & Sweatshirts</span>
                  <ChevronRight size={16} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => navigateToCategory("all", "Jackets")}
                  className="text-left py-1 hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>Jackets & Tailoring</span>
                  <ChevronRight size={16} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => navigateToCategory("all", "Dresses & Ethnic Wear")}
                  className="text-left py-1 hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>Dresses & Ethnic Wear</span>
                  <ChevronRight size={16} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => navigateToCategory("all", "Accessories")}
                  className="text-left py-1 hover:text-[#8C7355] flex items-center justify-between"
                >
                  <span>Accessories & Leather</span>
                  <ChevronRight size={16} className="text-[#A1A1AA]" />
                </button>
                <button
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      gender: "all",
                      category: "all",
                      onlySale: true,
                      onlyNewArrivals: false,
                      onlyBestSellers: false,
                      searchQuery: "",
                    }));
                    setCurrentView("shop");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left py-1 text-[#8C7355] font-semibold flex items-center justify-between"
                >
                  <span>Sale & Archive Offers</span>
                  <ChevronRight size={16} className="text-[#8C7355]" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8E2D7] space-y-3">
              <button
                onClick={() => {
                  setCurrentView("admin");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-xs uppercase tracking-wider text-[#8C7355] font-semibold flex items-center gap-2"
              >
                <ShieldCheck size={16} /> Admin Portal & Inventory
              </button>
              <button
                onClick={() => {
                  if (currentUser) {
                    setCurrentView("account");
                  } else {
                    setIsAuthModalOpen(true);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm text-[#18181B] hover:text-[#8C7355] flex items-center gap-2"
              >
                <User size={16} />
                <span>{currentUser ? `Account (${currentUser.name})` : "Sign In / Register"}</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView("wishlist");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-sm text-[#18181B] hover:text-[#8C7355] flex items-center gap-2"
              >
                <Heart size={16} />
                <span>Wishlist ({wishlist.length})</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
