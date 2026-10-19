import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Address } from "../types";
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Plus,
  Building,
  Home,
  Check,
} from "lucide-react";

export const CheckoutView: React.FC = () => {
  const {
    cart,
    subtotal,
    discountAmount,
    shippingFee,
    finalTotal,
    appliedCoupon,
    currentUser,
    placeOrder,
    setCurrentView,
    showToast,
  } = useStore();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="font-serif text-2xl text-[#18181B]">Your cart is empty</p>
        <p className="text-sm text-[#71717A] mt-2">Add pieces to your bag before checking out.</p>
        <button
          onClick={() => setCurrentView("shop")}
          className="mt-6 bg-[#18181B] text-white py-2.5 px-6 rounded-xs text-xs uppercase tracking-wider font-semibold"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  // Address selection
  const savedAddresses = currentUser?.savedAddresses || [];
  const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddr?.id || "custom"
  );

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(
    savedAddresses.length === 0
  );

  const [customAddress, setCustomAddress] = useState<Omit<Address, "id">>({
    name: currentUser?.name || "Anchal Yadav",
    phone: currentUser?.phone || "+91 98765 43210",
    street: "Flat 402, Signature Palms, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    type: "Home",
    isDefault: true,
  });

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash on Delivery (COD)" | "Online Payment (Razorpay / UPI / Cards)"
  >("Online Payment (Razorpay / UPI / Cards)");

  // Online Payment Simulation Sub-method
  const [onlineGatewayType, setOnlineGatewayType] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("anchal@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [validatedAddress, setValidatedAddress] = useState<Address | null>(null);

  const handleInitiateOrder = (e: React.FormEvent) => {
    e.preventDefault();

    let targetAddress: Address;
    if (isAddingNewAddress || selectedAddressId === "custom") {
      if (!customAddress.name || !customAddress.phone || !customAddress.street || !customAddress.pincode) {
        showToast("Missing Address Fields", "Please complete all shipping address fields.", "error");
        return;
      }
      targetAddress = {
        ...customAddress,
        id: "addr-" + Date.now().toString(36),
      };
    } else {
      const match = savedAddresses.find((a) => a.id === selectedAddressId);
      if (!match) {
        showToast("Invalid Address", "Please select a valid delivery address.", "error");
        return;
      }
      targetAddress = match;
    }

    setValidatedAddress(targetAddress);

    if (paymentMethod === "Online Payment (Razorpay / UPI / Cards)") {
      setIsRazorpayModalOpen(true);
    } else {
      finalizeCODOrder(targetAddress);
    }
  };

  const finalizeCODOrder = async (addr: Address) => {
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await placeOrder("Cash on Delivery (COD)", addr);
    } catch {
      showToast("Order Error", "Failed to confirm COD order.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRazorpaySuccess = async () => {
    if (!validatedAddress) return;
    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1100));
      await placeOrder("Online Payment (Razorpay / UPI / Cards)", validatedAddress);
      setIsRazorpayModalOpen(false);
    } catch {
      showToast("Payment Gateway Error", "Transaction was interrupted.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <div className="pb-6">
        <button
          onClick={() => setCurrentView("shop")}
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#71717A] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Checkout Details Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Step 1: Shipping Address */}
          <div className="bg-white border border-[#E8E2D7] p-6 rounded-sm shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-3">
              <h2 className="font-serif text-lg font-semibold text-[#18181B] flex items-center gap-2">
                <Truck size={18} className="text-[#8C7355]" />
                <span>1. Shipping Destination & Contact Details</span>
              </h2>
              {savedAddresses.length > 0 && !isAddingNewAddress && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(true)}
                  className="text-xs text-[#8C7355] hover:text-[#5A4634] font-medium flex items-center gap-1"
                >
                  <Plus size={13} /> Add New Address
                </button>
              )}
            </div>

            {/* Existing Saved Addresses Radio */}
            {!isAddingNewAddress && savedAddresses.length > 0 ? (
              <div className="space-y-3">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-4 border rounded-sm cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? "border-[#18181B] bg-[#FAF9F5] ring-1 ring-[#18181B]"
                        : "border-[#E8E2D7] hover:border-[#D4C7B5]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 accent-[#18181B]"
                        />
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#18181B]">{addr.name}</span>
                            <span className="bg-[#E8E2D7] px-2 py-0.5 rounded-full text-[10px] text-[#52525B]">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] text-[#8C7355] font-semibold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-[#52525B]">{addr.street}</p>
                          <p className="text-[#52525B]">
                            {addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong>
                          </p>
                          <p className="text-[#71717A]">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              /* Custom or New Address Form */
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customAddress.name}
                      onChange={(e) =>
                        setCustomAddress({ ...customAddress, name: e.target.value })
                      }
                      className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customAddress.phone}
                      onChange={(e) =>
                        setCustomAddress({ ...customAddress, phone: e.target.value })
                      }
                      className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                    Flat / House No. / Street & Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={customAddress.street}
                    onChange={(e) =>
                      setCustomAddress({ ...customAddress, street: e.target.value })
                    }
                    className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={customAddress.city}
                      onChange={(e) =>
                        setCustomAddress({ ...customAddress, city: e.target.value })
                      }
                      className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={customAddress.state}
                      onChange={(e) =>
                        setCustomAddress({ ...customAddress, state: e.target.value })
                      }
                      className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={customAddress.pincode}
                      onChange={(e) =>
                        setCustomAddress({ ...customAddress, pincode: e.target.value })
                      }
                      className="w-full text-xs font-mono p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                    />
                  </div>
                </div>

                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(false)}
                    className="text-xs text-[#71717A] underline hover:text-[#18181B]"
                  >
                    Use an existing saved address instead
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white border border-[#E8E2D7] p-6 rounded-sm shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-semibold text-[#18181B] flex items-center gap-2 border-b border-[#F0ECE1] pb-3">
              <Lock size={18} className="text-[#8C7355]" />
              <span>2. Select Payment Method</span>
            </h2>

            <div className="space-y-3">
              {/* Online Payment (Razorpay / UPI / Cards) */}
              <label
                className={`block p-4 border rounded-sm cursor-pointer transition-all ${
                  paymentMethod === "Online Payment (Razorpay / UPI / Cards)"
                    ? "border-[#18181B] bg-[#FAF9F5] ring-1 ring-[#18181B]"
                    : "border-[#E8E2D7] hover:border-[#D4C7B5]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "Online Payment (Razorpay / UPI / Cards)"}
                    onChange={() =>
                      setPaymentMethod("Online Payment (Razorpay / UPI / Cards)")
                    }
                    className="mt-1 accent-[#18181B]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-2">
                        <CreditCard size={15} />
                        Razorpay Gateway (UPI, Cards, NetBanking)
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Fastest Checkout
                      </span>
                    </div>
                    <p className="text-xs text-[#52525B] mt-1">
                      Instant verification via Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard.
                    </p>

                    {/* Gateway Sub-tabs if active */}
                    {paymentMethod === "Online Payment (Razorpay / UPI / Cards)" && (
                      <div className="mt-4 pt-3 border-t border-[#E8E2D7] space-y-3">
                        <div className="flex gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => setOnlineGatewayType("upi")}
                            className={`px-3 py-1.5 border rounded-xs font-medium ${
                              onlineGatewayType === "upi"
                                ? "bg-[#18181B] text-white border-[#18181B]"
                                : "bg-white text-[#52525B] border-[#E8E2D7]"
                            }`}
                          >
                            Instant UPI
                          </button>
                          <button
                            type="button"
                            onClick={() => setOnlineGatewayType("card")}
                            className={`px-3 py-1.5 border rounded-xs font-medium ${
                              onlineGatewayType === "card"
                                ? "bg-[#18181B] text-white border-[#18181B]"
                                : "bg-white text-[#52525B] border-[#E8E2D7]"
                            }`}
                          >
                            Credit / Debit Card
                          </button>
                          <button
                            type="button"
                            onClick={() => setOnlineGatewayType("netbanking")}
                            className={`px-3 py-1.5 border rounded-xs font-medium ${
                              onlineGatewayType === "netbanking"
                                ? "bg-[#18181B] text-white border-[#18181B]"
                                : "bg-white text-[#52525B] border-[#E8E2D7]"
                            }`}
                          >
                            NetBanking
                          </button>
                        </div>

                        {onlineGatewayType === "upi" && (
                          <div className="bg-white p-3 border border-[#E8E2D7] rounded-xs space-y-2">
                            <label className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
                              VPA / UPI ID
                            </label>
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="mobile@upi or id@okhdfcbank"
                              className="w-full text-xs font-mono p-2 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                            />
                            <p className="text-[10px] text-[#71717A]">
                              A payment prompt will open via Razorpay secure intent.
                            </p>
                          </div>
                        )}

                        {onlineGatewayType === "card" && (
                          <div className="bg-white p-3 border border-[#E8E2D7] rounded-xs space-y-2">
                            <label className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4532 •••• •••• 8892"
                              className="w-full text-xs font-mono p-2 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                defaultValue="11/29"
                                placeholder="MM/YY"
                                className="w-full text-xs font-mono p-2 border border-[#E8E2D7] rounded-xs"
                              />
                              <input
                                type="password"
                                defaultValue="889"
                                placeholder="CVV"
                                maxLength={4}
                                className="w-full text-xs font-mono p-2 border border-[#E8E2D7] rounded-xs"
                              />
                            </div>
                          </div>
                        )}

                        {onlineGatewayType === "netbanking" && (
                          <div className="bg-white p-3 border border-[#E8E2D7] rounded-xs space-y-2">
                            <label className="text-[11px] uppercase tracking-wider text-[#71717A] font-semibold">
                              Select Bank
                            </label>
                            <select className="w-full text-xs p-2 border border-[#E8E2D7] rounded-xs bg-white">
                              <option>HDFC Bank</option>
                              <option>ICICI Bank</option>
                              <option>State Bank of India (SBI)</option>
                              <option>Axis Bank</option>
                              <option>Kotak Mahindra</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </label>

              {/* Cash on Delivery (COD) */}
              <label
                className={`block p-4 border rounded-sm cursor-pointer transition-all ${
                  paymentMethod === "Cash on Delivery (COD)"
                    ? "border-[#18181B] bg-[#FAF9F5] ring-1 ring-[#18181B]"
                    : "border-[#E8E2D7] hover:border-[#D4C7B5]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "Cash on Delivery (COD)"}
                    onChange={() => setPaymentMethod("Cash on Delivery (COD)")}
                    className="mt-1 accent-[#18181B]"
                  />
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#18181B] flex items-center gap-2">
                      <Banknote size={15} />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-xs text-[#52525B] mt-1">
                      Pay conveniently in cash or UPI QR scan upon physical doorstep delivery.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E8E2D7] p-6 rounded-sm shadow-sm space-y-6 sticky top-28">
          <h3 className="font-serif text-lg font-semibold text-[#18181B] border-b border-[#F0ECE1] pb-3">
            Order Summary ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
          </h3>

          {/* Mini item list */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-14 h-16 object-cover rounded-xs border border-[#E8E2D7]"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="font-semibold text-[#18181B] line-clamp-1">{item.product.name}</p>
                    <p className="text-[#71717A] text-[11px]">
                      {item.size} · {item.color.name} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-mono font-medium text-[#18181B] tabular-nums">
                    ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="border-t border-[#F0ECE1] pt-4 space-y-2 text-xs text-[#52525B]">
            <div className="flex justify-between">
              <span>Bag Subtotal</span>
              <span className="font-mono tabular-nums text-[#18181B]">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#8C7355] font-medium">
                <span>Voucher Savings ({appliedCoupon})</span>
                <span className="font-mono tabular-nums">
                  -₹{discountAmount.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span className="font-mono tabular-nums text-[#18181B]">
                {shippingFee === 0 ? (
                  <strong className="text-emerald-700 uppercase">FREE</strong>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-semibold text-[#18181B] pt-3 border-t border-[#E8E2D7]">
              <span className="font-serif">Final Payable</span>
              <span className="font-mono tabular-nums">
                ₹{finalTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Place Order CTA Button */}
          <button
            onClick={handleInitiateOrder}
            disabled={isProcessing}
            className="w-full bg-[#18181B] hover:bg-[#27272A] disabled:opacity-60 text-white py-4 px-6 rounded-xs text-xs uppercase tracking-[0.2em] font-semibold transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Verifying & Securing Dispatch...</span>
            ) : paymentMethod === "Online Payment (Razorpay / UPI / Cards)" ? (
              <span>Proceed to Razorpay Payment (₹{finalTotal.toLocaleString("en-IN")})</span>
            ) : (
              <span>Confirm Cash on Delivery Order (₹{finalTotal.toLocaleString("en-IN")})</span>
            )}
          </button>

          <div className="text-[11px] text-center text-[#71717A] space-y-1">
            <p className="flex items-center justify-center gap-1">
              <ShieldCheck size={14} className="text-emerald-700" />
              100% Secure Transaction & Zero Risk Return Guarantee
            </p>
            <p>Orders are dispatched from our Mumbai atelier within 24 hours.</p>
          </div>
        </div>

      </div>

      {/* Authentic Interactive Razorpay Checkout Modal Simulation */}
      {isRazorpayModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="relative bg-white w-full max-w-md rounded-md shadow-2xl overflow-hidden border border-[#D4CFCE]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Razorpay Branded Top Header */}
            <div className="bg-[#0C2340] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-wider uppercase text-[#528FF0]">
                    Razorpay
                  </span>
                  <span className="text-[10px] text-white/60">Trusted Business</span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-white">
                  LUXE WEAR Fashion House
                </h3>
                <p className="text-[11px] text-[#A1A1AA]">Order #{Math.floor(10000 + Math.random() * 90000)}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-white/60 uppercase block">Amount Payable</span>
                <span className="font-mono text-xl font-bold text-white tabular-nums">
                  ₹{finalTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Content Options */}
            <div className="p-6 space-y-5 text-xs">
              <div className="space-y-3">
                <p className="font-semibold uppercase tracking-wider text-[#18181B] text-[11px]">
                  Preferred Payment Channel
                </p>

                {/* Method 1: Instant UPI */}
                <div className="p-3.5 border border-[#18181B] bg-[#FAF9F5] rounded-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#18181B] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      UPI Apps & QR (Google Pay / PhonePe / Paytm)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                      Instant Zero Fee
                    </span>
                  </div>
                  <p className="text-[11px] text-[#52525B]">
                    Authenticated via VPA: <strong className="font-mono text-[#18181B]">{upiId}</strong>
                  </p>
                </div>

                {/* Method 2: Cards */}
                <div className="p-3 border border-[#E8E2D7] rounded-xs text-[#52525B] flex items-center justify-between">
                  <span>Cards (Visa, RuPay, Mastercard, Diners)</span>
                  <span className="font-mono text-[11px]">•••• 4242</span>
                </div>

                {/* Method 3: NetBanking */}
                <div className="p-3 border border-[#E8E2D7] rounded-xs text-[#52525B] flex items-center justify-between">
                  <span>NetBanking (HDFC, ICICI, SBI, Axis, Kotak)</span>
                  <span className="text-[10px] text-emerald-700 font-medium">Available</span>
                </div>
              </div>

              {/* Security & Action */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleRazorpaySuccess}
                  disabled={isProcessing}
                  className="w-full bg-[#0C2340] hover:bg-[#07192F] text-white py-3.5 px-4 rounded font-semibold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span>Securing Payment & Confirming...</span>
                  ) : (
                    <span>Pay ₹{finalTotal.toLocaleString("en-IN")} via Razorpay</span>
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] text-[#71717A] pt-1">
                  <span className="flex items-center gap-1">
                    <Lock size={12} className="text-emerald-600" />
                    256-bit Bank Grade Encryption
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsRazorpayModalOpen(false)}
                    className="text-red-700 hover:underline"
                  >
                    Cancel Transaction
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
