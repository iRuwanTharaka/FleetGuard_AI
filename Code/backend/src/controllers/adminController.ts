import { Request, Response } from 'express';
import { User, UserRole } from '../models/User';
import { Vehicle } from '../models/Vehicle';

// --- DRIVER MANAGEMENT ---

export const getAllDrivers = async (req: Request, res: Response): Promise<any> => {
    try {
        const drivers = await User.findAll({ where: { role: UserRole.DRIVER } });
        res.status(200).json({ status: 'success', data: { drivers: drivers.map(d => d.toJSON()) } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch drivers', error: error.message });
    }
};

export const getDriver = async (req: Request, res: Response): Promise<any> => {
    try {
        const driver = await User.findOne({ where: { id: req.params.id, role: UserRole.DRIVER } });
        if (!driver) return res.status(404).json({ status: 'error', message: 'Driver not found' });
        res.status(200).json({ status: 'success', data: { driver: driver.toJSON() } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch driver', error: error.message });
    }
};

export const createDriver = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password, phone, licenseNumber } = req.body;
        const driver = await User.create({ name, email, password, phone, licenseNumber, role: UserRole.DRIVER });
        res.status(201).json({ status: 'success', data: { driver: driver.toJSON() } });
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: 'Failed to create driver', error: error.message });
    }
};

export const updateDriver = async (req: Request, res: Response): Promise<any> => {
    try {
        const driver = await User.findOne({ where: { id: req.params.id, role: UserRole.DRIVER } });
        if (!driver) return res.status(404).json({ status: 'error', message: 'Driver not found' });

        const { name, email, phone, licenseNumber, isActive, password } = req.body;

        driver.name = name || driver.name;
        driver.email = email || driver.email;
        driver.phone = phone || driver.phone;
        driver.licenseNumber = licenseNumber || driver.licenseNumber;
        if (isActive !== undefined) driver.isActive = isActive;
        if (password) driver.password = password; // Will trigger beforeUpdate hook

        await driver.save();
        res.status(200).json({ status: 'success', data: { driver: driver.toJSON() } });
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: 'Failed to update driver', error: error.message });
    }
};

export const deleteDriver = async (req: Request, res: Response): Promise<any> => {
    try {
        const deleted = await User.destroy({ where: { id: req.params.id, role: UserRole.DRIVER } });
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Driver not found' });
        res.status(204).json({ status: 'success', data: null });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to delete driver', error: error.message });
    }
};

// --- VEHICLE MANAGEMENT ---

export const getAllVehicles = async (req: Request, res: Response): Promise<any> => {
    try {
        const vehicles = await Vehicle.findAll();
        res.status(200).json({ status: 'success', data: { vehicles } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch vehicles', error: error.message });
    }
};

export const getVehicle = async (req: Request, res: Response): Promise<any> => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id as any);
        if (!vehicle) return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
        res.status(200).json({ status: 'success', data: { vehicle } });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to fetch vehicle', error: error.message });
    }
};

export const createVehicle = async (req: Request, res: Response): Promise<any> => {
    try {
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json({ status: 'success', data: { vehicle } });
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: 'Failed to create vehicle', error: error.message });
    }
};

export const updateVehicle = async (req: Request, res: Response): Promise<any> => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id as any);
        if (!vehicle) return res.status(404).json({ status: 'error', message: 'Vehicle not found' });

        await vehicle.update(req.body);
        res.status(200).json({ status: 'success', data: { vehicle } });
    } catch (error: any) {
        res.status(400).json({ status: 'error', message: 'Failed to update vehicle', error: error.message });
    }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<any> => {
    try {
        const deleted = await Vehicle.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Vehicle not found' });
        res.status(204).json({ status: 'success', data: null });
    } catch (error: any) {
        res.status(500).json({ status: 'error', message: 'Failed to delete vehicle', error: error.message });
    }
};
