import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { 
  ArrowLeft, 
  Edit, 
  MoreVertical, 
  Car, 
  Calendar, 
  Activity,
  MapPin,
  FileText,
  Wrench
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { vehicleService } from '@/services/vehicleService';
import { inspectionService } from '@/services/inspectionService';
import { timeAgo } from '@/utils/time';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1758179128122-6079c9cb3e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';

export function VehicleDetails() {
  const navigate = useNavigate();
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const id = vehicleId ?? '';

  const [vehicle, setVehicle] = useState<{
    id: string;
    make: string;
    model: string;
    year: number;
    type: string;
    color?: string;
    license: string;
    vin?: string;
    status: string;
    health: number;
    image: string;
  } | null>(null);
  const [inspections, setInspections] = useState<Array<{ date: string; health: number; inspector: string; damages: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      vehicleService.getOne(id),
      inspectionService.getAll({ vehicle_id: id, limit: 10 }),
    ])
      .then(([vData, iData]: any[]) => {
        const v = vData;
        setVehicle({
          id: v.number_plate ?? String(v.id),
          make: v.make,
          model: v.model,
          year: v.year ?? 0,
          type: v.vehicle_type || 'Car',
          color: v.color,
          license: v.number_plate,
          vin: v.vin,
          status: v.status === 'available' ? 'Available' : v.status === 'in-use' ? 'In-Use' : v.status === 'maintenance' ? 'Maintenance' : v.status,
          health: v.health_score ?? 0,
          image: PLACEHOLDER_IMAGE,
        });
        setInspections((iData.inspections || []).map((i: any) => ({
          date: timeAgo(i.created_at),
          health: i.health_score ?? 0,
          inspector: i.driver_name ?? '—',
          damages: 0,
        })));
      })
      .catch(() => setVehicle(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !vehicle) return;
    const apiStatus = newStatus === 'Available' ? 'available' : newStatus === 'In-Use' ? 'in-use' : 'maintenance';
    await vehicleService.updateStatus(id, apiStatus);
    setVehicle((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">Loading vehicle...</p>
      </div>
    );
  }
  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Vehicle not found.</p>
        <Button variant="outline" onClick={() => navigate('/manager/fleet')}>Back to fleet</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
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
            <h1 className="text-3xl font-bold text-white">{vehicle.id}</h1>
            <p className="text-slate-400 mt-1">{vehicle.make} {vehicle.model} {vehicle.year}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate(`/manager/fleet/${vehicleId}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="icon" className="border-white/10 text-white">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Vehicle Image and Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Image */}
          <div className="relative rounded-2xl overflow-hidden h-96">
            <ImageWithFallback
              src={vehicle.image}
              alt={vehicle.id}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          </div>

          {/* Vehicle Information */}
          <GlassCard title="Vehicle Information">
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="Vehicle Number" value={vehicle.id} />
              <InfoItem label="Make" value={vehicle.make} />
              <InfoItem label="Model" value={vehicle.model} />
              <InfoItem label="Year" value={vehicle.year} />
              <InfoItem label="Type" value={vehicle.type} />
              <InfoItem label="Color" value={vehicle.color} />
              <InfoItem label="License Plate" value={vehicle.license} />
              <InfoItem label="VIN" value={vehicle.vin} />
              <InfoItem label="Mileage" value={vehicle.mileage} />
              <InfoItem label="Purchase Date" value={vehicle.purchaseDate} />
            </div>
          </GlassCard>

          {/* Inspection History */}
          <GlassCard title="Inspection History">
            <div className="space-y-3">
              {inspections.map((inspection, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex-1">
                    <p className="font-semibold text-white mb-1">{inspection.date}</p>
                    <p className="text-sm text-slate-400">{inspection.inspector}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">{inspection.health}</p>
                      <p className="text-xs text-slate-500">Health</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-400">{inspection.damages}</p>
                      <p className="text-xs text-slate-500">Damages</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-blue-400">
              View All Inspections
            </Button>
          </GlassCard>
        </div>

        {/* Right Column - Status and Actions */}
        <div className="space-y-6">
          {/* Health Score */}
          <GlassCard>
            <div className="text-center">
              <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-400 text-sm mb-2">Health Score</p>
              <p className="text-5xl font-bold text-green-400 mb-2">{vehicle.health}</p>
              <p className="text-slate-500 text-sm">Excellent Condition</p>
            </div>
          </GlassCard>

          {/* Status */}
          <GlassCard>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-2">Current Status</p>
                <span className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500/20 border border-green-500/30 text-green-300">
                  {vehicle.status}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Maintenance */}
          <GlassCard title="Maintenance">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">Last Service</p>
                  <p className="text-slate-400 text-xs">{vehicle.lastService}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">Next Service</p>
                  <p className="text-slate-400 text-xs">{vehicle.nextService}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>
            <Button variant="outline" className="w-full border-white/10 text-white">
              <FileText className="h-4 w-4 mr-2" />
              View All Reports
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlassCard({ title, children }: any) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10"></div>
      <div className="relative p-6">
        {title && <h2 className="text-xl font-bold text-white mb-6">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: any) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}
