import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "./ProductCard";
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Check,
  Truck,
} from "lucide-react";
import { Address } from "../types";

export const UserAccountView: React.FC = () => {
  const {
    currentUser,
    logoutUser,
    orders,
    wishlist,
    products,
    saveAddress,
    deleteAddress,
    setDefaultAddress,
    setCurrentView,
    setIsAuthModalOpen,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "wishlist" | "profile">("orders");

  // New Address Form Modal/State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Omit<Address, "id">>({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    street: "",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "",
    type: "Home",
    isDefault: false,
  });

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-[#F3EFE6] rounded-full flex items-center justify-center mx-auto text-[#18181B]">
          <User size={28} />
        </div>
        <h2 className="font-serif text-2xl font-semibold text-[#18181B]">
          Welcome to LUXE WEAR
        </h2>
        <p className="text-xs text-[#71717A]">
          Sign in to view your bespoke orders, curated wishlist, and saved addresses.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="bg-[#18181B] text-white py-3 px-8 rounded-xs text-xs uppercase tracking-widest font-semibold hover:bg-[#27272A] transition-colors"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    saveAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      name: currentUser.name,
      phone: currentUser.phone,
      street: "",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "",
      type: "Home",
      isDefault: false,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Account Profile Header */}
      <div className="bg-white border border-[#E8E2D7] p-6 rounded-sm shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#18181B] text-white rounded-full flex items-center justify-center font-serif text-xl font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-semibold text-[#18181B]">
                {currentUser.name}
              </h1>
              {currentUser.role === "admin" && (
                <span className="text-[10px] bg-[#8C7355] text-white px-2 py-0.5 rounded font-mono uppercase">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-[#71717A]">{currentUser.email} · {currentUser.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser.role === "admin" && (
            <button
              onClick={() => setCurrentView("admin")}
              className="text-xs uppercase tracking-wider font-semibold text-[#8C7355] border border-[#8C7355] py-2 px-4 rounded-xs hover:bg-[#8C7355] hover:text-white transition-colors"
            >
              Open Admin Portal
            </button>
          )}
          <button
            onClick={logoutUser}
            className="flex items-center gap-1.5 text-xs text-[#71717A] hover:text-red-700 transition-colors py-2 px-3 border border-[#E8E2D7] rounded-xs"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex border-b border-[#E8E2D7] gap-8 mb-8 overflow-x-auto text-xs font-semibold tracking-wider uppercase">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === "orders"
              ? "border-b-2 border-[#18181B] text-[#18181B]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          <Package size={15} />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("wishlist")}
          className={`pb-3 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === "wishlist"
              ? "border-b-2 border-[#18181B] text-[#18181B]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          <Heart size={15} />
          <span>My Wishlist ({wishlist.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`pb-3 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === "addresses"
              ? "border-b-2 border-[#18181B] text-[#18181B]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          <MapPin size={15} />
          <span>Saved Addresses ({currentUser.savedAddresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === "profile"
              ? "border-b-2 border-[#18181B] text-[#18181B]"
              : "text-[#71717A] hover:text-[#18181B]"
          }`}
        >
          <User size={15} />
          <span>Profile Details</span>
        </button>
      </div>

      {/* Tab 1: Orders and Tracking */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-[#E8E2D7] rounded-sm p-6 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0ECE1] pb-3 text-xs">
                  <div>
                    <span className="font-serif text-base font-semibold text-[#18181B]">
                      Order #{order.id}
                    </span>
                    <span className="text-[#71717A] ml-2">Placed on {order.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#FAF9F5] border border-[#E8E2D7] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#18181B]">
                      {order.orderStatus}
                    </span>
                    <span className="font-mono font-semibold text-sm text-[#18181B] tabular-nums">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs bg-[#FAF9F5] p-3 rounded-xs border border-[#F0ECE1]">
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-14 h-18 object-cover rounded-xs border border-[#E8E2D7]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-[#18181B]">{item.product.name}</p>
                          <p className="text-[11px] text-[#71717A]">
                            Size: {item.size} · Color: {item.color.name}
                          </p>
                        </div>
                        <p className="font-mono tabular-nums text-[#18181B]">
                          Qty: {item.quantity} · ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#71717A] gap-2 border-t border-[#F0ECE1]">
                  <div className="flex items-center gap-2">
                    <Truck size={15} className="text-[#8C7355]" />
                    <span>Tracking: <strong className="font-mono text-[#18181B]">{order.trackingNumber}</strong></span>
                  </div>
                  <div>
                    Estimated Delivery: <strong className="text-[#18181B]">{order.estimatedDelivery}</strong>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white border border-[#E8E2D7] p-12 text-center rounded-sm space-y-3">
              <Package size={32} className="mx-auto text-[#A1A1AA]" />
              <p className="font-serif text-lg text-[#18181B]">No order history yet</p>
              <p className="text-xs text-[#71717A]">
                When you place orders, real-time status and BlueDart tracking will appear here.
              </p>
              <button
                onClick={() => setCurrentView("shop")}
                className="mt-2 bg-[#18181B] text-white text-xs uppercase tracking-wider py-2 px-6 rounded-xs font-semibold"
              >
                Shop Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === "wishlist" && (
        <div>
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E8E2D7] p-12 text-center rounded-sm space-y-3">
              <Heart size={32} className="mx-auto text-[#A1A1AA]" />
              <p className="font-serif text-lg text-[#18181B]">Your wishlist is empty</p>
              <p className="text-xs text-[#71717A]">
                Save pieces you adore to purchase later or monitor seasonal availability.
              </p>
              <button
                onClick={() => setCurrentView("shop")}
                className="mt-2 bg-[#18181B] text-white text-xs uppercase tracking-wider py-2 px-6 rounded-xs font-semibold"
              >
                Discover Pieces
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === "addresses" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-lg font-semibold text-[#18181B]">
              Address Book
            </h2>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="bg-[#18181B] text-white text-xs uppercase tracking-wider py-2 px-4 rounded-xs font-semibold flex items-center gap-1.5"
            >
              <Plus size={14} /> Add New Address
            </button>
          </div>

          {/* New address form */}
          {isAddingAddress && (
            <form
              onSubmit={handleCreateAddress}
              className="bg-white border border-[#E8E2D7] p-6 rounded-sm space-y-4 max-w-2xl animate-fadeIn"
            >
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                New Delivery Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                  />
                </div>
              </div>
              <div className="text-xs">
                <label className="block text-[#71717A] mb-1 font-medium">Street Address / House No.</label>
                <input
                  type="text"
                  required
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                />
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">State</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-[#71717A] mb-1 font-medium">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="w-full p-2.5 border border-[#E8E2D7] rounded-xs font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs pt-2">
                <button
                  type="submit"
                  className="bg-[#18181B] text-white py-2 px-5 rounded-xs font-semibold uppercase tracking-wider"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="text-[#71717A] hover:text-[#18181B]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Saved address cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-[#E8E2D7] p-5 rounded-sm space-y-3 relative text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#18181B]">{addr.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FAF9F5] border border-[#E8E2D7] text-[10px] px-2 py-0.5 rounded">
                      {addr.type}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[#52525B]">{addr.street}</p>
                <p className="text-[#52525B]">
                  {addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong>
                </p>
                <p className="text-[#71717A]">Phone: {addr.phone}</p>

                <div className="pt-3 border-t border-[#F0ECE1] flex items-center justify-between">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-xs text-[#8C7355] hover:underline font-medium"
                    >
                      Set as Default
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                      <Check size={12} /> Primary delivery address
                    </span>
                  )}

                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-[#A1A1AA] hover:text-red-700 transition-colors"
                    aria-label="Delete address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Profile Details */}
      {activeTab === "profile" && (
        <div className="bg-white border border-[#E8E2D7] p-6 rounded-sm max-w-xl space-y-4 text-xs">
          <h2 className="font-serif text-lg font-semibold text-[#18181B] border-b border-[#F0ECE1] pb-3">
            Personal Information
          </h2>
          <div>
            <label className="block text-[#71717A] mb-1 font-medium">Full Name</label>
            <input
              type="text"
              readOnly
              value={currentUser.name}
              className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D7] rounded-xs text-[#18181B]"
            />
          </div>
          <div>
            <label className="block text-[#71717A] mb-1 font-medium">Registered Email</label>
            <input
              type="email"
              readOnly
              value={currentUser.email}
              className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D7] rounded-xs text-[#18181B]"
            />
          </div>
          <div>
            <label className="block text-[#71717A] mb-1 font-medium">Phone</label>
            <input
              type="tel"
              readOnly
              value={currentUser.phone}
              className="w-full p-2.5 bg-[#FAF9F5] border border-[#E8E2D7] rounded-xs text-[#18181B]"
            />
          </div>
          <p className="text-[11px] text-[#71717A] pt-2">
            To update your verified email or security credentials, please contact LUXE WEAR Concierge.
          </p>
        </div>
      )}
    </div>
  );
};
