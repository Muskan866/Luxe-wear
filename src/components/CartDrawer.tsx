import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import {
  X,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Check,
} from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
  } = useStore();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput("");
    }
  };

  const freeShippingThreshold = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentView("checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setIsCartDrawerOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F5] shadow-2xl border-l border-[#E8E2D7] flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D7] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} className="text-[#18181B]" />
              <h2 className="font-serif text-lg font-semibold tracking-wide uppercase text-[#18181B]">
                Your Shopping Bag
              </h2>
              <span className="font-mono text-xs text-[#71717A] tabular-nums">
                ({cart.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-[#71717A] hover:text-[#18181B] rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#F0ECE1] px-5 py-3 border-b border-[#E8E2D7] text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-[#52525B]">
                Add <strong className="font-mono text-[#18181B]">₹{amountNeededForFreeShipping}</strong> more to unlock <strong>Complimentary Express Delivery</strong>
              </p>
            ) : (
              <p className="text-emerald-800 font-medium flex items-center gap-1.5">
                <Check size={14} /> You have unlocked Complimentary Express Delivery!
              </p>
            )}
            <div className="w-full bg-[#D4CFCE] h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#18181B] h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Itemized List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-white border border-[#E8E2D7] rounded-sm relative"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#F4F1EA] rounded-xs overflow-hidden shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-[#18181B] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#A1A1AA] hover:text-red-700 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#71717A] space-x-2 mt-0.5">
                        <span>Size: <strong className="font-mono text-[#18181B]">{item.size}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Color: <strong className="text-[#18181B]">{item.color.name}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E8E2D7] rounded-xs bg-[#FAF9F5]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs hover:bg-[#E8E2D7]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-mono tabular-nums font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs hover:bg-[#E8E2D7]"
                        >
                          +
                        </button>
                      </div>

                      {/* Line price */}
                      <span className="font-mono text-sm font-semibold text-[#18181B] tabular-nums">
                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center space-y-3">
                <ShoppingBag size={32} className="mx-auto text-[#A1A1AA]" />
                <p className="font-serif text-lg text-[#18181B]">Your bag is currently empty</p>
                <p className="text-xs text-[#71717A]">
                  Explore our curated outerwear, tailoring, and luxury wardrobe essentials.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView("shop");
                  }}
                  className="mt-2 inline-block bg-[#18181B] text-white text-xs uppercase tracking-wider py-2 px-5 rounded-xs font-semibold"
                >
                  Explore Collection
                </button>
              </div>
            )}
          </div>

          {/* Footer with Voucher and Totals */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8E2D7] bg-white space-y-4">
              {/* Voucher Application Form */}
              <div className="space-y-1">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xs text-xs text-emerald-900">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Tag size={13} /> Code <strong>{appliedCoupon}</strong> Applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-700 hover:underline text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. LUXE20)"
                      className="w-full text-xs font-mono uppercase px-3 py-2 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                    />
                    <button
                      type="submit"
                      className="bg-[#18181B] text-white text-xs uppercase tracking-wider px-3.5 py-2 rounded-xs font-semibold hover:bg-[#27272A]"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 pt-0.5">{couponError}</p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-[#52525B] border-t border-[#F0ECE1] pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-[#18181B]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#8C7355] font-medium">
                    <span>Promotional Discount</span>
                    <span className="font-mono tabular-nums">
                      -₹{discountAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono tabular-nums text-[#18181B]">
                    {shippingFee === 0 ? (
                      <strong className="text-emerald-700 uppercase text-[10px]">FREE</strong>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-semibold text-[#18181B] pt-2 border-t border-[#E8E2D7]">
                  <span className="font-serif">Total Amount</span>
                  <span className="font-mono tabular-nums">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#18181B] hover:bg-[#27272A] text-white py-3.5 px-4 rounded-xs text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={15} />
              </button>

              <p className="text-[10px] text-center text-[#71717A] flex items-center justify-center gap-1">
                <ShieldCheck size={13} className="text-emerald-700" />
                Guaranteed 256-bit Encrypted Checkout & Easy 15-day Returns
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
