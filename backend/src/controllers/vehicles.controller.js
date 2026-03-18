/**
 * @module     Admin Backend
 * @author     Kalindu Tharanga <kalindu.th@gmail.com>
 * @description This file is part of the Admin Backend of FleetGuard AI.
 *              All dashboard and manager views satisfy the Admin Portal.
 * @date       2026-02-27
 */

const Vehicle = require('../models/vehicle.model');

exports.getAll = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const vehicles = await Vehicle.findAll({ status, search, page, limit });
    res.json({ vehicles, page: +page });
  } catch (err) { next(err); }
};

exports.getAvailable = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.findAvailable();
    res.json({ vehicles });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { number_plate, make, model, year, color, vehicle_type } = req.body;
    const vehicle = await Vehicle.create({ number_plate, make, model, year, color, vehicle_type });
    res.status(201).json(vehicle);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const { make, model, year, color, notes } = req.body;
    const vehicle = await Vehicle.update(req.params.id, { make, model, year, color, notes });
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['available','in-use','maintenance'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });
    const updated = await Vehicle.updateStatus(req.params.id, status, req.user?.id);
    if (!updated) return res.status(404).json({ error: 'Vehicle not found' });
    res.json({ message: 'Status updated', ...updated });
  } catch (err) { next(err); }
};
