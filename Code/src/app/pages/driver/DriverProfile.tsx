import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
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

export function DriverProfile() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    language: 'en',
    notifications: true,
    locationSharing: true,
  });

  const driver = {
    name: 'Kamal Perera',
    email: 'kamal.perera@kith.lk',
    phone: '+94 77 123 4567',
    driverId: 'DRV-0123',
    dateJoined: new Date(2024, 0, 15),
    totalInspections: 156,
    thisMonthInspections: 23,
    avgHealthScore: 82,
    photoUrl: 'https://images.unsplash.com/photo-1649856092331-7d5f879a4f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTcmklMjBMYW5rYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBkcml2ZXJ8ZW58MXx8fHwxNzY5NDkyMjMyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      toast.success('Logged out successfully');
      navigate('/driver/login');
    }
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setSettings({ ...settings, notifications: checked });
    toast.success(`Notifications ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleLocationToggle = (checked: boolean) => {
    setSettings({ ...settings, locationSharing: checked });
    toast.success(`Location sharing ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleLanguageChange = (language: string) => {
    setSettings({ ...settings, language });
    toast.success('Language changed');
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
            label="Total"
            sublabel="Inspections"
            delay={0}
          />
          <StatCard
            value={driver.thisMonthInspections}
            label="This Month"
            sublabel="Inspections"
            delay={100}
          />
          <StatCard
            value={driver.avgHealthScore}
            label="Avg Score"
            sublabel="Performance"
            delay={200}
          />
        </div>

        {/* Account Information */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          
          <InfoCard
            icon={<User className="h-5 w-5" />}
            label="Full Name"
            value={driver.name}
            delay={0}
          />
          <InfoCard
            icon={<Mail className="h-5 w-5" />}
            label="Email Address"
            value={driver.email}
            delay={100}
          />
          <InfoCard
            icon={<Phone className="h-5 w-5" />}
            label="Phone Number"
            value={driver.phone}
            delay={200}
          />
          <InfoCard
            icon={<Calendar className="h-5 w-5" />}
            label="Date Joined"
            value={driver.dateJoined.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            delay={300}
          />
        </div>

        {/* Settings Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
          
          {/* Language */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-slate-300" />
                </div>
                <Label htmlFor="language" className="text-white">Language</Label>
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
                <Label htmlFor="notifications" className="text-white">Notifications</Label>
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
                <Label htmlFor="location" className="text-white">Location Sharing</Label>
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
          <h3 className="text-lg font-semibold text-white mb-4">Security</h3>
          
          <Button
            variant="outline"
            className="w-full justify-start h-12 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white"
            onClick={() => navigate('/driver/profile/change-password')}
          >
            <Lock className="h-5 w-5 mr-3 text-slate-300" />
            Change Password
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start h-12 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white"
          >
            <Shield className="h-5 w-5 mr-3 text-slate-300" />
            Privacy Policy
          </Button>

          <Button 
            variant="outline" 
            className="w-full justify-start h-12 bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white"
          >
            <FileText className="h-5 w-5 mr-3 text-slate-300" />
            Terms of Service
          </Button>
        </div>

        {/* Logout Button */}
        <Button
          className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 backdrop-blur-md font-semibold"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
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