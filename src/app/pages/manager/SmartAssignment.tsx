/**
 * @module     Admin Frontend
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the Admin/Manager Frontend of FleetGuard AI.
 *              All dashboard and manager pages are developed by Bethmi Jayamila.
 * @date       2026-03-11
 */

import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Sparkles, MapPin, Activity, Star, ArrowRight, Loader2 } from 'lucide-react';
import managerService from '@/services/managerService';
import { SkeletonLoader } from '@/app/components/common/SkeletonLoader';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Lightweight, billing-free fallback for common Sri Lankan cities
// so Smart Assignment still works even without Google Maps billing.
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  colombo: { lat: 6.9271, lng: 79.8612 },
  'colombo fort': { lat: 6.9355, lng: 79.8430 },
  kandy: { lat: 7.2906, lng: 80.6337 },
  galle: { lat: 6.0535, lng: 80.2210 },
  negombo: { lat: 7.2083, lng: 79.8358 },
  matara: { lat: 5.9549, lng: 80.5540 },
};

export function SmartAssignment() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [customerTier, setCustomerTier] = useState<'VIP' | 'Standard' | 'Budget'>('Standard');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupLat, setPickupLat] = useState<number | null>(null);
  const [pickupLng, setPickupLng] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const geocodeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const geocodeAddress = useCallback(
    async (address: string) => {
      if (!address || address.length < 3) return;

      const trimmed = address.trim();
      const lower = trimmed.toLowerCase();

      // Fallback: parse "lat, lng" or "lat lng" when no API key or for quick testing
      const coordMatch = trimmed.match(
        /^(-?\d+\.?\d*)\s*[,]\s*(-?\d+\.?\d*)$|^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/
      );
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1] ?? coordMatch[3]);
        const lng = parseFloat(coordMatch[2] ?? coordMatch[4]);
        if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
          setPickupLat(lat);
          setPickupLng(lng);
          return;
        }
      }

      // Local city lookup (no external API / billing required)
      const cityHit = CITY_COORDS[lower];
      if (cityHit) {
        setPickupLat(cityHit.lat);
        setPickupLng(cityHit.lng);
        return;
      }

      if (!GOOGLE_MAPS_KEY) return;
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address + ', Sri Lanka')}&key=${GOOGLE_MAPS_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results?.[0]) {
          const loc = data.results[0].geometry.location;
          setPickupLat(loc.lat);
          setPickupLng(loc.lng);
        } else {
          setPickupLat(null);
          setPickupLng(null);
        }
      } catch (err) {
        console.error('Geocoding failed:', err);
        setPickupLat(null);
        setPickupLng(null);
      }
    },
    []
  );

  const handleAddressChange = (val: string) => {
    setPickupAddress(val);
    setPickupLat(null);
    setPickupLng(null);
    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    geocodeTimeoutRef.current = setTimeout(() => geocodeAddress(val), 500);
  };

  const handleGetRecommendations = async () => {
    if (!pickupLat || !pickupLng) {
      setError('Please enter a valid pickup location');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await managerService.getSmartAssignmentRecommendations(
        customerTier,
        pickupLat,
        pickupLng
      );
      setRecommendations(data.recommendations || []);
      setSearched(true);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to get recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignVehicle = (vehicleId: number) => {
    navigate(`/manager/fleet/${vehicleId}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-600 dark:text-blue-300 mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">{t('smartAssignment.aiPowered')}</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {t('smartAssignment.title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          {t('smartAssignment.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {t('smartAssignment.getRecommendations')}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="customerTier" className="text-slate-700 dark:text-slate-300">
                  {t('smartAssignment.customerTier')}
                </Label>
                <Select
                  value={customerTier}
                  onValueChange={(v: 'VIP' | 'Standard' | 'Budget') => setCustomerTier(v)}
                >
                  <SelectTrigger className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Budget">Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pickupLocation" className="text-slate-700 dark:text-slate-300">
                  {t('smartAssignment.pickupLocation')}
                </Label>
                <Input
                  id="pickupLocation"
                  placeholder={t('smartAssignment.locationPlaceholder')}
                  value={pickupAddress}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  className="mt-2 bg-slate-200/30 dark:bg-white/5 border-slate-300/50 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-500"
                />
                {pickupLat && pickupLng && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {t('smartAssignment.locationFound')}: {pickupLat.toFixed(4)}, {pickupLng.toFixed(4)}
                  </p>
                )}
              </div>
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
              <Button
                onClick={handleGetRecommendations}
                disabled={loading || !pickupLat}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('smartAssignment.gettingRecommendations')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('smartAssignment.getRecommendations')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {loading ? (
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10" />
              <div className="relative p-6">
                <SkeletonLoader rows={3} height={100} />
              </div>
            </div>
          ) : searched ? (
            recommendations.length > 0 ? (
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
                <div className="relative p-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                    {t('smartAssignment.aiRecommendations')}
                  </h2>
                  <div className="space-y-4">
                    {recommendations.map((rec) => (
                      <RecommendationCard
                        key={rec.vehicle_id}
                        recommendation={rec}
                        onAssign={() => handleAssignVehicle(rec.vehicle_id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
                <div className="relative p-6 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
                  <p className="text-slate-600 dark:text-slate-400">
                    {t('smartAssignment.noVehicles')}
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="relative rounded-2xl overflow-hidden h-full">
              <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
              <div className="relative p-6 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
                <Sparkles className="h-16 w-16 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {t('smartAssignment.readyToFind')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {t('smartAssignment.enterDetails')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({
  recommendation,
  onAssign,
}: {
  recommendation: any;
  onAssign: () => void;
}) {
  const { t } = useTranslation();
  const getBadgeColor = (rank: number) => {
    if (rank === 1) return 'bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-300';
    if (rank === 2) return 'bg-slate-200/50 dark:bg-white/10 border-slate-300/50 dark:border-white/20 text-slate-900 dark:text-white';
    return 'bg-slate-300/30 dark:bg-slate-500/20 border-slate-400/50 dark:border-slate-500/30 text-slate-700 dark:text-slate-300';
  };

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span
              className={`inline-block px-3 py-1 rounded-lg text-xs font-medium border ${getBadgeColor(
                recommendation.rank
              )} mb-2`}
            >
              #{recommendation.rank}{' '}
              {recommendation.rank === 1
                ? t('smartAssignment.bestMatch')
                : recommendation.rank === 2
                ? t('smartAssignment.goodMatch')
                : t('smartAssignment.alternative')}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {recommendation.vehicle_number}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {recommendation.make} {recommendation.model} ({recommendation.year})
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {recommendation.total_score}
            </p>
            <p className="text-xs text-slate-500">{t('smartAssignment.score')}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-slate-500">{t('smartAssignment.health')}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {recommendation.health_score}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-xs text-slate-500">{t('smartAssignment.distance')}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {recommendation.distance_km} km
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">{t('smartAssignment.tier')}</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {recommendation.score_breakdown?.tier_points ?? 0} pts
              </p>
            </div>
          </div>
        </div>

        {recommendation.reasoning?.length > 0 && (
          <ul className="text-xs text-slate-600 dark:text-slate-400 mb-4 space-y-1">
            {recommendation.reasoning.map((r: string, i: number) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        )}

        <Button
          onClick={onAssign}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {t('smartAssignment.assignVehicle')}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
