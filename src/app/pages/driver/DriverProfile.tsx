/**
 * @module     Client Portal (Driver-Facing Interface)
 * @author     Yuraj Malinda <yurajmalinda123@gmail.com>
 * @description This file is part of the Client (Driver) Portal of FleetGuard AI.
 *              All pages and components in this section were developed by Yuraj Malinda.
 * @date       2026-02-22
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { driverService } from '@/services/driverService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Lock,
  Bell,
  MapPin,
  Globe,
  Shield,
  LogOut,
  Camera,
  TrendingUp,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function DriverProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [stats, setStats] = useState<{ total_inspections?: number; month_inspections?: number; avg_health_score?: number }>({});
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    locationSharing: true,
  });

  useEffect(() => {
    driverService.getStats().then(setStats).catch(() => {});
  }, []);

  const driver = {
    name: user?.name || 'Driver',
    email: user?.email || '',
    phone: user?.phone || '',
    driverId: user?.id ? `DRV-${String(user.id).padStart(4, '0')}` : 'DRV-0000',
    dateJoined: new Date(),
    totalInspections: stats.total_inspections ?? 0,
    thisMonthInspections: stats.month_inspections ?? 0,
    avgHealthScore: stats.avg_health_score ?? 0,
    photoUrl: user?.avatar_url ? `${API_BASE.replace('/api', '')}${user.avatar_url}` : 'https://images.unsplash.com/photo-1649856092331-7d5f879a4f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBkcml2ZXJ8ZW58MXx8fHwxNzY5NDkyMjMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const handleLogout = () => {
    if (window.confirm(t('driverProfile.logoutConfirm'))) {
      toast.success(t('driverProfile.logoutSuccess'));
      navigate('/driver/login');
    }
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setSettings({ ...settings, notifications: checked });
    toast.success(`${t('driverProfile.notifications')} ${checked ? t('driverProfile.enabled') : t('driverProfile.disabled')}`);
  };

  const handleLocationToggle = (checked: boolean) => {
    setSettings({ ...settings, locationSharing: checked });
    toast.success(`${t('driverProfile.locationSharing')} ${checked ? t('driverProfile.enabled') : t('driverProfile.disabled')}`);
  };

  const handleLanguageChange = (language: string) => {
    setSettings({ ...settings, language });
    toast.success(t('driverProfile.langChanged'));
  };

  return (
    <div className="min-h-screen relative">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1688413709025-5f085266935a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBwYXR0ZXJufGVufDF8fHx8MTc2OTQ4MjA0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="space-y-6 pb-6">
        {/* Profile Header with Glassmorphism */}
        <div className="relative -mx-4 sm:-mx-6 -mt-6 mb-8">
          <div className="relative h-72 overflow-hidden">
            <div className="absolute inset-0">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1765728617352-895327fcf036?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2OTQ4MDU2MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Profile header"
                className="w-full h-full object-cover scale-110 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-950"></div>
            </div>
            
            <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
              <div className="flex items-end gap-6">
                {/* Profile Photo */}
                <div className="relative group">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/20 backdrop-blur-md bg-white/5">
                    <ImageWithFallback
                      src={driver.photoUrl}
                      alt={driver.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all">
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center animate-pulse">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 pb-2">
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-medium bg-white/10 backdrop-blur-md border border-white/20 text-white mb-3">
                    {driver.driverId}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1 tracking-tight">
                    {driver.name}
                  </h1>
                  <p className="text-slate-300">{driver.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Glassmorphism */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            value={driver.totalInspections}
            label={t('driverProfile.total')}
            sublabel={t('driverProfile.inspections')}
            delay={0}
          />
          <StatCard
            value={driver.thisMonthInspections}
            label={t('driverProfile.thisMonth')}
            sublabel={t('driverProfile.inspections')}
            delay={100}
          />
          <StatCard
            value={driver.avgHealthScore}
            label={t('driverProfile.avgScore')}
            sublabel={t('driverProfile.performance')}
            delay={200}
          />
        </div>

        {/* Account Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4">{t('driverProfile.accountInfo')}</h3>
          
          <InfoCard
            icon={<User className="h-5 w-5" />}
            label={t('driverProfile.fullName')}
            value={driver.name}
            delay={0}
          />
          <InfoCard
            icon={<Mail className="h-5 w-5" />}
            label={t('driverProfile.emailAddress')}
            value={driver.email}
            delay={100}
          />
          <InfoCard
            icon={<Phone className="h-5 w-5" />}
            label={t('driverProfile.phoneNumber')}
            value={driver.phone}
            delay={200}
          />
          <InfoCard
            icon={<Calendar className="h-5 w-5" />}
            label={t('driverProfile.dateJoined')}
            value={driver.dateJoined.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            delay={300}
          />
        </div>

        {/* Settings Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4">{t('driverProfile.settings')}</h3>
          
          {/* Language */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-slate-300" />
                </div>
                <Label htmlFor="language" className="text-white">{t('driverProfile.language')}</Label>
              </div>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="si">Sinhala</SelectItem>
                  <SelectItem value="ta">Tamil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-slate-300" />
                </div>
                <Label htmlFor="notifications" className="text-white">{t('driverProfile.notifications')}</Label>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={handleNotificationsToggle}
              />
            </div>
          </div>

          {/* Location */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-slate-300" />
                </div>
                <Label htmlFor="location" className="text-white">{t('driverProfile.locationSharing')}</Label>
              </div>
              <Switch
                id="location"
                checked={settings.locationSharing}
                onCheckedChange={handleLocationToggle}
              />
            </div>
          </div>
        </div>

         {/* Security Actions */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white mb-4">{t('driverProfile.security')}</h3>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white"
            onClick={() => navigate('/driver/profile/change-password')}
          >
            <Lock className="h-5 w-5 mr-3 text-slate-300" />
            {t('driverProfile.changePassword')}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white"
          >
            <Shield className="h-5 w-5 mr-3 text-slate-300" />
            {t('driverProfile.privacyPolicy')}
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start h-12 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white"
          >
            <FileText className="h-5 w-5 mr-3 text-slate-300" />
            {t('driverProfile.termsOfService')}
          </Button>
        </div>

        {/* Logout Button */}
        <Button
          className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 backdrop-blur-md font-semibold"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          {t('driverProfile.logout')}
        </Button>
      </div>
    </div>
  );
}

function StatCard({ value, label, sublabel, delay }: any) {
  return (
    <div 
      className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 animate-fade-in-up text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
        <TrendingUp className="w-full h-full" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xs text-slate-500">{sublabel}</p>
    </div>
  );
}

function InfoCard({ icon, label, value, delay }: any) {
  return (
    <div 
      className="relative p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className="text-white font-medium truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}