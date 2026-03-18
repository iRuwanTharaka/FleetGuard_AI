/**
 * @module     Admin Frontend
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the Admin/Manager Frontend of FleetGuard AI.
 *              All dashboard and manager pages are developed by Bethmi Jayamila.
 * @date       2026-03-04
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, Star, Car, TrendingUp, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useNavigate, useParams } from 'react-router-dom';
import { usersService } from '@/services/usersService';
import { SkeletonLoader } from '@/app/components/common/SkeletonLoader';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function DriverDetail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { driverId } = useParams();
  const [driverData, setDriverData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (driverId) {
      usersService.getDriverById(driverId)
        .then(setDriverData)
        .catch(() => setDriverData(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [driverId]);

  const driver = driverData ? {
    id: `DRV-${String(driverData.id).padStart(4, '0')}`,
    name: driverData.name || 'Driver',
    phone: driverData.phone || '—',
    email: driverData.email || '—',
    address: '—',
    status: 'Active',
    vehicle: '—',
    rating: 0,
    totalTrips: parseInt(driverData.total_inspections) || 0,
    joinDate: driverData.created_at ? new Date(driverData.created_at).toLocaleDateString('en-US') : '—',
    licenseNumber: driverData.license_number || '—',
    licenseExpiry: '—',
    photo: driverData.avatar_url ? `${API_BASE.replace('/api', '')}${driverData.avatar_url}` : 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400',
    stats: {
      completedTrips: parseInt(driverData.total_inspections) || 0,
      canceledTrips: 0,
      avgRating: 0,
      totalDistance: '—',
      onTimePercentage: 0,
      earnings: '—',
    },
    recentTrips: [] as any[],
  } : null;

  if (loading) {
    return (
      <div className="space-y-6 pb-6">
        <SkeletonLoader rows={6} height={40} />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="space-y-6 pb-6">
        <Button variant="outline" onClick={() => navigate('/manager/drivers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('driverDetail.backToDrivers')}
        </Button>
        <p className="text-slate-600 dark:text-slate-400">{t('driverDetail.notFound')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate('/manager/drivers')}
        className="border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('driverDetail.backToDrivers')}
      </Button>

      {/* Driver Profile Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
        <div className="relative p-8">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* Photo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-300/50 dark:border-white/20">
                <ImageWithFallback
                  src={driver.photo}
                  alt={driver.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-300">
                      {driver.status}
                    </span>
                    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-300/50 dark:bg-slate-500/20 border border-slate-400/50 dark:border-slate-500/30 text-slate-700 dark:text-slate-300">
                      {driver.id}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{driver.name}</h1>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Phone className="h-4 w-4" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Mail className="h-4 w-4" />
                      <span>{driver.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="h-4 w-4" />
                      <span>{driver.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="h-4 w-4" />
                      <span>{t('driverDetail.joined')} {driver.joinDate}</span>
                    </div>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  {t('driverDetail.editDriver')}
                </Button>
              </div>

              {/* Current Vehicle */}
              <div className="mt-6 p-4 rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Car className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{t('driverDetail.currentVehicle')}</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{driver.vehicle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title={t('driverDetail.completedTrips')} value={driver.stats.completedTrips} icon={<CheckCircle className="h-5 w-5" />} color="green" />
        <StatCard title={t('driverDetail.avgRating')} value={driver.stats.avgRating} icon={<Star className="h-5 w-5" />} color="yellow" />
        <StatCard title={t('driverDetail.onTime')} value={`${driver.stats.onTimePercentage}%`} icon={<TrendingUp className="h-5 w-5" />} color="blue" />
        <StatCard title={t('driverDetail.totalDistance')} value={driver.stats.totalDistance} icon={<MapPin className="h-5 w-5" />} color="purple" />
        <StatCard title={t('driverDetail.totalEarnings')} value={driver.stats.earnings} icon={<Award className="h-5 w-5" />} color="green" />
        <StatCard title={t('driverDetail.canceledTrips')} value={driver.stats.canceledTrips} icon={<AlertCircle className="h-5 w-5" />} color="red" />
      </div>

      {/* License Information */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
        <div className="relative p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('driverDetail.licenseInfo')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow label={t('driverDetail.licenseNumber')} value={driver.licenseNumber} />
            <InfoRow label={t('driverDetail.licenseExpiry')} value={driver.licenseExpiry} />
          </div>
        </div>
      </div>

      {/* Recent Trips */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
        <div className="relative p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t('driverDetail.recentTrips')}</h2>
          <div className="space-y-3">
            {driver.recentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    purple: 'text-purple-600 dark:text-purple-400',
    red: 'text-red-600 dark:text-red-400',
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

function InfoRow({ label, value }: any) {
  return (
    <div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-slate-900 dark:text-white font-medium">{value}</p>
    </div>
  );
}

function TripCard({ trip }: any) {
  const { t } = useTranslation();
  return (
    <div className="p-4 rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{trip.id}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">{trip.date}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900 dark:text-white">{trip.amount}</p>
          <div className="flex items-center gap-1 justify-end mt-1">
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-slate-900 dark:text-white">{trip.rating}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-600 dark:text-slate-400">{t('driverDetail.customer')}:</span>
          <span className="text-slate-900 dark:text-white">{trip.customer}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-3 w-3 text-green-600 dark:text-green-400" />
          <span className="text-slate-900 dark:text-white">{trip.from}</span>
          <span className="text-slate-600 dark:text-slate-400">→</span>
          <MapPin className="h-3 w-3 text-red-600 dark:text-red-400" />
          <span className="text-slate-900 dark:text-white">{trip.to}</span>
        </div>
      </div>
    </div>
  );
}
