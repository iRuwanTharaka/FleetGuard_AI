import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Camera, Clock, User, MapPin, ArrowRight, TrendingUp, Activity } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';

export function DriverDashboard() {
  const navigate = useNavigate();
  const [lastLocationUpdate, setLastLocationUpdate] = useState('2 mins ago');
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  const handleLocationUpdate = () => {
    setIsUpdatingLocation(true);
    // Simulate GPS location fetch
    setTimeout(() => {
      setLastLocationUpdate('Just now');
      setIsUpdatingLocation(false);
      toast.success('Location updated successfully');
    }, 1000);
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background Layers - Only visible in dark mode */}
      <div className="fixed inset-0 -z-10 dark:block hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1688413709025-5f085266935a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2hub2xvZ3klMjBwYXR0ZXJufGVufDF8fHx8MTc2OTQ4MjA0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Background pattern"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-slate-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
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
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
          </div>
          
          <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
            <div className="flex items-end gap-6">
              {/* Profile Image with Glass Effect */}
              <div className="relative group">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border border-white/20 backdrop-blur-md bg-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-white/40">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1649856092331-7d5f879a4f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBkcml2ZXJ8ZW58MXx8fHwxNzY5NDkyMjMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Kamal Perera"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 backdrop-blur-md border border-white/20 text-gray-900 dark:text-white">
                    DRV-0123
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  Welcome back, Kamal
                </h1>
                <p className="text-gray-700 dark:text-slate-300 text-lg">
                  Ready for today's inspections
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - Glassmorphism Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard delay={0}>
            <div className="relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758411897888-3ca658535fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjB0ZWNobm9sb2d5JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2OTQ5NTg3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Total Inspections</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1 counter-animate">156</p>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% this month</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={100}>
            <div className="relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1583773192617-ff7374bc5844?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBhdXRvbW90aXZlJTIwaW5zcGVjdGlvbnxlbnwxfHx8fDE3Njk0OTU4NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">This Month</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1 counter-animate">23</p>
                <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400 text-xs">
                  <span>7 days remaining</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard delay={200}>
            <div className="relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758369636841-241369c12f3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2ZWhpY2xlJTIwaW50ZXJpb3IlMjBkZXRhaWx8ZW58MXx8fHwxNzY5NDk1ODcxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="icon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative">
                <p className="text-gray-600 dark:text-slate-400 text-sm mb-2">Average Score</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-1 counter-animate">82</p>
                <div className="flex items-center gap-1 text-gray-600 dark:text-slate-400 text-xs">
                  <span>Excellent performance</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Quick Actions - Large Image Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ActionImageCard
            title="Start Inspection"
            subtitle="Begin new check"
            image="https://images.unsplash.com/photo-1767339736233-f4b02c41ee4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwbWVjaGFuaWMlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY5NDk1ODczfDA&ixlib=rb-4.1.0&q=80&w=1080"
            icon={<Camera className="h-5 w-5" />}
            onClick={() => navigate('/driver/select-vehicle')}
            delay={0}
          />
          <ActionImageCard
            title="View History"
            subtitle="Past inspections"
            image="https://images.unsplash.com/photo-1765728617352-895327fcf036?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2OTQ4MDU2MXww&ixlib=rb-4.1.0&q=80&w=1080"
            icon={<Clock className="h-5 w-5" />}
            onClick={() => navigate('/driver/history')}
            delay={100}
          />
          <ActionImageCard
            title="My Profile"
            subtitle="Account settings"
            image="https://images.unsplash.com/photo-1768829781487-a697bc656313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjB1bmlmb3JtfGVufDF8fHx8MTc2OTQ5NTg3NXww&ixlib=rb-4.1.0&q=80&w=1080"
            icon={<User className="h-5 w-5" />}
            onClick={() => navigate('/driver/profile')}
            delay={200}
          />
        </div>

        {/* Recent Inspections - Glassmorphism List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Inspections</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/driver/history')}
              className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            <InspectionGlassCard 
              vehicle="ABC-1234" 
              model="Toyota Premio"
              date="2 hours ago" 
              score={85}
              image="https://images.unsplash.com/photo-1765597119459-2fc27a978af3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb3lvdGElMjBzZWRhbiUyMGNhciUyMHNpbHZlcnxlbnwxfHx8fDE3Njk0OTIyMzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
              delay={0}
            />
            <InspectionGlassCard 
              vehicle="XYZ-5678" 
              model="Honda Civic"
              date="Yesterday" 
              score={92}
              image="https://images.unsplash.com/photo-1666196774536-5b54e29bbded?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIb25kYSUyMHNlZGFuJTIwY2FyJTIwd2hpdGV8ZW58MXx8fHwxNzY5NDkyMjMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              delay={100}
            />
            <InspectionGlassCard 
              vehicle="LMN-9012" 
              model="Toyota Axio"
              date="2 days ago" 
              score={78}
              image="https://images.unsplash.com/photo-1758972687771-6ffd927a3661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBleHRlcmlvciUyMG1vZGVybiUyMGRlc2lnbnxlbnwxfHx8fDE3Njk0OTU4NzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              delay={200}
            />
          </div>
        </div>

        {/* Location Status - Full Width Glassmorphism */}
        <GlassCard delay={300} className="hover:border-gray-300 dark:hover:border-white/30">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-green-600 dark:text-white animate-pulse" />
              <div className="absolute inset-0 rounded-xl bg-green-500/20 animate-ping"></div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">Location Services Active</p>
              <p className="text-sm text-gray-600 dark:text-slate-400">Colombo, Sri Lanka • Updated {lastLocationUpdate}</p>
            </div>
            <Button size="sm" variant="ghost" className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10" onClick={handleLocationUpdate} disabled={isUpdatingLocation}>
              {isUpdatingLocation ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function GlassCard({ children, delay = 0, className = '' }: any) {
  return (
    <div 
      className={`p-6 rounded-2xl bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-xl hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-500 animate-fade-in-up ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ActionImageCard({ title, subtitle, image, icon, onClick, delay }: any) {
  return (
    <div 
      onClick={onClick}
      className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/20"></div>
      </div>
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6">
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-300">{subtitle}</p>
        
        {/* Hover Arrow */}
        <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <ArrowRight className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function InspectionGlassCard({ vehicle, model, date, score, image, delay }: any) {
  return (
    <div 
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-500 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Vehicle Image */}
        <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-slate-800">
          <ImageWithFallback
            src={image}
            alt={vehicle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        
        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-lg">{vehicle}</p>
          <p className="text-sm text-gray-600 dark:text-slate-400">{model}</p>
          <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{date}</p>
        </div>
        
        {/* Score Badge */}
        <div className={`px-4 py-2 rounded-xl backdrop-blur-md font-bold ${
          score >= 80 ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30' :
          score >= 60 ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30' :
          'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
        }`}>
          {score}
        </div>
      </div>
    </div>
  );
}