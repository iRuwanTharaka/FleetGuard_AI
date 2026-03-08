import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { MapPin, Car, Activity, RefreshCw, Filter } from 'lucide-react';

export function MapView() {
  const [filterStatus, setFilterStatus] = useState('all');

  const vehicles = [
    { id: 'CAB-4523', status: 'Available', health: 92, location: 'Colombo Fort', lat: 6.9271, lng: 79.8612 },
    { id: 'CAB-2891', status: 'In-Use', health: 87, location: 'Galle Face', lat: 6.9312, lng: 79.8438 },
    { id: 'CAB-7612', status: 'Available', health: 95, location: 'Mount Lavinia', lat: 6.8293, lng: 79.8636 },
    { id: 'VAN-1234', status: 'Maintenance', health: 68, location: 'Dehiwala', lat: 6.8510, lng: 79.8679 },
  ];

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fleet Map</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time vehicle locations</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="relative rounded-2xl overflow-hidden sticky top-6">
            <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
            <div className="relative p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Filters</h2>
              
              <div className="space-y-3 mb-6">
                <FilterButton
                  label="All Vehicles"
                  count={vehicles.length}
                  active={filterStatus === 'all'}
                  onClick={() => setFilterStatus('all')}
                />
                <FilterButton
                  label="Available"
                  count={vehicles.filter(v => v.status === 'Available').length}
                  active={filterStatus === 'available'}
                  onClick={() => setFilterStatus('available')}
                  color="green"
                />
                <FilterButton
                  label="In-Use"
                  count={vehicles.filter(v => v.status === 'In-Use').length}
                  active={filterStatus === 'in-use'}
                  onClick={() => setFilterStatus('in-use')}
                  color="blue"
                />
                <FilterButton
                  label="Maintenance"
                  count={vehicles.filter(v => v.status === 'Maintenance').length}
                  active={filterStatus === 'maintenance'}
                  onClick={() => setFilterStatus('maintenance')}
                  color="orange"
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-300/50 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">In-Use</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">Maintenance</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-3">
          <div className="relative rounded-2xl overflow-hidden h-[600px]">
            <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
            <div className="relative p-6 h-full">
              {/* Map Placeholder */}
              <div className="w-full h-full bg-slate-300/50 dark:bg-slate-800/50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <p className="text-slate-900 dark:text-white text-lg font-bold mb-2">Interactive Map</p>
                  <p className="text-slate-600 dark:text-slate-400">Map integration with vehicle markers will appear here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="mt-4 space-y-3">
            {vehicles
              .filter(v => filterStatus === 'all' || v.status.toLowerCase().replace('-', '').includes(filterStatus.replace('-', '')))
              .map((vehicle) => (
                <VehicleListItem key={vehicle.id} vehicle={vehicle} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label, count, active, onClick, color = 'slate' }: any) {
  const colors = {
    green: active ? 'bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-300' : 'bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400',
    blue: active ? 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-300' : 'bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400',
    orange: active ? 'bg-orange-500/20 border-orange-500/30 text-orange-600 dark:text-orange-300' : 'bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400',
    slate: active ? 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-300' : 'bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${colors[color as keyof typeof colors]}`}
    >
      <span className="font-medium">{label}</span>
      <span className="text-sm">{count}</span>
    </button>
  );
}

function VehicleListItem({ vehicle }: any) {
  const statusColor = vehicle.status === 'Available' ? 'bg-blue-500' :
                      vehicle.status === 'In-Use' ? 'bg-slate-400 dark:bg-white/50' : 'bg-slate-500';
  
  const healthColor = vehicle.health >= 85 ? 'text-blue-600 dark:text-blue-400' :
                      vehicle.health >= 70 ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500';

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{vehicle.id}</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {vehicle.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${healthColor}`} />
            <span className={`font-bold ${healthColor}`}>{vehicle.health}</span>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">{vehicle.status}</span>
        </div>
      </div>
    </div>
  );
}
