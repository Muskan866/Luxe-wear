import React, { useState } from "react";
import { StoreProvider, useStore } from "./context/StoreContext";
import { Navbar } from "./components/Navbar";
import { HomeView } from "./components/HomeView";
import { ProductGrid } from "./components/ProductGrid";
import { ProductDetailView } from "./components/ProductDetailView";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutView } from "./components/CheckoutView";
import { OrderConfirmationView } from "./components/OrderConfirmationView";
import { UserAccountView } from "./components/UserAccountView";
import { AdminDashboard } from "./components/AdminDashboard";
import { QuickViewModal } from "./components/QuickViewModal";
import { AuthModal } from "./components/AuthModal";
import { BrandModals } from "./components/BrandModals";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ToastContainer } from "./components/ToastContainer";

const MainContent: React.FC = () => {
  const { currentView, quickViewProduct, setQuickViewProduct } = useStore();
  const [modalType, setModalType] = useState<"about" | "contact" | "returns" | "privacy" | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#18181B] selection:bg-[#18181B] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Container */}
      <main className="flex-1">
        {currentView === "home" && <HomeView />}
        {currentView === "shop" && <ProductGrid />}
        {currentView === "product-detail" && <ProductDetailView />}
        {currentView === "checkout" && <CheckoutView />}
        {currentView === "order-confirmation" && <OrderConfirmationView />}
        {(currentView === "account" || currentView === "wishlist") && <UserAccountView />}
        {currentView === "admin" && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer onOpenModal={(type) => setModalType(type)} />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Cart Slide-over Drawer */}
      <CartDrawer />

      {/* User Authentication Modal */}
      <AuthModal />

      {/* Brand & Policy Modals */}
      <BrandModals type={modalType} onClose={() => setModalType(null)} />

      {/* WhatsApp Concierge Floating Button */}
      <WhatsAppButton />

      {/* Global Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
