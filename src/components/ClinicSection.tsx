import { Calendar, Eye, Shield, Award, Users, Clock } from 'lucide-react';
import { useStore } from '@/store/StoreContext';

const features = [
  { icon: Eye, title: 'Advanced Diagnostics', desc: 'Digital eye testing with latest equipment' },
  { icon: Shield, title: 'Expert Optometrists', desc: 'Certified professionals with 15+ years' },
  { icon: Award, title: 'Premium Lenses', desc: 'Zeiss, Essilor & Crizal lens options' },
  { icon: Users, title: '10,000+ Patients', desc: 'Trusted by the Lucknow community' },
];

export function ClinicSection() {
  const { openBooking } = useStore();

  return (
    <section id="booking" className="relative py-16 sm:py-20 bg-gradient-to-b from-[#0B132B] to-[#0A192F] overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#D4AF37] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[#D4AF37] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/6749697/pexels-photo-6749697.jpeg?auto=compress&cs=tinysrgb&h=800&w=1200"
                alt="Eye examination at Shivansh Eye Clinic"
                className="w-full h-[400px] sm:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/60 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0A192F] leading-none">FREE</p>
                <p className="text-xs text-gray-500 mt-1">Eye Checkup Camp</p>
              </div>
            </div>
          </div>

          {/* Right - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
                Eye Clinic
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Comprehensive Eye Care
              <span className="block text-[#D4AF37]">You Can Trust</span>
            </h2>

            <p className="text-white/60 text-base sm:text-lg mb-8 max-w-lg">
              From routine checkups to advanced diagnostics, our clinic is equipped with
              state-of-the-art technology and staffed by experienced optometrists dedicated
              to your vision health.
            </p>

            {/* Features grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{f.title}</p>
                    <p className="text-xs text-white/50 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={openBooking}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#D4AF37] text-[#0A192F] font-bold text-base hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300"
            >
              <Calendar className="w-5 h-5" />
              Book Free Eye Checkup
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
