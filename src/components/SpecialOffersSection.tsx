import { useState, useEffect } from 'react';
import { ChevronRight, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/StoreContext';

export interface SpecialOffer {
  id: string;
  title: string;
  hindi_title: string;
  badge: string;
  description: string;
  is_active: boolean;
}

export function SpecialOffersSection() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const { openBooking } = useStore();

  useEffect(() => {
    supabase
      .from('special_offers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setOffers(data as SpecialOffer[]);
        setLoading(false);
      });
  }, []);

  if (loading || offers.length === 0) return null;

  return (
    <section id="offers" className="py-16 sm:py-20 bg-[#0B132B]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-4">
            <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">Save More</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Special Offers
          </h2>
          <p className="text-white/50 text-base">Exclusive Deals for You</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group relative bg-gradient-to-br from-[#0A192F] to-[#0B132B] rounded-2xl border border-white/10 p-6 hover:border-[#D4AF37]/40 transition-all duration-400 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#D4AF37] text-[#0A192F] text-xs font-bold mb-4">
                {offer.badge}
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{offer.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed mb-5">{offer.description}</p>
              <button
                onClick={openBooking}
                className="inline-flex items-center gap-1 text-sm font-semibold text-[#D4AF37] hover:gap-2 transition-all"
              >
                Claim Offer
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
