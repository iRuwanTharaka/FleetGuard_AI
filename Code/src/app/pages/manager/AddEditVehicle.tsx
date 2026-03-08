import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { vehicleService } from '@/services/vehicleService';

export function AddEditVehicle() {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const isEdit = !!vehicleId;

  const [formData, setFormData] = useState({
    vehicleNumber: '',
    make: '',
    model: '',
    year: '',
    type: 'Car',
    color: '',
    license: '',
    vin: '',
    mileage: '',
    notes: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && vehicleId) {
      vehicleService.getOne(vehicleId)
        .then((v: any) => {
          setFormData({
            vehicleNumber: v.number_plate ?? '',
            make: v.make ?? '',
            model: v.model ?? '',
            year: v.year ?? '',
            type: v.vehicle_type || 'Car',
            color: v.color ?? '',
            license: v.number_plate ?? '',
            vin: v.vin ?? '',
            mileage: '',
            notes: v.notes ?? '',
          });
        })
        .catch(() => setError('Vehicle not found'))
        .finally(() => setLoading(false));
    }
  }, [isEdit, vehicleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit && vehicleId) {
        await vehicleService.update(vehicleId, {
          make: formData.make,
          model: formData.model,
          year: formData.year ? Number(formData.year) : undefined,
          color: formData.color || undefined,
          notes: formData.notes || undefined,
        });
      } else {
        await vehicleService.create({
          number_plate: formData.vehicleNumber,
          make: formData.make,
          model: formData.model,
          year: formData.year ? Number(formData.year) : undefined,
          color: formData.color || undefined,
          vehicle_type: formData.type,
        });
      }
      navigate('/manager/fleet');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/manager/fleet')}
            className="border-white/10 text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h1>
            <p className="text-slate-400 mt-1">
              {isEdit ? `Update ${vehicleId} details` : 'Enter vehicle information'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
            <div className="relative p-6">
              <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="vehicleNumber" className="text-slate-300">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    placeholder="CAB-1234"
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="make" className="text-slate-300">Make *</Label>
                  <Input
                    id="make"
                    placeholder="Toyota"
                    value={formData.make}
                    onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="model" className="text-slate-300">Model *</Label>
                  <Input
                    id="model"
                    placeholder="Prius"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="year" className="text-slate-300">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2020"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-slate-300">Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-2 w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                    required
                  >
                    <option value="Car">Car</option>
                    <option value="Van">Van</option>
                    <option value="SUV">SUV</option>
                    <option value="Tuk-Tuk">Tuk-Tuk</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="color" className="text-slate-300">Color</Label>
                  <Input
                    id="color"
                    placeholder="White"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Label htmlFor="license" className="text-slate-300">License Plate</Label>
                  <Input
                    id="license"
                    placeholder="ABC-1234"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Label htmlFor="vin" className="text-slate-300">VIN</Label>
                  <Input
                    id="vin"
                    placeholder="1HGBH41JXMN109186"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <Label htmlFor="mileage" className="text-slate-300">Current Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="45000"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
            <div className="relative p-6">
              <h2 className="text-xl font-bold text-white mb-6">Vehicle Photos</h2>
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-white mb-2">Drag and drop photos here</p>
                <p className="text-slate-400 text-sm mb-4">or click to browse</p>
                <Button type="button" variant="outline" className="border-white/10 text-white">
                  Upload Photos
                </Button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
            <div className="relative p-6">
              <h2 className="text-xl font-bold text-white mb-6">Additional Notes</h2>
              <Textarea
                placeholder="Any additional information about the vehicle..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[120px]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/manager/fleet')}
              className="border-white/10 text-white"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Vehicle'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
