/*
# Add policy columns to store_settings table

1. New Columns:
   - privacy_policy (text, nullable)
   - terms_of_service (text, nullable)
   - refund_policy (text, nullable)

2. These columns will store the content for Privacy Policy, Terms of Service, and Refund Policy
*/

ALTER TABLE store_settings
ADD COLUMN IF NOT EXISTS privacy_policy text,
ADD COLUMN IF NOT EXISTS terms_of_service text,
ADD COLUMN IF NOT EXISTS refund_policy text;
