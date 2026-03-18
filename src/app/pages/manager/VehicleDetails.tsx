/**
 * @module     Admin Frontend
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the Admin/Manager Frontend of FleetGuard AI.
 *              All dashboard and manager pages are developed by Bethmi Jayamila.
 * @date       2026-02-26
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
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
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import managerService from '@/services/managerService';
import { timeAgo } from '@/utils/time';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1758179128122-6079c9cb3e4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';

export function VehicleDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

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
  const [inspections, setInspections] = useState<Array<{ id: number; date: string; health: number; inspector: string; damages: number }>>([]);
  const [healthTrend, setHealthTrend] = useState<Array<{ date: string; health_score: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    managerService
      .getVehicleInspectionHistory(id)
      .then((data: any) => {
        const v = data.vehicle || {};
        setVehicle({
          id: (v.vehicle_number ?? v.number_plate) || String(v.id),
          make: v.make,
          model: v.model,
          year: v.year ?? 0,
          type: v.vehicle_type || 'Car',
          color: v.color,
          license: (v.vehicle_number ?? v.number_plate) || '',
          vin: v.vin,
          status: v.status === 'available' ? 'Available' : v.status === 'in-use' ? 'In-Use' : v.status === 'maintenance' ? 'Maintenance' : v.status || 'Available',
          health: v.health_score ?? 0,
          image: (v.photo_url ? `${(import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '')}${v.photo_url.startsWith('/') ? '' : '/'}${v.photo_url}` : null) || PLACEHOLDER_IMAGE,
        });
        setInspections((data.inspections || []).map((i: any) => ({
          id: i.id,
          date: timeAgo(i.created_at),
          health: i.health_score ?? 0,
          inspector: i.driver_name ?? '—',
          damages: i.damage_count ?? 0,
        })));
        setHealthTrend(data.health_trend || []);
      })
      .catch(() => setVehicle(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id || !vehicle) return;
    const apiStatus = newStatus === 'Available' ? 'available' : newStatus === 'In-Use' ? 'in-use' : 'maintenance';
    await managerService.updateVehicleStatus(id, apiStatus);
    setVehicle((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">{t('vehicleDetails.loading')}</p>
      </div>
    );
  }
  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">{t('vehicleDetails.notFound')}</p>
        <Button variant="outline" onClick={() => navigate('/manager/fleet')}>{t('vehicleDetails.backToFleet')}</Button>
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
            onClick={() => navigate(`/manager/fleet/${id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('vehicleDetails.edit')}
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

          {/* Health Trend Chart */}
          {healthTrend.length > 0 && (
            <GlassCard title={t('vehicleDetails.healthTrend')}>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={healthTrend}>
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Line type="monotone" dataKey="health_score" stroke="#0D9488" strokeWidth={2} dot={{ fill: '#0D9488' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          )}

          {/* Vehicle Information */}
          <GlassCard title={t('vehicleDetails.information')}>
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label={t('vehicleDetails.id')} value={vehicle.id} />
              <InfoItem label={t('vehicleDetails.make')} value={vehicle.make} />
              <InfoItem label={t('vehicleDetails.model')} value={vehicle.model} />
              <InfoItem label={t('vehicleDetails.year')} value={vehicle.year} />
              <InfoItem label={t('vehicleDetails.type')} value={vehicle.type} />
              <InfoItem label={t('vehicleDetails.color')} value={vehicle.color} />
              <InfoItem label={t('vehicleDetails.license')} value={vehicle.license} />
              <InfoItem label={t('vehicleDetails.vin')} value={vehicle.vin} />
              <InfoItem label={t('vehicleDetails.mileage')} value={vehicle.mileage} />
              <InfoItem label={t('vehicleDetails.purchaseDate')} value={vehicle.purchaseDate} />
            </div>
          </GlassCard>

          {/* Inspection History */}
          <GlassCard title={t('vehicleDetails.inspectionHistory')}>
            <div className="space-y-3">
              {inspections.map((inspection) => (
                <div
                  key={inspection.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => navigate(`/manager/inspections/${inspection.id}`)}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white mb-1">{inspection.date}</p>
                    <p className="text-sm text-slate-400">{inspection.inspector}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-400">{inspection.health}</p>
                      <p className="text-xs text-slate-500">{t('vehicleDetails.health')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-400">{inspection.damages}</p>
                      <p className="text-xs text-slate-500">{t('vehicleDetails.damages')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-blue-400">
              {t('vehicleDetails.viewAllInspections')}
            </Button>
          </GlassCard>
        </div>

        {/* Right Column - Status and Actions */}
        <div className="space-y-6">
          {/* Health Score */}
          <GlassCard>
            <div className="text-center">
              <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-slate-400 text-sm mb-2">{t('vehicleDetails.healthScore')}</p>
              <p className="text-5xl font-bold text-green-400 mb-2">{vehicle.health}</p>
              <p className="text-slate-500 text-sm">{t('vehicleDetails.excellentCondition')}</p>
            </div>
          </GlassCard>

          {/* Status */}
          <GlassCard>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-2">{t('vehicleDetails.currentStatus')}</p>
                <div className="flex flex-wrap gap-2">
                  {['Available', 'In-Use', 'Maintenance'].map((s) => (
                    <Button
                      key={s}
                      variant={vehicle.status === s ? 'default' : 'outline'}
                      size="sm"
                      className={vehicle.status === s ? 'bg-green-600 hover:bg-green-700' : 'border-white/10 text-slate-400'}
                      onClick={() => handleStatusChange(s)}
                    >
                      {t(`vehicleDetails.${s === 'Available' ? 'available' : s === 'In-Use' ? 'inUse' : 'maintenance'}`)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Maintenance */}
          <GlassCard title={t('vehicleDetails.maintenance')}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">{t('vehicleDetails.lastService')}</p>
                  <p className="text-slate-400 text-xs">{vehicle.lastService}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">{t('vehicleDetails.nextService')}</p>
                  <p className="text-slate-400 text-xs">{vehicle.nextService}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <MapPin className="h-4 w-4 mr-2" />
              {t('vehicleDetails.viewOnMap')}
            </Button>
            <Button variant="outline" className="w-full border-white/10 text-white">
              <FileText className="h-4 w-4 mr-2" />
              {t('vehicleDetails.viewAllReports')}
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
