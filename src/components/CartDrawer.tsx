import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

export function CartDrawer() {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, cartTotal, openCheckout } = useStore();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[56] shadow-2xl transition-transform duration-400 flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-[#0A192F]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-bold text-white">Your Cart</h3>
            <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/20 px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add some frames to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-gray-50 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{item.product.brand}</p>
                    <p className="text-xs text-gray-400">{item.selectedColor}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#0A192F]">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="self-start text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-700">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold text-[#0A192F]">
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={openCheckout}
              className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
