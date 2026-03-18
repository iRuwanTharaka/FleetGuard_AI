-- Sprint 5: Smart Assignment + GPS + Map View
-- Run: psql -U postgres -d fleetguard_db -f database/migrations/003_sprint5_gps_columns.sql

-- Add GPS columns to vehicles (IF NOT EXISTS for idempotency)
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS last_latitude  DECIMAL(10, 8) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS last_longitude DECIMAL(11, 8) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS current_driver_id INTEGER REFERENCES users(id) DEFAULT NULL;

-- Add index for faster location queries
CREATE INDEX IF NOT EXISTS idx_vehicles_location
  ON vehicles (last_latitude, last_longitude)
  WHERE last_latitude IS NOT NULL;
