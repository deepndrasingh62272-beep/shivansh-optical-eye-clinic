import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Calendar, Menu, X, Shield } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { ClinicLogo } from '@/components/ClinicLogo';

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Eyeglasses', id: 'eyeglasses' },
  { label: 'Sunglasses', id: 'sunglasses' },
  { label: 'Computer Glasses', id: 'computer' },
  { label: 'Eye Test Booking', id: 'booking' },
  { label: 'Contact Us', id: 'contact' },
];

export function Header() {
  const { cartCount, wishlist, openCart, openWishlist, openBooking, searchQuery, setSearchQuery } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#0A192F]/95 backdrop-blur-md shadow-lg shadow-black/30 py-1.5'
            : 'bg-[#0A192F] py-2'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center cursor-pointer shrink-0" onClick={() => scrollToSection('home')}>
              <ClinicLogo className="h-[50px] w-[58px] object-contain sm:h-[60px] sm:w-[70px]" />
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-white/80 hover:text-[#D4AF37] transition-colors duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            {/* Utility Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative">
                {searchOpen ? (
                  <div className="flex items-center bg-white/10 rounded-full px-3 py-1.5 border border-[#D4AF37]/30 transition-all duration-300">
                    <Search className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="bg-transparent text-white text-sm ml-2 outline-none w-32 sm:w-40 placeholder:text-white/40"
                    />
                    <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="ml-1">
                      <X className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-[#D4AF37] hover:bg-white/5 transition-all duration-300"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={openWishlist}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-[#D4AF37] hover:bg-white/5 transition-all duration-300"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D4AF37] text-[#0A192F] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-[#D4AF37] hover:bg-white/5 transition-all duration-300"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D4AF37] text-[#0A192F] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin Button */}
              <button
                onClick={() => (window.location.href = '/admin')}
                className="hidden sm:flex items-center gap-1.5 w-9 h-9 rounded-full text-white/60 hover:text-[#D4AF37] hover:bg-white/5 transition-all duration-300"
                title="Owner Admin"
              >
                <Shield className="w-5 h-5" />
              </button>

              {/* Book Eye Test Button */}
              <button
                onClick={openBooking}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37] text-[#0A192F] text-sm font-bold hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-4 h-4" />
                Book Eye Test
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="px-4 py-4 flex flex-col gap-1 bg-[#0B132B] border-t border-white/5">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left px-4 py-3 rounded-lg text-white/80 hover:text-[#D4AF37] hover:bg-white/5 transition-all duration-200 font-medium"
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => { openBooking(); setMobileMenuOpen(false); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#D4AF37] text-[#0A192F] font-bold"
              >
                <Calendar className="w-4 h-4" />
                Book Eye Test
              </button>
              <button
                onClick={() => (window.location.href = '/admin')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-white/20 text-white/70 font-semibold"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
