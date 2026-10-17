import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Eye, ShoppingBag, Heart, Scan } from 'lucide-react';
import type { Product } from '@/types';
import { useStore } from '@/store/StoreContext';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist, openQuickView } = useStore();

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <div className="group relative shrink-0 w-[200px] sm:w-[240px] bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-full bg-[#0A192F] text-[#D4AF37] text-[10px] font-bold tracking-wider uppercase">
              {product.badge}
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-[#0A192F] text-[10px] font-bold">
            {discount}% OFF
          </span>
        </div>

        {/* Wishlist heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Slide-up actions */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-1.5 p-3 bg-gradient-to-t from-white via-white/95 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-400">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0A192F] text-white text-xs font-semibold hover:bg-[#0B132B] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#D4AF37] text-[#0A192F] text-xs font-bold hover:brightness-110 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-xs font-semibold hover:border-[#D4AF37] hover:text-[#0A192F] transition-colors"
          >
            <Scan className="w-3.5 h-3.5" />
            Virtual Try-On
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.material}</p>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5 mb-2.5">
          {product.colors.map((color) => (
            <span
              key={color.name}
              className="w-3.5 h-3.5 rounded-full border border-gray-200 ring-1 ring-offset-1 ring-gray-100"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-[#0A192F]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-400 line-through">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}

interface CategoryRowProps {
  title: string;
  products: Product[];
  id: string;
}

export function CategoryRow({ title, products, id }: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  if (products.length === 0) return null;

  return (
    <section id={id} className="relative py-6 sm:py-8 bg-[#0A192F]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white flex items-center gap-3">
            <span className="w-1 h-6 sm:h-8 bg-[#D4AF37] rounded-full" />
            {title}
          </h2>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0A192F] hover:border-[#D4AF37] transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0A192F] hover:border-[#D4AF37] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <div className="shrink-0 w-1" />
        </div>
      </div>
    </section>
  );
}
