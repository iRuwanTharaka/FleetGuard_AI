-- Run after connecting to fleetguard_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS ─────────────────────────────────────────────────────
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),               -- NULL when using Google OAuth only
  role          VARCHAR(20) NOT NULL CHECK (role IN ('driver','manager','admin')),
  google_id     VARCHAR(255) UNIQUE,
  avatar_url    VARCHAR(500),
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ── DRIVERS (extends users) ──────────────────────────────────
CREATE TABLE drivers (
  id             SERIAL PRIMARY KEY,
  user_id        INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  license_number VARCHAR(50),
  phone          VARCHAR(20)
);

-- ── MANAGERS (extends users) ─────────────────────────────────
CREATE TABLE managers (
  id         SERIAL PRIMARY KEY,
  user_id    INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(100)
);

-- ── PASSWORD RESET TOKENS ────────────────────────────────────
CREATE TABLE password_reset_tokens (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used       BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── VEHICLES ─────────────────────────────────────────────────
CREATE TABLE vehicles (
  id                   SERIAL PRIMARY KEY,
  number_plate         VARCHAR(20) UNIQUE NOT NULL,
  make                 VARCHAR(100) NOT NULL,
  model                VARCHAR(100) NOT NULL,
  year                 INT,
  color                VARCHAR(50),
  vehicle_type         VARCHAR(20) DEFAULT 'car'
                         CHECK (vehicle_type IN ('car','van','suv','other')),
  health_score         INT DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100),
  status               VARCHAR(20) DEFAULT 'available'
                         CHECK (status IN ('available','in-use','maintenance')),
  last_latitude        DECIMAL(10,8),
  last_longitude       DECIMAL(11,8),
  last_location_update TIMESTAMP,
  current_driver_id    INT REFERENCES users(id),
  photo_url            VARCHAR(500),
  notes                TEXT,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW()
);

-- ── INSPECTIONS ──────────────────────────────────────────────
CREATE TABLE inspections (
  id              SERIAL PRIMARY KEY,
  vehicle_id      INT NOT NULL REFERENCES vehicles(id),
  driver_id       INT NOT NULL REFERENCES users(id),
  customer_name   VARCHAR(255) NOT NULL,
  customer_nic    VARCHAR(20)  NOT NULL,
  customer_phone  VARCHAR(20),
  rental_start    DATE NOT NULL,
  rental_end      DATE NOT NULL,
  inspection_type VARCHAR(10) DEFAULT 'pre'
                    CHECK (inspection_type IN ('pre','post')),
  status          VARCHAR(20) DEFAULT 'in_progress'
                    CHECK (status IN ('in_progress','completed','reviewed')),
  overall_notes   TEXT,
  pdf_url         VARCHAR(500),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

-- ── INSPECTION PHOTOS (8 per inspection) ─────────────────────
CREATE TABLE inspection_photos (
  id            SERIAL PRIMARY KEY,
  inspection_id INT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  photo_type    VARCHAR(20) NOT NULL
                  CHECK (photo_type IN
                  ('front','rear','left','right','interior','dashboard','odometer','damage')),
  file_url      VARCHAR(500) NOT NULL,
  file_name     VARCHAR(255),
  captured_at   TIMESTAMP DEFAULT NOW()
);

-- ── DAMAGE DETECTIONS (populated by AI in Sprint 3) ──────────
CREATE TABLE damage_detections (
  id            SERIAL PRIMARY KEY,
  inspection_id INT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  photo_id      INT REFERENCES inspection_photos(id),
  damage_type   VARCHAR(50) NOT NULL,
  severity      VARCHAR(20) NOT NULL CHECK (severity IN ('low','medium','high')),
  confidence    DECIMAL(5,2),
  bbox_json     JSONB,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── DIGITAL SIGNATURES ───────────────────────────────────────
CREATE TABLE digital_signatures (
  id            SERIAL PRIMARY KEY,
  inspection_id INT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  signer_type   VARCHAR(10) NOT NULL CHECK (signer_type IN ('driver','customer')),
  signature_url VARCHAR(500) NOT NULL,
  signed_at     TIMESTAMP DEFAULT NOW()
);

-- ── INSPECTION REVIEWS (manager approvals) ───────────────────
CREATE TABLE inspection_reviews (
  id            SERIAL PRIMARY KEY,
  inspection_id INT NOT NULL REFERENCES inspections(id),
  manager_id    INT NOT NULL REFERENCES users(id),
  review_status VARCHAR(20) DEFAULT 'pending'
                  CHECK (review_status IN ('pending','approved','flagged')),
  notes         TEXT,
  reviewed_at   TIMESTAMP DEFAULT NOW()
);

-- ── GPS LOGS (90-day retention per PDPA 2022) ────────────────
CREATE TABLE gps_logs (
  id          SERIAL PRIMARY KEY,
  driver_id   INT NOT NULL REFERENCES users(id),
  vehicle_id  INT REFERENCES vehicles(id),
  latitude    DECIMAL(10,8) NOT NULL,
  longitude   DECIMAL(11,8) NOT NULL,
  captured_at TIMESTAMP DEFAULT NOW()
);

-- ── NOTIFICATIONS ────────────────────────────────────────────
CREATE TABLE notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(50),
  message    TEXT,
  is_read    BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── INDEXES ──────────────────────────────────────────────────
CREATE INDEX idx_insp_driver  ON inspections(driver_id);
CREATE INDEX idx_insp_vehicle ON inspections(vehicle_id);
CREATE INDEX idx_insp_status  ON inspections(status);
CREATE INDEX idx_photos_insp  ON inspection_photos(inspection_id);
CREATE INDEX idx_veh_status   ON vehicles(status);
CREATE INDEX idx_gps_driver   ON gps_logs(driver_id);
CREATE INDEX idx_gps_time     ON gps_logs(captured_at);
