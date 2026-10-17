/*
# Create special_offers, services, hero_slides, and store_settings tables

1. New Tables
   - `special_offers`: Dynamic special offer cards shown on the website.
     - id, title, hindi_title, badge, description, is_active, sort_order, created_at
   - `services`: Eye care services shown in the Our Services section.
     - id, title, hindi_title, description, icon_name, tags (jsonb array), sort_order, created_at
   - `hero_slides`: Dynamic hero carousel slides.
     - id, title, subtitle, cta_text, cta_link, image_url, sort_order, is_active, created_at
   - `store_settings`: Single-row table for clinic branding and contact info.
     - id (always 1), logo_url, phone, whatsapp, email, address_line1, address_line2,
       hours_mon_fri, hours_sat, hours_sun,
       doctor_name, doctor_qualification, doctor_bio, doctor_image, doctor_highlights (jsonb)

2. Data
   - Seeds all 4 special offers (BOGO, Senior 30%, Free Eye Checkup, Student 20%).
   - Seeds all 6 services with tags.
   - Seeds 5 hero slides (same as current hardcoded ones).
   - Seeds store_settings with default values.

3. Security
   - All tables RLS enabled, TO anon, authenticated (single-tenant, no-auth app).
*/

CREATE TABLE IF NOT EXISTS special_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  hindi_title text NOT NULL,
  badge text NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_offers" ON special_offers;
CREATE POLICY "anon_select_offers" ON special_offers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_offers" ON special_offers;
CREATE POLICY "anon_insert_offers" ON special_offers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_offers" ON special_offers;
CREATE POLICY "anon_update_offers" ON special_offers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_offers" ON special_offers;
CREATE POLICY "anon_delete_offers" ON special_offers FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  hindi_title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL DEFAULT 'Eye',
  tags jsonb NOT NULL DEFAULT '[]',
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_services" ON services;
CREATE POLICY "anon_select_services" ON services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_services" ON services;
CREATE POLICY "anon_insert_services" ON services FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_services" ON services;
CREATE POLICY "anon_update_services" ON services FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_services" ON services;
CREATE POLICY "anon_delete_services" ON services FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS hero_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text NOT NULL,
  cta_text text NOT NULL DEFAULT 'Explore Collection',
  cta_link text NOT NULL DEFAULT 'all',
  image_url text NOT NULL,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_hero" ON hero_slides;
CREATE POLICY "anon_select_hero" ON hero_slides FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_hero" ON hero_slides;
CREATE POLICY "anon_insert_hero" ON hero_slides FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_hero" ON hero_slides;
CREATE POLICY "anon_update_hero" ON hero_slides FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_hero" ON hero_slides;
CREATE POLICY "anon_delete_hero" ON hero_slides FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS store_settings (
  id integer PRIMARY KEY DEFAULT 1,
  logo_url text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '+91 98765 43210',
  whatsapp text NOT NULL DEFAULT '919876543210',
  email text NOT NULL DEFAULT 'care@shivanshoptical.in',
  address_line1 text NOT NULL DEFAULT 'Shop No. 12, Hazratganj',
  address_line2 text NOT NULL DEFAULT 'Lucknow, Uttar Pradesh 226001',
  hours_mon_fri text NOT NULL DEFAULT '9 AM - 8 PM',
  hours_sat text NOT NULL DEFAULT '9 AM - 9 PM',
  hours_sun text NOT NULL DEFAULT '10 AM - 6 PM',
  doctor_name text NOT NULL DEFAULT 'Nishant Singh Rathour',
  doctor_qualification text NOT NULL DEFAULT 'D.R. OPT (Optometrist) | प्रमाणित ऑप्टोमेट्रिस्ट',
  doctor_bio text NOT NULL DEFAULT 'With over 15 years of dedicated service in eye care, Nishant Singh Rathour has been committed to providing the highest quality vision care to the Lucknow community. His expertise in advanced refraction techniques and passion for patient care has helped thousands of families achieve better vision.',
  doctor_image text NOT NULL DEFAULT 'https://images.pexels.com/photos/6749697/pexels-photo-6749697.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  doctor_highlights jsonb NOT NULL DEFAULT '["D.R. OPT (Diploma in Refraction and Optometry)","15+ Years of Clinical Experience","Registered Optometrist","10,000+ Satisfied Patients"]',
  CONSTRAINT single_row_store CHECK (id = 1)
);
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_store" ON store_settings;
CREATE POLICY "anon_select_store" ON store_settings FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_update_store" ON store_settings;
CREATE POLICY "anon_update_store" ON store_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed special offers
INSERT INTO special_offers (title, hindi_title, badge, description, is_active, sort_order) VALUES
('Buy 1 Get 1 Free', 'एक खरीदें एक मुफ्त पाएं', 'BOGO', 'Buy any premium frame and get another absolutely free. Valid on selected premium collections.', true, 1),
('30% OFF Senior Citizen', 'वरिष्ठ नागरिक छूट', '30% OFF', 'Special 30% discount for senior citizens aged 60 and above. Please carry valid age proof.', true, 2),
('Free Eye Checkup', 'मुफ्त आंख जांच', 'FREE', 'Comprehensive eye checkup worth ₹500 absolutely free. Book your appointment today.', true, 3),
('20% OFF Student Special', 'छात्र विशेष', '20% OFF', '20% discount on all frames and lenses for students with valid school or college ID.', true, 4)
ON CONFLICT DO NOTHING;

