import { X, Star, Heart } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

export function QuickViewModal() {
  const { isQuickViewOpen, quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist } = useStore();

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const product = quickViewProduct;
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeQuickView} />
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative aspect-square bg-gray-50">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.badge && (
                <span className="px-3 py-1 rounded-full bg-[#0A192F] text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
                  {product.badge}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A192F] text-xs font-bold">
                {discount}% OFF
              </span>
            </div>
          </div>

          <div className="p-6 flex flex-col">
            <p className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-2">
              {product.brand}
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">
              <span className="font-semibold text-gray-800">Material:</span> {product.material}
            </p>

            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">Available Colors</p>
              <div className="flex items-center gap-2">
                {product.colors.map((color) => (
                  <div
                    key={color.name}
                    className="group relative"
                    title={color.name}
                  >
                    <span
                      className="w-7 h-7 rounded-full border-2 border-gray-200 ring-2 ring-offset-1 ring-gray-100 block"
                      style={{ backgroundColor: color.hex }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-[#0A192F]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-lg text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-semibold text-green-600">
                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-auto flex gap-3">
              <button
                onClick={() => {
                  addToCart(product);
                  closeQuickView();
                }}
                className="flex-1 py-3.5 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center hover:border-[#D4AF37] transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
