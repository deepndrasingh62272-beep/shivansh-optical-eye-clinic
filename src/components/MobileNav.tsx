import { Home, Grid3x3, ShoppingBag, User, Heart } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

export function MobileNav() {
  const { openCart, cartCount, openWishlist, wishlist } = useStore();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A192F]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around">
      <button
        onClick={() => scrollToSection('home')}
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-[#D4AF37] transition-colors"
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </button>
      <button
        onClick={() => scrollToSection('trending')}
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-[#D4AF37] transition-colors"
      >
        <Grid3x3 className="w-5 h-5" />
        <span className="text-[10px] font-medium">Shop</span>
      </button>
      <button
        onClick={openWishlist}
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-[#D4AF37] transition-colors relative"
      >
        <Heart className="w-5 h-5" />
        {wishlist.length > 0 && (
          <span className="absolute top-0.5 right-2 w-3.5 h-3.5 bg-[#D4AF37] text-[#0A192F] text-[9px] font-bold rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
        <span className="text-[10px] font-medium">Wishlist</span>
      </button>
      <button
        onClick={openCart}
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-[#D4AF37] transition-colors relative"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute top-0.5 right-2 w-3.5 h-3.5 bg-[#D4AF37] text-[#0A192F] text-[9px] font-bold rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        )}
        <span className="text-[10px] font-medium">Cart</span>
      </button>
      <button
        onClick={() => scrollToSection('contact')}
        className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/70 hover:text-[#D4AF37] transition-colors"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-medium">Profile</span>
      </button>
    </nav>
  );
}
