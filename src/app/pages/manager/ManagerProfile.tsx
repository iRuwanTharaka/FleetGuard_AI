/**
 * @module     Admin Frontend
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the Admin/Manager Frontend of FleetGuard AI.
 *              All dashboard and manager pages are developed by Bethmi Jayamila.
 * @date       2026-02-20
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Edit, Mail, Phone, Calendar, Shield, TrendingUp, Car, FileText } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import managerService from '@/services/managerService';

export function ManagerProfile() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [stats, setStats] = useState<{ total_vehicles?: number; driver_count?: number; month_inspections?: number; avg_health_score?: number }>({});

  useEffect(() => {
    managerService.getDashboardStats().then(setStats).catch(() => {});
  }, []);

  const manager = {
    name: user?.name || 'Manager',
    email: user?.email || '',
    phone: user?.phone || '',
    role: 'Fleet Manager',
    id: user?.id ? `MGR-${String(user.id).padStart(4, '0')}` : 'MGR-0000',
    joinDate: '—',
    stats: {
      vehiclesManaged: stats.total_vehicles ?? 0,
      activeDrivers: stats.driver_count ?? 0,
      monthInspections: stats.month_inspections ?? 0,
      avgHealth: Math.round(stats.avg_health_score ?? 0),
    },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-6">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-slate-300/50 dark:border-white/20">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1657349229764-4814508f08e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYW4lMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG1hbmFnZXJ8ZW58MXx8fHwxNzY5NTEzODkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt={manager.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300">
                  {manager.role}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-300/50 dark:bg-slate-500/20 border border-slate-400/50 dark:border-slate-500/30 text-slate-700 dark:text-slate-300">
                  {manager.id}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{manager.name}</h1>
              <div className="space-y-1 text-slate-600 dark:text-slate-400">
                <p className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="h-4 w-4" />
                  {manager.email}
                </p>
                <p className="flex items-center gap-2 justify-center sm:justify-start">
                  <Phone className="h-4 w-4" />
                  {manager.phone}
                </p>
                <p className="flex items-center gap-2 justify-center sm:justify-start">
                  <Calendar className="h-4 w-4" />
                  Joined {manager.joinDate}
                </p>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/manager/profile/edit')}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Vehicles Managed"
          value={manager.stats.vehiclesManaged}
          icon={<Car className="h-5 w-5" />}
        />
        <StatCard
          title="Active Drivers"
          value={manager.stats.activeDrivers}
          icon={<Shield className="h-5 w-5" />}
        />
        <StatCard
          title="This Month"
          value={manager.stats.monthInspections}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          title="Avg Health Score"
          value={manager.stats.avgHealth}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Account Information */}
      <div className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
        <div className="relative p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Full Name" value={manager.name} />
            <InfoItem label="Email" value={manager.email} />
            <InfoItem label="Phone" value={manager.phone} />
            <InfoItem label="Role" value={manager.role} />
            <InfoItem label="Manager ID" value={manager.id} />
            <InfoItem label="Join Date" value={manager.joinDate} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button variant="outline" className="border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white">
          <Shield className="h-4 w-4 mr-2" />
          Change Password
        </Button>
        <Button variant="outline" className="border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white">
          <Mail className="h-4 w-4 mr-2" />
          Notification Settings
        </Button>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: any) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white">
            {icon}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: any) {
  return (
    <div>
      <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-slate-900 dark:text-white font-medium">{value}</p>
    </div>
  );
}
