import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Search, Gauge, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useInspection } from '@/contexts/InspectionContext';
import { vehicleService } from '@/services/vehicleService';

type VehicleCard = {
  id: string;
  number: string;
  make: string;
  model: string;
  year: number;
  health: number;
  status: string;
  image: string;
  color: string;
  lastInspection: string;
};

export function VehicleSelection() {
  const navigate = useNavigate();
  const { setVehicle } = useInspection();
  const [vehicles, setVehicles] = useState<VehicleCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    vehicleService
      .getAvailable()
      .then((data) => {
        const mapped: VehicleCard[] = (data.vehicles || []).map((v: { id: number; number_plate: string; make: string; model: string; year: number; health_score: number; photo_url?: string | null; color?: string | null }) => ({
          id: String(v.id),
          number: v.number_plate,
          make: v.make,
          model: v.model,
          year: v.year || 0,
          health: v.health_score ?? 100,
          status: 'Available',
          image: v.photo_url || 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800',
          color: v.color || 'N/A',
          lastInspection: '—',
        }));
        setVehicles(mapped);
      })
      .catch(() => setVehicles([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search.trim()
    ? vehicles.filter(
        (v) =>
          v.number.toLowerCase().includes(search.toLowerCase()) ||
          v.model.toLowerCase().includes(search.toLowerCase())
      )
    : vehicles;

  const handleVehicleSelect = (vehicle: VehicleCard) => {
    setVehicle(vehicle.id, vehicle.number, vehicle.make, vehicle.model, vehicle.year);
    navigate('/driver/inspection/customer-details');
  };

  return (
    <div className="min-h-screen relative">
      {/* Professional Dark Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1651948892934-ef66cc09cf4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJjaGl0ZWN0dXJhbCUyMGRlc2lnbnxlbnwxfHx8fDE3Njk0OTU4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 pb-6">
        {/* Header Section */}
        <div className="relative -mx-4 sm:-mx-6 -mt-6 mb-8">
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1583773192617-ff7374bc5844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhdXRvbW90aXZlJTIwaW5zcGVjdGlvbnxlbnwxfHx8fDE3Njk0OTU4NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Header"
                className="w-full h-full object-cover scale-110 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/80 to-slate-950"></div>
            </div>
            <div className="relative h-full flex flex-col justify-end px-6 sm:px-8 pb-6">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Select Vehicle</h1>
              <p className="text-slate-300">Choose a vehicle to begin inspection</p>
            </div>
          </div>
        </div>

        {/* Search Bar - Glassmorphism */}
        <div className="relative animate-fade-in-up">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"></div>
          <div className="relative flex items-center">
            <Search className="absolute left-5 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search by vehicle number or model..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-14 h-14 bg-transparent border-0 text-white placeholder:text-slate-500 focus-visible:ring-0" 
            />
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-slate-400 text-center py-12">Loading vehicles...</div>
          ) : (
            filtered.map((vehicle, index) => (
            <VehicleGlassCard
              key={vehicle.id}
              vehicle={vehicle}
              onClick={() => handleVehicleSelect(vehicle)}
              delay={index * 100}
            />
          ))
          )}
        </div>

        {/* Info Card */}
        <div className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 animate-fade-in-up overflow-hidden" style={{ animationDelay: '400ms' }}>
          <div className="absolute top-0 right-0 w-48 h-48 opacity-5">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758411897888-3ca658535fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjB0ZWNobm9sb2d5JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2OTQ5NTg3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="info"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-slate-300" />
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Inspection Tips</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ensure the vehicle is in a well-lit area. Capture clear photos from all angles for accurate AI analysis and better inspection results.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VehicleGlassCard({ vehicle, onClick, delay }: any) {
  return (
    <div 
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glassmorphism Container */}
      <div className="relative bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
        <div className="flex flex-col sm:flex-row">
          {/* Vehicle Image Section */}
          <div className="relative h-64 sm:h-auto sm:w-96 bg-slate-800 overflow-hidden">
            <ImageWithFallback
              src={vehicle.image}
              alt={vehicle.model}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/60 sm:to-slate-900/80"></div>
            
            {/* Health Score Badge */}
            <div className="absolute top-4 left-4">
              <div className={`px-4 py-2 rounded-xl backdrop-blur-md font-semibold flex items-center gap-2 ${
                vehicle.health >= 80 ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                vehicle.health >= 60 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                <Gauge className="h-4 w-4" />
                {vehicle.health}%
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 backdrop-blur-md border border-white/20 text-white">
                {vehicle.status}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex-1 p-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{vehicle.number}</h3>
                <p className="text-slate-400">{vehicle.model}</p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Year</span>
                  </div>
                  <p className="text-white font-semibold">{vehicle.year}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full border-2 border-slate-400"></div>
                    <span className="text-xs text-slate-500 uppercase tracking-wide">Color</span>
                  </div>
                  <p className="text-white font-semibold">{vehicle.color}</p>
                </div>
              </div>

              {/* Last Inspection */}
              <div className="flex items-center justify-between py-3 border-t border-white/10">
                <span className="text-sm text-slate-400">Last Inspection</span>
                <span className="text-sm text-white font-medium">{vehicle.lastInspection}</span>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md font-semibold group-hover:border-white/30 transition-all"
              >
                Select & Begin Inspection
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}