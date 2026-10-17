/*
# Create products_db and admin_settings tables for Shivansh Optical & Eye Clinic

1. New Tables
   - `products_db`: Stores all eyewear products that appear on the website.
     - id (uuid, primary key)
     - name (text, not null) — frame/product name
     - brand (text, not null) — brand name
     - category (text, not null) — 'eyeglasses' | 'sunglasses' | 'computer'
     - material (text, not null) — frame material (Acetate, Titanium, etc.)
     - price (integer, not null) — selling price in INR
     - original_price (integer, not null) — MRP / pre-discount price
     - image_url (text, not null) — product image URL
     - colors (jsonb, not null) — array of {name, hex} color swatches
     - rating (numeric, default 4.5) — product rating 0-5
     - reviews (integer, default 0) — number of reviews
     - badge (text, nullable) — optional badge text (Trending, Bestseller, etc.)
     - created_at (timestamptz, default now())
   - `admin_settings`: Single-row table storing admin configuration.
     - id (integer, primary key, always 1)
     - pin (text, not null, default '12345678') — 8-digit admin PIN
     - updated_at (timestamptz, default now())

2. Data
   - Seeds admin_settings with a single row (id=1, pin='12345678').
   - Seeds products_db with all 18 existing products from the hardcoded data.

3. Security
   - Both tables have RLS enabled.
   - Single-tenant no-auth app: all policies use `TO anon, authenticated`.
   - products_db: SELECT open (website reads products), INSERT/UPDATE/DELETE open (admin manages from frontend).
   - admin_settings: SELECT open (login screen reads PIN for verification), UPDATE open (admin changes PIN).

4. Important Notes
   - The admin PIN is stored in plaintext in admin_settings since this is a client-side-only
     app with no server-side auth. This is a simple owner-access protection, not a security boundary.
   - Products loaded from DB replace the hardcoded product array on the website.
*/

