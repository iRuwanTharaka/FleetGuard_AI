import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3x3, 
  List, 
  Download,
  MoreVertical,
  Car,
  Calendar,
  Activity,
  X
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { vehicleService } from '@/services/vehicleService';
import { timeAgo } from '@/utils/time';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1758179128122-6079c9cb3e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';

export function FleetManagement() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [vehiclesFromApi, setVehiclesFromApi] = useState<Array<{
    id: number;
    number_plate: string;
    make: string;
    model: string;
    year?: number;
    vehicle_type?: string;
    status: string;
    health_score?: number;
    updated_at?: string;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleService.getAll({ search: searchQuery || undefined, status: statusFilter === 'all' ? undefined : statusFilter })
      .then((data: any) => setVehiclesFromApi(data.vehicles || []))
      .catch(() => setVehiclesFromApi([]))
      .finally(() => setLoading(false));
  }, [searchQuery, statusFilter]);

  const vehicles = vehiclesFromApi.map((v) => ({
    id: String(v.id),
    number_plate: v.number_plate,
    make: v.make,
    model: v.model,
    year: v.year ?? 0,
    type: v.vehicle_type || 'Car',
    status: v.status === 'available' ? 'Available' : v.status === 'in-use' ? 'In-Use' : v.status === 'maintenance' ? 'Maintenance' : v.status,
    health: v.health_score ?? 0,
    lastInspection: v.updated_at ? timeAgo(v.updated_at) : '—',
    image: PLACEHOLDER_IMAGE,
  }));

  // Filter vehicles based on search and filters (search already applied via API; filter by type client-side)
  const filteredVehicles = vehicles.filter(v => {
    const matchesType = typeFilter === 'all' || v.type === typeFilter;
    return matchesType;
  });

  // Get unique statuses and types
  const statuses = ['all', ...Array.from(new Set(vehicles.map(v => v.status)))];
  const types = ['all', ...Array.from(new Set(vehicles.map(v => v.type)))];

  return (
    <div className="min-h-screen relative">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbGVldCUyMG1hbmFnZW1lbnQlMjB0ZWNobm9sb2d5JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2OTUyNTI3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 pb-6">
        {/* Hero Header */}
        <div className="relative -mx-4 sm:-mx-6 -mt-6 mb-8">
          <div className="relative h-40 overflow-hidden">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1729184648234-7650c1484905?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbGVldCUyMG1hbmFnZW1lbnQlMjB0ZWNobm9sb2d5JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2OTUyNTI3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Header"
                className="w-full h-full object-cover scale-110 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-200/60 via-slate-100/80 to-slate-50 dark:from-slate-900/70 dark:via-slate-900/80 dark:to-slate-950"></div>
            </div>
            <div className="relative h-full flex items-center justify-between px-6 sm:px-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Fleet Management</h1>
                <p className="text-slate-700 dark:text-slate-300">Manage all {vehicles.length} vehicles</p>
              </div>
              <Button 
                onClick={() => navigate('/manager/fleet/add')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 dark:text-slate-400" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={`border-slate-300/50 dark:border-white/10 ${viewMode === 'grid' ? 'bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={`border-slate-300/50 dark:border-white/10 ${viewMode === 'list' ? 'bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className={`border-slate-300/50 dark:border-white/10 ${showFilters ? 'bg-slate-200/50 dark:bg-white/10 text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" className="border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="pt-4 border-t border-slate-300/50 dark:border-white/10 space-y-4 animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map((status) => (
                        <Button
                          key={status}
                          variant="outline"
                          size="sm"
                          onClick={() => setStatusFilter(status)}
                          className={`border-slate-300/50 dark:border-white/10 ${
                            statusFilter === status
                              ? 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-300'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-white/5'
                          }`}
                        >
                          {status === 'all' ? 'All Statuses' : status}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Type</label>
                    <div className="flex flex-wrap gap-2">
                      {types.map((type) => (
                        <Button
                          key={type}
                          variant="outline"
                          size="sm"
                          onClick={() => setTypeFilter(type)}
                          className={`border-slate-300/50 dark:border-white/10 ${
                            typeFilter === type
                              ? 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-300'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/30 dark:hover:bg-white/5'
                          }`}
                        >
                          {type === 'all' ? 'All Types' : type}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(statusFilter !== 'all' || typeFilter !== 'all') && (
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
                    {statusFilter !== 'all' && (
                      <span className="px-3 py-1 rounded-lg text-xs bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 flex items-center gap-2">
                        Status: {statusFilter}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-blue-700 dark:hover:text-white" 
                          onClick={() => setStatusFilter('all')}
                        />
                      </span>
                    )}
                    {typeFilter !== 'all' && (
                      <span className="px-3 py-1 rounded-lg text-xs bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 flex items-center gap-2">
                        Type: {typeFilter}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-blue-700 dark:hover:text-white" 
                          onClick={() => setTypeFilter('all')}
                        />
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStatusFilter('all');
                        setTypeFilter('all');
                      }}
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-slate-600 dark:text-slate-400 text-sm">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </div>

        {/* Vehicle Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} delay={index * 50} onClick={() => navigate(`/manager/fleet/${vehicle.id}`)} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Car className="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 text-lg">No vehicles found</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function VehicleCard({ vehicle, delay, onClick }: any) {
  const statusColor = vehicle.status === 'Available' ? 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-300' :
                      vehicle.status === 'In-Use' ? 'bg-slate-200/50 dark:bg-white/10 border-slate-300/50 dark:border-white/20 text-slate-900 dark:text-white' :
                      'bg-slate-300/30 dark:bg-slate-500/20 border-slate-400/50 dark:border-slate-500/30 text-slate-700 dark:text-slate-300';
  
  const healthColor = vehicle.health >= 85 ? 'text-blue-600 dark:text-blue-400' :
                      vehicle.health >= 70 ? 'text-slate-600 dark:text-slate-400' :
                      'text-slate-500';

  return (
    <div 
      className="group relative rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
    >
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <ImageWithFallback
          src={vehicle.image}
          alt={vehicle.id}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Glass Card */}
      <div className="relative p-6 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all duration-300">
        {/* Vehicle Image */}
        <div className="relative h-40 rounded-xl overflow-hidden mb-4 bg-slate-200/30 dark:bg-white/5">
          <ImageWithFallback
            src={vehicle.image}
            alt={vehicle.id}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="bg-white/50 dark:bg-white/10 backdrop-blur-md hover:bg-white/80 dark:hover:bg-white/20">
              <MoreVertical className="h-4 w-4 text-slate-900 dark:text-white" />
            </Button>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 mb-1">Vehicle ID</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{vehicle.number_plate ?? vehicle.id}</h3>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-md border ${statusColor}`}>
              {vehicle.status}
            </span>
          </div>

          <div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
            <p className="text-slate-500 text-xs mt-1">{vehicle.type}</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-300/50 dark:border-white/10">
            <div>
              <p className="text-xs text-slate-500 mb-1">Health Score</p>
              <p className={`text-2xl font-bold ${healthColor}`}>{vehicle.health}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 mb-1">Last Inspection</p>
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">{vehicle.lastInspection}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
