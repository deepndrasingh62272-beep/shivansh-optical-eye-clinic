import { useState } from 'react';
import { X, User, Phone, CheckCircle, ShoppingBag, MessageCircle } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { supabase, STORE_WHATSAPP } from '@/lib/supabase';
import { buildOrderWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp';

export function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, cart, cartTotal, clearCart } = useStore();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setSubmitting(true);
    setError('');

    try {
      const { error: dbError } = await supabase.from('orders').insert({
        customer_name: name,
        phone,
        items: cart.map((item) => ({
          product_id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          price: item.product.price,
          quantity: item.quantity,
          selected_color: item.selectedColor,
        })),
        total: cartTotal,
        status: 'Pending',
      });

      if (dbError) throw new Error(dbError.message);

      const message = buildOrderWhatsAppMessage(name, phone, cart, cartTotal);
      openWhatsApp(message, STORE_WHATSAPP);

      setStep('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    closeCheckout();
    setTimeout(() => {
      setStep('form');
      setName('');
      setPhone('');
      setError('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
        {step === 'success' ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A192F] mb-2">Order Placed!</h3>
            <p className="text-gray-600 mb-1">
              Thank you, <span className="font-semibold text-[#0A192F]">{name}</span>!
            </p>
            <p className="text-gray-600 mb-4">
              We've opened WhatsApp with your order details. Send the message to confirm.
            </p>
            <div className="bg-[#0A192F] rounded-2xl p-4 mb-6 text-left">
              <p className="text-white/60 text-xs mb-2">Order Summary</p>
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-white/80 text-sm py-1">
                  <span className="truncate">{item.product.name} x{item.quantity}</span>
                  <span>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="flex justify-between text-[#D4AF37] font-bold text-sm pt-2 border-t border-white/10 mt-2">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button
              onClick={() => {
                clearCart();
                handleClose();
              }}
              className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#0A192F] to-[#0B132B] p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Checkout</h3>
                  <p className="text-white/60 text-xs">Confirm via WhatsApp</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Cart summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-5">
                <div className="space-y-1.5 mb-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate">
                        {item.product.name} <span className="text-gray-400">x{item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-800">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-[#0A192F]">
                    ₹{cartTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full Name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={!name || !phone || submitting}
                  className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    'Placing Order...'
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Place Order via WhatsApp
                    </>
                  )}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
