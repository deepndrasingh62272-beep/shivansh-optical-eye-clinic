import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/StoreContext';
import { heroSlides as fallbackSlides } from '@/data/products';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
}

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const { openBooking } = useStore();

  useEffect(() => {
    supabase
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSlides(data as HeroSlide[]);
        } else {
          setSlides(fallbackSlides.map((s) => ({
            id: s.id,
            title: s.title,
            subtitle: s.subtitle,
            cta_text: s.cta,
            cta_link: s.category,
            image_url: s.image,
          })));
        }
      });
  }, []);

  const slidesCount = slides.length || 1;
  const next = useCallback(() => setCurrent((p) => (p + 1) % slidesCount), [slidesCount]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slidesCount) % slidesCount), [slidesCount]);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, isPaused, slides.length]);

  const scrollToCategory = (link: string) => {
    if (link === 'clinic') {
      openBooking();
      return;
    }
    const el = document.getElementById(link === 'all' ? 'trending' : link);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (slides.length === 0) {
    return (
      <section id="home" className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] min-h-[500px] bg-[#0A192F] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section
      id="home"
      className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] min-h-[500px] overflow-hidden bg-[#0A192F]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={slide.image_url}
              alt={slide.title}
              className={`w-full h-full object-cover transition-transform duration-[7000ms] ${
                idx === current ? 'scale-110' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F] via-[#0A192F]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-[#0A192F]/30" />
          </div>

          <div className="relative h-full flex items-center">
            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div
                className={`max-w-2xl transition-all duration-1000 ${
                  idx === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
                    Shivansh Exclusive
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-lg">
                  {slide.subtitle}
                </p>
                <button
                  onClick={() => scrollToCategory(slide.cta_link)}
                  className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D4AF37] text-[#0A192F] font-bold text-base hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300"
                >
                  {slide.cta_text}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0A192F] transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0A192F] transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-[#D4AF37]' : 'w-1.5 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
