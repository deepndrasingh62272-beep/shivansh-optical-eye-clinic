export type ProductCategory = 'eyeglasses' | 'sunglasses' | 'computer';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  material: string;
  price: number;
  originalPrice: number;
  image: string;
  colors: { name: string; hex: string }[];
  rating: number;
  reviews: number;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface WishlistItem {
  productId: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  hindi_title: string;
  badge: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  hindi_title: string;
  description: string;
  icon_name: string;
  tags: string[];
  sort_order: number;
  created_at: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface StoreSettings {
  id: number;
  logo_url: string;
  phone: string;
  whatsapp: string;
  email: string;
  address_line1: string;
  address_line2: string;
  hours_mon_fri: string;
  hours_sat: string;
  hours_sun: string;
  doctor_name: string;
  doctor_qualification: string;
  doctor_bio: string;
  doctor_image: string;
  doctor_highlights: string[];
}
