import React from "react";
import { useStore } from "../context/StoreContext";
import {
  CheckCircle2,
  Package,
  Truck,
  Clock,
  ArrowRight,
  Printer,
  ShieldCheck,
  Check,
} from "lucide-react";

export const OrderConfirmationView: React.FC = () => {
  const { currentOrder, setCurrentView } = useStore();

  if (!currentOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-serif text-2xl text-[#18181B]">No recent order found</p>
        <button
          onClick={() => setCurrentView("shop")}
          className="mt-4 bg-[#18181B] text-white py-2 px-6 rounded-xs text-xs uppercase tracking-wider font-semibold"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="bg-white border border-[#E8E2D7] p-6 sm:p-10 rounded-sm shadow-sm space-y-8 animate-fadeIn">
        
        {/* Header confirmation */}
        <div className="text-center space-y-3 pb-6 border-b border-[#F0ECE1]">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
            <Check size={28} />
          </div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#8C7355] font-semibold">
            Order Confirmed & Logged
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#18181B]">
            Thank You for Shopping with LUXE WEAR
          </h1>
          <p className="text-sm text-[#52525B] max-w-md mx-auto">
            Your tailored order <strong className="text-[#18181B] font-mono">#{currentOrder.id}</strong> has been received by our atelier. A confirmation email has been dispatched.
          </p>
        </div>

        {/* Tracking Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#18181B]">
            <span>Live Dispatch Status</span>
            <span className="text-[#8C7355] font-mono">{currentOrder.trackingNumber}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2">
            {[
              { label: "Confirmed", active: true, done: true },
              { label: "Tailoring", active: true, done: false },
              { label: "Dispatched", active: false, done: false },
              { label: "Delivered", active: false, done: false },
            ].map((step, idx) => (
              <div key={idx} className="space-y-1.5 text-center">
                <div
                  className={`h-1.5 rounded-full ${
                    step.done
                      ? "bg-emerald-600"
                      : step.active
                      ? "bg-[#18181B]"
                      : "bg-[#E8E2D7]"
                  }`}
                />
                <p
                  className={`text-[11px] ${
                    step.active ? "text-[#18181B] font-semibold" : "text-[#A1A1AA]"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#71717A] text-center pt-2">
            Estimated Delivery Date: <strong className="text-[#18181B]">{currentOrder.estimatedDelivery}</strong> via BlueDart Express
          </p>
        </div>

        {/* Order Details & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-[#FAF9F5] border border-[#E8E2D7] rounded-xs text-xs">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">
              Shipping Destination
            </span>
            <p className="font-semibold text-[#18181B]">{currentOrder.shippingAddress.name}</p>
            <p className="text-[#52525B]">{currentOrder.shippingAddress.street}</p>
            <p className="text-[#52525B]">
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} -{" "}
              <strong className="font-mono">{currentOrder.shippingAddress.pincode}</strong>
            </p>
            <p className="text-[#71717A]">Phone: {currentOrder.shippingAddress.phone}</p>
          </div>

          <div className="space-y-1 sm:border-l sm:border-[#E8E2D7] sm:pl-6">
            <span className="text-[10px] uppercase tracking-wider text-[#71717A] font-semibold">
              Payment Overview
            </span>
            <p className="text-[#52525B]">
              Method: <strong className="text-[#18181B]">{currentOrder.paymentMethod}</strong>
            </p>
            <p className="text-[#52525B]">
              Status: <span className="text-emerald-700 font-semibold">{currentOrder.paymentStatus}</span>
            </p>
            <p className="text-[#52525B]">
              Total Paid: <strong className="font-mono text-[#18181B]">₹{currentOrder.total.toLocaleString("en-IN")}</strong>
            </p>
          </div>
        </div>

        {/* Items purchased */}
        <div className="space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
            Ensemble Items
          </span>
          <div className="divide-y divide-[#F0ECE1] border border-[#E8E2D7] rounded-xs">
            {currentOrder.items.map((item) => (
              <div key={item.id} className="p-3.5 flex items-center gap-4 text-xs">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-12 h-14 object-cover rounded-xs"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <p className="font-semibold text-[#18181B]">{item.product.name}</p>
                  <p className="text-[11px] text-[#71717A]">
                    Size: {item.size} · Color: {item.color.name} · Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-mono font-semibold text-[#18181B] tabular-nums">
                  ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setCurrentView("shop")}
            className="w-full sm:flex-1 bg-[#18181B] text-white py-3.5 px-6 rounded-xs text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#27272A] transition-colors text-center"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => setCurrentView("account")}
            className="w-full sm:w-auto border border-[#E8E2D7] text-[#18181B] hover:border-[#18181B] py-3.5 px-6 rounded-xs text-xs uppercase tracking-wider font-medium transition-colors text-center"
          >
            View in My Orders
          </button>
        </div>

      </div>
    </div>
  );
};
