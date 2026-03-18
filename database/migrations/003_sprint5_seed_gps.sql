-- Sprint 5: Seed GPS data for testing Smart Assignment and Map View
-- Run after 003_sprint5_gps_columns.sql
-- Update vehicles with Sri Lanka GPS coordinates (adjust IDs if your vehicles have different IDs)

UPDATE vehicles SET last_latitude=6.9271,  last_longitude=79.8612, last_location_update=NOW() - INTERVAL '1 hour'  WHERE id=1; -- Colombo
UPDATE vehicles SET last_latitude=7.2906,  last_longitude=80.6337, last_location_update=NOW() - INTERVAL '3 hours' WHERE id=2; -- Kandy
UPDATE vehicles SET last_latitude=6.0535,  last_longitude=80.2210, last_location_update=NOW() - INTERVAL '30 mins' WHERE id=3; -- Galle
UPDATE vehicles SET last_latitude=8.3114,  last_longitude=80.4037, last_location_update=NOW() - INTERVAL '2 hours' WHERE id=4; -- Anuradhapura
UPDATE vehicles SET last_latitude=6.8270,  last_longitude=79.8773, last_location_update=NOW() - INTERVAL '5 hours' WHERE id=5; -- Dehiwala
