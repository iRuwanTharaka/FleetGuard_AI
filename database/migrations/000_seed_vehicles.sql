-- Seed test vehicles for development (run once)
INSERT INTO vehicles (number_plate, make, model, year, color, health_score, status, last_latitude, last_longitude, last_location_update)
VALUES 
  ('WP-1234', 'Toyota', 'Axio', 2019, 'Silver', 88, 'available', 6.9271, 79.8612, NOW() - INTERVAL '1 hour'),
  ('CP-5678', 'Honda', 'Fit', 2020, 'White', 92, 'available', 7.2906, 80.6337, NOW() - INTERVAL '30 mins'),
  ('SP-9012', 'Nissan', 'Sunny', 2018, 'Black', 78, 'available', 6.0535, 80.2210, NOW() - INTERVAL '2 hours')
ON CONFLICT (number_plate) DO NOTHING;
