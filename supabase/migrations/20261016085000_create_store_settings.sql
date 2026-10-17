/*
# Create store_settings table for Shivansh Optical & Eye Clinic

1. New Table: `store_settings`
   - Stores social media links and other store configuration
   - id (bigint, primary key, always 1)
   - instagram_url (text, nullable)
   - facebook_url (text, nullable)
   - x_url (text, nullable)
   - youtube_url (text, nullable)
   - updated_at (timestamptz, default now())

2. Security
   - RLS enabled with open SELECT policy (website reads social links)
   - INSERT/UPDATE policies open for admin updates

3. Data
   - Seeds with a single row (id=1) containing default empty social media links
*/

CREATE TABLE IF NOT EXISTS store_settings (
  id bigint PRIMARY KEY DEFAULT 1,
  instagram_url text,
  facebook_url text,
  x_url text,
  youtube_url text,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_store_settings" ON store_settings;
CREATE POLICY "anon_select_store_settings" ON store_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_store_settings" ON store_settings;
CREATE POLICY "anon_update_store_settings" ON store_settings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_store_settings" ON store_settings;
CREATE POLICY "anon_insert_store_settings" ON store_settings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Seed store_settings with default row
INSERT INTO store_settings (id, instagram_url, facebook_url, x_url, youtube_url)
VALUES (1, '', '', '', '')
ON CONFLICT (id) DO NOTHING;
