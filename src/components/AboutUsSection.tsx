import { useState, useEffect } from 'react';
import { BadgeCheck, Award, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface StoreSettings {
  doctor_name: string;
  doctor_qualification: string;
  doctor_bio: string;
  doctor_image: string;
  doctor_highlights: string[];
}

export function AboutUsSection() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('store_settings')
      .select('doctor_name, doctor_qualification, doctor_bio, doctor_image, doctor_highlights')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as StoreSettings);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  const highlights = settings?.doctor_highlights || [];

  return (
    <section id="about" className="py-16 sm:py-20 bg-[#0A192F]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-4">
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">About Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            About Us
          </h2>
          <p className="text-white/50 text-base">Meet Your Eye Care Expert</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Doctor Photo */}
          <div className="relative max-w-md mx-auto lg:mx-0 w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/20">
              <img
                src={settings?.doctor_image || 'https://images.pexels.com/photos/6749697/pexels-photo-6749697.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'}
                alt={settings?.doctor_name || 'Doctor'}
                className="w-full h-[450px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/50 to-transparent" />
            </div>
            {/* Verified badge */}
            <div className="absolute -bottom-3 -right-3 sm:-right-4 bg-[#0A192F] rounded-2xl shadow-xl border border-[#D4AF37]/30 px-4 py-3 flex items-center gap-2">
              <BadgeCheck className="w-6 h-6 text-[#D4AF37]" />
              <div>
                <p className="text-white text-xs font-bold">Verified</p>
                <p className="text-[#D4AF37] text-[10px]">Optometrist</p>
              </div>
            </div>
            {/* Years badge */}
            <div className="absolute -top-3 -left-3 sm:-left-4 bg-[#D4AF37] rounded-2xl shadow-xl px-4 py-3 text-center">
              <p className="text-[#0A192F] text-2xl font-bold leading-none">15+</p>
              <p className="text-[#0A192F] text-[10px] font-semibold mt-1">Years</p>
            </div>
          </div>

          {/* Doctor Info */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {settings?.doctor_name || 'Nishant Singh Rathour'}
            </h3>
            <p className="text-[#D4AF37] text-sm font-semibold mb-5">
              {settings?.doctor_qualification || 'D.R. OPT (Optometrist)'}
            </p>

            <p className="text-white/60 text-sm leading-relaxed mb-4">
              {settings?.doctor_bio}
            </p>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              At Shivansh Optical & Eye Clinic, we combine traditional values with modern technology to deliver personalized eye care solutions. Every patient receives individual attention and customized treatment plans.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-3">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10">
                  <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  <span className="text-white/70 text-xs font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
