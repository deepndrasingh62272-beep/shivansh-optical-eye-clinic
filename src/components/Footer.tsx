import { MapPin, Clock, Phone, Mail, Instagram, Facebook, Twitter, Youtube, Code, ExternalLink } from 'lucide-react';
import { ClinicLogo } from '@/components/ClinicLogo';
import { useState } from 'react';
import { POLICIES } from '@/config/policies';

const quickLinks = ['Eyeglasses', 'Sunglasses', 'Computer Glasses', 'Eye Test Booking', 'About Us', 'Careers'];

function PolicyModal({ title, content, isOpen, onClose }: { title: string; content: string; isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-[#0A192F] rounded-3xl border border-white/10 max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#0A192F] to-[#0B132B] p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#D4AF37]">{title}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}

export function Footer() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<{ icon: typeof Instagram; name: string; url: string }[]>([
    { icon: Instagram, name: 'Instagram', url: 'https://instagram.com' },
    { icon: Facebook, name: 'Facebook', url: 'https://facebook.com' },
    { icon: Twitter, name: 'X', url: 'https://x.com' },
    { icon: Youtube, name: 'YouTube', url: 'https://youtube.com' },
  ]);

  const quickLinks = ['Eyeglasses', 'Sunglasses', 'Computer Glasses', 'Eye Test Booking', 'About Us', 'Careers'];

  const privacyContent = POLICIES.privacy_policy;
  const termsContent = POLICIES.terms_of_service;
  const refundContent = POLICIES.refund_policy;

  return (
    <footer id="contact" className="bg-[#0B132B] pt-16 pb-20 lg:pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <ClinicLogo className="h-16 w-20 object-contain" />
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Premium eyewear and comprehensive eye care in the heart of Lucknow.
              Trusted by thousands for quality vision solutions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all duration-300"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => {
                      const id = link.toLowerCase().replace(/\s+/g, '').replace('eyeglasses', 'eyeglasses').replace('sunglasses', 'sunglasses').replace('computerglasses', 'computer').replace('eyetestbooking', 'booking');
                      const el = document.getElementById(id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-white/50 text-sm hover:text-[#D4AF37] transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Location */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Visit Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <p className="text-white/50 text-sm leading-relaxed">
                  Shop No. 12, Hazratganj<br />
                  Lucknow, Uttar Pradesh 226001<br />
                  India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <p className="text-white/50 text-sm">+91 98765 43210</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <p className="text-white/50 text-sm">care@shivanshoptical.in</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Operating Hours
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Mon - Fri</span>
                <span className="text-white/80 font-medium">9 AM - 8 PM</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Saturday</span>
                <span className="text-white/80 font-medium">9 AM - 9 PM</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/50">Sunday</span>
                <span className="text-white/80 font-medium">10 AM - 6 PM</span>
              </div>
              <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <Clock className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-semibold">Open Now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <p className="text-white/40 text-xs">
              © 2026 Shivansh Optical & Eye Clinic. All rights reserved.
            </p>
            <div className="flex gap-6">
              <button 
                onClick={() => setActivePolicy('privacy')}
                className="text-white/40 text-xs hover:text-[#D4AF37] transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => setActivePolicy('terms')}
                className="text-white/40 text-xs hover:text-[#D4AF37] transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => setActivePolicy('refund')}
                className="text-white/40 text-xs hover:text-[#D4AF37] transition-colors"
              >
                Refund Policy
              </button>
            </div>
          </div>

          {/* Developer Info */}
          <div className="pt-6 border-t border-white/10 bg-white/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-[#D4AF37]" />
              <p className="text-white/70 text-xs font-semibold">Developed by</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-sm">Dipendra Singh</p>
                <a 
                  href="mailto:deepndrasingh62272@gmail.com"
                  className="text-[#D4AF37] text-xs hover:underline flex items-center gap-1 mt-1"
                >
                  <Mail className="w-3 h-3" />
                  deepndrasingh62272@gmail.com
                </a>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30" />
            </div>
          </div>
        </div>

        {/* Policy Modals */}
        <PolicyModal 
          title="Privacy Policy" 
          content={privacyContent} 
          isOpen={activePolicy === 'privacy'} 
          onClose={() => setActivePolicy(null)} 
        />
        <PolicyModal 
          title="Terms of Service" 
          content={termsContent} 
          isOpen={activePolicy === 'terms'} 
          onClose={() => setActivePolicy(null)} 
        />
        <PolicyModal 
          title="Refund Policy" 
          content={refundContent} 
          isOpen={activePolicy === 'refund'} 
          onClose={() => setActivePolicy(null)} 
        />
      </div>
    </footer>
  );
}
