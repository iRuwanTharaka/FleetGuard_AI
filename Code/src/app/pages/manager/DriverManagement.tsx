import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Search, Plus, User, Phone, Mail, Calendar, Star, Car, TrendingUp, Award, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';

export function DriverManagement() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const drivers = [
    {
      id: 'DRV-001',
      name: 'Sunil Perera',
      phone: '+94 77 123 4567',
      email: 'sunil@example.com',
      status: 'Active',
      vehicle: 'CAB-4523',
      rating: 4.8,
      totalTrips: 234,
      joinDate: 'Jan 2024',
      photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    },
    {
      id: 'DRV-002',
      name: 'Nimal Silva',
      phone: '+94 77 234 5678',
      email: 'nimal@example.com',
      status: 'Active',
      vehicle: 'CAB-2891',
      rating: 4.6,
      totalTrips: 189,
      joinDate: 'Feb 2024',
      photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    },
    {
      id: 'DRV-003',
      name: 'Priya Fernando',
      phone: '+94 77 345 6789',
      email: 'priya@example.com',
      status: 'Active',
      vehicle: 'VAN-1234',
      rating: 4.9,
      totalTrips: 312,
      joinDate: 'Dec 2023',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      id: 'DRV-004',
      name: 'Kamal Wijesinghe',
      phone: '+94 77 456 7890',
      email: 'kamal@example.com',
      status: 'On Leave',
      vehicle: '-',
      rating: 4.5,
      totalTrips: 156,
      joinDate: 'Mar 2024',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      id: 'DRV-005',
      name: 'Lakshmi Rajapaksa',
      phone: '+94 77 567 8901',
      email: 'lakshmi@example.com',
      status: 'Active',
      vehicle: 'SUV-5678',
      rating: 4.7,
      totalTrips: 201,
      joinDate: 'Jan 2024',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    },
  ];

  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.filter(d => d.status === 'Active').length,
    avgRating: (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1),
    totalTrips: drivers.reduce((sum, d) => sum + d.totalTrips, 0),
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         driver.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Driver Management</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your fleet drivers</p>
        </div>
        <Button onClick={() => navigate('/manager/drivers/add')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Driver
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Drivers"
          value={stats.totalDrivers}
          icon={<User className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title="Active Drivers"
          value={stats.activeDrivers}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Average Rating"
          value={stats.avgRating}
          icon={<Star className="h-5 w-5" />}
          color="yellow"
        />
        <StatCard
          title="Total Trips"
          value={stats.totalTrips}
          icon={<Car className="h-5 w-5" />}
          color="purple"
        />
      </div>

      {/* Filters and Search */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
        <div className="relative p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 dark:text-slate-400" />
              <Input
                placeholder="Search drivers by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <FilterButton
                label="All"
                active={filterStatus === 'all'}
                onClick={() => setFilterStatus('all')}
                count={drivers.length}
              />
              <FilterButton
                label="Active"
                active={filterStatus === 'active'}
                onClick={() => setFilterStatus('active')}
                count={drivers.filter(d => d.status === 'Active').length}
              />
              <FilterButton
                label="On Leave"
                active={filterStatus === 'on leave'}
                onClick={() => setFilterStatus('on leave')}
                count={drivers.filter(d => d.status === 'On Leave').length}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDrivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-12 text-center">
            <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Drivers Found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filters</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
            {icon}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border transition-all ${
        active
          ? 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-300'
          : 'bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-600 dark:text-slate-400'
      }`}
    >
      {label} ({count})
    </button>
  );
}

function DriverCard({ driver }: any) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const statusColor = driver.status === 'Active' 
    ? 'bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-300'
    : 'bg-orange-500/20 border-orange-500/30 text-orange-600 dark:text-orange-300';

  return (
    <div className="relative rounded-2xl overflow-hidden group">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-slate-300/50 dark:border-white/20">
              <ImageWithFallback
                src={driver.photo}
                alt={driver.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{driver.name}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{driver.id}</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-lg bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 w-40 bg-white dark:bg-slate-800 border border-slate-300 dark:border-white/10 rounded-lg shadow-lg z-10">
                <button className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" /> View Details
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${statusColor}`}>
            {driver.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-900 dark:text-white">{driver.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-900 dark:text-white">{driver.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="text-slate-900 dark:text-white">Vehicle: {driver.vehicle}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-300/50 dark:border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">{driver.rating}</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{driver.totalTrips}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Trips</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{driver.joinDate}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Joined</p>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => navigate(`/manager/drivers/${driver.id}`)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
        >
          View Profile
        </Button>
      </div>
    </div>
  );
}