-- Seed services
INSERT INTO services (title, hindi_title, description, icon_name, tags, sort_order) VALUES
('Computerized Eye Testing', 'कम्प्यूटरीकृत आंख परीक्षण', 'State-of-the-art digital eye testing using the latest auto-refractometer technology for accurate prescriptions.', 'Monitor', '["Auto-Refractometer","Keratometry","Tonometry"]', 1),
('Prescription Glasses', 'प्रिस्क्रिप्शन चश्मा', 'Custom-made prescription glasses with premium lenses and designer frames tailored to your vision needs.', 'Glasses', '["Anti-Glare Coating","Blue Light Filter","Progressive Lenses"]', 2),
('Contact Lenses', 'कॉन्टैक्ट लेंस', 'Wide range of contact lenses including daily disposables and colored lenses with expert fitting.', 'Eye', '["Daily Disposables","Extended Wear","Colored Lenses"]', 3),
('Digital Eye Strain Check', 'डिजिटल आई स्ट्रेन जांच', 'Comprehensive evaluation of digital eye strain with personalized ergonomic advice and screen protection.', 'Smartphone', '["CVS Evaluation","Ergonomic Advice","Screen Glasses"]', 4),
('Eye Health Screening', 'नेत्र स्वास्थ्य जांच', 'Complete eye health screening including glaucoma check, cataract screening, and retina examination.', 'ShieldCheck', '["Glaucoma Check","Cataract Screening","Retina Exam"]', 5),
('Lens Care Solutions', 'लेंस देखभाल समाधान', 'Complete lens care solutions including multi-purpose solutions, protein removers, and lens accessories.', 'Sparkles', '["Multi-Purpose","Protein Remover","Lens Cases"]', 6)
ON CONFLICT DO NOTHING;

-- Seed hero slides
INSERT INTO hero_slides (title, subtitle, cta_text, cta_link, image_url, sort_order, is_active) VALUES
('Royal Eyewear Collection', 'Luxury frames crafted for the discerning eye', 'Explore Collection', 'all', 'https://images.pexels.com/photos/5202046/pexels-photo-5202046.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920', 1, true),
('Free Eye Checkup Camp', 'Book your complimentary consultation today', 'Book Appointment', 'clinic', 'https://images.pexels.com/photos/5996647/pexels-photo-5996647.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920', 2, true),
('Designer Sunglasses Sale', 'Up to 40% off premium brands', 'Shop Now', 'sunglasses', 'https://images.pexels.com/photos/2767694/pexels-photo-2767694.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920', 3, true),
('Anti-Glare Computer Glasses', 'Protect your eyes in the digital age', 'Explore Collection', 'computer', 'https://images.pexels.com/photos/4389344/pexels-photo-4389344.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920', 4, true),
('Monsoon Special Offer', 'Buy one frame, get one free', 'Shop Offer', 'all', 'https://images.pexels.com/photos/5201932/pexels-photo-5201932.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920', 5, true)
ON CONFLICT DO NOTHING;

-- Seed store settings
INSERT INTO store_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
