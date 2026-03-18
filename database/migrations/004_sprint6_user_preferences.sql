-- Sprint 6: Localization, Analytics, UI Polish

-- user_preferences for language/settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  language    VARCHAR(10) NOT NULL DEFAULT 'en',
  date_format VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- Add tuktuk to vehicle_type (vehicles already has vehicle_type, add tuktuk to check)
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_vehicle_type_check;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_vehicle_type_check
  CHECK (vehicle_type IN ('car', 'van', 'suv', 'other', 'tuktuk'));