CREATE TABLE IF NOT EXISTS products_db (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  material text NOT NULL,
  price integer NOT NULL,
  original_price integer NOT NULL,
  image_url text NOT NULL,
  colors jsonb NOT NULL DEFAULT '[]',
  rating numeric DEFAULT 4.5,
  reviews integer DEFAULT 0,
  badge text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products_db ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products_db;
CREATE POLICY "anon_select_products" ON products_db FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_products" ON products_db;
CREATE POLICY "anon_insert_products" ON products_db FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_products" ON products_db;
CREATE POLICY "anon_update_products" ON products_db FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_products" ON products_db;
CREATE POLICY "anon_delete_products" ON products_db FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS admin_settings (
  id integer PRIMARY KEY DEFAULT 1,
  pin text NOT NULL DEFAULT '12345678',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_admin_settings" ON admin_settings;
CREATE POLICY "anon_select_admin_settings" ON admin_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_admin_settings" ON admin_settings;
CREATE POLICY "anon_update_admin_settings" ON admin_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed admin settings
INSERT INTO admin_settings (id, pin) VALUES (1, '12345678')
  ON CONFLICT (id) DO NOTHING;

-- Seed products
INSERT INTO products_db (name, brand, category, material, price, original_price, image_url, colors, rating, reviews, badge) VALUES
('Royal Aviator', 'Ray-Ban', 'sunglasses', 'Metal Alloy', 4499, 6999, 'https://images.pexels.com/photos/10837794/pexels-photo-10837794.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Gold","hex":"#D4AF37"},{"name":"Black","hex":"#1a1a1a"},{"name":"Silver","hex":"#C0C0C0"}]', 4.8, 234, 'Bestseller'),
('Cateye Luxe', 'Michael Kors', 'eyeglasses', 'Acetate', 5999, 8999, 'https://images.pexels.com/photos/18279388/pexels-photo-18279388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Black","hex":"#1a1a1a"},{"name":"Tortoise","hex":"#8B4513"}]', 4.9, 189, 'Premium'),
('Gold Chain Elegance', 'Roberto Cavalli', 'eyeglasses', 'Metal + Acetate', 7499, 11999, 'https://images.pexels.com/photos/36846560/pexels-photo-36846560.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Gold","hex":"#D4AF37"},{"name":"Brown","hex":"#8B4513"}]', 5.0, 97, 'Luxury'),
('Tortoise Classic', 'Vincent Chase', 'eyeglasses', 'Acetate', 2999, 4999, 'https://images.pexels.com/photos/29191795/pexels-photo-29191795.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Tortoise","hex":"#8B4513"},{"name":"Black","hex":"#1a1a1a"},{"name":"Honey","hex":"#D4A86A"}]', 4.6, 412, NULL),
('Red Accent Frame', 'Brendel', 'eyeglasses', 'Acetate', 3499, 5999, 'https://images.pexels.com/photos/13430484/pexels-photo-13430484.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Red","hex":"#C41E3A"},{"name":"Black","hex":"#1a1a1a"}]', 4.5, 156, NULL),
('Minimalist Round', 'Freigeist', 'eyeglasses', 'Titanium', 6499, 9999, 'https://images.pexels.com/photos/13430471/pexels-photo-13430471.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Silver","hex":"#C0C0C0"},{"name":"Gold","hex":"#D4AF37"},{"name":"Gunmetal","hex":"#43464B"}]', 4.7, 203, 'Trending'),
('Noir Luxury', 'Emre Vonal', 'sunglasses', 'Acetate', 5299, 7999, 'https://images.pexels.com/photos/8104329/pexels-photo-8104329.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Black","hex":"#1a1a1a"},{"name":"Tortoise","hex":"#8B4513"}]', 4.8, 178, NULL),
('Gold Accent Square', 'Cavalli', 'sunglasses', 'Metal', 4799, 7499, 'https://images.pexels.com/photos/31305966/pexels-photo-31305966.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Black/Gold","hex":"#1a1a1a"},{"name":"Brown/Gold","hex":"#8B4513"}]', 4.7, 145, 'Trending'),
('Gift Box Special', 'Lenskart', 'eyeglasses', 'Acetate', 3999, 6499, 'https://images.pexels.com/photos/28295162/pexels-photo-28295162.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Black","hex":"#1a1a1a"},{"name":"Wine","hex":"#722F37"}]', 4.5, 321, NULL),
('Reflective Modern', 'Oakley', 'sunglasses', 'Polycarbonate', 3799, 5999, 'https://images.pexels.com/photos/28295161/pexels-photo-28295161.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Black","hex":"#1a1a1a"},{"name":"Blue","hex":"#1E3A5F"},{"name":"Silver","hex":"#C0C0C0"}]', 4.6, 267, NULL),
('Tortoise Shades', 'Fastrack', 'sunglasses', 'Acetate', 2499, 3999, 'https://images.pexels.com/photos/32677231/pexels-photo-32677231.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Tortoise","hex":"#8B4513"},{"name":"Black","hex":"#1a1a1a"}]', 4.4, 198, NULL),
('Red Frame Statement', 'Downtown', 'eyeglasses', 'Acetate', 3299, 5499, 'https://images.pexels.com/photos/36310717/pexels-photo-36310717.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Red","hex":"#C41E3A"},{"name":"Crystal","hex":"#E8E8E8"}]', 4.5, 112, NULL),
('ScreenShield Pro', 'Gunnar', 'computer', 'TR-90', 2799, 4499, 'https://images.pexels.com/photos/8346914/pexels-photo-8346914.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Matte Black","hex":"#2a2a2a"},{"name":"Navy","hex":"#0A192F"}]', 4.7, 389, 'Anti-Glare'),
('Digital Eye Protect', 'Titan Eye+', 'computer', 'Acetate', 1999, 3499, 'https://images.pexels.com/photos/8473285/pexels-photo-8473285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Black","hex":"#1a1a1a"},{"name":"Blue","hex":"#1E3A5F"},{"name":"Brown","hex":"#8B4513"}]', 4.5, 276, NULL),
('Cat Eye Gold', 'GlassesShop', 'eyeglasses', 'Metal', 4299, 6999, 'https://images.pexels.com/photos/29811438/pexels-photo-29811438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Gold","hex":"#D4AF37"},{"name":"Rose Gold","hex":"#B76E79"}]', 4.8, 167, 'Premium'),
('Elegant Gold Detail', 'GlassesShop', 'eyeglasses', 'Acetate', 4599, 7499, 'https://images.pexels.com/photos/29811437/pexels-photo-29811437.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Black/Gold","hex":"#1a1a1a"},{"name":"Tortoise/Gold","hex":"#8B4513"}]', 4.9, 134, NULL),
('Pro Optic Shield', 'Crizal', 'computer', 'Polycarbonate', 2299, 3999, 'https://images.pexels.com/photos/237842/pexels-photo-237842.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Silver","hex":"#C0C0C0"},{"name":"Black","hex":"#1a1a1a"}]', 4.6, 245, 'Anti-Glare'),
('Studio Portrait Classic', 'Lenskart Air', 'eyeglasses', 'Titanium', 5499, 8999, 'https://images.pexels.com/photos/26100579/pexels-photo-26100579.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', '[{"name":"Rose","hex":"#B76E79"},{"name":"Navy","hex":"#0A192F"},{"name":"Silver","hex":"#C0C0C0"}]', 4.8, 201, 'Trending')
ON CONFLICT DO NOTHING;
