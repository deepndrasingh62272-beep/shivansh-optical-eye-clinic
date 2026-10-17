import { useState } from 'react';
import { X, Calendar, Clock, User, Phone, CheckCircle, Stethoscope, MessageCircle } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { supabase, STORE_WHATSAPP } from '@/lib/supabase';
import { buildAppointmentWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp';

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM',
];

export function BookingModal() {
  const { isBookingOpen, closeBooking } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', date: '', slot: '' });

  if (!isBookingOpen) return null;

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { error: dbError } = await supabase.from('appointments').insert({
        patient_name: form.name,
        phone: form.phone,
        appointment_date: form.date,
        time_slot: form.slot,
        status: 'Pending',
      });
      if (dbError) throw new Error(dbError.message);

      const message = buildAppointmentWhatsAppMessage(form.name, form.phone, form.date, form.slot);
      openWhatsApp(message, STORE_WHATSAPP);

      setSubmitted(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    closeBooking();
    setTimeout(() => {
      setSubmitted(false);
      setError('');
      setForm({ name: '', phone: '', date: '', slot: '' });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out]">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A192F] mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-1">
              Thank you, <span className="font-semibold text-[#0A192F]">{form.name}</span>!
            </p>
            <p className="text-gray-600 mb-6">
              Your eye checkup is scheduled for{' '}
              <span className="font-semibold text-[#0A192F]">
                {form.date} at {form.slot}
              </span>
            </p>
            <div className="bg-[#0A192F] rounded-2xl p-4 mb-6 text-left">
              <p className="text-white/60 text-xs mb-1">Clinic Address</p>
              <p className="text-white text-sm">Shivansh Optical & Eye Clinic</p>
              <p className="text-white/80 text-xs">Hazratganj, Lucknow, UP 226001</p>
              <p className="text-[#D4AF37] text-xs mt-2 flex items-center gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp alert sent to store owner!
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-gradient-to-br from-[#0A192F] to-[#0B132B] p-6 relative">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Book Free Eye Checkup</h3>
                  <p className="text-white/60 text-xs">No charges · 30 min consultation</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Full Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  required
                  type="tel"
                  pattern="[0-9]{10}"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Preferred Date
                </label>
                <input
                  required
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Select Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm({ ...form, slot })}
                      className={`px-2 py-2 rounded-lg text-xs font-semibold border transition-all ${
                        form.slot === slot
                          ? 'bg-[#D4AF37] text-[#0A192F] border-[#D4AF37]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#D4AF37]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
              <button
                type="submit"
                disabled={!form.name || !form.phone || !form.date || !form.slot || submitting}
                className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Booking...' : (
                  <>
                    <MessageCircle className="w-4 h-4" />
                    Confirm via WhatsApp
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
