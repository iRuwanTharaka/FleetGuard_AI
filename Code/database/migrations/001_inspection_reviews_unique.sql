-- Sprint 3: Allow ON CONFLICT (inspection_id) in reviewInspection
-- Run once: psql -U $USER -d fleetguard_db -f database/migrations/001_inspection_reviews_unique.sql
ALTER TABLE inspection_reviews
  DROP CONSTRAINT IF EXISTS unique_inspection_review;

ALTER TABLE inspection_reviews
  ADD CONSTRAINT unique_inspection_review UNIQUE (inspection_id);
