/**
 * @module     Admin Frontend
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the Admin/Manager Frontend of FleetGuard AI.
 *              All dashboard and manager pages are developed by Bethmi Jayamila.
 * @date       2026-03-05
 */

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ArrowLeft, Save, Upload, User, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { usersService } from '@/services/usersService';
import { vehicleService } from '@/services/vehicleService';
import { toast } from 'sonner';

export function AddEditDriver() {
  const navigate = useNavigate();
  const { id: driverId } = useParams();
  const isEditing = !!driverId;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicle: '',
    status: 'Active',
  });
  const [vehicles, setVehicles] = useState<{ id: number; number_plate: string; make: string; model: string }[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    vehicleService.getAll({}).then((d: any) => setVehicles(d.vehicles || [])).catch(() => {});
    if (isEditing && driverId) {
      usersService.getDriverById(driverId)
        .then((d: any) => {
          setFormData({
            name: d.name || '',
            phone: d.phone || '',
            email: d.email || '',
            password: '',
            address: '',
            licenseNumber: d.license_number || '',
            licenseExpiry: '',
            vehicle: '',
            status: 'Active',
          });
        })
        .catch(() => setError('Driver not found'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isEditing, driverId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing && driverId) {
        await usersService.updateDriver(driverId, {
          name: formData.name.trim(),
          phone: formData.phone.trim() || undefined,
          license_number: formData.licenseNumber.trim() || undefined,
        });
        toast.success('Driver updated successfully');
      } else {
        if (!formData.password || formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          setSaving(false);
          return;
        }
        await usersService.createDriver({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim() || undefined,
          license_number: formData.licenseNumber.trim() || undefined,
        });
        toast.success('Driver added successfully');
      }
      navigate('/manager/drivers');
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Save failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate('/manager/drivers')}
        className="border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Drivers
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {isEditing ? 'Edit Driver' : 'Add New Driver'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {isEditing ? 'Update driver information' : 'Add a new driver to your fleet'}
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Upload */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Driver Photo</h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-2xl bg-slate-200/50 dark:bg-white/5 border-2 border-dashed border-slate-300/50 dark:border-white/10 flex items-center justify-center">
                <User className="h-12 w-12 text-slate-400" />
              </div>
              <div>
                <Button type="button" variant="outline" className="border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+94 77 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                  required
                  disabled={isEditing}
                />
                {isEditing && <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>}
              </div>
              {!isEditing && (
                <div className="md:col-span-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password * (min 8 characters)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                    required
                    minLength={8}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="address" className="text-slate-700 dark:text-slate-300">Address</Label>
                <Input
                  id="address"
                  placeholder="Colombo 07, Sri Lanka"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">License Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="licenseNumber" className="text-slate-700 dark:text-slate-300">License Number *</Label>
                <Input
                  id="licenseNumber"
                  placeholder="B1234567"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="licenseExpiry" className="text-slate-700 dark:text-slate-300">License Expiry Date</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Assignment Information */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Assignment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="vehicle" className="text-slate-700 dark:text-slate-300">Assigned Vehicle</Label>
                <select
                  id="vehicle"
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.number_plate}>
                      {v.number_plate} - {v.make} {v.model}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="status" className="text-slate-700 dark:text-slate-300">Status *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/manager/drivers')}
            className="border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {isEditing ? 'Update Driver' : 'Add Driver'}
          </Button>
        </div>
      </form>
      )}
    </div>
  );
}
