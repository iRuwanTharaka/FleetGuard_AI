-- Sprint 4: Manager Dashboard & Fleet Management
-- Run: node backend/scripts/run-migration.js

-- Add manager review fields to inspections
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS manager_notes TEXT DEFAULT NULL;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS manager_id INTEGER REFERENCES users(id);
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP DEFAULT NULL;
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS review_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE inspections DROP CONSTRAINT IF EXISTS inspections_review_status_check;
ALTER TABLE inspections ADD CONSTRAINT inspections_review_status_check CHECK (review_status IN ('pending', 'approved', 'flagged'));

-- Add health_score to inspections
ALTER TABLE inspections ADD COLUMN IF NOT EXISTS health_score INT DEFAULT NULL;

-- Add status audit to vehicles
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS status_updated_at TIMESTAMP DEFAULT NOW();
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS status_updated_by INTEGER REFERENCES users(id);

-- Ensure inspection_reviews has one row per inspection (for ON CONFLICT upsert)
CREATE UNIQUE INDEX IF NOT EXISTS inspection_reviews_inspection_id_key ON inspection_reviews(inspection_id);
