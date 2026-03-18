import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { ArrowLeft, Save, Upload, User } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function AddEditDriver() {
  const navigate = useNavigate();
  const { driverId } = useParams();
  const isEditing = !!driverId;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    vehicle: '',
    status: 'Active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    navigate('/manager/drivers');
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
                />
              </div>
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
                <Label htmlFor="licenseExpiry" className="text-slate-700 dark:text-slate-300">License Expiry Date *</Label>
                <Input
                  id="licenseExpiry"
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
                  required
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
                  <option value="CAB-4523">CAB-4523 - Toyota Prius 2020</option>
                  <option value="CAB-2891">CAB-2891 - Honda Civic 2021</option>
                  <option value="VAN-1234">VAN-1234 - Toyota Hiace 2019</option>
                  <option value="SUV-5678">SUV-5678 - Toyota Land Cruiser 2022</option>
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
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update Driver' : 'Add Driver'}
          </Button>
        </div>
      </form>
    </div>
  );
}
