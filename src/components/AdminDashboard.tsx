import { useState, useEffect, useCallback } from 'react';
import {
  Lock, Eye, EyeOff, Calendar, ShoppingBag, MessageCircle, LogOut,
  RefreshCw, CheckCircle2, Clock3, XCircle, Stethoscope, ExternalLink,
  Settings, Plus, Pencil, Trash2, X, Glasses, KeyRound, Tag, Image,
  Store, ArrowUp, ArrowDown, Phone, Mail, MapPin, Clock,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ClinicLogo } from '@/components/ClinicLogo';
import type { ProductCategory } from '@/types';

interface Appointment {
  id: string;
  patient_name: string;
  phone: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  items: { name: string; brand: string; price: number; quantity: number; selected_color: string }[];
  total: number;
  status: string;
  created_at: string;
}

interface DbProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  material: string;
  price: number;
  original_price: number;
  image_url: string;
  colors: { name: string; hex: string }[];
  rating: number;
  reviews: number;
  badge: string | null;
}

type StatusFilter = 'all' | 'Pending' | 'Confirmed' | 'Completed';
type AdminTab = 'appointments' | 'orders' | 'products' | 'offers' | 'services' | 'hero' | 'settings' | 'security';

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
};

function statusIcon(status: string) {
  if (status === 'Completed') return <CheckCircle2 className="w-3.5 h-3.5" />;
  if (status === 'Confirmed') return <Clock3 className="w-3.5 h-3.5" />;
  return <XCircle className="w-3.5 h-3.5" />;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/* ============= Login Screen ============= */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    const { data } = await supabase
      .from('admin_settings')
      .select('pin')
      .eq('id', 1)
      .maybeSingle();

    if (data && pin === data.pin) {
      onLogin();
    } else {
      setError(true);
      setPin('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#0B132B] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 text-center bg-gradient-to-br from-[#0A192F] to-[#0B132B]">
          <ClinicLogo className="h-20 w-24 object-contain mx-auto mb-3" />
          <p className="text-white/40 text-xs mt-3">Owner Admin Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Enter 8-Digit PIN
            </label>
            <div className="relative">
              <input
                autoFocus
                type={show ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, '').slice(0, 8));
                  setError(false);
                }}
                placeholder="••••••••"
                maxLength={8}
                className={`w-full px-4 py-3 pr-10 rounded-xl border text-lg tracking-[0.3em] text-center font-bold outline-none transition-all ${
                  error
                    ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">Incorrect PIN. Try again.</p>}
          </div>

          <button
            type="submit"
            disabled={pin.length < 8 || loading}
            className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Verifying...' : 'Unlock Dashboard'}
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = '/')}
            className="w-full py-2.5 text-gray-500 text-sm font-medium hover:text-[#0A192F] transition-colors"
          >
            Back to Website
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============= Appointments Tab ============= */

function AppointmentsTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setAppointments(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {(['all', 'Pending', 'Confirmed', 'Completed'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-[#D4AF37] text-[#0A192F]'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <button
          onClick={fetchAppointments}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#D4AF37] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Stethoscope className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/40 font-medium">No appointments found</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-semibold">Patient</th>
                  <th className="px-5 py-3 text-left font-semibold">Mobile</th>
                  <th className="px-5 py-3 text-left font-semibold">Date</th>
                  <th className="px-5 py-3 text-left font-semibold">Slot</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                  <th className="px-5 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5"><p className="text-white font-medium text-sm">{a.patient_name}</p></td>
                    <td className="px-5 py-3.5"><span className="text-white/70 text-sm">{a.phone}</span></td>
                    <td className="px-5 py-3.5"><span className="text-white/70 text-sm">{formatDate(a.appointment_date)}</span></td>
                    <td className="px-5 py-3.5"><span className="text-white/70 text-sm">{a.time_slot}</span></td>
                    <td className="px-5 py-3.5">
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer outline-none ${statusColors[a.status]}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`https://wa.me/${a.phone}?text=${encodeURIComponent(
                          `Hello ${a.patient_name}, this is Shivansh Optical & Eye Clinic regarding your appointment on ${formatDate(a.appointment_date)} at ${a.time_slot}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-3">
            {filtered.map((a) => (
              <div key={a.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-bold text-sm">{a.patient_name}</p>
                    <p className="text-white/50 text-xs mt-0.5">{a.phone}</p>
                  </div>
                  <select
                    value={a.status}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer outline-none ${statusColors[a.status]}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(a.appointment_date)}</span>
                  <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" /> {a.time_slot}</span>
                </div>
                <a
                  href={`https://wa.me/${a.phone}?text=${encodeURIComponent(
                    `Hello ${a.patient_name}, this is Shivansh Optical & Eye Clinic regarding your appointment on ${formatDate(a.appointment_date)} at ${a.time_slot}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Contact via WhatsApp
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============= Orders Tab ============= */

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {(['all', 'Pending', 'Confirmed', 'Completed'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                filter === f
                  ? 'bg-[#D4AF37] text-[#0A192F]'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#D4AF37] transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/40 font-medium">No orders found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((o) => (
            <div key={o.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-bold text-sm">{o.customer_name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{o.phone}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${statusColors[o.status]}`}>
                  {statusIcon(o.status)}
                  {o.status}
                </span>
              </div>

              <div className="space-y-1.5 mb-3">
                {o.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-white/60 truncate">{item.name} ({item.selected_color}) x{item.quantity}</span>
                    <span className="text-white/80 font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2 border-t border-white/10 mb-3">
                <span className="text-[#D4AF37] font-bold text-sm">Total</span>
                <span className="text-white font-bold text-sm">₹{o.total.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-white/40">Update:</span>
                <select
                  value={o.status}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border cursor-pointer outline-none ${statusColors[o.status]}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <a
                href={`https://wa.me/${o.phone}?text=${encodeURIComponent(
                  `Hello ${o.customer_name}, this is Shivansh Optical & Eye Clinic regarding your order (Total: ₹${o.total.toLocaleString('en-IN')}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-semibold hover:bg-green-500/20 transition-colors w-full justify-center"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Contact via WhatsApp
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============= Products Tab ============= */

interface ProductFormState {
  name: string;
  brand: string;
  category: string;
  material: string;
  price: string;
  original_price: string;
  image_url: string;
  colors: { name: string; hex: string }[];
  badge: string;
}

const emptyForm: ProductFormState = {
  name: '',
  brand: '',
  category: 'eyeglasses',
  material: 'Acetate',
  price: '',
  original_price: '',
  image_url: '',
  colors: [{ name: 'Black', hex: '#1a1a1a' }],
  badge: '',
};

function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product: DbProduct | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState<ProductFormState>(
    product
      ? {
          name: product.name,
          brand: product.brand,
          category: product.category,
          material: product.material,
          price: String(product.price),
          original_price: String(product.original_price),
          image_url: product.image_url,
          colors: product.colors || [{ name: 'Black', hex: '#1a1a1a' }],
          badge: product.badge || '',
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateColor = (i: number, field: 'name' | 'hex', val: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, idx) => (idx === i ? { ...c, [field]: val } : c)),
    }));
  };

  const addColor = () => {
    setForm((prev) => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#000000' }] }));
  };

  const removeColor = (i: number) => {
    setForm((prev) => ({ ...prev, colors: prev.colors.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      material: form.material,
      price: Number(form.price),
      original_price: Number(form.original_price),
      image_url: form.image_url,
      colors: form.colors,
      rating: product?.rating ?? 4.5,
      reviews: product?.reviews ?? 0,
      badge: form.badge || null,
    };

    if (payload.price <= 0 || payload.original_price <= 0) {
      setError('Prices must be greater than 0.');
      setSaving(false);
      return;
    }
    if (!form.name || !form.brand || !form.image_url) {
      setError('Name, brand, and image URL are required.');
      setSaving(false);
      return;
    }

    try {
      if (product) {
        const { error: dbError } = await supabase
          .from('products_db')
          .update(payload)
          .eq('id', product.id);
        if (dbError) throw new Error(dbError.message);
      } else {
        const { error: dbError } = await supabase.from('products_db').insert(payload);
        if (dbError) throw new Error(dbError.message);
      }
      onSave();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save product.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#0A192F] to-[#0B132B] p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Glasses className="w-5 h-5 text-[#D4AF37]" />
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Image preview */}
          {form.image_url && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
              <img
                src={form.image_url}
                alt="Preview"
                className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0"
              />
              <div className="text-xs text-gray-500">
                <p className="font-semibold text-gray-700">Image Preview</p>
                <p>Paste any image URL (Pexels, etc.)</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Product Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Royal Aviator"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Brand</label>
              <input
                required
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="e.g. Ray-Ban"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all"
              >
                <option value="eyeglasses">Eyeglasses</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="computer">Computer Glasses</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Material</label>
              <input
                required
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
                placeholder="e.g. Acetate"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Price (₹)</label>
              <input
                required
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="4499"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Original Price (₹)</label>
              <input
                required
                type="number"
                value={form.original_price}
                onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                placeholder="6999"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
          </div>

          {form.price && form.original_price && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Discount:</span>
              <span className="font-bold text-green-600">
                {Math.round(((Number(form.original_price) - Number(form.price)) / Number(form.original_price)) * 100)}% OFF
              </span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Image URL</label>
            <input
              required
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://images.pexels.com/..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Badge (optional)</label>
            <input
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="e.g. Trending, Bestseller, Premium"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>

          {/* Colors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600">Color Swatches</label>
              <button
                type="button"
                onClick={addColor}
                className="flex items-center gap-1 text-xs text-[#D4AF37] font-semibold hover:underline"
              >
                <Plus className="w-3 h-3" /> Add Color
              </button>
            </div>
            <div className="space-y-2">
              {form.colors.map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColor(i, 'hex', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer shrink-0"
                  />
                  <input
                    value={color.name}
                    onChange={(e) => updateColor(i, 'name', e.target.value)}
                    placeholder="Color name"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all"
                  />
                  {form.colors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(i)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-40 transition-all"
            >
              {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<DbProduct | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products_db')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setProducts(data as DbProduct[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products_db').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  const categories = ['all', 'eyeglasses', 'sunglasses', 'computer'];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-2">
          {categories.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                filter === f
                  ? 'bg-[#D4AF37] text-[#0A192F]'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#D4AF37] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0A192F] text-sm font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Glasses className="w-8 h-8 text-white/30" />
          </div>
          <p className="text-white/40 font-medium">No products found</p>
          <button
            onClick={() => { setEditingProduct(null); setShowForm(true); }}
            className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0A192F] text-sm font-bold"
          >
            <Plus className="w-4 h-4" /> Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const discount = Math.round(((p.original_price - p.price) / p.original_price) * 100);
            return (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="relative aspect-square bg-white/5">
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  {p.badge && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0A192F] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0A192F] text-[10px] font-bold">
                    {discount}% OFF
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-[#D4AF37] font-semibold uppercase tracking-wider">{p.brand}</p>
                  <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                  <p className="text-xs text-white/40 mb-2">{p.material} · {p.category}</p>
                  <div className="flex items-center gap-2 mb-3">
                    {p.colors?.slice(0, 4).map((c, i) => (
                      <span
                        key={i}
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-sm font-bold text-white">₹{p.price.toLocaleString('en-IN')}</span>
                      <span className="text-xs text-white/30 line-through ml-1">₹{p.original_price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingProduct(p); setShowForm(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSave={() => {
            setShowForm(false);
            setEditingProduct(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}

/* ============= Settings Tab (Change PIN) ============= */

function SettingsTab() {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPin.length !== 8 || !/^\d{8}$/.test(newPin)) {
      setMessage({ type: 'error', text: 'New PIN must be exactly 8 digits.' });
      return;
    }
    if (newPin !== confirmPin) {
      setMessage({ type: 'error', text: 'New PIN and confirm PIN do not match.' });
      return;
    }

    setSaving(true);

    const { data } = await supabase
      .from('admin_settings')
      .select('pin')
      .eq('id', 1)
      .maybeSingle();

    if (!data || currentPin !== data.pin) {
      setMessage({ type: 'error', text: 'Current PIN is incorrect.' });
      setSaving(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('admin_settings')
      .update({ pin: newPin, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (updateError) {
      setMessage({ type: 'error', text: updateError.message });
    } else {
      setMessage({ type: 'success', text: 'PIN updated successfully!' });
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
    }
    setSaving(false);
  };

  return (
    <div className="max-w-md">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">Change Admin PIN</h3>
            <p className="text-white/40 text-xs">PIN must be exactly 8 digits</p>
          </div>
        </div>

        <form onSubmit={handleChangePin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-white/60 mb-1.5 block">Current PIN</label>
            <input
              type={show ? 'text' : 'password'}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Enter current PIN"
              maxLength={8}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm tracking-[0.3em] text-center outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/60 mb-1.5 block">New PIN (8 digits)</label>
            <input
              type={show ? 'text' : 'password'}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Enter new PIN"
              maxLength={8}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm tracking-[0.3em] text-center outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-white/60 mb-1.5 block">Confirm New PIN</label>
            <input
              type={show ? 'text' : 'password'}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="Re-enter new PIN"
              maxLength={8}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm tracking-[0.3em] text-center outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-white/50">
            <input
              type="checkbox"
              checked={show}
              onChange={(e) => setShow(e.target.checked)}
              className="accent-[#D4AF37]"
            />
            Show PINs
          </label>

          {message && (
            <p className={`text-xs px-3 py-2 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !currentPin || !newPin || !confirmPin}
            className="w-full py-3 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {saving ? 'Updating...' : 'Update PIN'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ============= Manage Offers Tab ============= */

interface DbOffer {
  id: string;
  title: string;
  hindi_title: string;
  badge: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

function OfferFormModal({
  offer,
  onClose,
  onSave,
}: {
  offer: DbOffer | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: offer?.title || '',
    hindi_title: offer?.hindi_title || '',
    badge: offer?.badge || '',
    description: offer?.description || '',
    sort_order: String(offer?.sort_order || 0),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!form.title || !form.badge || !form.description) {
      setError('Title, badge, and description are required.');
      setSaving(false);
      return;
    }
    const payload = {
      title: form.title,
      hindi_title: form.hindi_title,
      badge: form.badge,
      description: form.description,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (offer) {
        const { error: dbError } = await supabase.from('special_offers').update(payload).eq('id', offer.id);
        if (dbError) throw new Error(dbError.message);
      } else {
        const { error: dbError } = await supabase.from('special_offers').insert({ ...payload, is_active: true });
        if (dbError) throw new Error(dbError.message);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save offer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#0A192F] to-[#0B132B] p-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#D4AF37]" />
            {offer ? 'Edit Offer' : 'Add New Offer'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Buy 1 Get 1 Free" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Badge Text</label>
              <input required value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} placeholder="e.g. BOGO" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Hindi Title</label>
            <input value={form.hindi_title} onChange={(e) => setForm({ ...form, hindi_title: e.target.value })} placeholder="हिंदी में शीर्षक" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Offer description..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
          </div>
          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg disabled:opacity-40 transition-all">{saving ? 'Saving...' : offer ? 'Update' : 'Add Offer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OffersTab() {
  const [offers, setOffers] = useState<DbOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbOffer | null>(null);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('special_offers').select('*').order('sort_order', { ascending: true });
    if (!error && data) setOffers(data as DbOffer[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('special_offers').update({ is_active: !active }).eq('id', id);
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, is_active: !active } : o)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return;
    await supabase.from('special_offers').delete().eq('id', id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-lg">Special Offers</h3>
        <div className="flex gap-2">
          <button onClick={fetchOffers} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#D4AF37] transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0A192F] text-sm font-bold hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Add Offer
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" /></div>
      ) : offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4"><Tag className="w-8 h-8 text-white/30" /></div>
          <p className="text-white/40 font-medium">No offers found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {offers.map((o) => (
            <div key={o.id} className={`bg-white/5 border rounded-2xl p-4 ${o.is_active ? 'border-white/10' : 'border-white/5 opacity-50'}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#0A192F] text-xs font-bold">{o.badge}</span>
                <button onClick={() => toggleActive(o.id, o.is_active)} className={`w-10 h-5 rounded-full transition-colors ${o.is_active ? 'bg-green-500' : 'bg-gray-600'} relative`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${o.is_active ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              <h4 className="text-white font-bold text-sm">{o.title}</h4>
              <p className="text-[#D4AF37] text-xs mb-2">{o.hindi_title}</p>
              <p className="text-white/50 text-xs leading-relaxed mb-3">{o.description}</p>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(o); setShowForm(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:text-[#D4AF37] transition-all">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(o.id)} className="py-2 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && <OfferFormModal offer={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={() => { setShowForm(false); setEditing(null); fetchOffers(); }} />}
    </div>
  );
}

/* ============= Manage Services Tab ============= */

interface DbService {
  id: string;
  title: string;
  hindi_title: string;
  description: string;
  icon_name: string;
  tags: string[];
  sort_order: number;
}

const serviceIconOptions = ['Eye', 'Glasses', 'Smartphone', 'ShieldCheck', 'Sparkles', 'Monitor', 'Stethoscope'];

function ServiceFormModal({
  service,
  onClose,
  onSave,
}: {
  service: DbService | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: service?.title || '',
    hindi_title: service?.hindi_title || '',
    description: service?.description || '',
    icon_name: service?.icon_name || 'Eye',
    tags: (service?.tags || []).join(', '),
    sort_order: String(service?.sort_order || 0),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!form.title || !form.description) {
      setError('Title and description are required.');
      setSaving(false);
      return;
    }
    const payload = {
      title: form.title,
      hindi_title: form.hindi_title,
      description: form.description,
      icon_name: form.icon_name,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (service) {
        const { error: dbError } = await supabase.from('services').update(payload).eq('id', service.id);
        if (dbError) throw new Error(dbError.message);
      } else {
        const { error: dbError } = await supabase.from('services').insert(payload);
        if (dbError) throw new Error(dbError.message);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#0A192F] to-[#0B132B] p-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><X className="w-5 h-5" /></button>
          <h3 className="text-lg font-bold text-white">{service ? 'Edit Service' : 'Add New Service'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Hindi Title</label>
              <input value={form.hindi_title} onChange={(e) => setForm({ ...form, hindi_title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
            <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Icon</label>
              <select value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all">
                {serviceIconOptions.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Feature Tags (comma-separated)</label>
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Tag 1, Tag 2, Tag 3" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
          </div>
          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg disabled:opacity-40 transition-all">{saving ? 'Saving...' : service ? 'Update' : 'Add Service'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ServicesTab() {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbService | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    if (!error && data) setServices(data as DbService[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-lg">Our Services</h3>
        <div className="flex gap-2">
          <button onClick={fetchServices} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#D4AF37] transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0A192F] text-sm font-bold hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4"><Stethoscope className="w-8 h-8 text-white/30" /></div>
          <p className="text-white/40 font-medium">No services found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-[10px] text-[#D4AF37] font-semibold uppercase">{s.icon_name}</p>
              <h4 className="text-white font-bold text-sm mt-1">{s.title}</h4>
              <p className="text-[#D4AF37] text-xs mb-2">{s.hindi_title}</p>
              <p className="text-white/50 text-xs leading-relaxed mb-2 line-clamp-2">{s.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {s.tags?.map((t, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px]">{t}</span>)}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(s); setShowForm(true); }} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-xs font-semibold hover:text-[#D4AF37] transition-all"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                <button onClick={() => handleDelete(s.id)} className="py-2 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && <ServiceFormModal service={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={() => { setShowForm(false); setEditing(null); fetchServices(); }} />}
    </div>
  );
}

/* ============= Hero Carousel Manager Tab ============= */

interface DbSlide {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

function SlideFormModal({
  slide,
  onClose,
  onSave,
}: {
  slide: DbSlide | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: slide?.title || '',
    subtitle: slide?.subtitle || '',
    cta_text: slide?.cta_text || 'Explore Collection',
    cta_link: slide?.cta_link || 'all',
    image_url: slide?.image_url || '',
    sort_order: String(slide?.sort_order || 0),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    if (!form.title || !form.subtitle || !form.image_url) {
      setError('Title, subtitle, and image URL are required.');
      setSaving(false);
      return;
    }
    const payload = {
      title: form.title,
      subtitle: form.subtitle,
      cta_text: form.cta_text,
      cta_link: form.cta_link,
      image_url: form.image_url,
      sort_order: Number(form.sort_order) || 0,
    };
    try {
      if (slide) {
        const { error: dbError } = await supabase.from('hero_slides').update(payload).eq('id', slide.id);
        if (dbError) throw new Error(dbError.message);
      } else {
        const { error: dbError } = await supabase.from('hero_slides').insert({ ...payload, is_active: true });
        if (dbError) throw new Error(dbError.message);
      }
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save slide.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-br from-[#0A192F] to-[#0B132B] p-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"><X className="w-5 h-5" /></button>
          <h3 className="text-lg font-bold text-white flex items-center gap-2"><Image className="w-5 h-5 text-[#D4AF37]" />{slide ? 'Edit Slide' : 'Add New Slide'}</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {form.image_url && <img src={form.image_url} alt="Preview" className="w-full h-32 rounded-xl object-cover bg-gray-100" />}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Image URL</label>
            <input required value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://images.pexels.com/..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Subtitle</label>
            <input required value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">CTA Button Text</label>
              <input value={form.cta_text} onChange={(e) => setForm({ ...form, cta_text: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">CTA Link Target</label>
              <select value={form.cta_link} onChange={(e) => setForm({ ...form, cta_link: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all">
                <option value="all">All Products</option>
                <option value="eyeglasses">Eyeglasses</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="computer">Computer Glasses</option>
                <option value="clinic">Book Appointment</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#D4AF37] transition-all" />
          </div>
          {error && <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg disabled:opacity-40 transition-all">{saving ? 'Saving...' : slide ? 'Update' : 'Add Slide'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function HeroSlidesTab() {
  const [slides, setSlides] = useState<DbSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbSlide | null>(null);

  const fetchSlides = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('hero_slides').select('*').order('sort_order', { ascending: true });
    if (!error && data) setSlides(data as DbSlide[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSlides(); }, [fetchSlides]);

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('hero_slides').update({ is_active: !active }).eq('id', id);
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, is_active: !active } : s)));
  };

  const moveOrder = async (id: string, direction: 'up' | 'down') => {
    const sorted = [...slides].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const current = sorted[idx];
    const target = sorted[swapIdx];
    await Promise.all([
      supabase.from('hero_slides').update({ sort_order: target.sort_order }).eq('id', current.id),
      supabase.from('hero_slides').update({ sort_order: current.sort_order }).eq('id', target.id),
    ]);
    fetchSlides();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slide?')) return;
    await supabase.from('hero_slides').delete().eq('id', id);
    setSlides((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-bold text-lg">Hero Carousel Slides</h3>
        <div className="flex gap-2">
          <button onClick={fetchSlides} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-[#D4AF37] transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => { setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#0A192F] text-sm font-bold hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Add Slide
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" /></div>
      ) : slides.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4"><Image className="w-8 h-8 text-white/30" /></div>
          <p className="text-white/40 font-medium">No slides found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...slides].sort((a, b) => a.sort_order - b.sort_order).map((s, idx, arr) => (
            <div key={s.id} className={`bg-white/5 border rounded-2xl p-4 flex items-center gap-4 ${s.is_active ? 'border-white/10' : 'border-white/5 opacity-50'}`}>
              <img src={s.image_url} alt={s.title} className="w-24 h-16 rounded-lg object-cover bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm truncate">{s.title}</h4>
                <p className="text-white/50 text-xs truncate">{s.subtitle}</p>
                <p className="text-[#D4AF37] text-xs mt-1">{s.cta_text} → {s.cta_link}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => moveOrder(s.id, 'up')} disabled={idx === 0} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#D4AF37] disabled:opacity-20 transition-all"><ArrowUp className="w-4 h-4" /></button>
                <button onClick={() => moveOrder(s.id, 'down')} disabled={idx === arr.length - 1} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#D4AF37] disabled:opacity-20 transition-all"><ArrowDown className="w-4 h-4" /></button>
                <button onClick={() => toggleActive(s.id, s.is_active)} className={`w-10 h-5 rounded-full transition-colors ${s.is_active ? 'bg-green-500' : 'bg-gray-600'} relative`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${s.is_active ? 'left-5' : 'left-0.5'}`} />
                </button>
                <button onClick={() => { setEditing(s); setShowForm(true); }} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[#D4AF37] transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && <SlideFormModal slide={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={() => { setShowForm(false); setEditing(null); fetchSlides(); }} />}
    </div>
  );
}

/* ============= Policies Tab ============= */
/* TEMPORARILY DISABLED - Requires Supabase migration
   Policies are now managed in src/config/policies.ts
   To enable admin editing later, run SQL migration and restore this component
*/

/* ============= Store Settings Tab ============= */

function StoreSettingsTab() {
  const [form, setForm] = useState({
    logo_url: '',
    phone: '',
    whatsapp: '',
    email: '',
    address_line1: '',
    address_line2: '',
    hours_mon_fri: '',
    hours_sat: '',
    hours_sun: '',
    doctor_name: '',
    doctor_qualification: '',
    doctor_bio: '',
    doctor_image: '',
    doctor_highlights: '',
    instagram_url: '',
    facebook_url: '',
    x_url: '',
    youtube_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    supabase.from('store_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) {
        const d = data as Record<string, unknown>;
        setForm({
          logo_url: String(d.logo_url || ''),
          phone: String(d.phone || ''),
          whatsapp: String(d.whatsapp || ''),
          email: String(d.email || ''),
          address_line1: String(d.address_line1 || ''),
          address_line2: String(d.address_line2 || ''),
          hours_mon_fri: String(d.hours_mon_fri || ''),
          hours_sat: String(d.hours_sat || ''),
          hours_sun: String(d.hours_sun || ''),
          doctor_name: String(d.doctor_name || ''),
          doctor_qualification: String(d.doctor_qualification || ''),
          doctor_bio: String(d.doctor_bio || ''),
          doctor_image: String(d.doctor_image || ''),
          doctor_highlights: Array.isArray(d.doctor_highlights) ? (d.doctor_highlights as string[]).join(', ') : '',
          instagram_url: String(d.instagram_url || ''),
          facebook_url: String(d.facebook_url || ''),
          x_url: String(d.x_url || ''),
          youtube_url: String(d.youtube_url || ''),
        });
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const payload = {
      logo_url: form.logo_url,
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      address_line1: form.address_line1,
      address_line2: form.address_line2,
      hours_mon_fri: form.hours_mon_fri,
      hours_sat: form.hours_sat,
      hours_sun: form.hours_sun,
      doctor_name: form.doctor_name,
      doctor_qualification: form.doctor_qualification,
      doctor_bio: form.doctor_bio,
      doctor_image: form.doctor_image,
      doctor_highlights: form.doctor_highlights.split(',').map((h) => h.trim()).filter(Boolean),
      instagram_url: form.instagram_url,
      facebook_url: form.facebook_url,
      x_url: form.x_url,
      youtube_url: form.youtube_url,
      updated_at: new Date().toISOString(),
    };
    const { error: dbError } = await supabase.from('store_settings').update(payload).eq('id', 1);
    if (dbError) {
      setMessage({ type: 'error', text: dbError.message });
    } else {
      setMessage({ type: 'success', text: 'Store settings saved successfully!' });
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" /></div>;
  }

  const inputClass = 'w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#D4AF37] transition-all';
  const labelClass = 'text-xs font-semibold text-white/60 mb-1 block';
  const cardClass = 'bg-white/5 border border-white/10 rounded-2xl p-5 mb-4';

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-4">
      {/* Branding */}
      <div className={cardClass}>
        <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2"><Store className="w-5 h-5 text-[#D4AF37]" /> Branding & Contact</h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Logo Image URL</label>
            <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="https://..." className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}><Phone className="w-3 h-3 inline mr-1" />Phone Number</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp Number</label>
              <input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="919876543210" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}><Mail className="w-3 h-3 inline mr-1" />Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}><MapPin className="w-3 h-3 inline mr-1" />Address Line 1</label>
            <input value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address Line 2</label>
            <input value={form.address_line2} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className={cardClass}>
        <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-[#D4AF37]" /> Operating Hours</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelClass}>Mon - Fri</label>
            <input value={form.hours_mon_fri} onChange={(e) => setForm({ ...form, hours_mon_fri: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Saturday</label>
            <input value={form.hours_sat} onChange={(e) => setForm({ ...form, hours_sat: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sunday</label>
            <input value={form.hours_sun} onChange={(e) => setForm({ ...form, hours_sun: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Doctor Profile */}
      <div className={cardClass}>
        <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-[#D4AF37]" /> Doctor Profile</h3>
        <div className="space-y-3">
          {form.doctor_image && <img src={form.doctor_image} alt="Doctor" className="w-20 h-20 rounded-xl object-cover bg-gray-100" />}
          <div>
            <label className={labelClass}>Doctor Image URL</label>
            <input value={form.doctor_image} onChange={(e) => setForm({ ...form, doctor_image: e.target.value })} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Doctor Name</label>
              <input value={form.doctor_name} onChange={(e) => setForm({ ...form, doctor_name: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Qualification</label>
              <input value={form.doctor_qualification} onChange={(e) => setForm({ ...form, doctor_qualification: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Bio</label>
            <textarea value={form.doctor_bio} onChange={(e) => setForm({ ...form, doctor_bio: e.target.value })} rows={4} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className={labelClass}>Highlights (comma-separated)</label>
            <input value={form.doctor_highlights} onChange={(e) => setForm({ ...form, doctor_highlights: e.target.value })} placeholder="D.R. OPT, 15+ Years, Registered Optometrist" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className={cardClass}>
        <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2"><ExternalLink className="w-5 h-5 text-[#D4AF37]" /> Social Media Links</h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} placeholder="https://instagram.com/yourprofile" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} placeholder="https://facebook.com/yourpage" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>X (Twitter) URL</label>
            <input value={form.x_url} onChange={(e) => setForm({ ...form, x_url: e.target.value })} placeholder="https://x.com/yourprofile" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>YouTube URL</label>
            <input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtube.com/yourchannel" className={inputClass} />
          </div>
        </div>
      </div>

      {message && (
        <p className={`text-sm px-4 py-2.5 rounded-xl ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{message.text}</p>
      )}
      <button type="submit" disabled={saving} className="w-full py-3.5 rounded-xl bg-[#D4AF37] text-[#0A192F] font-bold hover:shadow-lg hover:shadow-[#D4AF37]/30 disabled:opacity-40 transition-all">{saving ? 'Saving...' : 'Save Store Settings'}</button>
    </form>
  );
}

/* ============= Main Admin Dashboard ============= */

export function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState<AdminTab>('appointments');
  const { setCurrentPage } = useStore();

  const handleLogout = () => {
    setLoggedIn(false);
    setCurrentPage('home');
  };

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const tabs: { id: AdminTab; label: string; icon: typeof Calendar }[] = [
    { id: 'appointments', label: 'Eye Test Appointments', icon: Calendar },
    { id: 'orders', label: 'Orders & Enquiries', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Glasses },
    { id: 'offers', label: 'Special Offers', icon: Tag },
    { id: 'services', label: 'Services', icon: Stethoscope },
    { id: 'hero', label: 'Hero Carousel', icon: Image },
    { id: 'settings', label: 'Store Settings', icon: Store },
    // { id: 'policies', label: 'Policies', icon: FileCheck }, // Temporarily disabled - requires Supabase migration
    { id: 'security', label: 'Security', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-[#0A192F]">
      <header className="sticky top-0 z-30 bg-[#0B132B] border-b border-white/10 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClinicLogo className="h-[50px] w-[58px] object-contain" />
            <div>
              <p className="text-[9px] tracking-[0.2em] text-white/50">ADMIN DASHBOARD</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                tab === t.id
                  ? 'bg-[#D4AF37] text-[#0A192F]'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {tab === 'appointments' && <AppointmentsTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'products' && <ProductsTab />}
        {tab === 'offers' && <OffersTab />}
        {tab === 'services' && <ServicesTab />}
        {tab === 'hero' && <HeroSlidesTab />}
        {tab === 'settings' && <StoreSettingsTab />}
        {/* {tab === 'policies' && <PoliciesTab />} Temporarily disabled - requires Supabase migration */}
        {tab === 'security' && <SettingsTab />}
      </div>

      <div className="text-center pb-8">
        <button onClick={() => setCurrentPage('home')} className="inline-flex items-center gap-1.5 text-white/30 text-xs hover:text-[#D4AF37] transition-colors">
          <ExternalLink className="w-3 h-3" />
          Back to Website
        </button>
      </div>
    </div>
  );
}
