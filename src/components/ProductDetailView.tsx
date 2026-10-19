import React, { useState } from "react";
import { useStore } from "../context/StoreContext";
import { ProductCard } from "./ProductCard";
import {
  Heart,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  MapPin,
  Sparkles,
} from "lucide-react";

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductId,
    getProductById,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    getProductReviews,
    addReview,
    products,
    showToast,
  } = useStore();

  const product = selectedProductId ? getProductById(selectedProductId) : null;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="font-serif text-2xl text-[#18181B]">Product not found</p>
        <button
          onClick={() => setCurrentView("shop")}
          className="mt-4 bg-[#18181B] text-white py-2 px-6 rounded text-xs uppercase tracking-wider font-semibold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("400050");
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Accordion state
  const [openSection, setOpenSection] = useState<string | null>("fabric");

  // Review Form state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const reviews = getProductReviews(product.id);
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast("Missing Fields", "Please provide your name and review remarks.", "error");
      return;
    }
    addReview({
      productId: product.id,
      userName: reviewName.trim(),
      title: reviewTitle.trim() || "Verified Experience",
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewName("");
    setReviewTitle("");
    setReviewComment("");
    setIsWritingReview(false);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.gender === product.gender || p.category === product.category))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#71717A] pb-8">
        <button
          onClick={() => setCurrentView("home")}
          className="hover:text-[#18181B] transition-colors"
        >
          Home
        </button>
        <ChevronRight size={12} />
        <button
          onClick={() => setCurrentView("shop")}
          className="hover:text-[#18181B] transition-colors"
        >
          Collections
        </button>
        <ChevronRight size={12} />
        <span className="capitalize">{product.gender}</span>
        <ChevronRight size={12} />
        <span className="text-[#18181B] font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Contiguous Purchase Module (Desktop split grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
        
        {/* Left Column: Visual Gallery (takes 7 columns) */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-18 h-24 sm:w-20 sm:h-28 rounded-xs overflow-hidden border transition-all ${
                    activeImageIdx === idx
                      ? "border-[#18181B] ring-1 ring-[#18181B]"
                      : "border-[#E8E2D7] opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Primary Big Image */}
          <div className="flex-1 bg-[#F4F1EA] rounded-sm overflow-hidden aspect-[3/4] relative">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-[#18181B] text-white text-[11px] font-mono uppercase tracking-wider px-2.5 py-1">
                Save {product.discountPercent}%
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (takes 5 columns) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="space-y-2 border-b border-[#E8E2D7] pb-5">
            <div className="flex items-center gap-2 text-xs text-[#71717A]">
              <span className="uppercase tracking-widest text-[#8C7355] font-semibold">
                {product.gender}'s {product.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[#52525B]">SKU: {product.id.toUpperCase()}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#18181B] leading-tight">
              {product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-[#8C7355]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(product.rating) ? "fill-[#8C7355]" : "text-[#D4C7B5]"}
                  />
                ))}
              </div>
              <span className="font-mono text-sm font-semibold tabular-nums text-[#18181B]">
                {product.rating}
              </span>
              <span className="text-xs text-[#71717A]">
                ({product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Price display in INR */}
            <div className="pt-2 flex items-baseline gap-3">
              <span className="font-mono text-3xl font-bold text-[#18181B] tabular-nums">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-mono text-lg text-[#A1A1AA] line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-xs text-[#71717A]">
                Inclusive of all taxes
              </span>
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B] flex items-center justify-between">
              <span>Color: <strong className="font-normal text-[#52525B]">{selectedColor.name}</strong></span>
            </label>
            <div className="flex items-center gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`flex items-center gap-2 px-3 py-1.5 border rounded-xs text-xs transition-all ${
                    selectedColor.name === c.name
                      ? "border-[#18181B] bg-white text-[#18181B] font-semibold shadow-xs"
                      : "border-[#E8E2D7] bg-[#FAF9F5] text-[#71717A] hover:border-[#18181B]"
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B]">
                Select Size
              </label>
              <button
                type="button"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-xs text-[#8C7355] underline hover:text-[#5A4634]"
              >
                Size Guide & Measurements
              </button>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-3 text-xs font-mono font-medium rounded-xs border text-center transition-all ${
                    selectedSize === sz
                      ? "bg-[#18181B] text-white border-[#18181B] shadow-xs"
                      : "bg-white text-[#18181B] border-[#E8E2D7] hover:border-[#18181B]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Size Guide Drawer/Box */}
            {showSizeGuide && (
              <div className="bg-white border border-[#E8E2D7] p-4 text-xs space-y-2 mt-2 animate-fadeIn rounded-xs">
                <p className="font-semibold uppercase tracking-wider text-[#18181B]">
                  Tailoring Standard Measurements (Inches)
                </p>
                <div className="grid grid-cols-4 gap-2 text-center border-t border-[#E8E2D7] pt-2 font-mono tabular-nums">
                  <div><strong>Size</strong><p>S</p><p>M</p><p>L</p><p>XL</p></div>
                  <div><strong>Chest</strong><p>38"</p><p>40"</p><p>42"</p><p>44"</p></div>
                  <div><strong>Waist</strong><p>31"</p><p>33"</p><p>35"</p><p>37"</p></div>
                  <div><strong>Length</strong><p>28"</p><p>29"</p><p>30"</p><p>31"</p></div>
                </div>
              </div>
            )}
          </div>

          {/* Stock Availability */}
          <div className="text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[#52525B]">
              In Stock · {product.stockCount} units tailored & ready for shipment
            </span>
          </div>

          {/* Action Row: Quantity + Add to Cart + Wishlist */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center border border-[#E8E2D7] bg-white rounded-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-3 text-sm hover:bg-[#F3EFE6] transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-3 py-3 text-sm font-mono font-semibold tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                className="px-3.5 py-3 text-sm hover:bg-[#F3EFE6] transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 bg-[#18181B] hover:bg-[#27272A] text-white py-3.5 px-6 rounded-xs text-xs uppercase tracking-[0.18em] font-semibold transition-all shadow-sm active:scale-[0.99]"
            >
              Add to Shopping Bag
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 border rounded-xs transition-colors ${
                isSaved
                  ? "border-[#8C7355] bg-[#8C7355]/10 text-[#8C7355]"
                  : "border-[#E8E2D7] hover:border-[#18181B] text-[#18181B]"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart size={18} className={isSaved ? "fill-[#8C7355]" : ""} />
            </button>
          </div>

          {/* Pincode Delivery Estimator */}
          <div className="border border-[#E8E2D7] bg-white p-4 rounded-xs space-y-2">
            <label className="text-xs uppercase tracking-wider font-semibold text-[#18181B] flex items-center gap-1.5">
              <MapPin size={14} className="text-[#8C7355]" />
              <span>Check Delivery & Cash on Delivery</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value);
                  setPincodeChecked(false);
                }}
                placeholder="Enter 6-digit Pincode"
                className="w-full text-xs font-mono py-2 px-3 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
              />
              <button
                onClick={() => setPincodeChecked(true)}
                className="bg-[#18181B] text-white text-xs uppercase px-4 py-2 rounded-xs font-medium hover:bg-[#27272A]"
              >
                Verify
              </button>
            </div>
            {pincodeChecked && pincode.length >= 6 && (
              <div className="text-xs text-[#52525B] space-y-1 pt-1">
                <p className="text-emerald-700 font-medium">✓ Delivery available to {pincode}</p>
                <p>• Estimated Express Delivery by <strong>Thursday, Oct 22</strong></p>
                <p>• Cash on Delivery (COD) supported</p>
              </div>
            )}
          </div>

          {/* Accordion: Craftsmanship, Care, and Shipping */}
          <div className="border-t border-[#E8E2D7] pt-4 space-y-3">
            {/* Description */}
            <div className="border-b border-[#E8E2D7] pb-3">
              <button
                onClick={() => setOpenSection(openSection === "fabric" ? null : "fabric")}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#18181B]"
              >
                <span>Fabric Composition & Tailoring</span>
                {openSection === "fabric" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSection === "fabric" && (
                <div className="pt-3 text-xs text-[#52525B] space-y-2 animate-fadeIn">
                  <p className="font-medium text-[#18181B]">{product.fabric}</p>
                  <p>{product.description}</p>
                  <ul className="list-disc list-inside space-y-1 pt-1 text-[#71717A]">
                    {product.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Care */}
            <div className="border-b border-[#E8E2D7] pb-3">
              <button
                onClick={() => setOpenSection(openSection === "care" ? null : "care")}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#18181B]"
              >
                <span>Garment Care & Longevity</span>
                {openSection === "care" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSection === "care" && (
                <div className="pt-3 text-xs text-[#52525B] animate-fadeIn">
                  <p>{product.care}</p>
                </div>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="border-b border-[#E8E2D7] pb-3">
              <button
                onClick={() => setOpenSection(openSection === "shipping" ? null : "shipping")}
                className="w-full flex items-center justify-between text-left text-xs uppercase tracking-wider font-semibold text-[#18181B]"
              >
                <span>Shipping, Cash on Delivery & Returns</span>
                {openSection === "shipping" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {openSection === "shipping" && (
                <div className="pt-3 text-xs text-[#52525B] space-y-1.5 animate-fadeIn">
                  <p>• Complimentary express courier shipping across India on orders &gt; ₹999.</p>
                  <p>• Hassle-free 15-day return window with direct doorstep pickup.</p>
                  <p>• Secure Cash on Delivery (COD) and instant UPI/Card payments.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div className="mt-16 pt-12 border-t border-[#E8E2D7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C7355] font-semibold">
              Patron Testimonials
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B]">
              Customer Reviews ({reviews.length})
            </h2>
          </div>

          <button
            onClick={() => setIsWritingReview(!isWritingReview)}
            className="border border-[#18181B] text-[#18181B] hover:bg-[#18181B] hover:text-white px-5 py-2.5 rounded-xs text-xs uppercase tracking-wider font-semibold transition-colors self-start md:self-auto"
          >
            {isWritingReview ? "Cancel Review" : "Write a Review"}
          </button>
        </div>

        {/* Review Submission Form */}
        {isWritingReview && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white border border-[#E8E2D7] p-6 mb-8 rounded-sm space-y-4 max-w-2xl animate-fadeIn"
          >
            <h3 className="text-sm uppercase tracking-wider font-semibold text-[#18181B]">
              Share Your Thoughts on This Piece
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="e.g. Priyanshu Sharma"
                  className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                  Rating
                </label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
                >
                  <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                  <option value={4}>★★★★☆ (4 Stars - Great)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Satisfactory)</option>
                  <option value={2}>★★☆☆☆ (2 Stars - Below expectations)</option>
                  <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                Headline / Summary
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Masterclass in silhouette and drape"
                className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-wider text-[#71717A] font-medium block mb-1">
                Your Detailed Review
              </label>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe fit, fabric quality, styling versatility, and packaging..."
                className="w-full text-xs p-2.5 border border-[#E8E2D7] rounded-xs focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#18181B] text-white py-2.5 px-6 rounded-xs text-xs uppercase tracking-widest font-semibold hover:bg-[#27272A] transition-colors"
            >
              Publish Verified Review
            </button>
          </form>
        )}

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-[#E8E2D7] p-5 rounded-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex text-[#8C7355]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={i < rev.rating ? "fill-[#8C7355]" : "text-[#D4C7B5]"}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#A1A1AA]">{rev.date}</span>
                </div>

                <h4 className="font-serif text-base font-semibold text-[#18181B]">
                  {rev.title}
                </h4>

                <p className="text-xs text-[#52525B] leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#71717A]">
                  <span className="font-medium text-[#18181B]">{rev.userName}</span>
                  {rev.verified && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 flex items-center gap-0.5">
                        <Check size={11} /> Verified Buyer
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 py-8 text-center bg-white border border-[#E8E2D7] p-6 text-xs text-[#71717A]">
              No reviews yet for this piece. Be the first patron to share your styling experience.
            </div>
          )}
        </div>
      </div>

      {/* Related Products Recommendation Carousel/Grid */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#E8E2D7]">
          <div className="space-y-1 mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C7355] font-semibold">
              Curated Ensembles
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B]">
              Complete The Look
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Carousel/Grid */}
      {products.filter((p) => p.id !== product.id).slice(0, 4).length > 0 && (
        <div className="mt-16 pt-12 border-t border-[#E8E2D7]">
          <div className="space-y-1 mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C7355] font-semibold">
              Browsing Memory
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#18181B]">
              Recently Viewed Pieces
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.filter((p) => p.id !== product.id).slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
