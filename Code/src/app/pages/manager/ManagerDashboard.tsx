import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Car, FileText, AlertTriangle, Activity, ArrowRight, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { dashboardService } from '@/services/dashboardService';
import { timeAgo } from '@/utils/time';

export function ManagerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<{
    fleet: { total: string; available: string; in_use: string; maintenance: string; avg_health: string };
    today_count: number;
    recent_damages: Array<{ damage_type: string; severity: string; number_plate: string; created_at: string }>;
  } | null>(null);
  const [healthDist, setHealthDist] = useState<{ good: string; fair: string; poor: string } | null>(null);
  const [activity, setActivity] = useState<Array<{ date: string; count: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getHealthDist(),
      dashboardService.getActivityChart(),
    ])
      .then(([s, h, a]) => {
        setStats(s);
        setHealthDist(h);
        setActivity(Array.isArray((a as any).activity) ? (a as any).activity : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Animated Background Layers */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
        <div className="absolute inset-0 opacity-10 dark:opacity-30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1688413709025-5f085266935a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBwYXR0ZXJufGVufDF8fHx8MTc2OTQ4MjA0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background pattern"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-slate-500/10 dark:bg-slate-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="space-y-6 pb-6">
        {/* Hero Section with Glassmorphism */}
        <div className="relative h-[400px] -mx-4 sm:-mx-6 -mt-6 overflow-hidden">
          {/* Large Background Image */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1621962225583-94d5bf016eb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWhpY2xlJTIwZmxlZXQlMjBwYXJraW5nJTIwbmlnaHR8ZW58MXx8fHwxNzY5NDk1ODczfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Fleet background"
              className="w-full h-full object-cover scale-110 animate-slow-zoom"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-200/60 via-slate-100/80 to-slate-50 dark:from-slate-900/60 dark:via-slate-900/80 dark:to-slate-900"></div>
          </div>
          
          <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
            <div className="flex items-end gap-6">
              {/* Profile Image with Glass Effect */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border border-slate-300/50 dark:border-white/20 backdrop-blur-md bg-white/50 dark:bg-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-slate-300 dark:group-hover:border-white/40">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1657349229764-4814508f08e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYW4lMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG1hbmFnZXJ8ZW58MXx8fHwxNzY5NTEzODkzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Ravi Perera"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/50 dark:bg-white/10 backdrop-blur-md border border-slate-300/50 dark:border-white/20 text-slate-900 dark:text-white">
                    Fleet Manager
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                  Welcome back, Ravi
                </h1>
                <p className="text-slate-700 dark:text-slate-300 text-lg">
                  Managing {loading ? '…' : (stats?.fleet?.total ?? '0')} vehicles across the fleet
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Glassmorphism Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GlassCard delay={0}>
            <div className="relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10">
                <Car className="w-full h-full" />
              </div>
              <div className="relative">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Total Vehicles</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1 counter-animate">{loading ? '—' : (stats?.fleet?.total ?? '0')}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">+3 this month</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={100}>
            <div className="relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10">
                <Activity className="w-full h-full" />
              </div>
              <div className="relative">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Available Now</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{loading ? '—' : (stats?.fleet?.available ?? '0')}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">68% of fleet</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={200}>
            <div className="relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10">
                <FileText className="w-full h-full" />
              </div>
              <div className="relative">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Inspections</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{loading ? '—' : (stats?.today_count ?? '0')}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Today</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={300}>
            <div className="relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 dark:opacity-10">
                <AlertTriangle className="w-full h-full" />
              </div>
              <div className="relative">
                <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Needs Attention</p>
                <p className="text-4xl font-bold text-slate-900 dark:text-white mb-1">{loading ? '—' : (stats?.fleet?.maintenance ?? '0')}</p>
                <p className="text-xs text-slate-500">Maintenance required</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Fleet Health Distribution */}
        <GlassCard delay={400}>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Fleet Health Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Excellent (80-100)</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{loading ? '—' : (healthDist?.good ?? '0')}</p>
              <p className="text-xs text-slate-500">Good health</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Good (60-79)</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{loading ? '—' : (healthDist?.fair ?? '0')}</p>
              <p className="text-xs text-slate-500">Fair health</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10">
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Needs Service (&lt;60)</p>
              <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">{loading ? '—' : (healthDist?.poor ?? '0')}</p>
              <p className="text-xs text-slate-500">Needs attention</p>
            </div>
          </div>
        </GlassCard>

        {/* Recent Damage Alerts */}
        <GlassCard delay={500}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Damage Alerts</h2>
            <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300" onClick={() => navigate('/manager/inspections')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {(stats?.recent_damages?.length ? stats.recent_damages : [
              { vehicle: 'CAB-4523', issue: 'Dent - Severe', time: '2 hours ago' },
              { vehicle: 'CAB-2891', issue: 'Scratch - Minor', time: '5 hours ago' },
              { vehicle: 'VAN-1234', issue: 'Crack - Moderate', time: '1 day ago' },
            ]).map((alert: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-200/30 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all cursor-pointer">
                <AlertTriangle className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <div className="flex-1">
                  <p className="font-semibold text-slate-900 dark:text-white">{alert.number_plate ?? alert.vehicle}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {alert.damage_type ? `${alert.damage_type} - ${alert.severity}` : alert.issue}
                  </p>
                </div>
                <span className="text-xs text-slate-500">{alert.created_at ? timeAgo(alert.created_at) : alert.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            className="h-16 bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => navigate('/manager/fleet/add')}
          >
            <Car className="mr-2 h-5 w-5" />
            Add New Vehicle
          </Button>
          <Button 
            className="h-16 bg-slate-200/50 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 text-slate-900 dark:text-white border border-slate-300/50 dark:border-white/20" 
            variant="outline"
            onClick={() => navigate('/manager/inspections')}
          >
            <FileText className="mr-2 h-5 w-5" />
            View All Inspections
          </Button>
          <Button 
            className="h-16 bg-slate-200/50 dark:bg-white/10 hover:bg-slate-200/80 dark:hover:bg-white/20 text-slate-900 dark:text-white border border-slate-300/50 dark:border-white/20" 
            variant="outline"
            onClick={() => navigate('/manager/smart-assignment')}
          >
            <TrendingUp className="mr-2 h-5 w-5" />
            Smart Assignment
          </Button>
        </div>
      </div>
    </div>
  );
}

function GlassCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <div 
      className="relative rounded-2xl overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute inset-0 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-300/50 dark:border-white/10"></div>
      <div className="relative p-6">{children}</div>
    </div>
  );
}
