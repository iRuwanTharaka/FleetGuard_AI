/**
 * @module     Admin Frontend
 * @author     Bethmi Jayamila <bethmij@gmail.com>
 * @description This file is part of the Admin/Manager Frontend of FleetGuard AI.
 *              All dashboard and manager pages are developed by Bethmi Jayamila.
 * @date       2026-03-08
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Download, TrendingUp, FileText, Activity, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useTranslation } from 'react-i18next';

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#38bdf8'];

function SkeletonChart() {
  const { t } = useTranslation();
  return (
    <div className="h-[300px] flex items-center justify-center bg-slate-200/20 dark:bg-slate-800/20 rounded-lg animate-pulse">
      <span className="text-slate-500">{t('common.loading')}</span>
    </div>
  );
}

export function AnalyticsDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [days, setDays] = useState(30);
  const { healthTrend, damageTypes, topDamaged, loading, error, refetch } = useAnalytics(days);

  return (
    <div className="min-h-screen relative">
      {/* Professional Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwY2hhcnRzfGVufDF8fHx8MTc2OTQ5MzM4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
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
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwY2hhcnRzfGVufDF8fHx8MTc2OTQ5MzM4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Header"
                className="w-full h-full object-cover scale-110 animate-slow-zoom"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-200/60 via-slate-100/80 to-slate-50 dark:from-slate-900/70 dark:via-slate-900/80 dark:to-slate-950"></div>
            </div>
            <div className="relative h-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 sm:px-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  {t('analytics.fleetHealthTrend')}
                </h1>
                <p className="text-slate-700 dark:text-slate-300">
                  {days === 7 ? t('analytics.last7') : days === 90 ? t('analytics.last90') : t('analytics.last30')}
                </p>
              </div>
              <div className="flex gap-2">
                {[7, 30, 90].map((d) => (
                  <Button
                    key={d}
                    variant={days === d ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDays(d)}
                  >
                    {d === 7 ? t('analytics.last7') : d === 90 ? t('analytics.last90') : t('analytics.last30')}
                  </Button>
                ))}
                <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('analytics.export')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-center justify-between">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              {t('common.retry')}
            </Button>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title={t('analytics.fleetHealthTrend')}>
            {loading ? (
              <SkeletonChart />
            ) : healthTrend.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                {t('common.noData')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="day" stroke="#94a3b8" tickFormatter={(v) => v?.slice(5) || v} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="avg_health" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title={t('analytics.damageByType')}>
            {loading ? (
              <SkeletonChart />
            ) : damageTypes.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                {t('common.noData')}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={damageTypes} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis type="number" stroke="#94a3b8" />
                  <YAxis type="category" dataKey="damage_type" stroke="#94a3b8" width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Top 5 Damaged Vehicles */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
          <div className="relative p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
              {t('analytics.topDamaged')}
            </h2>
            {loading ? (
              <SkeletonChart />
            ) : topDamaged.length === 0 ? (
              <div className="py-12 text-center text-slate-500">{t('common.noData')}</div>
            ) : (
              <div className="space-y-3">
                {topDamaged.map((v, i) => (
                  <div
                    key={v.id}
                    onClick={() => navigate(`/manager/fleet/${v.id}`)}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300">
                        #{i + 1}
                      </span>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">
                          {v.registration_number} — {v.make} {v.model}
                        </p>
                        <p className="text-sm text-slate-500">
                          {v.last_inspection ? new Date(v.last_inspection).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-bold text-slate-600 dark:text-slate-400">
                        {v.total_damages} {t('analytics.damagesCount')}
                      </span>
                      <span
                        className={`font-bold ${
                          v.avg_health >= 80 ? 'text-green-600' : v.avg_health >= 60 ? 'text-amber-600' : 'text-red-600'
                        }`}
                      >
                        {Math.round(v.avg_health)}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, trend, icon }: any) {
  const trendColor = trend === 'up' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500';

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 flex items-center justify-center text-slate-900 dark:text-white">
            {icon}
          </div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{title}</p>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
        <p className={`text-xs ${trendColor}`}>{change} vs last period</p>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: any) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}