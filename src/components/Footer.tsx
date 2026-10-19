import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  ArrowRight,
  ShieldCheck,
  Check,
  CreditCard,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

interface FooterProps {
  onOpenModal: (type: "about" | "contact" | "returns" | "privacy") => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenModal }) => {
  const { setCurrentView, setFilters, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      showToast("Invalid Email", "Please enter a valid email address.", "error");
      return;
    }
    setSubscribed(true);
    showToast("Welcome to LUXE WEAR Gazette", "Enjoy 10% off your next order with code FIRST10.");
    setNewsletterEmail("");
  };

  const navigateTo = (gender: "all" | "men" | "women", category = "all") => {
    setFilters((prev) => ({
      ...prev,
      gender,
      category: category as any,
    }));
    setCurrentView("shop");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#18181B] text-[#FAF9F5] border-t border-[#27272A] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Brand Mission Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-[#27272A]">
          <div className="lg:col-span-6 space-y-3">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-white block">
              LUXE WEAR
            </span>
            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-md">
              A modern digital fashion house creating architectural, quiet luxury ready-to-wear garments in natural organic fibers. Designed in Mumbai, tailored for the world.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-white">
              The LUXE WEAR Gazette
            </p>
            <p className="text-xs text-[#A1A1AA]">
              Subscribe for private atelier previews, limited capsule releases, and invitations.
            </p>
            
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800 p-3 rounded-xs">
                <Check size={14} />
                <span>You have been subscribed to the private mailing ledger.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-[#27272A] border border-[#3F3F46] py-2.5 px-3 text-xs text-white placeholder-[#71717A] rounded-xs focus:outline-none focus:border-[#8C7355]"
                />
                <button
                  type="submit"
                  className="bg-[#FAF9F5] text-[#18181B] hover:bg-[#E8E2D7] py-2.5 px-5 rounded-xs text-xs uppercase tracking-widest font-semibold transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight size={13} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4 Column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-b border-[#27272A] text-xs">
          {/* Col 1: Shop */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.15em] font-semibold text-white text-[11px]">
              Ready-to-Wear
            </h4>
            <ul className="space-y-2 text-[#A1A1AA]">
              <li>
                <button onClick={() => navigateTo("men")} className="hover:text-white transition-colors">
                  Men's Collection
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("women")} className="hover:text-white transition-colors">
                  Women's Collection
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("all", "Jackets")} className="hover:text-white transition-colors">
                  Outerwear & Tailoring
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("all", "Jeans & Trousers")} className="hover:text-white transition-colors">
                  Pleated Trousers & Denim
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo("all", "Hoodies & Sweatshirts")} className="hover:text-white transition-colors">
                  Heavyweight French Terry
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Atelier & Ethos */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.15em] font-semibold text-white text-[11px]">
              The Atelier
            </h4>
            <ul className="space-y-2 text-[#A1A1AA]">
              <li>
                <button onClick={() => onOpenModal("about")} className="hover:text-white transition-colors">
                  Our Philosophy & Story
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal("about")} className="hover:text-white transition-colors">
                  Natural GOTS Fabrics
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal("about")} className="hover:text-white transition-colors">
                  Artisanal Craftsmanship
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView("admin")} className="hover:text-[#8C7355] transition-colors font-medium">
                  Atelier Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.15em] font-semibold text-white text-[11px]">
              Concierge & Care
            </h4>
            <ul className="space-y-2 text-[#A1A1AA]">
              <li>
                <button onClick={() => onOpenModal("contact")} className="hover:text-white transition-colors">
                  Contact Customer Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal("returns")} className="hover:text-white transition-colors">
                  15-Day Return & Exchange
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal("returns")} className="hover:text-white transition-colors">
                  Shipping & Cash on Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onOpenModal("privacy")} className="hover:text-white transition-colors">
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect & Social */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.15em] font-semibold text-white text-[11px]">
              Connect With Us
            </h4>
            <p className="text-[#A1A1AA] text-xs">
              Follow our seasonal lookbooks and architectural inspirations.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#D4C7B5]">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#27272A] rounded-full hover:bg-white hover:text-[#18181B] transition-colors">
                <Instagram size={15} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#27272A] rounded-full hover:bg-white hover:text-[#18181B] transition-colors">
                <Twitter size={15} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#27272A] rounded-full hover:bg-white hover:text-[#18181B] transition-colors">
                <Linkedin size={15} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-[#27272A] rounded-full hover:bg-white hover:text-[#18181B] transition-colors">
                <Facebook size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p>© {new Date().getFullYear()} LUXE WEAR India Pvt. Ltd. All rights reserved.</p>

          {/* Accepted Indian Payment Methods */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono">
            <span className="bg-[#27272A] px-2 py-1 rounded text-[#D4C7B5]">UPI</span>
            <span className="bg-[#27272A] px-2 py-1 rounded text-[#D4C7B5]">RuPay</span>
            <span className="bg-[#27272A] px-2 py-1 rounded text-[#D4C7B5]">Visa</span>
            <span className="bg-[#27272A] px-2 py-1 rounded text-[#D4C7B5]">Mastercard</span>
            <span className="bg-[#27272A] px-2 py-1 rounded text-[#D4C7B5]">NetBanking</span>
            <span className="bg-[#27272A] px-2 py-1 rounded text-[#D4C7B5]">Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
