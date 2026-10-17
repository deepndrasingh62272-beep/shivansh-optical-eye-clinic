import { StoreProvider, useStore } from '@/store/StoreContext';
import { Header } from '@/components/Header';
import { HeroCarousel } from '@/components/HeroCarousel';
import { CategoryRow } from '@/components/ProductCard';
import { ClinicSection } from '@/components/ClinicSection';
import { StoreLocation } from '@/components/StoreLocation';
import { Footer } from '@/components/Footer';
import { MobileNav } from '@/components/MobileNav';
import { CartDrawer } from '@/components/CartDrawer';
import { WishlistDrawer } from '@/components/WishlistDrawer';
import { BookingModal } from '@/components/BookingModal';
import { QuickViewModal } from '@/components/QuickViewModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { AdminDashboard } from '@/components/AdminDashboard';
import { SpecialOffersSection } from '@/components/SpecialOffersSection';
import { AboutUsSection } from '@/components/AboutUsSection';
import { OurServicesSection } from '@/components/OurServicesSection';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';
import { useState, useEffect } from 'react';

function usePathname() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onChange);
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return path;
}

function MainContent() {
  const { searchQuery } = useStore();
  const { products, loading } = useProducts();

  const filterProducts = (category: string): Product[] => {
    let list = products;
    if (category !== 'all') {
      list = products.filter((p) => p.category === category);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }
    return list;
  };

  const trending = products.filter((p) => p.badge === 'Trending' || p.badge === 'Bestseller' || p.rating >= 4.7);
  const eyeglasses = filterProducts('eyeglasses');
  const sunglasses = filterProducts('sunglasses');
  const computer = filterProducts('computer');
  const allFiltered = filterProducts('all');

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center bg-[#0A192F]">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main>
      <HeroCarousel />

      <CategoryRow
        title="Trending Now"
        products={searchQuery ? allFiltered : trending}
        id="trending"
      />

      <CategoryRow
        title="Best Sellers in Eyeglasses"
        products={eyeglasses}
        id="eyeglasses"
      />

      <CategoryRow
        title="Designer Sunglasses"
        products={sunglasses}
        id="sunglasses"
      />

      <CategoryRow
        title="Anti-Glare Computer Glasses"
        products={computer}
        id="computer"
      />

      <SpecialOffersSection />
      <AboutUsSection />
      <OurServicesSection />
      <ClinicSection />
      <StoreLocation />
      <Footer />
    </main>
  );
}

function AppContent() {
  const pathname = usePathname();

  if (pathname === '/admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <Header />
      <MainContent />
      <MobileNav />
      <CartDrawer />
      <WishlistDrawer />
      <BookingModal />
      <QuickViewModal />
      <CheckoutModal />
    </div>
  );
}

function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
