import { MapPin, Clock, Phone, Mail, Navigation, Car } from 'lucide-react';

const mapSrc =
  'https://www.google.com/maps?q=Hazratganj+Lucknow+Uttar+Pradesh&output=embed';

const directionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Shivansh+Optical+Eye+Clinic+Hazratganj+Lucknow+Uttar+Pradesh+226001';

export function StoreLocation() {
  return (
    <section id="store-location" className="bg-[#0B132B] py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mb-4">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase">
              Find Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Visit Our Store
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Located in the heart of Hazratganj, Lucknow — we'd love to see you in person.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          {/* Map */}
          <div className="lg:col-span-3 rounded-3xl overflow-hidden shadow-2xl min-h-[350px] lg:min-h-[450px] border border-white/10">
            <iframe
              title="Shivansh Optical & Eye Clinic Location"
              src={mapSrc}
              className="w-full h-full min-h-[350px] lg:min-h-[450px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Store Details Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0A192F] to-[#0B132B] rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-1">Shivansh Optical & Eye Clinic</h3>
            <p className="text-[#D4AF37] text-sm font-medium mb-6">Premium Eyewear & Eye Care</p>

            {/* Address */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">Address</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  Shop No. 12, Hazratganj<br />
                  Lucknow, Uttar Pradesh 226001<br />
                  India
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">Operating Hours</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Mon - Fri</span>
                    <span className="text-white font-medium">9 AM - 8 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Saturday</span>
                    <span className="text-white font-medium">9 AM - 9 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Sunday</span>
                    <span className="text-white font-medium">10 AM - 6 PM</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">Open Now</span>
                </div>
              </div>
            </div>

            {/* Phone */}
            <a href="tel:+919876543210" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors">
                <Phone className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Call Us</p>
                <p className="text-white/80 text-sm group-hover:text-[#D4AF37] transition-colors">+91 98765 43210</p>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:care@shivanshoptical.in" className="flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Email</p>
                <p className="text-white/80 text-sm group-hover:text-[#D4AF37] transition-colors">care@shivanshoptical.in</p>
              </div>
            </a>

            {/* Get Directions */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 hover:scale-[1.02] transition-all duration-300"
            >
              <Navigation className="w-5 h-5" />
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
