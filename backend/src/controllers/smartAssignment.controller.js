/**
 * @module     Admin Backend
 * @author     Kalindu Tharanga <kalindu.th@gmail.com>
 * @description This file is part of the Admin Backend of FleetGuard AI.
 *              All dashboard and manager views satisfy the Admin Portal.
 * @date       2026-02-18
 */

const pool = require('../config/database');

// Haversine formula — distance in km between two GPS points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

exports.getRecommendations = async (req, res) => {
  const { customerTier, pickupLat, pickupLng } = req.body;

  if (!pickupLat || !pickupLng)
    return res.status(400).json({ error: 'pickupLat and pickupLng are required' });
  if (!['VIP', 'Standard', 'Budget'].includes(customerTier))
    return res
      .status(400)
      .json({ error: 'customerTier must be VIP, Standard, or Budget' });

  try {
    const result = await pool.query(
      `SELECT id, number_plate, make, model, year,
              health_score, status,
              last_latitude, last_longitude
       FROM vehicles
       WHERE status = 'available'
       AND last_latitude IS NOT NULL
       AND last_longitude IS NOT NULL`
    );

    const total_vehicles_checked = result.rows.length;

    if (!total_vehicles_checked)
      return res
        .status(404)
        .json({ error: 'No available vehicles with location data' });

    const scored = result.rows.map((v) => {
      let score = 0;
      const reasoning = [];

      // 1. Health score — max 50 points
      const healthPoints = v.health_score * 0.5;
      score += healthPoints;
      reasoning.push(
        `Health: ${v.health_score}/100 (+${healthPoints.toFixed(0)} pts)`
      );

      // 2. Distance from pickup — max 30 points (closer = more points)
      const distance = calculateDistance(
        pickupLat,
        pickupLng,
        parseFloat(v.last_latitude),
        parseFloat(v.last_longitude)
      );
      const distancePoints = Math.max(0, (1 - distance / 50) * 30);
      score += distancePoints;
      reasoning.push(
        `Distance: ${distance.toFixed(1)}km (+${distancePoints.toFixed(0)} pts)`
      );

      // 3. Customer tier match — max 20 points
      let tierPoints = 0;
      if (customerTier === 'VIP' && v.health_score >= 80) {
        tierPoints = 20;
        reasoning.push('VIP match: Excellent condition (+20 pts)');
      } else if (customerTier === 'Standard' && v.health_score >= 60) {
        tierPoints = 15;
        reasoning.push('Standard match: Good condition (+15 pts)');
      } else {
        tierPoints = 10;
        reasoning.push('Budget friendly (+10 pts)');
      }
      score += tierPoints;

      return {
        vehicle_id: v.id,
        vehicle_number: v.number_plate,
        make: v.make,
        model: v.model,
        year: v.year,
        health_score: v.health_score,
        status: v.status,
        distance_km: parseFloat(distance.toFixed(2)),
        total_score: parseFloat(score.toFixed(1)),
        score_breakdown: {
          health_points: parseFloat(healthPoints.toFixed(1)),
          distance_points: parseFloat(distancePoints.toFixed(1)),
          tier_points: tierPoints,
        },
        reasoning,
      };
    });

    const recommendations = scored
      .sort((a, b) => b.total_score - a.total_score)
      .slice(0, 3)
      .map((v, i) => ({ rank: i + 1, ...v }));

    res.json({
      recommendations,
      total_vehicles_checked,
      vehicles_with_location: total_vehicles_checked,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
