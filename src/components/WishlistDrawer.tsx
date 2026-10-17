import { X, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { useProducts } from '@/hooks/useProducts';
import { useEffect, useState } from 'react';

export function WishlistDrawer() {
  const { isWishlistOpen, closeWishlist, wishlist, toggleWishlist, addToCart } = useStore();
  const { products } = useProducts();
  const [items, setItems] = useState(() => products.filter((p) => wishlist.includes(p.id)));

  useEffect(() => {
    setItems(products.filter((p) => wishlist.includes(p.id)));
  }, [wishlist, products]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 ${
          isWishlistOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeWishlist}
      />
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[56] shadow-2xl transition-transform duration-400 flex flex-col ${
          isWishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#0A192F]">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-white">Wishlist</h3>
            <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/20 px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={closeWishlist}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Your wishlist is empty</p>
              <p className="text-gray-400 text-sm mt-1">Tap the heart on any frame to save it</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <span className="text-sm font-bold text-[#0A192F]">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(product);
                        toggleWishlist(product.id);
                      }}
                      className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#0A192F] text-xs font-bold hover:shadow-md transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Cart
                    </button>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="self-start text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
