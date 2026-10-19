import React, { useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";

export const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(
    "Hello LUXE WEAR Concierge, I would like personal assistance styling a look from your collection."
  );

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    const phone = "919876543210";
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Popover Mini Chat Dialog */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white border border-[#E8E2D7] shadow-2xl rounded-sm p-4 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-serif text-sm font-semibold text-[#18181B]">
                LUXE WEAR Concierge
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#71717A] hover:text-[#18181B]"
            >
              <X size={16} />
            </button>
          </div>

          <p className="text-xs text-[#52525B]">
            Need immediate advice on sizing, fabric drape, or order status? Chat live with our Mumbai atelier stylist.
          </p>

          <textarea
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full text-xs p-2 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
          />

          <button
            onClick={handleOpenWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2 px-3 rounded-xs text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Send size={13} />
            <span>Open WhatsApp Chat</span>
          </button>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 active:scale-95"
        aria-label="WhatsApp Concierge"
      >
        <MessageSquare size={18} className="fill-white" />
        <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">
          WhatsApp Concierge
        </span>
      </button>
    </div>
  );
};
