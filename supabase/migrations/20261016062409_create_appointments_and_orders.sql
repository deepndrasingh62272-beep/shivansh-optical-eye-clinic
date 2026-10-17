/*
# Create appointments and orders tables for Shivansh Optical & Eye Clinic

1. New Tables
   - `appointments`: Stores eye test booking requests submitted from the website.
     - id (uuid, primary key)
     - patient_name (text, not null) — full name of the patient
     - phone (text, not null) — 10-digit mobile number
     - appointment_date (date, not null) — preferred date for the eye checkup
     - time_slot (text, not null) — selected time slot (e.g. "10:00 AM")
     - status (text, not null, default 'Pending') — Pending / Confirmed / Completed
     - created_at (timestamptz, default now())
   - `orders`: Stores product enquiries / frame orders placed through the website cart.
     - id (uuid, primary key)
     - customer_name (text, not null) — name of the customer
     - phone (text, not null) — contact number
     - items (jsonb, not null) — array of cart items with product details
     - total (numeric, not null) — total order value
     - status (text, not null, default 'Pending') — Pending / Confirmed / Completed
     - created_at (timestamptz, default now())

2. Security
   - Both tables have RLS enabled.
   - Since this is a no-auth single-tenant app (no user sign-in), all policies use
     `TO anon, authenticated` so the anon-key frontend client can read and write.
   - INSERT is open so website visitors can submit bookings and orders.
   - SELECT, UPDATE, DELETE are also open to anon/authenticated because the admin
     dashboard reads and manages these from the frontend (no server-side auth).

3. Important Notes
   - The admin dashboard is protected by a client-side PIN, not Supabase Auth.
   - All data is intentionally public/shared within this single-tenant app.
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  phone text NOT NULL,
  appointment_date date NOT NULL,
  time_slot text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_appointments" ON appointments;
CREATE POLICY "anon_select_appointments" ON appointments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_appointments" ON appointments;
CREATE POLICY "anon_insert_appointments" ON appointments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_appointments" ON appointments;
CREATE POLICY "anon_update_appointments" ON appointments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_appointments" ON appointments;
CREATE POLICY "anon_delete_appointments" ON appointments FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_orders" ON orders;
CREATE POLICY "anon_update_orders" ON orders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_orders" ON orders;
CREATE POLICY "anon_delete_orders" ON orders FOR DELETE
  TO anon, authenticated USING (true);
