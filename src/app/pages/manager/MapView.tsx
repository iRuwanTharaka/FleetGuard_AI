/**
 * @module     Admin Frontend
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the Admin/Manager Frontend of FleetGuard AI.
 *              All dashboard and manager pages are developed by Bethmi Jayamila.
 * @date       2026-03-10
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { Button } from '@/app/components/ui/button';
import { MapPin, Car, Activity, RefreshCw } from 'lucide-react';
import managerService from '@/services/managerService';

const MAP_CENTER = { lat: 7.8731, lng: 80.7718 }; // Centre of Sri Lanka
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function getMarkerColor(lastUpdate: string | null): string {
  if (!lastUpdate) return '#94A3B8';
  const hoursAgo = (Date.now() - new Date(lastUpdate).getTime()) / 3600000;
  if (hoursAgo < 6) return '#10B981'; // green — recent
  if (hoursAgo < 24) return '#F59E0B'; // orange — today
  return '#94A3B8'; // gray — old
}

function timeAgo(date: string | null, t: any): string {
  if (!date) return t('time.unknown');
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 60) return `${mins} ${t('time.minutesAgo')}`;
  if (mins < 1440) return `${Math.floor(mins / 60)} ${t('time.hoursAgo')}`;
  return `${Math.floor(mins / 1440)} ${t('time.daysAgo')}`;
}

export function MapView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const [loading, setLoading] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_KEY || '',
  });

  const loadVehicles = useCallback(
    async (f: 'all' | 'today' | 'week') => {
      setLoading(true);
      try {
        const data = await managerService.getVehicleLocations(f);
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadVehicles(filter);
  }, [filter, loadVehicles]);

  const trackedToday = vehicles.filter((v) => {
    if (!v.last_location_update) return false;
    const update = new Date(v.last_location_update);
    const today = new Date();
    return update.toDateString() === today.toDateString();
  }).length;

  if (!GOOGLE_MAPS_KEY) {
    return (
      <div className="space-y-6 pb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t('mapView.title')}
        </h1>
        <div className="rounded-2xl bg-amber-500/20 border border-amber-500/30 p-6 text-amber-700 dark:text-amber-300">
          <p className="font-medium">{t('mapView.apiKeyNotConfigured')}</p>
          <p className="text-sm mt-2">
            {t('mapView.apiKeyInstructions')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {t('mapView.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('mapView.lastKnownLocations')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            {t('mapView.all')}
          </Button>
          <Button
            variant={filter === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('today')}
          >
            {t('mapView.today')}
          </Button>
          <Button
            variant={filter === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('week')}
          >
            {t('mapView.last7Days')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadVehicles(filter)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {t('mapView.refresh')}
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-slate-600 dark:text-slate-400">
          {t('mapView.totalVehicles')}: <strong className="text-slate-900 dark:text-white">{vehicles.length}</strong>
        </span>
        <span className="text-slate-600 dark:text-slate-400">
          {t('mapView.trackedToday')}: <strong className="text-slate-900 dark:text-white">{trackedToday}</strong>
        </span>
      </div>

      {/* Google Map - 50vh on mobile, 500px on sm+ */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 h-[50vh] min-h-[300px] sm:h-[500px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200/20 dark:bg-slate-800/20 z-10">
            <span className="text-slate-500">{t('mapView.loadingMap')}</span>
          </div>
        )}
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={MAP_CENTER}
            zoom={8}
            options={{
              mapTypeControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              zoomControl: true,
            }}
          >
            {vehicles.map((v) => (
              <Marker
                key={v.id}
                position={{
                  lat: parseFloat(v.last_latitude),
                  lng: parseFloat(v.last_longitude),
                }}
                onClick={() => setSelectedVehicle(v)}
                icon={{
                  path: window.google?.maps?.SymbolPath?.CIRCLE ?? 0,
                  scale: 10,
                  fillColor: getMarkerColor(v.last_location_update),
                  fillOpacity: 0.9,
                  strokeColor: 'white',
                  strokeWeight: 2,
                }}
              />
            ))}

            {selectedVehicle && (
              <InfoWindow
                position={{
                  lat: parseFloat(selectedVehicle.last_latitude),
                  lng: parseFloat(selectedVehicle.last_longitude),
                }}
                onCloseClick={() => setSelectedVehicle(null)}
              >
                <div style={{ minWidth: 180 }}>
                  <h3 style={{ fontWeight: 'bold', fontSize: 16 }}>
                    {selectedVehicle.vehicle_number}
                  </h3>
                  <p style={{ fontSize: 13, color: '#64748B' }}>
                    {selectedVehicle.make} {selectedVehicle.model} (
                    {selectedVehicle.year})
                  </p>
                  <p style={{ fontSize: 13 }}>
                    {t('mapView.health')}: <strong>{selectedVehicle.health_score}/100</strong>
                  </p>
                  <p style={{ fontSize: 13 }}>
                    {t('mapView.status')}: <strong>{selectedVehicle.status}</strong>
                  </p>
                  <p style={{ fontSize: 13 }}>
                    {t('mapView.lastSeen')}:{' '}
                    <strong>{timeAgo(selectedVehicle.last_location_update, t)}</strong>
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: '#94A3B8',
                      marginTop: 4,
                    }}
                  >
                    {t('mapView.notRealTime')}
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/manager/fleet/${selectedVehicle.id}`)
                    }
                    style={{
                      marginTop: 8,
                      padding: '4px 10px',
                      background: '#0D9488',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 13,
                    }}
                  >
                    {t('mapView.viewDetails')}
                  </button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div
            className="w-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center"
            style={{ height: 500 }}
          >
            <div className="text-center">
              <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">
                {t('mapView.loadingMap')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle list below map */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t('mapView.vehicleList')}
        </h3>
        {vehicles.length === 0 && !loading ? (
          <p className="text-slate-600 dark:text-slate-400">
            {t('mapView.noVehicles')}
          </p>
        ) : (
          vehicles.map((v) => (
            <VehicleListItem
              key={v.id}
              vehicle={v}
              isSelected={selectedVehicle?.id === v.id}
              onClick={() => setSelectedVehicle(v)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function VehicleListItem({
  vehicle,
  isSelected,
  onClick,
}: {
  vehicle: any;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const statusColor =
    vehicle.status === 'available'
      ? 'bg-green-500'
      : vehicle.status === 'in-use'
      ? 'bg-blue-500'
      : 'bg-slate-500';

  const healthColor =
    vehicle.health_score >= 85
      ? 'text-green-600 dark:text-green-400'
      : vehicle.health_score >= 70
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-red-600 dark:text-red-400';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 bg-blue-500/10'
          : 'bg-white/60 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10'
      } border border-slate-300/50 dark:border-white/10`}
    >
      <div className="relative p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: getMarkerColor(vehicle.last_location_update) }}
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-white">
              {vehicle.vehicle_number}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${healthColor}`} />
            <span className={`font-bold ${healthColor}`}>
              {vehicle.health_score}
            </span>
          </div>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {timeAgo(vehicle.last_location_update, t)}
          </span>
        </div>
      </div>
    </div>
  );
}
