/**
 * @module     Admin Frontend
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the Admin/Manager Frontend of FleetGuard AI.
 *              All dashboard and manager pages are developed by Bethmi Jayamila.
 * @date       2026-03-03
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Search, Plus, User, Phone, Mail, Calendar, Star, Car, TrendingUp, Award, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useNavigate } from 'react-router-dom';
import { usersService } from '@/services/usersService';
import { SkeletonLoader } from '@/app/components/common/SkeletonLoader';
import { toast } from 'sonner';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function DriverManagement() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [driversFromApi, setDriversFromApi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = () => {
    usersService.getDrivers()
      .then(setDriversFromApi)
      .catch(() => setDriversFromApi([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleRemoveDriver = async (driverId: string) => {
    if (!window.confirm(t('driverManagement.confirmRemove'))) return;
    try {
      await usersService.deleteDriver(driverId);
      toast.success(t('driverManagement.removeSuccess'));
      fetchDrivers();
    } catch (err: any) {
      toast.error(err.response?.data?.error || t('driverManagement.removeError'));
    }
  };

  const drivers = driversFromApi.map((d) => ({
    id: String(d.id),
    displayId: `DRV-${String(d.id).padStart(4, '0')}`,
    name: d.name || 'Driver',
    phone: d.phone || '—',
    email: d.email || '—',
    status: 'Active',
    vehicle: '—',
    rating: 0,
    totalTrips: parseInt(d.total_inspections) || 0,
    joinDate: d.created_at ? new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—',
    photo: d.avatar_url ? `${API_BASE.replace('/api', '')}${d.avatar_url}` : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
  }));

  const stats = {
    totalDrivers: drivers.length,
    activeDrivers: drivers.length,
    avgRating: drivers.length ? (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1) : '0',
    totalTrips: drivers.reduce((sum, d) => sum + d.totalTrips, 0),
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch = driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         driver.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || driver.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6 pb-6">
        <SkeletonLoader rows={8} height={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('driverManagement.title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t('driverManagement.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/manager/drivers/add')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          {t('driverManagement.addNew')}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('driverManagement.totalDrivers')}
          value={stats.totalDrivers}
          icon={<User className="h-5 w-5" />}
          color="blue"
        />
        <StatCard
          title={t('driverManagement.activeDrivers')}
          value={stats.activeDrivers}
          icon={<TrendingUp className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title={t('driverManagement.avgRating')}
          value={stats.avgRating}
          icon={<Star className="h-5 w-5" />}
          color="yellow"
        />
        <StatCard
          title={t('driverManagement.totalTrips')}
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
                placeholder={t('driverManagement.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <FilterButton
                label={t('driverManagement.all')}
                active={filterStatus === 'all'}
                onClick={() => setFilterStatus('all')}
                count={drivers.length}
              />
              <FilterButton
                label={t('driverManagement.active')}
                active={filterStatus === 'active'}
                onClick={() => setFilterStatus('active')}
                count={drivers.filter(d => d.status === 'Active').length}
              />
              <FilterButton
                label={t('driverManagement.onLeave')}
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
          <DriverCard key={driver.id} driver={driver} onRemove={handleRemoveDriver} />
        ))}
      </div>

      {filteredDrivers.length === 0 && (
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-12 text-center">
            <User className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t('driverManagement.noDrivers')}</h3>
            <p className="text-slate-600 dark:text-slate-400">{t('driverManagement.noDriversSubtitle')}</p>
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

function DriverCard({ driver, onRemove }: { driver: any; onRemove?: (id: string) => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
              <p className="text-sm text-slate-600 dark:text-slate-400">{driver.displayId || driver.id}</p>
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
                <button onClick={() => { navigate(`/manager/drivers/${driver.id}`); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Eye className="h-4 w-4" /> {t('driverManagement.viewDetails')}
                </button>
                <button onClick={() => { navigate(`/manager/drivers/${driver.id}/edit`); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Edit className="h-4 w-4" /> {t('driverManagement.edit')}
                </button>
                <button onClick={() => { onRemove?.(driver.id); setShowMenu(false); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> {t('driverManagement.remove')}
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
            <span className="text-slate-900 dark:text-white">{t('driverManagement.vehicle')}: {driver.vehicle}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-300/50 dark:border-white/10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <p className="text-lg font-bold text-slate-900 dark:text-white">{driver.rating}</p>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{t('driverManagement.rating')}</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">{driver.totalTrips}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{t('driverManagement.trips')}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{driver.joinDate}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">{t('driverManagement.joined')}</p>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => navigate(`/manager/drivers/${driver.id}`)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
        >
          {t('driverManagement.viewProfile')}
        </Button>
      </div>
    </div>
  );
}
