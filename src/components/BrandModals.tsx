import React, { useState } from "react";
import { X, Send, MapPin, Phone, Mail, Clock, ShieldCheck, Check } from "lucide-react";
import { useStore } from "../context/StoreContext";

interface BrandModalProps {
  type: "about" | "contact" | "returns" | "privacy" | null;
  onClose: () => void;
}

export const BrandModals: React.FC<BrandModalProps> = ({ type, onClose }) => {
  const { showToast } = useStore();
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  if (!type) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Message Transmitted", "Our atelier concierge will respond within 4 business hours.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative bg-[#FAF9F5] border border-[#E8E2D7] w-full max-w-2xl rounded-sm p-6 sm:p-8 shadow-2xl space-y-6 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#71717A] hover:text-[#18181B]"
        >
          <X size={18} />
        </button>

        {/* 1. About Us */}
        {type === "about" && (
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
              The Atelier Ethos
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#18181B]">
              About LUXE WEAR
            </h2>

            <div className="aspect-[16/9] w-full rounded-sm overflow-hidden bg-[#E8E2D7]">
              <img
                src="/src/assets/images/atelier_craft_story_1792439065996.jpg"
                alt="LUXE WEAR Atelier craftsmanship"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-xs sm:text-sm text-[#52525B] leading-relaxed space-y-3">
              <p>
                Founded on the premise of uncompromising tailoring and quiet confidence, <strong>LUXE WEAR</strong> creates enduring modern garments that bridge architectural precision with effortless everyday luxury.
              </p>
              <p>
                Every melton wool coat, pure silk slip, and heavyweight organic cotton hoodie is produced in strictly limited batches. We work exclusively with certified mills in Normandy, Bergamo, Kurashiki, and the Aegean to ensure our fibers feel exceptional against the skin and gracefully withstand years of wear.
              </p>
              <p>
                No ostentatious logos. No disposable fast-fashion cycles. Only pure silhouettes engineered to define your personal identity.
              </p>
            </div>
          </div>
        )}

        {/* 2. Contact Us */}
        {type === "contact" && (
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
              Customer Concierge
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#18181B]">
              Contact LUXE WEAR
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 border border-[#E8E2D7] rounded-xs">
              <div className="space-y-2">
                <p className="flex items-center gap-2 font-medium text-[#18181B]">
                  <MapPin size={14} className="text-[#8C7355]" />
                  <span>Flagship Studio & Atelier</span>
                </p>
                <p className="text-[#52525B] pl-6">
                  Signature Palms, Bandra West, Mumbai, Maharashtra 400050
                </p>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2 font-medium text-[#18181B]">
                  <Clock size={14} className="text-[#8C7355]" />
                  <span>Concierge Hours</span>
                </p>
                <p className="text-[#52525B] pl-6">
                  Monday – Saturday: 10:00 AM – 8:00 PM IST
                </p>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2 font-medium text-[#18181B]">
                  <Phone size={14} className="text-[#8C7355]" />
                  <span>Telephone Concierge</span>
                </p>
                <p className="text-[#52525B] pl-6 font-mono">+91 (022) 8829-4400</p>
              </div>

              <div className="space-y-2">
                <p className="flex items-center gap-2 font-medium text-[#18181B]">
                  <Mail size={14} className="text-[#8C7355]" />
                  <span>Electronic Correspondence</span>
                </p>
                <p className="text-[#52525B] pl-6">concierge@luxewear.in</p>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Anchal Yadav"
                    className="w-full p-2.5 border border-[#E8E2D7] bg-white rounded-xs focus:outline-none focus:border-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="anchal@example.com"
                    className="w-full p-2.5 border border-[#E8E2D7] bg-white rounded-xs focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#71717A] mb-1 font-medium">Message / Inquiry</label>
                <textarea
                  rows={3}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Inquire about custom sizing, delivery timelines, or styling consultations..."
                  className="w-full p-2.5 border border-[#E8E2D7] bg-white rounded-xs focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#18181B] text-white py-3 px-6 rounded-xs uppercase tracking-wider font-semibold hover:bg-[#27272A] flex items-center gap-2"
              >
                <Send size={13} />
                <span>Transmit Inquiry</span>
              </button>
            </form>
          </div>
        )}

        {/* 3. Return & Refund Policy */}
        {type === "returns" && (
          <div className="space-y-4 text-xs sm:text-sm text-[#52525B] leading-relaxed">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
              Policy & Protocol
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#18181B]">
              15-Day Complimentary Returns
            </h2>
            <div className="space-y-3 pt-2">
              <p>
                <strong>1. Return Window:</strong> You may initiate a return or size exchange within 15 days of receiving your parcel.
              </p>
              <p>
                <strong>2. Condition Requirements:</strong> Returned garments must be in their original unworn condition with tags attached and packed in original garment boxes or bags.
              </p>
              <p>
                <strong>3. Doorstep Pickup:</strong> Our logistics partners BlueDart and Delhivery will schedule a complimentary pickup from your saved delivery address.
              </p>
              <p>
                <strong>4. Refund Processing:</strong> Refunds for prepaid orders are credited back to your original source (UPI, Credit/Debit Card, NetBanking) within 48 hours of inspection. For Cash on Delivery orders, refunds are dispatched instantly via direct bank transfer or UPI ID.
              </p>
            </div>
          </div>
        )}

        {/* 4. Privacy & Terms */}
        {type === "privacy" && (
          <div className="space-y-4 text-xs sm:text-sm text-[#52525B] leading-relaxed">
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
              Legal & Privacy
            </span>
            <h2 className="font-serif text-3xl font-semibold text-[#18181B]">
              Terms of Service & Privacy Protection
            </h2>
            <div className="space-y-3 pt-2">
              <p>
                <strong>Data Protection:</strong> LUXE WEAR respects customer confidentiality. Your personal information, shipping addresses, and purchase histories are encrypted with TLS 1.3 standards and never sold or shared with unverified third parties.
              </p>
              <p>
                <strong>Payment Security:</strong> Payment information is processed through PCI-DSS Level 1 certified gateways including Razorpay and RBI-regulated payment aggregators. No card or UPI credentials are ever stored in plain text.
              </p>
              <p>
                <strong>Intellectual Property:</strong> All textile patterns, photographic campaign materials, and brand trademarks belong exclusively to LUXE WEAR India Pvt. Ltd.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
