import { useState, useEffect } from 'react';
import { ChevronRight, Eye, Glasses, Smartphone, ShieldCheck, Sparkles, Monitor, Stethoscope } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/StoreContext';

export interface Service {
  id: string;
  title: string;
  hindi_title: string;
  description: string;
  icon_name: string;
  tags: string[];
}

const iconMap: Record<string, typeof Eye> = {
  Eye,
  Glasses,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Monitor,
  Stethoscope,
};

export function OurServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { openBooking } = useStore();

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data) setServices(data as Service[]);
        setLoading(false);
      });
  }, []);

  if (loading || services.length === 0) return null;

  return (
    <section id="services" className="py-16 sm:py-20 bg-[#0B132B]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-4">
            <Stethoscope className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">What We Do</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Our Services
          </h2>
          <p className="text-white/50 text-base">Comprehensive Eye Care Solutions</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => {
            const Icon = iconMap[service.icon_name] || Eye;
            return (
              <div
                key={service.id}
                className="group bg-gradient-to-br from-[#0A192F] to-[#0B132B] rounded-2xl border border-white/10 p-6 hover:border-[#D4AF37]/40 transition-all duration-400 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors">
                  <Icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-4">{service.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {service.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={openBooking}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#D4AF37] hover:gap-2 transition-all"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
